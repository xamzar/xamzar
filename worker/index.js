// Live SVG card for the GitHub profile README. GET /card.svg?theme=dark|light
const USER = 'xamzar', PKG = 'socratic-watchdog';
const THEMES = {
  dark: { bg: '#18191b', ink: '#eff0f1', muted: '#a3a5aa', tone: '#2c2e32', accent: '#ff4a1f' },
  light: { bg: '#eff0f1', ink: '#18191b', muted: '#55585e', tone: '#d6d7da', accent: '#e8400f' },
};
const WX = { 0: 'clear', 1: 'mostly clear', 2: 'partly cloudy', 3: 'overcast', 45: 'fog', 48: 'fog', 51: 'drizzle', 53: 'drizzle', 55: 'drizzle', 61: 'rain', 63: 'rain', 65: 'heavy rain', 80: 'showers', 81: 'showers', 82: 'heavy showers', 95: 'thunderstorm', 96: 'thunderstorm', 99: 'thunderstorm' };

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

function ago(iso, now) {
  const m = Math.max(0, Math.round((now - Date.parse(iso)) / 60000));
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} d ago`;
}

// HK wall-clock parts for `now`; HK has no DST, so a fixed +8 h offset is exact.
function hk(now) {
  const d = new Date(now + 8 * 3600e3);
  const y = d.getUTCFullYear();
  const start = Date.UTC(y, 0, 1), end = Date.UTC(y + 1, 0, 1);
  return {
    time: d.toISOString().slice(11, 16),
    date: new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(d),
    year: y, yearPct: (d - start) / (end - start),
  };
}

const INTRO = 'I run most of my life through MCP servers and coding agents, and open-source the parts that generalise.';
const REPOS = {
  'socratic-watchdog': { n: '01', d: 'A Jupyter tutor on PyPI. When your code fails, it asks you a spoken', d2: 'Socratic question instead of giving you the answer.' },
  'agent-hub': { n: '02', d: 'Claude Code, Codex and Hermes on your phone: a self-hosted PWA', d2: 'with a one-line installer.' },
  'cityu-schedule': { n: '03', d: 'Finds every clash-free CityU timetable for the courses you pick,', d2: 'ranked by how you like your week.', site: 'cityu-schedule.xmzr.dev' },
};
const LINKS = { site: 'xmzr.dev', linkedin: 'LinkedIn', github: 'source' };

function frame(c, W, H, label, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
<style>
text{font-family:ui-sans-serif,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;fill:${c.ink}}
.m{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.mu{fill:${c.muted}}
.in{animation:in .6s cubic-bezier(.2,.7,.2,1) both}
@keyframes in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.dot{animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
.bar{animation:grow 1.2s cubic-bezier(.2,.7,.2,1) .3s both}
@keyframes grow{from{width:0}}
.cur{animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<rect width="${W}" height="${H}" rx="14" fill="${c.bg}"/>
${body}
</svg>`;
}

export function renderRepo(name, info, theme = 'dark', now = Date.now()) {
  const c = THEMES[theme] || THEMES.dark, r = REPOS[name];
  const stats = [
    info?.stars > 0 && `★ ${info.stars}`,
    info?.pushed && `updated ${ago(info.pushed, now)}`,
  ].filter(Boolean).join(' · ');
  const extra = name === 'socratic-watchdog' ? (info?.downloads != null && `${info.downloads.toLocaleString('en-US')} installs / month`) : r.site ? `live · ${r.site}` : info?.lang;
  return frame(c, 840, 132, `${name}: ${r.d} ${r.d2}`, `<g class="in"><text x="36" y="50" font-size="14" class="m" fill="${c.accent}" style="fill:${c.accent}">${r.n}</text>
<text x="72" y="52" font-size="24" font-weight="700" letter-spacing="-0.3">${esc(name)}<tspan fill="${c.accent}"> ↗</tspan></text>
<text x="72" y="84" font-size="15" class="mu">${esc(r.d)}</text>
<text x="72" y="106" font-size="15" class="mu">${esc(r.d2)}</text></g>
<g class="in" style="animation-delay:.1s"><text x="804" y="50" font-size="13" text-anchor="end" class="m mu">${esc(stats)}</text>
${extra ? `<text x="804" y="72" font-size="13" text-anchor="end" class="m">${esc(extra)}</text>` : ''}
${r.site ? `<circle class="dot" cx="${804 - (extra.length * 7.8) - 10}" cy="67.5" r="3.5" fill="${c.accent}"/>` : ''}</g>`);
}

export function renderLink(key, theme = 'dark') {
  const c = THEMES[theme] || THEMES.dark, label = LINKS[key], W = Math.round(44 + (label.length + 2) * 8.4);
  return frame(c, W, 44, label, `<text x="22" y="28" font-size="14" class="m">${esc(label)}<tspan fill="${c.accent}"> ↗</tspan></text>`);
}

export function render(data, theme = 'dark', now = Date.now()) {
  const c = THEMES[theme] || THEMES.dark, t = hk(now);
  const pct = Math.floor(t.yearPct * 100), barW = 300, fill = Math.round(barW * t.yearPct);
  const wx = data.wx ? ` · ${Math.round(data.wx.temp)}°C ${WX[data.wx.code] ?? ''}`.trimEnd() : '';
  const push = data.push && `${data.push.repo} · “${clip(data.push.msg, 44)}” · ${ago(data.push.at, now)}`;
  const dl = data.downloads != null && `${data.downloads.toLocaleString('en-US')} installs last month`;
  const rows = [
    ['latest push', push],
    [PKG, dl],
  ].filter(r => r[1]);
  const H = 256 + rows.length * 26;
  return frame(c, 840, H, `Rauan Khamza, ${t.time} in Hong Kong. ${INTRO}`, `<g class="in"><text x="36" y="66" font-size="38" font-weight="700" letter-spacing="-0.5">Rauan Khamza<tspan fill="${c.accent}">.</tspan></text>
<text x="36" y="96" font-size="16" class="mu">agent-native builder · CS @ CityU Hong Kong</text>
<text x="36" y="134" font-size="15">${esc(INTRO)}</text></g>
<g class="in" style="animation-delay:.1s"><text x="804" y="64" font-size="34" font-weight="600" text-anchor="end" class="m">${esc(t.time)}<tspan class="cur" fill="${c.accent}">_</tspan></text>
<circle class="dot" cx="714" cy="88" r="4" fill="${c.accent}"/><text x="804" y="93" font-size="13" text-anchor="end" class="m mu">live · HKT</text></g>
<g class="in" style="animation-delay:.2s"><text x="36" y="180" font-size="15" class="m">${esc(t.date)}<tspan class="mu"> · Hong Kong${esc(wx)}</tspan></text>
</g>
<g class="in" style="animation-delay:.25s"><text x="36" y="220" font-size="14" class="m mu">year ${t.year}</text>
<rect x="210" y="210" width="${barW}" height="10" rx="5" fill="${c.tone}"/><rect class="bar" x="210" y="210" width="${fill}" height="10" rx="5" fill="${c.accent}"/>
<text x="${210 + barW + 14}" y="220" font-size="14" class="m">${pct}%</text></g>
${rows.map(([k, v], i) => `<g class="in" style="animation-delay:${0.3 + i * 0.1}s"><text x="36" y="${246 + i * 26}" font-size="14" class="m"><tspan class="mu">${esc(k)}</tspan><tspan x="210">${esc(v)}</tspan></text></g>`).join('\n')}`);
}

// Upstream fetches are edge-cached 10 min; any failure just drops that line.
const get = (url) => fetch(url, { headers: { 'User-Agent': 'xmzr-gh-card', Accept: 'application/json' }, cf: { cacheTtl: 600, cacheEverything: true } })
  .then(r => (r.ok ? r.json() : null)).catch(() => null);

async function load() {
  const lastCommit = async () => {
    const r = ((await get(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=3`)) || []).find(x => x.name !== USER);
    const [c] = (r && (await get(`https://api.github.com/repos/${USER}/${r.name}/commits?per_page=1`))) || [];
    return c && { repo: r.name, msg: c.commit.message.split('\n')[0], at: c.commit.committer.date };
  };
  const [wx, push, pypi] = await Promise.all([
    get('https://api.open-meteo.com/v1/forecast?latitude=22.32&longitude=114.17&current=temperature_2m,weather_code'),
    lastCommit(),
    get(`https://pypistats.org/api/packages/${PKG}/recent`),
  ]);
  return {
    wx: wx?.current && { temp: wx.current.temperature_2m, code: wx.current.weather_code },
    push,
    downloads: pypi?.data?.last_month ?? null,
  };
}

async function loadRepo(name) {
  const [r, pypi] = await Promise.all([
    get(`https://api.github.com/repos/${USER}/${name}`),
    name === PKG ? get(`https://pypistats.org/api/packages/${PKG}/recent`) : null,
  ]);
  return { stars: r?.stargazers_count, pushed: r?.pushed_at, lang: r?.language, downloads: pypi?.data?.last_month ?? null };
}

export default {
  async fetch(req) {
    const u = new URL(req.url);
    const theme = u.searchParams.get('theme'), name = u.searchParams.get('name') || u.searchParams.get('to');
    let svg;
    if (u.pathname === '/card.svg') svg = render(await load(), theme);
    else if (u.pathname === '/repo.svg' && REPOS[name]) svg = renderRepo(name, await loadRepo(name), theme);
    else if (u.pathname === '/link.svg' && LINKS[name]) svg = renderLink(name, theme);
    else return Response.redirect('https://github.com/xamzar', 302);
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate' },
    });
  },
};
