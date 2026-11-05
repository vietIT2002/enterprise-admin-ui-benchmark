// Trigger-rate test (spec §12): does Claude Code load the skill on its own for management-screen prompts,
// and stay away from it for landing pages? Each prompt runs once per project config with `claude -p`,
// isolated from user plugins, hooks and MCP servers (--setting-sources project, --strict-mcp-config).
// Usage: node benchmark/tools/trigger-run.mjs --out <dir> --config <label>=<projectDir> [--config …] [--only id,id] [--concurrency 3]
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SKILL = 'enterprise-admin-ui';
const CLAUDE = process.platform === 'win32' ? 'claude.exe' : 'claude';
const ARGS = [
  '--setting-sources', 'project', '--strict-mcp-config', '--output-format', 'stream-json', '--verbose',
  '--max-turns', '2', '--model', 'sonnet', '--no-session-persistence',
  '--disallowedTools', 'Write', 'Edit', 'Bash', 'NotebookEdit', 'WebFetch', 'WebSearch',
];

// Reads a stream-json transcript and reports whether the skill was loaded and how.
export function analyzeStream(text) {
  const events = text.split(/\r?\n/).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const init = events.find((e) => e.type === 'system' && e.subtype === 'init') || {};
  const calls = events.filter((e) => e.type === 'assistant').flatMap((e) => (e.message && e.message.content) || []).filter((c) => c.type === 'tool_use');
  let via = null;
  const otherSkills = [];
  for (const c of calls) {
    const input = JSON.stringify(c.input || {});
    if (c.name === 'Skill') {
      if (input.includes(SKILL)) via = via || 'Skill';
      else otherSkills.push((c.input && (c.input.skill || c.input.command)) || input);
    } else if (c.name === 'Read' && input.includes(SKILL) && /SKILL\.md/i.test(input)) via = via || 'Read';
  }
  const result = events.find((e) => e.type === 'result') || {};
  return {
    triggered: !!via,
    via,
    firstTool: calls.length ? calls[0].name : null,
    otherSkills,
    loadedSkills: init.skills || [],
    plugins: init.plugins || [],
    turns: result.num_turns ?? null,
    costUsd: result.total_cost_usd ?? null,
  };
}

export function summarize(rows) {
  const out = {};
  for (const r of rows) {
    const c = (out[r.config] ||= { management: { hit: 0, n: 0 }, landing: { hit: 0, n: 0 } });
    const g = r.should ? c.management : c.landing;
    g.n++;
    if (r.triggered) g.hit++;
  }
  for (const c of Object.values(out)) for (const g of Object.values(c)) g.pct = g.n ? Math.round((g.hit / g.n) * 1000) / 10 : null;
  return out;
}

function runOne(prompt, cwd, file) {
  return new Promise((resolve) => {
    const child = spawn(CLAUDE, ['-p', prompt, ...ARGS], { cwd, windowsHide: true });
    const chunks = [];
    child.stdout.on('data', (d) => chunks.push(d));
    child.stderr.on('data', () => {});
    const timer = setTimeout(() => child.kill(), 240000);
    child.on('close', async () => {
      clearTimeout(timer);
      const text = Buffer.concat(chunks).toString('utf8');
      await fs.writeFile(file, text);
      resolve(text);
    });
  });
}

async function main(argv) {
  const opt = { configs: [], concurrency: 3, only: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') opt.out = path.resolve(argv[++i]);
    else if (argv[i] === '--config') { const [label, dir] = argv[++i].split('='); opt.configs.push({ label, dir: path.resolve(dir) }); }
    else if (argv[i] === '--only') opt.only = argv[++i].split(',');
    else if (argv[i] === '--concurrency') opt.concurrency = Number(argv[++i]);
  }
  if (!opt.out || !opt.configs.length) throw new Error('Usage: --out <dir> --config <label>=<projectDir> [--config …]');
  const { prompts } = JSON.parse(await fs.readFile(path.join(ROOT, 'benchmark/trigger/prompts.json'), 'utf8'));
  const jobs = [];
  for (const cfg of opt.configs) for (const p of prompts) if (!opt.only || opt.only.includes(p.id)) jobs.push({ cfg, p });
  const rows = [];
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const { cfg, p } = jobs[next++];
      const dir = path.join(opt.out, cfg.label);
      await fs.mkdir(dir, { recursive: true });
      const a = analyzeStream(await runOne(p.text, cfg.dir, path.join(dir, `${p.id}.jsonl`)));
      const row = { config: cfg.label, id: p.id, lang: p.lang, should: p.should, ...a };
      rows.push(row);
      console.log(`${cfg.label} ${p.id} ${p.should ? 'mgmt' : 'land'} triggered=${a.triggered}${a.via ? ' via ' + a.via : ''} first=${a.firstTool}`);
    }
  }
  await Promise.all(Array.from({ length: opt.concurrency }, worker));
  rows.sort((a, b) => (a.config + a.id).localeCompare(b.config + b.id));
  const summary = summarize(rows);
  await fs.writeFile(path.join(opt.out, 'results.json'), JSON.stringify({ rows, summary }, null, 2) + '\n');
  console.log(JSON.stringify(summary, null, 2));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (isMain) await main(process.argv.slice(2));
