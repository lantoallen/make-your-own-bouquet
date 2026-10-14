# Make Your Own Bouquet

Build a digital bouquet, tuck in a letter, and send it as a link, QR code or email.

## Features

- **Four-step builder**: Flowers, Wrap, Letter, Share. Each step has its own page, a live preview stays in view, and a summary on the last step shows exactly what will be sent.
- **80+ stems**: blooms, tall spikes, fillers, foliage and memorial wreaths. Search by name or by meaning, recolor any stem, up to 40 per bouquet. Drag, resize, rotate, layer and copy them, with the tools right under the bouquet.
- **Wrapping**: paper wrap, vase, basket, easel or ribbon only. Wrap patterns, eight ribbon styles, backdrops (or your own photo).
- **Letter**: To/From, message, photo, a customizable envelope (color, wax seal and emblem, stamp, lining, edge trim, name on the front), 27 paper styles, 16 fonts, text styling (size, spacing, alignment, bold/italic/underline, ink color), a song or video link, a **voice note** and an optional flower meanings card.
- **Live preview while you edit**: on the Letter step the stage shows your letter at real size, and switches to a large envelope when you open the Envelope section. Tap the envelope to watch it open.
- **Voice note**: record up to 30 seconds. It plays from a labeled card at the top of the letter, right under the greeting. The editor shows a live preview of that card, and the receiver's cover page says the gift includes a voice note.
- **Sharing**: gift link, styled QR code (download as an image) and "Send by email" through your own mail app.
- **Gift options**: unlock date, optional password, soft music and an opening animation.
- **Receiver side**: opening animation, plus replies and "opened" tracking that the sender can see under *Sent gifts*.
- **Phones**: the preview always fits above the controls, the preview shrinks while you type, and the receiver's view uses the whole screen.
- **Local extras**: autosave, drafts, profile name, sent-gift history, dark mode and PNG export, all kept in the browser's `localStorage`.

## Tech stack

| Part | What it uses |
| --- | --- |
| Frontend | Plain HTML, CSS and JavaScript. No framework and no build step. |
| Backend | [Supabase](https://supabase.com), called directly through its REST API (PostgREST) |
| Libraries (CDN) | [html2canvas](https://html2canvas.hertzen.com/) for PNG export, [qrcodejs](https://github.com/davidshimjs/qrcodejs) for QR codes, Google Fonts |

## Project structure

```
index.html    Page markup: the four builder steps, stage, landing and letter overlay
style.css     All styles, including paper, font and theme variables
flowers.js    Every flower, spike, filler, foliage and wreath drawing, plus flower meanings
app.js        App logic: editor, rendering, sharing, gift opening, replies
config.js     Supabase URL and publishable key
supabase.sql  Database tables, row-level security and the two read functions
favicon.svg   App icon
```

To add a flower, add one `addT(...)` line (and a `MEAN` entry) in `flowers.js`.

## Running locally

There is nothing to install. Serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

Opening `index.html` straight from disk (`file://`) mostly works too, but microphone recording and some browser APIs need `http://localhost` or HTTPS.

## Backend setup (Supabase)

1. Create a Supabase project.
2. Open **SQL Editor** and run [`supabase.sql`](supabase.sql). It is safe to run again, so use it for new projects and to upgrade older ones. It creates:
   - `gifts`: `id` (text) plus `data` (jsonb), which holds the whole bouquet and letter
   - `replies`: receiver replies and "opened" events for each gift
   - Policies that let visitors **add** rows but not list or read the tables
   - `get_gift(gid)` and `get_replies(ids)`, the only way to read: you need a gift's id (its link)
3. Put your project URL and **publishable (anon)** key in `config.js`:

   ```js
   const SB = { url: 'https://YOUR-PROJECT.supabase.co', key: 'YOUR_PUBLISHABLE_KEY' };
   ```

   A trailing `/` or `/rest/v1/` on the URL is stripped automatically.

If you have not run the new `supabase.sql` yet, the app still works. It falls back to reading the tables directly, which is how older versions behaved, so run it to get the protections below.

### Without Supabase

If `SB.url` is empty, the whole gift is encoded into the link (`#d=...`). This works for simple gifts. Voice notes, backdrop photos, QR codes and email need the short `?g=<id>` links that Supabase provides, and replies are unavailable.

## How a gift link works

1. **Create gift link** posts `{ id, data }` to `/rest/v1/gifts`. The id is 12 random characters and the link is `https://your-site/?g=<id>`.
2. When the receiver opens the link, the app calls `get_gift`, checks the password, and plays the opening animation.
3. Replies and "opened" events go to `/rest/v1/replies`. The sender sees them under **Menu → Sent gifts**.

## Deploying

The app is fully static, so any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). Upload the files as they are. Gift links are built from the current page URL, so no extra configuration is needed. `index.html` loads its script and stylesheet with a `?v=` number; bump it when you deploy a change so browsers do not keep an old copy.

## Security notes

- `config.js` only holds the **publishable** key, which is safe in the browser. Never put the `service_role` key here.
- **Passwords really lock the gift.** With a password, the bouquet and letter are encrypted in the sender's browser (PBKDF2 + AES-GCM) before upload. The server only stores ciphertext and the To/From names, and the password never leaves the device. Choose a password you can share separately.
- **Unlock dates are enforced by the server.** Until the unlock time, `get_gift` returns only To/From, never the contents.
- **Visitors cannot list gifts.** Without the `supabase.sql` policies, anyone with the public key could download every gift. With them, a gift is only readable by someone who has its link.
- Everything that arrives in a gift link is validated before it is drawn (colors, images, audio, fonts, flower types), so a hand-made gift cannot inject styles or markup.
- Not covered: anyone can still create gifts and replies (they are size-limited). If you see abuse, add rate limiting in Supabase.
