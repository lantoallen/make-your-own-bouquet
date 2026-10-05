// ---- Optional: paste your Supabase values for short gift links (see supabase.sql) ----
const SB = { url: '', key: '' };

const $ = id => document.getElementById(id), rnd = (a, b) => Math.round(a + Math.random() * (b - a));
const sh = (c, p) => { const n = parseInt(c.slice(1), 16), f = p < 0 ? 0 : 255, t = Math.abs(p);
  return '#' + [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round((f - v) * t + v).toString(16).padStart(2, '0')).join(''); };
const PT = { round: 'M0 0C-22-4-24-36 0-38C24-36 22-4 0 0', point: 'M0 0C-11-12-9-34 0-46C9-34 11-12 0 0', thin: 'M0 0C-4-10-4-32 0-42C4-32 4-10 0 0', wide: 'M0 0C-30-6-30-40 0-40C30-40 30-6 0 0' };
let U = 0;
const R = (p, n, f, s = 1, o = 0) => { const id = 'g' + U++;
  return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" r="42"><stop offset=".05" stop-color="${sh(f, -.4)}"/><stop offset=".55" stop-color="${f}"/><stop offset="1" stop-color="${sh(f, .3)}"/></radialGradient>` +
  Array.from({ length: n }, (_, i) => `<g transform="rotate(${o + i * 360 / n}) scale(${s})"><path d="${PT[p]}" fill="url(#${id})" stroke="${sh(f, -.3)}" stroke-width=".7"/><path d="M0-6V-26" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/></g>`).join(''); };
const STEM = '<path d="M50 45Q44 100 50 160" stroke="#3f6b33" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M49 50Q43 100 49 158" stroke="#7fb069" stroke-width="1.4" fill="none"/><path d="M47 112q-24-2-30-28 24 2 30 28z" fill="#5f9448" stroke="#3f6b33" stroke-width=".6"/><path d="M47 112Q35 100 20 87" stroke="#3f6b33" stroke-width=".7" fill="none"/><ellipse cx="50" cy="48" rx="8" ry="4" fill="#4e7a3e"/>';
const bloom = f => c => `<svg viewBox="0 0 100 160">${STEM}<g transform="translate(50 45)">${f(c)}</g></svg>`;
const GREEN = '#4f7f3f';
const twig = (c, big) => `<svg viewBox="0 0 100 160">${[[50, 40], [30, 58], [70, 58], [18, 84], [82, 84], [40, 24], [62, 28]].map(([x, y]) =>
  `<path d="M50 160Q50 100 ${x} ${y}" stroke="${GREEN}" fill="none" stroke-width="1.5"/>` + [[0, 0, 1], [7, 6, .75], [-6, 7, .65]].map(([dx, dy, k], n) => `<circle cx="${x + dx}" cy="${y + dy}" r="${(big ? 7 : 5) * k}" fill="${sh(c, n * .08)}" stroke="${sh(c, -.3)}" stroke-width=".5"/>`).join('')).join('')}</svg>`;
const leafy = (rx, ry, ang, n) => c => `<svg viewBox="0 0 100 160"><path d="M50 160Q44 80 50 14" stroke="${sh(c, -.4)}" stroke-width="2.5" fill="none"/>${Array.from({ length: n }, (_, i) => { const y = 20 + i * 130 / n;
  return [-1, 1].map(s => `<g transform="translate(${50 + s * 3} ${y}) rotate(${s < 0 ? 180 + ang : -ang})"><path d="M0 0Q${rx / 2} ${-ry * 1.6} ${rx * 2} 0Q${rx / 2} ${ry * 1.6} 0 0" fill="${sh(c, (i % 2) * .12 - .05)}" stroke="${sh(c, -.35)}" stroke-width=".6"/><path d="M0 0H${rx * 1.9}" stroke="${sh(c, -.4)}" stroke-width=".6" opacity=".7"/></g>`).join(''); }).join('')}</svg>`;

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
  pampas: ['Pampas', 'f', ['#e8d5b7', '#fff3e0', '#d9b99b', '#f4e1d2'], c => `<svg viewBox="0 0 100 160"><path d="M50 160Q48 90 50 40" stroke="#b79f7a" stroke-width="2" fill="none"/>${[[-10, 0], [10, 0], [0, 1]].map(([a, b]) => `<ellipse cx="50" cy="${52 + b * 4}" rx="9" ry="38" fill="${c}" opacity=".75" transform="rotate(${a * 1.6} 50 90)"/>`).join('')}</svg>`],
  ranunculus: ['Ranunculus', 'b', WARM, c => R('round', 12, c, .95) + R('round', 10, sh(c, .1), .7, 15) + R('round', 8, sh(c, -.05), .45, 7) + R('round', 6, sh(c, .15), .25)],
  anemone: ['Anemone', 'b', ['#ffffff', '#b78cff', '#e63950', '#ff8fab', '#8ecae6'], c => R('wide', 6, c, .9) + '<circle r="12" fill="none" stroke="#2a2430" stroke-width="2" stroke-dasharray="1 3"/><circle r="9" fill="#2a2430"/>'],
  gerbera: ['Gerbera', 'b', ['#ff6f3c', '#ffc300', '#ff4d6d', '#fff6f6', '#d6336c'], c => R('thin', 24, c, 1.05) + R('thin', 24, sh(c, .15), .8, 7) + '<circle r="8" fill="#3d2410"/>'],
  wheat: ['Wheat', 'i', ['#e0b84c', '#d9b99b', '#c9a227'], c => `<svg viewBox="0 0 100 160"><path d="M50 160Q47 90 50 30" stroke="#b79f7a" stroke-width="2" fill="none"/>${Array.from({ length: 8 }, (_, i) => [-1, 1].map(s => `<ellipse cx="${50 + s * 6}" cy="${28 + i * 9}" rx="3" ry="7" fill="${sh(c, (i % 2) * .1)}" transform="rotate(${s * 25} ${50 + s * 6} ${28 + i * 9})"/>`).join('')).join('')}</svg>`],
  berries: ['Berries', 'i', ['#c0392b', '#6a1b4d', '#2b3a5c', '#e67e22'], c => twig(c, 1)],
  olive: ['Olive', 'f', ['#8a9a5b', '#a3a56a', '#6b7f5a'], leafy(10, 3, 30, 10)],
  monstera: ['Big leaf', 'f', GRN, c => `<svg viewBox="0 0 100 160"><path d="M50 160Q47 110 50 100" stroke="${sh(c, -.4)}" stroke-width="3" fill="none"/><path d="M50 20C18 20 8 55 30 88C40 102 50 106 50 106C50 106 60 102 70 88C92 55 82 20 50 20Z" fill="${c}" stroke="${sh(c, -.35)}" stroke-width=".8"/><path d="M50 104V26M50 80L28 60M50 80L72 60M50 56L34 42M50 56L66 42" stroke="${sh(c, -.4)}" stroke-width=".9" fill="none"/></svg>`]
};
Object.values(TYPES).forEach(t => { const f = t[3]; t.svg = c => (t[1] === 'b' ? bloom(f) : f)(c); });
const CATS = { b: ['🌸 Flowers', 'b'], i: ['✨ Fillers', 'i'], f: ['🌿 Foliage', 'f'] };
const WRAPS = ['#d2a679', '#ffd9e2', '#fff3e0', '#cfe3cf', '#d9ccf5', '#2b2b33', '#2b3a5c', '#ffffff'];

const D = () => ({ items: [], w: '#ffd9e2', p: '', rib: '#e0577f', env: '#f4e3e6', on: false, pet: false, cont: 'paper', rs: 'bow', bg: 'blush', pw: '', media: '', to: '', from: '', text: '', photo: '', dark: false });
let S = D();
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
const mkIt = (t, c) => { const k = TYPES[t][1], sp = k === 'b' ? 55 : 90, x = rnd(-sp, sp); return { t, c, x, y: -(k === 'b' ? rnd(40, 120) : rnd(70, 150)), r: Math.round(x / 5), s: 1, z: k === 'b' ? 2 : k === 'i' ? 1 : 0 }; };
function add(t, c) { if (S.items.length >= 40) return alert('Your bouquet is full! 💐'); const it = mkIt(t, c); S.items.push(it); mk(it); select(it); }
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
  $('frame').className = S.cont || 'paper'; $('bow').className = S.rs || 'bow'; $('stage').style.background = BG[S.bg] || '';
  const r = document.documentElement.style; r.setProperty('--w', S.w); r.setProperty('--rib', S.rib); r.setProperty('--env', S.env);
  $('wrapFront').className = ''; $('wrapFront').id = 'wrapFront'; if (S.p) $('wrapFront').classList.add(S.p);
  document.body.classList.toggle('dark', S.dark); document.body.classList.toggle('pet', !!S.pet); $('petalBtn').textContent = '🌸 Petals: ' + (S.pet ? 'on' : 'off');
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
$('petalBtn').onclick = () => { S.pet = !S.pet; applyStyle(); };
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
$('ov').onclick = e => { if (e.target === $('ov')) $('close').click(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('close').click(); });

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
// ---- v2: presets, containers, drafts, share, password ----
const BG = { blush: '', garden: 'radial-gradient(circle at 50% 100%,#cfe8c8,transparent 65%)', meadow: 'linear-gradient(#d6ecf7,#f3f0c8 70%,#c9e0a4)', dusk: 'linear-gradient(#f8c9a0,#c78fb5 60%,#5a4a7a)', night: 'linear-gradient(#0f1a2e,#2b2a5c)' };
const rp = (t, c, n) => Array(n).fill([t, c]);
const PRE = {
  'Romantic Reds': { w: '#2b2b33', rib: '#d4af37', rs: 'gold', l: [...rp('eucalyptus', '#6b9e6b', 3), ...rp('rose', '#e63950', 5), ...rp('rose', '#a8201a', 2), ...rp('babysbreath', '#ffffff', 3)] },
  'Sunny Meadow': { w: '#d2a679', rib: '#b08d57', rs: 'twine', bg: 'meadow', l: [...rp('sunflower', '#ffc300', 3), ...rp('daisy', '#ffffff', 4), ...rp('ruscus', '#6b9e6b', 3), ...rp('wheat', '#e0b84c', 3)] },
  'Lavender Dreams': { w: '#d9ccf5', rib: '#8e7cc3', bg: 'dusk', l: [...rp('lavender', '#b78cff', 5), ...rp('hydrangea', '#b78cff', 2), ...rp('peony', '#f4a6d7', 2), ...rp('fern', '#3f7a4f', 3)] },
  'Garden Whites': { cont: 'vase', rib: '#9cbf8f', bg: 'garden', l: [...rp('lily', '#fff6f6', 3), ...rp('peony', '#fff6f6', 2), ...rp('daisy', '#ffffff', 3), ...rp('eucalyptus', '#9cbf8f', 3)] },
  'Spring Tulips': { cont: 'basket', rib: '#e0577f', bg: 'meadow', l: [...rp('tulip', '#ff7a9c', 3), ...rp('tulip', '#ffd166', 3), ...rp('ranunculus', '#ff9f68', 2), ...rp('ruscus', '#6b9e6b', 3)] }
};
function load(o) {
  els.forEach(e => e.remove()); els.clear(); sel = null; S = Object.assign(D(), o); S.items.forEach(mk); $('count').textContent = S.items.length;
  $('wrapC').value = S.w; $('wrapP').value = S.p; $('ribC').value = S.rib; $('envC').value = S.env; $('msgOn').checked = S.on; $('msgBox').classList.toggle('hide', !S.on);
  ['to', 'from', 'text', 'media', 'cont', 'rs'].forEach(k => $(k).value = S[k]); $('bgSel').value = S.bg; $('pw').value = '';
  $('thumb').src = S.photo; $('thumb').classList.toggle('hide', !S.photo); applyStyle();
}
Object.entries(PRE).forEach(([n, { l, ...q }]) => { const b = document.createElement('button'); b.innerHTML = '<b>' + n + '</b><br><small>' + l.length + ' stems</small>'; b.style.borderLeft = '8px solid ' + (q.w || '#e6e6e6');
  b.onclick = () => { load({ ...q, items: l.map(([t, c]) => mkIt(t, c)) }); show('edit'); }; $('presets').append(b); });
$('scratch').onclick = () => { load({}); show('edit'); };
let scr = 'landing';
function show(s) { scr = s; $('landing').classList.toggle('hide', s !== 'landing'); $('start').classList.toggle('hide', s !== 'start'); $('backBtn').classList.toggle('hide', s === 'landing'); $('menu').classList.add('hide'); }
$('homeBtn').onclick = () => show('landing'); $('backBtn').onclick = () => show(scr === 'edit' ? 'start' : 'landing'); $('menuBtn').onclick = () => $('menu').classList.toggle('hide');
$('menu').onclick = e => { const k = e.target.dataset.k; if (!k) return; $('menu').classList.add('hide'); k === 'home' ? show('landing') : k === 'start' ? show('start') : info(k); };
$('cont').onchange = e => { S.cont = e.target.value; applyStyle(); }; $('rs').onchange = e => { S.rs = e.target.value; applyStyle(); }; $('bgSel').onchange = e => { S.bg = e.target.value; applyStyle(); };
$('media').oninput = e => S.media = e.target.value;
['#e0577f', '#d4af37', '#1f3d2b', '#2b3a5c', '#ffffff', '#7a1f2b', '#c0c0c0'].forEach(c => { const i = document.createElement('i'); i.style.background = c; i.onclick = () => { S.rib = $('ribC').value = c; applyStyle(); }; $('rsw').append(i); });
const snap = () => ({ ...S, pw: '', items: S.items.map(({ t, c, x, y, r, s, z }) => ({ t, c, x, y, r, s, z })) });
$('draft').onclick = () => { const d = JSON.parse(localStorage.getItem('bq') || '[]'); d.unshift({ n: (S.to ? 'For ' + S.to : 'Untitled') + ' · ' + new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }), s: snap() });
  try { localStorage.setItem('bq', JSON.stringify(d.slice(0, 8))); alert('Draft saved 💾 (find it in Menu → My drafts)'); } catch (e) { alert('Not enough space to save. Try a smaller photo.'); } };
// media in the letter
function media() { const m = $('lMedia'); m.innerHTML = ''; const u = S.media || ''; if (!/^https?:\/\//.test(u)) return; let s = ''; const y = u.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  if (y) s = 'https://www.youtube.com/embed/' + y[1]; else if (u.includes('open.spotify.com/')) s = u.replace('open.spotify.com/', 'open.spotify.com/embed/');
  if (s) { const f = document.createElement('iframe'); f.src = s; f.allow = 'autoplay;encrypted-media'; f.style.cssText = 'width:100%;height:' + (y ? 180 : 152) + 'px;border:0;border-radius:8px;margin-bottom:12px'; m.append(f); }
  else { const a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.textContent = '🎵 Open the song / video'; m.append(a); } }
const _m = $('mini').onclick; $('mini').onclick = () => { _m(); media(); };
// share, QR, email
let link = '';
const sha = async s => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, '0')).join('');
const QC = { Forest: ['#1f4d3a', '#f7f1e6'], Classic: ['#000000', '#ffffff'], Wine: ['#6b1e2e', '#fff8f0'], Navy: ['#1b2a5c', '#f4f7ff'], Plum: ['#4a2c6f', '#faf5ff'] };
Object.keys(QC).forEach(k => $('qrS').add(new Option(k + ' QR', k)));
function drawQR() { $('qr').innerHTML = ''; const [d, l] = QC[$('qrS').value]; if (window.QRCode && link.length < 1800) new QRCode($('qr'), { text: link, width: 170, height: 170, colorDark: d, colorLight: l }); else $('qr').textContent = 'QR codes need a short link. Connect Supabase (see supabase.sql).'; }
$('qrS').onchange = drawQR;
$('qrDl').onclick = () => { const c = $('qr').querySelector('canvas'); if (c) { const a = document.createElement('a'); a.download = 'bouquet-qr.png'; a.href = c.toDataURL(); a.click(); } };
$('copy').onclick = () => navigator.clipboard.writeText(link).then(() => $('linkOut').textContent = '📋 Copied!');
$('mail').onclick = () => { if (!link) return; if (link.length > 1500) return alert('Email links need to be short. Connect Supabase first (see supabase.sql).');
  const f = S.from || 'Someone who adores you', t = S.to || 'lovely';
  const body = `Dear ${t},\n\nA little garden has grown just for you. 🌷\n${f} arranged a bouquet, wrapped it with care${S.on ? ', and tucked a secret note inside' : ''}.\n\nOpen your gift here:\n${link}\n${S.pw ? '\n🔒 It is locked with a password. Ask ' + f + ' for it.\n' : ''}\nWith petals and wishes,\nMake Your Own Bouquet 💐`;
  location.href = `mailto:${encodeURIComponent($('email').value)}?subject=${encodeURIComponent('💐 A gift has arrived for you')}&body=${encodeURIComponent(body)}`; };
$('share').onclick = async () => {
  if (!S.items.length) return alert('Add a few flowers first 🌸');
  S.pw = $('pw').value ? await sha($('pw').value) : ''; const data = snap(); data.pw = S.pw; const base = location.origin + location.pathname; $('linkOut').textContent = 'Creating link…';
  try {
    if (SB.url) { const id = Math.random().toString(36).slice(2, 10);
      const r = await fetch(SB.url + '/rest/v1/gifts', { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ id, data }) });
      if (!r.ok) throw new Error(await r.text()); link = `${base}?g=${id}`;
    } else link = `${base}#d=${await pack(JSON.stringify(data))}`;
    $('linkOut').textContent = '💌 Link ready! Copy it, scan the QR, or email it.'; $('shareBox').classList.remove('hide'); $('linkTxt').value = link; navigator.clipboard.writeText(link).catch(() => {}); drawQR();
  } catch (e) { $('linkOut').textContent = 'Could not create link: ' + e.message; }
};
// receiver experience
function burst() { const ks = Object.keys(TYPES).filter(k => TYPES[k][1] === 'b'); for (let i = 0; i < 36; i++) { const d = document.createElement('div'); d.className = 'bp'; d.innerHTML = TYPES[ks[rnd(0, ks.length - 1)]].svg(WARM[rnd(0, WARM.length - 1)]);
  d.style.cssText = `left:${rnd(0, 90)}vw;top:${rnd(0, 80)}vh;--s:${rnd(5, 12) / 10};animation-delay:${rnd(0, 12) / 10}s`; document.body.append(d); setTimeout(() => d.remove(), 3800); } }
function recvCover() { $('landing').querySelector('h1').textContent = 'A gift has arrived 💐'; $('ltag').textContent = (S.from ? S.from + ' made' : 'Someone made') + ' a bouquet just for you.' + (S.pw ? ' Enter the password to open it.' : ' Tap below to open it.');
  $('go').textContent = 'Open your gift'; if (S.pw) $('pwIn').classList.remove('hide'); $('how').classList.add('hide'); $('about').classList.add('hide'); }
$('go').onclick = async () => { if (!view) return show('start');
  if (S.pw && await sha($('pwIn').value) !== S.pw) { $('pwIn').value = ''; $('pwIn').placeholder = 'Wrong password, try again'; return; }
  $('landing').classList.add('hide'); $('frame').classList.add('reveal'); burst(); $('mk').classList.remove('hide'); };
$('mk').onclick = () => location.href = location.pathname;

// ---- boot ----
(async () => {
  try {
    const g = new URLSearchParams(location.search).get('g'), h = location.hash.startsWith('#d=') ? location.hash.slice(3) : '';
    if (g && SB.url) S = (await (await fetch(`${SB.url}/rest/v1/gifts?id=eq.${encodeURIComponent(g)}&select=data`, { headers: H() })).json())[0].data;
    else if (h) S = JSON.parse(await unpack(h));
    view = !!(g || h);
  } catch (e) { console.error('Bad gift link', e); }
  S = Object.assign(D(), S);
  if (view) { document.body.classList.add('view'); recvCover(); }
  S.items.forEach(mk); $('count').textContent = S.items.length; applyStyle(); drawPicker();
  if (!view) { $('wrapC').value = S.w; }
})();

// ---- landing page ----
const INFO = { terms: ['Terms & Conditions', 'By using Make Your Own Bouquet you agree to use it kindly: no harassment, hateful or illegal content, and only photos, music and videos you have the right to share. Gifts are provided as-is and may be removed at any time.\n\n(Draft terms - review before public launch.)'],
  privacy: ['Privacy Policy', 'When you create a gift link, your bouquet, message, photo and optional password (stored as a hash) are saved so the link can open. Drafts stay in your own browser. Anyone with a gift link can view that gift. Password protection is a light lock, not encryption.\n\n(Draft policy - review before public launch.)'], how: ['How it works', '1. Pick flowers, fillers and foliage, then drag them into place.\n2. Choose a wrapper and ribbon.\n3. Optionally tuck in an envelope with a message and photo.\n4. Press "Create gift link" and send it. Your person taps the envelope to read it.'],
  about: ['About', 'Make Your Own Bouquet is a little digital gift you build, wrap and send as a link. Gifts are only stored so the link can open them.'] };
[['eucalyptus', '#6b9e6b', -32], ['fern', '#3f7a4f', 30], ['rose', '#e63950', -14], ['peony', '#ff7a9c', 12], ['lily', '#fff6f6', -3], ['babysbreath', '#ffffff', 24], ['tulip', '#ffd166', -24]].forEach(([t, c, r], i) => {
  const d = document.createElement('div'); d.className = 'lb'; d.innerHTML = TYPES[t].svg(c); d.style.cssText = `--r:${r}deg;animation-delay:${i * .3}s`; $('lbloom').append(d); });
$('how').onclick = () => info('how'); $('about').onclick = () => info('about');
const info = k => { $('iB').textContent = '';
  if (k === 'drafts') { $('iT').textContent = 'My drafts'; const d = JSON.parse(localStorage.getItem('bq') || '[]'); if (!d.length) $('iB').textContent = 'No drafts yet. Use 💾 Draft while you build.';
    d.forEach((x, i) => { const b = document.createElement('button'), r = document.createElement('button'); b.textContent = '📂 ' + x.n; b.onclick = () => { load(x.s); show('edit'); $('info').classList.add('hide'); };
      r.textContent = '🗑'; r.onclick = () => { d.splice(i, 1); localStorage.setItem('bq', JSON.stringify(d)); info('drafts'); }; $('iB').append(b, r, document.createElement('br')); }); }
  else { $('iT').textContent = INFO[k][0]; $('iB').textContent = INFO[k][1]; } $('info').classList.remove('hide'); };
$('iX').onclick = () => $('info').classList.add('hide');
document.querySelector('#panel h1').onclick = () => $('landing').classList.remove('hide');