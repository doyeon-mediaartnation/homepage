#!/usr/bin/env node
/**
 * Static site generator for the Media Art Nation v1 site.
 * Renders every page in src/pages for each language into /ko and /en,
 * plus the root fallback page and sitemap.xml.
 *
 *   node scripts/build.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://www.mediaartnation.com";
const LANGS = ["ko", "en"];

const layout = require("../src/layout");
const pages = {
  "": require("../src/pages/home"),
  omniq: require("../src/pages/omniq"),
  omniplay: require("../src/pages/omniplay"),
  studio: require("../src/pages/studio"),
  work: require("../src/pages/work"),
  contact: require("../src/pages/contact"),
};
const i18n = { ko: require("../src/i18n/ko"), en: require("../src/i18n/en") };

function write(rel, html) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log("wrote", rel, (html.length / 1024).toFixed(1) + "KB");
}

const today = new Date().toISOString().slice(0, 10);
const urls = [];

for (const lang of LANGS) {
  const t = i18n[lang];
  for (const [slug, page] of Object.entries(pages)) {
    const base = `/${lang}/`;
    const urlPath = slug ? `${base}${slug}/` : base;
    const ctx = {
      lang,
      t,
      slug: slug || "home",
      base,
      url: SITE + urlPath,
      site: SITE,
      alt: Object.fromEntries(LANGS.map((l) => [l, SITE + (slug ? `/${l}/${slug}/` : `/${l}/`)])),
    };
    const meta = page.meta(ctx);
    const html = layout({ ...ctx, ...meta, body: page.render(ctx) });
    write(slug ? `${lang}/${slug}/index.html` : `${lang}/index.html`, html);
    urls.push({ loc: SITE + urlPath, slug, lang });
  }
}

// 404: Vercel serves /404.html for any missing path on a static deployment.
{
  const notfound = require("../src/pages/notfound");
  const render404 = (lang, otherLang, file) => {
    const t = i18n[lang];
    const ctx = { lang, t, slug: "404", base: `/${lang}/`, url: `${SITE}/404.html`, site: SITE,
      alt: { ko: `${SITE}/404.html`, en: `${SITE}/404.html` },
      other: { base: `/${otherLang}/`, label: otherLang === "en" ? "English" : "한국어" } };
    const meta = notfound.meta(ctx);
    write(file, layout({ ...ctx, ...meta, body: notfound.render(ctx) }));
  };
  render404("ko", "en", "404.html");
  render404("en", "ko", "en/404/index.html");
}

// Root fallback: Vercel redirects "/" by country/cookie before this is served.
// Keep a tiny page for local previews and non-Vercel hosts.
write(
  "index.html",
  `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>미디어아트네이션 | Media Art Nation</title>
<meta name="robots" content="noindex">
<link rel="alternate" hreflang="ko" href="${SITE}/ko/">
<link rel="alternate" hreflang="en" href="${SITE}/en/">
<link rel="alternate" hreflang="x-default" href="${SITE}/en/">
<link rel="icon" href="/favicon.ico">
<script>
(function(){try{var m=document.cookie.match(/(?:^|; )lang=(ko|en)/);var l=m?m[1]:((navigator.language||"").toLowerCase().indexOf("ko")===0?"ko":"en");location.replace(l+"/");}catch(e){location.replace("en/");}})();
</script>
<style>body{margin:0;background:#f4f3ef;color:#15161b;font-family:"Pretendard Variable",Pretendard,-apple-system,system-ui,sans-serif;display:grid;place-items:center;min-height:100vh}.box{text-align:center}img{width:150px;margin:0 auto 28px}p{margin:0 0 18px;color:#55534e;font-size:14px}a{display:inline-block;margin:0 6px;padding:12px 22px;border-radius:999px;background:#15161b;color:#fff;text-decoration:none;font-weight:700;font-size:15px}a.alt{background:transparent;color:#15161b;border:1.5px solid #15161b}</style>
</head>
<body><div class="box"><img src="assets/img/logo-dark.png" alt="Media Art Nation"><p>언어를 선택하세요 · Choose your language</p><a href="ko/">한국어</a><a class="alt" href="en/">English</a></div></body>
</html>
`
);

// Sitemap with hreflang pairs
const extra = [
  { loc: `${SITE}/policy/privacy/`, prio: "0.3" },
  { loc: `${SITE}/policy/terms/`, prio: "0.3" },
];
const prio = (slug) => (slug === "" ? "1.0" : ["omniq", "omniplay"].includes(slug) ? "0.9" : "0.7");
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...urls.map((u) => {
    const alts = LANGS.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${u.slug ? `/${l}/${u.slug}/` : `/${l}/`}"/>`
    ).join("\n");
    const xd = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${u.slug ? `/en/${u.slug}/` : `/en/`}"/>`;
    return `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${prio(u.slug)}</priority>\n${alts}\n${xd}\n  </url>`;
  }),
  ...extra.map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${e.prio}</priority>\n  </url>`),
  "</urlset>",
  "",
].join("\n");
write("sitemap.xml", xml);
