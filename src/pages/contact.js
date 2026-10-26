const D = require("../data");
const { esc, lines, eyebrow, head, btn, img } = require("../ui");

exports.meta = ({ t }) => ({ title: t.meta.contact.title, description: t.meta.contact.description });

exports.render = ({ t, base, lang }) => {
  const c = t.contact;
  const f = c.form;
  const field = (name, label, type = "text", required = true, extra = "") => `
      <div class="field">
        <label for="f-${name}">${esc(label)}${required ? " <i>*</i>" : ""}</label>
        <input id="f-${name}" name="${name}" type="${type}"${required ? " required" : ""} ${extra} autocomplete="${
    name === "email" ? "email" : name === "phone" ? "tel" : name === "name" ? "name" : "organization"
  }">
      </div>`;

  return `
<section class="contact" data-theme="light" data-bg="#f4f3ef">
  <div class="container contact__grid">
    <div class="contact__copy">
      ${eyebrow(c.eyebrow)}
      ${lines([c.title[0], `<em>${c.title[1]}</em>`], "h1", "phero__title")}
      <p class="phero__lead" data-reveal>${esc(c.lead)}</p>

      <div class="info" data-reveal>
        <h2 class="info__title">${esc(c.infoTitle)}</h2>
        <p class="info__addr">${esc(c.address)}<br><small>${esc(c.addressEn)}</small></p>
        <a class="info__map" href="${D.mapUrl}" target="_blank" rel="noopener">${esc(c.map)}<i class="btn__arrow"></i></a>
        <dl class="info__rows">
          <div><dt>${esc(c.emailLabel)}</dt><dd><a href="mailto:admin@mediaartnation.studio">admin@mediaartnation.studio</a></dd></div>
          <div><dt>${esc(c.phoneLabel)}</dt><dd><a href="tel:+821090621104">+82 10-9062-1104</a></dd></div>
          <div><dt>Hours</dt><dd>${esc(c.hours)}</dd></div>
        </dl>
      </div>
    </div>

    <form class="form" data-form action="/api/contact" method="post" novalidate data-reveal>
      <input type="hidden" name="lang" value="${lang}">
      <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="form__row">
        ${field("name", f.name)}
        ${field("company", f.company, "text", false)}
      </div>
      <div class="form__row">
        ${field("email", f.email, "email")}
        ${field("phone", f.phone, "tel", false)}
      </div>
      <div class="field">
        <label for="f-topic">${esc(f.topic)} <i>*</i></label>
        <div class="select">
          <select id="f-topic" name="topic" required>
            ${f.topics.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="field">
        <label for="f-message">${esc(f.message)} <i>*</i></label>
        <textarea id="f-message" name="message" rows="6" required placeholder="${esc(f.messagePh)}"></textarea>
      </div>
      <label class="check">
        <input type="checkbox" name="consent" value="yes" required>
        <span>${esc(f.consent)} <a href="/policy/privacy/" target="_blank" rel="noopener">${esc(f.consentLink)}</a></span>
      </label>
      <div class="form__foot">
        <button class="btn btn--primary" type="submit" data-magnetic><span data-label="${esc(f.submit)}" data-sending="${esc(f.sending)}">${esc(f.submit)}</span><i class="btn__arrow" aria-hidden="true"></i></button>
        <p class="form__msg" role="status" aria-live="polite" data-success="${esc(f.success)}" data-error="${esc(f.error)}" data-required="${esc(f.required)}"></p>
      </div>
    </form>
  </div>
</section>
`;
};
