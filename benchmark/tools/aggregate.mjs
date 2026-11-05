import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import '../../skills/enterprise-admin-ui/scripts/audit.js';

// The audit's fixed rule list, so every rule gets a row even when no run violated it.
export const RULES = globalThis.enterpriseAdminAudit.rules;

const isNum = (n) => typeof n === 'number' && !Number.isNaN(n);
const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

function median(nums) {
  if (!nums.length) return null;
  const s = nums.slice().sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export const HARD_RULES = ['font-size-base', 'table-row-height', 'radius-scale'];

function violationStats(list) {
  const hardClean = list.filter((e) => !e.result.violations.some((v) => HARD_RULES.includes(v.rule))).length;
  return { medianViolations: median(list.map((e) => e.result.violations.length)), hardCleanPct: pct(hardClean, list.length) };
}

async function readJson(file) {
  const text = await fs.readFile(file, 'utf8');
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Cannot parse ${file}: ${e.message}`);
  }
}

// One entry per run: { brief, run, lang, result, review }. A run with run-N.error.json and no audit
// becomes { brief, run, lang, result: null, review: null, error }.
export async function collectEntries(runDir) {
  const entries = [];
  const briefs = (await fs.readdir(runDir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  for (const brief of briefs) {
    const files = await fs.readdir(path.join(runDir, brief));
    for (const f of files) {
      const m = f.match(/^run-(\d+)\.(audit|error)\.json$/);
      if (!m) continue;
      const run = Number(m[1]);
      const lang = run % 2 ? 'en' : 'vi';
      if (m[2] === 'error') {
        if (files.includes(`run-${run}.audit.json`)) continue;
        const { error } = await readJson(path.join(runDir, brief, f));
        entries.push({ brief, run, lang, result: null, review: null, error: String(error) });
        continue;
      }
      const result = await readJson(path.join(runDir, brief, f));
      const reviewName = `run-${run}.review.json`;
      const review = files.includes(reviewName) ? await readJson(path.join(runDir, brief, reviewName)) : null;
      entries.push({ brief, run, lang, result, review });
    }
  }
  return entries.sort((a, b) => a.brief.localeCompare(b.brief) || a.run - b.run);
}

// A run counts toward a rule only when the rule measured something there (metrics.applicable[rule] > 0).
// Results written before metrics.applicable existed count as applicable. table-above-fold is a list-page rule.
function isApplicable(entry, rule) {
  const { options, metrics } = entry.result;
  if (rule === 'table-above-fold' && !(options && options.pageType === 'list')) return false;
  const applicable = metrics && metrics.applicable;
  return !applicable || !(rule in applicable) || applicable[rule] > 0;
}

function ruleRates(list, rules) {
  return Object.fromEntries(
    rules.map((rule) => {
      const measured = list.filter((e) => isApplicable(e, rule));
      const violated = measured.filter((e) => e.result.violations.some((v) => v.rule === rule)).length;
      return [rule, { violated, applicable: measured.length, pct: measured.length ? pct(violated, measured.length) : null }];
    })
  );
}

function checklistOf(list) {
  const reviewed = list.filter((e) => e.review);
  if (!reviewed.length) return null;
  const items = new Map();
  for (const e of reviewed) {
    for (const it of e.review.items) {
      const s = items.get(it.item) || { pass: 0, total: 0 };
      s.total += 1;
      if (it.pass) s.pass += 1;
      items.set(it.item, s);
    }
  }
  let pass = 0;
  let total = 0;
  for (const s of items.values()) {
    pass += s.pass;
    total += s.total;
  }
  return { reviewed: reviewed.length, passRate: pct(pass, total), items: Object.fromEntries(Array.from(items, ([k, s]) => [k, pct(s.pass, s.total)])) };
}

export function aggregate(allEntries) {
  const entries = allEntries.filter((e) => e.result);
  const errors = allEntries.filter((e) => !e.result).map((e) => ({ brief: e.brief, run: e.run, file: `run-${e.run}.html`, error: e.error }));
  const extra = new Set();
  for (const e of entries) for (const v of e.result.violations) if (!RULES.includes(v.rule)) extra.add(v.rule);
  const rules = RULES.concat(Array.from(extra).sort());
  const groups = new Map();
  for (const e of entries) {
    if (!groups.has(e.brief)) groups.set(e.brief, []);
    groups.get(e.brief).push(e);
  }
  const briefs = Array.from(groups.keys()).sort().map((brief) => {
    const list = groups.get(brief);
    return {
      brief,
      runs: list.length,
      medianScore: median(list.map((e) => e.result.score)),
      ...violationStats(list),
      rules: ruleRates(list, rules),
      medianDominantFontSize: median(list.map((e) => e.result.metrics.dominantFontSize).filter(isNum)),
      medianRowHeight: median(list.map((e) => e.result.metrics.rows && e.result.metrics.rows.medianHeight).filter(isNum)),
      medianRadiusCount: median(list.map((e) => e.result.metrics.radii && e.result.metrics.radii.length).filter(isNum)),
      checklist: checklistOf(list),
    };
  });
  return {
    overall: { runs: entries.length, medianScore: median(entries.map((e) => e.result.score)), ...violationStats(entries), rules: ruleRates(entries, rules), checklist: checklistOf(entries) },
    rules,
    briefs,
    errors,
  };
}

export function toMarkdown(summary, title) {
  const fmt = (v, unit = '') => (v === null || v === undefined ? '—' : v + unit);
  const rate = (x) => (!x || x.pct === null ? 'n/a' : `${x.pct}% (${x.violated}/${x.applicable})`);
  const row = (label, all, per) => `| ${label} | ${all} | ${summary.briefs.map(per).join(' | ')} |`;
  const lines = [
    `# Audit summary — ${title}`,
    '',
    `Runs: ${summary.overall.runs} · median score: ${fmt(summary.overall.medianScore)}`,
    '',
    `| Rule | All runs | ${summary.briefs.map((b) => b.brief).join(' | ')} |`,
    `|---|---|${summary.briefs.map(() => '---').join('|')}|`,
  ];
  for (const r of summary.rules) lines.push(row(r, rate(summary.overall.rules[r]), (b) => rate(b.rules[r])));
  lines.push(row('**Median score**', fmt(summary.overall.medianScore), (b) => fmt(b.medianScore)));
  lines.push(row('Median violated rules', fmt(summary.overall.medianViolations), (b) => fmt(b.medianViolations)));
  lines.push(row('Runs clean on hard metrics', fmt(summary.overall.hardCleanPct, '%'), (b) => fmt(b.hardCleanPct, '%')));
  lines.push(row('Median dominant font size', '', (b) => fmt(b.medianDominantFontSize, 'px')));
  lines.push(row('Median row height', '', (b) => fmt(b.medianRowHeight, 'px')));
  lines.push(row('Median radius count', '', (b) => fmt(b.medianRadiusCount)));
  lines.push(row('Checklist pass rate', summary.overall.checklist ? summary.overall.checklist.passRate + '%' : '—', (b) => (b.checklist ? b.checklist.passRate + '%' : '—')));
  if (summary.errors && summary.errors.length) {
    lines.push('', '## Errors', '', `${summary.errors.length} run(s) could not be audited and are not counted above:`, '');
    for (const e of summary.errors) lines.push(`- ${e.brief}/${e.file}: ${String(e.error).split('\n')[0]}`);
  }
  return lines.join('\n') + '\n';
}

async function main([runDir]) {
  if (!runDir) {
    console.error('Usage: node benchmark/tools/aggregate.mjs <runDir>');
    process.exit(2);
  }
  const summary = aggregate(await collectEntries(runDir));
  const md = toMarkdown(summary, path.basename(path.resolve(runDir)));
  await fs.writeFile(path.join(runDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  await fs.writeFile(path.join(runDir, 'summary.md'), md);
  console.log(md);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (isMain) await main(process.argv.slice(2));
