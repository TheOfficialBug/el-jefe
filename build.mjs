// Static site generator for El Jefe. No dependencies: `node build.mjs` writes ./dist.
import { mkdir, rm, writeFile, cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { restaurant as R, menuPages, featured } from './src/menu.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || 'https://eljefeauthenticmexicancuisine.com').replace(/\/$/, '');
// BASE is the path the site is served under, e.g. "/el-jefe" on GitHub Pages project sites. Empty at a domain root.
const BASE = (process.env.BASE || '').replace(/\/$/, '');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const img = (name) => `/img/${name}.jpg`;
const priceValue = (p) => { const m = /^\$(\d+(?:\.\d+)?)$/.exec(p.trim()); return m ? m[1] : ''; };
const pageBySlug = Object.fromEntries(menuPages.map((p) => [p.slug, p]));
const allItems = menuPages.flatMap((p) => p.sections.flatMap((s) => (s.items || []).map((it) => ({ ...it, page: p, section: s }))));

// ---------- icons (inline stroke SVG) ----------
const svg = (d, size = 22, w = 1.8) => `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  phone: (s) => svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>', s),
  bag: (s) => svg('<path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>', s),
  cart: (s) => svg('<path d="M3 4h2l2.4 11h10.2L20 8H7"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>', s),
  pin: (s, w) => svg('<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>', s, w),
  clock: (s) => svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', s),
  mail: (s) => svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>', s),
  nav: (s) => svg('<path d="M3 11l18-8-8 18-2-8-8-2z"/>', s, 2),
  left: (s) => svg('<path d="M15 6l-6 6 6 6"/>', s, 2),
  right: (s) => svg('<path d="M9 6l6 6-6 6"/>', s, 2),
  menu: (s) => svg('<path d="M4 7h16M4 12h16M4 17h16"/>', s, 2),
  close: (s) => svg('<path d="M6 6l12 12M18 6L6 18"/>', s, 2),
  fork: (s) => svg('<path d="M7 2v8a2 2 0 0 0 2 2v10"/><path d="M5 2v6"/><path d="M11 2v6"/><path d="M17 22V2c-2 1-3 3.5-3 7s1 4 3 4"/>', s, 1.5),
  glass: (s) => svg('<path d="M4 4h16l-8 9z"/><path d="M12 13v7"/><path d="M8 20h8"/>', s, 1.5)
};

// ---------- shared chrome ----------
const navItems = [
  ['Home', '/', 'home'], ['Menu', '/menu/', 'menu'], ['Bar', '/bar/', 'bar'],
  ['Specials', '/#specials', 'specials'], ['About Us', '/#about', 'about'], ['Contact', '/visit/', 'visit']
];

function header(active) {
  const links = navItems.map(([label, href, key]) => `<li><a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <div class="wrap site-header__inner">
    <a class="logo" href="/" aria-label="El Jefe home">
      <span class="logo__word">El <span>Jefe</span></span>
      <span class="logo__tag">AUTHENTIC MEXICAN CUISINE</span>
    </a>
    <nav class="main-nav" id="main-nav" aria-label="Main" data-nav><ul>${links}</ul></nav>
    <div class="header-actions">
      <a class="icon-btn" href="${R.phoneHref}" aria-label="Call El Jefe at ${R.phone}">${I.phone()}</a>
      <button class="icon-btn" type="button" data-open-order aria-label="Your order list">${I.bag()}<span class="badge-dot" data-order-count hidden>0</span></button>
      <a class="btn btn--red btn--order" href="/visit/#order">Order Online</a>
      <button class="icon-btn nav-toggle" type="button" aria-controls="main-nav" aria-expanded="false" data-nav-toggle aria-label="Open menu">${I.menu()}</button>
    </div>
  </div>
</header>`;
}

const footer = () => `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <span class="logo__word">El <span>Jefe</span></span>
        <p>Bringing the true flavors of Mexico to Ames, Iowa.</p>
      </div>
      <nav class="footer-cols" aria-label="Footer">
        <div><strong>Visit</strong><span>${R.street}</span><span>${R.city}, ${R.region} ${R.zip}</span><span>Mon–Sun 11AM–10PM</span><a href="${R.directions}" target="_blank" rel="noopener">Get directions</a></div>
        <div><strong>Explore</strong><a href="/menu/">Menu</a><a href="/bar/">Bar</a><a href="/visit/#reserve">Reservations</a><a href="/visit/">Contact</a></div>
        <div><strong>Connect</strong><a href="${R.phoneHref}">${R.phone}</a><a href="mailto:${R.email}">${R.email}</a><a href="${R.facebook}" target="_blank" rel="noopener">Facebook</a><a href="${R.googleMaps}" target="_blank" rel="noopener">Review us on Google</a></div>
      </nav>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${R.name}. All rights reserved.</span>
      <span>18% gratuity on groups of 5 or more · Please drink responsibly</span>
    </div>
  </div>
</footer>`;

const orderDrawer = () => `<div class="drawer-backdrop" data-order-backdrop></div>
<aside class="drawer" id="order-drawer" aria-labelledby="order-title" aria-hidden="true" data-order-drawer>
  <div class="drawer__head">
    <h2 id="order-title">Your order list</h2>
    <button class="icon-btn" type="button" data-close-order aria-label="Close order list">${I.close()}</button>
  </div>
  <div class="drawer__body" data-order-lines><p class="drawer__empty">Tap the cart on any dish to start a list.</p></div>
  <div class="drawer__foot">
    <div class="drawer__total"><span>Estimated total</span><span data-order-total>$0.00</span></div>
    <p class="drawer__note">Prices before tax. Items marked “price varies” depend on your choice. Call us to place this order for pickup.</p>
    <a class="btn btn--red" href="${R.phoneHref}">${I.phone(20)} Call ${R.phone} to order</a>
    <button class="btn btn--ghost" type="button" data-clear-order>Clear list</button>
  </div>
</aside>
<div class="toast" role="status" aria-live="polite" data-toast></div>`;

function jsonLd() {
  return JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Restaurant', name: R.name, servesCuisine: 'Mexican',
    url: SITE_URL + '/', telephone: '+1-515-232-2778', email: R.email, menu: SITE_URL + '/menu/', acceptsReservations: true,
    priceRange: '$$', image: SITE_URL + '/img/aguachile.jpg',
    address: { '@type': 'PostalAddress', streetAddress: R.street, addressLocality: R.city, addressRegion: R.region, postalCode: R.zip, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: R.lat, longitude: R.lon },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '11:00', closes: '22:00' }],
    sameAs: [R.facebook]
  });
}

function layout({ title, description, path, active, body, ogImage = 'aguachile' }) {
  const fullTitle = title ? `${title} · El Jefe Authentic Mexican Cuisine, Ames IA` : 'El Jefe Authentic Mexican Cuisine · Ames, Iowa';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE_URL}${path}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE_URL}${path}">
<meta property="og:image" content="${SITE_URL}${img(ogImage)}">
<meta name="theme-color" content="#C4161C">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css">
<script type="application/ld+json">${jsonLd()}</script>
</head>
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
${orderDrawer()}
<script src="/js/main.js" defer></script>
</body>
</html>
`;
}

// ---------- components ----------
function dishCard(it, plateClass = '') {
  const tags = [it.isNew ? '<span class="tag-new">NEW</span>' : '', it.tag ? `<span class="tag-soft">${esc(it.tag)}</span>` : ''].join('');
  const art = it.img
    ? `<img src="${img(it.img)}" alt="${esc(it.name)}" loading="lazy" decoding="async" width="156" height="156">`
    : `<div class="dish__placeholder">${plateClass ? I.glass(34) : I.fork(34)}<span>PHOTO COMING SOON</span></div>`;
  return `<article class="dish">
  <div class="dish__plate${plateClass}">${art}</div>
  <div class="dish__tags">${tags}</div>
  <h3 class="dish__name">${esc(it.name)}</h3>
  ${it.desc ? `<p class="dish__desc">${esc(it.desc)}</p>` : '<p class="dish__desc"></p>'}
  <div class="dish__foot">
    <span class="dish__price">${esc(it.price)}</span>
    <button class="add-btn" type="button" data-add data-name="${esc(it.name)}" data-price="${priceValue(it.price)}" aria-label="Add ${esc(it.name)} to order list">${I.cart()}</button>
  </div>
</article>`;
}

function menuPage(p) {
  const tabs = menuPages.map((t) => `<a href="${t.path}"${t.slug === p.slug ? ' aria-current="page"' : ''}>${esc(t.tab)}</a>`).join('');
  const jump = p.sections.map((s) => `<a class="chip" href="#${s.id}">${esc(s.title)}</a>`).join('');
  const plateClass = p.plate === 'navy' ? ' dish__plate--navy' : '';
  const sections = p.sections.map((s) => {
    const count = s.items ? `${s.items.length} ${p.bar ? 'drinks' : 'items'}` : `${s.choices.list.length} options`;
    const choices = s.choices ? `<div class="choices">
      <div class="choices__head"><span class="eyebrow eyebrow--gold">${esc(s.choices.title)}</span><strong>${esc(s.choices.price)}</strong></div>
      <ul>${s.choices.list.map(([n, pr]) => `<li><span>${esc(n)}</span>${pr ? `<b>${esc(pr)}</b>` : ''}</li>`).join('')}</ul>
    </div>` : '';
    const items = s.items ? `<div class="card-grid">${s.items.map((it) => dishCard(it, plateClass)).join('\n')}</div>` : '';
    return `<section class="menu-section" id="${s.id}" aria-labelledby="${s.id}-h">
    <div class="menu-section__head"><div>
      <span class="eyebrow">${esc(s.eyebrow)}</span>
      <h2 class="h2" id="${s.id}-h">${esc(s.title)}</h2>
      ${s.note ? `<p class="menu-section__note">${esc(s.note)}</p>` : ''}
    </div><span class="count">${count}</span></div>
    ${choices}${items}
  </section>`;
  }).join('\n');

  const idx = menuPages.indexOf(p);
  const next = menuPages[idx + 1];
  const nextLink = next ? `<a class="btn btn--red" href="${next.path}">Next: ${esc(next.tab)} →</a>` : `<a class="btn btn--red" href="/visit/#reserve">Book a table →</a>`;
  const advisory = p.bar
    ? `<div class="menu-foot menu-foot--dark"><div><strong>Please drink responsibly. Don't drink and drive.</strong><p class="small">Must be 21+ with valid ID. We reserve the right to refuse service to anyone.</p></div>${nextLink}</div>`
    : `<div class="menu-foot"><div><strong>${p.rawAdvisory ? 'Consumer advisory' : 'Good to know'}</strong><p class="small">${p.rawAdvisory ? 'Oysters on the half shell, ceviche and aguachiles are served raw. ' : ''}Consuming raw or undercooked meats, poultry, seafood, shellfish or eggs may increase your risk of foodborne illness. An 18% gratuity is added for groups of 5 or more.</p></div>${nextLink}</div>`;

  const body = `<div class="wrap">
  <section class="page-intro">
    <span class="eyebrow">${esc(p.eyebrow || 'Nuestro menú')}</span>
    <h1 class="display h1">${esc(p.title)}</h1>
    <p class="lead">${esc(p.intro)}</p>
  </section>
  <nav class="menu-tabs" aria-label="Menu pages">${tabs}</nav>
  <nav class="jump" aria-label="On this page"><span>Jump to:</span>${jump}</nav>
  ${sections}
  ${advisory}
</div>`;
  const firstImg = p.sections.flatMap((s) => s.items || []).find((i) => i.img);
  return layout({
    title: p.bar ? `Bar · ${p.title}` : `Menu · ${p.title}`,
    description: `${p.intro} El Jefe Authentic Mexican Cuisine, 524 Lincoln Way, Ames, Iowa.`,
    path: p.path, active: p.bar ? 'bar' : 'menu', body, ogImage: firstImg ? firstImg.img : 'aguachile'
  });
}

function homePage() {
  const fav = featured.map((f) => {
    const it = allItems.find((i) => i.name === f.name);
    if (!it) throw new Error(`Featured item not found in menu: ${f.name}`);
    return dishCard({ ...it, desc: f.sub });
  }).join('\n');

  const tiles = [
    ['Starters', 'Nachos, dips, soups & salads', 'nachos', '/menu/'],
    ['Lunch', 'Mon–Fri · 11AM–3PM', 'lunch-fajitas', '/menu/lunch/'],
    ['Chef Favorites', 'Tacos, tortas & molcajetes', 'el-regio', '/menu/chef-favorites/'],
    ['Steaks & Fajitas', 'Sizzling platters', 'carne-asada', '/menu/steaks-fajitas/'],
    ['Burritos', 'Smothered or in a bowl', 'burrito', '/menu/burritos-quesadillas/'],
    ['Seafood', 'Del mar', 'ceviche-flight', '/menu/seafood-desserts/'],
    ['Desserts', 'Los postres', 'fried-ice-cream', '/menu/seafood-desserts/#desserts'],
    ['Margaritas', 'Classics & top shelf', 'mango-margarita', '/bar/']
  ].map(([n, sub, im, href]) => `<a class="tile" href="${href}"><img src="${img(im)}" alt="" loading="lazy" width="120" height="120"><strong>${n}</strong><small>${sub}</small></a>`).join('');

  const body = `<div class="wrap">
  <section class="hero" aria-labelledby="hero-h">
    <div class="hero__copy">
      <span class="pill">${I.pin(16, 2)} ${R.street} · ${R.city}, Iowa</span>
      <h1 class="display h1" id="hero-h">The true flavors of Mexico, <span class="accent">right here</span> in Ames.</h1>
      <p class="lead">Sizzling fajitas, stone-bowl molcajetes, fresh aguachile and margaritas shaken at your table, all made from scratch on Lincoln Way.</p>
      <div class="hero__ctas">
        <a class="btn btn--red btn--lg" href="/menu/">View Menu</a>
        <a class="btn btn--ghost btn--lg" href="/visit/#reserve">Book A Table</a>
      </div>
      <div class="hero__facts">
        <div class="fact"><span class="fact__icon fact__icon--navy">${I.clock(20)}</span><div><small>Open every day</small><strong>11AM – 10PM</strong></div></div>
        <div class="fact"><span class="fact__icon fact__icon--gold">${I.phone(20)}</span><div><small>Call to order</small><a href="${R.phoneHref}">${R.phone}</a></div></div>
      </div>
    </div>
    <div class="hero__art">
      <div class="plate-stage">
        <div class="plate"><img src="${img('aguachile')}" alt="Aguachile: shrimp in lime and chile sauce with avocado, cucumber and red onion" width="524" height="524" fetchpriority="high"></div>
        <div class="float-card float-card--tl"><strong>$10</strong><span><b>Lunch combos</b> Mon–Fri, 11–3</span></div>
        <div class="float-plate"><img src="${img('guacamole')}" alt="Fresh guacamole" loading="lazy"></div>
        <a class="float-chip" href="/menu/seafood-desserts/#seafood" style="color:#fff;text-decoration:none"><span class="tag-new">NEW</span> Ceviche Flights · $19.50</a>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:24px" aria-labelledby="fav-h">
    <div class="section-head" style="margin-bottom:0">
      <div><span class="eyebrow">Los favoritos</span><h2 class="h2" id="fav-h">Fan favorites</h2></div>
      <div class="carousel-controls">
        <button class="round-btn round-btn--dark" type="button" data-scroll="-1" data-target="featured" aria-label="Previous dishes">${I.left()}</button>
        <button class="round-btn round-btn--red" type="button" data-scroll="1" data-target="featured" aria-label="Next dishes">${I.right()}</button>
      </div>
    </div>
    <div class="featured" id="featured" tabindex="0" aria-label="Fan favorite dishes">${fav}</div>
  </section>
</div>

<section class="section section--white" aria-labelledby="explore-h">
  <div class="wrap">
    <div class="section-head">
      <div><span class="eyebrow">Nuestro menú</span><h2 class="h2" id="explore-h">Explore the menu</h2></div>
      <a href="/menu/" style="font-weight:500">See the full menu →</a>
    </div>
    <div class="tiles">${tiles}</div>
  </div>
</section>

<section class="section section--navy" id="specials" aria-labelledby="spec-h">
  <div class="wrap">
    <div class="section-head"><div><span class="eyebrow eyebrow--gold">Especiales</span><h2 class="h2" id="spec-h">Specials at El Jefe</h2></div></div>
    <div class="specials">
      <div class="special"><img src="${img('lunch-fajitas')}" alt="Lunch fajitas on a sizzling skillet" loading="lazy"><h3>Lunch Combinations · $10</h3><p>Eight combos, Monday through Friday from 11AM to 3PM. Chile relleno, burritos, enchiladas, tacos and tamales with rice and beans.</p><a href="/menu/lunch/#lunch-combos">See lunch menu →</a></div>
      <div class="special"><img src="${img('boba')}" alt="Boba margaritas" loading="lazy"><h3>Boba Margaritas · $15</h3><p>For her or for him. Mango, strawberry, peach, kiwi, blueberry or pomegranate.</p><a href="/bar/#specials">See bar menu →</a></div>
      <div class="special"><img src="${img('tower')}" alt="El Jefe tower margarita" loading="lazy"><h3>El Jefe Tower · $75</h3><p>Over 128oz of our house margarita. Made for parties, birthdays and big tables.</p><a href="/bar/#signature">See margaritas →</a></div>
    </div>
  </div>
</section>

<div class="wrap">
  <section class="section about" id="about" aria-labelledby="about-h">
    <div class="about__photos">
      <img src="${img('muchacho')}" alt="El Muchacho Especial platter" loading="lazy">
      <img src="${img('ceviche-flight')}" alt="Ceviche flight" loading="lazy">
      <img src="${img('fried-ice-cream')}" alt="Fried ice cream" loading="lazy">
      <img src="${img('fajitas')}" alt="Mixed fajitas" loading="lazy">
    </div>
    <div class="about__copy">
      <span class="eyebrow">Sobre nosotros</span>
      <h2 class="h2" id="about-h">Classic favorites, bold new flavors</h2>
      <p class="lead" style="font-size:18px">Savor the authentic taste of Mexico at El Jefe in Ames, Iowa. From classic favorites to bold new flavors, our dishes are crafted with care and authenticity. Join us for a culinary journey that delights the senses.</p>
      <div class="chips"><span class="chip">Dine in</span><span class="chip">Pickup</span><span class="chip">Reservations</span><span class="chip">Full bar</span></div>
    </div>
  </section>

  <section class="cta-band" aria-labelledby="visit-h" style="margin-bottom:96px">
    <div><h2 class="h2" id="visit-h">Come hungry. Leave happy.</h2><p>${R.street}, ${R.city}, ${R.region} ${R.zip} · Open Mon–Sun, 11AM–10PM · ${R.phone}</p></div>
    <div class="actions">
      <a class="btn btn--white" href="/visit/#reserve">Book A Table</a>
      <a class="btn btn--outline-light" href="${R.directions}" target="_blank" rel="noopener">${I.nav(18)} Get Directions</a>
    </div>
  </section>
</div>`;
  return layout({ title: '', description: 'Authentic Mexican food in Ames, Iowa: fajitas, molcajetes, aguachile, tacos and margaritas at 524 Lincoln Way. Open daily 11AM–10PM.', path: '/', active: 'home', body });
}

function visitPage() {
  const orderBtn = R.orderOnlineUrl ? `<a class="btn btn--outline-light" href="${esc(R.orderOnlineUrl)}" target="_blank" rel="noopener">Order Online</a>` : '';
  const body = `<div class="wrap">
  <section class="page-intro" id="contact" aria-labelledby="contact-h">
    <span class="eyebrow">Contáctanos</span>
    <h1 class="display h1" id="contact-h">Visit El Jefe</h1>
    <p class="lead">On Lincoln Way in Ames, between Grand Avenue and Clark Avenue. Open every day from 11AM to 10PM.</p>
  </section>
  <div class="visit-grid">
    <a class="map" href="${R.googleMaps}" target="_blank" rel="noopener" aria-label="Open El Jefe, ${R.street}, ${R.city}, in Google Maps">
      <img src="/img/map.png" alt="Street map of downtown Ames showing El Jefe at ${R.street}, between Grand Avenue and Clark Avenue" width="1100" height="600">
      <span class="map__pin" aria-hidden="true"><span>El Jefe · ${R.street}</span><svg width="34" height="44" viewBox="0 0 24 32" fill="#C4161C" stroke="#fff" stroke-width="1.5"><path d="M12 31s10-10.5 10-18A10 10 0 0 0 2 13c0 7.5 10 18 10 18z"/><circle cx="12" cy="13" r="3.5" fill="#fff" stroke="none"/></svg></span>
      <span class="map__cta">Open in Google Maps ↗</span>
      <span class="map__credit">© OpenStreetMap contributors</span>
    </a>
    <div class="contact-card">
      <div class="fact"><span class="fact__icon fact__icon--red">${I.pin(22)}</span><div><strong>Address</strong><small>${R.street}<br>${R.city}, ${R.region} ${R.zip}</small></div></div>
      <div class="fact"><span class="fact__icon fact__icon--navy">${I.clock()}</span><div><strong>Hours</strong><small>${R.hours}<br>${R.lunchHours}</small></div></div>
      <div class="fact"><span class="fact__icon fact__icon--gold">${I.phone()}</span><div><strong>Phone</strong><small><a href="${R.phoneHref}">${R.phone}</a></small></div></div>
      <div class="fact"><span class="fact__icon fact__icon--soft">${I.mail()}</span><div><strong>Email</strong><small><a href="mailto:${R.email}">${R.email}</a></small></div></div>
      <div class="actions">
        <a class="btn btn--red" href="${R.directions}" target="_blank" rel="noopener">${I.nav(20)} Get Directions</a>
        <div class="row">
          <a class="btn btn--outline" href="${R.appleMaps}" target="_blank" rel="noopener">Apple Maps</a>
          <a class="btn btn--outline" href="${R.phoneHref}">Call Us</a>
        </div>
      </div>
    </div>
  </div>
  <div class="info-tiles">
    <div><strong>Weekday lunch</strong><span><a href="/menu/lunch/#lunch-combos">$10 lunch combos</a>, Mon–Fri 11AM–3PM.</span></div>
    <div><strong>Groups</strong><span>18% gratuity is added for groups of 5 or more.</span></div>
    <div><strong>We accept</strong><span>Visa, Mastercard, American Express, Discover.</span></div>
    <div><strong>Follow us</strong><span><a href="${R.facebook}" target="_blank" rel="noopener">Facebook</a> · <a href="${R.googleMaps}" target="_blank" rel="noopener">Review us on Google</a></span></div>
  </div>
</div>

<section class="section section--white" id="reserve" aria-labelledby="res-h" style="margin-top:72px">
  <div class="wrap reserve">
    <div class="reserve__copy">
      <span class="eyebrow">Reservaciones</span>
      <h2 class="display h1" id="res-h" style="font-size:clamp(36px,4vw,56px)">Book a table</h2>
      <p class="lead">Send us your request and we'll confirm by phone or email. For same-day tables, call ${R.phone}.</p>
      <div class="reserve__photos">
        <img src="${img('el-regio')}" alt="El Regio platter" loading="lazy">
        <img src="${img('boba')}" alt="Boba margaritas" loading="lazy">
      </div>
      <p style="font-size:14px;color:var(--muted)">18% de propina será aplicado a mesas con 5 o más personas.</p>
    </div>
    <form class="form" data-reserve-form novalidate aria-labelledby="res-form-h">
      <h3 id="res-form-h" style="font-size:22px;font-weight:600">Reservation request</h3>
      <div class="form__grid">
        <div class="field"><label for="r-name">Name</label><input id="r-name" name="name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="r-email">Email</label><input id="r-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="r-phone">Phone number</label><input id="r-phone" name="phone" type="tel" autocomplete="tel" required></div>
        <div class="field"><label for="r-party">Number of people</label><select id="r-party" name="party">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'].map((n) => `<option${n === '2' ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
        <div class="field"><label for="r-date">Date</label><input id="r-date" name="date" type="date" required></div>
        <div class="field"><label for="r-time">Time</label><input id="r-time" name="time" type="time" min="11:00" max="21:30" step="900" required></div>
      </div>
      <div class="field"><label for="r-msg">Message <span style="color:var(--muted);font-weight:400">(optional)</span></label><textarea id="r-msg" name="message" rows="3"></textarea><span class="hint">We're open 11AM–10PM daily. Groups of 5+ include an 18% gratuity.</span></div>
      <p class="form__status" data-form-status role="status" aria-live="polite"></p>
      <button class="btn btn--red btn--lg" type="submit">Send Request</button>
    </form>
  </div>
</section>

<section class="section section--navy" id="order" aria-labelledby="order-h">
  <div class="wrap" style="display:flex;flex-wrap:wrap;gap:40px;align-items:center;justify-content:space-between">
    <div style="flex:1 1 420px;display:flex;flex-direction:column;gap:12px">
      <span class="eyebrow eyebrow--gold">Para llevar</span>
      <h2 class="h2" id="order-h">Order for pickup</h2>
      <p style="color:var(--navy-soft);font-size:17px">Build a list from the menu with the cart buttons, then call ahead and pick up your favorites hot and ready at ${R.street}.</p>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:16px">
      <a class="btn btn--white btn--lg" href="${R.phoneHref}">Call ${R.phone}</a>
      <button class="btn btn--outline-light btn--lg" type="button" data-open-order>View my order list</button>
      ${orderBtn}
    </div>
  </div>
</section>`;
  return layout({ title: 'Visit, Reservations & Contact', description: `Find El Jefe at ${R.street}, ${R.city}, ${R.region} ${R.zip}. Directions, hours, phone ${R.phone}, email and table reservations.`, path: '/visit/', active: 'visit', body, ogImage: 'el-regio' });
}

function notFound() {
  const body = `<div class="wrap" style="padding:96px var(--gutter);display:flex;flex-direction:column;gap:20px;align-items:flex-start">
  <span class="eyebrow">404</span><h1 class="display h1">¡Ay, caramba! Page not found.</h1>
  <p class="lead">That page isn't on the menu. Try one of these instead.</p>
  <div class="hero__ctas"><a class="btn btn--red" href="/menu/">View Menu</a><a class="btn btn--ghost" href="/">Go home</a></div>
</div>`;
  return layout({ title: 'Page not found', description: 'Page not found.', path: '/404.html', active: '', body });
}

// ---------- write ----------
async function out(path, html) {
  const file = join(DIST, path.endsWith('/') ? path + 'index.html' : path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, BASE ? html.replace(/(href|src)="\/(?!\/)/g, `$1="${BASE}/`) : html, 'utf8');
}

await rm(DIST, { recursive: true, force: true });
await cp(join(ROOT, 'public'), DIST, { recursive: true });
await out('/', homePage());
for (const p of menuPages) await out(p.path, menuPage(p));
await out('/visit/', visitPage());
await out('/404.html', notFound());
const urls = ['/', ...menuPages.map((p) => p.path), '/visit/'];
await writeFile(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);

const missing = allItems.filter((i) => !i.img).length;
console.log(`Built ${urls.length + 1} pages · ${allItems.length} menu items (${allItems.length - missing} with photos, ${missing} placeholders) → dist/`);
