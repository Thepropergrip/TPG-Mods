export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const modPath = mod => `/mods/${mod.id}/`;
const photo = (mod, includeGallery = false) => {
  if (!mod?.image) return '<div class="photo-placeholder">Photo Coming Soon</div>';
  const img = (src, alt) => `<img class="mod-photo" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
  return img(mod.image, mod.imageAlt || mod.title) + (includeGallery && mod.imageGallery?.length
    ? `<div class="photo-gallery">${mod.imageGallery.map(item => `<figure>${img(item.image, item.caption)}</figure>`).join('')}</div>` : '');
};
const facts = info => `<dl class="facts">${(info.facts || []).map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`;
const download = mod => mod.status !== 'under-development' && mod.github ? `<a class="button primary" href="${escapeHtml(mod.github.downloadUrl)}">Download Now</a>` : '';
const actions = (mod, quick = false) => `<div class="actions">${quick ? `<a class="button" href="${modPath(mod)}" data-quick-look="${mod.id}" aria-haspopup="dialog">Quick Look</a>` : ''}${download(mod)}<a class="button" href="${modPath(mod)}">More Info</a></div>`;
const version = mod => mod.version ? `<p class="version">Version ${escapeHtml(mod.publicVersion ?? mod.version)}</p>` : '';
const detailGallery = info => info.detailGallery?.length
  ? `<section class="detail-gallery"><h2>${escapeHtml(info.detailGalleryHeading || 'Model profiles and research')}</h2><div class="photo-gallery">${info.detailGallery.map(item => `<figure><img class="mod-photo" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.caption)}" loading="lazy" decoding="async"></figure>`).join('')}</div></section>` : '';
const links = items => `<ul>${items.map(item => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a></li>`).join('')}</ul>`;
const history = info => info.history?.paragraphs?.length
  ? `<section><h2>Brief history</h2>${info.history.paragraphs.map(text => `<p>${escapeHtml(text)}</p>`).join('')}${info.history.references?.length ? links(info.history.references) : ''}</section>` : '';
const payload = info => info.payloadNotes?.length
  ? `<section><h2>Warhead and ammunition</h2>${info.payloadNotes.map(text => `<p>${escapeHtml(text)}</p>`).join('')}</section>` : '';
const changelog = info => info.changelog?.length
  ? `<section class="changelog"><h2>Change Log</h2>${info.changelog.map(entry => `<h3><time datetime="${escapeHtml(entry.date)}">${escapeHtml(new Date(`${entry.date}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }))}</time>${entry.version ? ` · Version ${escapeHtml(entry.version)}` : ''}</h3><ul>${entry.items.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>`).join('')}</section>` : '';

const bylines = {
  released: "Perfection isn't claimed, but extensive testing and mission use has been completed.  Future upgrades always an option.",
  alpha: "We've seen it working and it should be generally functional.  Visual and performance bugs to be expected, please report if encountered.  Thanks!"
};

export function renderCatalog(mods, info, { developmentPreviews = [] } = {}) {
  const groups = [['released', 'Released'], ['alpha', 'Alpha Release Test Candidates'], ['under-development', 'Under Development']];
  return groups.map(([status, heading]) => {
    const entries = mods.filter(m => m.statusConfirmed && m.status === status);
    if (!entries.length) return '';
    return `<section><h2>${heading}</h2>${bylines[status] ? `<p class="section-byline">${escapeHtml(bylines[status])}</p>` : ''}<div class="catalog">${entries.map((mod, index) => {
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
    return `<template id="quick-${mod.id}"><p class="kicker">${escapeHtml(details.type)}</p><h2 id="quick-title-${mod.id}">${escapeHtml(mod.title)}</h2>${version(mod)}${photo(mod, true)}<p>${escapeHtml(details.summary)}</p>${facts(details)}${actions(mod)}</template>`;
  }).join('\n');
}

export function renderDetail(mod, info, launchReady) {
  const indexing = launchReady ? '' : '<meta name="robots" content="noindex,nofollow">';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${indexing}<title>${escapeHtml(mod.title)} · TPG Mods</title><link rel="stylesheet" href="/assets/site.css"></head>
<body><main class="page-shell detail-page"><nav><a href="/">← All mods</a></nav><header><p class="kicker">${escapeHtml(info.type)}</p><h1>${escapeHtml(mod.title)}</h1><p>${escapeHtml(info.summary)}</p>${version(mod)}${download(mod)}</header>
${photo(mod, true)}<section><h2>Quick facts</h2>${facts(info)}</section>
<section><h2>Usage notes</h2>${info.notes.map(note => `<p>${escapeHtml(note)}</p>`).join('')}${mod.sourceFilename ? `<p>Package: ${escapeHtml(mod.sourceFilename)}</p>` : ''}</section>
${history(info)}
${payload(info)}
${detailGallery(info)}
${info.references?.length ? `<section><h2>Credits and references</h2>${links(info.references)}</section>` : ''}
${changelog(info)}
</main></body></html>`;
}
