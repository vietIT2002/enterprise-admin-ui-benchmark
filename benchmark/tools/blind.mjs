// Blind review: copies pages from several run folders into neutral, randomly coded folders, so a reviewer cannot tell
// which condition built a page. The key stays in key.json, which reviewers are not given.
//
//   node benchmark/tools/blind.mjs make <out-dir> <run-folder>... [--seed N]
//   node benchmark/tools/blind.mjs unblind <out-dir>      copies <code>/review.json back as run-N.review.blind.json
//   node benchmark/tools/blind.mjs agreement <run-folder>... compares run-N.review.json with run-N.review.blind.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Small deterministic generator, so a seed reproduces the same codes and order.
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (e.isDirectory()) copyDir(path.join(from, e.name), path.join(to, e.name));
    else fs.copyFileSync(path.join(from, e.name), path.join(to, e.name));
  }
}

function pagesIn(folder) {
  const out = [];
  for (const brief of fs.readdirSync(folder, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()) {
    const dir = path.join(folder, brief);
    for (const f of fs.readdirSync(dir)) {
      const m = f.match(/^run-(\d+)\.audit\.json$/);
      if (m) out.push({ folder, brief, run: Number(m[1]), dir });
    }
  }
  return out;
}

export function makeBlind(folders, outDir, { seed = Date.now() } = {}) {
  const rand = rng(seed);
  const all = folders.flatMap(pagesIn);
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  const ALPHA = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const used = new Set();
  const key = {};
  const pages = [];
  fs.mkdirSync(outDir, { recursive: true });
  for (const p of all) {
    let code;
    do code = 'P' + Array.from({ length: 4 }, () => ALPHA[Math.floor(rand() * ALPHA.length)]).join('');
    while (used.has(code));
    used.add(code);
    const dir = path.join(outDir, code);
    fs.mkdirSync(dir, { recursive: true });
    const base = path.join(p.dir, `run-${p.run}`);
    if (fs.existsSync(base + '.html')) fs.copyFileSync(base + '.html', path.join(dir, 'page.html'));
    if (fs.existsSync(base + '.src')) copyDir(base + '.src', path.join(dir, 'src'));
    if (fs.existsSync(base + '.png')) fs.copyFileSync(base + '.png', path.join(dir, 'first.png'));
    if (fs.existsSync(base + '.full.png')) fs.copyFileSync(base + '.full.png', path.join(dir, 'full.png'));
    const audit = JSON.parse(fs.readFileSync(base + '.audit.json', 'utf8'));
    delete audit.url;
    delete audit.env;
    fs.writeFileSync(path.join(dir, 'audit.json'), JSON.stringify(audit, null, 2) + '\n');
    key[code] = { folder: path.resolve(p.folder), brief: p.brief, run: p.run };
    pages.push({ code, brief: p.brief, source: fs.existsSync(base + '.html') ? 'page.html' : 'src' });
  }
  fs.writeFileSync(path.join(outDir, 'key.json'), JSON.stringify(key, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({ seed, pages }, null, 2) + '\n');
  return { pages };
}

export function unblind(outDir) {
  const key = JSON.parse(fs.readFileSync(path.join(outDir, 'key.json'), 'utf8'));
  let n = 0;
  for (const [code, k] of Object.entries(key)) {
    const review = path.join(outDir, code, 'review.json');
    if (!fs.existsSync(review)) continue;
    fs.copyFileSync(review, path.join(k.folder, k.brief, `run-${k.run}.review.blind.json`));
    n++;
  }
  return n;
}

// When a page has only a blind review, it becomes the page review (marked "blind": true), so aggregate, compare and
// the gallery read it like any other. A page that also has an open review keeps both, for agreement().
export function promoteBlind(folders) {
  let n = 0;
  for (const folder of folders) {
    for (const p of pagesIn(folder)) {
      const open = path.join(p.dir, `run-${p.run}.review.json`);
      const blind = path.join(p.dir, `run-${p.run}.review.blind.json`);
      if (!fs.existsSync(blind) || fs.existsSync(open)) continue;
      const review = JSON.parse(fs.readFileSync(blind, 'utf8'));
      fs.writeFileSync(open, JSON.stringify({ ...review, blind: true }, null, 2) + '\n');
      fs.rmSync(blind);
      n++;
    }
  }
  return n;
}

export function agreement(folders) {
  let items = 0;
  let agree = 0;
  const byFolder = {};
  for (const folder of folders) {
    const name = path.basename(folder);
    const f = (byFolder[name] = { open: { pass: 0, total: 0 }, blind: { pass: 0, total: 0 } });
    for (const p of pagesIn(folder)) {
      const open = path.join(p.dir, `run-${p.run}.review.json`);
      const blind = path.join(p.dir, `run-${p.run}.review.blind.json`);
      if (!fs.existsSync(open) || !fs.existsSync(blind)) continue;
      const a = JSON.parse(fs.readFileSync(open, 'utf8')).items;
      const b = JSON.parse(fs.readFileSync(blind, 'utf8')).items;
      for (let i = 0; i < Math.min(a.length, b.length); i++) {
        items++;
        if (Boolean(a[i].pass) === Boolean(b[i].pass)) agree++;
        f.open.total++;
        f.blind.total++;
        if (a[i].pass) f.open.pass++;
        if (b[i].pass) f.blind.pass++;
      }
    }
  }
  return { items, agree, byFolder };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...rest] = process.argv.slice(2);
  const seedAt = rest.indexOf('--seed');
  const seed = seedAt >= 0 ? Number(rest.splice(seedAt, 2)[1]) : undefined;
  if (cmd === 'make') {
    const [out, ...folders] = rest;
    const { pages } = makeBlind(folders.map((f) => path.resolve(f)), path.resolve(out), seed === undefined ? {} : { seed });
    console.log(`${pages.length} pages blinded into ${out}`);
  } else if (cmd === 'unblind') {
    console.log(`${unblind(path.resolve(rest[0]))} reviews copied back`);
  } else if (cmd === 'agreement') {
    const a = agreement(rest.map((f) => path.resolve(f)));
    console.log(JSON.stringify({ ...a, rate: a.items ? Math.round((a.agree / a.items) * 100) + '%' : null }, null, 2));
  } else {
    console.error('Usage: blind.mjs make <out> <run-folder>... [--seed N] | unblind <out> | agreement <run-folder>...');
    process.exit(2);
  }
}
