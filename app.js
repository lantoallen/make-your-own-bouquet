// Clean up the Supabase URL if it has a trailing slash or /rest/v1 on the end
SB.url = (SB.url || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, ''); SB.key = (SB.key || '').trim();

const $ = id => document.getElementById(id), rnd = (a, b) => Math.round(a + Math.random() * (b - a));
const sh = (c, p) => { const n = parseInt(c.slice(1), 16), f = p < 0 ? 0 : 255, t = Math.abs(p);
  return '#' + [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round((f - v) * t + v).toString(16).padStart(2, '0')).join(''); };
const PT = { round: 'M0 0C-22-4-24-36 0-38C24-36 22-4 0 0', point: 'M0 0C-11-12-9-34 0-46C9-34 11-12 0 0', thin: 'M0 0C-4-10-4-32 0-42C4-32 4-10 0 0', wide: 'M0 0C-30-6-30-40 0-40C30-40 30-6 0 0' };
const RG = '<defs><filter id="rg" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter></defs>';
const R = (p, n, f, s = 1, o = 0) => Array.from({ length: n }, (_, i) => `<g transform="rotate(${o + i * 360 / n}) scale(${s})"><path d="${PT[p]}" fill="${sh(f, [-.1, 0, .09][i % 3])}" stroke="${sh(f, -.35)}" stroke-width=".7"/><path d="M0-6V-28M0-10L-6-24M0-10L6-24" stroke="${sh(f, -.3)}" stroke-opacity=".45" stroke-width=".6" fill="none"/></g>`).join('') + `<circle r="${9 * s}" fill="#000" opacity=".18"/>`;
const STEM = '<path d="M50 45Q44 100 50 160" stroke="#3f6b33" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M49 50Q43 100 49 158" stroke="#7fb069" stroke-width="1.4" fill="none"/><path d="M47 112q-24-2-30-28 24 2 30 28z" fill="#5f9448" stroke="#3f6b33" stroke-width=".6"/><path d="M47 112Q35 100 20 87" stroke="#3f6b33" stroke-width=".7" fill="none"/><ellipse cx="50" cy="48" rx="8" ry="4" fill="#4e7a3e"/>';
const bloom = f => c => `<svg viewBox="0 0 100 160">${RG}${STEM}<g filter="url(#rg)"><g transform="translate(50 45)">${f(c)}</g></g></svg>`;
const GREEN = '#4f7f3f';
const twig = (c, big) => `<svg viewBox="0 0 100 160">${[[50, 40], [30, 58], [70, 58], [18, 84], [82, 84], [40, 24], [62, 28]].map(([x, y]) =>
  `<path d="M50 160Q50 100 ${x} ${y}" stroke="${GREEN}" fill="none" stroke-width="1.5"/>` + [[0, 0, 1], [7, 6, .75], [-6, 7, .65]].map(([dx, dy, k], n) => `<circle cx="${x + dx}" cy="${y + dy}" r="${(big ? 7 : 5) * k}" fill="${sh(c, n * .08)}" stroke="${sh(c, -.3)}" stroke-width=".5"/>`).join('')).join('')}</svg>`;
const leafy = (rx, ry, ang, n) => c => `<svg viewBox="0 0 100 160">${RG}<g filter="url(#rg)"><path d="M50 160Q44 80 50 14" stroke="${sh(c, -.4)}" stroke-width="2.5" fill="none"/>${Array.from({ length: n }, (_, i) => { const y = 20 + i * 130 / n;
  return [-1, 1].map(s => `<g transform="translate(${50 + s * 3} ${y}) rotate(${s < 0 ? 180 + ang : -ang})"><path d="M0 0Q${rx / 2} ${-ry * 1.6} ${rx * 2} 0Q${rx / 2} ${ry * 1.6} 0 0" fill="${sh(c, (i % 2) * .12 - .05)}" stroke="${sh(c, -.35)}" stroke-width=".6"/><path d="M0 0H${rx * 1.9}" stroke="${sh(c, -.4)}" stroke-width=".6" opacity=".7"/></g>`).join(''); }).join('')}</g></svg>`;

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
const WRAPS = ['#d2a679', '#e6cdb8', '#f1e6d2', '#b9c9b0', '#c9bfe0', '#2b2b33', '#2b3a5c', '#f7f2ea'];

const D = () => ({ items: [], w: '#e6cdb8', p: '', rib: '#8f3b4a', env: '#e8dcc8', on: false, mus: false, ink: '', lp: 'pp-plain', lf: 'f-serif', la: 'a-left', ph: 'ph-top', pf: 'pf-round', pet: false, cont: 'paper', rs: 'bow', bg: 'blush', bgc: '', pw: '', media: '', to: '', from: '', text: '', photo: '', dark: false });
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
function select(it) { sel = it; els.forEach((e, i) => e.classList.toggle('sel', i === it)); $('tools').classList.toggle('hide', !it); $('isw').classList.toggle('hide', !it); $('isw').innerHTML = '';
  if (it) TYPES[it.t][2].forEach(c => { const i = document.createElement('i'); i.style.background = c; i.onclick = () => { it.c = c; els.get(it).innerHTML = TYPES[it.t].svg(c); }; $('isw').append(i); }); }
$('tools').onclick = ev => { const a = ev.target.dataset.a; if (!a || !sel) return;
  if (a === 'd') { els.get(sel).remove(); els.delete(sel); S.items = S.items.filter(i => i !== sel); sel = null; $('count').textContent = S.items.length; $('tools').classList.add('hide'); return; }
  if (a === 's-') sel.s = Math.max(.4, sel.s - .1); if (a === 's+') sel.s = Math.min(2, sel.s + .1);
  if (a === 'r-') sel.r -= 12; if (a === 'r+') sel.r += 12; if (a === 'f') sel.z = sel.z >= 3 ? 0 : 3; place(sel); };
document.addEventListener('pointerdown', e => { if (!e.target.closest('.sp,#tools,#isw,#grid,#sw')) select(null); });

// ---- wrapper / theme / message ----
function applyStyle() {
  $('frame').className = S.cont || 'paper'; const rk = RIB[S.rs] || ['band', 'twine', 'lace'].includes(S.rs) ? S.rs : 'bow'; $('bow').className = rk; $('bow').innerHTML = ribbon(rk, S.rib); $('stage').style.background = S.bg === 'blush' && S.bgc ? S.bgc : scene(S.bg); $('bgcRow').classList.toggle('hide', S.bg !== 'blush');
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
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); S.photo = c.toDataURL('image/jpeg', .65); $('thumb').src = S.photo; $('thumb').classList.remove('hide'); prev(); }; img.src = URL.createObjectURL(f); };

// ---- envelope letter ----
$('mini').onclick = () => { $('lTo').textContent = S.to ? 'Dear ' + S.to + ',' : ''; $('lText').textContent = S.text; $('lFrom').textContent = S.from ? '— ' + S.from : '';
  $('lImg').classList.toggle('hide', !S.photo); if (S.photo) $('lImg').src = S.photo;
  $('env').className = 'env'; $('ov').classList.remove('hide'); $('hint').classList.add('hide');
  setTimeout(() => $('env').classList.add('open'), 150); setTimeout(() => $('env').classList.add('gone'), 1900); };
$('close').onclick = () => $('ov').classList.add('hide');

// ---- music, petals, png ----
let playing = false;
let mAC, mT;
const music = on => { playing = on; $('musicBtn').textContent = $('musicBtn2').textContent = on ? '⏸️ Music' : '🎵 Music'; clearInterval(mT); if (!on) return;
  mAC = mAC || new (window.AudioContext || window.webkitAudioContext)(); mAC.resume(); const n = [261.6, 329.6, 392, 523.3, 392, 329.6, 293.7, 349.2, 440, 587.3, 440, 349.2]; let i = 0;
  const p = () => { const o = mAC.createOscillator(), g = mAC.createGain(), t = mAC.currentTime; o.type = 'triangle'; o.frequency.value = n[i++ % n.length]; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.08, t + .05); g.gain.exponentialRampToValueAtTime(.001, t + 1.6); o.connect(g).connect(mAC.destination); o.start(); o.stop(t + 1.7); };
  p(); mT = setInterval(p, 700); };
$('musicBtn').onclick = $('musicBtn2').onclick = () => music(!playing);
$('musOn').onchange = e => S.mus = e.target.checked;
['lp', 'lf', 'la', 'ph', 'pf'].forEach(k => $(k).onchange = e => S[k] = e.target.value);
['🌸', '🌷', '🌼', '🌺'].forEach((p, j) => { for (let i = 0; i < 4; i++) { const s = document.createElement('span'); s.textContent = p; s.style.cssText = `left:${rnd(0, 95)}vw;font-size:${rnd(14, 26)}px;animation-duration:${rnd(9, 18)}s;animation-delay:-${rnd(0, 15)}s`; $('petals').append(s); } });
$('save').onclick = () => html2canvas($('frame'), { backgroundColor: null }).then(c => { const a = document.createElement('a'); a.download = 'my-bouquet.png'; a.href = c.toDataURL(); a.click(); });

// ---- share ----
const b64 = buf => new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result.split(',')[1].replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')); f.readAsDataURL(new Blob([buf])); });
const pack = async s => b64(await new Response(new Blob([s]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());
const unpack = async h => { const bin = atob(h.replace(/-/g, '+').replace(/_/g, '/')); return new Response(new Blob([Uint8Array.from(bin, c => c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text(); };
const H = () => ({ apikey: SB.key, Authorization: 'Bearer ' + SB.key });
// ---- v2: presets, containers, drafts, share, password ----
const rp = (t, c, n) => Array(n).fill([t, c]);
const PRE = {
  'Romantic Reds': { w: '#2b2b33', rib: '#d4af37', rs: 'flow', l: [...rp('eucalyptus', '#6b9e6b', 3), ...rp('rose', '#e63950', 5), ...rp('rose', '#a8201a', 2), ...rp('babysbreath', '#ffffff', 3)] },
  'Sunny Meadow': { w: '#d2a679', rib: '#b08d57', rs: 'twine', bg: 'meadow', l: [...rp('sunflower', '#ffc300', 3), ...rp('daisy', '#ffffff', 4), ...rp('ruscus', '#6b9e6b', 3), ...rp('wheat', '#e0b84c', 3)] },
  'Lavender Dreams': { w: '#d9ccf5', rs: 'double', rib: '#8e7cc3', bg: 'dusk', l: [...rp('lavender', '#b78cff', 5), ...rp('hydrangea', '#b78cff', 2), ...rp('peony', '#f4a6d7', 2), ...rp('fern', '#3f7a4f', 3)] },
  'Garden Whites': { cont: 'vase', w: '#bfe0ea', rib: '#9cbf8f', bg: 'garden', l: [...rp('lily', '#fff6f6', 3), ...rp('peony', '#fff6f6', 2), ...rp('daisy', '#ffffff', 3), ...rp('eucalyptus', '#9cbf8f', 3)] },
  'Spring Tulips': { cont: 'basket', w: '#b8864b', rib: '#e0577f', bg: 'meadow', l: [...rp('tulip', '#ff7a9c', 3), ...rp('tulip', '#ffd166', 3), ...rp('ranunculus', '#ff9f68', 2), ...rp('ruscus', '#6b9e6b', 3)] }
};
function load(o) {
  els.forEach(e => e.remove()); els.clear(); sel = null; S = Object.assign(D(), o); if (!S.from) S.from = localStorage.getItem('bq_name') || ''; S.items.forEach(mk); $('count').textContent = S.items.length;
  $('wrapC').value = S.w; fillPat(); $('ribC').value = S.rib; $('envC').value = S.env; $('msgOn').checked = S.on; $('msgBox').classList.toggle('hide', !S.on);
  ['to', 'from', 'text', 'media', 'cont', 'rs', 'lp', 'lf', 'la', 'ph', 'pf'].forEach(k => $(k).value = S[k]); $('musOn').checked = !!S.mus; $('ink').value = S.ink || '#33281f'; prev(); $('bgSel').value = S.bg; $('bgc').value = S.bgc || '#e9dfcb'; $('pw').value = '';
  $('thumb').src = S.photo; $('thumb').classList.toggle('hide', !S.photo); applyStyle();
}
Object.entries(PRE).forEach(([n, p]) => { p.items = p.l.map(([t, c]) => mkIt(t, c)); const { l, items, ...q } = p, b = document.createElement('button'), v = document.createElement('div'), bx = document.createElement('div'), w = document.createElement('div');
  v.className = 'pv'; bx.className = 'pvb'; w.className = 'pvw'; w.style.background = q.w || '#f1e6d2';
  [...items].sort((x, y) => x.z - y.z).forEach(it => { const e = document.createElement('div'); e.className = 'sp'; e.innerHTML = TYPES[it.t].svg(it.c); e.style.transform = `translate(${it.x}px,${it.y}px) rotate(${it.r}deg) scale(${it.s})`; bx.append(e); });
  v.append(bx, w); b.append(v, Object.assign(document.createElement('b'), { textContent: n })); b.onclick = () => { load({ ...q, items: items.map(i => ({ ...i })) }); show('edit'); }; $('presets').append(b); });
$('scratch').onclick = () => { load({}); show('edit'); };
let scr = 'landing';
function show(s) { scr = s; $('ov').classList.add('hide'); $('info').classList.add('hide'); $('landing').classList.toggle('hide', s !== 'landing'); $('start').classList.toggle('hide', s !== 'start'); $('backBtn').classList.toggle('hide', s === 'landing'); $('menu').classList.add('hide'); $('ov').classList.add('hide'); $('info').classList.add('hide'); $('resume').classList.toggle('hide', s !== 'start' || !S.items.length); }
$('homeBtn').onclick = () => show('landing'); $('backBtn').onclick = () => { if (!$('ov').classList.contains('hide')) return $('close').click(); show(scr === 'edit' ? 'start' : 'landing'); }; $('menuBtn').onclick = () => $('menu').classList.toggle('hide');
$('menu').onclick = e => { const k = e.target.dataset.k; if (!k) return; $('menu').classList.add('hide'); k === 'home' ? show('landing') : k === 'start' ? show('start') : info(k); };
$('cont').onchange = e => { S.cont = e.target.value; S.w = $('wrapC').value = CW[S.cont]; fillPat(); applyStyle(); }; $('rs').onchange = e => { S.rs = e.target.value; applyStyle(); }; $('bgSel').onchange = e => { S.bg = e.target.value; applyStyle(); };
$('media').oninput = e => S.media = e.target.value;
['#8f3b4a', '#d4af37', '#1f3d2b', '#2b3a5c', '#f7f2ea', '#c9a0a0', '#7a6a9a', '#b0562f', '#4f7a6a', '#c0c0c0', '#2b2b33', '#e08a9a'].forEach(c => { const i = document.createElement('i'); i.style.background = c; i.onclick = () => { S.rib = $('ribC').value = c; applyStyle(); }; $('rsw').append(i); });
const snap = () => ({ ...S, pw: '', items: S.items.map(({ t, c, x, y, r, s, z }) => ({ t, c, x, y, r, s, z })) });
$('draft').onclick = () => { const d = JSON.parse(localStorage.getItem('bq') || '[]'); d.unshift({ n: (S.to ? 'For ' + S.to : 'Untitled') + ' · ' + new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }), s: snap() });
  try { localStorage.setItem('bq', JSON.stringify(d.slice(0, 8))); alert('Draft saved 💾 (find it in Menu → My drafts)'); } catch (e) { alert('Not enough space to save. Try a smaller photo.'); } };
// media in the letter
function media() { const m = $('lMedia'); m.innerHTML = ''; const u = S.media || ''; if (!/^https?:\/\//.test(u)) return; let s = ''; const y = u.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  if (y) s = 'https://www.youtube.com/embed/' + y[1]; else if (u.includes('open.spotify.com/')) s = u.replace('open.spotify.com/', 'open.spotify.com/embed/');
  if (s) { const f = document.createElement('iframe'); f.src = s; f.allow = 'autoplay;encrypted-media'; f.style.cssText = 'width:100%;height:' + (y ? 180 : 152) + 'px;border:0;border-radius:8px;margin-bottom:12px'; m.append(f); }
  else { const a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.textContent = '🎵 Open the song / video'; m.append(a); } }
const _m = $('mini').onclick; $('mini').onclick = () => { _m(); media(); const L = document.querySelector('.letter'); L.className = 'letter ' + [S.lp, S.lf, S.la, S.ph, S.pf].join(' '); L.style.color = S.ink || ''; };
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
  $('landing').classList.add('hide'); $('frame').classList.add('reveal'); burst(); if (S.mus) music(true); $('mk').classList.remove('hide'); };
$('mk').onclick = () => location.href = location.pathname;

// ---- v3: containers, ribbons, backdrops, letter preview ----
const PAT = { paper: [['', 'Smooth'], ['p-dots', 'Polka dots'], ['p-stripe', 'Stripes'], ['p-check', 'Gingham'], ['p-floral', 'Floral']], vase: [['v-clear', 'Clear glass'], ['v-frost', 'Frosted'], ['v-stripe', 'Striped']], basket: [['b-weave', 'Woven'], ['b-lattice', 'Lattice'], ['b-rattan', 'Rattan']] };
const CW = { paper: '#e6cdb8', vase: '#bfe0ea', basket: '#b8864b' };
function fillPat() { const k = S.cont || 'paper'; $('wrapP').innerHTML = ''; PAT[k].forEach(([v, l]) => $('wrapP').add(new Option(l, v))); if (!PAT[k].some(x => x[0] === S.p)) S.p = PAT[k][0][0]; $('wrapP').value = S.p; }
const rb = (c, k, s = 1, y = 0) => { const d = sh(c, -.28), l = sh(c, .22);
  const loops = `<path d="M80 36C58 4 18 4 16 30C14 56 56 54 80 38Z" fill="${c}" stroke="${d}"/><path d="M80 36C102 4 142 4 144 30C146 56 104 54 80 38Z" fill="${l}" stroke="${d}"/><path d="M80 37C58 30 36 26 22 30M80 37C102 30 124 26 138 30" stroke="${d}" fill="none" opacity=".6"/>`;
  const tails = k === 'flow' ? `<path d="M76 42C40 78 104 104 58 150C44 164 56 184 70 190L74 176L90 194C92 150 40 120 86 46Z" fill="${c}" stroke="${d}"/><path d="M84 42C122 74 62 108 106 156C118 170 108 186 96 190L100 176L84 198C80 150 130 118 80 46Z" fill="${l}" stroke="${d}"/>` : `<path d="M76 42C62 74 54 104 44 152L60 142L70 158C72 112 80 82 84 46Z" fill="${c}" stroke="${d}"/><path d="M84 42C98 74 106 104 116 152L100 142L90 158C88 112 80 82 76 46Z" fill="${l}" stroke="${d}"/>`;
  return `<g transform="translate(80 ${y}) scale(${s}) translate(-80 0)">${tails}${loops}<rect x="68" y="28" width="24" height="18" rx="7" fill="${d}"/><path d="M72 33H88" stroke="${l}" stroke-width="1.5" opacity=".6"/></g>`; };
const RIB = { bow: c => rb(c), flow: c => rb(c, 'flow'), double: c => rb(sh(c, .25), '', 1.2, -4) + rb(c, '', .8, 10),
  rosette: c => `<path d="M74 66L58 130L72 122L80 136L84 70ZM86 66L102 130L88 122L80 136Z" fill="${c}" stroke="${sh(c, -.3)}"/>` + [30, 24, 18, 12, 6].map((r, i) => `<circle cx="80" cy="42" r="${r}" fill="${sh(c, [0, -.18, .12, -.25, .2][i])}" stroke="${sh(c, -.35)}" stroke-width=".8"${i % 2 ? ' stroke-dasharray="3 2"' : ''}/>`).join('') };
const ribbon = (k, c) => RIB[k] ? `<svg viewBox="0 0 160 200">${RIB[k](c)}</svg>` : '';
const SC = {};
const scene = k => { if (SC[k] !== undefined) return SC[k]; let sd = 7; const r = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
  const dots = (n, y0, y1, cols, a, b) => Array.from({ length: n }, () => `<circle cx="${r() * 800 | 0}" cy="${y0 + r() * (y1 - y0) | 0}" r="${(a + r() * (b - a)).toFixed(1)}" fill="${cols[r() * cols.length | 0]}"/>`).join('');
  const grid = Array.from({ length: 9 }, (_, i) => `M${i * 100} 0V600M0 ${i * 100}H800`).join('');
  const B = {
    garden: `<rect width="800" height="600" fill="#cfe3d1"/><rect y="230" width="800" height="150" rx="40" fill="#4f7a4b"/><path d="M0 120H800M0 200H800M120 0V230M300 0V230M480 0V230M660 0V230" stroke="#f4efe6" stroke-width="5" opacity=".8"/><rect y="360" width="800" height="240" fill="#8fb27a"/>${dots(70, 300, 590, ['#e8b4c0', '#f4d58d', '#fff6f0', '#c9a0dc', '#e08a6a'], 4, 9)}`,
    meadow: `<rect width="800" height="600" fill="#d8ebf2"/><circle cx="620" cy="110" r="50" fill="#f6d88a"/><ellipse cx="200" cy="620" rx="520" ry="260" fill="#a8c97f"/><ellipse cx="650" cy="640" rx="520" ry="240" fill="#8fb56a"/>${dots(80, 380, 590, ['#fff6f0', '#f4d58d', '#e8b4c0', '#c9a0dc'], 3, 7)}`,
    greenhouse: `<rect width="800" height="600" fill="#dfeadf"/><path d="${grid}" stroke="#fff" stroke-width="4" opacity=".8"/><rect y="470" width="800" height="130" fill="#6e5238"/><rect y="470" width="800" height="16" fill="#8a6a4a"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${i * 100 + 20} 410h60l-10 60h-40z" fill="#c0653a"/><circle cx="${i * 100 + 50}" cy="398" r="${22 + (i % 3) * 5}" fill="#5f8f55"/>`).join('')}`,
    blossom: `<rect width="800" height="600" fill="#f2e3e1"/><path d="M-10 90Q200 40 420 120T800 60" stroke="#6b4a3a" stroke-width="8" fill="none"/><path d="M300 110Q380 190 330 260" stroke="#6b4a3a" stroke-width="5" fill="none"/>${dots(90, 30, 190, ['#f3b8c6', '#f8d4dc', '#e99aae', '#fff0f2'], 6, 12)}<rect y="520" width="800" height="80" fill="#e6d3cf"/>`,
    table: `<rect width="800" height="600" fill="#e7dccb"/><rect x="540" y="60" width="180" height="220" fill="#f6f1e6" stroke="#b9a58a" stroke-width="8"/><path d="M630 60V280M540 170H720" stroke="#b9a58a" stroke-width="5"/>${Array.from({ length: 7 }, (_, i) => `<rect y="${340 + i * 40}" width="800" height="40" fill="${i % 2 ? '#a97b4d' : '#b88b5c'}"/>`).join('')}`,
    dusk: `<rect width="800" height="600" fill="#e9b99a"/><circle cx="400" cy="380" r="80" fill="#f4d58d"/><path d="M0 600V430Q200 380 400 440T800 400V600Z" fill="#7a5a7a"/><path d="M0 600V500Q250 450 500 510T800 480V600Z" fill="#4b3a5e"/>`,
    night: `<rect width="800" height="600" fill="#1c2540"/>${dots(70, 0, 400, ['#fff', '#f4efe6'], 1, 2.4)}<circle cx="620" cy="110" r="42" fill="#f4efe6"/><circle cx="640" cy="100" r="38" fill="#1c2540"/><path d="M0 600V470Q200 420 420 480T800 450V600Z" fill="#101830"/>` };
  return SC[k] = B[k] ? `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' + B[k] + '</svg>')}") center bottom/cover` : ''; };
function prev() { const p = $('lprev'); p.className = 'lprev ' + [S.lp, S.lf, S.la, S.pf].join(' '); p.style.color = S.ink || ''; p.innerHTML = '';
  const t = document.createElement('h4'), x = document.createElement('p'), f = document.createElement('p'); t.textContent = S.to ? 'Dear ' + S.to + ',' : 'Dear friend,'; x.textContent = S.text || 'Your message will look like this…'; f.className = 'pfrom'; f.textContent = '— ' + (S.from || 'You');
  const parts = [t, x, f]; if (S.photo) { const i = document.createElement('img'); i.src = S.photo; i.className = 'pimg'; parts.splice(S.ph === 'ph-below' ? 2 : 1, 0, i); } p.append(...parts); }
$('msgBox').addEventListener('input', prev); $('msgBox').addEventListener('change', prev); $('ink').oninput = e => S.ink = e.target.value;
$('resume').onclick = () => show('edit');
$('bgc').oninput = e => { S.bgc = e.target.value; applyStyle(); };
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
  if (!view) { $('wrapC').value = S.w; } fillPat(); prev();
})();

// ---- landing page ----
const INFO = {
  terms: ['Terms & Conditions', 'Last updated: October 2026', [['1. Using the app', 'Make Your Own Bouquet lets you build a digital bouquet and share it as a link. Please use it kindly and lawfully.'], ['2. Your content', 'You are responsible for the messages, photos, music and video links you add. Only share what you have the right to share. Do not add anything hateful, harassing, sexual or illegal.'], ['3. Gift links', 'Anyone who has a gift link can open it. A password adds a light lock but does not guarantee secrecy, so do not put sensitive information in a gift.'], ['4. Availability', 'The app is provided as is, with no promise that it will always be available or error-free. Gifts may be removed or expire at any time.'], ['5. Removal', 'Gifts that break these terms may be removed.'], ['6. Changes', 'These terms may change as the app grows. Continuing to use the app means you accept the updated terms.']]],
  privacy: ['Privacy Policy', 'Last updated: October 2026', [['What is stored', 'When you create a gift link, the bouquet arrangement, message, photo, optional music or video link, and an optional password (stored only as a hash) are saved in a Supabase database so the link can open.'], ['On your device only', 'Drafts and your profile name are kept in your browser and never leave your device.'], ['Email', '"Send by email" opens your own mail app. We never see the address you type.'], ['Third parties', 'Supabase (storage), Google Fonts and cdnjs (fonts and libraries), and YouTube or Spotify if you add a link. They may set their own cookies.'], ['What we do not do', 'No ads and no selling of data.'], ['Your choices', 'Clearing your browser data removes drafts. To have a gift deleted, contact the app owner.'], ['Children', 'The app is not intended for children under 13.']]],
  how: ['How it works', 'Six easy steps', [['1. Start', 'Choose a ready-made bouquet or start from scratch.'], ['2. Arrange', 'Add flowers, fillers and foliage. Drag, resize, rotate and recolor each stem.'], ['3. Wrap and style', 'Pick paper, a glass vase or a basket, plus a ribbon and a backdrop.'], ['4. Write a letter', 'Choose the paper, font, ink, photo and a song or video, and watch the live preview.'], ['5. Lock it (optional)', 'Add a password if you like, then create the gift link.'], ['6. Share', 'Send it by link, QR code or email. Your person opens the gift and taps the envelope.']]],
  about: ['About', 'Make Your Own Bouquet', [['', 'A little digital gift you build, wrap and send as a link. Choose flowers, fillers and foliage, tuck a letter inside, and let someone special open it.'], ['Made by', 'Allen, 2026.']]] };
[['eucalyptus', '#6b9e6b', -32], ['fern', '#3f7a4f', 30], ['rose', '#e63950', -14], ['peony', '#ff7a9c', 12], ['lily', '#fff6f6', -3], ['babysbreath', '#ffffff', 24], ['tulip', '#ffd166', -24]].forEach(([t, c, r], i) => {
  const d = document.createElement('div'); d.className = 'lb'; d.innerHTML = TYPES[t].svg(c); d.style.cssText = `--r:${r}deg;animation-delay:${i * .3}s`; $('lbloom').append(d); });
$('how').onclick = () => info('how'); $('about').onclick = () => info('about');
const info = k => { const b = $('iB'); b.innerHTML = ''; $('iS').textContent = '';
  if (k === 'profile') { $('iT').textContent = 'Your profile'; const i = document.createElement('input'), s = document.createElement('button'); i.placeholder = 'Your name (used as "From")'; i.value = localStorage.getItem('bq_name') || ''; s.textContent = 'Save'; s.onclick = () => { localStorage.setItem('bq_name', i.value); $('info').classList.add('hide'); }; b.append(i, s); }
  else if (k === 'drafts') { $('iT').textContent = 'My drafts'; const d = JSON.parse(localStorage.getItem('bq') || '[]'); if (!d.length) b.textContent = 'No drafts yet. Use 💾 Draft while you build.';
    d.forEach((x, n) => { const o = document.createElement('button'), r = document.createElement('button'); o.textContent = '📂 ' + x.n; o.onclick = () => { load(x.s); show('edit'); }; r.textContent = '🗑'; r.onclick = () => { d.splice(n, 1); localStorage.setItem('bq', JSON.stringify(d)); info('drafts'); }; b.append(o, r, document.createElement('br')); }); }
  else { const [t, s, secs] = INFO[k]; $('iT').textContent = t; $('iS').textContent = s; secs.forEach(([hd, p]) => { const d = document.createElement('div'); d.className = 'sec'; if (hd) { const e = document.createElement('h3'); e.textContent = hd; d.append(e); } const q = document.createElement('p'); q.textContent = p; d.append(q); b.append(d); }); }
  $('info').classList.remove('hide'); };
$('iX').onclick = () => $('info').classList.add('hide');
document.querySelector('#panel h1').onclick = () => $('landing').classList.remove('hide');

[['fern', '#3f5a3a', -35, 'left:-30px;bottom:-20px'], ['eucalyptus', '#7a9a82', 35, 'right:-30px;bottom:-20px'], ['olive', '#8a9a5b', 150, 'left:-20px;top:70px'], ['ruscus', '#4e6b45', -150, 'right:-20px;top:70px']].forEach(([t, c, r, pos]) => {
  const d = document.createElement('div'); d.className = 'sprig'; d.innerHTML = TYPES[t].svg(c); d.style.cssText = `--r:${r}deg;${pos}`; $('landing').prepend(d); });
$('landing').querySelector('footer').onclick = e => { const k = e.target.dataset.k; if (k) info(k); };

$('ov').onclick = e => { if (e.target === $('ov')) $('close').click(); }; $('info').onclick = e => { if (e.target === $('info')) $('iX').click(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') { $('close').click(); $('iX').click(); } });