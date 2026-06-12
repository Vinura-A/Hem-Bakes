import csv
import json
import urllib.request
import os

SHEET_ID = "1Y5igPDZeaIJnfwzF4WX0flAksBu0Qo3QqjV_imhtLUE"
URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv"

def fetch_testimonials():
    try:
        response = urllib.request.urlopen(URL)
        lines = [l.decode('utf-8') for l in response.readlines()]
        reader = csv.DictReader(lines)
        
        testimonials = []
        for row in reader:
            # Expected columns: Display Order, Name, Feedback, Date
            try:
                order = int(row.get('Display Order', 999))
            except ValueError:
                order = 999
                
            name = row.get('Customer Name', '').strip()
            feedback = row.get('Feedback', '').strip()
            date = row.get('Date', '').strip()
            
            if name and feedback:
                testimonials.append({
                    'order': order,
                    'name': name,
                    'feedback': feedback,
                    'date': date
                })
                
        # Sort by Display Order
        testimonials.sort(key=lambda x: x['order'])
        
        # Write to assets/feedback-data.js
        output_path = os.path.join("assets", "feedback-data.js")
        os.makedirs("assets", exist_ok=True)
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("/**\n * feedback-data.js – Hem Bakes Testimonials Sync\n * Auto-generated from Google Sheets\n */\n\n")
            f.write(f"const TESTIMONIALS = {json.dumps(testimonials, indent=2)};\n")
            
        print(f"Successfully synced {len(testimonials)} testimonials.")
    except Exception as e:
        print(f"Error syncing testimonials: {e}")

if __name__ == "__main__":
    # Ensure we run from the project root
    if not os.path.exists("assets"):
        os.chdir(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    fetch_testimonials()
