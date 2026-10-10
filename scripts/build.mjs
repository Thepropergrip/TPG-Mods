import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { at, project, readJson, writeJson } from './lib.mjs';
import { check } from './check.mjs';
import { loadStats } from './stats.mjs';

await check();
// This fixed path is always inside this checkout, never user input.
await rm(at('dist'), { recursive: true, force: true });
await mkdir(at('dist'), { recursive: true });
await cp(at('site'), at('dist'), { recursive: true });
const config = await project();
if (!config.launchReady) {
  await writeFile(at('dist/robots.txt'), 'User-agent: *\nDisallow: /\n');
  await writeFile(at('dist/_headers'), (await readFile(at('site/_headers'), 'utf8')) + '\n/*\n  X-Robots-Tag: noindex, nofollow\n');
}
const mods = await readJson(at('data/mods.json'));
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const groups = [['released', 'Released'], ['alpha', 'Alpha Release Test Candidates'], ['under-development', 'Under Development']];
const catalog = groups.map(([status, heading]) => {
  const entries = mods.filter(m => m.statusConfirmed && m.status === status);
  if (!entries.length) return '';
  return `<section><h2>${heading}</h2><div class="catalog">${entries.map(m => `<article><div class="photo-placeholder">Photo Coming Soon</div><h3>${escapeHtml(m.title)}</h3>${m.version ? `<p>Version ${escapeHtml(m.version)}</p>` : ''}${status !== 'under-development' && m.github ? `<p><a href="${escapeHtml(m.github.downloadUrl)}">Download ZIP</a></p>` : ''}</article>`).join('')}</div></section>`;
}).join('\n');
const index = await readFile(at('dist/index.html'), 'utf8');
await writeFile(at('dist/index.html'), index.replace('<!-- MOD_CATALOG -->', catalog));
await writeJson(at('dist/data/mods.json'), mods);
await writeJson(at('dist/data/downloads.json'), await loadStats(config));
console.log('Built dist/. Visitor design can replace site/ later.');
