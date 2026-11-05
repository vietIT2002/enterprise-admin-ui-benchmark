// Builds gallery.json for the public benchmark repository: RED and GREEN pages side by side, per suite, brief and run.
// Usage: node benchmark/tools/gallery.mjs <repo-root> [--out gallery.json]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SUITES = [
  { id: 'heldout2', label: 'Held-out 2', red: '2026-11-05-red-heldout2', green: '2026-11-05-green-heldout2', note: 'Three briefs written after the v0.5.2 rules. Claude Sonnet 5.5, single HTML file.' },
  { id: 'codex', label: 'Codex CLI', red: '2026-11-05-codex-red', green: '2026-11-05-codex-green', note: 'The held-out 2 briefs built by Codex CLI (gpt-6.1-sol), single HTML file.' },
  { id: 'next', label: 'Next.js + shadcn', red: '2026-11-05-next-red', green: '2026-11-05-next-green', note: 'The held-out 2 briefs built as routes in a Next.js 16 + shadcn/ui app. Screenshots only; the source is in run-1.src.' },
  { id: 'heldout', label: 'Held-out 1', red: '2026-11-04-red-heldout', green: '2026-11-04-green-heldout', note: 'Three briefs the skill was not written against, measured with v0.1.0.' },
  { id: 'main', label: 'Main suite', red: '2026-11-04-red', green: '2026-11-04-green', note: 'Eight briefs × five runs, v0.1.0. The skill was written from the failures on these briefs, so the gap overstates new screens.' },
];

const rel = (root, p) => path.relative(root, p).split(path.sep).join('/');
const readJson = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);

function briefInfo(root, id) {
  for (const dir of ['briefs', 'briefs-heldout']) {
    const f = path.join(root, 'benchmark', dir, id + '.md');
    if (!fs.existsSync(f)) continue;
    const md = fs.readFileSync(f, 'utf8');
    return { title: (md.match(/^# (.+)$/m) || [, id])[1].trim(), pageType: (md.match(/^pageType:\s*(\S+)/m) || [, null])[1] };
  }
  return { title: id, pageType: null };
}

function side(root, folder, brief, run) {
  const dir = path.join(root, 'benchmark', 'runs', folder, brief);
  const audit = readJson(path.join(dir, `run-${run}.audit.json`));
  if (!audit) return null;
  const review = readJson(path.join(dir, `run-${run}.review.json`));
  const file = (name) => (fs.existsSync(path.join(dir, name)) ? rel(root, path.join(dir, name)) : null);
  const items = review && Array.isArray(review.items) ? review.items : [];
  return {
    score: audit.score,
    auditVersion: audit.version || null,
    rules: (audit.violations || []).map((v) => v.rule),
    checklist: items.length ? { pass: items.filter((i) => i.pass).length, total: items.length } : null,
    tells: review && Array.isArray(review.tells) ? review.tells : [],
    files: {
      html: file(`run-${run}.html`),
      png: file(`run-${run}.png`),
      full: file(`run-${run}.full.png`),
      audit: file(`run-${run}.audit.json`),
      review: file(`run-${run}.review.json`),
      src: file(`run-${run}.src`),
    },
  };
}

function runsIn(root, folder, brief) {
  const dir = path.join(root, 'benchmark', 'runs', folder, brief);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((f) => f.match(/^run-(\d+)\.audit\.json$/)).filter(Boolean).map((m) => Number(m[1]));
}

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function totals(entries) {
  const list = entries.filter(Boolean);
  return {
    pages: list.length,
    checklistPass: list.reduce((a, e) => a + (e.checklist ? e.checklist.pass : 0), 0),
    checklistTotal: list.reduce((a, e) => a + (e.checklist ? e.checklist.total : 0), 0),
    medianScore: median(list.map((e) => e.score)),
  };
}

export function buildGallery(root) {
  const suites = [];
  for (const s of SUITES) {
    const briefIds = new Set();
    for (const folder of [s.red, s.green]) {
      const dir = path.join(root, 'benchmark', 'runs', folder);
      if (!fs.existsSync(dir)) continue;
      for (const d of fs.readdirSync(dir, { withFileTypes: true })) if (d.isDirectory()) briefIds.add(d.name);
    }
    if (!briefIds.size) continue;
    const briefs = [...briefIds].sort().map((id) => {
      const nums = [...new Set([...runsIn(root, s.red, id), ...runsIn(root, s.green, id)])].sort((a, b) => a - b);
      const runs = nums.map((run) => ({ run, lang: run % 2 ? 'en' : 'vi', red: side(root, s.red, id, run), green: side(root, s.green, id, run) }));
      return { id, ...briefInfo(root, id), runs };
    });
    const all = briefs.flatMap((b) => b.runs);
    suites.push({ ...s, briefs, totals: { red: totals(all.map((r) => r.red)), green: totals(all.map((r) => r.green)) } });
  }
  return { generated: new Date().toISOString().slice(0, 10), suites };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv[2] || '.');
  const outArg = process.argv.indexOf('--out');
  const out = outArg > 0 ? path.resolve(process.argv[outArg + 1]) : path.join(root, 'gallery.json');
  const g = buildGallery(root);
  fs.writeFileSync(out, JSON.stringify(g, null, 1) + '\n');
  console.log(`gallery: ${g.suites.map((s) => `${s.id} ${s.totals.red.pages}+${s.totals.green.pages}`).join(', ')} -> ${out}`);
}
