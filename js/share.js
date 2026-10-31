// Make Your Own Bouquet · Sharing: gift links, encryption, Supabase calls, QR code and email.
// Classic scripts share one global scope, so these files rely on being loaded in the order listed in index.html.
// ---- password fields: show/hide, and a gentle strength hint ----
document.querySelectorAll('.pwtoggle').forEach(b => b.onclick = () => { const i = $(b.dataset.for), show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.textContent = show ? 'Hide' : 'Show'; b.setAttribute('aria-pressed', String(show)); b.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); });
const PW_HINT = 'Leave empty for no password. If it is forgotten, nobody can recover the gift, so keep it somewhere safe.';
$('pw').oninput = e => { const v = e.target.value, h = $('pwHint'), kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(v)).length;
  h.className = 'muted' + (!v ? '' : v.length < 6 ? ' weak' : v.length >= 10 && kinds >= 2 || v.length >= 14 ? ' strong' : ' ok');
  h.textContent = !v ? PW_HINT : v.length < 6 ? 'Too short. Use at least 6 characters, because anyone holding the link could try to guess it.' : h.classList.contains('strong') ? 'Strong password. Remember it: it cannot be recovered.' : 'Okay. A longer one with mixed characters is stronger.'; };
// ---- sharing ----
const b64 = buf => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result.split(',')[1].replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')); f.readAsDataURL(new Blob([buf])); });
const unb64 = h => { const bin = atob(h.replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(bin, c => c.charCodeAt(0)); };
const pack = async s => b64(await new Response(new Blob([s]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());
const unpack = async h => new Response(new Blob([unb64(h)]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
const H = () => ({ apikey: SB.key, Authorization: 'Bearer ' + SB.key });
const sha = async s => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, '0')).join('');
// a password encrypts the gift in the browser (PBKDF2 + AES-GCM), so the server never holds readable content
const aesKey = async (pw, salt) => crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' }, await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']), { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
async function seal(obj, pw) { const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await aesKey(pw, salt), new TextEncoder().encode(JSON.stringify(obj))); return { enc: 1, s: await b64(salt), i: await b64(iv), ct: await b64(ct) }; }
async function unseal(g, pw) { const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(g.i) }, await aesKey(pw, unb64(g.s)), unb64(g.ct)); return JSON.parse(new TextDecoder().decode(pt)); }
const newId = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), b => 'abcdefghijkmnpqrstuvwxyz23456789'[b & 31]).join('');
// Reads go through the get_gift / get_replies functions (see supabase.sql); older projects fall back to the tables.
async function fetchGift(id) {
  try { const r = await fetch(`${SB.url}/rest/v1/rpc/get_gift`, { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json' }, body: JSON.stringify({ gid: id }) }); if (r.ok) return await r.json(); if (r.status !== 404) return null; } catch (e) { /* try the table */ }
  const r = await fetch(`${SB.url}/rest/v1/gifts?id=eq.${encodeURIComponent(id)}&select=data`, { headers: H() }); const j = await r.json(); return j && j[0] ? j[0].data : null;
}
async function fetchReplies(ids) {
  try { const r = await fetch(`${SB.url}/rest/v1/rpc/get_replies`, { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) }); if (r.ok) return await r.json(); if (r.status !== 404) throw 0; } catch (e) { if (e === 0) throw e; }
  const r = await fetch(`${SB.url}/rest/v1/replies?gift_id=in.(${ids.map(encodeURIComponent).join(',')})&order=created_at.desc`, { headers: H() }); if (!r.ok) throw 0; return r.json();
}
const postGift = b => fetch(SB.url + '/rest/v1/gifts', { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(b) });
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), b => 'abcdefghijkmnpqrstuvwxyz23456789'[b & 31]).join('');
// true when deleted, false when nothing matched; throws 'setup' if supabase.sql has not been updated yet
async function deleteGift(id, code) {
  const r = await fetch(`${SB.url}/rest/v1/rpc/delete_gift`, { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json' }, body: JSON.stringify({ gid: id, code }) });
  if (r.status === 404) throw new Error('setup'); if (!r.ok) throw new Error('network'); return (await r.json()) === true;
}
const rpost = b => fetch(SB.url + '/rest/v1/replies', { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(b) });

function summary() {
  const rows = [['Flowers', S.items.length ? S.items.length + ' stem' + (S.items.length > 1 ? 's' : '') : '<span class="warn">Add a few flowers first</span>'],
    ['Wrap', (CONT.find(c => c[0] === S.cont) || CONT[0])[1] + (S.rs !== 'nobow' ? ' with a ' + (RSTYLES.find(c => c[0] === S.rs) || [0, 'bow'])[1].toLowerCase() : '')],
    ['Letter', S.on ? 'To ' + (S.to || 'someone special') + (S.text ? '' : ' (no message yet)') : 'Not included'],
    ['Voice note', S.voice ? (S.on ? 'Attached (' + (S.vd ? mmss(S.vd) : 'recorded') + '). Plays at the top of the letter.' : '<span class="warn">Recorded, but the letter is off. Turn the letter on in step 3 to send it.</span>') : (S.on ? 'None' : '—')],
    ['Photo', S.photo ? 'Included' : '—']];
  $('summary').innerHTML = rows.map(([k, v]) => `<div><b>${k}</b><em>${v}</em></div>`).join('');
}
let link = '';
const QC = { Forest: ['#1f4d3a', '#f7f1e6'], Classic: ['#000000', '#ffffff'], Wine: ['#6b1e2e', '#fff8f0'], Navy: ['#1b2a5c', '#f4f7ff'], Plum: ['#4a2c6f', '#faf5ff'] };
Object.keys(QC).forEach(k => $('qrS').add(new Option(k + ' QR', k)));
const HP = new Path2D('M.5 .95C.1 .65 0 .45 0 .28C0 .1 .13 0 .27 0C.38 0 .46 .06 .5 .15C.54 .06 .62 0 .73 0C.87 0 1 .1 1 .28C1 .45 .9 .65 .5 .95Z');
async function drawQR() {
  const box = $('qr'); box.innerHTML = '';
  if (!window.QRCode || link.length >= 1800) { box.textContent = 'QR codes need a short link. Connect Supabase (see supabase.sql).'; return; }
  const [d, l0] = QC[$('qrS').value], bg = $('qrBg').value, l = bg === 'auto' ? l0 : bg, st = $('qrStyle').value, fr = $('qrFrame').value, t = el('div');
  const m = new QRCode(t, { text: link, width: 8, height: 8, correctLevel: QRCode.CorrectLevel.H })._oQRCode, n = m.getModuleCount();
  const cs = 8, pad = 24, Q = n * cs + pad * 2, cap = $('qrCap').checked ? 34 : 0;
  const T = fr === 'heart' ? Math.round(Q / .45) : fr === 'circle' ? Math.round(Q * 1.25) : fr === 'flower' ? Math.round(Q * 1.6) : Q;
  const c = el('canvas', { width: T, height: T + cap }), x = c.getContext('2d'), ox = (T - Q) / 2, oy = fr === 'heart' ? T * .2 : ox;
  x.fillStyle = sh(d, .82); x.strokeStyle = d; x.lineWidth = 5;
  if (fr === 'heart') { x.save(); x.scale(T, T); x.lineWidth = 5 / T; x.fill(HP); x.stroke(HP); x.restore(); }
  else if (fr === 'circle') { x.beginPath(); x.arc(T / 2, T / 2, T / 2 - 3, 0, 7); x.fill(); x.stroke(); }
  else if (fr === 'flower') { for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; x.beginPath(); x.arc(T / 2 + Math.cos(a) * T * .39, T / 2 + Math.sin(a) * T * .39, T * .11, 0, 7); x.fill(); x.stroke(); } x.beginPath(); x.arc(T / 2, T / 2, T * .44, 0, 7); x.fill(); }
  x.fillStyle = l; x.beginPath(); if (fr === 'card') x.roundRect(0, 0, T, T + cap, 18); else x.roundRect(ox, oy, Q, Q, 16); x.fill(); x.fillStyle = d;
  const eye = (r, k) => (r < 7 && k < 7) || (r < 7 && k >= n - 7) || (r >= n - 7 && k < 7);
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) { if (!m.isDark(r, k) || (st !== 'square' && eye(r, k))) continue; const px = ox + pad + k * cs, py = oy + pad + r * cs;
    if (st === 'square') x.fillRect(px, py, cs, cs);
    else if (st === 'round') { x.beginPath(); x.roundRect(px + .5, py + .5, cs - 1, cs - 1, 3); x.fill(); }
    else if (st === 'dots') { x.beginPath(); x.arc(px + cs / 2, py + cs / 2, cs * .42, 0, 7); x.fill(); }
    else if (st === 'heart') { x.save(); x.translate(px - cs * .05, py); x.scale(cs * 1.1, cs * 1.1); x.fill(HP); x.restore(); }
    else { x.beginPath(); x.ellipse(px + cs / 2, py + cs / 2, cs * .5, cs * .3, Math.PI / 4, 0, 7); x.fill(); } }
  if (st !== 'square') [[0, 0], [0, n - 7], [n - 7, 0]].forEach(([r, k]) => { const px = ox + pad + k * cs, py = oy + pad + r * cs; x.lineWidth = cs; x.strokeStyle = d; x.beginPath(); x.roundRect(px + cs / 2, py + cs / 2, cs * 6, cs * 6, cs * 1.6); x.stroke(); x.beginPath(); x.roundRect(px + cs * 2, py + cs * 2, cs * 3, cs * 3, cs); x.fill(); });
  if ($('qrLogo').checked) { const s = Math.round(n * cs * .22), cx = ox + Q / 2 - s / 2, cy = oy + Q / 2 - s / 2; x.fillStyle = l; x.beginPath(); x.roundRect(cx - 4, cy - 4, s + 8, s + 8, 10); x.fill();
    await new Promise(res => { const im = new Image(); im.onload = () => { x.drawImage(im, cx, cy, s, s); res(); }; im.onerror = res; im.src = 'favicon.svg'; }); }
  if (cap) { x.fillStyle = d; x.font = '600 15px Quicksand, sans-serif'; x.textAlign = 'center'; x.fillText('Scan to open your gift', T / 2, T + 22); }
  box.append(c);
}
['qrS', 'qrStyle', 'qrFrame', 'qrBg', 'qrLogo', 'qrCap'].forEach(k => $(k).onchange = drawQR);
$('qrDl').onclick = () => { const c = $('qr').querySelector('canvas'); if (c) el('a', { download: 'bouquet-qr.png', href: c.toDataURL() }).click(); };
$('copy').onclick = () => navigator.clipboard.writeText(link).then(() => toast('Link copied'), () => toast('Select the link and copy it by hand.'));
$('mail').onclick = () => {
  if (!link) return; if (link.length > 1500) return toast('Email links need to be short. Connect Supabase first (see supabase.sql).');
  if ($('qr').querySelector('canvas') && $('qrAtt').checked) { $('qrDl').click(); toast('QR image downloaded. Drag it into your email to attach it.'); }
  const f = S.from || 'Someone who adores you', t = S.to || 'lovely';
  const body = `Dear ${t},\n\nA little garden has grown just for you.\n${f} arranged a bouquet, wrapped it with care${S.on ? ', and tucked a note inside' : ''}${S.voice ? ' along with a voice note' : ''}.\n\nOpen your gift here:\n${link}\n${$('pw').value ? '\nIt is locked with a password. Ask ' + f + ' for it.\n' : ''}\nWith petals and wishes,\nMake Your Own Bouquet`;
  location.href = `mailto:${encodeURIComponent($('email').value)}?subject=${encodeURIComponent('A gift has arrived for you')}&body=${encodeURIComponent(body)}`;
};
$('share').onclick = async () => {
  await stopRec();
  if (!S.items.length) return toast('Add a few flowers first.');
  if (S.voice && !S.on) return toast('Your voice note lives inside the letter. Turn the letter on in step 3, or remove the voice note.');
  if ((S.voice || S.bgImg) && !SB.url) return toast('Voice notes and photo backdrops need Supabase short links. Add your keys in config.js.');
  const pw = $('pw').value; if (pw && pw.length < 6) return toast('Please use a password with at least 6 characters, or leave it empty.');
  const btn = $('share'); btn.disabled = true; $('linkOut').textContent = 'Creating link…';
  try {
    const data = snap(); data.atu = S.at ? new Date(S.at).toISOString() : '';
    const body = pw ? { ...(await seal(data, pw)), to: S.to, from: S.from, ev: S.ev, at: S.at, atu: data.atu } : data;
    const base = location.href.split(/[?#]/)[0];
    if (SB.url) {
      // a secret delete code stays on this device; the database only keeps its hash
      const id = newId(); let del = newCode(), r = await postGift({ id, data: body, del_hash: await sha(del) });
      if (!r.ok && r.status === 400 && /del_hash/.test(await r.clone().text())) { del = ''; r = await postGift({ id, data: body }); }   // database not updated yet: gift works, just can't be deleted
      if (!r.ok) { let m = ''; try { m = (await r.json()).message || ''; } catch (e) { /* not JSON */ }
        throw new Error(/too many/i.test(m) ? 'Lots of gifts are being made right now. Please try again in a minute.' : r.status === 413 ? 'The gift is too large. Try a smaller photo or a shorter voice note.' : m || 'Something went wrong (' + r.status + '). Please try again.'); }
      link = `${base}?g=${id}`; const sent = lsGet('bq_sent', []); sent.unshift({ id, to: S.to || '', t: Date.now(), link, del }); lsSet('bq_sent', sent.slice(0, 30));
    } else link = `${base}#d=${await pack(JSON.stringify(body))}`;
    $('linkOut').textContent = 'Link ready. Copy it, scan the QR, or email it.'; $('shareBox').classList.remove('hide'); $('linkTxt').value = link; navigator.clipboard.writeText(link).catch(() => {}); drawQR();
    { const sb = $('stepBody'); sb.scrollTo({ top: $('shareBox').getBoundingClientRect().top - sb.getBoundingClientRect().top + sb.scrollTop - 12, behavior: 'smooth' }); }
  } catch (e) { $('linkOut').textContent = 'Could not create link: ' + e.message; } finally { btn.disabled = false; }
};
