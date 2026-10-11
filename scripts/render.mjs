export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const modPath = mod => `/mods/${mod.id}/`;
const photo = (mod, includeGallery = false) => {
  if (!mod?.image) return '<div class="photo-placeholder">Photo Coming Soon</div>';
  const img = (src, alt) => `<img class="mod-photo" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
  return img(mod.image, mod.imageAlt || mod.title) + (includeGallery && mod.imageGallery?.length
    ? `<div class="photo-gallery">${mod.imageGallery.map(item => `<figure>${img(item.image, item.caption)}<figcaption>${escapeHtml(item.caption)}</figcaption></figure>`).join('')}</div>` : '');
};
const facts = info => `<dl class="facts">${(info.facts || []).map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`;
const download = mod => mod.status !== 'under-development' && mod.github ? `<a class="button primary" href="${escapeHtml(mod.github.downloadUrl)}">Download Now</a>` : '';
const actions = (mod, quick = false) => `<div class="actions">${quick ? `<a class="button" href="${modPath(mod)}" data-quick-look="${mod.id}" aria-haspopup="dialog">Quick Look</a>` : ''}${download(mod)}<a class="button" href="${modPath(mod)}">More Info</a></div>`;
const version = mod => mod.version ? `<p class="version">Version ${escapeHtml(mod.publicVersion ?? mod.version)}</p>` : '';

export function renderCatalog(mods, info, { developmentPreviews = [] } = {}) {
  const groups = [['released', 'Released'], ['alpha', 'Alpha Release Test Candidates'], ['under-development', 'Under Development']];
  return groups.map(([status, heading]) => {
    const entries = mods.filter(m => m.statusConfirmed && m.status === status);
    if (!entries.length) return '';
    return `<section><h2>${heading}</h2><div class="catalog">${entries.map((mod, index) => {
      if (status === 'under-development') return developmentPreviews[index]
        ? `<article class="development-placeholder development-preview${developmentPreviews[index].blurred ? ' development-preview-blurred' : ''}">${photo(developmentPreviews[index])}</article>`
        : `<article class="development-placeholder">${photo()}</article>`;
      const details = info[mod.id];
      return `<article>${photo(mod)}<h3>${escapeHtml(mod.title)}</h3><p class="card-summary">${escapeHtml(details.summary)}</p>${version(mod)}${actions(mod, true)}</article>`;
    }).join('')}</div></section>`;
  }).join('\n');
}

export function renderQuickLooks(mods, info) {
  return mods.filter(m => m.statusConfirmed && m.status !== 'under-development').map(mod => {
    const details = info[mod.id];
    return `<template id="quick-${mod.id}"><p class="kicker">${escapeHtml(details.type)}</p><h2 id="quick-title-${mod.id}">${escapeHtml(mod.title)}</h2>${version(mod)}${photo(mod, true)}<p>${escapeHtml(details.summary)}</p>${facts(details)}<p class="source-note">Figures from the supplied DCS mod settings and package notes. Declared limits and configured envelopes are distinct from tested performance.</p>${actions(mod)}</template>`;
  }).join('\n');
}

export function renderDetail(mod, info, launchReady) {
  const indexing = launchReady ? '' : '<meta name="robots" content="noindex,nofollow">';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${indexing}<title>${escapeHtml(mod.title)} · TPG Mods</title><link rel="stylesheet" href="/assets/site.css"></head>
<body><main class="page-shell detail-page"><nav><a href="/">← All mods</a></nav><header><p class="kicker">${escapeHtml(info.type)}</p><h1>${escapeHtml(mod.title)}</h1><p>${escapeHtml(info.summary)}</p>${version(mod)}${download(mod)}</header>
${photo(mod, true)}<section><h2>Quick facts</h2>${facts(info)}<p class="source-note">Figures from the supplied DCS mod settings and package notes. Declared limits and configured envelopes are distinct from tested performance.</p></section>
<section><h2>Usage notes</h2>${info.notes.map(note => `<p>${escapeHtml(note)}</p>`).join('')}${mod.sourceFilename ? `<p>Package: ${escapeHtml(mod.sourceFilename)}</p>` : ''}</section>
${info.documentation ? `<section><h2>Included installation and usage notes</h2><div class="documentation">${escapeHtml(info.documentation)}</div></section>` : ''}
<details class="source-files"><summary>Source files for these facts</summary><ul>${info.sources.map(source => `<li>${escapeHtml(source)}</li>`).join('')}</ul></details>
</main></body></html>`;
}
