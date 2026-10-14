// Make Your Own Bouquet · How the bouquet looks: wrap, ribbon, backdrop, envelope styling and light/dark theme.
// Classic scripts share one global scope, so these files rely on being loaded in the order listed in index.html.
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

// the colour a wrap shows through glass: kw of the wrap colour mixed with (1 - kw) of white at opacity wa
const glass = (c, kw, wa) => { const n = parseInt(c.slice(1), 16), a = kw + (1 - kw) * wa; return `rgba(${[n >> 16, n >> 8 & 255, n & 255].map(v => Math.round((kw * v + (1 - kw) * wa * 255) / a)).join(',')},${a.toFixed(3)})`; };
let _bg = '';
function applyStyle() {
  $('frame').className = (S.cont || 'paper') + ($('frame').classList.contains('reveal') ? ' reveal' : ''); drawStems();
  const rk = RIB[S.rs] || ['band', 'twine', 'lace'].includes(S.rs) ? S.rs : 'bow'; $('bow').className = rk; $('bow').innerHTML = ribbon(rk, S.rib);
  { const v = S.bgImg ? `url("${S.bgImg}") center/cover no-repeat` : S.bg === 'blush' && S.bgc ? S.bgc : scene(S.bg); if (v !== _bg) { _bg = v; $('canvas').style.background = v; } }
  $('bgcRow').classList.toggle('hide', S.bg !== 'blush' || !!S.bgImg);
  const r = document.documentElement.style; r.setProperty('--w', S.w); r.setProperty('--rib', S.rib); r.setProperty('--env', S.env); r.setProperty('--seal', S.sl);
  // plain colors for everything inside the exported frame: html2canvas can not read CSS color-mix()
  r.setProperty('--env-l', sh(S.env, .24)); r.setProperty('--env-d', sh(S.env, -.15)); r.setProperty('--env-f1', sh(S.env, -.08)); r.setProperty('--env-f2', sh(S.env, -.22));
  r.setProperty('--seal-l', sh(S.sl, .28)); r.setProperty('--seal-d', sh(S.sl, -.38)); r.setProperty('--glass', glass(S.w, .38, .2)); r.setProperty('--frost', glass(S.w, .6, .55)); $('mini').dataset.em = S.se; envLook($('envBig').firstChild);
  $('wrapFront').className = S.p || ''; document.body.classList.toggle('dark', isDark()); $('dark').textContent = isDark() ? 'Light' : 'Dark'; document.body.classList.toggle('pet', !!S.pet); $('petalBtn').textContent = 'Petals: ' + (S.pet ? 'on' : 'off');
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
// light or dark is a preference of this device (it follows the system until you choose), not part of a gift
let darkPref = lsGet('bq_dark', null);
const isDark = () => darkPref === null ? matchMedia('(prefers-color-scheme: dark)').matches : !!darkPref;
$('dark').onclick = () => { darkPref = !isDark(); lsSet('bq_dark', darkPref); applyStyle(); };
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (darkPref === null) applyStyle(); });
const fitImg = (f, mx, q, cb) => { const url = URL.createObjectURL(f), im = new Image(); im.onload = () => { const k = Math.min(1, mx / Math.max(im.width, im.height)), c = el('canvas', { width: Math.round(im.width * k), height: Math.round(im.height * k) }); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url); cb(c.toDataURL('image/jpeg', q)); }; im.onerror = () => toast('That image could not be read. Try a JPG or PNG.'); im.src = url; };
$('bgPhoto').onchange = e => { const f = e.target.files[0]; if (f) fitImg(f, 1000, .7, d => { S.bgImg = d; $('bgPhotoDel').classList.remove('hide'); applyStyle(); }); e.target.value = ''; };
$('bgPhotoDel').onclick = () => { S.bgImg = ''; $('bgPhotoDel').classList.add('hide'); applyStyle(); };
