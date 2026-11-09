// Blind review of pages from any run folders. It codes the pages, reviews each code folder with a fresh isolated
// agent in a neutral temp folder, copies the verdicts back as run-N.review.json ("blind": true) and keeps the key.
// Use it to review several arms of an A/B test in one blind pool.
//   node benchmark/tools/blind-review.mjs --name <keep-name> [--seed N] [--concurrency 3] [--model sonnet] [--runs 2] <run-folder>...
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeBlind, unblind, promoteBlind } from './blind.mjs';
import { blindReviewPrompt, runClaude, pool } from './bench.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export async function reviewFoldersBlind(folders, { seed = Date.now() % 1e9, concurrency = 3, model = 'sonnet', keepDir = null, runs = null, run = runClaude } = {}) {
  // A temp folder of its own: nothing in its path names a run folder or a condition.
  const neutral = fs.mkdtempSync(path.join(os.tmpdir(), 'review-'));
  const blindDir = path.join(neutral, 'pages');
  const { pages } = makeBlind(folders, blindDir, { seed, runs });
  const key = JSON.parse(fs.readFileSync(path.join(blindDir, 'key.json'), 'utf8'));
  const usage = [];
  await pool(pages, concurrency, async (b) => {
    const dir = path.join(blindDir, b.code);
    const k = key[b.code];
    const r = await run(blindReviewPrompt({ brief: b.brief, run: k.run, dir: dir.split(path.sep).join('/') }), path.join(neutral, `cwd-${b.code}`), [dir], model);
    const written = fs.existsSync(path.join(dir, 'review.json'));
    usage.push({ folder: path.basename(k.folder), brief: b.brief, run: k.run, code: b.code, phase: 'review', blind: true, written, ...r });
    console.log(`blind review ${b.code}: ${written ? 'ok' : 'MISSING'}${r.seconds ? ' ' + r.seconds + 's' : ''}`);
  });
  // Keep the key and the cost first, so a later step that fails cannot lose them.
  if (keepDir) {
    fs.mkdirSync(keepDir, { recursive: true });
    const shortKey = Object.fromEntries(Object.entries(key).map(([c, k]) => [c, { ...k, folder: path.basename(k.folder) }]));
    fs.writeFileSync(path.join(keepDir, 'key.json'), JSON.stringify(shortKey, null, 2) + '\n');
    fs.copyFileSync(path.join(blindDir, 'manifest.json'), path.join(keepDir, 'manifest.json'));
    fs.writeFileSync(path.join(keepDir, 'review-usage.json'), JSON.stringify({ seed, model, reviews: usage }, null, 2) + '\n');
  }
  unblind(blindDir);
  promoteBlind(folders);
  return { pages: pages.length, usage };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const take = (k) => {
    const i = a.indexOf(k);
    return i >= 0 ? a.splice(i, 2)[1] : null;
  };
  const name = take('--name');
  const seed = take('--seed');
  const concurrency = Number(take('--concurrency') || 3);
  const model = take('--model') || 'sonnet';
  const runsArg = take('--runs');
  if (!name || !a.length) {
    console.error('Usage: blind-review.mjs --name <keep-name> [--seed N] [--concurrency 3] [--model sonnet] <run-folder>...');
    process.exit(2);
  }
  const keepDir = path.join(ROOT, 'benchmark', 'runs', name);
  const r = await reviewFoldersBlind(a.map((f) => path.resolve(f)), { seed: seed ? Number(seed) : undefined, concurrency, model, keepDir, runs: runsArg ? runsArg.split(',').map(Number) : null });
  const cost = r.usage.reduce((s, u) => s + (u.costUsd || 0), 0);
  console.log(`${r.pages} pages reviewed blind for $${cost.toFixed(2)}; key in ${keepDir}`);
}
