import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('recruiter entry point contains a visible working demo and source links', () => {
  const html = read('index.html');
  assert.match(html, /href="demo\/"/);
  assert.match(html, /REVIEW MY WORK/);
  assert.match(html, /github\.com\/farrellalberth-hue\/alberth/);
  assert.match(html, /href="#main" class="skip"/);
  assert.match(html, /aria-label="Filter projects"/);
});
test('demo has forms, error live region, navigation and transparent scope label', () => {
  const html = read('demo/index.html');
  for (const name of ['order-form', 'quantity', 'customer', 'create-order', 'invoice-dialog', 'audit-list']) {
    assert.match(html, new RegExp(`id="${name}"`));
  }
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /No backend, network database/);
  assert.match(html, /script type="module" src="demo\.js"/);
});
test('all referenced local entrypoint assets are present', () => {
  for (const file of ['styles.css', 'app.js', 'demo/demo.css', 'demo/demo.js', 'demo/model.mjs']) {
    assert.ok(existsSync(resolve(root, file)), `missing ${file}`);
  }
});
test('frontends do not introduce secrets or privileged tokens', () => {
  const code = ['app.js', 'demo/demo.js', 'demo/model.mjs'].map(read).join('\n');
  assert.doesNotMatch(code, /(?:sk-[a-zA-Z0-9]{20,}|Bearer\s+[A-Za-z0-9-]{20,})/);
});