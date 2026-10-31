// Make Your Own Bouquet · Drafts, autosave, presets and occasions, and building the scene from state.
// Classic scripts share one global scope, so these files rely on being loaded in the order listed in index.html.
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
  [...items].sort((x, y) => x.z - y.z).forEach(it => { const e = el('div', { className: 'sp' }); e.innerHTML = flat(TYPES[it.t].svg(it.c)); e.style.transform = `translate(${it.x}px,${it.y}px) rotate(${it.r}deg) scale(${it.s})`; bx.append(e); });
  v.append(bx, w);
  return el('button', { onclick: () => { load({ ...FRESH, ...q, ev: occ ? name : '', items: items.map(i => ({ ...i })) }); show('edit'); } }, v, el('b', { textContent: name }));
}
Object.entries(PRE).forEach(([n, p]) => { if (p.l.length) $(p.occ ? 'occ' : 'presets').append(presetButton(n, p)); });
$('scratch').onclick = () => { load({ ...FRESH }); show('edit'); };
$('resume').onclick = () => { if (!S.items.length) { const a = lsGet('bq_auto', null); if (a) load(a); } show('edit'); };

// ---- building the scene from S ----
function buildScene() {
  els.forEach(e => e.remove()); els.clear(); sel = null; select(null); S.items.forEach(mk); setCount(); fillPat(); applyStyle(); hist.undo = []; hist.redo = []; syncHist();
}
function syncAll() {
  ['to', 'from', 'text', 'media', 'sched'].forEach(k => $(k).value = S[k === 'sched' ? 'at' : k]); $('tcount').textContent = S.text.length; $('pw').value = '';
  $('wrapC').value = S.w; $('ribC').value = S.rib; $('envC').value = S.env; $('sealC').value = S.sl; $('nmOn').checked = S.nm; $('bgc').value = S.bgc || '#e9dfcb'; $('pc').value = S.pc || '#fffdf9';
  $('msgOn').checked = S.on; $('msgBox').classList.toggle('hide', !S.on); $('musOn').checked = S.mus; $('meanOn').checked = S.mean;
  $('ps').value = S.ps; $('psv').textContent = S.ps + '%'; $('pr').value = S.pr; $('prv').textContent = S.pr; $('bgPhotoDel').classList.toggle('hide', !S.bgImg);
  syncPhoto(); syncVoice(); syncText(); syncChoices(); prev(); syncPreview();
}
// Starting something new never throws away work in progress: if the bouquet was changed, it goes to My drafts first.
let baseline = '';
function stash() {
  if (view || !S.items.length) return; const j = JSON.stringify(snap()); if (j === baseline) return;
  const d = lsGet('bq', []); if (d.length && JSON.stringify(d[0].s) === j) return;
  d.unshift({ n: 'Auto-saved · ' + (S.to ? 'For ' + S.to + ' · ' : '') + new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }), s: snap() });
  if (lsSet('bq', d.slice(0, 8))) toast('Your previous bouquet was saved to My drafts.');
}
function load(o) { stash(); S = clean(o); if (!S.from) S.from = lsRaw('bq_name') || ''; buildScene(); syncAll(); goStep(1); baseline = JSON.stringify(snap()); }
