// Make Your Own Bouquet · Shared helpers, options, state and validation of incoming gift data.
// Classic scripts share one global scope, so these files rely on being loaded in the order listed in index.html.
SB.url = (SB.url || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, ''); SB.key = (SB.key || '').trim();

const $ = id => document.getElementById(id);
const contact = () => typeof CONTACT === 'string' ? CONTACT.trim() : '';
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const el = (tag, { dataset, ...props } = {}, ...kids) => { const e = document.createElement(tag); Object.assign(e, props); if (dataset) Object.assign(e.dataset, dataset); e.append(...kids); return e; };
const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
const lsRaw = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
let tT; const toast = m => { const t = $('toast'); t.replaceChildren(el('span', { className: 'ti' }), el('span', { textContent: m })); t.classList.remove('hide'); clearTimeout(tT); tT = setTimeout(() => t.classList.add('hide'), 4200); };
$('toast').onclick = () => $('toast').classList.add('hide');

// color swatches are real buttons with a plain-language name (keyboard and screen-reader friendly)
// small thumbnails skip the hand-drawn displacement filter: it is costly and invisible at that size
const flat = svg => svg.split(' filter="url(#rg)"').join('');
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
const D = () => ({ sl: '#b3382c', se: 'flower', st: 'rose', li: 'diamond', tr: 'none', nm: true, ev: '', ps: 100, pr: 0, bgImg: '', pc: '', at: '', atu: '', voice: '', vd: 0, mean: false, items: [], w: '#e6cdb8', p: '', rib: '#8f3b4a', env: '#e8dcc8', on: false, mus: false, ink: '', tz: 20, tl: 1.5, tk: 0, tg: 120, tb: false, ti: null, tu: false, lp: 'pp-plain', lf: 'f-serif', la: 'a-left', ph: 'ph-top', pf: 'pf-round', pet: false, cont: 'paper', rs: 'bow', bg: 'blush', bgc: '', pw: '', media: '', to: '', from: '', text: '', photo: '' });
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
    mean: !!o.mean, on: !!o.on, mus: !!o.mus, pet: !!o.pet, tb: !!o.tb, tu: !!o.tu, ti: o.ti === null || o.ti === undefined ? null : !!o.ti,
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
