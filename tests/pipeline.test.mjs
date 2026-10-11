import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregate } from '../scripts/stats.mjs';
import { validateMods, validateVersion } from '../scripts/lib.mjs';
import { renderCatalog, renderQuickLooks, renderDetail } from '../scripts/render.mjs';

test('development names and actions cannot appear in the catalog or Quick Look templates', () => {
  const mod = { id: 'secret-project', title: 'Unannounced name', status: 'under-development', statusConfirmed: true, image: '/assets/images/secret-project.png' };
  const catalog = renderCatalog([mod], {});
  assert.match(catalog, /Under Development/);
  assert.match(catalog, /Photo Coming Soon/);
  assert.doesNotMatch(catalog, /Unannounced name|secret-project|<a\b|<button\b|<h3\b/);
  assert.equal(renderQuickLooks([mod], {}), '');
});

test('supplied photos appear in released and alpha cards, Quick Look and detail pages with escaped alt text', () => {
  const info = { summary: 'System.', type: 'System', facts: [], notes: [], sources: [] };
  for (const status of ['released', 'alpha']) {
    const mod = { id: 'system', title: 'System', status, statusConfirmed: true, image: '/assets/images/system.png', imageAlt: 'System "in DCS"' };
    for (const html of [renderCatalog([mod], { system: info }), renderQuickLooks([mod], { system: info }), renderDetail(mod, info, false)]) {
      assert.match(html, /src="\/assets\/images\/system\.png"/);
      assert.match(html, /alt="System &quot;in DCS&quot;"/);
      assert.doesNotMatch(html, /Photo Coming Soon/);
    }
  }
});

test('a single anonymous development preview cannot expose development names or actions', () => {
  const mods = ['secret-one', 'secret-two'].map(id => ({ id, title: 'Unannounced name', status: 'under-development', statusConfirmed: true }));
  const html = renderCatalog(mods, {}, { developmentPreviews: [{ image: '/assets/images/development-preview.png', imageAlt: 'Work in progress preview' }] });
  assert.equal((html.match(/development-preview\.png/g) || []).length, 1);
  assert.equal((html.match(/Photo Coming Soon/g) || []).length, 1);
  assert.doesNotMatch(html, /secret-one|secret-two|Unannounced|<a\b|<button\b|<h3\b/);
});

test('public version labels are independent of the package version and existing download URL', () => {
  const mod = { id: 'launcher', title: 'Launcher', status: 'released', statusConfirmed: true, version: '1.0.23-ready-cell-state', publicVersion: '1.0.23', github: { downloadUrl: 'https://example.test/original.zip' } };
  const info = { summary: 'Launcher.', type: 'Launcher', facts: [], notes: [], sources: [] };
  for (const html of [renderCatalog([mod], { launcher: info }), renderQuickLooks([mod], { launcher: info }), renderDetail(mod, info, false)]) {
    assert.match(html, /Version 1\.0\.23<\/p>/);
    assert.doesNotMatch(html, /ready-cell-state/);
    assert.match(html, /https:\/\/example\.test\/original\.zip/);
  }
});

test('additional supplied photos appear in Quick Look and More Info while cards use the main photo', () => {
  const mod = { id: 'cannon', title: 'Cannon', status: 'released', statusConfirmed: true, image: '/assets/images/cannon.png', imageGallery: [{ image: '/assets/images/cannonball.png', caption: 'Cannonball in flight' }] };
  const info = { summary: 'Cannon.', type: 'Artillery', facts: [], notes: [], sources: [] };
  assert.doesNotMatch(renderCatalog([mod], { cannon: info }), /cannonball\.png/);
  for (const html of [renderQuickLooks([mod], { cannon: info }), renderDetail(mod, info, false)]) {
    assert.match(html, /cannonball\.png/);
    assert.match(html, /<figcaption>Cannonball in flight<\/figcaption>/);
  }
});

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
