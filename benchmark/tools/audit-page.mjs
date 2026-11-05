import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { loadAllBriefs } from './briefs.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '../..');
export const AUDIT_SCRIPT = path.resolve(REPO_ROOT, 'skills/enterprise-admin-ui/scripts/audit.js');
export const VIEWPORT = { width: 1440, height: 900 };
const TAILWIND_CDN = /cdn\.tailwindcss\.com/i;

// Path relative to the repo root with forward slashes; files outside the repo keep only their name,
// so saved results never carry a drive letter or a user name.
export function repoRelativeUrl(abs) {
  const rel = path.relative(REPO_ROOT, abs);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return path.basename(abs);
  return rel.split(path.sep).join('/');
}

function displayUrl(url) {
  return url.startsWith('file:') ? repoRelativeUrl(fileURLToPath(url)) : url;
}

// Waits until the DOM has had no mutation for `quietMs` (capped at `capMs`), web fonts are ready and
// finite animations are finished, then scrolls to the top. Returns the time it took in ms and stores the
// number of loading placeholders still present in options.state.loadingPlaceholders.
export async function settle(page, { quietMs = 800, capMs = 8000, state = {} } = {}) {
  const t0 = Date.now();
  await page.evaluate(
    ({ quietMs, capMs }) =>
      new Promise((resolve) => {
        let quiet = null;
        let cap = null;
        const observer = new MutationObserver(() => {
          clearTimeout(quiet);
          quiet = setTimeout(done, quietMs);
        });
        function done() {
          observer.disconnect();
          clearTimeout(quiet);
          clearTimeout(cap);
          resolve();
        }
        observer.observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
        quiet = setTimeout(done, quietMs);
        cap = setTimeout(done, capMs);
      }),
    { quietMs, capMs }
  );
  // skeletons: wait (within the same overall cap) until nothing marks itself busy or pulses
  const remaining = Math.max(0, capMs - (Date.now() - t0));
  state.loadingPlaceholders = await page.evaluate(
    (remaining) =>
      new Promise((resolve) => {
        const visible = (el) => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0';
        };
        // a placeholder is a visible, text-less block of at least 12x12 px; small dots and pulsing badges with text are decoration
        const placeholder = (el) => {
          const r = el.getBoundingClientRect();
          return visible(el) && !el.textContent.trim() && r.width >= 12 && r.height >= 12;
        };
        const count = () =>
          [...document.querySelectorAll('[aria-busy="true"]')].filter(visible).length +
          [...document.querySelectorAll('.animate-pulse')].filter((el) => !el.closest('[aria-busy="true"]') && placeholder(el)).length;
        const end = Date.now() + remaining;
        const tick = () => {
          const n = count();
          if (n === 0 || Date.now() >= end) resolve(n);
          else setTimeout(tick, 100);
        };
        tick();
      }),
    remaining
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const animation of document.getAnimations()) {
      try {
        animation.finish();
      } catch {
        // infinite animations (spinners, pulses) cannot finish
      }
    }
    window.scrollTo(0, 0);
    // frames do not run while a stylesheet that never answers blocks rendering, so do not wait for them forever
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  });
  return Date.now() - t0;
}

// Opens the page, waits for it to settle and records what the environment did to it.
async function openPage(browser, abs, idleTimeout, loadTimeout, capMs) {
  const page = await browser.newPage({ viewport: VIEWPORT });
  const pageErrors = [];
  const failedRequests = [];
  page.on('pageerror', (e) => pageErrors.push(e && e.message ? e.message : String(e)));
  page.on('requestfailed', (r) => failedRequests.push(`${displayUrl(r.url())} ${r.failure() ? r.failure().errorText : 'failed'}`));
  page.on('response', (r) => {
    if (r.status() >= 400) failedRequests.push(`${displayUrl(r.url())} HTTP ${r.status()}`);
  });
  try {
    const url = /^https?:\/\//.test(abs) ? abs : pathToFileURL(abs).href;
    let networkIdle = true;
    let loadEvent = 'load';
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: idleTimeout });
    } catch (e) {
      if (!/timeout/i.test(String(e && e.message))) throw e;
      networkIdle = false;
      try {
        if (page.url() === url) await page.waitForLoadState('load', { timeout: loadTimeout });
        else await page.goto(url, { waitUntil: 'load', timeout: loadTimeout });
      } catch (e2) {
        if (!/timeout/i.test(String(e2 && e2.message))) throw e2;
        // a subresource never answers, so load never fires: DOMContentLoaded has to do
        loadEvent = 'domcontentloaded';
        if (page.url() === url) await page.waitForLoadState('domcontentloaded', { timeout: loadTimeout });
        else await page.goto(url, { waitUntil: 'domcontentloaded', timeout: loadTimeout });
      }
    }
    const state = {};
    const settleMs = await settle(page, { state, ...(capMs ? { capMs } : {}) });
    const loadingPlaceholders = state.loadingPlaceholders ?? 0;
    const tailwindLoaded = await page.evaluate(() => typeof window.tailwind !== 'undefined');
    return { page, env: { tailwindLoaded, networkIdle, loadEvent, pageErrors, failedRequests, settleMs, loadingPlaceholders } };
  } catch (e) {
    await page.close();
    throw e;
  }
}

// The settled DOM without <script> elements: re-auditable later without the CDN or the page's own code.
function renderedHtml(page) {
  return page.evaluate(() => {
    const root = document.documentElement.cloneNode(true);
    for (const s of root.querySelectorAll('script')) s.remove();
    return '<!doctype html>\n' + root.outerHTML + '\n';
  });
}

export async function auditFile(file, { pageType = null, screenshots = true, browser, idleTimeout = 15000, loadTimeout = 30000, capMs } = {}) {
  const abs = path.resolve(file);
  const own = !browser;
  const b = browser || (await chromium.launch());
  try {
    const usesTailwind = TAILWIND_CDN.test(await fs.readFile(abs, 'utf8'));
    let opened = await openPage(b, abs, idleTimeout, loadTimeout, capMs);
    if (usesTailwind && !opened.env.tailwindLoaded) {
      await opened.page.close();
      opened = await openPage(b, abs, idleTimeout, loadTimeout, capMs); // one retry for a flaky CDN
      if (!opened.env.tailwindLoaded) {
        const failed = opened.env.failedRequests.filter((r) => TAILWIND_CDN.test(r)).join('; ');
        await opened.page.close();
        throw new Error(`Tailwind CDN did not load for ${repoRelativeUrl(abs)} after one retry${failed ? ': ' + failed : ''}`);
      }
    }
    const { page, env } = opened;
    try {
      const base = abs.replace(/\.html?$/i, '');
      await fs.writeFile(base + '.rendered.html', await renderedHtml(page));
      await page.addScriptTag({ path: AUDIT_SCRIPT });
      const result = await page.evaluate((o) => window.enterpriseAdminAudit(o), { pageType });
      env.tailwindLoaded = usesTailwind ? env.tailwindLoaded : null;
      result.url = repoRelativeUrl(abs);
      result.env = env;
      await fs.writeFile(base + '.audit.json', JSON.stringify(result, null, 2) + '\n');
      if (screenshots) {
        await page.screenshot({ path: base + '.png' });
        await page.screenshot({ path: base + '.full.png', fullPage: true });
      }
      return result;
    } finally {
      await page.close();
    }
  } finally {
    if (own) await b.close();
  }
}

// Audits a page served over HTTP (a dev server) and writes <outBase>.audit.json, .rendered.html, .png and .full.png.
export async function auditUrl(url, outBase, { pageType = null, screenshots = true, browser, idleTimeout = 30000, loadTimeout = 60000, capMs } = {}) {
  const own = !browser;
  const b = browser || (await chromium.launch());
  try {
    const { page, env } = await openPage(b, url, idleTimeout, loadTimeout, capMs);
    try {
      await fs.mkdir(path.dirname(outBase), { recursive: true });
      await fs.writeFile(outBase + '.rendered.html', await renderedHtml(page));
      await page.addScriptTag({ path: AUDIT_SCRIPT });
      const result = await page.evaluate((o) => window.enterpriseAdminAudit(o), { pageType });
      env.tailwindLoaded = null;
      result.url = url.replace(/^https?:\/\/[^/]+/, '');
      result.env = env;
      await fs.writeFile(outBase + '.audit.json', JSON.stringify(result, null, 2) + '\n');
      if (screenshots) {
        await page.screenshot({ path: outBase + '.png' });
        await page.screenshot({ path: outBase + '.full.png', fullPage: true });
      }
      return result;
    } finally {
      await page.close();
    }
  } finally {
    if (own) await b.close();
  }
}

const runNumber = (f) => Number(f.match(/^run-(\d+)\./)[1]);

// The error message with the page's and the repo's absolute paths made relative.
function errorText(e, abs) {
  const text = e && e.message ? e.message : String(e);
  const swaps = [
    [pathToFileURL(abs).href, repoRelativeUrl(abs)],
    [abs, repoRelativeUrl(abs)],
    [pathToFileURL(REPO_ROOT).href + '/', ''],
    [REPO_ROOT + path.sep, ''],
  ];
  return swaps.reduce((t, [from, to]) => t.split(from).join(to), text);
}

// Audits <runDir>/<brief-id>/run-<n>.html with the page type declared in the brief. Folder names are
// checked before anything is audited. A file that fails gets run-<n>.error.json and the run goes on.
// Returns [{ brief, file, score }] or [{ brief, file, error }] entries.
export async function auditRun(runDir, { heldoutDir } = {}) {
  const briefs = new Map((await loadAllBriefs(heldoutDir)).map((b) => [b.id, b]));
  const dirs = (await fs.readdir(runDir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();
  const unknown = dirs.filter((id) => !briefs.has(id));
  if (unknown.length) throw new Error(`Folder(s) ${unknown.join(', ')} do not match any brief id in benchmark/briefs or benchmark/briefs-heldout`);
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const id of dirs) {
      const folder = path.join(runDir, id);
      const files = (await fs.readdir(folder)).filter((f) => /^run-\d+\.html$/.test(f)).sort((a, b) => runNumber(a) - runNumber(b));
      for (const file of files) {
        const abs = path.join(folder, file);
        const errorFile = abs.replace(/\.html$/, '.error.json');
        try {
          const result = await auditFile(abs, { pageType: briefs.get(id).pageType, browser });
          await fs.rm(errorFile, { force: true });
          results.push({ brief: id, file, score: result.score });
        } catch (e) {
          const error = errorText(e, abs);
          // a failed re-run must not leave the previous run's results for collectEntries to aggregate
          const base = abs.replace(/\.html$/, '');
          for (const ext of ['audit.json', 'png', 'full.png', 'rendered.html']) await fs.rm(`${base}.${ext}`, { force: true });
          await fs.writeFile(errorFile, JSON.stringify({ file, error }, null, 2) + '\n');
          results.push({ brief: id, file, error });
        }
      }
    }
  } finally {
    await browser.close();
  }
  return results;
}

function parseArgs(argv) {
  const out = { files: [], pageType: null, run: null, url: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--page-type') out.pageType = argv[++i];
    else if (argv[i] === '--run') out.run = argv[++i];
    else if (argv[i] === '--url') out.url = argv[++i];
    else if (argv[i] === '--out') out.out = argv[++i];
    else out.files.push(argv[i]);
  }
  return out;
}

const firstLine = (text) => String(text).split('\n')[0];

function printSummary(results) {
  const failed = results.filter((r) => r.error).length;
  console.log(`\n${results.length} files: ${results.length - failed} audited, ${failed} failed`);
  if (failed) process.exitCode = 1;
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.url) {
    if (!args.out) {
      console.error('Usage: node benchmark/tools/audit-page.mjs --url <http://…> --out <path/run-1> [--page-type <type>]');
      process.exit(2);
    }
    const r = await auditUrl(args.url, path.resolve(args.out), { pageType: args.pageType });
    console.log(`${args.url}  score ${r.score}  ${r.violations.map((v) => v.rule).join(', ') || 'no violations'}`);
    return;
  }
  if (args.run) {
    const results = await auditRun(args.run);
    for (const r of results) console.log(r.error ? `${r.brief}/${r.file}  ERROR  ${firstLine(r.error)}` : `${r.brief}/${r.file}  score ${r.score}`);
    printSummary(results);
    return;
  }
  if (!args.files.length) {
    console.error('Usage: node benchmark/tools/audit-page.mjs <file.html>... [--page-type <type>] | --run <runDir>');
    process.exit(2);
  }
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const f of args.files) {
      try {
        const r = await auditFile(f, { pageType: args.pageType, browser });
        results.push({ file: f, score: r.score });
        console.log(`${path.basename(f)}  score ${r.score}  ${r.violations.map((v) => v.rule).join(', ') || 'no violations'}`);
      } catch (e) {
        results.push({ file: f, error: errorText(e, path.resolve(f)) });
        console.log(`${path.basename(f)}  ERROR  ${firstLine(results[results.length - 1].error)}`);
      }
    }
  } finally {
    await browser.close();
  }
  printSummary(results);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (isMain) await main(process.argv.slice(2));
