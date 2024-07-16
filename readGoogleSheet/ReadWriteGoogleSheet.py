import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
import pytz

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
        return {
            'date': datetime.strptime(row[0], '%Y-%m-%d').date(),
            'intensity': int(row[1]),
            'trigger': row[2],
            'location': row[3],
            'social_context': row[4],
            'duration': row[5],
            'physical_symptoms': row[6].split(', '),
            'self_care': row[7],
            'timestamp': datetime.now(pytz.utc)
        }
    except Exception as e:
        logging.error(f"Error processing row: {row}. Error: {str(e)}")
        return None

    
def main():
    try:
        # get all data
        data = sheet.get_all_values()
        headers = data.pop(0)
        # print(data);
        
        # new_entries = 0
        # for row in data:
        #     entry = process_row(row)
        #     if entry and save_to_mongodb(entry):
        #         new_entries += 1
        
        # logging.info(f"Processed {len(data)} rows. Added {new_entries} new entries.")
        
        # # Perform analysis
        # analysis = analyze_data()
        # if analysis:
        #     logging.info(f"Analysis results: {analysis}")
        
    except Exception as e:
        logging.error(f"An error occurred in the main process: {str(e)}")

if __name__ == "__main__":
    main()