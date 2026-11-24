// EUROXPRO'27 delegate app: QR business card and contacts.
// Every delegate has a QR code. Someone who scans it (in the app, or with the
// phone camera, which opens /c/<code>) saves that delegate to their contacts.
// Extra card fields are optional and only shown to people who saved the card;
// the server enforces that. app.js hands in its helpers.
import { getLang } from "./i18n.js";

const C = {
  tr: {
    myCard: "Kartvizitim",
    contacts: "Kişilerim",
    cardTile: "QR'ını göster, kod okutup kişi kaydet",
    cardHint: "Bu kodu okutan delege seni kişilerine kaydeder. Kendi telefon kamerasıyla okutursa uygulama açılır.",
    scan: "Kod okut",
    scanCardHint: "Diğer delegenin kartvizit kodunu çerçeveye getir",
    notCard: "Bu bir kartvizit kodu değil",
    onCard: "Kartında görünenler",
    onCardHint: "Hepsi isteğe bağlı. Sadece kartını kaydeden delegeler görür; uygulama dışında paylaşılmaz. İstediğin zaman silebilirsin.",
    phone: "Telefon",
    phoneHint: "+90 555 123 45 67",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    linkedinHint: "Profil linki",
    noCamera: "Kameraya erişilemedi. Telefonunun kamerasıyla QR'ı okutursan da kaydolur.",
    showEmail: "E-postamı göster",
    newCode: "Yeni kod oluştur",
    newCodeHint: "Eski QR artık çalışmaz. Seni önceden kaydedenler listelerinde kalır.",
    newCodeConfirm: "Yeni kod oluşturulsun mu?",
    newCodeDone: "Yeni kodun hazır",
    saved: "Kaydedildi",
    save: "Kaydet",
    savedContact: "{n} kişilerine eklendi",
    alreadyContact: "{n} zaten kişilerinde",
    noContacts: "Henüz kimseyi kaydetmedin. Tanıştığın delegenin kartvizit kodunu okut.",
    search: "Kişilerde ara",
    savedOn: "{d} kaydedildi",
    message: "Mesaj",
    call: "Ara",
    email: "E-posta",
    note: "Notun",
    noteHint: "Sadece sen görürsün, ör. nerede tanıştınız",
    remove: "Kişilerden çıkar",
    removeConfirm: "Çıkarılsın mı?",
    removed: "Kişilerden çıkarıldı",
    blockedNote: "Bu kişiyi engelledin, kart bilgileri gizli.",
    count: "{n} kişi",
    err_bad_phone: "Telefon numarası geçersiz görünüyor.",
    err_bad_instagram: "Instagram kullanıcı adı geçersiz.",
    err_bad_linkedin: "LinkedIn kullanıcı adı ya da linki geçersiz.",
    err_card_invalid: "Bu kod geçersiz ya da yenilenmiş. Kişiden kodunu tekrar göstermesini iste.",
    err_self: "Bu senin kendi kodun.",
    err_too_many: "Liste dolu. Birkaç kişiyi çıkarıp tekrar dene.",
  },
  en: {
    myCard: "My card",
    contacts: "My contacts",
    cardTile: "Show your QR, scan codes to save people",
    cardHint: "A delegate who scans this code saves you to their contacts. Scanning with the phone camera opens the app.",
    scan: "Scan a code",
    scanCardHint: "Point at another delegate's card code",
    notCard: "That's not a card code",
    onCard: "On your card",
    onCardHint: "All optional. Only delegates who saved your card see these; they are never shared outside the app. Remove them any time.",
    phone: "Phone",
    phoneHint: "+44 7700 900123",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    linkedinHint: "Profile link",
    noCamera: "No camera access. Scanning the QR with your phone camera saves them too.",
    showEmail: "Show my e-mail",
    newCode: "Make a new code",
    newCodeHint: "Your old QR stops working. People who saved you before keep you in their list.",
    newCodeConfirm: "Make a new code?",
    newCodeDone: "Your new code is ready",
    saved: "Saved",
    save: "Save",
    savedContact: "{n} added to your contacts",
    alreadyContact: "{n} is already in your contacts",
    noContacts: "No one saved yet. Scan the card code of a delegate you meet.",
    search: "Search contacts",
    savedOn: "Saved {d}",
    message: "Message",
    call: "Call",
    email: "E-mail",
    note: "Your note",
    noteHint: "Only you see this, e.g. where you met",
    remove: "Remove from contacts",
    removeConfirm: "Remove?",
    removed: "Removed from contacts",
    blockedNote: "You blocked this person, their card details are hidden.",
    count: "{n}",
    err_bad_phone: "That phone number doesn't look right.",
    err_bad_instagram: "That Instagram username isn't valid.",
    err_bad_linkedin: "That LinkedIn username or link isn't valid.",
    err_card_invalid: "This code is invalid or was replaced. Ask them to show their code again.",
    err_self: "That's your own code.",
    err_too_many: "Your list is full. Remove a few people and try again.",
  },
  pl: {
    myCard: "Moja wizytówka",
    contacts: "Moje kontakty",
    cardTile: "Pokaż swój QR, skanuj kody i zapisuj osoby",
    cardHint: "Delegat, który zeskanuje ten kod, zapisze Cię w kontaktach. Skanowanie aparatem telefonu otwiera aplikację.",
    scan: "Skanuj kod",
    scanCardHint: "Skieruj aparat na kod wizytówki innego delegata",
    notCard: "To nie jest kod wizytówki",
    onCard: "Na Twojej wizytówce",
    onCardHint: "Wszystko opcjonalne. Widzą to tylko delegaci, którzy zapisali Twoją wizytówkę; nic nie wychodzi poza aplikację. Możesz to usunąć w każdej chwili.",
    phone: "Telefon",
    phoneHint: "+48 512 345 678",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    linkedinHint: "Link do profilu",
    noCamera: "Brak dostępu do aparatu. Zeskanowanie QR aparatem telefonu też zapisze kontakt.",
    showEmail: "Pokaż mój e-mail",
    newCode: "Utwórz nowy kod",
    newCodeHint: "Stary QR przestanie działać. Osoby, które już Cię zapisały, nadal mają Cię na liście.",
    newCodeConfirm: "Utworzyć nowy kod?",
    newCodeDone: "Nowy kod jest gotowy",
    saved: "Zapisano",
    save: "Zapisz",
    savedContact: "Dodano {n} do kontaktów",
    alreadyContact: "{n} jest już w Twoich kontaktach",
    noContacts: "Nikogo jeszcze nie zapisano. Zeskanuj kod wizytówki poznanego delegata.",
    search: "Szukaj w kontaktach",
    savedOn: "Zapisano {d}",
    message: "Wiadomość",
    call: "Zadzwoń",
    email: "E-mail",
    note: "Twoja notatka",
    noteHint: "Widzisz ją tylko Ty, np. gdzie się poznaliście",
    remove: "Usuń z kontaktów",
    removeConfirm: "Usunąć?",
    removed: "Usunięto z kontaktów",
    blockedNote: "Ta osoba jest zablokowana, dane wizytówki są ukryte.",
    count: "{n}",
    err_bad_phone: "Ten numer telefonu wygląda na niepoprawny.",
    err_bad_instagram: "Niepoprawna nazwa użytkownika Instagram.",
    err_bad_linkedin: "Niepoprawna nazwa użytkownika lub link LinkedIn.",
    err_card_invalid: "Ten kod jest nieważny lub został zmieniony. Poproś o ponowne pokazanie kodu.",
    err_self: "To Twój własny kod.",
    err_too_many: "Lista jest pełna. Usuń kilka osób i spróbuj ponownie.",
  },
};

export function ct(key, vars = {}) {
  const s = (C[getLang()] || C.en)[key] ?? C.en[key];
  if (s == null) return "";
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

// Code from a scanned text: our own link (…/c/<code>) or the bare code.
export function cardTokenFrom(text) {
  const s = String(text || "").trim();
  const m = s.match(/\/c\/([\w-]{8,24})(?:[?#].*)?$/);
  if (m) return m[1];
  return /^[\w-]{12}$/.test(s) ? s : null;
}

export function makeCard(ctx) {
  const { h, api, toast, errText, icon, state, navBar, avatar, loadScript, go, openScanner, gcSheet, haptic, celebrate, posLabel, locale } = ctx;
  const err = (e) => (e?.code && ct("err_" + e.code)) || errText(e);

  let qrReady = null;
  const qrSvg = async (text) => {
    qrReady ||= loadScript("/vendor/qr/qrcode.js");
    await qrReady;
    const q = window.qrcode(0, "M");
    q.addData(text);
    q.make();
    const n = q.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c + 3},${r + 3}h1v1h-1z`;
    return `<svg viewBox="0 0 ${n + 6} ${n + 6}" shape-rendering="crispEdges" role="img" aria-label="QR"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#140d0e"/></svg>`;
  };
  const cardUrl = (tok) => `${location.origin}/c/${tok}`;
  const subLine = (p) => [p.position && posLabel(p.position), p.entity].filter(Boolean).join(" · ");

  async function save(token) {
    try {
      const r = await api("POST", "/api/contacts/scan", { token });
      if (r.fresh) {
        celebrate({ buzz: true });
        toast(ct("savedContact", { n: r.contact.name }));
      } else toast(ct("alreadyContact", { n: r.contact.name }));
      state.contacts = null;
      return r.contact;
    } catch (e) {
      toast(err(e));
      return null;
    }
  }

  function scan() {
    openScanner(async (token) => {
      const c = await save(token);
      if (!c) return;
      if (location.pathname !== "/contacts") go("/contacts");
      else window.dispatchEvent(new Event("contacts-updated"));
      setTimeout(() => openContact(c), 350);
    }, cardTokenFrom, ct("scanCardHint"), ct("noCamera"));
  }

  // ---------------------------------------------------------------- my card
  function viewCard(screen) {
    const u = state.user;
    const qr = h("div", { class: "vcard-qr" }, h("div", { class: "loading" }));
    const phone = h("input", { type: "tel", maxlength: 24, autocomplete: "tel", placeholder: ct("phoneHint"), "aria-label": ct("phone") });
    const insta = h("input", { type: "text", maxlength: 60, autocapitalize: "off", autocorrect: "off", spellcheck: false, placeholder: "@kullanici", "aria-label": ct("instagram") });
    const linked = h("input", { type: "text", maxlength: 140, autocapitalize: "off", autocorrect: "off", spellcheck: false, placeholder: ct("linkedinHint"), "aria-label": ct("linkedin") });
    insta.placeholder = getLang() === "tr" ? "@kullaniciadi" : "@username";
    const showEmail = h("input", { type: "checkbox", class: "switch", role: "switch", "aria-label": ct("showEmail") });
    const saveBtn = h("button", { type: "submit", class: "btn btn-filled" }, ct("save"));
    let token = null;

    const drawQr = async () => {
      qr.replaceChildren(h("span", { class: "vcard-qr-img", html: await qrSvg(cardUrl(token)) }));
    };
    const rotate = h("button", { type: "button", class: "row row-action" }, icon("qr", "row-icon"), h("span", { class: "row-text" }, h("span", { class: "row-value tint" }, ct("newCode")), h("span", { class: "row-label" }, ct("newCodeHint"))));
    let armed = false;
    rotate.addEventListener("click", async () => {
      if (!armed) {
        armed = true;
        rotate.querySelector(".row-value").textContent = ct("newCodeConfirm");
        setTimeout(() => {
          armed = false;
          rotate.querySelector(".row-value").textContent = ct("newCode");
        }, 4000);
        return;
      }
      armed = false;
      rotate.disabled = true;
      try {
        ({ token } = await api("POST", "/api/card/rotate"));
        await drawQr();
        toast(ct("newCodeDone"));
      } catch (e) {
        toast(err(e));
      } finally {
        rotate.disabled = false;
        rotate.querySelector(".row-value").textContent = ct("newCode");
      }
    });

    screen.append(
      navBar({ title: ct("myCard"), back: "/contacts", action: h("a", { href: "/contacts", "data-link": true, class: "nav-action" }, ct("contacts")) }),
      h("section", { class: "vcard" },
        h("div", { class: "vcard-face" },
          h("div", { class: "vcard-who" }, avatar(u), h("div", { class: "vcard-text" }, h("p", { class: "vcard-name" }, u.name), h("p", { class: "vcard-sub" }, subLine(u) || u.email))),
          qr,
          h("p", { class: "vcard-brand" }, "EUROXPRO'27 · Antalya")),
        h("p", { class: "vcard-hint" }, ct("cardHint"))),
      h("div", { class: "pad-x vcard-actions" }, h("button", { type: "button", class: "btn btn-filled vcard-scan", onclick: scan }, icon("scan"), ct("scan"))),
      h("form", { onsubmit: async (e) => {
        e.preventDefault();
        saveBtn.disabled = true;
        try {
          const { card } = await api("POST", "/api/card", { phone: phone.value, instagram: insta.value, linkedin: linked.value, showEmail: showEmail.checked });
          fill(card);
          haptic();
          toast(ct("saved"));
        } catch (e2) {
          toast(err(e2));
        } finally {
          saveBtn.disabled = false;
        }
      } },
        h("h2", { class: "group-header" }, ct("onCard")),
        h("div", { class: "group" },
          h("label", { class: "field" }, h("span", { class: "field-label" }, ct("phone")), phone),
          h("label", { class: "field" }, h("span", { class: "field-label" }, ct("instagram")), insta),
          h("label", { class: "field" }, h("span", { class: "field-label" }, ct("linkedin")), linked),
          h("label", { class: "field switch-row" }, h("span", { class: "field-label" }, ct("showEmail")), showEmail)),
        h("p", { class: "group-footer" }, ct("onCardHint")),
        saveBtn),
      h("div", { class: "group group-spaced" }, rotate)
    );
    const fill = (card) => {
      phone.value = card.phone || "";
      insta.value = card.instagram ? "@" + card.instagram : "";
      linked.value = card.linkedin || "";
      showEmail.checked = !!card.showEmail;
    };
    api("GET", "/api/card").then(async (d) => {
      token = d.token;
      fill(d.card);
      await drawQr();
    }).catch((e) => qr.replaceChildren(h("p", { class: "empty" }, err(e))));
  }

  // ---------------------------------------------------------------- contacts
  async function loadContacts() {
    if (!state.contacts) state.contacts = (await api("GET", "/api/contacts")).contacts;
    return state.contacts;
  }

  function openContact(c) {
    const { box, close } = gcSheet("contact-sheet");
    const actions = [];
    if (!c.blocked) {
      actions.push(h("button", { type: "button", class: "vc-act", onclick: async () => {
        try {
          const { id } = await api("POST", "/api/conversations/dm", { userId: c.id });
          close();
          go("/messages/" + encodeURIComponent(id));
        } catch (e) {
          toast(err(e));
        }
      } }, icon("messages"), h("span", {}, ct("message"))));
      if (c.phone) actions.push(h("a", { class: "vc-act", href: "tel:" + c.phone.replace(/[^+0-9]/g, "") }, icon("phone"), h("span", {}, ct("call"))));
      if (c.email) actions.push(h("a", { class: "vc-act", href: "mailto:" + c.email }, icon("mail"), h("span", {}, ct("email"))));
      if (c.instagram) actions.push(h("a", { class: "vc-act", href: "https://instagram.com/" + encodeURIComponent(c.instagram), target: "_blank", rel: "noopener noreferrer" }, icon("link"), h("span", {}, "Instagram")));
      if (c.linkedin) actions.push(h("a", { class: "vc-act", href: "https://www.linkedin.com/in/" + encodeURIComponent(c.linkedin), target: "_blank", rel: "noopener noreferrer" }, icon("link"), h("span", {}, "LinkedIn")));
    }
    const details = c.blocked ? [] : [
      c.phone ? [ct("phone"), c.phone] : null,
      c.email ? [ct("email"), c.email] : null,
      c.instagram ? ["Instagram", "@" + c.instagram] : null,
      c.linkedin ? ["LinkedIn", c.linkedin] : null,
    ].filter(Boolean);
    const note = h("textarea", { rows: 2, maxlength: 300, placeholder: ct("noteHint"), "aria-label": ct("note") }, c.note || "");
    let lastNote = c.note || "";
    const saveNote = async () => {
      if (note.value === lastNote) return;
      try {
        const r = await api("POST", `/api/contacts/${encodeURIComponent(c.id)}/note`, { note: note.value });
        lastNote = c.note = r.note;
        toast(ct("saved"));
      } catch (e) {
        toast(err(e));
      }
    };
    note.addEventListener("blur", saveNote);
    box.addEventListener("close", saveNote);
    const removeBtn = h("button", { type: "button", class: "link-btn destructive" }, ct("remove"));
    let armed = false;
    removeBtn.addEventListener("click", async () => {
      if (!armed) {
        armed = true;
        removeBtn.textContent = ct("removeConfirm");
        return;
      }
      try {
        await api("POST", `/api/contacts/${encodeURIComponent(c.id)}/delete`);
        state.contacts = (state.contacts || []).filter((x) => x.id !== c.id);
        window.dispatchEvent(new Event("contacts-updated"));
        toast(ct("removed"));
        close();
      } catch (e) {
        toast(err(e));
      }
    });
    box.replaceChildren(
      h("div", { class: "sheet-grab", "aria-hidden": "true" }),
      avatar(c, "avatar-xl"),
      h("h2", { class: "sheet-name" }, c.name),
      h("p", { class: "sheet-sub" }, subLine(c)),
      actions.length ? h("div", { class: "vc-acts" }, actions) : "",
      c.blocked ? h("p", { class: "fineprint center" }, ct("blockedNote")) : "",
      details.length ? h("div", { class: "group vc-details" }, details.map(([k, v]) => h("div", { class: "row" }, h("span", { class: "row-text" }, h("span", { class: "row-label" }, k), h("span", { class: "row-value vc-val" }, v))))) : "",
      h("label", { class: "vc-note" }, h("span", { class: "field-label" }, ct("note")), note),
      h("p", { class: "fineprint center" }, ct("savedOn", { d: new Date(c.savedAt).toLocaleDateString(locale(), { day: "numeric", month: "long" }) })),
      removeBtn
    );
  }

  function viewContacts(screen) {
    const search = h("input", { type: "search", class: "search", placeholder: ct("search"), "aria-label": ct("search"), autocomplete: "off" });
    const list = h("div", {}, h("div", { class: "loading" }));
    screen.append(
      navBar({ title: ct("contacts"), back: "/home" }),
      h("div", { class: "pad contacts-top" },
        h("button", { type: "button", class: "btn btn-filled vcard-scan", onclick: scan }, icon("scan"), ct("scan")),
        h("a", { href: "/card", "data-link": true, class: "btn btn-tinted vcard-scan" }, icon("qr"), ct("myCard"))),
      list
    );
    let items = [];
    const draw = () => {
      if (!items.length) return list.replaceChildren(h("p", { class: "empty" }, ct("noContacts")));
      const q = search.value.trim().toLocaleLowerCase(locale());
      const shown = items.filter((c) => !q || `${c.name} ${c.entity} ${c.note}`.toLocaleLowerCase(locale()).includes(q));
      list.replaceChildren(
        items.length > 6 ? h("div", { class: "pad-x" }, search) : "",
        h("h2", { class: "group-header" }, `${ct("contacts")} · ${items.length}`),
        h("div", { class: "group" }, shown.map((c) =>
          h("button", { type: "button", class: "row", onclick: () => openContact(c) },
            avatar(c),
            h("span", { class: "row-text" }, h("span", { class: "row-value" }, c.name), h("span", { class: "row-label" }, c.note || subLine(c))),
            icon("chevron", "row-chevron"))))
      );
    };
    search.addEventListener("input", draw);
    const refresh = (force) => {
      if (force) state.contacts = null;
      loadContacts().then((c) => {
        items = c;
        draw();
      }).catch((e) => list.replaceChildren(h("p", { class: "empty" }, err(e))));
    };
    refresh(true);
    const onUpdate = () => refresh(!state.contacts);
    window.addEventListener("contacts-updated", onUpdate);
    return () => window.removeEventListener("contacts-updated", onUpdate);
  }

  // Opened from a phone camera scan: /c/<code>.
  function viewCardLink(screen, { token }) {
    screen.append(navBar({ title: ct("contacts"), back: "/home" }), h("div", { class: "loading" }));
    const tok = cardTokenFrom("/c/" + token);
    (tok ? save(tok) : Promise.resolve(toast(ct("err_card_invalid")))).then((c) => {
      go("/contacts", { replace: true });
      if (c) setTimeout(() => openContact(c), 350);
    });
  }

  return { viewCard, viewContacts, viewCardLink, scan };
}
