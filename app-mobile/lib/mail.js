// ============================================================
// Transactional e-mail for the delegate app, with no npm packages:
//   - organizers get an e-mail for every new sign-up,
//   - a delegate gets one when an organizer approves the account.
// Everything here is best-effort: callers run it in the background, and a
// missing setting, a provider error or a timeout never fails the request.
//
// Provider (first one configured wins):
//   RESEND_API_KEY                  Resend HTTP API (resend.com)
//   SMTP_HOST + SMTP_USER + SMTP_PASS   any SMTP server over TLS, e.g.
//                                   smtp.gmail.com with a Google app password
//   SMTP_PORT                       default 465 (implicit TLS)
// Other settings:
//   MAIL_FROM            Sender, e.g. "EUROXPRO'27 <app@example.org>".
//                        Default: SMTP_USER for SMTP, Resend's test sender
//                        (delivers only to the Resend account's own address)
//                        for Resend.
//   SIGNUP_NOTIFY_EMAIL  Who hears about sign-ups, comma-separated.
//                        Default below; "off" turns it off.
//   APPROVAL_EMAIL       "off" stops the approval e-mail to delegates.
// ============================================================
import { connect } from "tls";
import { randomBytes } from "crypto";

const DEFAULT_TO = "elifkurnaz@aiesec.org.tr";
const RESEND_TEST_FROM = "EUROXPRO'27 App <onboarding@resend.dev>";
const EMAIL_RE = /^[^\s@<>,;"'()\\]+@[^\s@<>,;"'()\\]+\.[^\s@<>,;"'()\\]{2,}$/;
const OFF_RE = /^(off|0|false|no|none)$/i;

export const validEmail = (s) => EMAIL_RE.test(String(s || "")) && String(s).length <= 200;

export function provider(env = process.env) {
    if (env.RESEND_API_KEY)
        return "resend";
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS)
        return "smtp";
    return "";
}

export function signupRecipients(env = process.env) {
    const raw = (env.SIGNUP_NOTIFY_EMAIL ?? "").trim();
    if (OFF_RE.test(raw))
        return [];
    return (raw || DEFAULT_TO).split(",").map((s) => s.trim()).filter(validEmail);
}

export const approvalEnabled = (env = process.env) => !OFF_RE.test((env.APPROVAL_EMAIL ?? "").trim());

export function escapeHtml(v) {
    return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// Single line, no control characters: safe for headers and plain text.
const oneLine = (v, max = 120) => String(v ?? "").replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ").trim().slice(0, max);
const baseUrl = (u) => String(u || "").replace(/\/+$/, "");

function layout(title, bodyHtml, footer) {
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f5f5f7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1d1d1f">
<div style="max-width:520px;margin:0 auto;padding:24px 16px">
<div style="background:#fff;border-radius:16px;padding:24px">
<p style="margin:0 0 4px;font-size:13px;color:#8e1b3a;font-weight:600;letter-spacing:.04em">EUROXPRO'27</p>
<h1 style="margin:0 0 16px;font-size:20px;line-height:1.3">${escapeHtml(title)}</h1>
${bodyHtml}
</div>
<p style="font-size:12px;color:#8e8e93;margin:12px 4px 0">${escapeHtml(footer)}</p>
</div></body></html>`;
}
const button = (href, label) => `<p style="margin:24px 0 0"><a href="${escapeHtml(href)}" style="display:inline-block;background:#8e1b3a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600">${escapeHtml(label)}</a></p>`;

// ------------------------------------------------------------ templates
export function signupEmail(user, appUrl) {
    const adminUrl = `${baseUrl(appUrl)}/admin/users/${encodeURIComponent(user.id)}`;
    const date = new Date(user.createdAt || Date.now()).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "long", timeStyle: "short" });
    const status = { pending: "Onay bekliyor", active: "Aktif" }[user.status] || user.status || "";
    const rows = [
        ["Ad", user.name],
        ["E-posta", user.email],
        ["Entity", user.entity],
        ["Pozisyon", user.position],
        ["Durum", status],
        ["Tarih", `${date} (TR)`],
    ].filter(([, v]) => v);
    const subject = `Yeni kayıt: ${oneLine(user.name, 60)}${user.status === "pending" ? " (onay bekliyor)" : ""}`;
    const text = [
        "EUROXPRO'27 uygulamasına yeni bir kayıt geldi.",
        "",
        ...rows.map(([k, v]) => `${k}: ${oneLine(v, 200)}`),
        "",
        `Yönetim paneli: ${adminUrl}`,
    ].join("\n");
    const table = `<table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px">
${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6e6e73;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;word-break:break-word">${escapeHtml(v)}</td></tr>`).join("\n")}
</table>`;
    const html = layout("Yeni kayıt", table + button(adminUrl, "Yönetim panelinde aç"), "Bu e-posta, uygulamaya her yeni kayıtta otomatik gönderilir.");
    return { subject, text, html };
}

const APPROVED = {
    tr: { subject: "EUROXPRO'27 hesabın onaylandı", title: "Hesabın onaylandı", hi: "Merhaba {n},", body: "EUROXPRO'27 uygulamasındaki hesabın bir organizatör tarafından onaylandı. Artık giriş yapıp programı, delegeleri ve mesajları görebilirsin.", cta: "Uygulamayı aç", footer: "Bu e-postayı, EUROXPRO'27 uygulamasına kayıt olduğun için aldın." },
    en: { subject: "Your EUROXPRO'27 account is approved", title: "Your account is approved", hi: "Hi {n},", body: "An organizer approved your account in the EUROXPRO'27 app. You can now sign in and see the agenda, the delegates and your messages.", cta: "Open the app", footer: "You received this e-mail because you signed up for the EUROXPRO'27 app." },
    pl: { subject: "Twoje konto EUROXPRO'27 zostało zatwierdzone", title: "Konto zatwierdzone", hi: "Cześć {n},", body: "Organizator zatwierdził Twoje konto w aplikacji EUROXPRO'27. Możesz się teraz zalogować i zobaczyć program, delegatów i wiadomości.", cta: "Otwórz aplikację", footer: "Otrzymujesz tę wiadomość, ponieważ zarejestrowałeś(-aś) się w aplikacji EUROXPRO'27." },
};

export function approvedEmail(user, appUrl) {
    const s = APPROVED[user.lang] || APPROVED.en;
    const name = oneLine(user.name, 60);
    const url = `${baseUrl(appUrl)}/home`;
    const hi = s.hi.replace("{n}", name);
    const text = `${hi}\n\n${s.body}\n\n${s.cta}: ${url}`;
    const html = layout(s.title, `<p style="margin:0 0 12px;font-size:15px">${escapeHtml(hi)}</p><p style="margin:0;font-size:15px;line-height:1.5">${escapeHtml(s.body)}</p>` + button(url, s.cta), s.footer);
    return { subject: s.subject, text, html };
}

// ------------------------------------------------------------ sending
export async function sendMail({ to, subject, text, html }, { env = process.env, fetchImpl = fetch } = {}) {
    const rcpt = (Array.isArray(to) ? to : [to]).map((s) => String(s).trim()).filter(validEmail);
    const kind = provider(env);
    if (!kind)
        return { sent: false, reason: "not_configured" };
    if (!rcpt.length)
        return { sent: false, reason: "no_recipient" };
    const msg = { to: rcpt, subject: oneLine(subject, 200), text, html };
    if (kind === "resend")
        await sendResend(msg, env, fetchImpl);
    else
        await sendSmtp(msg, env);
    return { sent: true, provider: kind };
}

async function sendResend(msg, env, fetchImpl) {
    const res = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ from: oneLine(env.MAIL_FROM, 200) || RESEND_TEST_FROM, ...msg }),
        signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
        const detail = (await res.text().catch(() => "")).slice(0, 300);
        throw new Error(`resend ${res.status}: ${detail}`);
    }
}

// "Name <a@b.c>" or "a@b.c" -> { name, address }
function parseFrom(s, fallback) {
    const v = oneLine(s, 200);
    const m = v.match(/^(.*?)\s*<([^<>]+)>$/);
    const address = (m ? m[2] : v).trim();
    if (!validEmail(address))
        return { name: "EUROXPRO'27", address: fallback };
    return { name: m ? m[1].replace(/^"|"$/g, "").trim() : "", address };
}
const encWord = (s) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s, "utf8").toString("base64")}?=`);
const b64lines = (s) => Buffer.from(s, "utf8").toString("base64").replace(/.{76}/g, "$&\r\n");

export function buildMime({ from, to, subject, text, html }) {
    const boundary = "b_" + randomBytes(12).toString("hex");
    const fromHdr = from.name ? `${encWord(from.name.replace(/["\\]/g, ""))} <${from.address}>` : from.address;
    return [
        `From: ${fromHdr}`,
        `To: ${to.join(", ")}`,
        `Subject: ${encWord(subject)}`,
        `Date: ${new Date().toUTCString()}`,
        `Message-ID: <${randomBytes(12).toString("hex")}@${from.address.split("@")[1]}>`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        "Content-Type: text/plain; charset=utf-8",
        "Content-Transfer-Encoding: base64",
        "",
        b64lines(text),
        `--${boundary}`,
        "Content-Type: text/html; charset=utf-8",
        "Content-Transfer-Encoding: base64",
        "",
        b64lines(html),
        `--${boundary}--`,
        "",
    ].join("\r\n");
}

// Minimal SMTP client: implicit TLS, AUTH PLAIN, one message per connection.
function sendSmtp(msg, env) {
    const host = env.SMTP_HOST;
    const port = Number(env.SMTP_PORT) || 465;
    const from = parseFrom(env.MAIL_FROM, env.SMTP_USER);
    const data = buildMime({ ...msg, from });
    return new Promise((resolve, reject) => {
        const sock = connect({ host, port, servername: host });
        let buf = "";
        let waiter = null;
        const fail = (e) => {
            sock.destroy();
            reject(e);
        };
        sock.setTimeout(10000, () => fail(new Error("smtp timeout")));
        sock.on("error", fail);
        sock.on("data", (d) => {
            buf += d.toString("utf8");
            // A reply is complete when its last line is "NNN text" (not "NNN-text").
            const m = buf.match(/(?:^|\r\n)(\d{3}) [^\r\n]*\r\n$/);
            if (m && waiter) {
                const code = Number(m[1]);
                const text = buf;
                buf = "";
                const w = waiter;
                waiter = null;
                w(code, text);
            }
        });
        const step = (line, ok) => new Promise((res, rej) => {
            waiter = (code, text) => (ok.includes(code) ? res(code) : rej(new Error(`smtp ${code}: ${text.slice(0, 200).trim()}`)));
            if (line !== null)
                sock.write(line + "\r\n");
        });
        (async () => {
            await step(null, [220]);
            await step(`EHLO ${host.includes(".") ? "euroxpro-app" : "localhost"}`, [250]);
            await step(`AUTH PLAIN ${Buffer.from(`\0${env.SMTP_USER}\0${env.SMTP_PASS}`).toString("base64")}`, [235]);
            await step(`MAIL FROM:<${from.address}>`, [250]);
            for (const r of msg.to)
                await step(`RCPT TO:<${r}>`, [250, 251]);
            await step("DATA", [354]);
            // Dot-stuffing: a line starting with "." gets one more.
            await step(data.replace(/\r\n\./g, "\r\n..") + "\r\n.", [250]);
            sock.write("QUIT\r\n");
            sock.end();
            resolve();
        })().catch(fail);
    });
}

export const sendSignupEmail = (user, appUrl, opts) => sendMail({ to: signupRecipients(opts?.env), ...signupEmail(user, appUrl) }, opts);
export const sendApprovedEmail = (user, appUrl, opts) => sendMail({ to: user.email, ...approvedEmail(user, appUrl) }, opts);

// Several sign-ups in one e-mail (at most one e-mail per 15 minutes).
export function signupDigestEmail(users, appUrl, total = users.length) {
    const adminUrl = `${baseUrl(appUrl)}/admin`;
    const shown = users.slice(0, 50);
    const rows = shown.map((u) => [u.name, [u.entity, u.position, u.email].filter(Boolean).join(" · ")]);
    const subject = `${total} yeni kayıt onay bekliyor`;
    const more = total > shown.length ? `\n... ve ${total - shown.length} kişi daha` : "";
    const text = [
        `EUROXPRO'27 uygulamasına son 15 dakikada ${total} yeni kayıt geldi.`,
        "",
        ...rows.map(([n, d]) => `- ${oneLine(n, 60)}: ${oneLine(d, 200)}`),
        more,
        "",
        `Yönetim paneli: ${adminUrl}`,
    ].join("\n");
    const list = `<table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px">
${rows.map(([n, d]) => `<tr><td style="padding:6px 12px 6px 0;font-weight:600;vertical-align:top">${escapeHtml(n)}</td><td style="padding:6px 0;color:#6e6e73;word-break:break-word">${escapeHtml(d)}</td></tr>`).join("\n")}
</table>${more ? `<p style="font-size:14px;color:#6e6e73">${escapeHtml(more.trim())}</p>` : ""}`;
    const html = layout(`${total} yeni kayıt`, list + button(adminUrl, "Yönetim panelinde aç"), "Çok kayıt geldiğinde e-postalar 15 dakikada bir özet olarak gönderilir.");
    return { subject, text, html };
}
export const sendSignupDigest = (users, appUrl, total, opts) => sendMail({ to: signupRecipients(opts?.env), ...signupDigestEmail(users, appUrl, total) }, opts);
