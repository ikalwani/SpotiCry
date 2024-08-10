from http.server import BaseHTTPRequestHandler
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
import pytz
import logging
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo import UpdateOne
from bson.objectid import ObjectId
import os
import json

logging.basicConfig(level=logging.INFO)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        
        result = main()
        self.wfile.write(result.encode())
        return

def process_row(row):
    try:
        if len(row) != 10:
            raise ValueError(f"Row length is {len(row)}, expected 10.")
        
        timestamp = datetime.strptime(row[0], '%m/%d/%Y %H:%M:%S') if row[0] else None
        date = datetime.strptime(row[2], '%m/%d/%Y').date() if row[2] else None
        if date:
            date = datetime.combine(date, datetime.min.time()) 
        intensity = int(row[3]) if row[3].strip() else None
        trigger = row[4].split(', ') if row[4].strip() else []
        location = row[5].strip() if row[5] else None
        social_context = row[6].strip() if row[6] else None
        duration = row[7].strip() if row[7] else None
        physical_symptoms = row[8].split(', ') if row[8] else []
        self_care = row[9].strip() if row[9] else None
        email = row[1].strip() if row[1] else None
        
        return {
            'timestamp': timestamp,
            'date': date,
            'intensity': intensity,
            'trigger': trigger,
            'location': location,
            'social_context': social_context,
            'duration': duration,
            'physical_symptoms': physical_symptoms,
            'self_care': self_care,
            'email': email
        }
    except Exception as e:
        logging.error(f"Error processing row: {row}. Error: {str(e)}")
        return None

def save_to_mongodb(entry, client):
    try:
        db = client["spoticry"]
        users_collection = db["users"]
        
        email = entry['email']
        del entry['email']
        entry_id = {"timestamp": entry['timestamp'], "date": entry['date'], "intensity": entry['intensity'], "trigger": entry['trigger'], "location": entry['location']}
        
        existing_entry = users_collection.find_one({"email": email, "entries": {"$elemMatch": entry_id}})
        
        if not existing_entry:
            entry['_id'] = ObjectId()
            result = users_collection.update_one(
                {"email": email},
                {
                    "$setOnInsert": {"email": email},
                    "$push": {"entries": entry}
                },
                upsert=True
            )
            if result.upserted_id:
                logging.info(f"Created new user with id: {result.upserted_id}")
            else:
                logging.info(f"Added entry to existing user with email: {email}")
            return True
        else:
            logging.info(f"Duplicate entry found for user with email: {email}")
            return False
    except Exception as e:
        logging.error(f"Error saving to MongoDB: {str(e)}")
        return False

def main():
    try:
        # Google Sheets setup
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        creds_json = json.loads(os.environ.get("/Users/ishakalwani/Desktop/spoticry/secret-key/key.json", scopes=scopes))
        creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_json, scopes=scopes)
        file = gspread.authorize(creds)
        workbook = file.open("spoticry")
        sheet = workbook.sheet1

        uri = os.environ.get('mongodb+srv://ikalwani:ishika26@spoticry.mty7fkz.mongodb.net/?retryWrites=true&w=majority&appName=SpotiCry')
        client = MongoClient(uri, server_api=ServerApi('1'))

        data = sheet.get_all_values()
        headers = data.pop(0)
        
        new_entries = 0
        for row in data:
            entry = process_row(row)
            if entry and save_to_mongodb(entry, client):
                new_entries += 1
        
        result = f"Processed {len(data)} rows. Added {new_entries} new entries."
        logging.info(result)
        return result
    except Exception as e:
        error_message = f"An error occurred in the main process: {str(e)}"
        logging.error(error_message)
        return error_message

if __name__ == "__main__":
    main()