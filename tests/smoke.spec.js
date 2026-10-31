// End-to-end smoke tests. They run the real app in Chromium against tests/serve.js (same headers as
// production) and replace Supabase with an in-memory stand-in, so nothing here touches a real project.
const { test, expect } = require('@playwright/test');
const crypto = require('crypto');

async function mockSupabase(context) {
  const gifts = {}, replies = [], hashes = {};
  await context.route('**/rest/v1/**', async route => {
    const req = route.request(), p = new URL(req.url()).pathname, body = req.postData() ? JSON.parse(req.postData()) : {};
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
    const json = (status, data) => route.fulfill({ status, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify(data) });
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (p.endsWith('/gifts') && req.method() === 'POST') { gifts[body.id] = body.data; hashes[body.id] = body.del_hash; return route.fulfill({ status: 201, headers: cors }); }
    if (p.endsWith('/rpc/delete_gift')) { const ok = !!gifts[body.gid] && hashes[body.gid] === crypto.createHash('sha256').update(body.code).digest('hex'); if (ok) delete gifts[body.gid]; return json(200, ok); }
    if (p.endsWith('/replies') && req.method() === 'POST') { replies.push(body); return route.fulfill({ status: 201, headers: cors }); }
    if (p.endsWith('/rpc/get_gift')) return json(200, gifts[body.gid] ?? null);
    if (p.endsWith('/rpc/get_replies')) return json(200, replies.filter(r => (body.ids || []).includes(r.gift_id)));
    return json(404, {});
  });
  return { gifts, replies };
}

// open the editor with an empty bouquet
async function start(page) {
  await page.goto('/');
  await page.click('#go');
  await page.click('#scratch');
  await expect(page.locator('#steps')).toBeVisible();
}
const addFlowers = async (page, n = 1) => { for (let i = 0; i < n; i++) await page.locator('#grid button').nth(i).click(); };
const step = (page, n) => page.click(`#steps button[data-s="${n}"]`);

// fills the letter step, sets a password if given, creates the link and returns it
async function makeGift(page, { to = 'Mia', from = 'Allen', text = 'Hello Mia', password = '', voice = false } = {}) {
  await addFlowers(page, 2);
  await step(page, 3);
  await page.check('#msgOn');
  await page.fill('#to', to); await page.fill('#from', from); await page.fill('#text', text);
  if (voice) {
    await page.click('#voiceAcc summary');
    await page.click('#rec');
    await expect(page.locator('#rec')).toHaveText('Stop recording', { timeout: 10000 });   // the microphone has really started
    await page.waitForTimeout(1500);
    await page.click('#rec');
    await expect(page.locator('#voiceTag')).toHaveText('attached', { timeout: 10000 });
  }
  await step(page, 4);
  if (password) await page.fill('#pw', password);
  await page.click('#share');
  await expect(page.locator('#shareBox')).toBeVisible();
  return page.inputValue('#linkTxt');
}

test('loads without console errors or policy violations', async ({ page }) => {
  const problems = [];
  page.on('pageerror', e => problems.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) problems.push('console: ' + m.text()); });
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', e => console.error('CSP ' + e.violatedDirective + ' blocked ' + e.blockedURI)));
  await page.goto('/');
  await expect(page.locator('#landing h1')).toBeVisible();
  await page.click('#go');
  await page.locator('#presets button').first().click();
  for (const n of [2, 3, 4, 1]) await step(page, n);
  expect(problems).toEqual([]);
});

test('undo and redo follow the arrangement', async ({ page }) => {
  await start(page);
  await addFlowers(page, 2);
  await expect(page.locator('#count')).toHaveText('2');
  await page.click('#undoBtn'); await expect(page.locator('#count')).toHaveText('1');
  await page.click('#redoBtn'); await expect(page.locator('#count')).toHaveText('2');
});

test('a bouquet can be saved as a picture', async ({ page }) => {
  await start(page);
  await addFlowers(page, 1);
  const download = page.waitForEvent('download', { timeout: 45000 });
  await page.click('#save');
  expect((await download).suggestedFilename()).toBe('my-bouquet.png');
});

test('a password gift stays locked until the right password', async ({ page, context }) => {
  await mockSupabase(context);
  await start(page);
  const link = await makeGift(page, { password: 'secret-pass' });
  const rx = await context.newPage();
  await rx.goto(link);
  await expect(rx.locator('#ltag')).toContainText('Enter the password');
  await rx.fill('#pwIn', 'not-it'); await rx.click('#go');
  await expect(rx.locator('#pwIn')).toHaveAttribute('placeholder', /Wrong password/);
  await rx.fill('#pwIn', 'secret-pass'); await rx.click('#go');
  await expect(rx.locator('#recvBar')).toBeVisible({ timeout: 20000 });
  await rx.locator('#mini').press('Enter');      // by keyboard: the envelope bobs forever, so it is never "stable" for a mouse click
  await expect(rx.locator('#lText')).toHaveText('Hello Mia');
});

test('a voice note is attached under the greeting', async ({ page, context }) => {
  await mockSupabase(context);
  await start(page);
  const link = await makeGift(page, { voice: true });
  const rx = await context.newPage();
  await rx.goto(link);
  await expect(rx.locator('#lnote')).toHaveText('Includes a voice note');
  await rx.click('#go');
  await expect(rx.locator('#recvBar')).toBeVisible({ timeout: 20000 });
  await rx.locator('#mini').press('Enter');
  await expect(rx.locator('#lVoiceBox')).toBeVisible();
  await expect(rx.locator('#lVoice')).toHaveAttribute('src', /^data:audio\//);
});

test('a changed bouquet is kept in drafts when starting another', async ({ page }) => {
  await start(page);
  await addFlowers(page, 2);
  await page.click('#backBtn');                 // back to the start screen
  await page.locator('#presets button').first().click();
  const drafts = await page.evaluate(() => JSON.parse(localStorage.getItem('bq') || '[]').length);
  expect(drafts).toBe(1);
});

for (const [w, h] of [[320, 568], [360, 640], [390, 844]]) {
  test(`nothing overflows or is cut off at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await start(page);
    await addFlowers(page, 3);
    for (const n of [1, 2, 3, 4]) {
      await step(page, n);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      const f = await page.locator('#frame').boundingBox(), c = await page.locator('#canvas').boundingBox();
      expect(f.x).toBeGreaterThanOrEqual(c.x - 1); expect(f.x + f.width).toBeLessThanOrEqual(c.x + c.width + 1);
      expect(f.y).toBeGreaterThanOrEqual(c.y - 1); expect(f.y + f.height).toBeLessThanOrEqual(c.y + c.height + 1);
    }
  });
}

test('an empty stage points to the flower picker until a flower is added', async ({ page }) => {
  await start(page);
  await expect(page.locator('#emptyHint')).toBeVisible();
  await addFlowers(page, 1);
  await expect(page.locator('#emptyHint')).toBeHidden();
  await page.click('#undoBtn');
  await expect(page.locator('#emptyHint')).toBeVisible();
});

test('a receiver can remix the bouquet without the personal letter', async ({ page, context }) => {
  await mockSupabase(context);
  await start(page);
  const link = await makeGift(page, { to: 'Mia', text: 'Private words' });
  const rx = await context.newPage();
  await rx.goto(link);
  await rx.click('#go');
  await expect(rx.locator('#recvBar')).toBeVisible({ timeout: 20000 });
  await rx.click('#mk');
  await expect(rx.locator('#steps')).toBeVisible();
  await expect(rx.locator('#count')).toHaveText('2');
  expect(await rx.evaluate(() => ({ to: S.to, text: S.text, on: S.on }))).toEqual({ to: '', text: '', on: false });
});

test('the report link only appears when a contact address is set', async ({ page, context }) => {
  await mockSupabase(context);
  await start(page);
  const link = await makeGift(page);
  const open = async () => { const rx = await context.newPage(); await rx.goto(link); await rx.click('#go');
    await expect(rx.locator('#recvBar')).toBeVisible({ timeout: 20000 }); await rx.locator('#mini').press('Enter'); await expect(rx.locator('#lText')).toBeVisible(); return rx; };
  let rx = await open();
  await expect(rx.locator('#reportLink')).toBeHidden();
  // same gift, with a contact configured
  await context.route('**/config.js', async route => { const r = await route.fetch(); route.fulfill({ response: r, body: (await r.text()).replace("const CONTACT = '';", "const CONTACT = 'help@example.com';") }); });
  rx = await open();
  await expect(rx.locator('#reportLink')).toBeVisible();
  await expect(rx.locator('#reportLink')).toHaveAttribute('href', /^mailto:help@example\.com\?subject=/);
});

test('a sender can delete a gift, after confirming, and the link stops working', async ({ page, context }) => {
  const db = await mockSupabase(context);
  await start(page);
  const link = await makeGift(page);
  const id = new URL(link).searchParams.get('g');
  expect(db.gifts[id]).toBeTruthy();
  await page.click('#menuBtn');
  await page.click('#menu [data-k="sent"]');
  const del = page.locator('.gift-actions .danger');
  await del.click();
  await expect(del).toHaveText('Tap again to delete for good');
  expect(db.gifts[id]).toBeTruthy();                       // one tap is not enough
  await del.click();
  await expect(page.locator('#toast')).toContainText('Gift deleted');
  expect(db.gifts[id]).toBeUndefined();
  const rx = await context.newPage();
  await rx.goto(link);
  await expect(rx.locator('#landing h1')).toHaveText('We could not find this gift');
});
