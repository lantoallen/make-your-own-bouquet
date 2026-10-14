// Lints the app as the browser sees it: the classic scripts listed in index.html are joined in load
// order (they share one global scope) and checked together, so undefined names across files are caught.
import { ESLint } from 'eslint';
import globals from 'globals';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="([^"?]+\.js)(?:\?[^"]*)?"><\/script>/g)].map(m => m[1]);
if (!files.length) { console.error('No local scripts found in index.html'); process.exit(1); }

// map every line of the bundle back to its file so messages point at the real source
const lines = [], origin = [];
for (const f of files) readFileSync(join(root, f), 'utf8').split('\n').forEach((l, i) => { lines.push(l); origin.push(`${f}:${i + 1}`); });
const bundle = join(mkdtempSync(join(tmpdir(), 'bq-lint-')), 'bundle.js');
writeFileSync(bundle, lines.join('\n'));

const eslint = new ESLint({
  cwd: dirname(bundle), overrideConfigFile: true, ignore: false,
  overrideConfig: [{
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'script', globals: { ...globals.browser, html2canvas: 'readonly', QRCode: 'readonly' } },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {
      'no-undef': 'error', 'no-redeclare': 'error', 'no-dupe-keys': 'error', 'no-unreachable': 'error', 'no-const-assign': 'error',
      'no-self-assign': 'error', 'no-unsafe-negation': 'error', 'use-isnan': 'error', 'valid-typeof': 'error', 'no-unused-labels': 'error',
      'no-empty': ['warn', { allowEmptyCatch: true }], 'eqeqeq': ['warn', 'smart'],
    },
  }],
});
const results = await eslint.lintFiles([bundle]);
let errors = 0, warnings = 0;
for (const r of results) for (const m of r.messages) {
  const at = origin[m.line - 1] || `bundle:${m.line}`;
  (m.severity === 2 ? errors++ : warnings++);
  console.log(`${m.severity === 2 ? 'error  ' : 'warning'} ${at}  ${m.message} (${m.ruleId})`);
}
console.log(`\n${files.length} files checked, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
