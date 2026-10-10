import { project, command, gh } from './lib.mjs';

const config = await project();
const repo = `${config.github.owner}/${config.github.repo}`;
gh(['auth', 'status']);
const user = gh(['api', 'user', '--jq', '.login']).stdout.trim();
if (user.toLowerCase() !== config.github.owner.toLowerCase()) throw new Error(`Sign into ${config.github.owner}, not ${user}.`);
command('git', ['rev-parse', '--verify', 'HEAD']);
const origin = command('git', ['remote', 'get-url', 'origin'], { allowFailure: true });
if (origin.status === 0 && ![ `https://github.com/${repo}.git`, `https://github.com/${repo}`, `git@github.com:${repo}.git` ].includes(origin.stdout.trim())) throw new Error('Origin points to another repository; refusing to change it.');
const existing = gh(['api', `repos/${repo}`], { allowFailure: true });
if (existing.status === 0) {
  const remote = JSON.parse(existing.stdout);
  if (remote.visibility !== 'public') throw new Error('Existing repository is private; review visibility before continuing.');
  if (origin.status !== 0) command('git', ['remote', 'add', 'origin', `https://github.com/${repo}.git`]);
} else {
  if (!existing.stderr.includes('404')) throw new Error('Unable to verify repository availability.');
  gh(['repo', 'create', repo, '--public', '--source', '.', '--remote', 'origin', '--description', 'TPG DCS mods: website source and versioned mod downloads.']);
}
gh(['auth', 'setup-git']);
command('git', ['push', '-u', 'origin', 'main'], { inherit: true });
console.log(`Ready: https://github.com/${repo}`);
