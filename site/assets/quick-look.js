const dialog = document.querySelector('#quick-look');
const content = document.querySelector('#quick-look-content');
let trigger;
let backdropPress = false;

if (typeof dialog?.showModal === 'function') {
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-quick-look]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const template = document.getElementById(`quick-${link.dataset.quickLook}`);
    if (!template) return;
    event.preventDefault();
    trigger = link;
    content.replaceChildren(template.content.cloneNode(true));
    dialog.setAttribute('aria-labelledby', content.querySelector('h2').id);
    dialog.showModal();
    document.body.classList.add('quick-look-open');
    dialog.querySelector('.close-button').focus({ preventScroll: true });
  });

  const outside = event => {
    const box = dialog.getBoundingClientRect();
    return event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom);
  };
  dialog.addEventListener('pointerdown', event => { backdropPress = outside(event); });
  dialog.addEventListener('click', event => {
    if (backdropPress && outside(event)) dialog.close();
    backdropPress = false;
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('quick-look-open');
    content.replaceChildren();
    trigger?.focus({ preventScroll: true });
    trigger = null;
    backdropPress = false;
  });
}
