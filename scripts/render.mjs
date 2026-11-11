export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const modPath = mod => `/mods/${mod.id}/`;
const photo = (mod, includeGallery = false) => {
  if (!mod?.image) return '<div class="photo-placeholder">Photo Coming Soon</div>';
  const img = (src, alt) => {
    const image = `<img class="mod-photo" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
    if (mod.photoTreatment === 'screenshot-grade') return `<div class="graded-photo-frame">${image}</div>`;
    return mod.photoTreatment === 'dcs-crop' ? `<div class="dcs-photo-frame">${image}</div>` : image;
  };
  return img(mod.image, mod.imageAlt || mod.title) + (includeGallery && mod.imageGallery?.length
    ? `<div class="photo-gallery">${mod.imageGallery.map(item => `<figure>${img(item.image, item.caption)}</figure>`).join('')}</div>` : '');
};
const facts = info => `<dl class="facts">${(info.facts || []).map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`;
const download = mod => mod.status !== 'under-development' && mod.github ? `<a class="button primary" href="${escapeHtml(mod.github.downloadUrl)}">Download Now</a>` : '';
const actions = (mod, quick = false) => `<div class="actions">${quick ? `<a class="button" href="${modPath(mod)}" data-quick-look="${mod.id}" aria-haspopup="dialog">Quick Look</a>` : ''}${download(mod)}<a class="button" href="${modPath(mod)}">More Info</a></div>`;
const formatDate = date => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const releaseMetadata = (mod, info) => {
  const label = mod.version && mod.showVersion !== false ? `<p class="version">Version ${escapeHtml(mod.publicVersion ?? mod.version)}</p>` : '';
  const latest = (info.changelog ?? []).reduce((date, entry) => entry.date > date ? entry.date : date, info.releaseDate ?? '');
  return label + (latest ? `<p class="last-updated">Last updated <time datetime="${escapeHtml(latest)}">${escapeHtml(formatDate(latest))}</time></p>` : '');
};
const detailImages = items => items?.length
  ? `<div class="photo-gallery">${items.map(item => `<figure><img class="mod-photo" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.caption)}" loading="lazy" decoding="async">${item.credit ? `<figcaption>${escapeHtml(item.credit)}</figcaption>` : ''}</figure>`).join('')}</div>` : '';
const detailGallery = info => info.detailGallery?.length
  ? `<section class="detail-gallery"><h2>${escapeHtml(info.detailGalleryHeading || 'Model profiles and research')}</h2>${info.detailGalleryIntro ? `<p>${escapeHtml(info.detailGalleryIntro)}</p>` : ''}${detailImages(info.detailGallery)}</section>` : '';
const links = items => `<ul>${items.map(item => `<li><a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a></li>`).join('')}</ul>`;
const history = info => info.history?.paragraphs?.length
  ? `<section><h2>Brief history</h2>${info.history.paragraphs.map(text => `<p>${escapeHtml(text)}</p>`).join('')}${detailImages(info.history.gallery)}${info.history.references?.length ? links(info.history.references) : ''}</section>` : '';
const payload = info => info.payloadNotes?.length
  ? `<section><h2>Warhead and ammunition</h2>${info.payloadNotes.map(text => `<p>${escapeHtml(text)}</p>`).join('')}${detailImages(info.payloadGallery)}</section>` : '';
const animation = item => item
  ? `<section><h2>${escapeHtml(item.title)}</h2><picture><source media="(prefers-reduced-motion: reduce)" srcset="${escapeHtml(item.poster)}"><img class="mod-photo" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.description)}" width="640" height="360" loading="lazy" decoding="async"></picture></section>` : '';
const credits = info => info.credits?.length || info.references?.length
  ? `<section><h2>Credits and references</h2>${(info.credits ?? []).map(text => `<p>${escapeHtml(text)}</p>`).join('')}${info.references?.length ? links(info.references) : ''}</section>` : '';
const changelog = info => info.changelog?.length
  ? `<section class="changelog"><h2>Change Log</h2>${info.changelog.map(entry => `<h3><time datetime="${escapeHtml(entry.date)}">${escapeHtml(formatDate(entry.date))}</time>${entry.version ? ` · Version ${escapeHtml(entry.version)}` : ''}</h3><ul>${entry.items.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>`).join('')}</section>` : '';

export function renderCatalog(mods, info, { developmentPreviews = [] } = {}) {
  const categories = [['ballistic-missiles', 'Ballistic Missiles'], ['artillery', 'Artillery'], ['drones', 'Drones'], ['sam-shorad', 'SAM/SHORAD'], ['naval', 'Naval']];
  const entries = mods.filter(mod => mod.statusConfirmed && ['released', 'alpha', 'release-candidate'].includes(mod.status));
  const jumpLinks = categories.filter(([category]) => entries.some(mod => mod.category === category)).map(([category, label]) => `<a class="button" href="#released-${category}">${label}</a>`);
  const navigation = jumpLinks.length ? `<nav class="category-links" aria-labelledby="jump-to-section"><p id="jump-to-section" class="category-links-label">Jump to section</p>${jumpLinks.join('')}</nav>` : '';
  const cards = items => `<div class="catalog">${items.map(mod => {
    const details = info[mod.id];
    const titleTag = mod.category ? 'h4' : 'h3';
    return `<article>${photo(mod)}<${titleTag}>${escapeHtml(mod.title)}</${titleTag}><p class="card-summary">${escapeHtml(details.summary)}</p>${releaseMetadata(mod, details)}${actions(mod, true)}</article>`;
  }).join('')}</div>`;
  const content = categories.map(([category, label]) => {
    const items = entries.filter(mod => mod.category === category);
    return items.length ? `<div class="catalog-category" id="released-${category}"><div class="category-band"><h3 class="category-heading">${label}</h3><span class="category-count">${items.length} ${items.length === 1 ? 'mod' : 'mods'}</span></div>${cards(items)}</div>` : '';
  }).join('') + (entries.some(mod => !mod.category) ? cards(entries.filter(mod => !mod.category)) : '');
  const released = entries.length ? `<section id="released-mods" aria-labelledby="released-mods-title"><h2 id="released-mods-title" class="release-heading">Released Mods</h2>${content}</section>` : '';
  const development = mods.filter(mod => mod.statusConfirmed && mod.status === 'under-development');
  const developmentCards = development.map((_, index) => {
    const preview = developmentPreviews[index];
    if (preview === null) return '';
    if (!preview) return '<article class="development-placeholder"><div class="photo-placeholder">Photo Coming Soon</div></article>';
    return `<article class="development-placeholder development-preview${preview.blurred ? ' development-preview-blurred' : ''}">${photo(preview)}</article>`;
  }).join('');
  const previews = developmentCards ? `<section><h2>Under Development</h2><div class="catalog">${developmentCards}</div></section>` : '';
  return navigation + released + previews;
}

export function renderQuickLooks(mods, info) {
  return mods.filter(m => m.statusConfirmed && m.status !== 'under-development').map(mod => {
    const details = info[mod.id];
    return `<template id="quick-${mod.id}"><p class="kicker">${escapeHtml(details.type)}</p><h2 id="quick-title-${mod.id}">${escapeHtml(mod.title)}</h2>${releaseMetadata(mod, details)}${photo(mod, true)}<p>${escapeHtml(details.summary)}</p>${facts(details)}${actions(mod)}</template>`;
  }).join('\n');
}

export function renderDetail(mod, info, launchReady) {
  const indexing = launchReady ? '' : '<meta name="robots" content="noindex,nofollow">';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${indexing}<title>${escapeHtml(mod.title)} · TPG Mods</title><link rel="stylesheet" href="/assets/site.css"></head>
<body><main class="page-shell detail-page"><nav><a href="/">← All mods</a></nav><header><p class="kicker">${escapeHtml(info.type)}</p><h1>${escapeHtml(mod.title)}</h1><p>${escapeHtml(info.summary)}</p>${releaseMetadata(mod, info)}${download(mod)}</header>
${photo(mod, true)}
${animation(info.animation)}
<section><h2>Quick facts</h2>${facts(info)}</section>
${info.installation?.length ? `<section><h2>Installation</h2>${info.installation.map(text => `<p>${escapeHtml(text)}</p>`).join('')}</section>` : ''}
<section><h2>Usage notes</h2>${info.notes.map(note => `<p>${escapeHtml(note)}</p>`).join('')}${mod.sourceFilename ? `<p>Package: ${escapeHtml(mod.sourceFilename)}</p>` : ''}</section>
${history(info)}
${payload(info)}
${detailGallery(info)}
${credits(info)}
${changelog(info)}
</main></body></html>`;
}
