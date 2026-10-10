import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregate } from '../scripts/stats.mjs';
import { validateMods, validateVersion } from '../scripts/lib.mjs';

test('counts retain old versions, exclude drafts and unrelated releases, and select the actual current asset', () => {
  const release = (tag, count, extra = {}) => ({ tag_name: tag, assets: [{ name: 'mod.zip', download_count: count, browser_download_url: 'https://example.test/mod.zip' }, { name: 'SHA256SUMS.txt', download_count: 999 }], ...extra });
  const stats = aggregate([release('grizzly-v1.0.0', 100), release('grizzly-v1.1.0', 20), release('grizzly-v1.2.0', 50, { draft: true }), release('akinci-v1.0.0', 60)], [{ id: 'grizzly', github: { tag: 'grizzly-v1.1.0', assetName: 'mod.zip' } }], 'fixture');
  assert.equal(stats.mods.grizzly.lifetimeDownloads, 120);
  assert.equal(stats.mods.grizzly.currentDownloads, 20);
  assert.equal(stats.mods.grizzly.versions.length, 2);
});
test('a missing current asset is unknown, not falsely zero', () => {
  const stats = aggregate([], [{ id: 'grizzly', github: { tag: 'grizzly-v9.0.0', assetName: 'missing.zip' } }]);
  assert.equal(stats.mods.grizzly.currentDownloads, null);
});
test('under-development entries stay out of download counts and reject download links', () => {
  const mod = { id: 'akinci', status: 'under-development', github: null };
  validateMods([mod]);
  assert.equal(Object.hasOwn(aggregate([], [mod]).mods, 'akinci'), false);
  assert.throws(() => validateMods([{ ...mod, version: '1.0', github: { tag: 'akinci-v1.0', assetName: 'mod.zip', downloadUrl: 'https://example.test/mod.zip' } }]));
});
test('invalid IDs, duplicate IDs, incomplete releases and invented version formats are rejected', () => {
  assert.throws(() => validateMods([{ id: '../oops', status: 'released' }]));
  assert.throws(() => validateMods([{ id: 'grizzly', status: 'released' }, { id: 'grizzly', status: 'released' }]));
  assert.throws(() => validateMods([{ id: 'grizzly', status: 'released', github: { tag: 'v1' } }]));
  assert.throws(() => validateVersion('latest'));
  validateVersion('1.0.17-alpha.1');
});
