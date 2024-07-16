import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
import pytz
import schedule
import time
import logging
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo import UpdateOne
from bson.objectid import ObjectId

# endpoint to access google sheets api 
scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

# credential to access google api 
try:
    creds = ServiceAccountCredentials.from_json_keyfile_name("/Users/ishakalwani/Desktop/spoticry/secret-key/key.json", scopes=scopes)
    file = gspread.authorize(creds)
    workbook = file.open("spoticry")
    sheet = workbook.sheet1
except Exception as e:
    logging.error(f"Error connecting to Google Sheets: {str(e)}")
    raise


# process data from google sheet 
def process_row(row):
    try:
        if len(row) != 10:
            raise ValueError(f"Row length is {len(row)}, expected 10.")
        
        # parsing timestamp assuming in '%m/%d/%Y %H:%M:%S' format
        timestamp = datetime.strptime(row[0], '%m/%d/%Y %H:%M:%S') if row[0] else None
        
        # parsing date and converting to datetime.datetime
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
    except ValueError as ve:
        logging.error(f"Error processing row: {row}. Value error: {str(ve)}")
        return None
    except Exception as e:
        logging.error(f"Error processing row: {row}. Error: {str(e)}")
        return None


# created an instance of MongoDB client & ste up connection string  
uri = "mongodb+srv://ikalwani:ishika26@spoticry.mty7fkz.mongodb.net/?retryWrites=true&w=majority&appName=SpotiCry"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

def save_to_mongodb(entry):
    try:
        db = client["spoticry"]
        users_collection = db["users"]
        
        email = entry['email']
        del entry['email']
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
            print(f"Created new user with id: {result.upserted_id}")
        else:
            print(f"Added entry to existing user with email: {email}")
        return True
    except Exception as e:
        logging.error(f"Error saving to MongoDB: {str(e)}")
        return False

def main():
    try:
        # get all data
        data = sheet.get_all_values()
        headers = data.pop(0)
        # print(data);
        
        new_entries = 0
        for row in data:
            entry = process_row(row)
            if entry and save_to_mongodb(entry):
                new_entries += 1
        
        logging.info(f"Processed {len(data)} rows. Added {new_entries} new entries.")
            
        
    except Exception as e:
        logging.error(f"An error occurred in the main process: {str(e)}")
    
if __name__ == "__main__":
    main()  
    
    # schedule sript for every one hour (testing stage - every minute)
    schedule.every().minute.do(main)
    while True:
        schedule.run_pending()
        time.sleep(1)