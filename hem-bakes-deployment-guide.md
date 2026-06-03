# Hem Bakes – Complete Build & Deployment Guide
### Updated: Google Drive → GitHub Actions Automated Gallery

---

## 📁 File Structure: What to Push to GitHub

Push **everything** in the `Hem Bakes` folder. You only need these production files — the original Stitch export folders (`about_us_hem_bakes/`, `home_simplified_ordering_menu_hem_bakes/`, etc.) are source reference only and can be left out if you prefer a clean repo.

```
Hem Bakes/                              ← PUSH EVERYTHING IN HERE
│
├── index.html                          ← Homepage
├── gallery.html                        ← Gallery page
├── about.html                          ← About Us + Contact Form
├── .nojekyll                           ← Required for GitHub Pages (do not delete)
│
├── assets/
│   ├── gallery-data.js                 ← 🔄 AUTO-UPDATED by GitHub Action daily
│   └── gallery/                        ← 🔄 AUTO-FILLED by GitHub Action daily
│       └── (your synced photos go here)
│   └── js/
│       └── main.js                     ← Shared interactivity (nav, arrows, etc.)
│
└── .github/
    └── workflows/
        └── sync-drive.yml              ← ⚙️ The automated Google Drive sync robot

──────────────────────────────────────────────────────────
DO NOT PUSH (leave these in the folder but they won't affect anything):
  about_us_hem_bakes/
  artisanal_editorial/
  gallery_consistent_simplified_hem_bakes/
  home_simplified_ordering_menu_hem_bakes/
──────────────────────────────────────────────────────────
```

> [!NOTE]
> The `assets/gallery/` folder starts empty. After you set up the GitHub Action (Steps 6–7), it will be automatically populated with images from your Google Drive folder.

---

## ⚙️ Step 1 – Install Git (one-time, if not already done)

1. Download **Git for Windows**: https://git-scm.com/download/win  
2. Install it (click through all defaults)
3. Open **PowerShell** and set your name/email once:
```powershell
git config --global user.name  "Your Name"
git config --global user.email "you@email.com"
```

---

## 🐙 Step 2 – Create a GitHub Repository

1. Go to **https://github.com** → log in (or sign up free)
2. Click **＋ New** (top-right)
3. Name it: `hem-bakes`
4. Set to **Public** *(required for free GitHub Pages)*
5. Leave all other options as default → **Create repository**

---

## 🚀 Step 3 – Push Your Files to GitHub

Open **PowerShell** and run these commands one at a time:

```powershell
# Navigate to the project folder
cd "C:\Users\vinur\Documents\Stitch\Hem Bakes"

# Start a Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Hem Bakes production site"

# Connect to GitHub (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/hem-bakes.git

# Set branch name
git branch -M main

# Upload to GitHub
git push -u origin main
```

When prompted for a password, use a **Personal Access Token** (not your GitHub password):  
Go to → GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → tick `repo` → copy it → use it as the password.

---

## 🌐 Step 4 – Enable GitHub Pages

1. In your GitHub repo → click **Settings**
2. Left sidebar → **Pages**
3. Under "Branch" → select **`main`** and **`/ (root)`**
4. Click **Save**

⏱ After ~2 minutes your site is live at:
```
https://YOUR_USERNAME.github.io/hem-bakes/
```

---

## 📬 Step 5 – Connect Your Contact Form (Web3Forms)

1. Go to **https://web3forms.com** → enter your email → **Create Access Key**
2. Copy your key (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
3. Open [about.html](file:///c:/Users/vinur/Documents/Stitch/Hem%20Bakes/about.html)
4. Find this line and replace the action URL:
```html
action="YOUR_WEB3FORMS_OR_FORMSPREE_ENDPOINT_HERE"
```
→ Change to:
```html
action="https://api.web3forms.com/submit"
```
5. Find this line and paste your key:
```html
<input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY_HERE">
```
6. Save → push to GitHub (run `git add . && git commit -m "Add form key" && git push`)

---

## 📸 Step 6 – Set Up the Automated Google Drive Gallery

This is the system that automatically keeps your gallery fresh. You upload photos to Google Drive, and within 24 hours they appear on the site. **You never need to touch code again.**

### 6A — Your Google Drive Folder

Your gallery folder is already created and the link has been set:
```
https://drive.google.com/drive/folders/1PoOctAq1FhN186Q8sGyAe4IGspcekmmY
```

> [!IMPORTANT]
> **Make sure the folder is shared publicly.** Open the link above → click **Share** → change from "Restricted" to **"Anyone with the link"** → permission level: **Viewer** → click **Done**.

The **Folder ID** (already configured in the workflow) is the long string at the end of the URL:
```
1PoOctAq1FhN186Q8sGyAe4IGspcekmmY
```

### 6B — How to Upload New Photos

1. Open your Google Drive folder link
2. Click **＋ New → File upload** (or drag and drop)
3. Upload your JPG, PNG, or WEBP photo
4. Wait for the overnight GitHub Action to run OR trigger it manually (Step 7B)
5. Your photo appears on the live site within ~60 seconds of the Action finishing

**Supported formats:** `.jpg` `.jpeg` `.png` `.webp` `.gif` `.avif`

---

## 🔑 Step 7 – Create a Google API Key & Add it to GitHub

The GitHub Action needs **one credential** to read your Drive folder: a Google API Key. This is free and takes about 5 minutes.

### 7A — Create the Google API Key

> [!IMPORTANT]
> Follow these steps carefully. A wrong API key is the most common reason the sync doesn't work.

**1. Open Google Cloud Console**  
Go to: https://console.cloud.google.com  
Sign in with the same Google account that owns the Drive folder.

**2. Create a project** (if you don't have one)  
Click the project dropdown at the top → **New Project** → name it `Hem Bakes` → **Create**

**3. Enable the Google Drive API**  
- In the top search bar, type `Drive API`
- Click **Google Drive API**
- Click **Enable**

**4. Create an API Key**  
- In the left sidebar → **APIs & Services** → **Credentials**
- Click **+ CREATE CREDENTIALS** → **API key**
- A key is generated (looks like `AIzaSy...`). **Copy it.**

**5. Restrict the key (strongly recommended for security)**  
- Click **Edit API key**
- Under **API restrictions** → select **Restrict key**
- From the dropdown → tick **Google Drive API** → **Save**

### 7B — Add the API Key to Your GitHub Repository

> [!IMPORTANT]
> **Never paste your API key directly into any HTML or JS file** — it will be publicly visible. Always use GitHub Secrets.

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/hem-bakes`
2. Click **Settings** → left sidebar → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Fill in exactly:
   - **Name:** `GOOGLE_API_KEY`
   - **Secret:** *(paste your API key from Step 7A)*
5. Click **Add secret**

That's it. The GitHub Action (`sync-drive.yml`) will now read this secret automatically — you never have to touch it again.

---

## 🎬 Step 7C – Run the Gallery Sync for the First Time

You don't have to wait until midnight. Trigger the sync right now:

1. Go to your GitHub repo → click the **Actions** tab
2. In the left list, click **"Sync Google Drive Gallery"**
3. Click **Run workflow** → **Run workflow** (the green button)
4. Watch the yellow spinner turn green ✅ (takes ~30 seconds)
5. Refresh your live site – the gallery photos now appear!

To run it again any time in the future, repeat steps 1–4.

> [!TIP]
> The action also runs automatically every day at **midnight Sydney time** (2pm UTC). Any new photos you upload to Drive will appear on the site within 24 hours, with zero effort from you.

---

## 🔄 Step 8 – Publishing Future Updates

Any time you edit an HTML file or update content:

```powershell
cd "C:\Users\vinur\Documents\Stitch\Hem Bakes"
git add .
git commit -m "Updated homepage text"
git push
```
The site updates in ~60 seconds.

---

## 🔧 Quick Reference: "Which file do I edit for…"

| What you want to change | File to edit |
|---|---|
| Homepage hero text | `index.html` |
| Gallery page layout | `gallery.html` |
| About Us / brand story | `about.html` |
| Contact form API endpoint | `about.html` (lines ~193–203) |
| Gallery photo list (manual) | `assets/gallery-data.js` |
| Gallery photos (automated) | Upload to Google Drive → trigger Action |
| Nav links, footer | All three `.html` files |
| Drive Folder ID | `.github/workflows/sync-drive.yml` line: `DRIVE_FOLDER_ID:` |
| Brand colours or fonts | `<script id="tailwind-config">` block in each HTML |

---

## ✅ Pre-Launch Checklist

- [ ] All three pages open in browser (open `index.html` → check nav works)
- [ ] "Order Now" button jumps to the enquiry form on About Us
- [ ] Test form submission (sends to your email)
- [ ] At least one photo in Google Drive folder
- [ ] `GOOGLE_API_KEY` secret added to GitHub repo
- [ ] Sync Action triggered manually and completed with ✅ green tick
- [ ] Gallery photos visible on live site
- [ ] Pushed to GitHub and Pages is enabled
- [ ] Tested on mobile phone

---

*Built with Stitch, Tailwind CSS, Vanilla JavaScript, and GitHub Actions.*  
*Fully free to host. Fully automated.*
