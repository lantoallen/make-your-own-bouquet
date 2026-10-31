// Make Your Own Bouquet · Menu, info pages, landing decoration and boot. Loaded last.
// Classic scripts share one global scope, so these files rely on being loaded in the order listed in index.html.
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
// Deleting a sent gift can't be undone, so it takes a second tap within a few seconds.
function deleteButton(x) {
  const btn = el('button', { textContent: 'Delete gift', className: 'danger' }); let armed = 0;
  btn.onclick = async () => {
    if (!armed) { btn.textContent = 'Tap again to delete for good'; armed = setTimeout(() => { armed = 0; btn.textContent = 'Delete gift'; }, 4000); return; }
    clearTimeout(armed); armed = 0; btn.disabled = true; btn.textContent = 'Deleting…';
    try {
      const ok = await deleteGift(x.id, x.del); lsSet('bq_sent', lsGet('bq_sent', []).filter(y => y.id !== x.id));
      toast(ok ? 'Gift deleted. Its link no longer opens.' : 'That gift was already gone, so it was removed from this list.'); info('sent');
    } catch (e) { btn.disabled = false; btn.textContent = 'Delete gift'; toast(e.message === 'setup' ? 'Deleting needs the latest supabase.sql. Run it in Supabase first.' : 'Could not delete. Check your connection and try again.'); }
  };
  return btn;
}
function info(k) {
  const b = $('iB'); b.replaceChildren(); $('iS').textContent = '';
  if (k === 'profile') { $('iT').textContent = 'Your profile'; const i = el('input', { placeholder: 'Your name (used as "From")', value: lsRaw('bq_name') || '' }); b.append(i, el('button', { textContent: 'Save', onclick: () => { try { localStorage.setItem('bq_name', i.value); } catch (e) { /* private mode */ } $('iX').click(); } })); }
  else if (k === 'drafts') { $('iT').textContent = 'My drafts'; const d = lsGet('bq', []); if (!d.length) b.textContent = 'No drafts yet. Use Save draft while you build.';
    d.forEach((x, n) => b.append(el('div', { className: 'item' }, el('button', { textContent: x.n, onclick: () => { load(x.s); show('edit'); } }), el('button', { textContent: 'Delete', onclick: () => { d.splice(n, 1); lsSet('bq', d); info('drafts'); } })))); }
  else if (k === 'gallery') { $('iT').textContent = 'Flower gallery'; $('iS').textContent = 'What every flower means in the language of flowers.';
    Object.entries(CATS).forEach(([c, [nm]]) => { const g = el('div', { className: 'gal' });
      Object.keys(TYPES).filter(t => TYPES[t][1] === c).forEach(t => { const d = el('div'); d.innerHTML = flat(TYPES[t].svg(TYPES[t][2][0])); d.append(el('b', { textContent: TYPES[t][0] }), el('small', { textContent: MEAN[t] || '' })); g.append(d); }); b.append(el('h3', { textContent: nm }), g); }); }
  else if (k === 'sent') { $('iT').textContent = 'My sent gifts'; const L = lsGet('bq_sent', []);
    if (!L.length) b.textContent = 'Gifts you send from this device will show up here.'; else if (!SB.url) b.textContent = 'Connect Supabase to see replies.';
    else { b.textContent = 'Loading…'; fetchReplies(L.map(x => x.id)).then(R => { b.replaceChildren();
      L.forEach(x => { const rs = R.filter(y => y.gift_id === x.id), d = el('div', { className: 'sec' });
        d.append(el('h3', { textContent: (x.to ? 'For ' + x.to : 'Gift') + ' · ' + new Date(x.t).toLocaleDateString() + (rs.some(y => y.kind === 'opened') ? ' · Opened' : ' · Not opened yet') }));
        rs.filter(y => y.kind === 'reply').forEach(y => d.append(el('p', { textContent: [y.emoji, y.body].filter(Boolean).join(' ') })));
        const row = el('div', { className: 'gift-actions' }, el('button', { textContent: 'Copy link', onclick: () => navigator.clipboard.writeText(x.link).then(() => toast('Link copied')) }));
        if (x.del) row.append(deleteButton(x)); else row.append(el('small', { className: 'muted', textContent: 'Sent before deleting was possible.' }));
        d.append(row); b.append(d); }); }).catch(() => b.textContent = 'Could not load. Check your connection.'); } }
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
  // arriving from "Remix this bouquet" on a received gift
  let remix = null; try { remix = sessionStorage.getItem('bq_remix'); sessionStorage.removeItem('bq_remix'); } catch (e) { /* storage blocked */ }
  if (remix) { try { load(JSON.parse(remix)); show('edit'); toast('Here is the bouquet. Change anything you like, then add your own letter.'); } catch (e) { /* bad data: stay on the landing page */ } }
