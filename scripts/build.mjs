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
await writeJson(at('dist/data/mods.json'), await readJson(at('data/mods.json')));
await writeJson(at('dist/data/downloads.json'), await loadStats(config));
console.log('Built dist/. Visitor design can replace site/ later.');
