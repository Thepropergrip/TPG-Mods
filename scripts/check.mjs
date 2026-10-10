import { readdir, stat } from 'node:fs/promises';
import { at, project, readJson, validateMods } from './lib.mjs';

export async function check() {
  const config = await project();
  if (!/^[A-Za-z0-9-]+$/.test(config.github.owner) || !/^[A-Za-z0-9_.-]+$/.test(config.github.repo)) throw new Error('Invalid GitHub owner/repository.');
  validateMods(await readJson(at('data/mods.json')));
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
