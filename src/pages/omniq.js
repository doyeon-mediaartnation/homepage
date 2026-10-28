const D = require("../data");
const { esc, lines, eyebrow, head, btn, img, ctaBand } = require("../ui");

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
      <div class="fcard fcard--coral" data-reveal>
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
