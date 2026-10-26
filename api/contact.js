/**
 * Contact form handler (Vercel Serverless Function, Node runtime).
 * POST /api/contact  { name, company, email, phone, topic, message, consent, lang, website }
 *
 * Sends the inquiry by email through Resend's REST API.
 * Environment variables (set in the Vercel project):
 *   RESEND_API_KEY  — required to send
 *   CONTACT_TO      — recipient (default admin@mediaartnation.studio)
 *   CONTACT_FROM    — verified sender (default "Media Art Nation <noreply@mediaartnation.com>")
 */
const TOPICS = {
  project: { ko: "프로젝트 의뢰", en: "Project brief" },
  omniq: { ko: "OMNIQ 테마 · IP 제휴", en: "OMNIQ theme · IP partnership" },
  omniplay: { ko: "OMNIPlay 출시 알림 · 유통", en: "OMNIPlay launch updates · distribution" },
  other: { ko: "기타", en: "Other" },
};
const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await new Promise((resolve) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => resolve(d));
  });
  const ct = req.headers["content-type"] || "";
  if (ct.includes("application/json")) return JSON.parse(raw || "{}");
  return Object.fromEntries(new URLSearchParams(raw));
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    return res.end(JSON.stringify({ error: "method_not_allowed" }));
  }
  let body;
  try {
    body = await readBody(req);
  } catch {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "bad_request" }));
  }

  // Honeypot: bots fill the hidden "website" field.
  if (body.website) {
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true }));
  }
  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 200);
  const message = String(body.message || "").trim().slice(0, 5000);
  const company = String(body.company || "").trim().slice(0, 200);
  const phone = String(body.phone || "").trim().slice(0, 60);
  const topic = TOPICS[body.topic] ? body.topic : "other";
  const lang = body.lang === "ko" ? "ko" : "en";
  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || body.consent !== "yes") {
    res.statusCode = 422;
    return res.end(JSON.stringify({ error: "validation" }));
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: "not_configured" }));
  }
  const to = process.env.CONTACT_TO || "admin@mediaartnation.studio";
  const from = process.env.CONTACT_FROM || "Media Art Nation <noreply@mediaartnation.com>";
  const subject = `[mediaartnation.com] ${TOPICS[topic][lang]} — ${name}${company ? ` (${company})` : ""}`;
  const text = [
    `Topic: ${TOPICS[topic].ko} / ${TOPICS[topic].en}`,
    `Name: ${name}`,
    `Company: ${company || "-"}`,
    `Email: ${email}`,
    `Phone: ${phone || "-"}`,
    `Language: ${lang}`,
    ``,
    message,
  ].join("\n");
  const html = `<p><b>Topic:</b> ${esc(TOPICS[topic].ko)} / ${esc(TOPICS[topic].en)}<br><b>Name:</b> ${esc(name)}<br><b>Company:</b> ${esc(company || "-")}<br><b>Email:</b> ${esc(email)}<br><b>Phone:</b> ${esc(phone || "-")}<br><b>Language:</b> ${lang}</p><pre style="font:inherit;white-space:pre-wrap">${esc(message)}</pre>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, text, html }),
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error("resend error", r.status, detail);
      res.statusCode = 502;
      return res.end(JSON.stringify({ error: "send_failed" }));
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error(err);
    res.statusCode = 502;
    return res.end(JSON.stringify({ error: "send_failed" }));
  }
};
