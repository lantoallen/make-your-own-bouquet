// Make Your Own Bouquet: editor, sharing and gift opening. Flower drawings live in flowers.js.
SB.url = (SB.url || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, ''); SB.key = (SB.key || '').trim();

const $ = id => document.getElementById(id);
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const el = (tag, { dataset, ...props } = {}, ...kids) => { const e = document.createElement(tag); Object.assign(e, props); if (dataset) Object.assign(e.dataset, dataset); e.append(...kids); return e; };
const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
const lsRaw = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
let tT; const toast = m => { const t = $('toast'); t.replaceChildren(el('span', { className: 'ti' }), el('span', { textContent: m })); t.classList.remove('hide'); clearTimeout(tT); tT = setTimeout(() => t.classList.add('hide'), 4200); };
$('toast').onclick = () => $('toast').classList.add('hide');

// color swatches are real buttons with a plain-language name (keyboard and screen-reader friendly)
const cname = h => { const n = parseInt(h.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (l > .93) return 'white'; if (l < .14) return 'black'; if (d < .08) return l > .6 ? 'light gray' : 'gray';
  let hu = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hu *= 60;
  const base = hu < 15 || hu >= 345 ? 'red' : hu < 40 ? 'orange' : hu < 70 ? 'yellow' : hu < 160 ? 'green' : hu < 200 ? 'teal' : hu < 255 ? 'blue' : hu < 290 ? 'purple' : 'pink';
  return (l > .8 ? 'pale ' : l < .3 ? 'dark ' : '') + (base === 'red' && l > .6 ? 'pink' : base); };
const dot = (c, on, fn, label) => { const b = el('button', { type: 'button', className: 'dot', onclick: fn, title: label || cname(c) }); b.style.background = c; b.dataset.c = c; b.setAttribute('aria-label', label || cname(c)); setOn(b, on); return b; };
const setOn = (b, on) => { b.classList.toggle('on', !!on); b.setAttribute('aria-pressed', String(!!on)); };
// ---- options ----
const CONT = [['paper', 'Paper wrap'], ['none', 'Tied with ribbon'], ['vase', 'Glass vase'], ['basket', 'Basket'], ['easel', 'Easel']];
const CW = { paper: '#e6cdb8', vase: '#bfe0ea', basket: '#b8864b', none: '#e6cdb8', easel: '#8a6a3c' };
const PAT = { paper: [['', 'Smooth'], ['p-dots', 'Polka dots'], ['p-stripe', 'Stripes'], ['p-check', 'Gingham'], ['p-floral', 'Floral']], vase: [['v-clear', 'Clear glass'], ['v-frost', 'Frosted'], ['v-stripe', 'Striped']], basket: [['b-weave', 'Woven'], ['b-lattice', 'Lattice'], ['b-rattan', 'Rattan']] };
const RSTYLES = [['bow', 'Classic bow'], ['flow', 'Flowy'], ['double', 'Double bow'], ['rosette', 'Rosette'], ['band', 'Satin band'], ['lace', 'Lace'], ['twine', 'Twine'], ['nobow', 'None']];
const BGS = [['blush', 'Plain'], ['garden', 'Garden'], ['meadow', 'Meadow'], ['greenhouse', 'Greenhouse'], ['blossom', 'Blossom'], ['table', 'Table'], ['dusk', 'Dusk'], ['night', 'Midnight']];
const PAPERS = [['pp-plain', 'Plain'], ['pp-lined', 'Lined'], ['pp-parch', 'Parchment'], ['pp-kraft', 'Kraft'], ['pp-floral', 'Floral dots'], ['pp-dark', 'Dark'], ['pp-water', 'Watercolor'], ['pp-linen', 'Linen'], ['pp-rice', 'Rice paper'], ['pp-leaves', 'Leaves'], ['pp-vintage', 'Vintage'], ['pp-grid', 'Graph grid'], ['pp-blush', 'Blush'], ['pp-sage', 'Sage'], ['pp-navy', 'Midnight'], ['pp-stripe', 'Stripes'], ['pp-hearts', 'Hearts'], ['pp-stars', 'Stars'], ['pp-marble', 'Marble'], ['pp-burlap', 'Burlap'], ['pp-foil', 'Gold foil'], ['pp-frame', 'Postcard'], ['pp-canvas', 'Canvas'], ['pp-lilac', 'Lilac'], ['pp-peach', 'Peach'], ['pp-mint', 'Mint'], ['pp-butter', 'Butter']];
const FONTS = [["f-serif", "Elegant", "'Playfair Display',serif", 1, 1], ["f-bask", "Classic", "'Libre Baskerville',serif", 0.9, 1], ["f-lora", "Lora", "Lora,serif", 1, 1], ["f-hand", "Cormorant", "'Cormorant Garamond',serif", 1.15, 1], ["f-cinzel", "Cinzel", "Cinzel,serif", 0.9, 0], ["f-vibes", "Great Vibes", "'Great Vibes',cursive", 1.55, 0], ["f-pari", "Parisienne", "Parisienne,cursive", 1.4, 0], ["f-dancing", "Dancing", "'Dancing Script',cursive", 1.2, 0], ["f-sat", "Satisfy", "Satisfy,cursive", 1.2, 0], ["f-pacifico", "Pacifico", "Pacifico,cursive", 0.9, 0], ["f-script", "Caveat", "Caveat,cursive", 1.3, 0], ["f-indie", "Indie Flower", "'Indie Flower',cursive", 1.15, 0], ["f-shadow", "Handwritten", "'Shadows Into Light',cursive", 1.25, 0], ["f-type", "Typewriter", "'Special Elite',monospace", 0.95, 0], ["f-sans", "Clean", "Quicksand,sans-serif", 1, 0], ["f-mont", "Modern", "Montserrat,sans-serif", 0.92, 0]];
const SEAL_EM = [['flower', 'Flower'], ['heart', 'Heart'], ['star', 'Star'], ['letter', 'Initial'], ['none', 'No seal']];
const STAMPS = [['rose', 'Rose'], ['gold', 'Gold'], ['sage', 'Sage'], ['none', 'None']];
const LINERS = [['diamond', 'Diamonds'], ['dots', 'Dots'], ['stripes', 'Stripes'], ['floral', 'Floral'], ['plain', 'Plain']];
const TRIMS = [['none', 'Plain edge'], ['airmail', 'Airmail'], ['gold', 'Gold line']];
// what a brand-new bouquet starts with; older gifts and drafts keep the envelope they were saved with
const FRESH = { env: '#f6e3e6', tr: 'airmail' };
const WAX = ['#b3382c', '#c9a227', '#3d6b4f', '#2b3a5c', '#6b3a6e', '#2b2b33', '#e0709a'];
const ENVC = ['#e8dcc8', '#f6e3e6', '#dfe9dc', '#e3e0f1', '#f7edc8', '#2b3a5c', '#3d5a47', '#8f3b4a'];
const ALIGN = [['a-left', 'Left'], ['a-center', 'Center'], ['a-right', 'Right'], ['a-justify', 'Justify']];
const PFRAMES = [['pf-round', 'Rounded'], ['pf-polaroid', 'Polaroid'], ['pf-none', 'Square']];
const PPOS = [['ph-top', 'Above the text'], ['ph-below', 'Below the text']];
const INK = ['#33281f', '#000000', '#3d5a47', '#8f3b4a', '#2b3a5c', '#6b4e8a', '#a65f45', '#ffffff'];
const RIBC = ['#8f3b4a', '#d4af37', '#1f3d2b', '#2b3a5c', '#f7f2ea', '#c9a0a0', '#7a6a9a', '#b0562f', '#4f7a6a', '#c0c0c0', '#2b2b33', '#e08a9a'];
const WRAPS = ['#d2a679', '#e6cdb8', '#f1e6d2', '#b9c9b0', '#c9bfe0', '#2b2b33', '#2b3a5c', '#f7f2ea'];

// ---- state ----
const D = () => ({ sl: '#b3382c', se: 'flower', st: 'rose', li: 'diamond', tr: 'none', nm: true, ev: '', ps: 100, pr: 0, bgImg: '', pc: '', at: '', atu: '', voice: '', vd: 0, mean: false, items: [], w: '#e6cdb8', p: '', rib: '#8f3b4a', env: '#e8dcc8', on: false, mus: false, ink: '', tz: 20, tl: 1.5, tk: 0, tg: 120, tb: false, ti: null, tu: false, lp: 'pp-plain', lf: 'f-serif', la: 'a-left', ph: 'ph-top', pf: 'pf-round', pet: false, cont: 'paper', rs: 'bow', bg: 'blush', bgc: '', pw: '', media: '', to: '', from: '', text: '', photo: '', dark: false });
let S = D(), view = false, sel = null, step = 1, GID = '';
const els = new Map();

// Everything that arrives from a gift link is untrusted: keep only values of the expected shape.
const HEX = /^#[0-9a-f]{6}$/i, IMG = /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/, AUD = /^data:audio\/(mp4|webm|ogg|mpeg|wav|x-wav|aac|x-m4a);base64,[A-Za-z0-9+/=]+$/;
const audio = v => { const u = typeof v === 'string' && v.length < 900000 ? v.replace(/^(data:audio\/[a-z0-9-]+);codecs=[^;,]*/i, '$1') : ''; return AUD.test(u) ? u : ''; };
const str = (v, n) => typeof v === 'string' ? v.slice(0, n) : '';
const num = (v, lo, hi, d) => Number.isFinite(+v) && v !== '' && v !== null ? clamp(+v, lo, hi) : d;
const hex = (v, d = '') => typeof v === 'string' && HEX.test(v) ? v : d;
const oneOf = (v, list, d) => list.includes(v) ? v : d;
function clean(o) {
  o = o && typeof o === 'object' ? o : {}; const d = D(), pats = Object.values(PAT).flat().map(p => p[0]);
  const media = u => typeof u === 'string' && u.length < 300000;
  return { ...d,
    ev: str(o.ev, 40), ps: num(o.ps, 30, 100, 100), pr: num(o.pr, -15, 15, 0), at: str(o.at, 32), atu: str(o.atu, 40), pw: /^[0-9a-f]{64}$/.test(o.pw) ? o.pw : '',
    bgImg: media(o.bgImg) && IMG.test(o.bgImg) ? o.bgImg : '', photo: media(o.photo) && IMG.test(o.photo) ? o.photo : '',
    voice: audio(o.voice), vd: num(o.vd, 0, 600, 0),
    sl: hex(o.sl, '#b3382c'), se: oneOf(o.se, SEAL_EM.map(x => x[0]), 'flower'), st: oneOf(o.st, STAMPS.map(x => x[0]), 'rose'), li: oneOf(o.li, LINERS.map(x => x[0]), 'diamond'), tr: oneOf(o.tr, TRIMS.map(x => x[0]), 'none'), nm: o.nm !== false,
    mean: !!o.mean, on: !!o.on, mus: !!o.mus, pet: !!o.pet, dark: !!o.dark, tb: !!o.tb, tu: !!o.tu, ti: o.ti === null || o.ti === undefined ? null : !!o.ti,
    w: hex(o.w, d.w), rib: hex(o.rib, d.rib), env: hex(o.env, d.env), ink: hex(o.ink), pc: hex(o.pc), bgc: hex(o.bgc),
    p: pats.includes(o.p) ? o.p : '', cont: oneOf(o.cont, CONT.map(x => x[0]), 'paper'), rs: oneOf(o.rs, RSTYLES.map(x => x[0]), 'bow'), bg: oneOf(o.bg, BGS.map(x => x[0]), 'blush'),
    lp: oneOf(o.lp, PAPERS.map(x => x[0]), 'pp-plain'), lf: oneOf(o.lf, FONTS.map(x => x[0]), 'f-serif'), la: oneOf(o.la, ALIGN.map(x => x[0]), 'a-left'), ph: oneOf(o.ph, PPOS.map(x => x[0]), 'ph-top'), pf: oneOf(o.pf, PFRAMES.map(x => x[0]), 'pf-round'),
    tz: num(o.tz, 12, 44, 20), tl: num(o.tl, 1.1, 2.2, 1.5), tk: num(o.tk, -1, 6, 0), tg: num(o.tg, 100, 220, 120),
    media: str(o.media, 300), to: str(o.to, 30), from: str(o.from, 30), text: str(o.text, 500),
    items: (Array.isArray(o.items) ? o.items : []).filter(i => i && typeof i.t === 'string' && has(TYPES, i.t)).slice(0, 40)
      .map(i => ({ t: i.t, c: hex(i.c, TYPES[i.t][2][0]), x: num(i.x, -400, 400, 0), y: num(i.y, -500, 400, 0), r: num(i.r, -720, 720, 0), s: num(i.s, .3, 3, 1), z: Math.round(num(i.z, -1, 6, 0)) })) };
}

// modal dialogs: the page behind is inert while one is open, focus moves in and comes back on close
let modalReturn = null;
const INERT = ['bar', 'app', 'landing', 'start', 'mk', 'menu'];
function modalOpen(focusEl) { if (!modalReturn) modalReturn = document.activeElement; INERT.forEach(id => $(id).setAttribute('inert', '')); requestAnimationFrame(() => focusEl && focusEl.focus()); }
function modalClose() { INERT.forEach(id => $(id).removeAttribute('inert')); const r = modalReturn; modalReturn = null; if (r && r.focus && document.contains(r)) r.focus(); }
// ---- screens and steps ----
let scr = 'landing';
function show(s) {
  scr = s; if (!$('ov').classList.contains('hide') || !$('info').classList.contains('hide')) modalClose(); ['ov', 'info', 'menu'].forEach(i => $(i).classList.add('hide')); $('menuBtn').setAttribute('aria-expanded', 'false');
  $('landing').classList.toggle('hide', s !== 'landing'); $('start').classList.toggle('hide', s !== 'start'); $('backBtn').classList.toggle('hide', s === 'landing');
  $('resume').classList.toggle('hide', s !== 'start' || !(S.items.length || lsGet('bq_auto', null)));
  if (s === 'edit') requestAnimationFrame(fitFrame);
}
const STEPS = ['Flowers', 'Wrap', 'Letter', 'Share'];
function goStep(n) {
  step = clamp(n, 1, 4); $('panel').dataset.step = step;
  document.querySelectorAll('.step').forEach(s => s.classList.toggle('hide', +s.dataset.s !== step));
  document.querySelectorAll('#steps button').forEach(b => { const k = +b.dataset.s; b.classList.toggle('on', k === step); b.classList.toggle('done', k < step); if (k === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  $('prevStep').classList.toggle('hide', step === 1); $('nextStep').classList.toggle('hide', step === 4); $('nextStep').textContent = 'Next: ' + (STEPS[step] || '');
  $('stepBody').scrollTop = 0; if (step === 3) prev(); if (step === 4) summary(); syncPreview();
}
document.querySelectorAll('#steps button').forEach(b => b.onclick = () => goStep(+b.dataset.s));
$('prevStep').onclick = () => goStep(step - 1); $('nextStep').onclick = () => goStep(step + 1);

// ---- flower picker ----
let cat = 'b', q = '', col = {};
const tone = k => col[TYPES[k][1]] || TYPES[k][2][0];
function drawPicker() {
  const tabs = $('tabs'); tabs.replaceChildren(...Object.entries(CATS).map(([k, [l]]) => el('button', { textContent: l, className: !q && k === cat ? 'on' : '', onclick: () => { cat = k; q = ''; $('search').value = ''; drawPicker(); } })));
  const cur = col[cat] || null, list = cat === 'f' ? [...GRN, '#c9a227', '#b8c4bb', '#8a5a2b'] : PALETTE;
  const nat = el('button', { type: 'button', className: 'dot nat', title: 'Natural colors', onclick: () => { col[cat] = null; drawPicker(); } }); nat.setAttribute('aria-label', 'Natural colors'); setOn(nat, !cur);
  $('sw').replaceChildren(nat, ...list.map(c => dot(c, c === cur, () => { col[cat] = c; drawPicker(); })));
  $('colName').textContent = cur ? 'Custom' : 'Natural';
  const needle = q.trim().toLowerCase(), ids = Object.keys(TYPES).filter(k => needle ? TYPES[k][0].toLowerCase().includes(needle) || (MEAN[k] || '').includes(needle) : TYPES[k][1] === cat);
  $('grid').replaceChildren(...(ids.length ? ids.map(k => { const t = TYPES[k], c = tone(k), b = el('button', { title: t[0] + (MEAN[k] ? ': ' + MEAN[k] : ''), onclick: () => add(k, c) }); b.innerHTML = t.svg(c); b.append(el('span', { textContent: t[0] })); return b; })
    : [el('p', { className: 'none', textContent: 'No flowers match that search.' })]));
}
$('search').oninput = e => { q = e.target.value; drawPicker(); };

// ---- bouquet items ----
const mkIt = (t, c) => { const k = TYPES[t][1], sp = k === 'b' ? 55 : 90, x = rnd(-sp, sp); return { t, c, x, y: -(k === 'b' ? rnd(40, 120) : rnd(70, 150)), r: Math.round(x / 5), s: 1, z: k === 'b' || k === 'x' ? 2 : k === 'i' || k === 's' ? 1 : 0 }; };
const fs = () => $('frame').getBoundingClientRect().width / $('frame').offsetWidth || 1;
function add(t, c) {
  if (S.items.length >= 40) return toast('Your bouquet is full (40 stems). Delete one to add another.');
  const it = mkIt(t, c); if (TYPES[t][1] === 'x') Object.assign(it, { x: 0, y: -95, s: 2, r: 0 });
  S.items.push(it); mk(it); select(it);
}
function place(it) { const e = els.get(it); e.style.transform = `translate(${it.x}px,${it.y}px) rotate(${it.r}deg) scale(${it.s})`; e.style.zIndex = it.z; if (it === sel) inv(it); if (S.cont === 'none') drawStems(); }
function mk(it) {
  const e = el('div', { className: 'sp' }); e.innerHTML = TYPES[it.t].svg(it.c); els.set(it, e); place(it); $('bunch').append(e); $('count').textContent = S.items.length;
  if (!view) { e.tabIndex = 0; e.setAttribute('role', 'button'); e.setAttribute('aria-label', TYPES[it.t][0] + ', stem on the bouquet. Arrow keys move it, Delete removes it.');
    e.onfocus = () => { if (sel !== it) select(it); }; e.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(it); } }; }
  let sx, sy, ox, oy, drag = false;
  e.onpointerdown = ev => { if (view) return; ev.preventDefault(); e.setPointerCapture(ev.pointerId); drag = true; sx = ev.clientX; sy = ev.clientY; ox = it.x; oy = it.y; select(it); };
  e.onpointermove = ev => { if (!drag) return; it.x = clamp(ox + (ev.clientX - sx) / fs(), -190, 190); it.y = clamp(oy + (ev.clientY - sy) / fs(), -240, 260); place(it); };
  e.onpointerup = e.onpointercancel = () => drag = false;
}
const swatchesFor = t => [...new Set([...TYPES[t][2], ...(TYPES[t][1] === 'f' ? GRN : PALETTE)])];
function select(it) {
  sel = it; drawH(it); els.forEach((e, i) => e.classList.toggle('sel', i === it)); $('selbar').classList.toggle('empty', !it || view);
  $('selName').textContent = it ? TYPES[it.t][0] : ''; $('mean').textContent = it && MEAN[it.t] ? MEAN[it.t] : '';
  $('isw').replaceChildren(...(it ? swatchesFor(it.t).map(c => dot(c, c === it.c, () => { it.c = c; els.get(it).innerHTML = TYPES[it.t].svg(c); select(it); })) : []));
  requestAnimationFrame(fitFrame);
}
function removeItem(it) { els.get(it).remove(); els.delete(it); S.items = S.items.filter(i => i !== it); $('count').textContent = S.items.length; if (sel === it) select(null); drawStems(); }
$('tools').onclick = ev => {
  const b = ev.target.closest('[data-a]'), a = b && b.dataset.a; if (!a || !sel) return;
  if (a === 'd') return removeItem(sel);
  if (a === 'dup') { if (S.items.length >= 40) return toast('Your bouquet is full (40 stems).'); const c = { ...sel, x: clamp(sel.x + 16, -190, 190), y: clamp(sel.y + 10, -240, 260) }; S.items.push(c); mk(c); return select(c); }
  if (a === 's-') sel.s = Math.max(.3, sel.s - .1); if (a === 's+') sel.s = Math.min(3, sel.s + .1);
  if (a === 'r-') sel.r -= 12; if (a === 'r+') sel.r += 12; if (a === 'zu') sel.z = Math.min(sel.z + 1, 6); if (a === 'zd') sel.z = Math.max(sel.z - 1, -1);
  place(sel);
};
document.addEventListener('pointerdown', e => { if (!e.target.closest('.sp,#selbar,#grid,#sw,#tabs')) select(null); });
const inv = it => { const s = els.get(it) && els.get(it).querySelector('.sh'); if (s) s.style.setProperty('--inv', 1 / it.s); };
function drawH(it) {
  document.querySelectorAll('.sh').forEach(x => x.remove()); if (!it || view) return; const e = els.get(it), s = el('div', { className: 'sh' });
  s.innerHTML = '<i class="hk" data-h="r"></i><i data-h="s" style="left:0;top:0"></i><i data-h="s" style="right:0;top:0"></i><i data-h="s" style="left:0;bottom:0"></i><i data-h="s" style="right:0;bottom:0"></i>'; e.append(s); inv(it);
  s.onpointerdown = ev => { const h = ev.target.dataset.h; if (!h) return; ev.stopPropagation(); ev.preventDefault(); s.setPointerCapture(ev.pointerId);
    const b = $('bunch').getBoundingClientRect(), cx = b.left + it.x * fs(), cy = b.top + it.y * fs(), d0 = Math.hypot(ev.clientX - cx, ev.clientY - cy) || 1, s0 = it.s;
    s.onpointermove = m => { if (h === 'r') it.r = Math.round(Math.atan2(m.clientY - cy, m.clientX - cx) * 180 / Math.PI + 90); else it.s = clamp(s0 * Math.hypot(m.clientX - cx, m.clientY - cy) / d0, .3, 3); place(it); };
    s.onpointerup = s.onpointercancel = () => { s.onpointermove = null; }; };
}
// trackpad, gesture and touch zoom/rotate, plus keyboard nudging
$('canvas').addEventListener('wheel', e => { if (!sel || view) return; if (e.ctrlKey) { e.preventDefault(); sel.s = clamp(sel.s * Math.exp(-e.deltaY * .01), .3, 3); place(sel); } else if (e.altKey) { e.preventDefault(); sel.r += e.deltaY * .3; place(sel); } }, { passive: false });
let g0; $('canvas').addEventListener('gesturestart', e => { if (sel) { e.preventDefault(); g0 = [sel.s, sel.r]; } }); $('canvas').addEventListener('gesturechange', e => { if (!sel || !g0) return; e.preventDefault(); sel.s = clamp(g0[0] * e.scale, .3, 3); sel.r = g0[1] + e.rotation; place(sel); });
let t0; const td = t => [Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY), Math.atan2(t[1].clientY - t[0].clientY, t[1].clientX - t[0].clientX) * 180 / Math.PI];
$('canvas').addEventListener('touchstart', e => { if (sel && !view && e.touches.length === 2) t0 = [...td(e.touches), sel.s, sel.r]; }, { passive: true });
$('canvas').addEventListener('touchmove', e => { if (!t0 || e.touches.length !== 2) return; e.preventDefault(); const [d, an] = td(e.touches); sel.s = clamp(t0[2] * d / t0[0], .3, 3); sel.r = Math.round(t0[3] + an - t0[1]); place(sel); }, { passive: false });
$('canvas').addEventListener('touchend', () => { t0 = null; });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { $('close').click(); $('iX').click(); $('menu').classList.add('hide'); return; }
  if (!sel || view || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  const st = e.shiftKey ? 10 : 2, m = { ArrowLeft: ['x', -st], ArrowRight: ['x', st], ArrowUp: ['y', -st], ArrowDown: ['y', st] }[e.key];
  if (m) { e.preventDefault(); sel[m[0]] += m[1]; place(sel); } else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeItem(sel); }
  else if (e.key === ']') { sel.z = Math.min(sel.z + 1, 6); place(sel); } else if (e.key === '[') { sel.z = Math.max(sel.z - 1, -1); place(sel); }
});
function drawStems() {
  const sv = $('stems'); if (S.cont !== 'none') { sv.innerHTML = ''; return; }
  sv.innerHTML = S.items.filter(it => TYPES[it.t][1] !== 'x').map((it, i) => { const L = 115 * it.s, th = it.r * Math.PI / 180, hx = 170 + it.x, hy = 230 + it.y, bx = hx - L * Math.sin(th), by = hy + L * Math.cos(th), tx = 170 + ((i % 7) - 3) * 3.5, ty = 440 + (i % 5) * 3;
    return `<path d="M${bx} ${by}Q${bx} ${(by + ty) / 2} ${tx} ${ty}" stroke="#4f7f3f" stroke-width="${Math.max(3, 4.5 * it.s)}" fill="none" stroke-linecap="round"/><ellipse cx="${tx}" cy="${ty}" rx="3.2" ry="2" fill="#cfe3b4"/>`; }).join('');
}
// fit the 340x520 bouquet frame into whatever room the stage has (phones, tablets, receiver view)
let fitLock = false;
function fitFrame() {
  if (fitLock) return; const c = $('canvas'), w = c.clientWidth, h = c.clientHeight; if (!w || !h) return;
  $('envBig').style.setProperty('--ez', clamp(Math.min((w - 36) / 320, (h - 190) / 210), .5, 1.7).toFixed(3));
  const pad = view ? 20 : (innerWidth <= 800 ? 14 : 40), k = clamp(Math.min((w - pad) / 340, (h - pad) / 520), .22, view ? 1.5 : 1.2);
  $('frame').style.setProperty('--fit', k.toFixed(3));
}
new ResizeObserver(fitFrame).observe($('canvas')); addEventListener('resize', fitFrame);
// phones: give the form the room while the keyboard is up
let typingT; $('panel').addEventListener('focusin', e => { if (e.target.matches('input:not([type=checkbox]):not([type=range]):not([type=color]):not([type=file]),textarea')) { clearTimeout(typingT); document.body.classList.add('typing'); } });
$('panel').addEventListener('focusout', () => { clearTimeout(typingT); typingT = setTimeout(() => document.body.classList.remove('typing'), 250); });
$('sizeBtn').onclick = () => { document.body.classList.toggle('big'); $('sizeBtn').textContent = document.body.classList.contains('big') ? 'Smaller preview' : 'Bigger preview'; };

// ---- wrapping, ribbon, backdrop ----
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
RIB.nobow = () => '';

let _bg = '';
function applyStyle() {
  $('frame').className = (S.cont || 'paper') + ($('frame').classList.contains('reveal') ? ' reveal' : ''); drawStems();
  const rk = RIB[S.rs] || ['band', 'twine', 'lace'].includes(S.rs) ? S.rs : 'bow'; $('bow').className = rk; $('bow').innerHTML = ribbon(rk, S.rib);
  { const v = S.bgImg ? `url("${S.bgImg}") center/cover no-repeat` : S.bg === 'blush' && S.bgc ? S.bgc : scene(S.bg); if (v !== _bg) { _bg = v; $('canvas').style.background = v; } }
  $('bgcRow').classList.toggle('hide', S.bg !== 'blush' || !!S.bgImg);
  const r = document.documentElement.style; r.setProperty('--w', S.w); r.setProperty('--rib', S.rib); r.setProperty('--env', S.env); r.setProperty('--seal', S.sl); $('mini').dataset.em = S.se; envLook($('envBig').firstChild);
  $('wrapFront').className = S.p || ''; document.body.classList.toggle('dark', S.dark); document.body.classList.toggle('pet', !!S.pet); $('petalBtn').textContent = 'Petals: ' + (S.pet ? 'on' : 'off');
  $('mini').classList.toggle('hide', !S.on); $('hint').classList.toggle('hide', !(S.on && view));
  $('tag').textContent = S.to ? 'For ' + S.to : ''; $('tag').classList.toggle('hide', !S.to);
  $('wrapOpts').classList.toggle('hide', S.cont === 'none' || S.cont === 'easel'); $('ribRow').classList.toggle('hide', S.rs === 'nobow');
  syncChoices();
}
// a row of buttons that sets one value on S
function choices(id, list, key, after) {
  const box = $(id); box.replaceChildren(...list.map(([v, l]) => el('button', { textContent: l, dataset: { v }, onclick: () => { S[key] = v; after ? after(v) : applyStyle(); } })));
}
function mark(id, v) { $(id).querySelectorAll('[data-v]').forEach(b => { const on = b.dataset.v === v; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); }); }
function syncChoices() {
  mark('contSeg', S.cont); mark('rsChips', S.rs); mark('bgGrid', S.bg); mark('paperGrid', S.lp); mark('pfSeg', S.pf); mark('phSeg', S.ph); mark('patChips', S.p); mark('emChips', S.se); mark('stChips', S.st); mark('liChips', S.li); mark('trChips', S.tr);
  document.querySelectorAll('#envsw .dot').forEach(i => setOn(i, i.dataset.c === S.env)); document.querySelectorAll('#sealsw .dot').forEach(i => setOn(i, i.dataset.c === S.sl)); $('sealRow').classList.toggle('hide', S.se === 'none');
  document.querySelectorAll('#wsw .dot').forEach(i => setOn(i, i.dataset.c === S.w)); document.querySelectorAll('#rsw .dot').forEach(i => setOn(i, i.dataset.c === S.rib));
}
function fillPat() {
  const L = PAT[S.cont] || []; if (L.length && !L.some(x => x[0] === S.p)) S.p = L[0][0];
  $('patChips').replaceChildren(...L.map(([v, l]) => el('button', { textContent: l, dataset: { v }, onclick: () => { S.p = v; applyStyle(); } })));
  $('patLbl').classList.toggle('hide', !L.length); $('patChips').classList.toggle('hide', !L.length);
}
choices('contSeg', CONT, 'cont', v => { S.w = $('wrapC').value = CW[v]; fillPat(); applyStyle(); });
choices('rsChips', RSTYLES, 'rs');
$('bgGrid').replaceChildren(...BGS.map(([v, l]) => { const b = el('button', { dataset: { v }, title: l, onclick: () => { S.bg = v; S.bgImg = ''; $('bgPhotoDel').classList.add('hide'); applyStyle(); } }, el('span', { textContent: l })); b.style.backgroundImage = v === 'blush' ? 'none' : scene(v).replace(/ center bottom\/cover$/, ''); if (v === 'blush') b.style.backgroundColor = '#e9dfcb'; return b; }));
const swatch = (id, list, key, input) => $(id).replaceChildren(...list.map(c => dot(c, false, () => { S[key] = $(input).value = c; applyStyle(); })));
swatch('wsw', WRAPS, 'w', 'wrapC'); swatch('rsw', RIBC, 'rib', 'ribC'); swatch('envsw', ENVC, 'env', 'envC'); swatch('sealsw', WAX, 'sl', 'sealC');
choices('emChips', SEAL_EM, 'se'); choices('stChips', STAMPS, 'st'); choices('liChips', LINERS, 'li'); choices('trChips', TRIMS, 'tr');
$('sealC').oninput = e => { S.sl = e.target.value; applyStyle(); };
$('nmOn').onchange = e => { S.nm = e.target.checked; applyStyle(); };
$('envOpen').onclick = () => { if (!S.on) setLetter(true); openLetter(); };
$('envBig').innerHTML = '<div class="env"><div class="eb"></div><div class="ef"><span class="envTo"></span></div><div class="fl"></div><div class="seal"></div></div>';
// the envelope's look (seal, stamp, lining, trim, name). Used by the opening envelope and the preview in the editor.
function envLook(e) {
  if (!e) return; e.className = ['env', 'em-' + S.se, 'st-' + S.st, 'li-' + S.li, 'tr-' + S.tr, S.nm ? '' : 'no-name'].filter(Boolean).join(' ');
  e.querySelector('.envTo').textContent = 'For ' + (S.to || 'you'); e.style.setProperty('--envink', lum(S.env) > .58 ? '#3a2c22' : '#f6efe4');
  e.querySelector('.seal').textContent = S.se === 'letter' ? (S.from || S.to || 'B').trim().charAt(0).toUpperCase() : '';
}
$('wrapC').oninput = e => { S.w = e.target.value; applyStyle(); };
$('ribC').oninput = e => { S.rib = e.target.value; applyStyle(); };
$('bgc').oninput = e => { S.bgc = e.target.value; applyStyle(); };
$('envC').oninput = e => { S.env = e.target.value; applyStyle(); };
$('petalBtn').onclick = () => { S.pet = !S.pet; applyStyle(); };
$('dark').onclick = () => { S.dark = !S.dark; applyStyle(); };
const fitImg = (f, mx, q, cb) => { const url = URL.createObjectURL(f), im = new Image(); im.onload = () => { const k = Math.min(1, mx / Math.max(im.width, im.height)), c = el('canvas', { width: Math.round(im.width * k), height: Math.round(im.height * k) }); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url); cb(c.toDataURL('image/jpeg', q)); }; im.onerror = () => toast('That image could not be read. Try a JPG or PNG.'); im.src = url; };
$('bgPhoto').onchange = e => { const f = e.target.files[0]; if (f) fitImg(f, 1000, .7, d => { S.bgImg = d; $('bgPhotoDel').classList.remove('hide'); applyStyle(); }); e.target.value = ''; };
$('bgPhotoDel').onclick = () => { S.bgImg = ''; $('bgPhotoDel').classList.add('hide'); applyStyle(); };

// ---- letter ----
const L_KEYS = () => [S.lp, S.la, S.ph, S.pf].join(' ');
function setLetter(on) { S.on = on; $('msgOn').checked = on; $('msgBox').classList.toggle('hide', !on); applyStyle(); if (on) prev(); syncPreview(); }
$('msgOn').onchange = e => setLetter(e.target.checked);
$('to').oninput = e => { S.to = e.target.value; applyStyle(); prev(); };
$('from').oninput = e => { S.from = e.target.value; prev(); };
$('text').oninput = e => { S.text = e.target.value; $('tcount').textContent = S.text.length; prev(); };
$('media').oninput = e => S.media = e.target.value.trim();
$('meanOn').onchange = e => S.mean = e.target.checked;
$('musOn').onchange = e => S.mus = e.target.checked;
$('sched').onchange = e => S.at = e.target.value;
$('photo').onchange = e => { const f = e.target.files[0]; if (f) fitImg(f, 560, .7, d => { S.photo = d; syncPhoto(); prev(); }); e.target.value = ''; };
$('photoDel').onclick = () => { S.photo = ''; syncPhoto(); prev(); };
function syncPhoto() { $('thumb').src = S.photo || ''; $('thumb').classList.toggle('hide', !S.photo); $('photoDel').classList.toggle('hide', !S.photo); }
choices('pfSeg', PFRAMES, 'pf', () => { syncChoices(); prev(); });
choices('phSeg', PPOS, 'ph', () => { syncChoices(); prev(); });
$('paperGrid').replaceChildren(...PAPERS.map(([v, l]) => el('button', { dataset: { v }, title: l, onclick: () => { S.lp = v; syncChoices(); prev(); } }, el('i', { className: v }), el('span', { textContent: l }))));
$('pc').oninput = e => { S.pc = e.target.value; prev(); }; $('pcDel').onclick = () => { S.pc = ''; $('pc').value = '#fffdf9'; prev(); };
$('ps').oninput = e => { S.ps = +e.target.value; $('psv').textContent = S.ps + '%'; prev(); }; $('pr').oninput = e => { S.pr = +e.target.value; $('prv').textContent = S.pr; prev(); };

// stage preview: the letter or the envelope while you edit them (Letter step)
let pvPick = 'letter';
function setPreview(v) {
  $('canvas').dataset.view = v; $('letterView').classList.toggle('hide', v !== 'letter'); $('envView').classList.toggle('hide', v !== 'env');
  document.querySelectorAll('#viewSeg button').forEach(b => { b.classList.toggle('on', b.dataset.v === v); b.setAttribute('aria-pressed', String(b.dataset.v === v)); });
  if (v === 'letter') prev(); if (v === 'env') fitFrame();
}
function syncPreview() { const on = step === 3 && S.on && !view; $('viewSeg').classList.toggle('hide', !on); setPreview(on ? pvPick : 'bouquet'); }
document.querySelectorAll('#viewSeg button').forEach(b => b.onclick = () => { pvPick = b.dataset.v; setPreview(pvPick); });
document.querySelectorAll('#msgBox details').forEach(d => d.addEventListener('toggle', () => { if (d.open && step === 3) { pvPick = d.id === 'envAcc' ? 'env' : 'letter'; setPreview(pvPick); } }));
$('envBig').onclick = () => openLetter();

// text styling
const fnt = () => FONTS.find(x => x[0] === S.lf) || FONTS[0];
function applyText(e) { const f = fnt(), st = e.style; st.setProperty('--ff', f[2]); st.setProperty('--fs', (S.tz * f[3]) + 'px'); st.setProperty('--lh', S.tl); st.setProperty('--ls', S.tk + 'px'); st.setProperty('--fw', S.tb ? 700 : 400); st.setProperty('--fst', (S.ti ?? f[4]) ? 'italic' : 'normal'); st.setProperty('--td', S.tu ? 'underline' : 'none'); st.setProperty('--gs', S.tg / 100); }
function syncText() {
  const f = fnt(); $('tz').value = S.tz; $('tzv').textContent = S.tz + 'px'; $('tl').value = S.tl; $('tlv').textContent = S.tl; $('tk').value = S.tk; $('tkv').textContent = S.tk; $('tg').value = S.tg; $('tgv').textContent = S.tg + '%'; $('ink').value = S.ink || '#33281f';
  document.querySelectorAll('#fgrid button').forEach(b => b.classList.toggle('on', b.dataset.f === S.lf)); document.querySelectorAll('#aseg button').forEach(b => b.classList.toggle('on', b.dataset.al === S.la));
  const on = { tb: S.tb, ti: S.ti ?? !!f[4], tu: S.tu }; document.querySelectorAll('#bseg [data-st]').forEach(b => b.classList.toggle('on', !!on[b.dataset.st]));
}
FONTS.forEach(f => { const b = el('button', { title: f[1], onclick: () => { S.lf = f[0]; syncText(); prev(); } }, el('span', { textContent: 'Aa' }), el('small', { textContent: f[1] })); b.dataset.f = f[0]; b.firstChild.style.fontFamily = f[2]; $('fgrid').append(b); });
[['tz', v => v + 'px'], ['tl', v => v], ['tk', v => v], ['tg', v => v + '%']].forEach(([id, fm]) => $(id).oninput = e => { S[id] = +e.target.value; $(id + 'v').textContent = fm(S[id]); prev(); });
document.querySelectorAll('#aseg button').forEach(b => b.onclick = () => { S.la = b.dataset.al; syncText(); prev(); });
document.querySelectorAll('#bseg [data-st]').forEach(b => b.onclick = () => { const k = b.dataset.st; S[k] = k === 'ti' ? !(S.ti ?? !!fnt()[4]) : !S[k]; syncText(); prev(); });
$('tReset').onclick = () => { Object.assign(S, { tz: 20, tl: 1.5, tk: 0, tg: 120, tb: false, ti: null, tu: false, la: 'a-left', ink: '' }); syncText(); prev(); };
$('ink').oninput = e => { S.ink = e.target.value; prev(); };
INK.forEach(c => $('tsw').append(dot(c, false, () => { S.ink = c; syncText(); prev(); })));

// voice note: where it lands is spelled out in the editor, the preview and the receiver's letter
const mmss = n => Math.floor(n / 60) + ':' + String(Math.round(n % 60)).padStart(2, '0');
const voiceLabel = () => (S.from ? 'A voice note from ' + S.from : 'A voice note for you') + (S.vd ? '  (' + mmss(S.vd) + ')' : '');
function voiceBox(on) { const b = el('div', { className: 'vbox' }); b.innerHTML = '<div class="vlab"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7.5" y="2.5" width="5" height="9" rx="2.5"/><path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v3"/></svg><span></span></div>'; b.querySelector('span').textContent = voiceLabel(); b.append(el('audio', { controls: true, preload: 'metadata', src: on })); return b; }
function prev() {
  const p = $('lprev'); p.className = 'lprev ' + L_KEYS(); p.style.color = S.ink || ''; applyText(p); p.style.setProperty('--k', innerWidth <= 800 ? .82 : 1); p.style.backgroundColor = S.pc || '';
  const t = el('h4', { className: 'pTo', textContent: S.to ? 'Dear ' + S.to + ',' : 'Dear friend,' }), x = el('p', { className: 'pText', textContent: S.text || 'Your message will look like this.' }), f = el('p', { className: 'pfrom pFrom', textContent: '— ' + (S.from || 'You') });
  const parts = [t, x, f];
  if (S.photo) { const i = el('img', { src: S.photo, className: 'pimg' }); i.style.width = S.ps + '%'; if (S.pr) i.style.transform = 'rotate(' + S.pr + 'deg)'; parts.splice(S.ph === 'ph-below' ? 2 : 1, 0, i); }
  if (S.voice) parts.splice(1, 0, voiceBox(S.voice));
  p.replaceChildren(...parts);
}
const lum = c => { const n = parseInt(c.slice(1), 16); return (.299 * (n >> 16) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255; };
function openLetter() {
  $('lTo').textContent = S.to ? 'Dear ' + S.to + ',' : ''; $('lText').textContent = S.text; $('lFrom').textContent = S.from ? '— ' + S.from : '';
  $('lImg').classList.toggle('hide', !S.photo); if (S.photo) $('lImg').src = S.photo; $('lImg').style.width = S.ps + '%'; $('lImg').style.transform = S.pr ? 'rotate(' + S.pr + 'deg)' : '';
  media();
  // voice note, right under the greeting
  const vb = $('lVoiceBox'), a = $('lVoice'), er = $('lVoiceErr'); vb.classList.toggle('hide', !S.voice); er.classList.add('hide'); a.pause();
  if (S.voice) { $('lVoiceTxt').textContent = voiceLabel(); a.src = S.voice; const bad = () => { er.textContent = 'This browser can not play the voice note. Try opening the gift in Chrome or Safari.'; er.classList.remove('hide'); };
    if (!a.canPlayType(S.voice.slice(5, S.voice.indexOf(';')))) bad(); a.onerror = bad; }
  const ms = S.mean ? [...new Set(S.items.map(i => i.t))].map(t => TYPES[t][0] + ' — ' + (MEAN[t] || '')).join('  ·  ') : ''; $('lMean').textContent = ms ? 'In the language of flowers: ' + ms : ''; $('lMean').classList.toggle('hide', !ms);
  $('lReply').classList.toggle('hide', !(view && SB.url && GID));
  const L = document.querySelector('.letter'); L.className = 'letter ' + L_KEYS(); L.style.color = S.ink || ''; applyText(L); L.style.setProperty('--k', 1); L.style.backgroundColor = S.pc || ''; L.scrollTop = 0;
  clearTimeout(openLetter.t1); clearTimeout(openLetter.t2);
  envLook($('env')); $('ov').classList.remove('hide'); $('hint').classList.add('hide'); modalOpen($('close'));
  openLetter.t1 = setTimeout(() => $('env').classList.add('open'), 150); openLetter.t2 = setTimeout(() => $('env').classList.add('gone'), 1900);
}
$('mini').onclick = openLetter; [$('mini'), $('envBig')].forEach(b => b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(); } })); $('openPrev').onclick = () => { if (!S.on) setLetter(true); openLetter(); };
$('close').onclick = () => { if ($('ov').classList.contains('hide')) return; $('ov').classList.add('hide'); modalClose(); $('lVoice').pause(); if (view && S.on) $('hint').classList.remove('hide'); };
$('ov').onclick = e => { if (e.target === $('ov')) $('close').click(); };
function media() {
  const m = $('lMedia'); m.replaceChildren(); let u; try { u = new URL(S.media); } catch (e) { return; } if (!/^https?:$/.test(u.protocol)) return;
  const y = S.media.match(/(?:youtu\.be\/|v=)([\w-]{11})/); let s = '';
  if (y && /(^|\.)(youtube\.com|youtu\.be)$/.test(u.hostname)) s = 'https://www.youtube.com/embed/' + y[1]; else if (u.hostname === 'open.spotify.com') s = 'https://open.spotify.com/embed' + u.pathname;
  if (s) { const f = el('iframe', { src: s, allow: 'autoplay;encrypted-media' }); f.style.cssText = 'width:100%;height:' + (y ? 180 : 152) + 'px;border:0;border-radius:8px;margin-bottom:12px'; m.append(f); }
  else m.append(el('a', { href: u.href, target: '_blank', rel: 'noopener noreferrer', textContent: 'Open the song / video' }));
}

// recording
const REC_MAX = 30;
let mr, recJob = null, recTick = 0;
const recMime = () => ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'].find(t => window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) || '';
function syncVoice() {
  const has = !!S.voice; $('recPrev').classList.toggle('hide', !has); $('recDel').classList.toggle('hide', !has); if (has) $('recPrev').src = S.voice;
  $('rec').textContent = has ? 'Record again' : 'Record voice note'; $('rec').classList.remove('live'); $('recStat').classList.toggle('hide', !has);
  $('recStat').textContent = has ? 'Saved' + (S.vd ? ' (' + mmss(S.vd) + ')' : '') + '. It will play at the top of the letter.' : ''; $('voiceTag').textContent = has ? 'attached' : '';
}
const stopRec = () => { if (mr && mr.state === 'recording') mr.stop(); return recJob || Promise.resolve(); };
$('rec').onclick = async () => {
  if (mr && mr.state === 'recording') return stopRec();
  if (!navigator.mediaDevices || !window.MediaRecorder) return toast('Voice notes need a recent browser and a secure (https) page.');
  let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { return toast('Microphone access was blocked. Allow it in your browser settings and try again.'); }
  const mime = recMime(), chunks = [], t0 = Date.now(); mr = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 32000 } : { audioBitsPerSecond: 32000 });
  recJob = new Promise(resolve => {
    const done = () => { recJob = null; resolve(); };
    mr.ondataavailable = e => e.data && e.data.size && chunks.push(e.data);
    mr.onstop = () => { clearInterval(recTick); stream.getTracks().forEach(t => t.stop());
      const type = (mr.mimeType || mime || 'audio/webm').split(';')[0], blob = new Blob(chunks, { type });
      if (!blob.size) { toast('That recording was empty. Please try again.'); syncVoice(); return done(); }
      const f = new FileReader(); f.onerror = () => { toast('Could not save the recording.'); done(); };
      f.onload = () => { S.voice = f.result.replace(/^data:[^,]*/, 'data:' + type + ';base64'); S.vd = clamp(Math.round((Date.now() - t0) / 1000), 1, REC_MAX); setLetter(true); syncVoice(); prev(); toast('Voice note saved. It will play at the top of the letter.'); done(); };
      f.readAsDataURL(blob); };
  });
  mr.start(); $('rec').textContent = 'Stop recording'; $('rec').classList.add('live'); $('recStat').classList.remove('hide');
  recTick = setInterval(() => { const s = (Date.now() - t0) / 1000; $('recStat').textContent = 'Recording ' + mmss(s) + ' of ' + mmss(REC_MAX) + '. Tap stop when you are done.'; if (s >= REC_MAX) stopRec(); }, 250);
};
$('recDel').onclick = () => { S.voice = ''; S.vd = 0; syncVoice(); prev(); };

// ---- music, picture ----
let playing = false, mAC, mT;
const music = on => { playing = on; $('musicBtn').textContent = on ? 'Pause music' : 'Music'; clearInterval(mT); if (!on) return;
  mAC = mAC || new (window.AudioContext || window.webkitAudioContext)(); mAC.resume(); const n = [261.6, 329.6, 392, 523.3, 392, 329.6, 293.7, 349.2, 440, 587.3, 440, 349.2]; let i = 0;
  const p = () => { const o = mAC.createOscillator(), g = mAC.createGain(), t = mAC.currentTime; o.type = 'triangle'; o.frequency.value = n[i++ % n.length]; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.08, t + .05); g.gain.exponentialRampToValueAtTime(.001, t + 1.6); o.connect(g).connect(mAC.destination); o.start(); o.stop(t + 1.7); };
  p(); mT = setInterval(p, 700); };
$('musicBtn').onclick = () => music(!playing);
async function savePicture() {
  select(null); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const f = $('frame'); fitLock = true; f.style.setProperty('--fit', 1); await new Promise(r => setTimeout(r, 80));
  try { const c = await html2canvas(f, { backgroundColor: null }); el('a', { download: 'my-bouquet.png', href: c.toDataURL() }).click(); } catch (e) { toast('Could not save the picture.'); }
  fitLock = false; fitFrame();
}
$('save').onclick = savePicture;
{ const cols = ['#f4a6d7', '#ffd1dc', '#fdd7e4', '#ffe9a8', '#e6d9ff', '#f9c6b4']; for (let i = 0; i < 16; i++) { const s = el('span'); const w = rnd(10, 18); s.style.cssText = `left:${rnd(0, 97)}vw;width:${w}px;height:${Math.round(w * 1.3)}px;--pc:${cols[i % cols.length]};animation-duration:${rnd(9, 18)}s;animation-delay:-${rnd(0, 15)}s`; $('petals').append(s); } }

// ---- drafts, presets ----
const snap = () => ({ ...S, pw: '', items: S.items.map(({ t, c, x, y, r, s, z }) => ({ t, c, x, y, r, s, z })) });
function saveDraft() {
  const d = lsGet('bq', []); d.unshift({ n: (S.to ? 'For ' + S.to : 'Untitled') + ' · ' + new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }), s: snap() });
  toast(lsSet('bq', d.slice(0, 8)) ? 'Draft saved. Find it in Menu, then My drafts.' : 'Not enough space to save. Try a smaller photo or voice note.');
}
$('draft').onclick = saveDraft;
let lastAuto = '';
setInterval(() => { if (view || scr !== 'edit' || !S.items.length) return; const j = JSON.stringify(snap()); if (j !== lastAuto) { lastAuto = j; try { localStorage.setItem('bq_auto', j); } catch (e) { /* too big: the manual draft will say so */ } } }, 3000);
const rp = (t, c, n) => Array(n).fill([t, c]);
const PRE = {
  'Romantic Reds': { w: '#2b2b33', rib: '#d4af37', rs: 'flow', l: [...rp('eucalyptus', '#6b9e6b', 3), ...rp('rose', '#e63950', 5), ...rp('rose', '#a8201a', 2), ...rp('babysbreath', '#ffffff', 3)] },
  'Sunny Meadow': { w: '#d2a679', rib: '#b08d57', rs: 'twine', bg: 'meadow', l: [...rp('sunflower', '#ffc300', 3), ...rp('daisy', '#ffffff', 4), ...rp('ruscus', '#6b9e6b', 3), ...rp('wheat', '#e0b84c', 3)] },
  'Lavender Dreams': { w: '#d9ccf5', rs: 'double', rib: '#8e7cc3', bg: 'dusk', l: [...rp('lavender', '#b78cff', 5), ...rp('hydrangea', '#b78cff', 2), ...rp('peony', '#f4a6d7', 2), ...rp('fern', '#3f7a4f', 3)] },
  'Garden Whites': { cont: 'vase', w: '#bfe0ea', rib: '#9cbf8f', bg: 'garden', l: [...rp('lily', '#fff6f6', 3), ...rp('peony', '#fff6f6', 2), ...rp('daisy', '#ffffff', 3), ...rp('eucalyptus', '#9cbf8f', 3)] },
  'Spring Tulips': { cont: 'basket', w: '#b8864b', rib: '#e0577f', bg: 'meadow', l: [...rp('tulip', '#ff7a9c', 3), ...rp('tulip', '#ffd166', 3), ...rp('ranunculus', '#ff9f68', 2), ...rp('ruscus', '#6b9e6b', 3)] },
  'Cherry Blossom': { w: '#f2d3dc', rib: '#b0425f', rs: 'flow', bg: 'blossom', l: [...rp('sakura', '#fdd7e4', 3), ...rp('cherry', '#fdd7e4', 4), ...rp('magnolia', '#fff6f6', 2), ...rp('ruscus', '#9cbf8f', 2)] },
  'Wildflower Field': { w: '#d2a679', rib: '#6b8e23', rs: 'twine', bg: 'meadow', l: [...rp('cornflower', '#6f8fe8', 3), ...rp('daisy', '#ffffff', 3), ...rp('poppy', '#ff4d2e', 3), ...rp('bunnytails', '#f4e1d2', 3), ...rp('wheat', '#e0b84c', 2)] },
  'Tropical Sunset': { w: '#d9b98a', rib: '#b0562f', rs: 'double', bg: 'dusk', l: [...rp('strelitzia', '#ff9f1c', 2), ...rp('hibiscus', '#ff4d6d', 3), ...rp('orchid', '#f4a6d7', 2), ...rp('monstera', '#3f7a4f', 2), ...rp('palm', '#6b9e6b', 2)] },
  'Autumn Harvest': { cont: 'basket', w: '#b8864b', rib: '#b0562f', bg: 'table', l: [...rp('marigold', '#ff9f1c', 3), ...rp('dahlia', '#e85d04', 3), ...rp('sunflower', '#ffc300', 2), ...rp('maple', '#c0392b', 2), ...rp('wheat', '#e0b84c', 2)] },
  'Winter Warmth': { w: '#2b3a5c', rib: '#d4af37', rs: 'flow', bg: 'night', l: [...rp('poinsettia', '#d62839', 3), ...rp('berries', '#c0392b', 3), ...rp('silverdollar', '#b8c9bd', 3), ...rp('rosemary', '#3f7a4f', 2)] },
  'Pastel Garden': { w: '#c9bfe0', rib: '#f4a6d7', rs: 'bow', bg: 'garden', l: [...rp('delphinium', '#b78cff', 2), ...rp('alstroemeria', '#ff8fab', 2), ...rp('plumeria', '#ffd9e2', 2), ...rp('forgetmenot', '#8ecae6', 3), ...rp('dustymiller', '#b8c4bb', 3)] },
  'Spring Spikes': { cont: 'vase', w: '#bfe0ea', rib: '#9cbf8f', bg: 'greenhouse', l: [...rp('snapdragon', '#ff8fab', 2), ...rp('lupine', '#8e7cc3', 2), ...rp('gladiolus', '#ff4d6d', 2), ...rp('lilac', '#b78cff', 1), ...rp('fern', '#3f7a4f', 3)] }
};
const oc = (o, l) => ({ occ: 1, on: true, ...o, l: l.filter(([t]) => has(TYPES, t)) });
Object.assign(PRE, {
  'Birthday': oc({ w: '#f1e6d2', rib: '#d4af37', rs: 'flow', bg: 'garden', lp: 'pp-water', lf: 'f-dancing', text: 'Happy Birthday! Wishing you a day as beautiful as these flowers and a year full of joy.' }, [...rp('gerbera', '#ff6f3c', 3), ...rp('daisy', '#ffffff', 3), ...rp('cosmos', '#ff7a9c', 2), ...rp('eucalyptus', '#6b9e6b', 3)]),
  'Anniversary': oc({ w: '#2b2b33', rib: '#d4af37', rs: 'flow', bg: 'dusk', lp: 'pp-vintage', lf: 'f-vibes', text: 'Every year with you is my favorite bouquet. Happy anniversary, my love.' }, [...rp('rose', '#a8201a', 6), ...rp('babysbreath', '#ffffff', 3), ...rp('eucalyptus', '#3f7a4f', 3)]),
  'Get well soon': oc({ w: '#d2a679', rib: '#6b8e23', rs: 'twine', bg: 'meadow', lp: 'pp-sage', lf: 'f-lora', text: 'Sending sunshine and good wishes your way. Rest well and get better soon!' }, [...rp('sunflower', '#ffc300', 3), ...rp('daisy', '#ffffff', 3), ...rp('lavender', '#b78cff', 2), ...rp('fern', '#3f7a4f', 2)]),
  'Thank you': oc({ w: '#e6cdb8', rib: '#8f3b4a', bg: 'blush', lp: 'pp-blush', lf: 'f-script', text: 'Thank you for everything you do. You mean so much to me.' }, [...rp('peony', '#f4a6d7', 3), ...rp('tulip', '#ff7a9c', 3), ...rp('ruscus', '#6b9e6b', 3)]),
  'Congratulations': oc({ w: '#f7f2ea', rib: '#d4af37', rs: 'double', bg: 'greenhouse', lp: 'pp-plain', lf: 'f-serif', text: 'Congratulations! So proud of you. Here is to your big moment.' }, [...rp('gerbera', '#ffc300', 3), ...rp('anemone', '#b78cff', 2), ...rp('poppy', '#ff4d2e', 2), ...rp('eucalyptus', '#6b9e6b', 3)]),
  'Mother\'s Day': oc({ w: '#f7f2ea', rib: '#e0709a', rs: 'flow', bg: 'garden', lp: 'pp-floral', lf: 'f-pari', text: 'Happy Mother\'s Day. Thank you for all the love, patience and strength you give.' }, [...rp('peony', '#f4a6d7', 3), ...rp('carnation', '#ff7a9c', 3), ...rp('tulip', '#fdd7e4', 2), ...rp('alstroemeria', '#ff8fab', 2), ...rp('eucalyptus', '#9cbf8f', 2)]),
  'Wedding': oc({ w: '#f7f2ea', rib: '#d4af37', rs: 'double', bg: 'greenhouse', lp: 'pp-frame', lf: 'f-vibes', text: 'Wishing you both a lifetime of love, laughter and happiness together.' }, [...rp('rose', '#fff6f6', 4), ...rp('calla', '#ffffff', 2), ...rp('babysbreath', '#ffffff', 3), ...rp('eucalyptus', '#9cbf8f', 3)]),
  'New baby': oc({ w: '#d8eee3', rib: '#8ecae6', rs: 'bow', bg: 'meadow', lp: 'pp-mint', lf: 'f-indie', text: 'Welcome to the world, little one. Congratulations on your beautiful new arrival.' }, [...rp('daisy', '#ffffff', 3), ...rp('forgetmenot', '#8ecae6', 3), ...rp('cosmos', '#fdd7e4', 2), ...rp('bunnytails', '#f4e1d2', 3)]),
  'Graduation': oc({ w: '#2b3a5c', rib: '#d4af37', rs: 'flow', bg: 'dusk', lp: 'pp-plain', lf: 'f-cinzel', text: 'You did it! Congratulations, graduate. The best is still ahead.' }, [...rp('sunflower', '#ffc300', 2), ...rp('gerbera', '#ffc300', 3), ...rp('iris', '#7a6ae0', 2), ...rp('eucalyptus', '#6b9e6b', 3)]),
  'Just because': oc({ w: '#e6cdb8', rib: '#8f3b4a', bg: 'blush', lp: 'pp-hearts', lf: 'f-sat', text: 'No reason at all. I was thinking of you and wanted to make you smile.' }, [...rp('ranunculus', '#ff9f68', 3), ...rp('daisy', '#fff3b0', 3), ...rp('ranunculus', '#b78cff', 1), ...rp('cornflower', '#6f8fe8', 2), ...rp('fern', '#3f7a4f', 2)]),
  'With sympathy': oc({ w: '#f1e6d2', rib: '#c0c0c0', bg: 'blush', lp: 'pp-linen', lf: 'f-hand', text: 'Thinking of you with love. May these flowers bring a little comfort in a hard time.' }, [...rp('lily', '#fff6f6', 4), ...rp('rose', '#fff6f6', 3), ...rp('eucalyptus', '#9cbf8f', 3)]),
  'Condolences': oc({ w: '#8a6a3c', rib: '#c0c0c0', cont: 'easel', rs: 'nobow', bg: 'blush', bgc: '#e3e8e3', lp: 'pp-linen', lf: 'f-hand', text: 'With deepest sympathy. May these flowers, and the love around you, bring comfort in the days ahead.', fix: { wreath: { x: 0, y: -95, s: 2, r: 0 } } }, [['wreath', '#ffffff']]),
  'In loving memory': oc({ w: '#8a6a3c', rib: '#c0c0c0', cont: 'easel', rs: 'nobow', bg: 'blush', bgc: '#e3e8e3', lp: 'pp-linen', lf: 'f-hand', text: 'In loving memory. Forever in our hearts.', fix: { spray: { x: 0, y: -95, s: 2, r: 0 } } }, [['spray', '#ffffff']])
});
function presetButton(name, p) {
  const items = p.l.map(([t, c]) => Object.assign(mkIt(t, c), (p.fix || {})[t] || {})), { l, fix, occ, ...q } = p;
  const v = el('div', { className: 'pv' }), bx = el('div', { className: 'pvb' }), w = el('div', { className: 'pvw' }); w.style.background = q.w || '#f1e6d2'; if (q.cont === 'easel' || q.cont === 'none') w.style.display = 'none';
  [...items].sort((x, y) => x.z - y.z).forEach(it => { const e = el('div', { className: 'sp' }); e.innerHTML = TYPES[it.t].svg(it.c); e.style.transform = `translate(${it.x}px,${it.y}px) rotate(${it.r}deg) scale(${it.s})`; bx.append(e); });
  v.append(bx, w);
  return el('button', { onclick: () => { load({ ...FRESH, ...q, ev: occ ? name : '', items: items.map(i => ({ ...i })) }); show('edit'); } }, v, el('b', { textContent: name }));
}
Object.entries(PRE).forEach(([n, p]) => { if (p.l.length) $(p.occ ? 'occ' : 'presets').append(presetButton(n, p)); });
$('scratch').onclick = () => { load({ ...FRESH }); show('edit'); };
$('resume').onclick = () => { if (!S.items.length) { const a = lsGet('bq_auto', null); if (a) load(a); } show('edit'); };

// ---- building the scene from S ----
function buildScene() {
  els.forEach(e => e.remove()); els.clear(); sel = null; select(null); S.items.forEach(mk); $('count').textContent = S.items.length; fillPat(); applyStyle();
}
function syncAll() {
  ['to', 'from', 'text', 'media', 'sched'].forEach(k => $(k).value = S[k === 'sched' ? 'at' : k]); $('tcount').textContent = S.text.length; $('pw').value = '';
  $('wrapC').value = S.w; $('ribC').value = S.rib; $('envC').value = S.env; $('sealC').value = S.sl; $('nmOn').checked = S.nm; $('bgc').value = S.bgc || '#e9dfcb'; $('pc').value = S.pc || '#fffdf9';
  $('msgOn').checked = S.on; $('msgBox').classList.toggle('hide', !S.on); $('musOn').checked = S.mus; $('meanOn').checked = S.mean;
  $('ps').value = S.ps; $('psv').textContent = S.ps + '%'; $('pr').value = S.pr; $('prv').textContent = S.pr; $('bgPhotoDel').classList.toggle('hide', !S.bgImg);
  syncPhoto(); syncVoice(); syncText(); syncChoices(); prev(); syncPreview();
}
function load(o) { S = clean(o); if (!S.from) S.from = lsRaw('bq_name') || ''; buildScene(); syncAll(); goStep(1); }

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
  const pw = $('pw').value, btn = $('share'); btn.disabled = true; $('linkOut').textContent = 'Creating link…';
  try {
    const data = snap(); data.atu = S.at ? new Date(S.at).toISOString() : '';
    const body = pw ? { ...(await seal(data, pw)), to: S.to, from: S.from, ev: S.ev, at: S.at, atu: data.atu } : data;
    const base = location.href.split(/[?#]/)[0];
    if (SB.url) {
      const id = newId(), r = await fetch(SB.url + '/rest/v1/gifts', { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ id, data: body }) });
      if (!r.ok) throw new Error(r.status === 413 ? 'The gift is too large. Try a smaller photo or a shorter voice note.' : (await r.text()).slice(0, 160));
      link = `${base}?g=${id}`; const sent = lsGet('bq_sent', []); sent.unshift({ id, to: S.to || '', t: Date.now(), link }); lsSet('bq_sent', sent.slice(0, 30));
    } else link = `${base}#d=${await pack(JSON.stringify(body))}`;
    $('linkOut').textContent = 'Link ready. Copy it, scan the QR, or email it.'; $('shareBox').classList.remove('hide'); $('linkTxt').value = link; navigator.clipboard.writeText(link).catch(() => {}); drawQR();
    { const sb = $('stepBody'); sb.scrollTo({ top: $('shareBox').getBoundingClientRect().top - sb.getBoundingClientRect().top + sb.scrollTop - 12, behavior: 'smooth' }); }
  } catch (e) { $('linkOut').textContent = 'Could not create link: ' + e.message; } finally { btn.disabled = false; }
};

// ---- receiver experience ----
let sealed = null, serverLocked = false;
const PARTS = { h: 'h', s: 's', d: 'd', c: 'c' };
const TH = [[/Birthday/, '#6b3b6e', ['gerbera', 'zinnia', 'daisy', 'cosmos', 'dahlia'], WARM, 1, ['c', 'd', 's']], [/Anniversary/, '#4a1f2b', ['rose', 'camellia', 'peony'], ['#a8201a', '#e63950', '#7d1d2a', '#c0392b'], 1.15, ['h', 's']], [/Get well/, '#c9a227', ['sunflower', 'daisy', 'gerbera', 'zinnia'], ['#ffc300', '#ffd166', '#ff9f1c', '#ffffff'], 1, ['s', 'd']],
  [/Thank/, '#9a5b66', ['peony', 'tulip', 'ranunculus', 'camellia'], ['#f4a6d7', '#ff7a9c', '#fdd7e4', '#ffffff'], 1.1, ['h', 'd']], [/Congrat|Graduat/, '#1f2d4d', ['gerbera', 'anemone', 'poppy', 'dahlia', 'zinnia'], WARM, .9, ['c', 's', 'd']],
  [/Mother/, '#8a4a62', ['peony', 'carnation', 'tulip', 'alstroemeria', 'rose'], ['#f4a6d7', '#ff7a9c', '#fdd7e4', '#ffffff'], 1.1, ['h', 'd']], [/Wedding/, '#efe9dc', ['rose', 'calla', 'peony', 'magnolia', 'lily'], ['#ffffff', '#fff6f6', '#fdd7e4', '#fff3b0'], 1.4, ['h', 'd']], [/baby/i, '#bcd8e8', ['daisy', 'cosmos', 'forgetmenot', 'tulip', 'cherry'], ['#ffffff', '#fdd7e4', '#fff3b0', '#cfe8ff'], 1.2, ['d', 'h']],
  [/sympathy|Condol|memory/i, '#dfe3df', ['lily', 'rose', 'chrysanthemum', 'lotus', 'camellia'], ['#ffffff', '#fff6f6', '#fdd7e4', '#e6d9ff'], 1.7, ['d']], [/^/, '#2f4a3a', null, WARM, 1, []]];
function burst() { const ks = Object.keys(TYPES).filter(k => TYPES[k][1] === 'b'); for (let i = 0; i < 36; i++) { const d = el('div', { className: 'bp' }); d.innerHTML = TYPES[ks[rnd(0, ks.length - 1)]].svg(WARM[rnd(0, WARM.length - 1)]);
  d.style.cssText = `left:${rnd(0, 90)}vw;top:${rnd(0, 80)}vh;--s:${rnd(5, 12) / 10};animation-delay:${rnd(0, 12) / 10}s`; document.body.append(d); setTimeout(() => d.remove(), 3800); } }
function curtain(done, ev = '') {
  const [, bgc, ts, cols, sp, em] = TH.find(t => t[0].test(ev)), bs = el('div', { id: 'bloomScreen' }); bs.style.background = bgc; bs.style.setProperty('--sp', sp);
  const ks = (ts || Object.keys(TYPES).filter(k => TYPES[k][1] === 'b')).filter(k => TYPES[k]), W = innerWidth, Ht = innerHeight, cell = Math.max(150, Math.min(W, Ht) / 2.6), cx = W / 2, cy = Ht / 2;
  for (let y = cell / 2; y < Ht + cell / 2; y += cell * .85) for (let x = cell / 2; x < W + cell / 2; x += cell * .85) { const px = x + rnd(-30, 30), py = y + rnd(-30, 30), e = el('div', { className: 'bs' }); e.innerHTML = TYPES[ks[rnd(0, ks.length - 1)]].svg(cols[rnd(0, cols.length - 1)]).replace(' filter="url(#rg)"', '');
    e.style.cssText = `left:${px}px;top:${py}px;--w:${rnd(cell * .85, cell * 1.25)}px;--r:${rnd(-40, 40)}deg;--d:${Math.round(Math.hypot(px - cx, py - cy) / Math.hypot(cx, cy) * 900 * sp)}ms`; bs.append(e); }
  for (let i = 0; i < (em.length ? 24 : 0); i++) { const s = el('span', { className: 'pt ' + PARTS[em[i % em.length]] }); s.style.cssText = `left:${rnd(0, 97)}%;background:${cols[i % cols.length]};animation-duration:${(rnd(18, 35) / 10 * sp).toFixed(1)}s;animation-delay:${rnd(0, 12) / 10}s`; bs.append(s); }
  document.body.append(bs); setTimeout(() => { bs.classList.add('out'); done(); }, 1900 * sp); setTimeout(() => bs.remove(), 3100 * sp);
}
function landFx() {
  document.body.classList.add('locked'); $('landing').querySelector('h1').textContent = 'A gift has arrived';
  if (S.to || S.from) { const g = el('div', { className: 'gtag', textContent: (S.to ? 'For ' + S.to : '') + (S.to && S.from ? '  ·  ' : '') + (S.from ? 'From ' + S.from : '') }); $('ltag').after(g); }
  for (let i = 0; i < 16; i++) { const s = el('span', { className: 'sp2', textContent: '✦' }); s.style.cssText = `left:${rnd(3, 95)}%;top:${rnd(5, 90)}%;font-size:${rnd(10, 24)}px;animation-delay:-${rnd(0, 30) / 10}s`; $('lspr').append(s); }
}
function recvCover() {
  const needPw = !!(S.pw || sealed);
  $('landing').querySelector('h1').textContent = 'A gift has arrived';
  $('ltag').textContent = (S.from ? S.from + ' made' : 'Someone made') + ' a bouquet just for you.' + (needPw ? ' Enter the password to open it.' : ' Tap below to open it.');
  $('go').textContent = 'Open your gift'; if (needPw) $('pwIn').classList.remove('hide'); $('how').classList.add('hide'); $('about').classList.add('hide'); lockCheck(); landFx();
}
function lockCheck() {
  const at = S.atu || S.at; if (!at || !view) return; const t = new Date(at) - Date.now();
  if (t > 0) { $('go').disabled = true; const f = (n, u) => Math.floor(n) + u; $('ltag').textContent = `This gift unlocks in ${f(t / 864e5, 'd')} ${f(t % 864e5 / 36e5, 'h')} ${f(t % 36e5 / 6e4, 'm')} ${f(t % 6e4 / 1e3, 's')}`; clearTimeout(lockCheck.t); lockCheck.t = setTimeout(lockCheck, 1000); }
  else if (serverLocked) location.reload();
  else { $('go').disabled = false; $('ltag').textContent = 'Your gift is ready! Tap below to open it.'; }
}
$('go').onclick = async () => {
  if (!view) return show('start');
  const pwIn = $('pwIn'), wrong = () => { pwIn.value = ''; pwIn.placeholder = 'Wrong password, try again'; pwIn.focus(); };
  if (sealed) { try { const full = await unseal(sealed, pwIn.value); S = clean({ ...full, to: sealed.to, from: sealed.from, ev: sealed.ev, at: sealed.at, atu: sealed.atu }); sealed = null; } catch (e) { return wrong(); }
    buildScene(); }
  else if (S.pw && await sha(pwIn.value) !== S.pw) return wrong();
  $('landing').classList.add('hide');
  curtain(() => { document.body.classList.remove('locked'); $('frame').classList.add('reveal'); fitFrame(); burst(); if (S.mus) music(true); $('mk').classList.remove('hide'); }, S.ev);
  if (SB.url && GID) rpost({ gift_id: GID, kind: 'opened' }).catch(() => {});
};
$('mk').onclick = () => location.href = location.href.split(/[?#]/)[0];
const REACT = ['Love it', 'Thank you', 'So sweet', 'Beautiful', 'Made my day']; let emo = '';
$('lReply').querySelector('.em').replaceChildren(...REACT.map(t => el('span', { textContent: t, onclick: e => { emo = t; document.querySelectorAll('#lReply .em span').forEach(x => x.classList.toggle('on', x === e.target)); } })));
$('rSend').onclick = async () => {
  if (!emo && !$('rTxt').value.trim()) return toast('Pick a reaction or write a few words first.');
  try { const r = await rpost({ gift_id: GID, kind: 'reply', emoji: emo, body: $('rTxt').value.trim() }); if (!r.ok) throw 0; $('lReply').textContent = 'Sent. They will love it.'; } catch (e) { toast('Could not send your reply. Please try again.'); }
};

// ---- menu, info pages ----
const TOOLS = { 'a-draft': saveDraft, 'a-png': savePicture, 'a-dark': () => $('dark').click(), 'a-petals': () => $('petalBtn').click(), 'a-music': () => $('musicBtn').click() };
$('menuBtn').onclick = () => { const h = $('menu').classList.toggle('hide'); $('menuBtn').setAttribute('aria-expanded', String(!h)); };
$('menu').onclick = e => { const k = e.target.dataset.k; if (!k) return; $('menu').classList.add('hide'); if (TOOLS[k]) { if (scr !== 'edit') show('edit'); return TOOLS[k](); } k === 'home' ? show('landing') : k === 'start' ? show('start') : info(k); };
document.addEventListener('pointerdown', e => { if (!e.target.closest('#menu,#menuBtn')) $('menu').classList.add('hide'); });
$('homeBtn').onclick = () => show('landing');
$('backBtn').onclick = () => { if (!$('ov').classList.contains('hide')) return $('close').click(); show(scr === 'edit' ? 'start' : 'landing'); };
const INFO = {
  terms: ['Terms & Conditions', 'Last updated: October 2026', [['1. Using the app', 'Make Your Own Bouquet lets you build a digital bouquet and share it as a link. Please use it kindly and lawfully.'], ['2. Your content', 'You are responsible for the messages, photos, voice notes, music and video links you add. Only share what you have the right to share. Do not add anything hateful, harassing, sexual or illegal.'], ['3. Gift links', 'Anyone who has a gift link can open it unless you add a password. Do not put sensitive information in a gift.'], ['4. Availability', 'The app is provided as is, with no promise that it will always be available or error-free. Gifts may be removed or expire at any time.'], ['5. Removal', 'Gifts that break these terms may be removed.'], ['6. Changes', 'These terms may change as the app grows. Continuing to use the app means you accept the updated terms.']]],
  privacy: ['Privacy Policy', 'Last updated: October 2026', [['What is stored', 'When you create a gift link, the bouquet arrangement, message, photo, voice note, optional music or video link and unlock date are saved in a Supabase database so the link can open. If you add a password, the gift is encrypted in your browser first and the password never leaves your device.'], ['On your device only', 'Drafts, your autosaved bouquet and your profile name are kept in your browser and never leave your device.'], ['Email', '"Send by email" opens your own mail app. We never see the address you type.'], ['Third parties', 'Supabase (storage), Google Fonts and cdnjs (fonts and libraries), and YouTube or Spotify if you add a link. They may set their own cookies.'], ['What we do not do', 'No ads and no selling of data.'], ['Your choices', 'Clearing your browser data removes drafts. To have a gift deleted, contact the app owner.'], ['Children', 'The app is not intended for children under 13.']]],
  how: ['How it works', 'Four easy steps', [['1. Flowers', 'Choose a ready-made bouquet or start from scratch, then add flowers, spikes, fillers and foliage. Drag, resize, rotate and recolor each stem.'], ['2. Wrap', 'Pick paper, a glass vase, a basket or an easel, plus a ribbon and a backdrop.'], ['3. Letter', 'Write a message, add a photo or a voice note, choose paper, font and ink, and watch the live preview.'], ['4. Share', 'Add a password or an unlock date if you like, then send the gift by link, QR code or email. Your person opens it and taps the envelope.']]],
  about: ['About', 'Make Your Own Bouquet', [['', 'A little digital gift you build, wrap and send as a link. Choose flowers, fillers and foliage, tuck a letter inside, and let someone special open it.'], ['Made by', 'Allen, 2026.']]] };
$('how').onclick = () => info('how'); $('about').onclick = () => info('about');
function info(k) {
  const b = $('iB'); b.replaceChildren(); $('iS').textContent = '';
  if (k === 'profile') { $('iT').textContent = 'Your profile'; const i = el('input', { placeholder: 'Your name (used as "From")', value: lsRaw('bq_name') || '' }); b.append(i, el('button', { textContent: 'Save', onclick: () => { try { localStorage.setItem('bq_name', i.value); } catch (e) { /* private mode */ } $('iX').click(); } })); }
  else if (k === 'drafts') { $('iT').textContent = 'My drafts'; const d = lsGet('bq', []); if (!d.length) b.textContent = 'No drafts yet. Use Save draft while you build.';
    d.forEach((x, n) => b.append(el('div', { className: 'item' }, el('button', { textContent: x.n, onclick: () => { load(x.s); show('edit'); } }), el('button', { textContent: 'Delete', onclick: () => { d.splice(n, 1); lsSet('bq', d); info('drafts'); } })))); }
  else if (k === 'gallery') { $('iT').textContent = 'Flower gallery'; $('iS').textContent = 'What every flower means in the language of flowers.';
    Object.entries(CATS).forEach(([c, [nm]]) => { const g = el('div', { className: 'gal' });
      Object.keys(TYPES).filter(t => TYPES[t][1] === c).forEach(t => { const d = el('div'); d.innerHTML = TYPES[t].svg(TYPES[t][2][0]); d.append(el('b', { textContent: TYPES[t][0] }), el('small', { textContent: MEAN[t] || '' })); g.append(d); }); b.append(el('h3', { textContent: nm }), g); }); }
  else if (k === 'sent') { $('iT').textContent = 'My sent gifts'; const L = lsGet('bq_sent', []);
    if (!L.length) b.textContent = 'Gifts you send from this device will show up here.'; else if (!SB.url) b.textContent = 'Connect Supabase to see replies.';
    else { b.textContent = 'Loading…'; fetchReplies(L.map(x => x.id)).then(R => { b.replaceChildren();
      L.forEach(x => { const rs = R.filter(y => y.gift_id === x.id), d = el('div', { className: 'sec' });
        d.append(el('h3', { textContent: (x.to ? 'For ' + x.to : 'Gift') + ' · ' + new Date(x.t).toLocaleDateString() + (rs.some(y => y.kind === 'opened') ? ' · Opened' : ' · Not opened yet') }));
        rs.filter(y => y.kind === 'reply').forEach(y => d.append(el('p', { textContent: [y.emoji, y.body].filter(Boolean).join(' ') })));
        d.append(el('button', { textContent: 'Copy link', onclick: () => navigator.clipboard.writeText(x.link).then(() => toast('Link copied')) })); b.append(d); }); }).catch(() => b.textContent = 'Could not load. Check your connection.'); } }
  else { const [t, s, secs] = INFO[k]; $('iT').textContent = t; $('iS').textContent = s; secs.forEach(([hd, p]) => { const d = el('div', { className: 'sec' }); if (hd) d.append(el('h3', { textContent: hd })); d.append(el('p', { textContent: p })); b.append(d); }); }
  $('info').classList.remove('hide'); modalOpen($('iX'));
}
$('iX').onclick = () => { if ($('info').classList.contains('hide')) return; $('info').classList.add('hide'); modalClose(); }; $('info').onclick = e => { if (e.target === $('info')) $('iX').click(); };

// ---- landing decoration ----
{ const w = el('div', { id: 'lspr' }); $('landing').prepend(w);
  [['eucalyptus', '#6b9e6b', -32], ['fern', '#3f7a4f', 30], ['rose', '#e63950', -14], ['peony', '#ff7a9c', 12], ['lily', '#fff6f6', -3], ['babysbreath', '#ffffff', 24], ['tulip', '#ffd166', -24]].forEach(([t, c, r], i) => {
    const d = el('div', { className: 'lb' }); d.innerHTML = TYPES[t].svg(c); d.style.cssText = `--r:${r}deg;animation-delay:${i * .3}s`; $('lbloom').append(d); });
  [['fern', '#3f5a3a', -35, 'left:-30px;bottom:-20px'], ['eucalyptus', '#7a9a82', 35, 'right:-30px;bottom:-20px'], ['olive', '#8a9a5b', 150, 'left:-20px;top:70px'], ['ruscus', '#4e6b45', -150, 'right:-20px;top:70px']].forEach(([t, c, r, pos]) => {
    const d = el('div', { className: 'sprig' }); d.innerHTML = TYPES[t].svg(c); d.style.cssText = `--r:${r}deg;${pos}`; w.append(d); }); }
$('landing').querySelector('footer').onclick = e => { const k = e.target.dataset.k; if (k) info(k); };

// ---- boot ----
(async () => {
  let raw = null, failed = false; const p = new URLSearchParams(location.search), g = p.get('g'), h = location.hash.startsWith('#d=') ? location.hash.slice(3) : '';
  GID = g || '';
  if (g || h) {
    view = true; document.body.classList.add('view', 'opening'); $('landing').querySelector('h1').textContent = 'Opening your gift…';
    try { raw = g && SB.url ? await fetchGift(g) : h ? JSON.parse(await unpack(h)) : null; } catch (e) { console.error('Bad gift link', e); }
    failed = !raw || typeof raw !== 'object';
  }
  if (view) {
    document.body.classList.remove('opening');
    if (failed) { S = D(); $('landing').querySelector('h1').textContent = 'We could not find this gift'; $('ltag').textContent = 'The link may be incomplete, or the gift is no longer available. Ask the sender to share it again.'; $('go').textContent = 'Make a bouquet'; $('go').onclick = () => location.href = location.href.split(/[?#]/)[0]; $('how').classList.add('hide'); $('about').classList.add('hide'); $('lbloom').classList.add('hide'); return; }
    serverLocked = !!raw.locked; if (raw.enc) { sealed = raw; S = clean(raw); } else S = clean(raw);
    if (S.voice) { $('lnote').textContent = 'Includes a voice note'; $('lnote').classList.remove('hide'); }
    if (sealed || serverLocked) $('lnote').classList.add('hide');
    document.title = S.to ? 'A bouquet for ' + S.to : 'A bouquet for you'; buildScene(); recvCover(); fitFrame(); return;
  }
  S = D(); buildScene(); drawPicker(); syncAll(); goStep(1); fitFrame();
})();
