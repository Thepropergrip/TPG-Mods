import { escapeHtml as h } from './render.mjs';
import { contactOptions, attachmentExtensions } from '../site/assets/contact-options.js';

export const contactDestination = 'https://formsubmit.co/Thepropergrip@gmail.com';

export function renderTopbar() {
  return `<header class="topbar"><nav class="topbar-inner" aria-label="Main navigation"><a class="topbar-brand" href="/">TPG Mods</a><details class="contact-menu"><summary>Contact Us</summary><div class="contact-menu-links">${contactOptions.map(option => `<a href="/contact/#${option.id}">${h(option.title)}</a>`).join('')}</div></details></nav></header><script src="/assets/navigation.js" defer></script>`;
}

function fieldHtml(field, option, mods, index) {
  const id = `${option.id}-question-${index}`;
  const required = field.required !== false ? ' required' : '';
  const values = field.type === 'mod' ? [...(field.any ? ['Any TPG mod'] : []), ...mods.map(mod => mod.title), 'Other / not listed'] : field.options;
  const control = values
    ? `<select id="${id}" name="${h(field.name)}"${required}><option value="">Choose one</option>${values.map(value => `<option>${h(value)}</option>`).join('')}</select>`
    : `<input id="${id}" name="${h(field.name)}" type="text" maxlength="200"${field.placeholder ? ` placeholder="${h(field.placeholder)}"` : ''}${required}>`;
  return `<div class="contact-field"><label for="${id}">${h(field.label)}</label>${control}</div>`;
}

export function renderContact(mods, launchReady) {
  const indexing = launchReady ? '' : '<meta name="robots" content="noindex,nofollow">';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${indexing}<title>Contact Us · TPG Mods</title><link rel="stylesheet" href="/assets/site.css"><script type="module" src="/assets/contact.js"></script></head>
<body>${renderTopbar()}<main class="page-shell contact-page"><a class="back-link" href="/">← All mods</a><h1>Contact Us</h1><p>What would you like to get in touch about?</p>
<nav class="contact-choices" aria-label="Contact options">${contactOptions.map(option => `<a class="contact-choice" href="#${option.id}" data-contact-choice="${option.id}">${h(option.title)}</a>`).join('')}</nav>
${contactOptions.map(option => `<section class="contact-panel" id="${option.id}" aria-labelledby="${option.id}-title"><h2 id="${option.id}-title" tabindex="-1">${h(option.title)}</h2><p>${h(option.intro)}</p>
<form class="contact-form" action="${contactDestination}" method="POST" enctype="multipart/form-data" data-contact-form="${option.id}">
<input type="hidden" name="_subject" value="TPG Mods — ${h(option.shortTitle)}"><input type="hidden" name="Request type" value="${h(option.title)}"><input type="hidden" name="_template" value="table"><input type="hidden" name="_next" value="https://tpg-mods.pages.dev/contact/thanks/"><input type="hidden" name="_url" value="https://tpg-mods.pages.dev/contact/#${option.id}">
<div class="contact-honey" aria-hidden="true"><label>Leave this empty<input name="_honey" type="text" tabindex="-1" autocomplete="off"></label></div>
${option.fields.map((field, index) => fieldHtml(field, option, mods, index)).join('')}
<div class="contact-field"><label for="${option.id}-message">${h(option.messageLabel)}${option.messageRequired ? '' : ' (optional)'}</label><textarea id="${option.id}-message" name="message" rows="6" maxlength="10000"${option.messageRequired ? ' required' : ''}></textarea></div>
<div class="contact-field"><label for="${option.id}-attachment">Attachment (optional)</label><input type="file" id="${option.id}-attachment" name="attachment" accept="${attachmentExtensions.map(ext => `.${ext}`).join(',')}" aria-describedby="${option.id}-attachment-help"><p class="field-help" id="${option.id}-attachment-help">${h(option.attachmentHelp || 'Screenshot, PDF, text, DCS log, mission, track, Tacview .acmi file or ZIP. Up to 10 MB. For larger files, add a download link above.')}</p></div>
<div class="contact-field"><label for="${option.id}-email">Your email</label><input type="email" id="${option.id}-email" name="email" autocomplete="email" maxlength="254" required><p class="field-help">So we can get back to you.</p></div>
<p class="contact-error" role="alert" hidden></p><button class="button primary contact-send" type="submit">${h(option.submitLabel)}</button><p class="field-help contact-delivery">Delivered to TPG by <a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener noreferrer">FormSubmit</a>.</p>
</form></section>`).join('')}
</main></body></html>`;
}

export function renderThanks(launchReady) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${launchReady ? '' : '<meta name="robots" content="noindex,nofollow">'}<title>Thank you · TPG Mods</title><link rel="stylesheet" href="/assets/site.css"></head><body>${renderTopbar()}<main class="page-shell contact-page"><h1>Thanks for getting in touch.</h1><p>Your submission has been sent to TPG.</p><div class="actions"><a class="button primary" href="/">Back to mods</a><a class="button" href="/contact/">Contact Us</a></div></main></body></html>`;
}
