// Copies each route's source from the Next.js bench apps into a run folder and audits the page over HTTP.
// Usage: node benchmark/tools/next-collect.mjs --apps <dir-with-red-and-green> --red-port 3101 --green-port 3102 [--run 1]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { auditUrl } from './audit-page.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const ROUTES = [
  { brief: '12-contract-detail', dir: 'contracts/[id]', url: '/contracts/HD-2026-0187', pageType: 'detail' },
  { brief: '13-employee-onboarding', dir: 'employees/new', url: '/employees/new', pageType: 'form' },
  { brief: '14-equipment-maintenance', dir: 'equipment', url: '/equipment', pageType: 'list' },
];

function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name);
    const b = path.join(to, e.name);
    if (e.isDirectory()) copyTree(a, b);
    else fs.copyFileSync(a, b);
  }
}

async function main() {
  const a = process.argv.slice(2);
  const get = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
  const apps = path.resolve(get('--apps'));
  const run = Number(get('--run', '1'));
  const ports = { red: get('--red-port', '3101'), green: get('--green-port', '3102') };
  const browser = await chromium.launch();
  try {
    for (const cond of ['red', 'green']) {
      for (const r of ROUTES) {
        const runDir = path.join(ROOT, 'benchmark', 'runs', `2026-11-05-next-${cond}`, r.brief);
        const src = path.join(runDir, `run-${run}.src`);
        fs.rmSync(src, { recursive: true, force: true });
        copyTree(path.join(apps, cond, 'app', ...r.dir.split('/')), src);
        const url = `http://localhost:${ports[cond]}${r.url}`;
        try {
          const res = await auditUrl(url, path.join(runDir, `run-${run}`), { pageType: r.pageType, browser });
          console.log(`${cond} ${r.brief}: score ${res.score} ${res.violations.map((v) => v.rule).join(', ')}; page errors ${res.env.pageErrors.length}`);
        } catch (e) {
          fs.writeFileSync(path.join(runDir, `run-${run}.error.json`), JSON.stringify({ error: String(e && e.message) }, null, 2));
          console.log(`${cond} ${r.brief}: ERROR ${String(e && e.message).split('\n')[0]}`);
        }
      }
    }
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
