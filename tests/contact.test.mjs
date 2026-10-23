import test from 'node:test';
import assert from 'node:assert/strict';
import { renderTopbar, renderContact } from '../scripts/contact.mjs';
import { attachmentError, attachmentLimit } from '../site/assets/contact-options.js';
import { readFileSync } from 'node:fs';

test('the public truck release candidate is available to testers and in bug and feature requests', () => {
  const mods = JSON.parse(readFileSync(new URL('../data/mods.json',import.meta.url),'utf8'));
  const publicMods = mods.filter(mod => mod.statusConfirmed && mod.status !== 'under-development');
  const truck = publicMods.find(mod => mod.id === 'shahed-238-truck');
  assert.ok(truck);
  const html = renderContact(publicMods,false);
  assert.equal((html.match(/<option>TPG Shahed-238 Truck GPS \/ ASM<\/option>/g)||[]).length,3);
  for (const mod of mods.filter(mod => mod.status === 'under-development')) assert.ok(!html.includes(`<option>${mod.title}</option>`));
});

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
  assert.ok(html.includes('Tacview .acmi files, DCS logs, screenshots and missions are useful for bug reports.'));
  assert.ok(html.includes('Public Mod &amp; Test'));
  assert.doesNotMatch(html, /_captcha|_autoresponse|_cc/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Form labels must have unique targets');
});

test('attachment validation accepts DCS evidence and rejects unsupported or oversized files', () => {
  assert.equal(attachmentError(undefined), '');
  for (const name of ['DCS.log', 'mission.miz', 'TRACK.TRK', 'screen.png', 'evidence.zip', 'Tacview.acmi', 'Tacview.zip.acmi']) assert.equal(attachmentError({name,size:1024}), '');
  assert.ok(attachmentError({name:'large.zip',size:attachmentLimit+1}));
  assert.ok(attachmentError({name:'script.exe',size:1024}));
});
