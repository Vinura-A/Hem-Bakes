import os
import json
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

# 1. Setup paths and environment variables
FOLDER_ID = os.environ.get('DRIVE_FOLDER_ID')
SERVICE_ACCOUNT_JSON = os.environ.get('GA_SERVICE_ACCOUNT_KEY')
TARGET_DIR = os.path.join('assets', 'gallery')
DATA_FILE = os.path.join('assets', 'gallery-data.js')

# Ensure target directory exists
os.makedirs(TARGET_DIR, exist_ok=True)

# 2. Authenticate with Google
try:
    creds_dict = json.loads(SERVICE_ACCOUNT_JSON)
    creds = service_account.Credentials.from_service_account_info(
        creds_dict, 
        scopes=['https://www.googleapis.com/auth/drive.readonly']
    )
    drive_service = build('drive', 'v3', credentials=creds)
except Exception as e:
    print(f"❌ Authentication failed: {e}")
    exit(1)

# 3. Fetch list of images from the Drive folder
print(f"📂 Listing files in Drive folder: {FOLDER_ID}")
try:
    results = drive_service.files().list(
            q=f"'{FOLDER_ID}' in parents and (mimeType = 'image/jpeg' or mimeType = 'image/png')",
            fields="nextPageToken, files(id, name)"
        ).execute()
    items = results.get('files', [])
except Exception as e:
    print(f"❌ Drive API error: {e}")
    exit(1)

if not items:
    print("Empty folder or no images found.")
    image_list = []
else:
    print(f"Found {len(items)} images. Downloading additions...")
    image_list = []

    # 4. Download files
    for item in items:
        file_id = item['id']
        file_name = item['name']
        save_path = os.path.join(TARGET_DIR, file_name)
        image_list.append(f"assets/gallery/{file_name}")

        if not os.path.exists(save_path):
            print(f"⬇️ Downloading {file_name}...")
            request = drive_service.files().get_media(fileId=file_id)
            fh = io.FileIO(save_path, 'wb')
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while done is False:
                status, done = downloader.next_chunk()
        else:
            print(f"⏭️ {file_name} already exists. Skipping.")

# 5. Automatically regenerate the JavaScript gallery-data file
print("✍️ Updating gallery-data.js...")
js_content = f"const galleryImages = {json.dumps(image_list, indent=2)};\n"
with open(DATA_FILE, 'w') as f:
    f.write(js_content)

print("✅ Sync complete!")