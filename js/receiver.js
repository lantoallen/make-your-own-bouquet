// Make Your Own Bouquet · The receiver: opening animation, unlocking, replies and saving.
// Classic scripts share one global scope, so these files rely on being loaded in the order listed in index.html.
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
  $('go').textContent = 'Open your gift'; if (needPw) $('pwWrap').classList.remove('hide'); $('how').classList.add('hide'); $('about').classList.add('hide'); lockCheck(); landFx();
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
  curtain(() => { document.body.classList.remove('locked'); $('frame').classList.add('reveal'); fitFrame(); burst(); if (S.mus) music(true); $('recvBar').classList.remove('hide'); }, S.ev);
  if (SB.url && GID) rpost({ gift_id: GID, kind: 'opened' }).catch(() => {});
};
$('saveRecv').onclick = savePicture;
$('saveTxt').onclick = () => { const t = [S.to ? 'Dear ' + S.to + ',' : '', '', S.text, '', S.from ? '— ' + S.from : ''].join('\n').trim() + '\n'; el('a', { download: 'letter.txt', href: 'data:text/plain;charset=utf-8,' + encodeURIComponent(t) }).click(); };
$('mk').onclick = () => location.href = location.href.split(/[?#]/)[0];
const REACT = ['Love it', 'Thank you', 'So sweet', 'Beautiful', 'Made my day']; let emo = '';
$('lReply').querySelector('.em').replaceChildren(...REACT.map(t => el('span', { textContent: t, onclick: e => { emo = t; document.querySelectorAll('#lReply .em span').forEach(x => x.classList.toggle('on', x === e.target)); } })));
$('rSend').onclick = async () => {
  if (!emo && !$('rTxt').value.trim()) return toast('Pick a reaction or write a few words first.');
  try { const r = await rpost({ gift_id: GID, kind: 'reply', emoji: emo, body: $('rTxt').value.trim() }); if (!r.ok) throw 0; $('lReply').textContent = 'Sent. They will love it.'; } catch (e) { toast('Could not send your reply. Please try again.'); }
};
