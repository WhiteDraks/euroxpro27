// EUROXPRO'27 delegate app: two-step sign-in, "sign out other devices",
// block / report, and the sign-up bot check. app.js hands in its helpers.
// Every rule is enforced by the server; these screens only make it usable.
import { getLang } from "./i18n.js";

const S = {
  tr: {
    security: "Güvenlik",
    twofa: "2 adımlı giriş",
    twofaOn: "Açık",
    twofaOff: "Kapalı",
    twofaHint: "Girişte şifrenin yanında, telefonundaki doğrulayıcı uygulamanın 6 haneli kodu da sorulur.",
    twofaAdminHint: "Organizatör hesaplarında zorunludur.",
    logoutAll: "Diğer tüm cihazlardan çık",
    logoutAllHint: "Hesabın açık kaldığı başka telefon ve bilgisayarlar hemen çıkış yapar.",
    logoutAllDone: "Diğer cihazlardaki oturumlar kapatıldı",
    forcedTitle: "2 adımlı girişi aç",
    forcedBody: "Organizatör hesabın herkesi onaylayıp silebildiği için ek koruma gerekiyor. Bir kez kurman yeterli, 2 dakika sürer.",
    start: "Kurmaya başla",
    step1: "1. Doğrulayıcı uygulamaya ekle",
    step1Hint: "Google Authenticator, Microsoft Authenticator, 1Password ya da iPhone'da Ayarlar > Parolalar kullanılabilir.",
    openApp: "Doğrulayıcı uygulamada aç",
    scanHint: "Başka bir cihazdaysan bu kodu telefonunla tara.",
    keyLabel: "Ya da bu anahtarı elle gir",
    copy: "Kopyala",
    copied: "Kopyalandı",
    step2: "2. Uygulamadaki 6 haneli kodu yaz",
    code: "Doğrulama kodu",
    verify: "Doğrula ve aç",
    twofaEnabled: "2 adımlı giriş açıldı",
    disable: "2 adımlı girişi kapat",
    disableHint: "Kapatmak için uygulamadaki güncel kodu yaz.",
    twofaDisabled: "2 adımlı giriş kapatıldı",
    lostPhone: "Telefonunu kaybedersen bir organizatör 2 adımlı girişini sıfırlayabilir.",
    codeAsk: "Doğrulayıcı uygulamandaki 6 haneli kodu yaz.",
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
    err_bad_code: "Kod yanlış ya da süresi geçmiş. Uygulamadaki güncel kodu yaz.",
    err_code_required: "Doğrulama kodunu yaz.",
    err_twofa_expired: "Kurulum süresi doldu, baştan başla.",
    err_twofa_mandatory: "Organizatör hesaplarında 2 adımlı giriş kapatılamaz.",
    err_blocked: "Bu kişiyle mesajlaşma engellendi.",
    err_cant_block: "Organizatörler engellenemez, istersen bildirebilirsin.",
  },
  en: {
    security: "Security",
    twofa: "Two-step sign-in",
    twofaOn: "On",
    twofaOff: "Off",
    twofaHint: "Signing in asks for the 6-digit code from an authenticator app on your phone as well as your password.",
    twofaAdminHint: "Required for organizer accounts.",
    logoutAll: "Sign out of all other devices",
    logoutAllHint: "Other phones and computers where your account is open are signed out at once.",
    logoutAllDone: "Other devices are signed out",
    forcedTitle: "Turn on two-step sign-in",
    forcedBody: "Your organizer account can approve and delete everyone, so it needs extra protection. You set it up once; it takes 2 minutes.",
    start: "Start set-up",
    step1: "1. Add it to an authenticator app",
    step1Hint: "Google Authenticator, Microsoft Authenticator, 1Password or, on iPhone, Settings > Passwords all work.",
    openApp: "Open in authenticator app",
    scanHint: "On another device? Scan this code with your phone.",
    keyLabel: "Or enter this key by hand",
    copy: "Copy",
    copied: "Copied",
    step2: "2. Type the 6-digit code from the app",
    code: "Verification code",
    verify: "Verify and turn on",
    twofaEnabled: "Two-step sign-in is on",
    disable: "Turn off two-step sign-in",
    disableHint: "Type the current code from the app to turn it off.",
    twofaDisabled: "Two-step sign-in is off",
    lostPhone: "If you lose your phone, an organizer can reset your two-step sign-in.",
    codeAsk: "Type the 6-digit code from your authenticator app.",
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
    err_bad_code: "Wrong or expired code. Type the current code from the app.",
    err_code_required: "Type the verification code.",
    err_twofa_expired: "Set-up timed out, start again.",
    err_twofa_mandatory: "Organizer accounts can't turn two-step sign-in off.",
    err_blocked: "Messaging with this person is blocked.",
    err_cant_block: "Organizers can't be blocked, but you can report them.",
  },
  pl: {
    security: "Bezpieczeństwo",
    twofa: "Logowanie dwuetapowe",
    twofaOn: "Włączone",
    twofaOff: "Wyłączone",
    twofaHint: "Przy logowaniu oprócz hasła potrzebny jest 6-cyfrowy kod z aplikacji uwierzytelniającej w telefonie.",
    twofaAdminHint: "Wymagane dla kont organizatorów.",
    logoutAll: "Wyloguj ze wszystkich innych urządzeń",
    logoutAllHint: "Inne telefony i komputery, na których konto jest otwarte, zostaną od razu wylogowane.",
    logoutAllDone: "Inne urządzenia zostały wylogowane",
    forcedTitle: "Włącz logowanie dwuetapowe",
    forcedBody: "Konto organizatora może zatwierdzać i usuwać wszystkich, więc potrzebuje dodatkowej ochrony. Konfiguracja zajmuje 2 minuty.",
    start: "Rozpocznij",
    step1: "1. Dodaj do aplikacji uwierzytelniającej",
    step1Hint: "Działa Google Authenticator, Microsoft Authenticator, 1Password lub na iPhonie Ustawienia > Hasła.",
    openApp: "Otwórz w aplikacji",
    scanHint: "Na innym urządzeniu? Zeskanuj ten kod telefonem.",
    keyLabel: "Albo wpisz ten klucz ręcznie",
    copy: "Kopiuj",
    copied: "Skopiowano",
    step2: "2. Wpisz 6-cyfrowy kod z aplikacji",
    code: "Kod weryfikacyjny",
    verify: "Zweryfikuj i włącz",
    twofaEnabled: "Logowanie dwuetapowe włączone",
    disable: "Wyłącz logowanie dwuetapowe",
    disableHint: "Wpisz aktualny kod z aplikacji, aby wyłączyć.",
    twofaDisabled: "Logowanie dwuetapowe wyłączone",
    lostPhone: "Jeśli zgubisz telefon, organizator może zresetować logowanie dwuetapowe.",
    codeAsk: "Wpisz 6-cyfrowy kod z aplikacji uwierzytelniającej.",
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
    err_bad_code: "Zły lub nieaktualny kod. Wpisz aktualny kod z aplikacji.",
    err_code_required: "Wpisz kod weryfikacyjny.",
    err_twofa_expired: "Czas minął, zacznij od nowa.",
    err_twofa_mandatory: "Konta organizatorów nie mogą wyłączyć logowania dwuetapowego.",
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

  const qrSvg = (text) => {
    const q = window.qrcode(0, "M");
    q.addData(text);
    q.make();
    const n = q.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c + 4},${r + 4}h1v1h-1z`;
    return `<svg viewBox="0 0 ${n + 8} ${n + 8}" shape-rendering="crispEdges" role="img"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  };

  const codeInput = (name = "code") =>
    h("input", { name, type: "text", inputmode: "numeric", autocomplete: "one-time-code", pattern: "[0-9]*", maxlength: 7, placeholder: "123 456", class: "code-input", "aria-label": st("code"), required: true });

  // The set-up steps: add the key to an authenticator app, then prove it
  // with one code. Used on the forced screen and in Profile.
  function setupFlow(onDone) {
    const box = h("div", { class: "tfa-flow" });
    const start = h("button", { type: "button", class: "btn btn-filled" }, st("start"));
    start.addEventListener("click", async () => {
      start.disabled = true;
      try {
        const [{ secret, url }] = await Promise.all([api("POST", "/api/me/2fa/setup"), loadScript("/vendor/qr/qrcode.js")]);
        const input = codeInput();
        const error = h("p", { class: "form-error", role: "alert", hidden: true });
        const submit = h("button", { type: "submit", class: "btn btn-filled" }, st("verify"));
        const form = h("form", { class: "tfa-verify", novalidate: true, onsubmit: async (e) => {
          e.preventDefault();
          error.hidden = true;
          submit.disabled = true;
          try {
            const { user } = await api("POST", "/api/me/2fa/enable", { code: input.value });
            state.user = user;
            saveUser(user);
            haptic(20);
            toast(st("twofaEnabled"));
            onDone(user);
          } catch (err) {
            error.textContent = errText(err);
            error.hidden = false;
            submit.disabled = false;
            input.select();
          }
        } }, h("label", { class: "field" }, h("span", { class: "field-label" }, st("code")), input), error, submit);
        const grouped = secret.replace(/(.{4})/g, "$1 ").trim();
        box.replaceChildren(
          h("h2", { class: "group-header" }, st("step1")),
          h("p", { class: "fineprint" }, st("step1Hint")),
          h("a", { class: "btn btn-tinted", href: url }, icon("shield"), st("openApp")),
          h("div", { class: "tfa-qr" }, h("span", { class: "qr-img", html: qrSvg(url), "aria-label": st("scanHint") }), h("p", { class: "fineprint" }, st("scanHint"))),
          h("p", { class: "fineprint" }, st("keyLabel")),
          h("div", { class: "tfa-key" }, h("code", {}, grouped), h("button", { type: "button", class: "btn btn-small", onclick: async () => {
            try {
              await navigator.clipboard.writeText(secret);
              toast(st("copied"));
            } catch {}
          } }, st("copy"))),
          h("h2", { class: "group-header" }, st("step2")),
          form,
          h("p", { class: "fineprint" }, st("lostPhone"))
        );
      } catch (err) {
        toast(errText(err));
        start.disabled = false;
      }
    });
    box.append(start);
    return box;
  }

  // Organizer without two-step sign-in: nothing else opens until it is on.
  function forcedScreen(screen) {
    const u = state.user;
    screen.classList.add("wait-screen", "tfa-screen");
    screen.append(
      h("div", { class: "wait-top" }, langSwitch(() => ctx.render())),
      h("div", { class: "wait-card" },
        wordmark(),
        h("div", { class: "wait-icon", "aria-hidden": "true" }, icon("shield")),
        h("h1", { class: "wait-title" }, st("forcedTitle")),
        h("p", { class: "wait-text" }, st("forcedBody")),
        h("div", { class: "wait-me" }, avatar(u), h("span", { class: "row-text" }, h("span", { class: "row-value" }, u.name), h("span", { class: "row-label" }, u.email))),
        setupFlow((user) => onReady(user)),
        h("button", { type: "button", class: "btn btn-plain wait-logout", onclick: onLogout }, st("logout")))
    );
  }

  function twofaSheet() {
    const u = state.user;
    const { box, close } = gcSheet("tfa-sheet");
    box.setAttribute("aria-label", st("twofa"));
    const body = h("div", { class: "tfa-sheet-body" });
    if (!u.twofa) {
      body.append(h("h2", { class: "sheet-name" }, st("twofa")), h("p", { class: "fineprint" }, st("twofaHint")), setupFlow(() => {
        close();
        ctx.render();
      }));
    } else {
      const input = codeInput();
      const error = h("p", { class: "form-error", role: "alert", hidden: true });
      const admin = u.role === "admin";
      body.append(
        h("h2", { class: "sheet-name" }, `${st("twofa")} · ${st("twofaOn")}`),
        h("p", { class: "fineprint" }, admin ? st("twofaAdminHint") : st("disableHint")),
        admin
          ? h("p", { class: "fineprint" }, st("lostPhone"))
          : h("form", { novalidate: true, onsubmit: async (e) => {
              e.preventDefault();
              error.hidden = true;
              try {
                const { user } = await api("POST", "/api/me/2fa/disable", { code: input.value });
                state.user = user;
                saveUser(user);
                toast(st("twofaDisabled"));
                close();
                ctx.render();
              } catch (err) {
                error.textContent = errText(err);
                error.hidden = false;
              }
            } }, h("label", { class: "field" }, h("span", { class: "field-label" }, st("code")), input), error, h("button", { type: "submit", class: "btn btn-plain btn-danger-text" }, st("disable")))
      );
    }
    box.append(h("div", { class: "sheet-grab", "aria-hidden": "true" }), body, h("button", { type: "button", class: "btn btn-plain", onclick: close }, st("close")));
  }

  // Profile > Security.
  function profileGroup() {
    const u = state.user;
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
        h("button", { type: "button", class: "row row-action", onclick: twofaSheet }, icon("shield", "row-icon"), h("span", { class: "row-text" }, h("span", { class: "row-value" }, st("twofa")), h("span", { class: "row-label" }, u.twofa ? st("twofaOn") : st("twofaOff"))), icon("chevron", "row-chevron")),
        allBtn),
      h("p", { class: "group-footer" }, st("twofaHint")),
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

  return { forcedScreen, profileGroup, personActions, reportSheet, setBlocked, captcha, codeInput };
}
