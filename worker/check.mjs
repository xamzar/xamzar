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
