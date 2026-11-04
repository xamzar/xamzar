// node check.mjs — render with fixed data, assert escaping + live fields
import assert from 'node:assert/strict';
import { render } from './index.js';
const now = Date.UTC(2026, 10, 4, 18, 5); // 02:05 HKT on 2026-11-05
const svg = render({ wx: { temp: 23.4, code: 2 }, push: { repo: 'agent-hub', msg: 'fix <script>&"x"', at: new Date(now - 7200e3).toISOString() }, downloads: 1234 }, 'dark', now);
assert.match(svg, />02:05</); assert.match(svg, /Thu, 5 Nov 2026/); assert.match(svg, /23°C partly cloudy/);
assert.match(svg, /2 h ago/); assert.match(svg, /1,234 installs/); assert.match(svg, /year 2026<[^]*>84%</);
assert.ok(!svg.includes('<script>') && svg.includes('&lt;script&gt;&amp;&quot;x&quot;'));
const bare = render({}, 'light', now); assert.ok(!bare.includes('latest push') && bare.includes('#eff0f1'));
import fs from 'node:fs'; fs.writeFileSync('/tmp/card-dark.svg', svg); fs.writeFileSync('/tmp/card-light.svg', render({ wx: { temp: 23.4, code: 2 }, push: { repo: 'agent-hub', msg: 'apps loader + per-app API', at: new Date(now - 7200e3).toISOString() }, downloads: 1234 }, 'light', now));
console.log('ok');
import { renderRepo, renderLink } from './index.js';
const rp = renderRepo('socratic-watchdog', { stars: 1, pushed: new Date(now - 3 * 86400e3).toISOString(), downloads: 186 }, 'dark', now);
assert.match(rp, /★ 1 · updated 3 d ago/); assert.ok(!renderRepo('agent-hub', { stars: 0 }, 'dark', now).includes('★')); assert.match(rp, /186 installs \/ month/);
assert.match(renderRepo('cityu-schedule', {}, 'light', now), /live · cityu-schedule\.xmzr\.dev/);
assert.match(renderLink('site'), /xmzr\.dev/);
fs.writeFileSync('/tmp/p-card.svg', render({ wx: { temp: 24, code: 1 }, push: { repo: 'xamzar', msg: 'Profile README with a live card', at: new Date(now - 720e3).toISOString() }, downloads: 186 }, 'dark', now));
fs.writeFileSync('/tmp/p-repo.svg', rp); fs.writeFileSync('/tmp/p-repo2.svg', renderRepo('cityu-schedule', { stars: 0, pushed: new Date(now - 56 * 86400e3).toISOString() }, 'dark', now)); fs.writeFileSync('/tmp/p-link.svg', renderLink('linkedin'));
console.log('ok2');
