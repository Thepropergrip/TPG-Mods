import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { at, project, readJson, writeJson } from './lib.mjs';
import { check } from './check.mjs';
import { loadStats } from './stats.mjs';
import { renderCatalog, renderQuickLooks, renderDetail } from './render.mjs';
import { renderTopbar, renderContact, renderThanks } from './contact.mjs';

function withFooter(html) {
  return html.replace('</body>', '<footer class="site-footer"><p>TPG Mods is an independent project and is not affiliated with, endorsed by, or sponsored by Eagle Dynamics or any other company represented in these mods. DCS World (Digital Combat Simulator) and all other third-party names, logos, and trademarks belong to their respective owners.</p></footer></body>');
}

await check();
// This fixed path is always inside this checkout, never user input.
await rm(at('dist'), { recursive: true, force: true });
await mkdir(at('dist'), { recursive: true });
await cp(at('site'), at('dist'), { recursive: true });
await writeFile(at('dist/404.html'), withFooter(await readFile(at('dist/404.html'), 'utf8')));
const config = await project();
if (!config.launchReady) {
  await writeFile(at('dist/robots.txt'), 'User-agent: *\nDisallow: /\n');
  await writeFile(at('dist/_headers'), (await readFile(at('site/_headers'), 'utf8')) + '\n/*\n  X-Robots-Tag: noindex, nofollow\n');
}
const mods = await readJson(at('data/mods.json'));
const info = await readJson(at('data/mod-info.json'));
const publicMods = mods.filter(m => m.statusConfirmed && m.status !== 'under-development');
for (const mod of publicMods) {
  if (!info[mod.id]?.facts?.length) throw new Error(`Missing quick facts for ${mod.id}`);
  await mkdir(at('dist/mods', mod.id), { recursive: true });
  await writeFile(at('dist/mods', mod.id, 'index.html'), withFooter(renderDetail(mod, info[mod.id], config.launchReady).replace('<body>', `<body>${renderTopbar()}`)));
}
const index = await readFile(at('dist/index.html'), 'utf8');
await writeFile(at('dist/index.html'), withFooter(index.replace('<body>', `<body>${renderTopbar()}`).replace('<!-- MOD_CATALOG -->', renderCatalog(mods, info, config)).replace('<!-- QUICK_LOOK_TEMPLATES -->', renderQuickLooks(mods, info))));
await mkdir(at('dist/contact/thanks'), { recursive: true });
await writeFile(at('dist/contact/index.html'), withFooter(renderContact(publicMods, config.launchReady)));
await writeFile(at('dist/contact/thanks/index.html'), withFooter(renderThanks(config.launchReady)));
await writeJson(at('dist/data/mods.json'), publicMods.map(({ publicVersion, ...mod }) => ({ ...mod, version: publicVersion ?? mod.version })));
await writeJson(at('dist/data/downloads.json'), await loadStats(config));
console.log('Built dist/. Visitor design can replace site/ later.');
