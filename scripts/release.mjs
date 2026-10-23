import { stat, open, mkdir, copyFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, basename } from 'node:path';
import { at, project, readJson, writeJson, flags, validateVersion, gh, command } from './lib.mjs';

function findRelease(repo, tag) {
  const byTag = gh(['api', `repos/${repo}/releases/tags/${tag}`], { allowFailure: true });
  if (byTag.status === 0) return JSON.parse(byTag.stdout);
  if (!byTag.stderr.includes('404')) throw new Error('Unable to look up the release tag.');
  // Unpublished draft tags do not resolve through the by-tag REST endpoint.
  const pages = JSON.parse(gh(['api', `repos/${repo}/releases?per_page=100`, '--paginate', '--slurp']).stdout);
  return pages.flat().find(release => release.tag_name === tag) ?? null;
}

export async function fingerprint(path) {
  const info = await stat(path);
  if (!info.isFile() || !/\.zip$/i.test(path) || info.size >= 2 * 1024 ** 3 || info.size < 22) throw new Error('Release asset must be a nonempty ZIP smaller than 2 GiB.');
  const file = await open(path, 'r');
  const magic = Buffer.alloc(4);
  try { await file.read(magic, 0, 4, 0); } finally { await file.close(); }
  if (magic.toString('hex') !== '504b0304') throw new Error('File does not begin with a ZIP entry.');
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return { size: info.size, sha256: hash.digest('hex') };
}
async function main() {
  const action = process.argv[2];
  const options = flags(process.argv.slice(3));
  const config = await project();
  const repo = `${config.github.owner}/${config.github.repo}`;
  const planPath = at('.local/release-plan.json');
  if (action === 'prepare') {
    const mods = await readJson(at('data/mods.json'));
    const mod = mods.find(m => m.id === options.mod);
    if (!mod) throw new Error('Choose a mod ID from data/mods.json.');
    if (mod.status === 'under-development') throw new Error('This mod is excluded from downloads while under development. Change its confirmed status before preparing a release.');
    validateVersion(options.version || '');
    if (!['released', 'release-candidate', 'alpha'].includes(options.status)) throw new Error('Provide --status released, --status release-candidate or --status alpha.');
    if (!options.zip || !options.notes) throw new Error('Provide --zip path and --notes path.');
    const zipPath = resolve(options.zip);
    const notesPath = resolve(options.notes);
    if (!(await stat(notesPath)).isFile()) throw new Error('Notes must be a file.');
    const tag = `${mod.id}-v${options.version}`;
    const assetName = basename(zipPath);
    const publicVersion = options['public-version'] ?? (options.version === mod.version ? mod.publicVersion : null) ?? options.version;
    validateVersion(publicVersion);
    const plan = { repo, mod: mod.id, title: mod.title, version: options.version, publicVersion, status: options.status, tag, assetName, zipPath, notesPath, ...await fingerprint(zipPath) };
    if (options['dry-run'] !== 'true') await writeJson(planPath, plan);
    console.log(JSON.stringify(plan, null, 2));
    console.log(options['dry-run'] === 'true' ? 'Dry run only; no plan saved and no upload performed.' : 'Prepared locally. Next: npm run release:upload');
    return;
  }
  const plan = await readJson(planPath);
  if (plan.repo !== repo) throw new Error('The prepared release belongs to another repository.');
  const plannedMod = (await readJson(at('data/mods.json'))).find(m => m.id === plan.mod);
  if (!plannedMod || plannedMod.status === 'under-development') throw new Error('The prepared mod is absent or excluded from downloads.');
  gh(['auth', 'status']);
  if (action === 'upload') {
    const actual = await fingerprint(plan.zipPath);
    if (actual.sha256 !== plan.sha256 || actual.size !== plan.size) throw new Error('ZIP changed after preparation; prepare again.');
    if (findRelease(repo, plan.tag)) throw new Error('That release tag already exists. Existing assets will never be overwritten.');
    const commit = command('git', ['rev-parse', 'HEAD']).stdout.trim();
    await mkdir(at('.local/assets'), { recursive: true });
    const stagedAsset = at('.local/assets', plan.assetName);
    await copyFile(plan.zipPath, stagedAsset);
    const args = ['release', 'create', plan.tag, `${stagedAsset}#${plan.assetName}`, '--repo', repo, '--target', commit, '--draft', '--title', `${plan.title} ${plan.publicVersion ?? plan.version}${plan.status === 'release-candidate' ? ' · Release Candidate' : ''}`, '--notes-file', plan.notesPath];
    if (['alpha', 'release-candidate'].includes(plan.status)) args.push('--prerelease');
    gh(args, { inherit: true });
    console.log('Draft uploaded. Review in GitHub before npm run release:publish.');
    return;
  }
  if (action !== 'publish') throw new Error('Use prepare, upload, or publish.');
  const release = findRelease(repo, plan.tag);
  if (!release) throw new Error('Prepared release was not found. Upload the draft first.');
  if (release.prerelease !== (['alpha', 'release-candidate'].includes(plan.status))) throw new Error('Draft prerelease status differs from the prepared plan.');
  const asset = release.assets.find(a => a.name === plan.assetName || a.label === plan.assetName);
  if (!asset || asset.size !== plan.size) throw new Error('Uploaded ZIP is missing or its size differs.');
  if (asset.digest && asset.digest !== `sha256:${plan.sha256}`) throw new Error('Uploaded checksum does not match.');
  if (release.draft) gh(['release', 'edit', plan.tag, '--repo', repo, '--draft=false', '--latest=false'], { inherit: true });
  const published = JSON.parse(gh(['api', `repos/${repo}/releases/tags/${plan.tag}`]).stdout);
  const publishedAsset = published.assets.find(a => a.id === asset.id);
  const mods = await readJson(at('data/mods.json'));
  const mod = mods.find(m => m.id === plan.mod);
  Object.assign(mod, { version: plan.version, publicVersion: plan.publicVersion ?? plan.version, status: plan.status, statusConfirmed: true, sourceFilename: basename(plan.zipPath), github: { tag: plan.tag, assetName: publishedAsset.name, label: publishedAsset.label || basename(plan.zipPath), downloadUrl: publishedAsset.browser_download_url } });
  await writeJson(at('data/mods.json'), mods);
  console.log('Published release. Updated data/mods.json locally; commit and push that file to update the website.');
}
if (process.argv[1]?.endsWith('release.mjs')) await main();
