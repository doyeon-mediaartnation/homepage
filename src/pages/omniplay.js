const D = require("../data");
const { esc, lines, eyebrow, head, btn, img, ctaBand } = require("../ui");

exports.meta = ({ t }) => ({ title: t.meta.omniplay.title, description: t.meta.omniplay.description });

exports.render = ({ t, base }) => {
  const o = t.omniplay;
  return `
<section class="phero phero--blue phero--dark" data-theme="dark" data-bg="#0e0f13">
  <div class="phero__bg" data-parallax="0.25">${img(D.omniplay.concept, "OMNIPlay living-room concept", { w: 1672, h: 941, lazy: false })}</div>
  <div class="container phero__grid phero__grid--stack">
    <div class="phero__copy">
      <span class="badge" data-reveal>${esc(o.badge)}</span>
      ${eyebrow(o.eyebrow)}
      ${lines([o.title[0], `<em>${o.title[1]}</em>`], "h1", "phero__title")}
      <p class="phero__lead" data-reveal>${esc(o.lead)}</p>
      <div class="phero__actions" data-reveal>${btn(`${base}contact/?topic=omniplay`, o.cta, { variant: "primary" })}</div>
    </div>
  </div>
  <ul class="numbers" data-reveal>
    ${o.numbers
      .map(([n, l]) => `<li><span class="numbers__n" data-counter="${n}">${n}</span><span class="numbers__l">${esc(l)}</span></li>`)
      .join("")}
  </ul>
</section>

<section class="features" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${head({ eyebrow: o.featuresEyebrow, title: o.featuresTitle })}
    <div class="fgrid fgrid--3">
      ${o.features
        .map(
          ([title, desc], i) => `
      <div class="fcard fcard--blue" data-reveal>
        <span class="fcard__idx">0${i + 1}</span>
        <h3 class="fcard__title">${esc(title)}</h3>
        <p class="fcard__desc">${esc(desc)}</p>
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>

<section class="forwhom" data-theme="light" data-bg="#ffffff">
  <div class="container">
    ${head({ eyebrow: o.forEyebrow, title: o.forTitle, lead: o.forLead })}
    <div class="fgrid fgrid--3">
      ${o.forWhom
        .map(
          ([tag, title, desc], i) => `
      <div class="fcard fcard--blue fcard--media" data-reveal>
        <div class="fmedia fmedia--single">${img(D.omniplay.forWhom[i], title, { w: 559, h: 319, cls: "fmedia__img" })}</div>
        <span class="fcard__idx">${esc(tag)}</span>
        <h3 class="fcard__title">${esc(title)}</h3>
        <p class="fcard__desc">${esc(desc)}</p>
      </div>`
        )
        .join("")}
    </div>
    <p class="tech__note" data-reveal>${esc(o.forNote)}</p>
  </div>
</section>

<section class="games" data-theme="blue" data-bg="#3d5afe">
  <div class="container games__grid">
    <div>
      ${eyebrow(o.gamesEyebrow)}
      ${lines(o.gamesTitle.split("<br>"), "h2", "sec-title")}
      <p class="sec-lead" data-reveal>${esc(o.gamesNote)}</p>
    </div>
    <ul class="chips" data-reveal>
      ${o.games.map((g, i) => `<li class="chip"><span>0${i + 1}</span>${esc(g)}</li>`).join("")}
    </ul>
  </div>
  <div class="container">
    <ol class="cpath">
      ${o.contentPath
        .map(([k, title, desc]) => `<li class="cpath__item" data-reveal><span class="cpath__k">${esc(k)}</span><strong>${esc(title)}</strong><span>${esc(desc)}</span></li>`)
        .join("")}
    </ol>
  </div>
</section>

<section class="gallery" data-theme="dark" data-bg="#15161b">
  <div class="container">
    ${head({ eyebrow: o.galleryEyebrow, title: o.galleryTitle, lead: o.galleryNote })}
  </div>
  <div class="gallery__row" data-drag-scroll>
    ${D.omniplay.play
      .map((p) => {
        const name = p.game == null ? o.gallerySelect : o.games[p.game];
        return `<figure class="gallery__item" data-reveal>${img(p.src, `OMNIPlay · ${name}`, { w: p.w, h: p.h })}${
          p.cam ? `<span class="gallery__cam">${img(p.cam, "", { w: 194, h: 345 })}<i>CAM</i></span>` : ""
        }<figcaption class="gallery__tag">${esc(name)}</figcaption></figure>`;
      })
      .join("")}
  </div>
</section>

<section class="spec" data-theme="light" data-bg="#ffffff">
  <div class="container spec__grid">
    <figure class="spec__media" data-reveal>${img(D.omniplay.device, "OMNIPlay device", { w: 829, h: 679 })}</figure>
    <div>
      ${head({ eyebrow: o.specEyebrow, title: o.specTitle, lead: o.specLead })}
      <dl class="spec__list" data-reveal>
        ${o.spec.map(([k, v]) => `<div class="spec__row"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
      </dl>
      <p class="tech__note" data-reveal>${esc(o.techNote)}</p>
    </div>
  </div>
</section>

<section class="tech" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${head({ eyebrow: o.techEyebrow, title: o.techTitle })}
    <ul class="tech__list">
      ${o.tech
        .map(
          ([k, v], i) => `<li class="tech__row" data-reveal><span class="tech__idx">0${i + 1}</span><strong>${esc(k)}</strong><span>${esc(v)}</span><em class="tech__tag">in-house</em></li>`
        )
        .join("")}
    </ul>
    <p class="tech__note" data-reveal>${esc(o.techNote)}</p>
  </div>
</section>

<section class="timeline timeline--compact" data-theme="light" data-bg="#ffffff">
  <div class="container">
    ${head({ eyebrow: o.roadmapEyebrow, title: o.roadmapTitle })}
    <ol class="tl" data-timeline>
      <svg class="tl__line" viewBox="0 0 1000 2" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="1" x2="1000" y2="1"/></svg>
      ${o.roadmap
        .map(
          ([year, title, desc], i) => `
      <li class="tl__item${i === 1 ? " tl__item--accent" : ""}" data-reveal>
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

${ctaBand({ title: o.ctaTitle, lead: o.ctaLead, href: `${base}contact/?topic=omniplay`, label: o.ctaBtn, theme: "blue" })}
`;
};
