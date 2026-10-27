/** Small markup helpers shared by page modules. */
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Headline whose lines reveal one by one. Accepts an array of lines (HTML allowed). */
const lines = (arr, tag = "h1", cls = "") =>
  `<${tag} class="${cls}" data-reveal="lines">${arr
    .map((l) => `<span class="line"><span class="line__inner">${l}</span></span>`)
    .join("")}</${tag}>`;

const eyebrow = (text, cls = "") => `<p class="eyebrow ${cls}" data-reveal>${esc(text)}</p>`;

/** Section header: eyebrow + title (+ lead). Title may contain HTML. */
const head = ({ eyebrow: e, title, lead, align = "left", tag = "h2" }) => `
  <div class="sec-head sec-head--${align}">
    ${e ? eyebrow(e) : ""}
    <${tag} class="sec-title" data-reveal="lines">${title
      .split("<br>")
      .map((l) => `<span class="line"><span class="line__inner">${l}</span></span>`)
      .join("")}</${tag}>
    ${lead ? `<p class="sec-lead" data-reveal>${lead}</p>` : ""}
  </div>`;

const btn = (href, label, { variant = "primary", attrs = "" } = {}) =>
  `<a class="btn btn--${variant}" href="${href}" data-magnetic ${attrs}><span>${esc(label)}</span><i class="btn__arrow" aria-hidden="true"></i></a>`;

const img = (src, alt, { w, h, cls = "", lazy = true, attrs = "" } = {}) =>
  `<img src="${src}" alt="${esc(alt)}"${w ? ` width="${w}"` : ""}${h ? ` height="${h}"` : ""}${
    lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high" decoding="async"'
  } class="${cls}" ${attrs}>`;

/** Full-width call-to-action band: dark on corporate pages, product colour on product pages. */
const ctaBand = ({ title, lead, href, label, theme = "coral" }) => `
<section class="cta-band" data-theme="${theme}" data-bg="${theme === "coral" ? "#ff5c39" : theme === "blue" ? "#3d5afe" : "#15161b"}">
  <div class="container cta-band__inner">
    <h2 class="cta-band__title" data-reveal="lines">${title
      .split("<br>")
      .map((l) => `<span class="line"><span class="line__inner">${l}</span></span>`)
      .join("")}</h2>
    <div class="cta-band__side" data-reveal>
      ${lead ? `<p class="cta-band__lead">${lead}</p>` : ""}
      ${btn(href, label, { variant: "inverse" })}
    </div>
  </div>
</section>`;

module.exports = { esc, lines, eyebrow, head, btn, img, ctaBand };
