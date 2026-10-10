import { at, project, readJson, writeJson } from './lib.mjs';

export function aggregate(releases, mods, generatedAt = new Date().toISOString()) {
  const result = { generatedAt, source: 'github-release-assets', status: 'ok', mods: {} };
  for (const mod of mods.filter(m => m.status !== 'under-development')) {
    const versions = [];
    for (const release of releases) {
      if (release.draft || !release.tag_name.startsWith(`${mod.id}-v`)) continue;
      // Exact mod-specific tags and ZIP assets avoid checksums and other mods.
      for (const asset of release.assets || []) {
        if (!/\.zip$/i.test(asset.name)) continue;
        versions.push({ tag: release.tag_name, assetName: asset.name, downloads: asset.download_count, downloadUrl: asset.browser_download_url, prerelease: !!release.prerelease });
      }
    }
    const current = mod.github ? versions.find(v => v.tag === mod.github.tag && v.assetName === mod.github.assetName) : null;
    result.mods[mod.id] = { currentDownloads: current?.downloads ?? null, lifetimeDownloads: versions.reduce((n, v) => n + v.downloads, 0), versions };
  }
  return result;
}
export async function fetchReleases(config) {
  const releases = [];
  for (let page = 1; ; page++) {
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'TPG-Mods-stats', 'X-GitHub-Api-Version': '2022-11-28' };
    if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN || process.env.GITHUB_TOKEN}`;
    const response = await fetch(`https://api.github.com/repos/${config.github.owner}/${config.github.repo}/releases?per_page=100&page=${page}`, { headers, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`GitHub release stats unavailable (HTTP ${response.status}).`);
    const batch = await response.json();
    releases.push(...batch);
    if (batch.length < 100) return releases;
  }
}
export async function loadStats(config) {
  const mods = (await readJson(at('data/mods.json'))).filter(m => m.statusConfirmed && m.github && ['released', 'alpha'].includes(m.status));
  try { return aggregate(await fetchReleases(config), mods); }
  catch (error) {
    try {
      const cached = await readJson(at('data/downloads.json'));
      if (cached.status === 'ok' || cached.status === 'stale') return { ...cached, status: 'stale', warning: error.message, mods: Object.fromEntries(mods.map(m => [m.id, cached.mods[m.id] ?? { currentDownloads: null, lifetimeDownloads: null, versions: [] }])) };
    } catch { /* No prior successful stats snapshot. */ }
    return { generatedAt: null, source: 'github-release-assets', status: 'unavailable', warning: error.message, mods: Object.fromEntries(mods.map(m => [m.id, { currentDownloads: null, lifetimeDownloads: null, versions: [] }])) };
  }
}
if (process.argv[1]?.endsWith('stats.mjs')) {
  const stats = await loadStats(await project());
  await writeJson(at('data/downloads.json'), stats);
  console.log(`Download stats: ${stats.status}`);
}
