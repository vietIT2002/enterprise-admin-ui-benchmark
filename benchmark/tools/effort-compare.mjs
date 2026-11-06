// Compares GREEN runs made at different effort levels: checklist, audit score, cost, output tokens and time per page.
// Usage: node benchmark/tools/effort-compare.mjs <label>=<run-folder> [<label>=<run-folder> …]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function folderStats(folder) {
  const usage = JSON.parse(fs.readFileSync(path.join(folder, 'bench-usage.json'), 'utf8'));
  // bench-usage.json covers every condition of the run; keep the one this folder holds.
  const cond = (path.basename(folder).match(/-(red|green)$/) || [, 'green'])[1];
  const gen = usage.pages.filter((p) => p.phase === 'generate' && p.cond === cond);
  let pass = 0;
  let total = 0;
  const scores = [];
  for (const brief of fs.readdirSync(folder, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
    for (const f of fs.readdirSync(path.join(folder, brief))) {
      if (/^run-\d+\.review\.json$/.test(f)) {
        const items = JSON.parse(fs.readFileSync(path.join(folder, brief, f), 'utf8')).items || [];
        total += items.length;
        pass += items.filter((i) => i.pass).length;
      }
      if (/^run-\d+\.audit\.json$/.test(f)) scores.push(JSON.parse(fs.readFileSync(path.join(folder, brief, f), 'utf8')).score);
    }
  }
  const avg = (k) => (gen.length ? gen.reduce((a, p) => a + (Number(p[k]) || 0), 0) / gen.length : 0);
  scores.sort((a, b) => a - b);
  return {
    pages: gen.length,
    written: gen.filter((p) => p.written).length,
    checklist: { pass, total },
    medianScore: scores.length ? scores[Math.floor(scores.length / 2)] : null,
    costPerPage: avg('costUsd'),
    outputPerPage: avg('output'),
    secondsPerPage: avg('seconds'),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log('label      pages  checklist     audit  cost/page  output/page  time/page');
  for (const arg of process.argv.slice(2)) {
    const [label, folder] = arg.split('=');
    const s = folderStats(path.resolve(folder));
    const pct = s.checklist.total ? Math.round((s.checklist.pass / s.checklist.total) * 100) : 0;
    console.log(`${label.padEnd(10)} ${String(s.written + '/' + s.pages).padEnd(6)} ${(s.checklist.pass + '/' + s.checklist.total + ' (' + pct + '%)').padEnd(13)} ${String(s.medianScore).padEnd(6)} $${s.costPerPage.toFixed(2).padStart(7)}  ${Math.round(s.outputPerPage).toString().padStart(10)}  ${Math.round(s.secondsPerPage)}s`);
  }
}
