import { readdir, stat } from 'node:fs/promises';
import { at, project, readJson, validateMods } from './lib.mjs';

export async function check() {
  const config = await project();
  if (!/^[A-Za-z0-9-]+$/.test(config.github.owner) || !/^[A-Za-z0-9_.-]+$/.test(config.github.repo)) throw new Error('Invalid GitHub owner/repository.');
  const mods = await readJson(at('data/mods.json'));
  validateMods(mods);
  const info = await readJson(at('data/mod-info.json'));
  for (const mod of mods.filter(mod => mod.statusConfirmed && mod.github)) {
    const entries = info[mod.id]?.changelog;
    if (!entries?.length) throw new Error(`Missing Change Log for ${mod.id}`);
    for (const entry of entries) {
      const date = new Date(entry.date);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== entry.date) {
        throw new Error(`Invalid Change Log date for ${mod.id}: ${entry.date}`);
      }
    }
  }
  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const full = `${path}/${entry.name}`;
      if (entry.isSymbolicLink()) throw new Error('Site assets cannot be symlinks.');
      if (entry.isDirectory()) await walk(full);
      else {
        if (/\.(zip|7z|rar|exe|msi|blend|edm)$/i.test(entry.name)) throw new Error('Mod binaries belong in Release assets, not the site.');
        if ((await stat(full)).size > 25 * 1024 * 1024) throw new Error(`Site asset exceeds the Pages per-file limit: ${entry.name}`);
      }
    }
  }
  await walk(at('site'));
  console.log('Configuration and site assets checked.');
}
if (process.argv[1]?.endsWith('check.mjs')) await check();
