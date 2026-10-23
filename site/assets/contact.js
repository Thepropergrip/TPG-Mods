import { contactOptions, attachmentError } from './contact-options.js';

const panels = [...document.querySelectorAll('.contact-panel')];
const choices = [...document.querySelectorAll('[data-contact-choice]')];
function showSelected(focus = false) {
  const selected = location.hash.slice(1);
  const valid = contactOptions.some(option => option.id === selected);
  for (const panel of panels) panel.hidden = !valid || panel.id !== selected;
  for (const choice of choices) {
    if (valid && choice.dataset.contactChoice === selected) choice.setAttribute('aria-current', 'page');
    else choice.removeAttribute('aria-current');
  }
  if (focus && valid) document.getElementById(`${selected}-title`).focus({preventScroll:true});
}
showSelected();
window.addEventListener('hashchange', () => showSelected(true));

for (const form of document.querySelectorAll('.contact-form')) {
  const attachment = form.elements.attachment;
  const error = form.querySelector('.contact-error');
  const checkFile = () => {
    const message = attachmentError(attachment.files[0]);
    attachment.setCustomValidity(message);
    error.textContent = message;
    error.hidden = !message;
    return !message;
  };
  attachment.addEventListener('change', checkFile);
  form.addEventListener('submit', event => {
    if (!checkFile() || !form.reportValidity()) {
      event.preventDefault();
      attachment.reportValidity();
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Sending…';
  });
}
// Restore controls when returning from the email provider using browser Back.
window.addEventListener('pageshow', () => {
  for (const form of document.querySelectorAll('.contact-form')) {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = false;
    button.textContent = contactOptions.find(option => option.id === form.dataset.contactForm).submitLabel;
  }
});
