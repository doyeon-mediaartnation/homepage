const D = require("../data");
const { esc, lines, eyebrow, head, btn, img, ctaBand } = require("../ui");

exports.meta = ({ t }) => ({ title: t.meta.work.title, description: t.meta.work.description });

exports.render = ({ t, base }) => {
  const w = t.work;
  return `
<section class="phero phero--work" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${eyebrow(w.eyebrow)}
    ${lines([w.title[0], `<em>${w.title[1]}</em>`], "h1", "phero__title")}
    <p class="phero__lead" data-reveal>${esc(w.lead)}</p>
  </div>
</section>

<section class="workgrid" data-theme="light" data-bg="#ffffff">
  <div class="container">
    <div class="filters" data-filter-bar data-reveal role="tablist">
      ${w.filters
        .map(
          ([key, label], i) =>
            `<button class="filter${i === 0 ? " is-active" : ""}" type="button" role="tab" aria-selected="${i === 0}" data-filter="${key}">${esc(label)}</button>`
        )
        .join("")}
    </div>
    <div class="wgrid" data-filter-grid>
      ${D.work
        .map(
          (item, i) => `
      <figure class="witem witem--${item.cat}${item.cat === "clients" ? " witem--wide" : ""}" data-cat="${item.cat}" data-lightbox="${item.img}" data-reveal>
        ${img(item.img, item.title || `${w.categories[item.cat]} ${i + 1}`, { w: item.w, h: item.h })}
        <figcaption><span>${esc(w.categories[item.cat])}</span>${item.title ? `<strong>${esc(item.title)}</strong>` : ""}</figcaption>
      </figure>`
        )
        .join("")}
    </div>
    <p class="workgrid__note" data-reveal>${esc(w.note)}</p>
  </div>
</section>

<div class="lightbox" data-lightbox-root aria-hidden="true">
  <button class="lightbox__close" type="button" aria-label="Close"></button>
  <img class="lightbox__img" src="" alt="">
</div>

${ctaBand({ title: w.ctaTitle, href: `${base}contact/?topic=project`, label: w.ctaBtn, theme: "dark" })}
`;
};
