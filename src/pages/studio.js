const D = require("../data");
const { esc, lines, eyebrow, head, btn, img, ctaBand } = require("../ui");

exports.meta = ({ t }) => ({ title: t.meta.studio.title, description: t.meta.studio.description });

const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

exports.render = ({ t, base, lang }) => {
  const s = t.studio;
  const capKeys = ["metahuman", "simulation", "animation", "configurator"];
  return `
<section class="phero phero--studio" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${eyebrow(s.eyebrow)}
    ${lines([s.title[0], `<em>${s.title[1]}</em>`], "h1", "phero__title")}
    <p class="phero__lead" data-reveal>${esc(s.lead)}</p>
    <ul class="facts" data-reveal>
      ${s.facts.map(([k, v]) => `<li><span class="facts__k">${esc(k)}</span><span class="facts__v">${esc(v)}</span></li>`).join("")}
    </ul>
  </div>
</section>

<section class="services" data-theme="light" data-bg="#ffffff">
  <div class="container">
    ${head({ eyebrow: s.servicesEyebrow, title: s.servicesTitle })}
    <div class="svc-list">
      ${s.services
        .map(
          ([title, desc], i) => `
      <article class="svc${i % 2 ? " svc--flip" : ""}" id="${capKeys[i]}" data-reveal>
        <div class="svc__media" data-parallax="0.08">${img(D.capImagesWide[capKeys[i]], title, { w: 1200, h: 675 })}</div>
        <div class="svc__body">
          <span class="svc__idx">0${i + 1}</span>
          <h3 class="svc__title">${esc(title)}</h3>
          <p class="svc__desc">${esc(desc)}</p>
          <a class="svc__link" href="${base}work/#${capKeys[i]}">${esc(t.nav.work)}<i class="btn__arrow"></i></a>
        </div>
      </article>`
        )
        .join("")}
    </div>
  </div>
</section>

<section class="moat" data-theme="dark" data-bg="#15161b">
  <div class="container">
    ${head({ eyebrow: s.moatEyebrow, title: s.moatTitle })}
    <ul class="moat__list">
      ${s.moat
        .map(([k, v], i) => `<li data-reveal><span class="moat__idx">0${i + 1}</span><strong>${esc(k)}</strong><em>${esc(v)}</em></li>`)
        .join("")}
    </ul>
  </div>
</section>

<section class="leaders" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${head({ eyebrow: s.leadersEyebrow, title: s.leadersTitle })}
    <div class="lgrid">
      ${s.leaders
        .map(
          ([name, alt, role, bullets], i) => `
      <article class="leader" data-reveal data-tilt>
        <div class="leader__avatar leader__avatar--${i + 1}"><span>${initials(alt && lang === "ko" ? alt : name)}</span></div>
        <span class="leader__role">${esc(role)}</span>
        <h3 class="leader__name">${esc(name)}${alt ? ` <small>${esc(alt)}</small>` : ""}</h3>
        <ul class="leader__bio">${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      </article>`
        )
        .join("")}
    </div>
    <div class="team" data-reveal>
      ${eyebrow(s.teamEyebrow)}
      <h3 class="team__title">${esc(s.teamTitle)}</h3>
      <ul class="team__list">
        ${s.team.map(([k, v]) => `<li><strong>${esc(k)}</strong><span>${esc(v)}</span></li>`).join("")}
      </ul>
    </div>
  </div>
</section>

<section class="clients" data-theme="light" data-bg="#ffffff">
  <div class="container">
    ${eyebrow("Clients & partners")}
    <div class="marquee" data-marquee aria-label="Clients">
      <div class="marquee__track">
        ${[...D.clients, ...D.clients].map((c) => `<span class="marquee__item">${esc(c.name)}</span>`).join("")}
      </div>
    </div>
    <ul class="programs" data-reveal>
      ${eyebrow(s.programsEyebrow)}
      ${s.programs.map(([k, v]) => `<li><strong>${esc(k)}</strong><span>${esc(v)}</span></li>`).join("")}
    </ul>
  </div>
</section>

${ctaBand({ title: s.ctaTitle, href: `${base}contact/`, label: s.ctaBtn, theme: "dark" })}
`;
};
