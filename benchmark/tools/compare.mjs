import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { aggregate, collectEntries } from './aggregate.mjs';

const num = (v) => typeof v === 'number' && !Number.isNaN(v);
const rate = (x) => (!x || x.pct === null || x.pct === undefined ? 'n/a' : `${x.pct}% (${Math.round(x.violated * 10) / 10}/${x.applicable})`);
const diff = (a, b) => (num(a) && num(b) ? (b - a > 0 ? '+' : '') + String(Math.round((b - a) * 10) / 10) : '—');
const pass = (c) => (c ? c.passRate : null);

export function compare(red, green) {
  const R = red.overall;
  const G = green.overall;
  const reduction = num(R.medianViolations) && R.medianViolations > 0 ? Math.round(((R.medianViolations - G.medianViolations) / R.medianViolations) * 100) : null;
  const targets = [
    { name: 'Median violated rules reduced ≥70%', value: reduction === null ? 'n/a' : `${reduction}%`, pass: reduction !== null && reduction >= 70 },
    { name: '≥80% of runs clean on hard metrics', value: `${G.hardCleanPct}%`, pass: num(G.hardCleanPct) && G.hardCleanPct >= 80 },
    { name: 'Checklist pass rate ≥90%', value: num(pass(G.checklist)) ? `${pass(G.checklist)}%` : 'n/a', pass: num(pass(G.checklist)) && pass(G.checklist) >= 90 },
  ];
  const rows = [
    { label: 'Median score', red: R.medianScore, green: G.medianScore, delta: diff(R.medianScore, G.medianScore) },
    { label: 'Median violated rules', red: R.medianViolations, green: G.medianViolations, delta: diff(R.medianViolations, G.medianViolations) },
    { label: 'Runs clean on hard metrics', red: `${R.hardCleanPct}%`, green: `${G.hardCleanPct}%`, delta: diff(R.hardCleanPct, G.hardCleanPct) },
    { label: 'Checklist pass rate', red: num(pass(R.checklist)) ? `${pass(R.checklist)}%` : 'n/a', green: num(pass(G.checklist)) ? `${pass(G.checklist)}%` : 'n/a', delta: diff(pass(R.checklist), pass(G.checklist)) },
  ];
  for (const rule of green.rules) {
    const a = R.rules[rule];
    const b = G.rules[rule];
    rows.push({ label: rule, red: rate(a), green: rate(b), delta: diff(a && a.pct, b && b.pct) });
  }
  const briefs = green.briefs.map((gb) => {
    const rb = red.briefs.find((b) => b.brief === gb.brief) || {};
    return { brief: gb.brief, red: pass(rb.checklist), green: pass(gb.checklist), delta: diff(pass(rb.checklist), pass(gb.checklist)) };
  });
  const side = (s) => ({ runs: s.overall.runs, errors: s.errors.length, reviews: s.overall.checklist?.reviewed ?? 0 });
  return { setup: { red: side(red), green: side(green) }, targets, rows, briefs };
}

export function compareMarkdown(result, redTitle, greenTitle) {
  const lines = [`# RED vs GREEN — ${redTitle} → ${greenTitle}`, '', '## Setup', '', '| Side | Runs | Errors | Reviews |', '|---|---|---|---|',
    `| RED | ${result.setup.red.runs} | ${result.setup.red.errors} | ${result.setup.red.reviews} |`,
    `| GREEN | ${result.setup.green.runs} | ${result.setup.green.errors} | ${result.setup.green.reviews} |`,
    '', '## Targets (spec §12)', '', '| Target | GREEN | Met |', '|---|---|---|'];
  for (const t of result.targets) lines.push(`| ${t.name} | ${t.value} | ${t.pass ? '✓' : '✗'} |`);
  lines.push('', '## Metrics', '', '| Metric / rule | RED | GREEN | Δ |', '|---|---|---|---|');
  for (const r of result.rows) lines.push(`| ${r.label} | ${r.red} | ${r.green} | ${r.delta} |`);
  lines.push('', '## Checklist pass rate per brief', '', '| Brief | RED | GREEN | Δ |', '|---|---|---|---|');
  for (const b of result.briefs) lines.push(`| ${b.brief} | ${b.red === null || b.red === undefined ? 'n/a' : b.red + '%'} | ${b.green === null || b.green === undefined ? 'n/a' : b.green + '%'} | ${b.delta} |`);
  return lines.join('\n') + '\n';
}

async function main([redDir, greenDir]) {
  if (!redDir || !greenDir) {
    console.error('Usage: node benchmark/tools/compare.mjs <redDir> <greenDir>');
    process.exit(2);
  }
  const red = aggregate(await collectEntries(redDir));
  const green = aggregate(await collectEntries(greenDir));
  const md = compareMarkdown(compare(red, green), path.basename(path.resolve(redDir)), path.basename(path.resolve(greenDir)));
  await fs.writeFile(path.join(greenDir, 'COMPARE.md'), md);
  console.log(md);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (isMain) await main(process.argv.slice(2));
