/**
 * =============================================================================
 *  gallery-feed.js  –  Facebook / Social Photo Feed Integration
 * =============================================================================
 *
 *  This file handles the live photo feed on:
 *    • Homepage → Rolling Gallery Slideshow  (#gallery-strip)
 *    • Gallery Page → Social feed widget section (#social-feed-container)
 *
 *  TARGET FACEBOOK PAGE:
 *    www.facebook.com/hembakes/photos
 *
 * =============================================================================
 *  CHOOSE YOUR INTEGRATION METHOD (read all options before deciding):
 * =============================================================================
 *
 *  ╔══════════════════════════════════════════════════════════════════════════╗
 *  ║  OPTION 1 — RECOMMENDED FOR NON-CODERS: Elfsight Widget (Free tier)    ║
 *  ╚══════════════════════════════════════════════════════════════════════════╝
 *    Elfsight.com creates a ready-made Facebook feed widget you just paste in.
 *
 *    Steps:
 *      a) Go to https://elfsight.com/facebook-feed-widget/
 *      b) Sign up (free plan allows 1 widget, 200 views/month)
 *      c) Click "Create Widget", connect your Facebook page
 *      d) Copy the two-line embed code they give you
 *      e) Open gallery.html → find <div id="social-feed-container">
 *      f) PASTE the embed code inside that div, replacing the placeholder comment
 *      g) DONE – the feed will appear live on the gallery page
 *
 *    Your embed code will look something like:
 *      <script src="https://static.elfsight.com/platform/platform.js" async></script>
 *      <div class="elfsight-app-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"></div>
 *
 *  ╔══════════════════════════════════════════════════════════════════════════╗
 *  ║  OPTION 2 — Juicer.io Widget (Free tier – aggregates social feeds)     ║
 *  ╚══════════════════════════════════════════════════════════════════════════╝
 *    Steps:
 *      a) Go to https://www.juicer.io and create a free account
 *      b) Add your Facebook page as a source feed
 *      c) Note your "Feed ID" (shown in the dashboard)
 *      d) In gallery.html, paste inside <div id="social-feed-container">:
 *
 *           <div class="juicer-feed" data-feed-id="YOUR_JUICER_FEED_ID"></div>
 *           <script src="https://assets.juicer.io/embed.js" async></script>
 *
 *  ╔══════════════════════════════════════════════════════════════════════════╗
 *  ║  OPTION 3 — ADVANCED: Facebook Graph API (for developers)              ║
 *  ╚══════════════════════════════════════════════════════════════════════════╝
 *    This method fetches photos directly from Facebook's official API.
 *    It requires a Facebook Developer account and a Page Access Token.
 *
 *    NOTE: GitHub Pages is a static host — it does NOT have a server-side
 *    proxy. If you store your token here it will be publicly visible in the
 *    browser source code. For production use, consider a free Cloudflare
 *    Worker or a Netlify Function to proxy the API call securely.
 *    For a personal/small-business site, this is generally acceptable.
 *
 *    SETUP STEPS:
 *      a) Go to https://developers.facebook.com/ and create a Developer account
 *      b) Create a new App → Business type
 *      c) Add the "Facebook Login" product to your app
 *      d) Go to Graph API Explorer: https://developers.facebook.com/tools/explorer/
 *      e) Request the permission: pages_read_engagement
 *      f) Generate a Page Access Token for your Hem Bakes page
 *         (for a long-lived token, exchange it via the Token Debugger)
 *      g) Find your Facebook Page ID (visible in the About section of your page,
 *         or use the Graph API Explorer: /<your-page-name>?fields=id)
 *      h) Paste your values in the two config lines below marked ⬇
 *
 * =============================================================================
 */

/* ── OPTION 3 CONFIGURATION ──────────────────────────────────────────────────
   Only relevant if you are using the Facebook Graph API approach.
   Leave as-is if you chose Option 1 or 2.
   ─────────────────────────────────────────────────────────────────────────── */

// ⬇ PASTE YOUR FACEBOOK PAGE ID HERE (numbers only, e.g. "123456789012345")
const FB_PAGE_ID = "YOUR_FACEBOOK_PAGE_ID_HERE";

// ⬇ PASTE YOUR FACEBOOK PAGE ACCESS TOKEN HERE
//   (from Graph API Explorer → Generate Access Token)
const FB_ACCESS_TOKEN = "YOUR_FACEBOOK_PAGE_ACCESS_TOKEN_HERE";

// ⬇ Number of photos to load into the homepage slideshow strip
const SLIDESHOW_PHOTO_COUNT = 8;

/* ── END OF CONFIGURATION ─────────────────────────────────────────────────── */


/**
 * Fetches the most recent photos from the Facebook Graph API and injects
 * them into the homepage rolling gallery (#gallery-strip).
 *
 * This function only runs if BOTH FB_PAGE_ID and FB_ACCESS_TOKEN have been
 * filled in above. Otherwise it exits silently, leaving the static
 * placeholder images in the HTML intact.
 */
async function loadFacebookGallery() {
  // Guard: do nothing if the config placeholders have not been replaced
  if (
    FB_PAGE_ID    === "YOUR_FACEBOOK_PAGE_ID_HERE"  ||
    FB_ACCESS_TOKEN === "YOUR_FACEBOOK_PAGE_ACCESS_TOKEN_HERE"
  ) {
    console.info(
      '[Hem Bakes Gallery] Facebook feed not configured. ' +
      'Edit gallery-feed.js to add your Page ID and Access Token.'
    );
    return;
  }

  const strip = document.getElementById('gallery-strip');
  if (!strip) return; // Not on the homepage – exit

  const apiUrl =
    `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/photos` +
    `?fields=images&limit=${SLIDESHOW_PHOTO_COUNT}` +
    `&access_token=${FB_ACCESS_TOKEN}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Facebook API error: ${response.status}`);

    const json = await response.json();
    if (!json.data || json.data.length === 0) return;

    // Clear the static placeholder images
    strip.innerHTML = '';

    // Build a new card for each photo returned by the API
    json.data.forEach(function (photo, index) {
      // Facebook returns multiple image sizes – pick the largest one
      const sizes    = photo.images || [];
      const largest  = sizes.reduce((a, b) => (a.width > b.width ? a : b), sizes[0]);
      if (!largest) return;

      const card = document.createElement('div');
      card.className = 'flex-shrink-0 w-72 md:w-80 aspect-[4/5] rounded-3xl overflow-hidden bg-surface-variant';

      const img = document.createElement('img');
      img.src   = largest.source;
      img.alt   = `Hem Bakes creation ${index + 1}`;
      img.className = 'w-full h-full object-cover hover:scale-105 transition-transform duration-700';

      card.appendChild(img);
      strip.appendChild(card);
    });

    console.info(`[Hem Bakes Gallery] Loaded ${json.data.length} photos from Facebook.`);

  } catch (error) {
    // If the API call fails (e.g. token expired), the static placeholder
    // images remain visible – graceful degradation.
    console.warn('[Hem Bakes Gallery] Could not load Facebook photos:', error.message);
  }
}

/* ── Run the loader when the page finishes loading ─────────────────────────── */
document.addEventListener('DOMContentLoaded', loadFacebookGallery);
