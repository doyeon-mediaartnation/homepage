const D = require("../data");
const { esc, lines, eyebrow, head, btn, img, ctaBand } = require("../ui");

/** Image box on top of a feature card: one picture, a 2x2 mosaic, a side-by-side pair, or a small
    composed phone scene (`live`: the camera view wiping into the styled result; `share`: a finished
    clip with the saved-to-device toast and share actions). */
const ICON = {
  save: '<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14"/>',
  share: '<path d="M12 15V4m0 0L8 8m4-4 4 4M7 11H5.5v8.5h13V11H17"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};
const icon = (k) =>
  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

const featureMedia = (m, title, o) => {
  if (!m) return "";
  const [first, second] = m.items;
  const pic = ([src, w, h, pos], alt, cls) =>
    img(src, alt, { w, h, cls, attrs: `style="object-position:${pos}"` });
  if (m.kind === "live")
    return `<div class="fmedia fmedia--screen fmedia--live"><div class="fphone">
      ${pic(second, title, "fphone__img")}
      <div class="fphone__before">${pic(first, "", "fphone__img")}</div>
      <span class="fphone__scan" aria-hidden="true"></span>
      <span class="fphone__rec" aria-hidden="true"><i></i>${esc(o.featureScene.rec)}</span>
    </div></div>`;
  if (m.kind === "share")
    return `<div class="fmedia fmedia--screen fmedia--share"><div class="fphone">
      ${pic(first, title, "fphone__img")}
      <span class="fphone__toast" aria-hidden="true"><b>&#10003;</b>${esc(o.featureScene.saved)}</span>
      <span class="fphone__bar" aria-hidden="true">${["save", "share", "link"].map((k) => `<i>${icon(k)}</i>`).join("")}</span>
    </div></div>`;
  return `<div class="fmedia fmedia--${m.kind}">${m.items
    .map((it, k) => pic(it, k === 0 ? title : "", "fmedia__img"))
    .join("")}</div>`;
};

exports.meta = ({ t, site, lang }) => ({
  title: t.meta.omniq.title,
  description: t.meta.omniq.description,
  jsonld: [
    {
      "@type": "FAQPage",
      mainEntity: t.omniq.faq.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
});

exports.render = ({ t, base }) => {
  const o = t.omniq;
  return `
<section class="phero phero--coral" data-theme="light" data-bg="#f4f3ef">
  <div class="container phero__grid">
    <div class="phero__copy">
      ${eyebrow(o.eyebrow)}
      ${lines([o.title[0], `<em>${o.title[1]}</em>`], "h1", "phero__title")}
      <p class="phero__lead" data-reveal>${esc(o.lead)}</p>
      <div class="phero__actions" data-reveal>
        <a class="store" href="${D.stores.appstore}" target="_blank" rel="noopener" data-magnetic><i class="store__ico store__ico--apple"></i><span><small>Download on the</small>${esc(o.stores[0])}</span></a>
        <a class="store" href="${D.stores.play}" target="_blank" rel="noopener" data-magnetic><i class="store__ico store__ico--play"></i><span><small>Get it on</small>${esc(o.stores[1])}</span></a>
      </div>
      <p class="phero__note" data-reveal>${esc(o.storeNote)}</p>
    </div>
    <div class="phero__media" data-reveal>
      <div class="phone phone--lg" data-parallax="0.12"><div class="phone__screen">${img(D.omniq.screen, "OMNIQ app screen", { w: 946, h: 2048, lazy: false, cls: "phone__img" })}</div></div>
      <div class="phone phone--sm" data-parallax="-0.08"><div class="phone__screen">${img(D.omniq.screenLogin, "OMNIQ sign-in screen", { w: 946, h: 2048, cls: "phone__img" })}</div></div>
      <img class="phero__mark" src="${D.omniq.mark}" alt="" width="512" height="512" loading="lazy" data-parallax="0.2">
    </div>
  </div>
</section>

<section class="compare-sec" data-theme="dark" data-bg="#15161b">
  <div class="container">
    ${head({ eyebrow: o.compareEyebrow, title: o.compareTitle, lead: o.compareLead, align: "center" })}
    <div class="compare" data-compare data-reveal>
      <div class="compare__after">${img(D.omniq.result, "OMNIQ result", { w: 722, h: 1278 })}<span class="compare__label compare__label--after">${esc(o.compareLabels[1])}</span></div>
      <div class="compare__before">${img(D.omniq.original, "Original", { w: 1200, h: 1600 })}<span class="compare__label">${esc(o.compareLabels[0])}</span></div>
      <div class="compare__handle" role="slider" aria-label="Compare" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0"><span></span></div>
    </div>
  </div>
</section>

<section class="features" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${head({ eyebrow: o.featuresEyebrow, title: o.featuresTitle })}
    <div class="fgrid fgrid--4">
      ${o.features
        .map(
          ([title, desc], i) => `
      <div class="fcard fcard--coral fcard--media" data-reveal>
        ${featureMedia(D.omniq.featureMedia[i], title, o)}
        <span class="fcard__idx">0${i + 1}</span>
        <h3 class="fcard__title">${esc(title)}</h3>
        <p class="fcard__desc">${esc(desc)}</p>
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>

<section class="steps" data-theme="light" data-bg="#ffffff">
  <div class="container">
    ${head({ eyebrow: o.howEyebrow, title: o.howTitle })}
    <ol class="sgrid">
      ${o.steps
        .map(
          ([title, desc], i) => `
      <li class="step" data-reveal>
        <span class="step__num">${i + 1}</span>
        <h3 class="step__title">${esc(title)}</h3>
        <p class="step__desc">${esc(desc)}</p>
      </li>`
        )
        .join("")}
    </ol>
  </div>
</section>

<section class="tokens" data-theme="coral" data-bg="#ff5c39">
  <div class="container tokens__grid">
    <div>
      ${eyebrow(o.tokenEyebrow)}
      ${lines(o.tokenTitle.split("<br>"), "h2", "sec-title")}
      <p class="sec-lead" data-reveal>${esc(o.tokenLead)}</p>
    </div>
    <ul class="tokens__list" data-reveal>
      ${o.tokenPoints.map((p) => `<li>${esc(p)}</li>`).join("")}
    </ul>
  </div>
</section>

<section class="privacy" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${head({ eyebrow: o.privacyEyebrow, title: o.privacyTitle })}
    <div class="fgrid fgrid--3">
      ${o.privacy
        .map(
          ([title, desc]) => `
      <div class="trust" data-reveal>
        <h3 class="trust__title">${esc(title)}</h3>
        <p class="trust__desc">${esc(desc)}</p>
      </div>`
        )
        .join("")}
    </div>
    <p class="privacy__links" data-reveal><a href="/policy/privacy/">${esc(o.privacyLinks[0])}</a> · <a href="/policy/terms/">${esc(o.privacyLinks[1])}</a></p>
  </div>
</section>

<section class="faq" data-theme="light" data-bg="#ffffff">
  <div class="container faq__grid">
    ${head({ eyebrow: o.faqEyebrow, title: o.faqTitle })}
    <div class="faq__list" data-reveal>
      ${o.faq
        .map(
          ([q, a], i) => `
      <details class="faq__item"${i === 0 ? " open" : ""}>
        <summary>${esc(q)}</summary>
        <p>${esc(a)}</p>
      </details>`
        )
        .join("")}
    </div>
  </div>
</section>

${ctaBand({ title: o.ctaTitle, href: `${base}contact/?topic=omniq`, label: o.ctaBtn, theme: "dark" })}
`;
};
