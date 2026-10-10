import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { at, project, readJson, writeJson } from './lib.mjs';
import { check } from './check.mjs';
import { loadStats } from './stats.mjs';
import { renderCatalog, renderQuickLooks, renderDetail } from './render.mjs';

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
const info = await readJson(at('data/mod-info.json'));
for (const mod of mods.filter(m => m.statusConfirmed)) {
  if (!info[mod.id]?.facts?.length) throw new Error(`Missing quick facts for ${mod.id}`);
  await mkdir(at('dist/mods', mod.id), { recursive: true });
  await writeFile(at('dist/mods', mod.id, 'index.html'), renderDetail(mod, info[mod.id], config.launchReady));
}
const index = await readFile(at('dist/index.html'), 'utf8');
await writeFile(at('dist/index.html'), index.replace('<!-- MOD_CATALOG -->', renderCatalog(mods, info)).replace('<!-- QUICK_LOOK_TEMPLATES -->', renderQuickLooks(mods, info)));
await writeJson(at('dist/data/mods.json'), mods);
await writeJson(at('dist/data/downloads.json'), await loadStats(config));
console.log('Built dist/. Visitor design can replace site/ later.');
