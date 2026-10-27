/**
 * Contact form handler (Vercel Serverless Function, Node runtime).
 * POST /api/contact  { name, company, email, phone, topic, message, consent, lang, website }
 *
 * Sends the inquiry by email through Azure Communication Services (Email),
 * calling the REST API directly with HMAC-SHA256 auth — no npm dependencies.
 *
 * Environment variables (Vercel project → Settings → Environment Variables):
 *   ACS_CONNECTION_STRING  — "endpoint=https://<name>.<region>.communication.azure.com/;accesskey=<key>"
 *   ACS_SENDER             — verified sender, e.g. "DoNotReply@<guid>.azurecomm.net" or "noreply@mediaartnation.com"
 *   CONTACT_TO             — recipient(s), comma-separated, up to 10 (default contact@mediaartnation.studio)
 *
 * Optional fallback if ACS is not configured:
 *   RESEND_API_KEY, CONTACT_FROM — send through Resend instead.
 */
const crypto = require("crypto");

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

/* ---------- Azure Communication Services: Email REST API ---------- */
function parseConnectionString(cs) {
  const parts = Object.fromEntries(
    cs.split(";").filter(Boolean).map((kv) => {
      const i = kv.indexOf("=");
      return [kv.slice(0, i).trim().toLowerCase(), kv.slice(i + 1).trim()];
    })
  );
  if (!parts.endpoint || !parts.accesskey) throw new Error("ACS_CONNECTION_STRING is malformed");
  return { endpoint: parts.endpoint.replace(/\/+$/, ""), accessKey: parts.accesskey };
}

/** Sign a request the way ACS expects: HMAC-SHA256 over "VERB\npath?query\ndate;host;content-sha256". */
function acsHeaders({ endpoint, accessKey }, method, pathWithQuery, body) {
  const url = new URL(endpoint);
  const date = new Date().toUTCString();
  const contentHash = crypto.createHash("sha256").update(body, "utf8").digest("base64");
  const stringToSign = `${method}\n${pathWithQuery}\n${date};${url.host};${contentHash}`;
  const signature = crypto.createHmac("sha256", Buffer.from(accessKey, "base64")).update(stringToSign, "utf8").digest("base64");
  return {
    "Content-Type": "application/json",
    "x-ms-date": date,
    "x-ms-content-sha256": contentHash,
    Authorization: `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}`,
  };
}

async function sendViaAcs({ to, from, replyTo, subject, text, html }) {
  const conn = parseConnectionString(process.env.ACS_CONNECTION_STRING);
  const pathWithQuery = "/emails:send?api-version=2023-03-31";
  const body = JSON.stringify({
    senderAddress: from,
    recipients: { to: to.map((address) => ({ address })) },
    replyTo: [{ address: replyTo }],
    content: { subject, plainText: text, html },
    userEngagementTrackingDisabled: true,
  });
  const r = await fetch(conn.endpoint + pathWithQuery, {
    method: "POST",
    headers: acsHeaders(conn, "POST", pathWithQuery, body),
    body,
  });
  if (r.status !== 202) {
    const detail = await r.text();
    throw new Error(`acs ${r.status} ${detail.slice(0, 500)}`);
  }
  return r.headers.get("operation-id") || r.headers.get("x-ms-request-id") || "accepted";
}

/* ---------- Resend fallback ---------- */
async function sendViaResend({ to, from, replyTo, subject, text, html }) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, reply_to: replyTo, subject, text, html }),
  });
  if (!r.ok) throw new Error(`resend ${r.status} ${(await r.text()).slice(0, 500)}`);
  return "resend";
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
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

  // One or more recipients, comma/semicolon separated, de-duplicated, capped at 10.
  const to = [...new Set(String(process.env.CONTACT_TO || "contact@mediaartnation.studio").split(/[,;\s]+/).map((a) => a.trim()).filter((a) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a)))].slice(0, 10);
  if (!to.length) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: "not_configured" }));
  }
  // ---------- subject and body (Korean, for the team's inbox) ----------
  const now = new Date();
  const receivedAt = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(now) + " (KST)";
  const pageUrl = `https://www.mediaartnation.com/${lang}/contact/`;
  const topicLabel = `${TOPICS[topic].ko} / ${TOPICS[topic].en}`;
  const subject = `[홈페이지 문의] ${TOPICS[topic].ko} — ${name}${company ? ` (${company})` : ""}`;

  const rows = [
    ["접수 일시", receivedAt],
    ["문의 유형", topicLabel],
    ["이름", name],
    ["회사 · 소속", company || "-"],
    ["이메일", email],
    ["연락처", phone || "-"],
    ["작성 언어", lang === "ko" ? "한국어" : "English"],
    ["접수 페이지", pageUrl],
  ];
  const text = [
    "홈페이지 문의가 접수되었습니다.",
    "",
    ...rows.map(([k, v]) => `${k.padEnd(6, "　")}: ${v}`),
    "",
    "─────────── 문의 내용 ───────────",
    message,
    "──────────────────────────────",
    "",
    "이 메일에 답장하면 문의자에게 바로 전달됩니다.",
  ].join("\n");
  const cell = "padding:10px 14px;border-bottom:1px solid #e3e0d8;font-size:14px;line-height:1.5;vertical-align:top";
  const html = `<!doctype html><html lang="ko"><body style="margin:0;padding:24px;background:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',Pretendard,sans-serif;color:#15161b">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e3e0d8">
    <div style="padding:20px 24px;background:#15161b;color:#fff">
      <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.7">Media Art Nation · Website</div>
      <div style="font-size:20px;font-weight:700;margin-top:6px">홈페이지 문의가 접수되었습니다</div>
    </div>
    <table style="width:100%;border-collapse:collapse" role="presentation">
      ${rows.map(([k, v]) => {
    const val = k === "이메일" ? `<a href="mailto:${esc(v)}" style="color:#3d5afe">${esc(v)}</a>`
      : k === "접수 페이지" ? `<a href="${esc(v)}" style="color:#3d5afe">${esc(v)}</a>`
        : esc(v);
    return `<tr><th style="${cell};width:120px;text-align:left;color:#55534e;font-weight:600;background:#faf9f6">${esc(k)}</th><td style="${cell}">${val}</td></tr>`;
  }).join("")}
    </table>
    <div style="padding:20px 24px">
      <div style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#8c8a84;margin-bottom:8px">문의 내용</div>
      <div style="white-space:pre-wrap;font-size:15px;line-height:1.7;padding:16px;border-radius:12px;background:#f4f3ef">${esc(message)}</div>
    </div>
    <div style="padding:14px 24px 20px;font-size:12px;color:#8c8a84;border-top:1px solid #e3e0d8">이 메일에 답장하면 문의자(${esc(email)})에게 바로 전달됩니다.</div>
  </div>
</body></html>`;

  let provider;
  if (process.env.ACS_CONNECTION_STRING && process.env.ACS_SENDER) provider = sendViaAcs;
  else if (process.env.RESEND_API_KEY) provider = sendViaResend;
  if (!provider) {
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: "not_configured" }));
  }
  const from = provider === sendViaAcs ? process.env.ACS_SENDER : process.env.CONTACT_FROM || "Media Art Nation <onboarding@resend.dev>";

  try {
    const id = await provider({ to, from, replyTo: email, subject, text, html });
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true, id }));
  } catch (err) {
    console.error("contact send failed:", err.message);
    res.statusCode = 502;
    return res.end(JSON.stringify({ error: "send_failed" }));
  }
};
