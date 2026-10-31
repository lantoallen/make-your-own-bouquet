// Make Your Own Bouquet · The letter: editing, live preview, text style, voice notes, music and picture export.
// Classic scripts share one global scope, so these files rely on being loaded in the order listed in index.html.
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
  $('lReply').classList.toggle('hide', !(view && SB.url && GID)); $('lActions').classList.toggle('hide', !(view && (S.text || contact()))); $('saveTxt').classList.toggle('hide', !S.text); $('reportLink').classList.toggle('hide', !(view && contact())); if (view && contact()) $('reportLink').href = reportHref();
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
  if (s) { const f = el('iframe', { src: s, allow: 'autoplay;encrypted-media', loading: 'lazy', referrerPolicy: 'strict-origin-when-cross-origin', title: y ? 'Video player' : 'Song player' }); f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox'); f.style.cssText = 'width:100%;height:' + (y ? 180 : 152) + 'px;border:0;border-radius:8px;margin-bottom:12px'; m.append(f); }
  else m.append(el('a', { href: u.href, target: '_blank', rel: 'noopener noreferrer', textContent: 'Open the song / video' }));
}

// recording
const REC_MAX = 30;
let mr, recJob = null, recTick = 0, recStarting = false, recWanted = false;
// Formats to try in order: MP4/AAC first (plays on iPhones), then WebM/Opus. Some encoders reject a forced
// bitrate (Chrome's AAC refuses exactly 32 kbps), so each format is tried with and without one.
const recOptions = () => { if (!window.MediaRecorder) return []; const ok = t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t), out = [];
  ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'].filter(ok).forEach(t => out.push({ mimeType: t, audioBitsPerSecond: 64000 }, { mimeType: t }));
  out.push({}); return out; };
function syncVoice() {
  const has = !!S.voice; $('recPrev').classList.toggle('hide', !has); $('recDel').classList.toggle('hide', !has); if (has) $('recPrev').src = S.voice;
  $('rec').textContent = has ? 'Record again' : 'Record voice note'; $('rec').classList.remove('live'); $('recStat').classList.toggle('hide', !has);
  $('recStat').textContent = has ? 'Saved' + (S.vd ? ' (' + mmss(S.vd) + ')' : '') + '. It will play at the top of the letter.' : ''; $('voiceTag').textContent = has ? 'attached' : '';
}
const stopRec = () => { recWanted = false; if (mr && mr.state === 'recording') mr.stop(); return recJob || Promise.resolve(); };
$('rec').onclick = async () => {
  if (recStarting) return;                       // the microphone is still starting: a second tap must not start a second recorder
  if (mr && mr.state === 'recording') return stopRec();
  if (!navigator.mediaDevices || !window.MediaRecorder) return toast('Voice notes need a recent browser and a secure (https) page.');
  let stream; recStarting = true; $('rec').disabled = true; $('rec').textContent = 'Starting microphone…';
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { recStarting = false; $('rec').disabled = false; syncVoice(); return toast('Microphone access was blocked. Allow it in your browser settings and try again.'); }
  recStarting = false; $('rec').disabled = false;
  const tries = recOptions(), t0 = Date.now(); recWanted = true;
  recJob = new Promise(resolve => {
    const done = () => { recJob = null; recWanted = false; resolve(); };
    const finish = (type, chunks) => {
      clearInterval(recTick); stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(chunks, { type });
      if (!blob.size) { toast('That recording was empty. Please try again.'); syncVoice(); return done(); }
      const f = new FileReader(); f.onerror = () => { toast('Could not save the recording.'); done(); };
      f.onload = () => { S.voice = f.result.replace(/^data:[^,]*/, 'data:' + type + ';base64'); S.vd = clamp(Math.round((Date.now() - t0) / 1000), 1, REC_MAX); setLetter(true); syncVoice(); prev(); toast('Voice note saved. It will play at the top of the letter.'); done(); };
      f.readAsDataURL(blob);
    };
    const attempt = i => {
      let rec; try { rec = new MediaRecorder(stream, tries[i]); } catch (e) { return i + 1 < tries.length ? attempt(i + 1) : finish('audio/webm', []); }
      mr = rec; const chunks = []; let broke = false;
      rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onerror = () => { broke = true; };
      // if the encoder failed on its own (the user did not stop it), quietly move on to the next format
      rec.onstop = () => { if ((broke || !chunks.length) && recWanted && i + 1 < tries.length) return attempt(i + 1); finish((rec.mimeType || tries[i].mimeType || 'audio/webm').split(';')[0], chunks); };
      rec.start();
    };
    attempt(0);
  });
  $('rec').textContent = 'Stop recording'; $('rec').classList.add('live'); $('recStat').classList.remove('hide');
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
  select(null); await new Promise(r => { let d = false; const go = () => { if (!d) { d = true; r(); } }; requestAnimationFrame(() => requestAnimationFrame(go)); setTimeout(go, 150); }); // the timer covers hidden tabs, where frames are paused
  const f = $('frame'); fitLock = true; f.style.setProperty('--fit', 1); await new Promise(r => setTimeout(r, 80));
  // html2canvas copies the whole page, so skip everything except the bouquet (38s down to about 2s)
  const skip = n => n.matches && n.matches('#start,#landing,#panel,#bar,#menu,#info,#ov,#petals,#toolbar,#selbar,#bloomScreen,#toast,#letterView,#envView,#viewSeg,#sizeBtn,#hint,.bp');
  try { const c = await html2canvas(f, { backgroundColor: null, ignoreElements: skip }); el('a', { download: view && S.to ? 'bouquet-for-' + S.to.replace(/[^\w-]+/g, '-').toLowerCase() + '.png' : 'my-bouquet.png', href: c.toDataURL() }).click(); } catch (e) { toast('Could not save the picture.'); }
  fitLock = false; fitFrame();
}
$('save').onclick = savePicture;
{ const cols = ['#f4a6d7', '#ffd1dc', '#fdd7e4', '#ffe9a8', '#e6d9ff', '#f9c6b4']; for (let i = 0; i < 16; i++) { const s = el('span'); const w = rnd(10, 18); s.style.cssText = `left:${rnd(0, 97)}vw;width:${w}px;height:${Math.round(w * 1.3)}px;--pc:${cols[i % cols.length]};animation-duration:${rnd(9, 18)}s;animation-delay:-${rnd(0, 15)}s`; $('petals').append(s); } }
