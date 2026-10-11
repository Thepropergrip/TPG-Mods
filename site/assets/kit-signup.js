export function customizeSignup(form) {
  const copy = [
    ['[data-element="header"] h2', 'Sign Up For Mod Announcements'],
    ['[data-element="subheader"] p', 'Choose your level of desired engagement below'],
    ['[data-element="guarantee"] p', 'No sales, and never more than 1x per week at max engagement'],
  ];
  for (const [selector, text] of copy) {
    const element = form.querySelector(selector);
    if (element && element.textContent !== text) element.textContent = text;
  }
  const labels = {
    '24506150': 'Official releases only',
    '24506152': 'Official releases + release candidates only',
    '24506154': 'All releases, candidates, fixes and news',
  };
  for (const option of form.querySelectorAll('select[name="tags[]"] option')) {
    const label = labels[option.value];
    if (label && option.textContent !== label) option.textContent = label;
  }
}

// Kit inserts the real subscription form asynchronously. Change only its copy;
// its action, field names, required selection and tag values remain Kit's own.
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
