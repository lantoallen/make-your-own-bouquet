// Make Your Own Bouquet · The builder: steps, flower picker, undo/redo, stems on the stage and fitting the stage.
// Classic scripts share one global scope, so these files rely on being loaded in the order listed in index.html.
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
  $('stepBody').scrollTop = 0; if (step === 3) prev(); if (step === 4) { summary(); $('sched').min = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16); } syncPreview();
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
  $('grid').replaceChildren(...(ids.length ? ids.map(k => { const t = TYPES[k], c = tone(k), b = el('button', { title: t[0] + (MEAN[k] ? ': ' + MEAN[k] : ''), onclick: () => add(k, c) }); b.innerHTML = flat(t.svg(c)); b.append(el('span', { textContent: t[0] })); return b; })
    : [el('p', { className: 'none', textContent: 'No flowers match that search.' })]));
}
$('search').oninput = e => { q = e.target.value; drawPicker(); };

// ---- undo / redo for the arrangement of stems ----
const hist = { undo: [], redo: [] }; let ckKey = '', ckT = 0;
const itemsJSON = () => JSON.stringify(S.items.map(({ t, c, x, y, r, s, z }) => ({ t, c, x, y, r, s, z })));
const trimHist = () => { if (hist.undo.length > 80) hist.undo.shift(); };
// call right BEFORE a change. Repeats of the same kind within 0.7s (taps on Bigger, nudges, wheel) count as one step.
function checkpoint(key) {
  const now = Date.now(); if (key && key === ckKey && now - ckT < 700) { ckT = now; return; } ckKey = key || ''; ckT = now;
  const j = itemsJSON(); if (hist.undo[hist.undo.length - 1] === j) return; hist.undo.push(j); trimHist(); hist.redo = []; syncHist();
}
// call after a drag or resize with the state captured when it began
function commitIfChanged(before) { if (before !== itemsJSON() && hist.undo[hist.undo.length - 1] !== before) { hist.undo.push(before); trimHist(); hist.redo = []; syncHist(); } }
function restore(j) { sel = null; els.forEach(e => e.remove()); els.clear(); S.items = JSON.parse(j); S.items.forEach(mk); select(null); drawStems(); setCount(); }
function undo() { if (!hist.undo.length) return; hist.redo.push(itemsJSON()); restore(hist.undo.pop()); syncHist(); ckKey = ''; }
function redo() { if (!hist.redo.length) return; hist.undo.push(itemsJSON()); restore(hist.redo.pop()); syncHist(); ckKey = ''; }
function syncHist() { $('undoBtn').disabled = !hist.undo.length; $('redoBtn').disabled = !hist.redo.length; }
$('undoBtn').onclick = undo; $('redoBtn').onclick = redo;
// ---- bouquet items ----
// the stem counter and the "pick a flower" hint on an empty stage always change together
const setCount = () => { $('count').textContent = S.items.length; $('emptyHint').classList.toggle('hide', view || S.items.length > 0); };
const mkIt = (t, c) => { const k = TYPES[t][1], sp = k === 'b' ? 55 : 90, x = rnd(-sp, sp); return { t, c, x, y: -(k === 'b' ? rnd(40, 120) : rnd(70, 150)), r: Math.round(x / 5), s: 1, z: k === 'b' || k === 'x' ? 2 : k === 'i' || k === 's' ? 1 : 0 }; };
const fs = () => $('frame').getBoundingClientRect().width / $('frame').offsetWidth || 1;
function add(t, c) {
  if (S.items.length >= 40) return toast('Your bouquet is full (40 stems). Delete one to add another.');
  checkpoint(); const it = mkIt(t, c); if (TYPES[t][1] === 'x') Object.assign(it, { x: 0, y: -95, s: 2, r: 0 });
  S.items.push(it); mk(it); select(it);
}
function place(it) { const e = els.get(it); e.style.transform = `translate(${it.x}px,${it.y}px) rotate(${it.r}deg) scale(${it.s})`; e.style.zIndex = it.z; if (it === sel) inv(it); if (S.cont === 'none') drawStems(); }
function mk(it) {
  const e = el('div', { className: 'sp' }); e.innerHTML = TYPES[it.t].svg(it.c); els.set(it, e); place(it); $('bunch').append(e); setCount();
  if (!view) { e.tabIndex = 0; e.setAttribute('role', 'button'); e.setAttribute('aria-label', TYPES[it.t][0] + ', stem on the bouquet. Arrow keys move it, Delete removes it.');
    e.onfocus = () => { if (sel !== it) select(it); }; e.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(it); } }; }
  let sx, sy, ox, oy, drag = false, before = '';
  e.onpointerdown = ev => { if (view) return; ev.preventDefault(); e.setPointerCapture(ev.pointerId); drag = true; before = itemsJSON(); sx = ev.clientX; sy = ev.clientY; ox = it.x; oy = it.y; select(it); };
  e.onpointermove = ev => { if (!drag) return; it.x = clamp(ox + (ev.clientX - sx) / fs(), -190, 190); it.y = clamp(oy + (ev.clientY - sy) / fs(), -240, 260); place(it); };
  e.onpointerup = e.onpointercancel = () => { if (drag) commitIfChanged(before); drag = false; };
}
const swatchesFor = t => [...new Set([...TYPES[t][2], ...(TYPES[t][1] === 'f' ? GRN : PALETTE)])];
function select(it) {
  sel = it; drawH(it); els.forEach((e, i) => e.classList.toggle('sel', i === it)); $('selbar').classList.toggle('empty', !it || view);
  $('selName').textContent = it ? TYPES[it.t][0] : ''; $('mean').textContent = it && MEAN[it.t] ? MEAN[it.t] : '';
  $('isw').replaceChildren(...(it ? swatchesFor(it.t).map(c => dot(c, c === it.c, () => { checkpoint('color'); it.c = c; els.get(it).innerHTML = TYPES[it.t].svg(c); select(it); })) : []));
  requestAnimationFrame(fitFrame);
}
function removeItem(it) { checkpoint(); els.get(it).remove(); els.delete(it); S.items = S.items.filter(i => i !== it); setCount(); if (sel === it) select(null); drawStems(); }
$('tools').onclick = ev => {
  const b = ev.target.closest('[data-a]'), a = b && b.dataset.a; if (!a || !sel) return;
  if (a === 'd') return removeItem(sel);
  if (a === 'dup') { if (S.items.length >= 40) return toast('Your bouquet is full (40 stems).'); checkpoint(); const c = { ...sel, x: clamp(sel.x + 16, -190, 190), y: clamp(sel.y + 10, -240, 260) }; S.items.push(c); mk(c); return select(c); }
  checkpoint(a);
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
    const before = itemsJSON(), b = $('bunch').getBoundingClientRect(), cx = b.left + it.x * fs(), cy = b.top + it.y * fs(), d0 = Math.hypot(ev.clientX - cx, ev.clientY - cy) || 1, s0 = it.s;
    s.onpointermove = m => { if (h === 'r') it.r = Math.round(Math.atan2(m.clientY - cy, m.clientX - cx) * 180 / Math.PI + 90); else it.s = clamp(s0 * Math.hypot(m.clientX - cx, m.clientY - cy) / d0, .3, 3); place(it); };
    s.onpointerup = s.onpointercancel = () => { s.onpointermove = null; commitIfChanged(before); }; };
}
// trackpad, gesture and touch zoom/rotate, plus keyboard nudging
$('canvas').addEventListener('wheel', e => { if (!sel || view) return; if (e.ctrlKey) { e.preventDefault(); checkpoint('wheel'); sel.s = clamp(sel.s * Math.exp(-e.deltaY * .01), .3, 3); place(sel); } else if (e.altKey) { e.preventDefault(); checkpoint('wheel'); sel.r += e.deltaY * .3; place(sel); } }, { passive: false });
let g0; $('canvas').addEventListener('gesturestart', e => { if (sel) { e.preventDefault(); checkpoint('gesture'); g0 = [sel.s, sel.r]; } }); $('canvas').addEventListener('gesturechange', e => { if (!sel || !g0) return; e.preventDefault(); sel.s = clamp(g0[0] * e.scale, .3, 3); sel.r = g0[1] + e.rotation; place(sel); });
let t0; const td = t => [Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY), Math.atan2(t[1].clientY - t[0].clientY, t[1].clientX - t[0].clientX) * 180 / Math.PI];
$('canvas').addEventListener('touchstart', e => { if (sel && !view && e.touches.length === 2) { checkpoint('pinch'); t0 = [...td(e.touches), sel.s, sel.r]; } }, { passive: true });
$('canvas').addEventListener('touchmove', e => { if (!t0 || e.touches.length !== 2) return; e.preventDefault(); const [d, an] = td(e.touches); sel.s = clamp(t0[2] * d / t0[0], .3, 3); sel.r = Math.round(t0[3] + an - t0[1]); place(sel); }, { passive: false });
$('canvas').addEventListener('touchend', () => { t0 = null; });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { $('close').click(); $('iX').click(); $('menu').classList.add('hide'); return; }
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if ((e.ctrlKey || e.metaKey) && !view && !typing) { const k = e.key.toLowerCase(); if (k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; } if (k === 'y') { e.preventDefault(); redo(); return; } }
  if (!sel || view || typing) return;
  const st = e.shiftKey ? 10 : 2, m = { ArrowLeft: ['x', -st], ArrowRight: ['x', st], ArrowUp: ['y', -st], ArrowDown: ['y', st] }[e.key];
  if (m) { e.preventDefault(); checkpoint('nudge'); sel[m[0]] += m[1]; place(sel); } else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeItem(sel); }
  else if (e.key === ']') { checkpoint('layer'); sel.z = Math.min(sel.z + 1, 6); place(sel); } else if (e.key === '[') { checkpoint('layer'); sel.z = Math.max(sel.z - 1, -1); place(sel); }
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
  const pad = view ? 20 : (innerWidth <= 800 ? 14 : 40), k = clamp(Math.min((w - pad) / 340, (h - pad) / 520), .22, view ? 1.5 : 1.4);
  $('frame').style.setProperty('--fit', k.toFixed(3));
}
new ResizeObserver(fitFrame).observe($('canvas')); addEventListener('resize', fitFrame);
// phones: give the form the room while the keyboard is up
let typingT; $('panel').addEventListener('focusin', e => { if (e.target.matches('input:not([type=checkbox]):not([type=range]):not([type=color]):not([type=file]),textarea')) { clearTimeout(typingT); document.body.classList.add('typing'); } });
$('panel').addEventListener('focusout', () => { clearTimeout(typingT); typingT = setTimeout(() => document.body.classList.remove('typing'), 250); });
$('sizeBtn').onclick = () => { document.body.classList.toggle('big'); $('sizeBtn').textContent = document.body.classList.contains('big') ? 'Smaller preview' : 'Bigger preview'; };
