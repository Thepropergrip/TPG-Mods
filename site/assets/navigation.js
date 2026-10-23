const contactMenu = document.querySelector('.contact-menu');
if (contactMenu) {
  contactMenu.addEventListener('click', event => {
    if (event.target.closest('a')) contactMenu.open = false;
  });
  document.addEventListener('click', event => {
    if (!contactMenu.contains(event.target)) contactMenu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && contactMenu.open) {
      contactMenu.open = false;
      contactMenu.querySelector('summary').focus();
    }
  });
}
