const { esc, lines, eyebrow, btn } = require("../ui");

/** 404 page. Rendered once per language; the root 404.html is bilingual (ko first). */
exports.meta = ({ t }) => ({ title: t.notFound.title, description: t.notFound.lead, noindex: true });

exports.render = ({ t, base, other }) => {
  const n = t.notFound;
  return `
<section class="phero phero--notfound" data-theme="light" data-bg="#f4f3ef">
  <div class="container">
    ${eyebrow(n.eyebrow)}
    ${lines([n.heading[0], `<em>${n.heading[1]}</em>`], "h1", "phero__title")}
    <p class="phero__lead" data-reveal>${esc(n.lead)}</p>
    <div class="phero__actions" data-reveal>
      ${btn(base, n.home, { variant: "primary" })}
      ${btn(`${base}contact/`, n.contact, { variant: "ghost" })}
    </div>
    ${other ? `<p class="notfound__other" data-reveal><a href="${other.base}">${esc(other.label)}</a></p>` : ""}
  </div>
</section>
`;
};
