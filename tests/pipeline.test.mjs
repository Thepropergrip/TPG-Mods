import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregate } from '../scripts/stats.mjs';
import { validateMods, validateVersion } from '../scripts/lib.mjs';
import { renderCatalog, renderQuickLooks, renderDetail } from '../scripts/render.mjs';
import { readFileSync } from 'node:fs';

test('available mods share Released Mods, including Naval and its quick navigation', () => {
  const mods = JSON.parse(readFileSync(new URL('../data/mods.json', import.meta.url), 'utf8'));
  const info = JSON.parse(readFileSync(new URL('../data/mod-info.json', import.meta.url), 'utf8'));
  const html = renderCatalog(mods, info);
  assert.equal((html.match(/>Released Mods<\/h2>/g) || []).length, 1);
  assert.doesNotMatch(html, /Alpha Releases|Release Candidate|alpha-releases|Future upgrades|Perfection/);
  for (const mod of mods.filter(m => m.statusConfirmed && m.github)) {
    assert.equal(mod.status, 'released');
    assert.ok(html.includes(`/mods/${mod.id}/`));
    const details = info[mod.id];
    const latest = [details.releaseDate, ...(details.changelog ?? []).map(entry => entry.date)].filter(Boolean).sort().at(-1);
    const date = `<p class="last-updated">Last updated <time datetime="${latest}">`;
    const version = mod.showVersion === false ? '' : `<p class="version">Version ${mod.publicVersion ?? mod.version}</p>`;
    for (const page of [renderCatalog([mod], info), renderQuickLooks([mod], info), renderDetail(mod, info[mod.id], false)]) {
      assert.ok(page.includes(version + date), mod.id);
    }
  }
  assert.match(html, /href="#released-naval">Naval<\/a>/);
  assert.match(html, /id="released-naval"/);
  assert.match(html, /<h3 class="category-heading">Naval<\/h3>/);
  const ship = mods.find(m => m.id === 'uss-constitution');
  for (const page of [renderQuickLooks([ship], info), renderDetail(ship, info[ship.id], false)]) {
    const photos = [...page.matchAll(/src="([^"]+constitution-[^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(photos, [ship.image, ...ship.imageGallery.map(image => image.image)]);
    assert.match(photos[1], /constitution-broadside\.png$/);
    assert.doesNotMatch(page, /Lavaball|lava|Version 0\.1\.11/i);
    assert.match(page, /Incendiary|incendiary/);
  }
  const truck = renderDetail(mods.find(m => m.id === 'shahed-238-truck'), info['shahed-238-truck'], false);
  assert.doesNotMatch(truck, /Give it a clear launch path|Includes three-round reloading|fix for it reappearing after burnout/);
  const rail = renderDetail(mods.find(m => m.id === 'shahed-238'), info['shahed-238'], false);
  assert.match(rail, /Version 1\.0\.3/);
  assert.match(rail, /shahed-238-v1\.0\.3\/TPG_Shahed238_Rail.zip/);
});

test('last updated uses the newest Change Log date even when entries are out of order', () => {
  const mod = { id: 'system', title: 'System', version: '1.0' };
  const info = {
    type: 'System', summary: 'System.', notes: [],
    changelog: [{ date: '2026-10-23', items: ['Released.'] }, { date: '2026-10-29', items: ['Updated.'] }],
  };
  assert.match(renderDetail(mod, info, false), /Last updated <time datetime="2026-10-29">October 29, 2026<\/time>/);
});

test('the Gustav is first in Artillery and its detail page has the selected media without a Change Log', () => {
  const mods = JSON.parse(readFileSync(new URL('../data/mods.json', import.meta.url), 'utf8'));
  const info = JSON.parse(readFileSync(new URL('../data/mod-info.json', import.meta.url), 'utf8'));
  const artillery = mods.filter(mod => mod.category === 'artillery' && mod.status === 'released');
  const gustav = artillery[0];
  assert.equal(gustav.id, 'gustav-rail-gun');
  const catalog = renderCatalog(artillery, info);
  assert.match(catalog, /<article><img[^>]+gustav-firing-at-sunset\.jpg[^>]+><h4>TPG Gustav Rail Gun/);
  assert.doesNotMatch(catalog, /gustav-traverse-and-elevation\.gif/);
  const page = renderDetail(gustav, info[gustav.id], false);
  assert.deepEqual([...page.matchAll(/src="([^"]+gustav-[^"]+)"/g)].map(match => match[1]), [
    '/assets/images/gustav-firing-at-sunset.jpg',
    '/assets/images/gustav-elevated-on-turnout.jpg',
    '/assets/images/gustav-wreck-breech.jpg',
    '/assets/images/gustav-traverse-and-elevation.gif',
  ]);
  assert.match(page, /Last updated <time datetime="2026-11-11">/);
  assert.match(page, /Leafia dev\. on Sketchfab\./);
  assert.doesNotMatch(page, /Change Log|href="https:\/\/sketchfab/);
});

test('legacy release metadata does not split the public catalog or add candidate labels', () => {
  const mods = ['released', 'alpha', 'release-candidate'].map((status, i) => ({id:`mod-${i}`,title:'Vehicle',status,statusConfirmed:true,version:'1.0',category:'drones',github:{tag:`mod-${i}-v1.0`,assetName:'mod.zip',downloadUrl:`https://example.test/${i}.zip`}}));
  const details = {summary:'Vehicle.',type:'Vehicle',facts:[],notes:[]};
  const info = Object.fromEntries(mods.map(mod => [mod.id, details]));
  const catalog = renderCatalog(mods, info);
  assert.equal((catalog.match(/>Released Mods<\/h2>/g) || []).length, 1);
  assert.doesNotMatch(catalog, /Alpha Releases|Release Candidate/);
  for (const mod of mods) {
    assert.ok(catalog.includes(mod.github.downloadUrl));
    assert.doesNotMatch(renderDetail(mod,details,false), /Release Candidate/);
  }
  const stats = aggregate([
    {tag_name:'mod-0-v1.0',assets:[{name:'mod.zip',download_count:4}]},
    {tag_name:'mod-1-v1.0',prerelease:true,assets:[{name:'mod.zip',download_count:20}]}
  ],mods);
  assert.equal(stats.mods['mod-0'].currentDownloads,4);
  assert.equal(stats.mods['mod-1'].lifetimeDownloads,20);
});

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
    assert.match(html, /alt="Cannonball in flight"/);
    assert.doesNotMatch(html, /<figcaption/);
  }
});

test('mapping and research images are exclusive to More Info and follow gameplay screenshots', () => {
  const mod = { id: 'calliope', title: 'Calliope', status: 'alpha', statusConfirmed: true, image: '/game-launch.png', imageGallery: [{ image: '/game-rocket.png', caption: 'Rocket in flight' }] };
  const info = { summary: 'Rocket artillery.', type: 'Artillery', facts: [], notes: [], sources: [], detailGallery: [
    { image: '/armor.png', caption: 'Armor mapping' }, { image: '/ir.png', caption: 'IR mapping' },
    { image: '/wreck.png', caption: 'Destroyed model' }, { image: '/research.png', caption: 'Research "cover"' }
  ] };
  for (const html of [renderCatalog([mod], { calliope: info }), renderQuickLooks([mod], { calliope: info })]) {
    assert.doesNotMatch(html, /armor\.png|ir\.png|wreck\.png|research\.png/);
  }
  const detail = renderDetail(mod, info, false);
  let last = detail.indexOf('/game-rocket.png');
  assert.ok(last > detail.indexOf('/game-launch.png'));
  for (const item of info.detailGallery) {
    assert.ok(detail.indexOf(item.image) > last);
    last = detail.indexOf(item.image);
  }
  assert.match(detail, /Research &quot;cover&quot;/);
});

test('detail pages keep one usage section, cite history and put dated changes last', () => {
  const mod = { id: 'updated', title: 'Updated', status: 'released', statusConfirmed: true };
  const info = {
    type: 'System', summary: 'System.', facts: [], notes: ['Current instructions.'],
    documentation: 'Obsolete duplicate usage notes.',
    history: { paragraphs: ['History <text>.'], references: [{ label: 'Museum & archive', url: 'https://example.test/history?a=1&b=2' }] },
    payloadNotes: ['Payload details.'],
    references: [{ label: 'Credits', url: 'https://example.test/credits' }],
    changelog: [{ date: '2026-10-16', version: '1.3', items: ['Fixed <collision>.'] }]
  };
  const detail = renderDetail(mod, info, false);
  assert.equal((detail.match(/<h2>Usage notes<\/h2>/g) || []).length, 1);
  assert.doesNotMatch(detail, /Obsolete duplicate|Included installation and usage notes/);
  assert.ok(detail.indexOf('Brief history') > detail.indexOf('Current instructions.'));
  assert.match(detail, /History &lt;text&gt;\./);
  assert.match(detail, /https:\/\/example.test\/history\?a=1&amp;b=2/);
  assert.match(detail, /datetime="2026-10-16">October 16, 2026/);
  assert.match(detail, /Fixed &lt;collision&gt;\./);
  assert.ok(detail.indexOf('Change Log') > detail.indexOf('Credits and references'));
  assert.match(detail, /Fixed &lt;collision&gt;\.<\/li><\/ul><\/section>\s*<\/main>/);
  const quick = renderQuickLooks([mod], { updated: info });
  assert.doesNotMatch(quick, /Brief history|Change Log|Obsolete duplicate/);
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
