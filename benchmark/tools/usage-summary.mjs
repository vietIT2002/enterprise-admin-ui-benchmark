// Summarises bench-usage.json: tokens, cost and time per phase and condition, and the GREEN / RED ratio.
// Usage: node benchmark/tools/usage-summary.mjs <bench-usage.json>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FIELDS = ['costUsd', 'input', 'cacheRead', 'cacheWrite', 'output', 'turns', 'seconds'];

export function summarize(usage) {
  const groups = {};
  for (const p of usage.pages) {
    const key = `${p.phase}:${p.cond}`;
    const g = (groups[key] ||= { phase: p.phase, cond: p.cond, pages: 0, written: 0, ...Object.fromEntries(FIELDS.map((f) => [f, 0])) });
    g.pages++;
    if (p.written) g.written++;
    for (const f of FIELDS) g[f] += Number(p[f]) || 0;
  }
  const per = (g) => Object.fromEntries(FIELDS.map((f) => [f, g.pages ? g[f] / g.pages : 0]));
  const rows = Object.values(groups).map((g) => ({ ...g, perPage: per(g) }));
  const find = (phase, cond) => rows.find((r) => r.phase === phase && r.cond === cond);
  const red = find('generate', 'red');
  const green = find('generate', 'green');
  const ratio = red && green ? Object.fromEntries(FIELDS.map((f) => [f, red.perPage[f] ? green.perPage[f] / red.perPage[f] : null])) : null;
  const totalCost = rows.reduce((a, r) => a + r.costUsd, 0);
  return { rows, ratio, totalCost };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const s = summarize(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')));
  const f = (n, d = 0) => (n == null ? '—' : Number(n).toFixed(d));
  console.log('phase    cond   pages  cost/page  input  cacheRead  cacheWrite  output  turns  seconds');
  for (const r of s.rows) {
    const p = r.perPage;
    console.log(`${r.phase.padEnd(8)} ${r.cond.padEnd(6)} ${String(r.written + '/' + r.pages).padEnd(6)} $${f(p.costUsd, 2).padStart(8)}  ${f(p.input).padStart(5)}  ${f(p.cacheRead).padStart(9)}  ${f(p.cacheWrite).padStart(10)}  ${f(p.output).padStart(6)}  ${f(p.turns, 1).padStart(5)}  ${f(p.seconds).padStart(7)}`);
  }
  if (s.ratio) console.log('\nGREEN / RED generation:', Object.entries(s.ratio).map(([k, v]) => `${k} ${v == null ? '—' : v.toFixed(2) + '×'}`).join(', '));
  console.log(`Total cost: $${s.totalCost.toFixed(2)}`);
}
