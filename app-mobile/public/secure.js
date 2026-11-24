// EUROXPRO'27 delegate app: "sign out other devices",
// block / report, and the sign-up bot check. app.js hands in its helpers.
// Every rule is enforced by the server; these screens only make it usable.
import { getLang } from "./i18n.js";

const S = {
  tr: {
    security: "Güvenlik",
    logoutAll: "Diğer tüm cihazlardan çık",
    logoutAllHint: "Hesabın açık kaldığı başka telefon ve bilgisayarlar hemen çıkış yapar.",
    logoutAllDone: "Diğer cihazlardaki oturumlar kapatıldı",
    logout: "Çıkış yap",
    close: "Kapat",
    cancel: "Vazgeç",
    block: "Engelle",
    unblock: "Engeli kaldır",
    blockedToast: "{n} engellendi. Mesajlarını görmeyeceksin.",
    unblockedToast: "{n} için engel kaldırıldı",
    blockedNote: "Bu kişiyi engelledin. Mesaj gönderemezsiniz.",
    blockedThem: "Bu sohbette mesaj gönderilemiyor.",
    report: "Bildir",
    reportTitle: "{n} kişisini bildir",
    reportHint: "Bildirimini yalnızca organizatörler görür. Kişiye haber verilmez.",
    reportMsg: "Bildirilen mesaj",
    reasons: { harassment: "Taciz veya rahatsız edici davranış", spam: "Spam veya reklam", fake: "Sahte hesap", inappropriate: "Uygunsuz içerik veya fotoğraf", other: "Diğer" },
    reportText: "İstersen kısaca anlat",
    reportSend: "Bildirimi gönder",
    reportThanks: "Teşekkürler, organizatörlere iletildi",
    alsoBlock: "Bu kişiyi engelle",
    more: "Diğer işlemler",
    err_captcha_failed: "Bot kontrolü tamamlanamadı. Sayfayı yenileyip tekrar dene.",
    err_login_wait: "Çok fazla hatalı deneme. {s} saniye sonra tekrar dene.",
    err_blocked: "Bu kişiyle mesajlaşma engellendi.",
    err_cant_block: "Organizatörler engellenemez, istersen bildirebilirsin.",
  },
  en: {
    security: "Security",
    logoutAll: "Sign out of all other devices",
    logoutAllHint: "Other phones and computers where your account is open are signed out at once.",
    logoutAllDone: "Other devices are signed out",
    logout: "Sign out",
    close: "Close",
    cancel: "Cancel",
    block: "Block",
    unblock: "Unblock",
    blockedToast: "{n} is blocked. You won't see their messages.",
    unblockedToast: "{n} is unblocked",
    blockedNote: "You blocked this person. Neither of you can send messages.",
    blockedThem: "Messages can't be sent in this chat.",
    report: "Report",
    reportTitle: "Report {n}",
    reportHint: "Only organizers see your report. The person is not told.",
    reportMsg: "Reported message",
    reasons: { harassment: "Harassment or disturbing behaviour", spam: "Spam or advertising", fake: "Fake account", inappropriate: "Inappropriate content or photo", other: "Other" },
    reportText: "Tell us more (optional)",
    reportSend: "Send report",
    reportThanks: "Thank you, the organizers have it",
    alsoBlock: "Block this person",
    more: "More actions",
    err_captcha_failed: "The bot check didn't finish. Reload the page and try again.",
    err_login_wait: "Too many wrong tries. Try again in {s} seconds.",
    err_blocked: "Messaging with this person is blocked.",
    err_cant_block: "Organizers can't be blocked, but you can report them.",
  },
  pl: {
    security: "Bezpieczeństwo",
    logoutAll: "Wyloguj ze wszystkich innych urządzeń",
    logoutAllHint: "Inne telefony i komputery, na których konto jest otwarte, zostaną od razu wylogowane.",
    logoutAllDone: "Inne urządzenia zostały wylogowane",
    logout: "Wyloguj",
    close: "Zamknij",
    cancel: "Anuluj",
    block: "Zablokuj",
    unblock: "Odblokuj",
    blockedToast: "{n} zablokowano. Nie zobaczysz tych wiadomości.",
    unblockedToast: "{n} odblokowano",
    blockedNote: "Ta osoba jest zablokowana. Nie możecie wymieniać wiadomości.",
    blockedThem: "W tym czacie nie można wysyłać wiadomości.",
    report: "Zgłoś",
    reportTitle: "Zgłoś: {n}",
    reportHint: "Zgłoszenie widzą tylko organizatorzy. Osoba nie zostanie powiadomiona.",
    reportMsg: "Zgłaszana wiadomość",
    reasons: { harassment: "Nękanie lub niepokojące zachowanie", spam: "Spam lub reklama", fake: "Fałszywe konto", inappropriate: "Nieodpowiednie treści lub zdjęcie", other: "Inne" },
    reportText: "Opisz krótko (opcjonalnie)",
    reportSend: "Wyślij zgłoszenie",
    reportThanks: "Dziękujemy, organizatorzy otrzymali zgłoszenie",
    alsoBlock: "Zablokuj tę osobę",
    more: "Więcej",
    err_captcha_failed: "Weryfikacja antybotowa nie powiodła się. Odśwież stronę i spróbuj ponownie.",
    err_login_wait: "Zbyt wiele błędnych prób. Spróbuj za {s} s.",
    err_blocked: "Wymiana wiadomości z tą osobą jest zablokowana.",
    err_cant_block: "Organizatorów nie można zablokować, ale można ich zgłosić.",
  },
};

export function st(key, vars = {}) {
  const s = (S[getLang()] || S.en)[key] ?? S.en[key];
  return typeof s === "string" ? s.replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? "") : s ?? null;
}

export function makeSecurity(ctx) {
  const { h, api, toast, errText, icon, state, gcSheet, wordmark, langSwitch, avatar, loadScript, saveUser, haptic, onLogout, onReady } = ctx;

  // Profile > Security.
  function profileGroup() {
    let armed = false;
    const allBtn = h("button", { type: "button", class: "row row-action" }, icon("people", "row-icon"), h("span", { class: "row-text" }, h("span", { class: "row-value tint" }, st("logoutAll")), h("span", { class: "row-label" }, st("logoutAllHint"))));
    allBtn.addEventListener("click", async () => {
      if (!armed) {
        armed = true;
        allBtn.classList.add("armed");
        allBtn.querySelector(".row-value").textContent = st("logoutAll") + "?";
        setTimeout(() => {
          armed = false;
          allBtn.classList.remove("armed");
          allBtn.querySelector(".row-value").textContent = st("logoutAll");
        }, 4000);
        return;
      }
      allBtn.disabled = true;
      try {
        const { user } = await api("POST", "/api/auth/logout-all");
        state.user = user;
        saveUser(user);
        toast(st("logoutAllDone"));
      } catch (err) {
        toast(errText(err));
      }
      allBtn.disabled = false;
    });
    return [
      h("h2", { class: "group-header" }, st("security")),
      h("div", { class: "group" },
        allBtn),
    ];
  }

  // ------------------------------------------------------------ block / report
  function reportSheet(p, msg = null) {
    const { box, close } = gcSheet("report-sheet");
    box.setAttribute("aria-label", st("reportTitle", { n: p.name }));
    const reasons = st("reasons");
    let reason = "harassment";
    const list = h("div", { class: "group report-reasons", role: "radiogroup" },
      Object.entries(reasons).map(([k, label]) =>
        h("label", { class: "row report-reason" }, h("input", { type: "radio", name: "reason", value: k, checked: k === reason, onchange: () => (reason = k) }), h("span", { class: "row-value" }, label))));
    const text = h("textarea", { rows: 3, maxlength: 500, placeholder: st("reportText"), "aria-label": st("reportText"), class: "report-text" });
    const blockToo = p.canBlock !== false && !p.blocked ? h("input", { type: "checkbox", class: "switch", role: "switch", "aria-label": st("alsoBlock") }) : null;
    const send = h("button", { type: "button", class: "btn btn-filled" }, st("reportSend"));
    send.addEventListener("click", async () => {
      send.disabled = true;
      try {
        await api("POST", `/api/people/${encodeURIComponent(p.id)}/report`, { reason, text: text.value, ...(msg ? { msgId: msg.id, conv: msg.conv } : {}) });
        if (blockToo?.checked) {
          await api("POST", `/api/people/${encodeURIComponent(p.id)}/block`, { block: true });
          window.dispatchEvent(new CustomEvent("person-blocked", { detail: { id: p.id, blocked: true } }));
        }
        toast(st("reportThanks"));
        close();
      } catch (err) {
        toast(errText(err));
        send.disabled = false;
      }
    });
    box.append(
      h("div", { class: "sheet-grab", "aria-hidden": "true" }),
      h("h2", { class: "sheet-name" }, st("reportTitle", { n: p.name })),
      h("p", { class: "fineprint center" }, st("reportHint")),
      msg ? h("blockquote", { class: "report-quote" }, h("span", { class: "row-label" }, st("reportMsg")), h("p", {}, msg.original || msg.text)) : "",
      list,
      text,
      blockToo ? h("label", { class: "row adm-switch report-block" }, h("span", { class: "row-value" }, st("alsoBlock")), blockToo) : "",
      send,
      h("button", { type: "button", class: "btn btn-plain", onclick: close }, st("cancel"))
    );
  }

  async function setBlocked(p, on) {
    const r = await api("POST", `/api/people/${encodeURIComponent(p.id)}/block`, { block: on });
    p.blocked = r.blocked;
    toast(st(on ? "blockedToast" : "unblockedToast", { n: p.name }));
    window.dispatchEvent(new CustomEvent("person-blocked", { detail: { id: p.id, blocked: r.blocked } }));
    return r.blocked;
  }

  // Two quiet buttons under a person's card.
  function personActions(p, onChange) {
    if (!p || p.id === state.user?.id) return "";
    const blockBtn = p.canBlock === false ? null : h("button", { type: "button", class: "btn btn-small btn-muted" }, p.blocked ? st("unblock") : st("block"));
    blockBtn?.addEventListener("click", async () => {
      blockBtn.disabled = true;
      try {
        await setBlocked(p, !p.blocked);
        blockBtn.textContent = p.blocked ? st("unblock") : st("block");
        onChange?.(p);
      } catch (err) {
        toast(errText(err));
      }
      blockBtn.disabled = false;
    });
    return h("div", { class: "person-actions" }, blockBtn, h("button", { type: "button", class: "btn btn-small btn-muted", onclick: () => reportSheet(p) }, st("report")));
  }

  // ------------------------------------------------------------ sign-up bot check
  // Honeypot field (people never see it) plus Cloudflare Turnstile when the
  // server has keys. Turnstile usually decides without showing anything.
  function captcha() {
    const holder = h("div", { class: "captcha" });
    const trap = h("label", { class: "hp", "aria-hidden": "true" }, "Website", h("input", { type: "text", name: "website", tabindex: "-1", autocomplete: "off" }));
    let token = "";
    let widget = null;
    let ready = Promise.resolve();
    ready = api("GET", "/api/auth/config")
      .then(async ({ turnstile }) => {
        if (!turnstile) return;
        await loadScript("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit");
        widget = window.turnstile.render(holder, {
          sitekey: turnstile,
          theme: document.documentElement.dataset.theme === "dark" || matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
          language: getLang(),
          appearance: "interaction-only",
          callback: (v) => (token = v),
          "expired-callback": () => (token = ""),
          "error-callback": () => (token = ""),
        });
      })
      .catch(() => {});
    return {
      el: h("div", {}, trap, holder),
      async token() {
        await ready;
        if (widget == null) return "";
        if (!token) {
          // Wait a moment for an invisible check that is still running.
          for (let i = 0; i < 40 && !token; i++) await new Promise((r) => setTimeout(r, 150));
        }
        return token;
      },
      reset() {
        token = "";
        if (widget != null) window.turnstile?.reset(widget);
      },
    };
  }

  return { profileGroup, personActions, reportSheet, setBlocked, captcha };
}
