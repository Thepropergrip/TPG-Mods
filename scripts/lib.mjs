import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const at = (...parts) => resolve(root, ...parts);
export const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
export async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + '\n');
}
export const project = () => readJson(at('config/project.json'));
export function command(bin, args, { allowFailure = false, inherit = false } = {}) {
  const result = spawnSync(bin, args, { cwd: root, encoding: 'utf8', stdio: inherit ? 'inherit' : 'pipe', shell: false });
  if (!allowFailure && (result.error || result.status !== 0)) {
    throw new Error(`${bin} failed: ${result.error?.message || result.stderr || result.stdout || result.status}`);
  }
  return result;
}
export function gh(args, options) {
  const local = at('.tools/gh/bin/gh.exe');
  const bin = process.env.GH_BIN || (existsSync(local) ? local : 'gh');
  return command(bin, args, options);
}
export function flags(args) {
  const values = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!/^--[a-z-]+$/.test(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Use --name value pairs.');
    if (values[args[i].slice(2)] !== undefined) throw new Error(`Duplicate option: ${args[i]}`);
    values[args[i].slice(2)] = args[i + 1];
  }
  return values;
}
export function validateMods(mods) {
  const ids = new Set();
  for (const mod of mods) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(mod.id) || ids.has(mod.id)) throw new Error('Invalid or duplicate mod ID.');
    ids.add(mod.id);
    if (!['released', 'alpha', 'coming-soon'].includes(mod.status)) throw new Error(`Invalid status: ${mod.id}`);
    if (mod.github && (!mod.version || !mod.github.tag || !mod.github.assetName || !mod.github.downloadUrl)) throw new Error(`Incomplete release: ${mod.id}`);
  }
}
export function validateVersion(version) {
  if (!/^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(version)) throw new Error('Version must be X.Y.Z or X.Y.Z-alpha.N, using the actual mod version.');
}
