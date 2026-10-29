const D = require("../data");
const { esc, lines, eyebrow, head, btn, img, ctaBand } = require("../ui");

exports.meta = ({ t }) => ({ title: t.meta.home.title, description: t.meta.home.description });

exports.render = ({ t, base, lang }) => {
  const h = t.home;
  const titleLines = [h.heroTitle[0], `<em>${h.heroTitle[1]}</em>`];

  return `
<!-- ================= HERO ================= -->
<section class="hero" data-theme="light" data-bg="#f4f3ef">
  <canvas class="hero__canvas" data-hero-canvas aria-hidden="true"></canvas>
  <div class="container hero__inner">
    ${eyebrow(h.heroEyebrow)}
    ${lines(titleLines, "h1", "hero__title")}
    <p class="hero__lead" data-reveal>${esc(h.heroLead)}</p>
    <div class="hero__actions" data-reveal>
      ${btn(`${base}omniq/`, h.heroCta1, { variant: "primary" })}
      ${btn(`${base}omniplay/`, h.heroCta2, { variant: "ghost" })}
    </div>
  </div>
  <div class="hero__scroll" aria-hidden="true"><span>${esc(h.heroScroll)}</span><i></i></div>
  <div class="hero__brand" aria-hidden="true">
    <span>미디어아트네이션</span><span>Media Art Nation</span><span>OMNIQ</span><span>OMNIPlay</span>
  </div>
</section>

<!-- ================= STATEMENT ================= -->
<section class="statement" data-theme="dark" data-bg="#15161b">
  <div class="container">
    ${eyebrow(h.statementEyebrow)}
    <p class="statement__text" data-words>${h.statement}</p>
    <ul class="stats" data-reveal>
      ${h.stats
        .map(
          ([n, l]) => `<li class="stat"><span class="stat__num" data-counter="${esc(n)}">${esc(n)}</span><span class="stat__label">${esc(l)}</span></li>`
        )
        .join("")}
    </ul>
  </div>
</section>

<!-- ================= PRODUCTS ================= -->
<section class="products" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${head({ eyebrow: h.productsEyebrow, title: h.productsTitle, lead: h.productsLead })}
    <div class="pgrid">
      <a class="pcard pcard--coral" href="${base}omniq/" data-tilt data-reveal>
        <div class="pcard__media">
          <div class="phone"><div class="phone__screen">${img(D.omniq.screen, "OMNIQ app", { w: 946, h: 2048, cls: "phone__img" })}</div></div>
          <img class="pcard__float" src="${D.omniq.fourUp}" alt="" loading="lazy" width="690" height="485">
        </div>
        <div class="pcard__body">
          <span class="pcard__tag">${esc(h.omniq.tag)}</span>
          <h3 class="pcard__title">${esc(h.omniq.title)}<span class="pcard__ko">옴닉</span></h3>
          <p class="pcard__sub">${esc(h.omniq.sub)}</p>
          <p class="pcard__desc">${esc(h.omniq.desc)}</p>
          <ul class="pcard__points">${h.omniq.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          <span class="pcard__cta">${esc(h.omniq.cta)}<i class="btn__arrow"></i></span>
        </div>
      </a>
      <a class="pcard pcard--blue" href="${base}omniplay/" data-tilt data-reveal>
        <div class="pcard__media">
          ${img(D.omniplay.concept, "OMNIPlay concept", { w: 1672, h: 941, cls: "pcard__img" })}
          <div class="pcard__tv" aria-hidden="true"><span>4P</span></div>
        </div>
        <div class="pcard__body">
          <span class="pcard__tag">${esc(h.omniplay.tag)}</span>
          <h3 class="pcard__title">${esc(h.omniplay.title)}<span class="pcard__ko">옴니플레이</span></h3>
          <p class="pcard__sub">${esc(h.omniplay.sub)}</p>
          <p class="pcard__desc">${esc(h.omniplay.desc)}</p>
          <ul class="pcard__points">${h.omniplay.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          <span class="pcard__cta">${esc(h.omniplay.cta)}<i class="btn__arrow"></i></span>
        </div>
      </a>
    </div>
  </div>
</section>

<!-- ================= CAPABILITIES ================= -->
<section class="caps" data-theme="light" data-bg="#ffffff">
  <div class="container">
    ${head({ eyebrow: h.capEyebrow, title: h.capTitle, lead: h.capLead })}
    <div class="caps__layout">
      <div class="caps__visual" data-reveal>
        <div class="caps__stage">
          ${h.caps
            .map(
              ([title, , key], i) =>
                `<img class="caps__img${i === 0 ? " is-active" : ""}" data-cap-img="${key}" src="${D.capImages[key]}" alt="${esc(title)}" width="675" height="350" loading="lazy">`
            )
            .join("")}
          <svg class="caps__venn" viewBox="0 0 400 320" aria-hidden="true">
            <circle class="venn venn--1" cx="150" cy="130" r="110"/>
            <circle class="venn venn--2" cx="250" cy="130" r="110"/>
            <circle class="venn venn--3" cx="200" cy="210" r="110"/>
            <text x="92" y="100">Design</text>
            <text x="262" y="100">Engine</text>
            <text x="158" y="292">Vision AI</text>
          </svg>
        </div>
      </div>
      <ol class="caps__list">
        ${h.caps
          .map(
            ([title, desc, key], i) => `
        <li data-reveal><a class="cap" href="${base}work/#${key}" data-cap="${key}">
          <span class="cap__idx">0${i + 1}</span>
          <span class="cap__body"><span class="cap__title" role="heading" aria-level="3">${esc(title)}</span><span class="cap__desc">${esc(desc)}</span></span>
          <span class="cap__link" aria-hidden="true"><i class="btn__arrow"></i></span>
        </a></li>`
          )
          .join("")}
      </ol>
    </div>
    <div class="caps__more" data-reveal>${btn(`${base}work/`, h.capCta, { variant: "ghost" })}</div>
  </div>
</section>

<!-- ================= TRACK RECORD ================= -->
<section class="track" data-theme="dark" data-bg="#0e0f13" data-pin-track>
  <div class="track__head container">
    ${head({ eyebrow: h.trackEyebrow, title: h.trackTitle, lead: h.trackLead })}
  </div>
  <div class="track__viewport">
    <div class="track__inner">
      ${D.clients
        .map(
          (c, i) => `
      <figure class="tcard">
        ${img(c.img, c.name, { w: 1600, h: 800, cls: "tcard__img" })}
        <figcaption><span class="tcard__idx">0${i + 1}</span><span class="tcard__name">${esc(c.name)}</span></figcaption>
      </figure>`
        )
        .join("")}
      <a class="tcard tcard--more" href="${base}work/"><span>${esc(h.capCta)}</span><i class="btn__arrow"></i></a>
    </div>
  </div>
</section>

<!-- ================= TIMELINE ================= -->
<section class="timeline" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${head({ eyebrow: h.timelineEyebrow, title: h.timelineTitle })}
    <ol class="tl" data-timeline>
      <svg class="tl__line" viewBox="0 0 1000 2" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="1" x2="1000" y2="1"/></svg>
      ${h.timeline
        .map(
          ([year, title, desc], i) => `
      <li class="tl__item${i === 2 ? " tl__item--coral" : i >= 3 ? " tl__item--blue" : ""}" data-reveal>
        <span class="tl__dot"></span>
        <span class="tl__year">${esc(year)}</span>
        <strong class="tl__title">${esc(title)}</strong>
        <span class="tl__desc">${esc(desc)}</span>
      </li>`
        )
        .join("")}
    </ol>
  </div>
</section>

<section class="docs" id="documents" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${head({ eyebrow: t.docs.docsEyebrow, title: t.docs.docsTitle, lead: t.docs.docsLead })}
    <div class="dgrid">
      ${D.docs
        .map((d) => {
          const [kind, title, desc] = t.docs.docs[d.key];
          return `
      <a class="doc" href="${d.file}" download data-reveal data-cursor>
        <span class="doc__kind">${esc(kind)}</span>
        <span class="doc__title">${esc(title)}</span>
        <span class="doc__desc">${esc(desc)}</span>
        <span class="doc__foot"><span class="doc__meta">PDF · ${d.pages}p · ${d.size}</span><span class="doc__dl">${esc(t.docs.docsDownload)}<i class="btn__arrow" aria-hidden="true"></i></span></span>
      </a>`;
        })
        .join("")}
    </div>
  </div>
</section>

${ctaBand({ title: h.ctaTitle, lead: h.ctaLead, href: `${base}contact/`, label: h.ctaBtn, theme: "dark" })}
`;
};
