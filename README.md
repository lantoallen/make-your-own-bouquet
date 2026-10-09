# Make Your Own Bouquet

Build a digital bouquet, tuck in a letter, and send it as a link, QR code or email.

## Features

- **Bouquet builder**: pick up to 40 stems, then drag, resize, rotate and layer them. Flower meanings show as you select.
- **Wrapping**: paper wrap, vase, basket, easel or ribbon only. Choose wrap patterns, ribbon styles and backdrops, or upload your own backdrop photo.
- **Letter**: To/From, message, photo, envelope color, paper styles, 16 fonts, text styling (size, spacing, alignment, bold/italic/underline, ink color), a song or video link, a voice note and an optional flower meanings card.
- **Sharing**: gift link, styled QR code (download as an image) and "Send by email" through your own mail app.
- **Gift options**: unlock date, optional password (stored as a SHA-256 hash), soft music and an opening animation.
- **Receiver side**: opening animation, plus replies and "opened" tracking that the sender can see under *Sent gifts*.
- **Local extras**: drafts, profile name, sent-gift history, dark mode and PNG export, all kept in the browser's `localStorage`.

## Tech stack

| Part | What it uses |
| --- | --- |
| Frontend | Plain HTML, CSS and JavaScript. No framework and no build step. |
| Backend | [Supabase](https://supabase.com), called directly through its REST API (PostgREST) |
| Libraries (CDN) | [html2canvas](https://html2canvas.hertzen.com/) for PNG export, [qrcodejs](https://github.com/davidshimjs/qrcodejs) for QR codes, Google Fonts |

## Project structure

```
index.html    Page markup and every panel of the editor
style.css     All styles, including paper, font and theme variables
app.js        App logic: editor, rendering, sharing, gift opening, replies
config.js     Supabase URL and publishable key
supabase.sql  Database tables and row-level security policies
favicon.svg   App icon
```

## Running locally

There is nothing to install. Serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

Opening `index.html` straight from disk (`file://`) mostly works too, but microphone recording and some browser APIs need `http://localhost` or HTTPS.

## Backend setup (Supabase)

1. Create a Supabase project.
2. Open **SQL Editor** and run [`supabase.sql`](supabase.sql). It creates:
   - `gifts`: `id` (text) plus `data` (jsonb), which holds the whole bouquet and letter
   - `replies`: receiver replies and "opened" events for each gift
   - Row-level security policies that let anonymous users insert and read rows
3. Put your project URL and **publishable (anon)** key in `config.js`:

   ```js
   const SB = { url: 'https://YOUR-PROJECT.supabase.co', key: 'YOUR_PUBLISHABLE_KEY' };
   ```

   A trailing `/` or `/rest/v1/` on the URL is stripped automatically.

### Without Supabase

If `SB.url` is empty, the whole gift is encoded into the link (`#d=...`). This works for simple gifts. Voice notes, backdrop photos, QR codes and email need the short `?g=<id>` links that Supabase provides, and replies are unavailable.

## How a gift link works

1. **Create gift link** posts `{ id, data }` to `/rest/v1/gifts`. The link is `https://your-site/?g=<id>`.
2. When the receiver opens the link, the app fetches `gifts?id=eq.<id>`, checks the unlock date and password, and plays the opening animation.
3. Replies and "opened" events go to `/rest/v1/replies`. The sender sees them under **Menu → Sent gifts**.

## Deploying

The app is fully static, so any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). Upload the files as they are. Gift links are built from the current page URL, so no extra configuration is needed.

## Security notes

- `config.js` only holds the **publishable** key, which is safe in the browser. Never put the `service_role` key here.
- The RLS policies let anyone who has a gift ID read that gift. Gift passwords are a light lock (a hash checked in the browser), not strong protection, so don't put sensitive information in a gift.
