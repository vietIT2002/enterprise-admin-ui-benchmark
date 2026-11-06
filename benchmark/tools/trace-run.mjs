// Traces one generation with `claude -p --output-format stream-json` and splits its output tokens by kind:
// reasoning, messages, reads, the first write, and later edits. Isolation is the same as bench.mjs.
//   node benchmark/tools/trace-run.mjs --brief 12-contract-detail [--cond green] [--run 1] --out <dir> [--model sonnet]
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { RED, GREEN, briefPrompt } from './codex-run.mjs';
import { claudeArgs } from './bench.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SKILL_DIR = path.join(ROOT, 'skills', 'enterprise-admin-ui');

function kindOf(block) {
  if (block.type === 'thinking' || block.type === 'redacted_thinking') return 'thinking';
  if (block.type === 'text') return 'text';
  if (block.type === 'tool_use') {
    if (block.name === 'Write') return 'write';
    if (block.name === 'Edit' || block.name === 'MultiEdit') return 'edit';
    if (block.name === 'Read' || block.name === 'Glob' || block.name === 'Grep') return 'read';
    return 'other';
  }
  return 'other';
}

function charsOf(block) {
  if (block.type === 'thinking') return (block.thinking || '').length;
  if (block.type === 'text') return (block.text || '').length;
  if (block.type === 'tool_use') {
    const i = block.input || {};
    if (block.name === 'Write') return (i.content || '').length;
    if (block.name === 'Edit') return (i.old_string || '').length + (i.new_string || '').length;
    if (block.name === 'MultiEdit') return (i.edits || []).reduce((a, e) => a + (e.old_string || '').length + (e.new_string || '').length, 0);
    return JSON.stringify(i).length;
  }
  return 0;
}

// Messages arrive as several events (one per content block) that share an id and repeat the usage.
export function analyzeTrace(jsonl) {
  const byId = new Map();
  const chars = { thinking: 0, text: 0, read: 0, write: 0, edit: 0, other: 0 };
  const reads = [];
  let writes = 0;
  let edits = 0;
  let result = null;
  for (const line of jsonl.split('\n')) {
    if (!line.trim()) continue;
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    if (e.type === 'result') {
      const u = e.usage || {};
      result = { costUsd: e.total_cost_usd ?? null, turns: e.num_turns ?? null, outputTokens: u.output_tokens || 0, cacheWrite: u.cache_creation_input_tokens || 0, cacheRead: u.cache_read_input_tokens || 0 };
      continue;
    }
    if (e.type !== 'assistant' || !e.message) continue;
    const m = e.message;
    const entry = byId.get(m.id) || { out: 0, kinds: {} };
    entry.out = Math.max(entry.out, (m.usage && m.usage.output_tokens) || 0);
    for (const b of m.content || []) {
      const k = kindOf(b);
      const c = charsOf(b);
      chars[k] += c;
      entry.kinds[k] = (entry.kinds[k] || 0) + Math.max(c, 1);
      if (b.type === 'tool_use' && b.name === 'Read') {
        const p = String((b.input || {}).file_path || '').replace(/\\/g, '/');
        const m2 = p.match(/enterprise-admin-ui\/(.+)$/) || p.match(/skill\/(.+)$/);
        reads.push(m2 ? m2[1] : path.basename(p));
      }
      if (k === 'write') writes++;
      if (k === 'edit') edits++;
    }
    byId.set(m.id, entry);
  }
  // Streamed assistant events repeat only the usage of the message start, so per-message output tokens are not
  // usable. The result event has the true total: visible output is estimated at ~3.5 characters per token
  // (HTML and code), and the remainder is reasoning that the stream does not show.
  let outputTokens = 0;
  for (const { out } of byId.values()) outputTokens += out;
  const visibleChars = Object.values(chars).reduce((a, b) => a + b, 0);
  const visibleTokensEst = Math.round(visibleChars / 3.5);
  const hiddenTokensEst = result ? Math.max(0, result.outputTokens - visibleTokensEst) : null;
  return { messages: byId.size, outputTokens, chars, reads, writes, edits, visibleTokensEst, hiddenTokensEst, result };
}

async function main() {
  const a = process.argv.slice(2);
  const get = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
  const brief = get('--brief');
  const cond = get('--cond', 'green');
  const run = Number(get('--run', '1'));
  const out = path.resolve(get('--out'));
  const model = get('--model', 'sonnet');
  const cwd = path.join(out, `${cond}-${brief}-run-${run}`);
  fs.mkdirSync(cwd, { recursive: true });
  const page = path.join(cwd, `run-${run}.html`);
  const prompt = (cond === 'green' ? GREEN : RED)(briefPrompt(brief, run % 2 ? 'EN' : 'VI'), page);
  const args = claudeArgs(prompt, { model, addDirs: cond === 'green' ? [SKILL_DIR] : [], effort: get('--effort', null) });
  args[args.indexOf('--output-format') + 1] = 'stream-json';
  args.push('--verbose');
  const started = Date.now();
  const stdout = await new Promise((resolve) => {
    const child = spawn(process.platform === 'win32' ? 'claude.exe' : 'claude', args, { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let s = '';
    child.stdout.on('data', (d) => (s += d));
    child.on('close', () => resolve(s));
  });
  fs.writeFileSync(path.join(cwd, 'trace.jsonl'), stdout);
  const analysis = { brief, cond, run, seconds: Math.round((Date.now() - started) / 1000), pageChars: fs.existsSync(page) ? fs.readFileSync(page, 'utf8').length : 0, ...analyzeTrace(stdout) };
  fs.writeFileSync(path.join(cwd, 'trace-analysis.json'), JSON.stringify(analysis, null, 2) + '\n');
  console.log(JSON.stringify(analysis));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
