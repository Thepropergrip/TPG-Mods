export const contactOptions = [
  {
    id: 'tester', title: 'Volunteer to be a TPG Mod Tester', shortTitle: 'Mod Tester', submitLabel: 'Volunteer to Test',
    intro: 'Tell us a little about your DCS experience and what you would like to test.',
    fields: [
      {name: 'DCS experience', label: 'How long have you played DCS?', options: ['New to DCS', 'Less than a year', '1–3 years', 'More than 3 years']},
      {name: 'Testing interests', label: 'What would you like to test?', type: 'mod', any: true},
      {name: 'Availability', label: 'How often could you test?', options: ['A few times a month', 'About once a week', 'Several times a week', 'It varies']}
    ],
    messageLabel: 'Anything else you would like us to know?', messageRequired: false
  },
  {
    id: 'bug', title: 'Report a Bug', shortTitle: 'Bug Report', submitLabel: 'Send Bug Report',
    intro: 'Let us know what went wrong and how to reproduce it.',
    fields: [
      {name: 'Mod', label: 'Which mod?', type: 'mod'},
      {name: 'Mod version', label: 'Mod version (if known)', required: false, placeholder: 'For example, 1.1.9'},
      {name: 'Game mode', label: 'Where does it happen?', options: ['Single-player', 'Multiplayer', 'Both', 'Not sure']}
    ],
    messageLabel: 'What happened? What did you expect, and how can we reproduce it?', messageRequired: true
  },
  {
    id: 'new-mod', title: 'New Mod Request', shortTitle: 'New Mod Request', submitLabel: 'Send Mod Request',
    intro: 'Have a mod in mind? Tell us what you would like to see.',
    fields: [
      {name: 'Requested mod', label: 'What would you like made?', placeholder: 'Name of the aircraft, vehicle, weapon or system'},
      {name: 'Mod type', label: 'What kind of mod?', options: ['Aircraft', 'Ground vehicle or emplacement', 'Ship or boat', 'Weapon', 'Other']}
    ],
    messageLabel: 'Tell us about it. Reference links are welcome.', messageRequired: true
  },
  {
    id: 'feature', title: 'Existing Mod Feature Requests', shortTitle: 'Feature Request', submitLabel: 'Send Feature Request',
    intro: 'Suggest an addition or improvement to an existing TPG mod.',
    fields: [
      {name: 'Mod', label: 'Which mod?', type: 'mod'},
      {name: 'Requested feature', label: 'What feature would you like?', placeholder: 'A short description'}
    ],
    messageLabel: 'How would it work, and how would you use it?', messageRequired: true
  }
];

export const attachmentLimit = 10_000_000;
export const attachmentExtensions = ['png', 'jpg', 'jpeg', 'webp', 'pdf', 'txt', 'log', 'zip', 'miz', 'trk'];

export function attachmentError(file) {
  if (!file || !file.size) return '';
  if (file.size > attachmentLimit) return 'Please choose a file under 10 MB, or put a download link in your message.';
  const extension = file.name.split('.').pop().toLowerCase();
  return attachmentExtensions.includes(extension) ? '' : 'Please attach a screenshot, PDF, text file, DCS log, mission, track or ZIP.';
}
