export function customizeSignup(form) {
  const copy = [
    ['[data-element="header"] h2', 'Sign Up For Mod Announcements'],
    ['[data-element="subheader"] p', 'New releases, alpha candidates, bug fixes and feature enhancements.'],
    ['[data-element="guarantee"] p', 'NO sales, once per week at maximum'],
  ];
  for (const [selector, text] of copy) {
    const element = form.querySelector(selector);
    if (element && element.textContent !== text) element.textContent = text;
  }
}

// Kit inserts the real subscription form asynchronously. Change only its copy;
// its action, email field and subscriber handling remain Kit's own.
if (typeof document !== 'undefined') {
  const container = document.querySelector('.email-signup');
  if (container) {
    const update = () => {
      const form = container.querySelector('form[data-uid="19030fcb90"]');
      if (form) customizeSignup(form);
    };
    update();
    new MutationObserver(update).observe(container, { childList: true, subtree: true });
  }
}
