// One-command benchmark: generate pages with and without the skill, audit them, review them, and compare.
// Prints the plan and a token estimate first; runs only with --yes. Every Claude run is isolated (project settings
// only, no MCP, no Skill tool, no shell), and its token usage is recorded in bench-usage.json.
//
//   node benchmark/tools/bench.mjs --name 2026-11-06-smoke --agent claude|codex
//        [--briefs 12-contract-detail,13-employee-onboarding] [--runs 1,2] [--conds red,green]
//        [--no-review] [--blind [--seed N]] [--model sonnet] [--concurrency 3] [--yes]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { RED, GREEN, briefPrompt, runCodex } from './codex-run.mjs';
import { redact, redactList } from '../../scripts/export-benchmark.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RUNS = path.join(ROOT, 'benchmark', 'runs');
const SKILL_DIR = path.join(ROOT, 'skills', 'enterprise-admin-ui');
const CLAUDE = process.platform === 'win32' ? 'claude.exe' : 'claude';

// Tokens per page measured in earlier runs (Claude Sonnet subagents): generation without and with the skill, review.
export const PER_PAGE = { red: 75000, green: 105000, review: 72000 };

export function planPages({ conds, briefs, runs }) {
  const pages = [];
  for (const cond of conds) for (const brief of briefs) for (const run of runs) pages.push({ cond, brief, run, lang: run % 2 ? 'EN' : 'VI' });
  return pages;
}

export function estimate(pages, { agent, review }) {
  const generation = agent === 'claude' ? pages.reduce((a, p) => a + PER_PAGE[p.cond], 0) : 0;
  const rev = review ? pages.length * PER_PAGE.review : 0;
  return { generation, review: rev, total: generation + rev, codexRuns: agent === 'codex' ? pages.length : 0 };
}

export const runFolder = (name, agent, cond) => `${name}-${agent}-${cond}`;

function briefFile(id) {
  for (const dir of ['briefs', 'briefs-heldout']) {
    const f = path.join(ROOT, 'benchmark', dir, id + '.md');
    if (fs.existsSync(f)) return f;
  }
  throw new Error(`Unknown brief ${id}`);
}

export function checklistOf(id) {
  const md = fs.readFileSync(briefFile(id), 'utf8');
  return md.split(/\r?\n/).filter((l) => l.startsWith('- [ ] ')).map((l) => l.slice(6).trim());
}

function reviewTemplate() {
  const md = fs.readFileSync(path.join(ROOT, 'benchmark', 'REVIEW.md'), 'utf8');
  const start = md.indexOf('\n', md.indexOf('## Reviewer prompt')) + 1;
  const end = md.indexOf('\n## ', start);
  return md.slice(start, end < 0 ? undefined : end).trim();
}

// base: the page path without extension, e.g. <runs>/<folder>/<brief>/run-1. files overrides the input and output paths.
export function reviewPrompt({ brief, run, base, files = null }) {
  const paths = files || {
    HTML_PATH: base + '.html',
    PNG_PATH: base + '.png',
    FULL_PNG_PATH: base + '.full.png',
    AUDIT_PATH: base + '.audit.json',
    REVIEW_PATH: base + '.review.json',
  };
  const fill = { ...paths, CHECKLIST: checklistOf(brief).map((i) => '- ' + i).join('\n'), BRIEF_ID: brief, RUN: String(run) };
  return reviewTemplate().replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in fill ? fill[k] : m));
}

// The same review for a blind code folder from blind.mjs: neutral file names, nothing that names the condition.
export function blindReviewPrompt({ brief, run, dir }) {
  const f = (name) => `${dir}/${name}`;
  return reviewPrompt({ brief, run, files: { HTML_PATH: f('page.html'), PNG_PATH: f('first.png'), FULL_PNG_PATH: f('full.png'), AUDIT_PATH: f('audit.json'), REVIEW_PATH: f('review.json') } });
}

// A later session in the same run folders (run 2 after run 1) adds its pages to the usage file instead of replacing it.
export function mergeUsage(old, usage) {
  if (!old) return usage;
  const session = (u) => ({ started: u.started, finished: u.finished, skillDir: u.skillDir, effort: u.effort });
  return { ...old, sessions: [...(old.sessions || [session(old)]), session(usage)], pages: [...old.pages, ...usage.pages] };
}

// Since 2026-11-07 the agent sometimes writes the page to a sibling of the work folder, joining the two folder names
// with a hyphen (<work>-<cond>-<brief>-run-N) instead of a path separator; the cause is unknown. Returns that path
// when the page is there.
export function findMisplaced(work, cwd, file) {
  for (const dir of [work + '-' + path.basename(cwd), work + path.basename(cwd)]) {
    const p = path.join(dir, file);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function claudeArgs(prompt, { model = 'sonnet', addDirs = [], effort = null } = {}) {
  return [
    '-p', prompt,
    '--setting-sources', 'project', '--strict-mcp-config', '--no-session-persistence',
    '--output-format', 'json', '--model', model, '--permission-mode', 'acceptEdits',
    // Pre-approve the file tools: without this a Write could stop at a permission prompt nobody answers in -p mode.
    '--allowedTools', 'Read,Write,Edit,Glob,Grep',
    '--disallowedTools', 'Skill,Bash,WebFetch,WebSearch,NotebookEdit',
    ...(effort ? ['--effort', effort] : []),
    ...addDirs.flatMap((d) => ['--add-dir', d]),
  ];
}

export function parseClaudeJson(stdout) {
  try {
    const j = JSON.parse(stdout.trim().split('\n').filter(Boolean).pop());
    const u = j.usage || {};
    return { ok: !j.is_error, turns: j.num_turns ?? null, costUsd: j.total_cost_usd ?? null, input: u.input_tokens || 0, cacheRead: u.cache_read_input_tokens || 0, cacheWrite: u.cache_creation_input_tokens || 0, output: u.output_tokens || 0, reply: String(j.result || '').slice(0, 300) };
  } catch {
    return { ok: false };
  }
}

export function runClaude(prompt, cwd, addDirs, model, effort = null) {
  return new Promise((resolve) => {
    fs.mkdirSync(cwd, { recursive: true });
    const started = Date.now();
    const child = spawn(CLAUDE, claudeArgs(prompt, { model, addDirs, effort }), { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('close', (code) => resolve({ code, seconds: Math.round((Date.now() - started) / 1000), ...parseClaudeJson(out), stderr: err.slice(0, 2000) }));
  });
}

export async function pool(items, n, fn) {
  const results = [];
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }));
  return results;
}

async function main() {
  const a = process.argv.slice(2);
  const get = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
  const name = get('--name');
  const agent = get('--agent', 'claude');
  if (!name || !['claude', 'codex'].includes(agent)) throw new Error('Usage: --name <run-name> --agent claude|codex [--briefs …] [--runs 1,2] [--conds red,green] [--no-review] [--yes]');
  const briefs = get('--briefs', '12-contract-detail,13-employee-onboarding,14-equipment-maintenance').split(',');
  const runs = get('--runs', '1').split(',').map(Number);
  const conds = get('--conds', 'red,green').split(',');
  const review = !a.includes('--no-review');
  const blind = a.includes('--blind');
  const model = get('--model', 'sonnet');
  const concurrency = Number(get('--concurrency', '3'));
  const pages = planPages({ conds, briefs, runs });
  const est = estimate(pages, { agent, review });
  const k = (n) => (n / 1e6).toFixed(2) + 'M';
  console.log(`Plan: ${pages.length} pages (${conds.join('/')} × ${briefs.length} briefs × runs ${runs.join(',')}), agent ${agent}, review ${review ? (blind ? 'blind' : 'on') : 'off'}`);
  console.log(`Estimate: Claude tokens ~${k(est.total)} (generation ${k(est.generation)}, review ${k(est.review)})${est.codexRuns ? `, plus ${est.codexRuns} Codex runs on the ChatGPT plan` : ''}`);
  console.log(`Each claude -p call also loads ~90k tokens of system prompt and tool definitions, mostly from cache. The measured cost of every call is written to bench-usage.json.`);
  console.log(`Folders: ${conds.map((c) => runFolder(name, agent, c)).join(', ')}`);
  if (!a.includes('--yes')) {
    console.log('\nNothing ran. Add --yes to run.');
    return;
  }

  const work = fs.mkdtempSync(path.join(os.tmpdir(), `bench-${name}-`));
  const usage = { name, agent, model, effort: get('--effort', null), skillDir: get('--skill-dir', null) ? path.basename(path.resolve(get('--skill-dir'))) : null, started: new Date().toISOString(), pages: [] };
  // 1. Generate
  await pool(pages, concurrency, async (p) => {
    const folder = runFolder(name, agent, p.cond);
    const dest = path.join(RUNS, folder, p.brief, `run-${p.run}.html`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const cwd = path.join(work, `${p.cond}-${p.brief}-run-${p.run}`);
    const out = path.join(cwd, `run-${p.run}.html`);
    let r;
    if (agent === 'claude') {
      // --skill-dir points GREEN at another copy of the skill, for A/B tests of a skill change.
      const skillDir = path.resolve(get('--skill-dir', SKILL_DIR));
      const prompt = p.cond === 'green' ? GREEN(briefPrompt(p.brief, p.lang), out, skillDir) : RED(briefPrompt(p.brief, p.lang), out);
      r = await runClaude(prompt, cwd, p.cond === 'green' ? [skillDir] : [], model, get('--effort', null));
      // claude -p sees the account's email and may put it in mock data: redact private strings before audit and screenshots.
      const found = fs.existsSync(out) ? out : findMisplaced(work, cwd, path.basename(out));
      if (found && found !== out) {
        r.recovered = 'written to ' + path.basename(path.dirname(found)) + ', a sibling of the work folder';
        console.log(`generate ${p.cond} ${p.brief} run-${p.run}: page found in a sibling folder, recovered`);
      }
      if (found) fs.writeFileSync(dest, redact(fs.readFileSync(found, 'utf8'), redactList()));
    } else {
      r = await runCodex({ ...p, work: cwd }, { out: RUNS, model: get('--codex-model', 'gpt-6.1-sol'), effort: get('--effort', 'medium'), winSandbox: 'unelevated', folder: (c) => runFolder(name, agent, c) });
    }
    const written = fs.existsSync(dest);
    usage.pages.push({ ...p, phase: 'generate', written, ...r });
    console.log(`generate ${p.cond} ${p.brief} run-${p.run}: ${written ? 'ok' : 'MISSING'} ${r.seconds}s${r.output ? `, out ${r.output} tokens` : ''}`);
  });
  // 2. Audit
  for (const c of conds) execFileSync('node', [path.join(ROOT, 'benchmark/tools/audit-page.mjs'), '--run', path.join(RUNS, runFolder(name, agent, c))], { stdio: 'inherit' });
  // 3. Review. With --blind, reviewers see only randomly coded copies (page.html, first.png, full.png, audit.json) in
  // neutral folders, and the key that maps them back is kept next to the runs as <name>-<agent>-blind/key.json.
  if (review && blind) {
    const { reviewFoldersBlind } = await import('./blind-review.mjs');
    const folders = conds.map((c) => path.join(RUNS, runFolder(name, agent, c)));
    const r = await reviewFoldersBlind(folders, { seed: Number(get('--seed', String(Date.now() % 1e9))), concurrency, model, keepDir: path.join(RUNS, `${name}-${agent}-blind`) });
    for (const u of r.usage) usage.pages.push({ ...u, cond: conds.find((c) => u.folder === runFolder(name, agent, c)) });
  } else if (review) {
    await pool(pages, concurrency, async (p) => {
      const dir = path.join(RUNS, runFolder(name, agent, p.cond), p.brief);
      if (!fs.existsSync(path.join(dir, `run-${p.run}.audit.json`))) return;
      const base = path.join(dir, `run-${p.run}`);
      const r = await runClaude(reviewPrompt({ brief: p.brief, run: p.run, base }), path.join(work, `review-${p.cond}-${p.brief}-${p.run}`), [dir], model);
      usage.pages.push({ ...p, phase: 'review', written: fs.existsSync(base + '.review.json'), ...r });
      console.log(`review ${p.cond} ${p.brief} run-${p.run}: ${fs.existsSync(base + '.review.json') ? 'ok' : 'MISSING'} ${r.seconds}s`);
    });
  }
  // 4. Aggregate and compare
  for (const c of conds) execFileSync('node', [path.join(ROOT, 'benchmark/tools/aggregate.mjs'), path.join(RUNS, runFolder(name, agent, c))], { stdio: 'ignore' });
  if (conds.includes('red') && conds.includes('green')) {
    execFileSync('node', [path.join(ROOT, 'benchmark/tools/compare.mjs'), path.join(RUNS, runFolder(name, agent, 'red')), path.join(RUNS, runFolder(name, agent, 'green'))], { stdio: 'inherit' });
  }
  usage.finished = new Date().toISOString();
  const target = path.join(RUNS, runFolder(name, agent, conds.includes('green') ? 'green' : conds[0]), 'bench-usage.json');
  const merged = mergeUsage(fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, 'utf8')) : null, usage);
  fs.writeFileSync(target, JSON.stringify(merged, (key, v) => (key === 'stderr' || key === 'work' ? undefined : v), 2) + '\n');
  console.log(`\nUsage per page: ${target}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(String(e.message || e));
    process.exit(1);
  });
}
