// Runs the RED/GREEN generation prompts through the Codex CLI, one fresh process per page, isolated from the
// user's Codex config (no plugins, MCP servers or global AGENTS.md) and from this repo (an empty working folder).
// Usage: node benchmark/tools/codex-run.mjs --out <runs-root> --work <scratch-dir> [--model gpt-6.1-sol] [--effort medium]
//        [--briefs 12-contract-detail,13-employee-onboarding] [--conds red,green] [--run 1] [--concurrency 3]
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SKILL_DIR = path.join(ROOT, 'skills', 'enterprise-admin-ui');

export const RED = (prompt, out) => `Do NOT invoke any skills (no Skill tool calls) and do not read any files under \`skills/\`, \`docs/\` or \`benchmark/\` — just do the task directly as you normally would.

Task from a user: "${prompt}"

Constraints: deliver a single self-contained HTML file using Tailwind via CDN (\`<script src="https://cdn.tailwindcss.com"></script>\`) plus vanilla JS with realistic mock data. Do not open a browser, start a server or run tests — write the file once and stop. Write it to:
${out}

When done, reply with only the file path.`;

export const GREEN = (prompt, out) => `A skill for this kind of work is installed at ${SKILL_DIR}. Before you start, read its SKILL.md and follow it; open the reference files it points to when your task needs them. Do not read any other files under \`skills/\`, \`docs/\` or \`benchmark/\`, and do not create any file other than the one below.

Task from a user: "${prompt}"

Constraints: deliver a single self-contained HTML file using Tailwind via CDN (\`<script src="https://cdn.tailwindcss.com"></script>\`) plus vanilla JS with realistic mock data. Do not open a browser, start a server or run tests — write the file once and stop. Write it to:
${out}

When done, reply with only the file path.`;

export function briefPrompt(id, lang) {
  for (const dir of ['briefs', 'briefs-heldout']) {
    const f = path.join(ROOT, 'benchmark', dir, id + '.md');
    if (!fs.existsSync(f)) continue;
    const md = fs.readFileSync(f, 'utf8');
    const m = md.match(new RegExp(`## Prompt \\(${lang}\\)\\s*\\n([\\s\\S]*?)\\n\\s*\\n`));
    if (!m) throw new Error(`No ${lang} prompt in ${f}`);
    return m[1].trim();
  }
  throw new Error(`Unknown brief ${id}`);
}

// Sums token usage from Codex `--json` events.
export function usageOf(jsonl) {
  const total = { input: 0, cached: 0, output: 0, reasoning: 0 };
  for (const line of jsonl.split('\n')) {
    if (!line.trim()) continue;
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    const u = e.usage || (e.msg && e.msg.usage);
    if (!u) continue;
    total.input += u.input_tokens || 0;
    total.cached += u.cached_input_tokens || 0;
    total.output += u.output_tokens || 0;
    total.reasoning += u.reasoning_output_tokens || 0;
  }
  return total;
}

function codexJs() {
  const npmRoot = process.env.APPDATA ? path.join(process.env.APPDATA, 'npm', 'node_modules') : '/usr/local/lib/node_modules';
  return path.join(npmRoot, '@openai', 'codex', 'bin', 'codex.js');
}

function runOne(job, opts) {
  return new Promise((resolve) => {
    fs.mkdirSync(job.work, { recursive: true });
    const out = path.join(job.work, `run-${job.run}.html`);
    const prompt = (job.cond === 'green' ? GREEN : RED)(briefPrompt(job.brief, job.lang), out);
    const args = [
      codexJs(), 'exec', '--json', '--ignore-user-config', '--ephemeral', '--skip-git-repo-check',
      '-m', opts.model, '-c', `model_reasoning_effort="${opts.effort}"`,
      // --ignore-user-config also drops [windows] sandbox; without a sandbox every command is rejected.
      ...(process.platform === 'win32' ? ['-c', `windows.sandbox="${opts.winSandbox}"`] : []),
      '-s', 'workspace-write', '-C', job.work, '-o', path.join(job.work, 'last-message.txt'), '-',
    ];
    const started = Date.now();
    const child = spawn(process.execPath, args, { cwd: job.work, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.stdin.end(prompt);
    child.on('close', (code) => {
      fs.writeFileSync(path.join(job.work, 'events.jsonl'), stdout);
      fs.writeFileSync(path.join(job.work, 'stderr.txt'), stderr);
      const ok = fs.existsSync(out);
      if (ok) {
        const dest = path.join(opts.out, `2026-11-05-codex-${job.cond}`, job.brief, `run-${job.run}.html`);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(out, dest);
      }
      resolve({ ...job, code, ok, seconds: Math.round((Date.now() - started) / 1000), usage: usageOf(stdout) });
    });
  });
}

async function main() {
  const a = process.argv.slice(2);
  const get = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
  const opts = {
    out: path.resolve(get('--out', path.join(ROOT, 'benchmark', 'runs'))),
    work: path.resolve(get('--work')),
    model: get('--model', 'gpt-6.1-sol'),
    effort: get('--effort', 'medium'),
    winSandbox: get('--win-sandbox', 'unelevated'),
  };
  const briefs = get('--briefs', '12-contract-detail,13-employee-onboarding,14-equipment-maintenance').split(',');
  const conds = get('--conds', 'red,green').split(',');
  const run = Number(get('--run', '1'));
  const lang = run % 2 ? 'EN' : 'VI';
  const concurrency = Number(get('--concurrency', '3'));
  const jobs = [];
  for (const cond of conds) for (const brief of briefs) jobs.push({ cond, brief, run, lang, work: path.join(opts.work, `${cond}-${brief}-run-${run}`) });
  const results = [];
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const job = jobs[next++];
      const r = await runOne(job, opts);
      console.log(`${r.cond} ${r.brief} run-${r.run}: exit ${r.code}, file ${r.ok ? 'written' : 'MISSING'}, ${r.seconds}s, tokens in ${r.usage.input} (cached ${r.usage.cached}) out ${r.usage.output}`);
      results.push(r);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, worker));
  fs.writeFileSync(path.join(opts.work, 'results.json'), JSON.stringify({ model: opts.model, effort: opts.effort, results }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
