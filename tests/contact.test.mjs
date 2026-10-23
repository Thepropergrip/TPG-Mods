import test from 'node:test';
import assert from 'node:assert/strict';
import { renderTopbar, renderContact } from '../scripts/contact.mjs';
import { attachmentError, attachmentLimit } from '../site/assets/contact-options.js';

test('contact navigation reaches all four forms without Discord', () => {
  const bar = renderTopbar();
  for (const id of ['tester', 'bug', 'new-mod', 'feature']) assert.ok(bar.includes(`/contact/#${id}`));
  assert.doesNotMatch(bar, /discord/i);
});

test('every request sends email and attachments, with distinct questions and a return URL', () => {
  const html = renderContact([{title:'Public Mod & Test'}], false);
  assert.equal((html.match(/enctype="multipart\/form-data"/g)||[]).length, 4);
  assert.equal((html.match(/action="https:\/\/formsubmit.co\/Thepropergrip@gmail.com"/g)||[]).length, 4);
  assert.equal((html.match(/name="email"[^>]*required/g)||[]).length, 4);
  assert.equal((html.match(/name="attachment"/g)||[]).length, 4);
  assert.equal((html.match(/https:\/\/tpg-mods.pages.dev\/contact\/thanks\//g)||[]).length, 4);
  assert.ok(html.includes('How often could you test?'));
  assert.ok(html.includes('Where does it happen?'));
  assert.ok(html.includes('What would you like made?'));
  assert.ok(html.includes('What feature would you like?'));
  assert.ok(html.includes('Public Mod &amp; Test'));
  assert.doesNotMatch(html, /_captcha|_autoresponse|_cc/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Form labels must have unique targets');
});

test('attachment validation accepts DCS evidence and rejects unsupported or oversized files', () => {
  assert.equal(attachmentError(undefined), '');
  for (const name of ['DCS.log', 'mission.miz', 'TRACK.TRK', 'screen.png', 'evidence.zip']) assert.equal(attachmentError({name,size:1024}), '');
  assert.ok(attachmentError({name:'large.zip',size:attachmentLimit+1}));
  assert.ok(attachmentError({name:'script.exe',size:1024}));
});
