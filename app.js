// ---- Optional: paste your Supabase values for short gift links (see supabase.sql) ----
const SB = { url: 'https://oerzmvbnyewsblzfwgia.supabase.co/rest/v1/', key: 'sb_publishable_jEU3RPAO4r1Ny0A2Jmkl5w_iYpZ2IQl' };

const $ = id => document.getElementById(id), rnd = (a, b) => Math.round(a + Math.random() * (b - a));
const sh = (c, p) => { const n = parseInt(c.slice(1), 16), f = p < 0 ? 0 : 255, t = Math.abs(p);
  return '#' + [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round((f - v) * t + v).toString(16).padStart(2, '0')).join(''); };
const PT = { round: 'M0 0C-22-4-24-36 0-38C24-36 22-4 0 0', point: 'M0 0C-11-12-9-34 0-46C9-34 11-12 0 0', thin: 'M0 0C-4-10-4-32 0-42C4-32 4-10 0 0', wide: 'M0 0C-30-6-30-40 0-40C30-40 30-6 0 0' };
const R = (p, n, f, s = 1, o = 0) => Array.from({ length: n }, (_, i) =>
  `<path d="${PT[p]}" fill="${f}" stroke="${sh(f, -.2)}" stroke-width=".8" transform="rotate(${o + i * 360 / n}) scale(${s})"/>`).join('');
const STEM = '<path d="M50 45Q44 100 50 160" stroke="#5c8f4a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M47 110q-22-4-26-24 20 0 26 24z" fill="#6ea35a"/>';
const bloom = f => c => `<svg viewBox="0 0 100 160">${STEM}<g transform="translate(50 45)">${f(c)}</g></svg>`;
const GREEN = '#5c8f4a';
const twig = (c, big) => `<svg viewBox="0 0 100 160">${[[50, 40], [30, 58], [70, 58], [18, 84], [82, 84], [40, 24], [62, 28]].map(([x, y]) =>
  `<path d="M50 160Q50 100 ${x} ${y}" stroke="${GREEN}" fill="none" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="${big ? 7 : 5}" fill="${c}"/><circle cx="${x + 7}" cy="${y + 6}" r="${big ? 5 : 4}" fill="${sh(c, .15)}"/><circle cx="${x - 6}" cy="${y + 7}" r="${big ? 5 : 3.5}" fill="${sh(c, -.1)}"/>`).join('')}</svg>`;
const leafy = (rx, ry, ang, n) => c => `<svg viewBox="0 0 100 160"><path d="M50 160Q44 80 50 14" stroke="${sh(c, -.35)}" stroke-width="3" fill="none"/>${Array.from({ length: n }, (_, i) => {
  const y = 20 + i * 130 / n; return [-1, 1].map(s => `<ellipse cx="${50 + s * rx * .8}" cy="${y}" rx="${rx}" ry="${ry}" fill="${sh(c, (i % 2) * .12)}" transform="rotate(${s * ang} ${50 + s * rx * .8} ${y})"/>`).join(''); }).join('')}</svg>`;

const WARM = ['#ff7a9c', '#e63950', '#fff6f6', '#ffd166', '#ff9f68', '#b78cff', '#8ecae6', '#f4a6d7', '#a8201a', '#fdd7e4'];
const GRN = ['#6b9e6b', '#3f7a4f', '#9cbf8f', '#7a9e9f', '#a3a56a', '#5c6b3a'];
const TYPES = {
  rose: ['Rose', 'b', WARM, c => R('round', 5, sh(c, -.15)) + R('round', 5, c, .78, 36) + R('round', 4, sh(c, .12), .52, 15) + R('round', 3, sh(c, -.1), .28, 60)],
  peony: ['Peony', 'b', WARM, c => R('wide', 8, sh(c, .1), .95) + R('wide', 8, c, .8, 22) + R('round', 7, sh(c, -.1), .55, 10) + R('round', 5, sh(c, .2), .3)],
  lily: ['Lily', 'b', WARM, c => R('point', 6, c) + R('point', 3, sh(c, .35), .6, 60) + '<path d="M0 0L-12-30M0 0L0-34M0 0L12-30" stroke="#7a5230" stroke-width="1.5"/><circle cx="-12" cy="-30" r="3" fill="#e65100"/><circle cy="-34" r="3" fill="#e65100"/><circle cx="12" cy="-30" r="3" fill="#e65100"/>'],
  tulip: ['Tulip', 'b', WARM, c => `<ellipse cx="-12" cy="-22" rx="14" ry="28" transform="rotate(-12 -12 -22)" fill="${sh(c, -.15)}"/><ellipse cx="12" cy="-22" rx="14" ry="28" transform="rotate(12 12 -22)" fill="${sh(c, -.1)}"/><ellipse cy="-26" rx="14" ry="30" fill="${c}"/>`],
  daisy: ['Daisy', 'b', ['#ffffff', '#ffe3ec', '#fff3b0', '#e6d9ff', '#cfe8ff'], c => R('thin', 16, c) + R('thin', 16, sh(c, -.06), .8, 11) + '<circle r="9" fill="#ffb703"/>'],
  sunflower: ['Sunflower', 'b', ['#ffc300', '#ff9f1c', '#ffe066', '#e85d04'], c => R('point', 22, c) + R('point', 22, sh(c, -.15), .8, 8) + '<circle r="15" fill="#5a3418"/><circle r="9" fill="#3d2410"/>'],
  cosmos: ['Cosmos', 'b', WARM, c => R('wide', 8, c, .9) + '<circle r="6" fill="#ffc83d"/>'],
  poppy: ['Poppy', 'b', ['#ff4d2e', '#ff8fab', '#ffd166', '#fff6f6', '#ff9f68'], c => R('wide', 4, c, .95, 45) + R('wide', 4, sh(c, .15), .7) + '<circle r="7" fill="#2a2430"/>'],
  carnation: ['Carnation', 'b', WARM, c => R('round', 10, c, .9) + R('round', 10, sh(c, .12), .7, 18) + R('round', 8, sh(c, -.1), .45, 9)],
  hydrangea: ['Hydrangea', 'b', ['#8ecae6', '#b78cff', '#f4a6d7', '#fff6f6', '#6fa8dc'], c => Array.from({ length: 22 }, (_, i) =>
    `<circle cx="${Math.cos(i * 2.4) * Math.sqrt(i) * 7.2}" cy="${Math.sin(i * 2.4) * Math.sqrt(i) * 7.2}" r="7.5" fill="${sh(c, (i % 3 - 1) * .12)}"/>`).join('')],
  babysbreath: ['Baby\'s breath', 'i', ['#ffffff', '#ffe3ec', '#e6d9ff'], c => twig(c)],
  waxflower: ['Waxflower', 'i', ['#ffd9e2', '#ffffff', '#ffb3c7', '#fff3b0'], c => twig(c, 1)],
  lavender: ['Lavender', 'i', ['#b78cff', '#d9b8ff', '#8e7cc3', '#f4a6d7'], c => `<svg viewBox="0 0 100 160"><path d="M50 160Q46 80 50 20" stroke="${GREEN}" stroke-width="3" fill="none"/>${Array.from({ length: 10 }, (_, i) => `<ellipse cx="${44 + (i % 2) * 12}" cy="${24 + i * 9}" rx="5" ry="7" fill="${sh(c, (i % 3 - 1) * .1)}"/>`).join('')}</svg>`],
  eucalyptus: ['Eucalyptus', 'f', GRN, leafy(12, 10, 20, 7)],
  fern: ['Fern', 'f', GRN, leafy(16, 3.5, 55, 12)],
  ruscus: ['Ruscus', 'f', GRN, leafy(15, 6, 35, 8)],
  pampas: ['Pampas', 'f', ['#e8d5b7', '#fff3e0', '#d9b99b', '#f4e1d2'], c => `<svg viewBox="0 0 100 160"><path d="M50 160Q48 90 50 40" stroke="#b79f7a" stroke-width="2" fill="none"/>${[[-10, 0], [10, 0], [0, 1]].map(([a, b]) => `<ellipse cx="50" cy="${52 + b * 4}" rx="9" ry="38" fill="${c}" opacity=".75" transform="rotate(${a * 1.6} 50 90)"/>`).join('')}</svg>`]
};
Object.values(TYPES).forEach(t => { const f = t[3]; t.svg = c => (t[1] === 'b' ? bloom(f) : f)(c); });
const CATS = { b: ['🌸 Flowers', 'b'], i: ['✨ Fillers', 'i'], f: ['🌿 Foliage', 'f'] };
const WRAPS = ['#d2a679', '#ffd9e2', '#fff3e0', '#cfe3cf', '#d9ccf5', '#2b2b33', '#2b3a5c', '#ffffff'];

let S = { items: [], w: '#ffd9e2', p: '', rib: '#e0577f', env: '#f4e3e6', on: false, to: '', from: '', text: '', photo: '', dark: false };
let cat = 'b', col = {}, sel = null, view = false;
const els = new Map();

// ---- picker ----
function drawPicker() {
  $('tabs').innerHTML = ''; Object.entries(CATS).forEach(([k, [l]]) => { const b = document.createElement('button'); b.textContent = l; b.className = k === cat ? 'on' : ''; b.onclick = () => { cat = k; drawPicker(); }; $('tabs').append(b); });
  const ids = Object.keys(TYPES).filter(k => TYPES[k][1] === cat), cols = TYPES[ids[0]][2];
  const cur = col[cat] || (col[cat] = cols[0]);
  $('sw').innerHTML = ''; (cat === 'b' ? WARM : cat === 'f' ? GRN : ['#ffffff', '#ffd9e2', '#b78cff', '#fff3b0', '#ffb3c7']).forEach(c => { const i = document.createElement('i'); i.style.background = c; if (c === cur) i.className = 'on'; i.onclick = () => { col[cat] = c; drawPicker(); }; $('sw').append(i); });
  $('grid').innerHTML = ''; ids.forEach(k => { const t = TYPES[k], b = document.createElement('button'); b.innerHTML = t.svg(t[2].includes(cur) ? cur : t[2][0]) + t[0]; b.onclick = () => add(k, t[2].includes(cur) ? cur : t[2][0]); $('grid').append(b); });
}
function add(t, c) {
  if (S.items.length >= 40) return alert('Your bouquet is full! 💐');
  const k = TYPES[t][1], sp = k === 'b' ? 55 : 90, x = rnd(-sp, sp);
  const it = { t, c, x, y: -(k === 'b' ? rnd(40, 120) : rnd(70, 150)), r: Math.round(x / 5), s: 1, z: k === 'b' ? 2 : k === 'i' ? 1 : 0 };
  S.items.push(it); mk(it); select(it);
}
function place(it) { const e = els.get(it); e.style.transform = `translate(${it.x}px,${it.y}px) rotate(${it.r}deg) scale(${it.s})`; e.style.zIndex = it.z; }
function mk(it) {
  const e = document.createElement('div'); e.className = 'sp'; e.innerHTML = TYPES[it.t].svg(it.c); els.set(it, e); place(it); $('bunch').append(e);
  $('count').textContent = S.items.length;
  let sx, sy, ox, oy, drag = false;
  e.onpointerdown = ev => { if (view) return; ev.preventDefault(); e.setPointerCapture(ev.pointerId); drag = true; sx = ev.clientX; sy = ev.clientY; ox = it.x; oy = it.y; select(it); };
  e.onpointermove = ev => { if (!drag) return; it.x = ox + ev.clientX - sx; it.y = oy + ev.clientY - sy; place(it); };
  e.onpointerup = () => drag = false;
}
function select(it) { sel = it; els.forEach((e, i) => e.classList.toggle('sel', i === it)); $('tools').classList.toggle('hide', !it); }
$('tools').onclick = ev => { const a = ev.target.dataset.a; if (!a || !sel) return;
  if (a === 'd') { els.get(sel).remove(); els.delete(sel); S.items = S.items.filter(i => i !== sel); sel = null; $('count').textContent = S.items.length; $('tools').classList.add('hide'); return; }
  if (a === 's-') sel.s = Math.max(.4, sel.s - .1); if (a === 's+') sel.s = Math.min(2, sel.s + .1);
  if (a === 'r-') sel.r -= 12; if (a === 'r+') sel.r += 12; if (a === 'f') sel.z = sel.z >= 3 ? 0 : 3; place(sel); };
document.addEventListener('pointerdown', e => { if (!e.target.closest('.sp,#tools,#grid,#sw')) select(null); });

// ---- wrapper / theme / message ----
function applyStyle() {
  const r = document.documentElement.style; r.setProperty('--w', S.w); r.setProperty('--rib', S.rib); r.setProperty('--env', S.env);
  $('wrapFront').className = ''; $('wrapFront').id = 'wrapFront'; if (S.p) $('wrapFront').classList.add(S.p);
  document.body.classList.toggle('dark', S.dark);
  $('mini').classList.toggle('hide', !S.on); $('hint').classList.toggle('hide', !(S.on && view));
  $('tag').textContent = S.to ? 'For ' + S.to : ''; $('tag').classList.toggle('hide', !S.to);
}
WRAPS.forEach(c => { const i = document.createElement('i'); i.style.background = c; i.onclick = () => { S.w = $('wrapC').value = c; applyStyle(); }; $('wsw').append(i); });
$('wrapC').oninput = e => { S.w = e.target.value; applyStyle(); };
$('wrapP').onchange = e => { S.p = e.target.value; applyStyle(); };
$('ribC').oninput = e => { S.rib = e.target.value; applyStyle(); };
$('envC').oninput = e => { S.env = e.target.value; applyStyle(); };
$('msgOn').onchange = e => { S.on = e.target.checked; $('msgBox').classList.toggle('hide', !S.on); applyStyle(); };
$('to').oninput = e => { S.to = e.target.value; applyStyle(); };
$('from').oninput = e => S.from = e.target.value;
$('text').oninput = e => S.text = e.target.value;
$('dark').onclick = () => { S.dark = !S.dark; applyStyle(); };
$('photo').onchange = e => { const f = e.target.files[0]; if (!f) return; const img = new Image(); img.onload = () => {
  const k = Math.min(1, 480 / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = img.width * k; c.height = img.height * k;
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); S.photo = c.toDataURL('image/jpeg', .65); $('thumb').src = S.photo; $('thumb').classList.remove('hide'); }; img.src = URL.createObjectURL(f); };

// ---- envelope letter ----
$('mini').onclick = () => { $('lTo').textContent = S.to ? 'Dear ' + S.to + ',' : ''; $('lText').textContent = S.text; $('lFrom').textContent = S.from ? '— ' + S.from : '';
  $('lImg').classList.toggle('hide', !S.photo); if (S.photo) $('lImg').src = S.photo;
  $('env').className = 'env'; $('ov').classList.remove('hide'); $('hint').classList.add('hide');
  setTimeout(() => $('env').classList.add('open'), 150); setTimeout(() => $('env').classList.add('gone'), 1900); };
$('close').onclick = () => $('ov').classList.add('hide');

// ---- music, petals, png ----
let playing = false;
$('musicBtn').onclick = () => { playing ? $('music').pause() : $('music').play(); playing = !playing; $('musicBtn').textContent = playing ? '⏸️' : '🎵'; };
['🌸', '🌷', '🌼', '🌺'].forEach((p, j) => { for (let i = 0; i < 4; i++) { const s = document.createElement('span'); s.textContent = p; s.style.cssText = `left:${rnd(0, 95)}vw;font-size:${rnd(14, 26)}px;animation-duration:${rnd(9, 18)}s;animation-delay:-${rnd(0, 15)}s`; $('petals').append(s); } });
$('save').onclick = () => html2canvas($('frame'), { backgroundColor: null }).then(c => { const a = document.createElement('a'); a.download = 'my-bouquet.png'; a.href = c.toDataURL(); a.click(); });

// ---- share ----
const b64 = buf => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result.split(',')[1].replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')); f.readAsDataURL(new Blob([buf])); });
const pack = async s => b64(await new Response(new Blob([s]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());
const unpack = async h => { const bin = atob(h.replace(/-/g, '+').replace(/_/g, '/')); return new Response(new Blob([Uint8Array.from(bin, c => c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text(); };
const H = () => ({ apikey: SB.key, Authorization: 'Bearer ' + SB.key });
$('share').onclick = async () => {
  const data = { ...S, items: S.items.map(({ t, c, x, y, r, s, z }) => ({ t, c, x, y, r, s, z })) }, base = location.origin + location.pathname;
  if (!S.items.length) return alert('Add a few flowers first 🌸');
  $('linkOut').textContent = 'Creating link…';
  try {
    let link;
    if (SB.url) { const id = Math.random().toString(36).slice(2, 10);
      const r = await fetch(SB.url + '/rest/v1/gifts', { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ id, data }) });
      if (!r.ok) throw new Error(await r.text()); link = `${base}?g=${id}`;
    } else link = `${base}#d=${await pack(JSON.stringify(data))}`;
    await navigator.clipboard.writeText(link); $('linkOut').textContent = '💌 Link copied! Send it to someone special.';
  } catch (e) { $('linkOut').textContent = 'Could not create link: ' + e.message; }
};

// ---- boot ----
(async () => {
  try {
    const g = new URLSearchParams(location.search).get('g'), h = location.hash.startsWith('#d=') ? location.hash.slice(3) : '';
    if (g && SB.url) S = (await (await fetch(`${SB.url}/rest/v1/gifts?id=eq.${encodeURIComponent(g)}&select=data`, { headers: H() })).json())[0].data;
    else if (h) S = JSON.parse(await unpack(h));
    view = !!(g || h);
  } catch (e) { console.error('Bad gift link', e); }
  if (view) document.body.classList.add('view');
  S.items.forEach(mk); $('count').textContent = S.items.length; applyStyle(); drawPicker();
  if (!view) { $('wrapC').value = S.w; }
})();