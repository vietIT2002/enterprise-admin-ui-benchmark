import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const BRIEFS_DIR = path.resolve(here, '../briefs');
export const HELDOUT_DIR = path.resolve(here, '../briefs-heldout');
export const PAGE_TYPES = ['list', 'detail', 'form', 'dashboard', 'settings', 'wizard'];

export function parseBrief(text) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!fm) throw new Error('Brief is missing its --- frontmatter ---');
  const meta = Object.fromEntries(
    fm[1].split(/\r?\n/).filter(Boolean).map((line) => {
      const i = line.indexOf(':');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    })
  );
  const section = (title) => {
    const m = text.match(new RegExp('^## ' + title + '\\r?\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))', 'm'));
    return m ? m[1].trim() : '';
  };
  const checklist = section('Acceptance checklist')
    .split(/\r?\n/)
    .filter((l) => l.startsWith('- [ ] '))
    .map((l) => l.slice(6).trim());
  return {
    id: meta.id,
    pageType: meta.pageType,
    title: (text.match(/^# (.+)$/m) || [])[1],
    promptEn: section('Prompt \\(EN\\)'),
    promptVi: section('Prompt \\(VI\\)'),
    checklist,
  };
}

export async function loadBriefs(dir = BRIEFS_DIR) {
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.md')).sort();
  return Promise.all(files.map(async (file) => ({ file, ...parseBrief(await fs.readFile(path.join(dir, file), 'utf8')) })));
}

// Main briefs plus the held-out ones, sorted by file name. A missing held-out folder adds nothing.
export async function loadAllBriefs(heldoutDir = HELDOUT_DIR) {
  const main = await loadBriefs();
  let held = [];
  try {
    held = await loadBriefs(heldoutDir);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  const seen = new Map(main.map((b) => [b.id, b.file]));
  for (const b of held) {
    if (seen.has(b.id)) throw new Error(`Duplicate brief id "${b.id}" in the main folder (${seen.get(b.id)}) and the held-out folder (${b.file})`);
  }
  return [...main, ...held].sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
}
