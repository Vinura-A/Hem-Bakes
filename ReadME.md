1. **The Trigger:** The repository wakes up automatically every day at midnight Sydney time (2 PM UTC), or whenever you click **Run workflow** manually under the GitHub Actions tab.
2. **The Worker (`sync_drive.py`):** A virtual machine spins up, authenticates with Google Cloud using a secure Service Account Key, and checks your shared Google Drive folder.
3. **The Sync:** It downloads any new `.jpg` or `.png` files directly into `assets/gallery/`.
4. **The Database Compilation:** It automatically rewrites `assets/gallery-data.js` with the updated image list and commits the changes back to GitHub, instantly refreshing the live portfolio.

---

## 🛠️ The 3 Quick Actions Required Before Handover

Before officially launching the site out in the wild, ensure these three configurations are updated with your production details:

### 1. Link the Contact Form
1. Sign up for a free access key at [web3forms.com](https://web3forms.com).
2. Open `about.html` in your text editor.
3. Find the hidden input field placeholder: `YOUR_WEB3FORMS_ACCESS_KEY_HERE`.
4. Paste your genuine access key into the `value` attribute and save.

### 2. Embed the Facebook Gallery Feed
1. Sign up for a free widget account at [Elfsight.com](https://elfsight.com) or [Juicer.io](https://juicer.io).
2. Connect the widget to the official **facebook.com/hembakes** business page.
3. Open `gallery.html` and look for the placeholder element: `<div id="facebook-feed">`.
4. Paste the 2-line embed script provided by the widget platform inside that block.

> 🔑 **Handover Tip:** To keep the account in the owner's possession long-term, have the business owner create their own free Elfsight profile, build the widget on their screen, and send you the 2-line code snippet to paste.

### 3. Change Your Masonry Column View (v0 Updates)
If you ever need to adjust the visual flow of the image grid so short images don't leave empty vertical spaces, apply this CSS configuration to your main stylesheet to activate tight column-stacking:

```css
.gallery-container {
  column-count: 3;       /* Sets up 3 dynamic columns */
  column-gap: 1.5rem;    /* Uniform horizontal spacing */
}

.gallery-item {
  break-inside: avoid;   /* Prevents images from splitting across columns */
  margin-bottom: 1.5rem; /* Uniform vertical spacing */
}