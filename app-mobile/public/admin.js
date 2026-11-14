// EUROXPRO'27 delegate app: organizer panel and the "waiting for approval"
// screen. Kept in its own module; app.js hands in its small helpers.
// The server checks the organizer role on every admin call, so hiding these
// screens from delegates is only for tidiness, not for safety.
import { getLang, locale } from "./i18n.js";

const S = {
  tr: {
    adminTitle: "Yönetim paneli",
    adminTile: "Onaylar, kullanıcılar ve ayarlar",
    adminShort: "Yönetim",
    pendingTitle: "Onay bekleyenler",
    pendingNone: "Onay bekleyen kayıt yok.",
    approve: "Onayla",
    reject: "Reddet",
    approveAll: "Tümünü onayla ({n})",
    approvedToast: "{n} onaylandı",
    approvedAllToast: "{n} kişi onaylandı",
    rejectedToast: "{n} reddedildi",
    signedUp: "Kayıt: {d}",
    stPending: "Onay bekliyor",
    stActive: "Aktif",
    stSuspended: "Askıda",
    stRejected: "Reddedildi",
    cPending: "Onay bekleyen",
    cActive: "Aktif kullanıcı",
    cOnline: "Şu an çevrimiçi",
    cToday: "Son 24 saatte kayıt",
    cRequests: "Açık talep",
    cReservations: "Bekleyen rezervasyon",
    cMessages: "Genel sohbet mesajı",
    cQuest: "Quest oyuncusu",
    settings: "Kayıt ayarları",
    setApproval: "Yeni kayıtlar onayımı beklesin",
    setApprovalHint: "Kapalıysa yeni kayıt olan herkes uygulamaya hemen girer.",
    setSignups: "Yeni kayıtlara açık",
    setSignupsHint: "Kapalıysa kimse yeni hesap açamaz (organizatör e-postaları hariç).",
    tools: "Yönetim araçları",
    toolUsers: "Kullanıcılar",
    toolUsersSub: "Ara, düzenle, askıya al, organizatör yap, sil",
    toolChat: "Genel sohbet moderasyonu",
    toolChatSub: "Uygunsuz mesajları kaldır",
    toolAnn: "Duyuru gönder",
    toolAnnSub: "Herkese bildirimle gider",
    toolReq: "Talepler ve şikayetler",
    toolReqSub: "Yanıtla, tamamlandı işaretle",
    toolAgenda: "Programı düzenle",
    toolAgendaSub: "Oturuma dokun: saat, salon, durum, not",
    toolQuest: "Quest QR kodları ve ödüller",
    toolQuestSub: "Kodları yazdır, ödül teslimlerini işaretle",
    toolAppr: "Approvals sayıları",
    toolApprSub: "Lig tablosunu güncelle",
    toolLive: "Approvals canlı ekran",
    toolLiveSub: "Büyük ekran / projeksiyon için",
    toolStore: "Mağaza rezervasyonları",
    toolStoreSub: "Teslim et, iptal et, ürün çıkar",
    toolProducts: "Mağaza ürünleri",
    toolProductsSub: "Ürünleri aç / kapat",
    usersTitle: "Kullanıcılar",
    search: "İsim, e-posta veya ülke ara",
    fAll: "Tümü",
    fAdmins: "Organizatörler",
    noUsers: "Kimse bulunamadı.",
    organizer: "Organizatör",
    owner: "Ana yönetici",
    demo: "Örnek kişi",
    lastSeen: "Son görülme",
    never: "Henüz yok",
    joined: "Kayıt tarihi",
    approvedBy: "Onaylayan",
    language: "Dil",
    position: "Pozisyon",
    questPts: "Quest puanı",
    matchesChats: "Eşleşme / sohbet",
    actions: "İşlemler",
    suspend: "Askıya al",
    reactivate: "Yeniden etkinleştir",
    makeAdmin: "Organizatör yap",
    removeAdmin: "Organizatörlükten çıkar",
    sendMessage: "Mesaj gönder",
    resetPw: "Yeni şifre oluştur",
    resetPwHint: "Şifresini unutan kişiye bu şifreyi ilet. Giriş yaptıktan sonra değiştiremez, bu yüzden güvenli bir yoldan gönder.",
    newPw: "Yeni şifre",
    copy: "Kopyala",
    copied: "Kopyalandı",
    removePhoto: "Fotoğrafı kaldır",
    deleteUser: "Hesabı sil",
    deleteConfirm: "Emin misin? Silmek için tekrar dokun",
    deleted: "Hesap silindi",
    editProfile: "Profili düzenle",
    name: "Ad soyad",
    entity: "Ülke veya komite",
    title: "Ekip görevi",
    bio: "Hakkında",
    save: "Kaydet",
    saved: "Kaydedildi",
    selfNote: "Bu senin hesabın. Kendi rolünü veya durumunu buradan değiştiremezsin.",
    ownerNote: "Bu hesap ADMIN_EMAILS listesinde, organizatörlükten çıkarılamaz ve silinemez.",
    chatTitle: "Genel sohbet",
    chatHint: "Son 100 mesaj, en yenisi üstte. Kaldırılan mesaj herkesin ekranından silinir.",
    chatNone: "Henüz mesaj yok.",
    remove: "Kaldır",
    removed: "Mesaj kaldırıldı",
    newSignupToast: "Yeni kayıt onay bekliyor",
    waitTitle: "Hesabın onay bekliyor",
    waitBody: "Kaydın alındı. Bir organizatör hesabını onayladığında uygulama kendiliğinden açılacak. Bu sayfayı açık bırakabilir ya da daha sonra geri gelebilirsin.",
    suspTitle: "Hesabın askıya alındı",
    suspBody: "Hesabın bir organizatör tarafından geçici olarak durduruldu. Bir hata olduğunu düşünüyorsan EUROXPRO ekibiyle iletişime geç.",
    rejTitle: "Kaydın onaylanmadı",
    rejBody: "Bu hesap uygulamaya kabul edilmedi. Bir hata olduğunu düşünüyorsan EUROXPRO ekibiyle iletişime geç.",
    checkAgain: "Durumu yenile",
    stillWaiting: "Henüz onaylanmadı",
    logout: "Çıkış yap",
    welcomeIn: "Onaylandın, hoş geldin!",
    ago_now: "az önce",
    ago_m: "{n} dk önce",
    ago_h: "{n} sa önce",
    ago_d: "{n} gün önce",
    err_signups_closed: "Yeni kayıtlar şu anda kapalı.",
    err_not_approved: "Hesabın henüz onaylanmadı.",
    err_self: "Kendi hesabında bunu yapamazsın.",
    err_owner: "Ana yönetici hesabı değiştirilemez.",
    err_is_admin: "Önce organizatörlükten çıkar.",
    err_bad_role: "Bu hesabın rolü değiştirilemez.",
  },
  en: {
    adminTitle: "Organizer panel",
    adminTile: "Approvals, people and settings",
    adminShort: "Admin",
    pendingTitle: "Waiting for approval",
    pendingNone: "Nobody is waiting for approval.",
    approve: "Approve",
    reject: "Reject",
    approveAll: "Approve all ({n})",
    approvedToast: "{n} approved",
    approvedAllToast: "{n} people approved",
    rejectedToast: "{n} rejected",
    signedUp: "Signed up {d}",
    stPending: "Waiting",
    stActive: "Active",
    stSuspended: "Suspended",
    stRejected: "Rejected",
    cPending: "Waiting",
    cActive: "Active users",
    cOnline: "Online now",
    cToday: "Sign-ups, last 24 h",
    cRequests: "Open requests",
    cReservations: "Open reservations",
    cMessages: "General chat messages",
    cQuest: "Quest players",
    settings: "Sign-up settings",
    setApproval: "New sign-ups wait for approval",
    setApprovalHint: "When off, everyone who signs up gets in at once.",
    setSignups: "Open for new sign-ups",
    setSignupsHint: "When off, nobody can create an account (organizer e-mails excepted).",
    tools: "Organizer tools",
    toolUsers: "People",
    toolUsersSub: "Search, edit, suspend, make organizer, delete",
    toolChat: "General chat moderation",
    toolChatSub: "Remove inappropriate messages",
    toolAnn: "Post an announcement",
    toolAnnSub: "Goes out to everyone as a notification",
    toolReq: "Requests and complaints",
    toolReqSub: "Reply, mark done",
    toolAgenda: "Edit the agenda",
    toolAgendaSub: "Tap a session: time, room, status, note",
    toolQuest: "Quest QR codes and rewards",
    toolQuestSub: "Print codes, mark rewards handed over",
    toolAppr: "Approvals numbers",
    toolApprSub: "Update the league table",
    toolLive: "Approvals live screen",
    toolLiveSub: "For a big screen or projector",
    toolStore: "Store reservations",
    toolStoreSub: "Hand over, cancel, remove items",
    toolProducts: "Store products",
    toolProductsSub: "Turn products on or off",
    usersTitle: "People",
    search: "Search name, e-mail or country",
    fAll: "All",
    fAdmins: "Organizers",
    noUsers: "Nobody found.",
    organizer: "Organizer",
    owner: "Main admin",
    demo: "Sample person",
    lastSeen: "Last seen",
    never: "Not yet",
    joined: "Signed up",
    approvedBy: "Approved by",
    language: "Language",
    position: "Position",
    questPts: "Quest points",
    matchesChats: "Matches / chats",
    actions: "Actions",
    suspend: "Suspend",
    reactivate: "Reactivate",
    makeAdmin: "Make organizer",
    removeAdmin: "Remove organizer role",
    sendMessage: "Send a message",
    resetPw: "Create a new password",
    resetPwHint: "Pass this password on to the person who forgot theirs, through a private channel.",
    newPw: "New password",
    copy: "Copy",
    copied: "Copied",
    removePhoto: "Remove photo",
    deleteUser: "Delete account",
    deleteConfirm: "Sure? Tap again to delete",
    deleted: "Account deleted",
    editProfile: "Edit profile",
    name: "Full name",
    entity: "Country or committee",
    title: "Team role",
    bio: "About",
    save: "Save",
    saved: "Saved",
    selfNote: "This is your account. You can't change your own role or status here.",
    ownerNote: "This account is in ADMIN_EMAILS, so it can't lose the organizer role or be deleted.",
    chatTitle: "General chat",
    chatHint: "Last 100 messages, newest first. A removed message disappears from everyone's screen.",
    chatNone: "No messages yet.",
    remove: "Remove",
    removed: "Message removed",
    newSignupToast: "New sign-up waiting for approval",
    waitTitle: "Your account is waiting for approval",
    waitBody: "We got your sign-up. The app opens by itself as soon as an organizer approves your account. You can leave this page open or come back later.",
    suspTitle: "Your account is suspended",
    suspBody: "An organizer has paused your account. If you think this is a mistake, contact the EUROXPRO team.",
    rejTitle: "Your sign-up was not approved",
    rejBody: "This account was not accepted into the app. If you think this is a mistake, contact the EUROXPRO team.",
    checkAgain: "Check again",
    stillWaiting: "Not approved yet",
    logout: "Log out",
    welcomeIn: "You're approved, welcome!",
    ago_now: "just now",
    ago_m: "{n} min ago",
    ago_h: "{n} h ago",
    ago_d: "{n} d ago",
    err_signups_closed: "Sign-ups are closed right now.",
    err_not_approved: "Your account isn't approved yet.",
    err_self: "You can't do that to your own account.",
    err_owner: "The main admin account can't be changed.",
    err_is_admin: "Remove the organizer role first.",
    err_bad_role: "This account's role can't be changed.",
  },
  pl: {
    adminTitle: "Panel organizatora",
    adminTile: "Akceptacje, osoby i ustawienia",
    adminShort: "Panel",
    pendingTitle: "Czekają na akceptację",
    pendingNone: "Nikt nie czeka na akceptację.",
    approve: "Zatwierdź",
    reject: "Odrzuć",
    approveAll: "Zatwierdź wszystkich ({n})",
    approvedToast: "{n}: zatwierdzono",
    approvedAllToast: "Zatwierdzono: {n}",
    rejectedToast: "{n}: odrzucono",
    signedUp: "Rejestracja {d}",
    stPending: "Czeka",
    stActive: "Aktywne",
    stSuspended: "Zawieszone",
    stRejected: "Odrzucone",
    cPending: "Czeka",
    cActive: "Aktywni",
    cOnline: "Teraz online",
    cToday: "Rejestracje, 24 h",
    cRequests: "Otwarte zgłoszenia",
    cReservations: "Otwarte rezerwacje",
    cMessages: "Wiadomości na czacie",
    cQuest: "Gracze Quest",
    settings: "Ustawienia rejestracji",
    setApproval: "Nowe konta czekają na akceptację",
    setApprovalHint: "Gdy wyłączone, każdy nowy użytkownik od razu wchodzi do aplikacji.",
    setSignups: "Rejestracja otwarta",
    setSignupsHint: "Gdy wyłączone, nikt nie założy konta (poza e-mailami organizatorów).",
    tools: "Narzędzia organizatora",
    toolUsers: "Osoby",
    toolUsersSub: "Szukaj, edytuj, zawieś, nadaj rolę, usuń",
    toolChat: "Moderacja czatu ogólnego",
    toolChatSub: "Usuń niestosowne wiadomości",
    toolAnn: "Opublikuj ogłoszenie",
    toolAnnSub: "Trafia do wszystkich jako powiadomienie",
    toolReq: "Zgłoszenia i skargi",
    toolReqSub: "Odpowiedz, oznacz jako gotowe",
    toolAgenda: "Edytuj program",
    toolAgendaSub: "Dotknij sesji: godzina, sala, status, notatka",
    toolQuest: "Kody QR Quest i nagrody",
    toolQuestSub: "Drukuj kody, oznacz wydane nagrody",
    toolAppr: "Liczby Approvals",
    toolApprSub: "Zaktualizuj tabelę ligi",
    toolLive: "Approvals na żywo",
    toolLiveSub: "Na duży ekran lub projektor",
    toolStore: "Rezerwacje w sklepie",
    toolStoreSub: "Wydaj, anuluj, usuń pozycje",
    toolProducts: "Produkty w sklepie",
    toolProductsSub: "Włącz lub wyłącz produkty",
    usersTitle: "Osoby",
    search: "Szukaj imienia, e-maila lub kraju",
    fAll: "Wszyscy",
    fAdmins: "Organizatorzy",
    noUsers: "Nikogo nie znaleziono.",
    organizer: "Organizator",
    owner: "Główny admin",
    demo: "Przykładowa osoba",
    lastSeen: "Ostatnio widziany",
    never: "Jeszcze nie",
    joined: "Rejestracja",
    approvedBy: "Zatwierdził(a)",
    language: "Język",
    position: "Stanowisko",
    questPts: "Punkty Quest",
    matchesChats: "Dopasowania / czaty",
    actions: "Działania",
    suspend: "Zawieś",
    reactivate: "Przywróć",
    makeAdmin: "Nadaj rolę organizatora",
    removeAdmin: "Odbierz rolę organizatora",
    sendMessage: "Wyślij wiadomość",
    resetPw: "Utwórz nowe hasło",
    resetPwHint: "Przekaż to hasło osobie, która zapomniała swojego, prywatnym kanałem.",
    newPw: "Nowe hasło",
    copy: "Kopiuj",
    copied: "Skopiowano",
    removePhoto: "Usuń zdjęcie",
    deleteUser: "Usuń konto",
    deleteConfirm: "Na pewno? Dotknij ponownie",
    deleted: "Konto usunięte",
    editProfile: "Edytuj profil",
    name: "Imię i nazwisko",
    entity: "Kraj lub komitet",
    title: "Rola w zespole",
    bio: "O mnie",
    save: "Zapisz",
    saved: "Zapisano",
    selfNote: "To twoje konto. Nie możesz tu zmienić własnej roli ani statusu.",
    ownerNote: "To konto jest w ADMIN_EMAILS, więc nie można odebrać mu roli ani go usunąć.",
    chatTitle: "Czat ogólny",
    chatHint: "Ostatnie 100 wiadomości, najnowsze na górze. Usunięta wiadomość znika u wszystkich.",
    chatNone: "Brak wiadomości.",
    remove: "Usuń",
    removed: "Wiadomość usunięta",
    newSignupToast: "Nowa rejestracja czeka na akceptację",
    waitTitle: "Twoje konto czeka na akceptację",
    waitBody: "Otrzymaliśmy twoją rejestrację. Aplikacja otworzy się sama, gdy organizator zatwierdzi konto. Możesz zostawić tę stronę otwartą albo wrócić później.",
    suspTitle: "Twoje konto jest zawieszone",
    suspBody: "Organizator wstrzymał twoje konto. Jeśli to pomyłka, skontaktuj się z zespołem EUROXPRO.",
    rejTitle: "Rejestracja nie została zatwierdzona",
    rejBody: "To konto nie zostało przyjęte do aplikacji. Jeśli to pomyłka, skontaktuj się z zespołem EUROXPRO.",
    checkAgain: "Sprawdź ponownie",
    stillWaiting: "Jeszcze nie zatwierdzono",
    logout: "Wyloguj się",
    welcomeIn: "Zatwierdzono, witaj!",
    ago_now: "przed chwilą",
    ago_m: "{n} min temu",
    ago_h: "{n} godz. temu",
    ago_d: "{n} dni temu",
    err_signups_closed: "Rejestracja jest teraz zamknięta.",
    err_not_approved: "Twoje konto nie jest jeszcze zatwierdzone.",
    err_self: "Nie możesz tego zrobić na własnym koncie.",
    err_owner: "Konta głównego admina nie można zmienić.",
    err_is_admin: "Najpierw odbierz rolę organizatora.",
    err_bad_role: "Nie można zmienić roli tego konta.",
  },
};

// Admin text in the current language; null when the key is unknown.
export function at(key, vars = {}) {
  const s = (S[getLang()] || S.en)[key] ?? S.en[key];
  return s == null ? null : s.replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? "");
}
const a = (key, vars) => at(key, vars) ?? key;

export const SHIELD_ICON = '<svg viewBox="0 0 24 24"><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.3 7.5 9.5 4.4-1.2 7.5-4.9 7.5-9.5V6z"/><path d="m8.8 12 2.2 2.2 4.3-4.4"/></svg>';

export function makeAdmin(ctx) {
  const { h, api, toast, errText, navBar, icon, avatar, go, state, positionSelect, posLabel, haptic, langSwitch, wordmark, onApproved, onLogout } = ctx;

  const statusKey = { pending: "stPending", active: "stActive", suspended: "stSuspended", rejected: "stRejected" };
  const statusCls = { pending: "status-wait", active: "status-ok", suspended: "status-off", rejected: "status-off" };
  const statusBadge = (st) => h("span", { class: "status " + (statusCls[st] || "") }, a(statusKey[st] || "stActive"));
  const roleBadge = (u) => (u.role === "admin" ? h("span", { class: "status status-admin" }, u.owner ? a("owner") : a("organizer")) : null);
  const ago = (ms) => {
    if (!ms) return a("never");
    const m = Math.max(0, Math.round((Date.now() - ms) / 60000));
    if (m < 1) return a("ago_now");
    if (m < 60) return a("ago_m", { n: m });
    if (m < 60 * 24) return a("ago_h", { n: Math.round(m / 60) });
    return a("ago_d", { n: Math.round(m / 1440) });
  };
  const dateTime = (ms) => (ms ? new Date(ms).toLocaleString(locale(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }) : a("never"));
  const sub = (u) => [u.position && posLabel(u.position), u.entity].filter(Boolean).join(" · ");
  const guard = (screen) => {
    if (state.user?.role === "admin") return false;
    go("/home", { replace: true });
    return true;
  };
  // Destructive buttons ask for a second tap instead of a browser dialog.
  const twoTap = (label, confirmLabel, cls, action) => {
    let armed = false, timer;
    const btn = h("button", { type: "button", class: cls }, label);
    btn.addEventListener("click", async () => {
      if (!armed) {
        armed = true;
        btn.textContent = confirmLabel;
        btn.classList.add("armed");
        haptic(12);
        timer = setTimeout(() => {
          armed = false;
          btn.textContent = label;
          btn.classList.remove("armed");
        }, 4000);
        return;
      }
      clearTimeout(timer);
      btn.disabled = true;
      try {
        await action();
      } finally {
        btn.disabled = false;
      }
    });
    return btn;
  };
  const setStatus = async (u, status) => {
    await api("POST", "/api/admin/users/" + u.id, { status });
    toast(a(status === "active" ? "approvedToast" : status === "rejected" ? "rejectedToast" : "saved", { n: u.name }));
    window.dispatchEvent(new Event("admin-updated"));
  };

  // ---------------------------------------------------------------- panel
  function panel(screen) {
    if (guard(screen)) return;
    screen.classList.add("admin-screen");
    const body = h("div", {}, h("div", { class: "loading" }));
    screen.append(navBar({ title: a("adminTitle"), back: "/home" }), body);
    const stat = (n, label, href, cls = "") =>
      h(href ? "a" : "div", { class: "adm-stat " + cls, ...(href ? { href, "data-link": true } : {}) }, h("strong", {}, String(n)), h("span", {}, label));
    const tool = (href, ic, title, subtext) =>
      h("a", { href, "data-link": true, class: "row adm-tool" }, typeof ic === "string" && ic.startsWith("<svg") ? h("span", { class: "icon row-icon", "aria-hidden": "true", html: ic }) : icon(ic, "row-icon"), h("span", { class: "row-text" }, h("span", { class: "row-value" }, title), h("span", { class: "row-label" }, subtext)), icon("chevron", "row-chevron"));
    const toggle = (key, label, hint, settings) => {
      const sw = h("input", { type: "checkbox", class: "switch", role: "switch", "aria-label": label });
      sw.checked = !!settings[key];
      sw.addEventListener("change", async () => {
        sw.disabled = true;
        try {
          const r = await api("POST", "/api/admin/settings", { [key]: sw.checked });
          sw.checked = !!r.settings[key];
          toast(a("saved"));
        } catch (e) {
          sw.checked = !sw.checked;
          toast(errText(e));
        }
        sw.disabled = false;
      });
      return h("label", { class: "row adm-switch" }, h("span", { class: "row-text" }, h("span", { class: "row-value" }, label), h("span", { class: "row-label" }, hint)), sw);
    };
    const pendingCard = (u) =>
      h("article", { class: "adm-pending" },
        h("a", { href: "/admin/users/" + u.id, "data-link": true, class: "adm-who" },
          avatar(u),
          h("span", { class: "row-text" },
            h("span", { class: "row-value" }, u.name),
            h("span", { class: "row-label" }, [sub(u), u.email].filter(Boolean).join(" · ")),
            h("span", { class: "row-label" }, a("signedUp", { d: ago(u.createdAt) })))),
        h("div", { class: "adm-actions" },
          h("button", { type: "button", class: "btn btn-small adm-approve", onclick: async (e) => {
            e.currentTarget.disabled = true;
            await setStatus(u, "active").catch((err) => toast(errText(err)));
            haptic();
            load();
          } }, icon("check"), a("approve")),
          twoTap(a("reject"), a("reject") + "?", "btn btn-small btn-muted", async () => {
            await setStatus(u, "rejected").catch((err) => toast(errText(err)));
            load();
          })));

    const load = async () => {
      try {
        const d = await api("GET", "/api/admin/overview");
        const c = d.counts;
        state.adminPending = c.pending;
        window.dispatchEvent(new Event("admin-pending"));
        body.replaceChildren(
          h("div", { class: "adm-stats" },
            stat(c.pending, a("cPending"), null, c.pending ? "hot" : ""),
            stat(c.active, a("cActive"), "/admin/users"),
            stat(c.online, a("cOnline"), "/admin/users"),
            stat(c.today, a("cToday"), "/admin/users"),
            stat(c.requestsOpen, a("cRequests"), "/requests"),
            stat(c.reservations, a("cReservations"), "/store/admin"),
            stat(c.messages, a("cMessages"), "/admin/chat"),
            stat(c.questPlayers, a("cQuest"), "/quest/admin")),
          h("h2", { class: "group-header" }, `${a("pendingTitle")} · ${d.pending.length}`),
          d.pending.length
            ? h("div", { class: "adm-pending-list" },
                d.pending.length > 1
                  ? h("button", { type: "button", class: "btn btn-tinted adm-all", onclick: async (e) => {
                      e.currentTarget.disabled = true;
                      try {
                        const r = await api("POST", "/api/admin/approve-all");
                        toast(a("approvedAllToast", { n: r.approved }));
                      } catch (err) {
                        toast(errText(err));
                      }
                      load();
                    } }, icon("check"), a("approveAll", { n: d.pending.length }))
                  : null,
                d.pending.map(pendingCard))
            : h("p", { class: "empty adm-empty" }, a("pendingNone")),
          h("h2", { class: "group-header" }, a("settings")),
          h("div", { class: "group" }, toggle("approval", a("setApproval"), a("setApprovalHint"), d.settings), toggle("signups", a("setSignups"), a("setSignupsHint"), d.settings)),
          h("h2", { class: "group-header" }, a("tools")),
          h("div", { class: "group" },
            tool("/admin/users", "team", a("toolUsers"), a("toolUsersSub")),
            tool("/admin/chat", "messages", a("toolChat"), a("toolChatSub")),
            tool("/info", "megaphone", a("toolAnn"), a("toolAnnSub")),
            tool("/requests", "inbox", a("toolReq"), a("toolReqSub")),
            tool("/agenda", "agenda", a("toolAgenda"), a("toolAgendaSub"))),
          h("div", { class: "group" },
            tool("/quest/admin", "qr", a("toolQuest"), a("toolQuestSub")),
            tool("/approvals/edit", "trophy", a("toolAppr"), a("toolApprSub")),
            tool("/approvals/live", "tv", a("toolLive"), a("toolLiveSub")),
            tool("/store/admin", "list", a("toolStore"), a("toolStoreSub")),
            tool("/store", "bag", a("toolProducts"), a("toolProductsSub")))
        );
      } catch (e) {
        body.replaceChildren(h("p", { class: "empty" }, errText(e)));
      }
    };
    load();
    window.addEventListener("admin-updated", load);
    return () => window.removeEventListener("admin-updated", load);
  }

  // ---------------------------------------------------------------- people
  function users(screen) {
    if (guard(screen)) return;
    screen.classList.add("admin-screen");
    let filter = "all", q = "", list = null;
    try {
      filter = sessionStorage.getItem("admFilter") || "all";
    } catch {}
    const search = h("input", { type: "search", class: "search", placeholder: a("search"), "aria-label": a("search"), autocomplete: "off" });
    search.addEventListener("input", () => ((q = search.value.trim().toLowerCase()), draw()));
    const chips = h("div", { class: "chips chips-scroll" });
    const box = h("div", {}, h("div", { class: "loading" }));
    screen.append(navBar({ title: a("usersTitle"), back: "/admin" }), h("div", { class: "adm-search" }, search), chips, box);
    const FILTERS = [["all", "fAll"], ["pending", "stPending"], ["active", "stActive"], ["suspended", "stSuspended"], ["rejected", "stRejected"], ["admins", "fAdmins"]];
    const fits = (u, f) => f === "all" || (f === "admins" ? u.role === "admin" : u.status === f);
    const draw = () => {
      if (!list) return;
      chips.replaceChildren(...FILTERS.map(([f, k]) => h("button", { type: "button", class: "chip" + (f === filter ? " on" : ""), onclick: () => {
        filter = f;
        try {
          sessionStorage.setItem("admFilter", f);
        } catch {}
        draw();
      } }, `${a(k)} · ${list.filter((u) => fits(u, f)).length}`)));
      const shown = list.filter((u) => fits(u, filter) && (!q || `${u.name} ${u.email} ${u.entity} ${u.position}`.toLowerCase().includes(q)));
      box.replaceChildren(
        shown.length
          ? h("div", { class: "group" }, shown.map((u) =>
              h("a", { href: "/admin/users/" + u.id, "data-link": true, class: "row adm-user" },
                avatar(u),
                h("span", { class: "row-text" },
                  h("span", { class: "row-value" }, u.name),
                  h("span", { class: "row-label" }, [sub(u), u.demo ? a("demo") : u.email].filter(Boolean).join(" · ")),
                  h("span", { class: "adm-badges" }, statusBadge(u.status), roleBadge(u))),
                icon("chevron", "row-chevron"))))
          : h("p", { class: "empty" }, a("noUsers"))
      );
    };
    const load = () => api("GET", "/api/admin/users").then((d) => ((list = d.users), draw())).catch((e) => box.replaceChildren(h("p", { class: "empty" }, errText(e))));
    load();
    window.addEventListener("admin-updated", load);
    return () => window.removeEventListener("admin-updated", load);
  }

  function user(screen, { id }) {
    if (guard(screen)) return;
    screen.classList.add("admin-screen");
    const box = h("div", {}, h("div", { class: "loading" }));
    screen.append(navBar({ title: a("usersTitle"), back: "/admin/users" }), box);
    const load = async () => {
      let u;
      try {
        u = (await api("GET", "/api/admin/users/" + encodeURIComponent(id))).user;
      } catch (e) {
        return box.replaceChildren(h("p", { class: "empty" }, errText(e)));
      }
      const self = u.id === state.user.id;
      const run = (fn) => async (e) => {
        const btn = e?.currentTarget;
        if (btn) btn.disabled = true;
        try {
          await fn();
        } catch (err) {
          toast(errText(err));
        }
        if (btn) btn.disabled = false;
        load();
      };
      const post = (body) => api("POST", "/api/admin/users/" + u.id, body);
      const info = (label, value) => h("div", { class: "row" }, h("span", { class: "row-text" }, h("span", { class: "row-label" }, label), h("span", { class: "row-value" }, value)));
      const action = (label, ic, onclick, cls = "") => h("button", { type: "button", class: "row row-action " + cls, onclick }, ic ? icon(ic, "row-icon") : null, h("span", { class: "row-text" }, h("span", { class: "row-value tint" }, label)));

      const actions = [];
      if (!self && u.role !== "admin") {
        if (u.status !== "active") actions.push(action(u.status === "pending" ? a("approve") : a("reactivate"), "check", run(() => setStatus(u, "active"))));
        if (u.status === "pending") actions.push(action(a("reject"), "xmark", run(() => setStatus(u, "rejected"))));
        if (u.status === "active") actions.push(action(a("suspend"), "xmark", run(() => setStatus(u, "suspended"))));
      }
      if (!self && !u.owner && !u.demo) actions.push(action(u.role === "admin" ? a("removeAdmin") : a("makeAdmin"), "team", run(async () => {
        await post({ role: u.role === "admin" ? "delegate" : "admin" });
        toast(a("saved"));
      })));
      if (!self && u.status === "active") actions.push(action(a("sendMessage"), "messages", run(async () => {
        const r = await api("POST", "/api/conversations/dm", { userId: u.id });
        go("/messages/" + encodeURIComponent(r.id));
      })));
      const pwOut = h("div", { class: "adm-pw", hidden: true });
      if (!u.demo && (!u.owner || self))
        actions.push(action(a("resetPw"), "compose", async (e) => {
          const btn = e.currentTarget;
          btn.disabled = true;
          try {
            const { password } = await api("POST", `/api/admin/users/${u.id}/password`);
            const copyBtn = h("button", { type: "button", class: "btn btn-small", onclick: async () => {
              try {
                await navigator.clipboard.writeText(password);
                toast(a("copied"));
              } catch {}
            } }, a("copy"));
            pwOut.replaceChildren(h("span", { class: "row-label" }, a("newPw")), h("div", { class: "adm-pw-line" }, h("code", {}, password), copyBtn), h("p", { class: "row-label" }, a("resetPwHint")));
            pwOut.hidden = false;
          } catch (err) {
            toast(errText(err));
          }
          btn.disabled = false;
        }));
      if (u.photo) actions.push(action(a("removePhoto"), "profile", run(() => post({ photo: "" }))));

      // Profile fields an organizer can correct.
      const nameIn = h("input", { type: "text", value: u.name, maxlength: 60, "aria-label": a("name") });
      const entityIn = h("input", { type: "text", value: u.entity, maxlength: 60, "aria-label": a("entity") });
      const posIn = positionSelect(u.position || "");
      const titleIn = u.role === "admin" ? h("input", { type: "text", value: u.title || "", maxlength: 40, "aria-label": a("title") }) : null;
      const bioIn = h("textarea", { rows: 2, maxlength: 160, "aria-label": a("bio") }, u.bio || "");
      const fieldRow = (label, input) => h("label", { class: "field" }, h("span", { class: "field-label" }, label), input);
      const form = h("form", { class: "adm-form", onsubmit: async (e) => {
        e.preventDefault();
        try {
          await post({ name: nameIn.value, entity: entityIn.value, position: posIn.value, bio: bioIn.value, ...(titleIn ? { title: titleIn.value } : {}) });
          toast(a("saved"));
          load();
        } catch (err) {
          toast(errText(err));
        }
      } },
        h("div", { class: "group" }, fieldRow(a("name"), nameIn), fieldRow(a("entity"), entityIn), fieldRow(a("position"), posIn), titleIn ? fieldRow(a("title"), titleIn) : null, fieldRow(a("bio"), bioIn)),
        h("button", { type: "submit", class: "btn btn-filled" }, a("save")));

      box.replaceChildren(...[
        h("div", { class: "profile-head adm-head" },
          avatar(u, "avatar-lg"),
          h("div", {},
            h("p", { class: "profile-name" }, u.name),
            h("p", { class: "profile-sub" }, u.demo ? a("demo") : u.email),
            h("span", { class: "adm-badges" }, statusBadge(u.status), roleBadge(u)))),
        self ? h("p", { class: "fineprint" }, a("selfNote")) : u.owner ? h("p", { class: "fineprint" }, a("ownerNote")) : null,
        h("h2", { class: "group-header" }, a("actions")),
        actions.length ? h("div", { class: "group" }, actions) : null,
        pwOut,
        h("div", { class: "group group-spaced" },
          info(a("joined"), dateTime(u.createdAt)),
          info(a("lastSeen"), ago(u.lastSeen)),
          u.approvedBy ? info(a("approvedBy"), `${u.approvedBy} · ${dateTime(u.approvedAt)}`) : null,
          info(a("language"), String(u.lang || "").toUpperCase()),
          info(a("questPts"), `${u.points} · ${u.stations}/12`),
          info(a("matchesChats"), `${u.matches} / ${u.chats}`)),
        h("h2", { class: "group-header" }, a("editProfile")),
        form,
        !self && !u.owner
          ? h("div", { class: "adm-danger" }, twoTap(a("deleteUser"), a("deleteConfirm"), "btn adm-delete", async () => {
              try {
                await api("POST", `/api/admin/users/${u.id}/delete`);
                toast(a("deleted"));
                go("/admin/users", { replace: true });
              } catch (err) {
                toast(errText(err));
              }
            }))
          : null,
      ].filter(Boolean));
    };
    load();
  }

  // ---------------------------------------------------------------- chat moderation
  function chat(screen) {
    if (guard(screen)) return;
    screen.classList.add("admin-screen");
    const box = h("div", {}, h("div", { class: "loading" }));
    screen.append(navBar({ title: a("chatTitle"), back: "/admin" }), h("p", { class: "fineprint" }, a("chatHint")), box);
    const load = () =>
      api("GET", "/api/admin/chat").then(({ messages }) => {
        box.replaceChildren(
          messages.length
            ? h("div", { class: "group group-spaced" }, messages.map((m) =>
                h("div", { class: "row adm-msg" },
                  h("span", { class: "row-text" },
                    h("span", { class: "row-label" }, `${m.fromName} · ${dateTime(m.at)}`),
                    h("span", { class: "row-value" }, m.text)),
                  twoTap(a("remove"), a("remove") + "?", "btn btn-small btn-muted", async () => {
                    try {
                      await api("POST", `/api/admin/chat/${m.id}/delete`);
                      toast(a("removed"));
                    } catch (err) {
                      toast(errText(err));
                    }
                    load();
                  }))))
            : h("p", { class: "empty" }, a("chatNone"))
        );
      }).catch((e) => box.replaceChildren(h("p", { class: "empty" }, errText(e))));
    load();
  }

  // ---------------------------------------------------------------- waiting screen
  function waiting(screen) {
    const u = state.user;
    const st = u.status;
    screen.classList.add("wait-screen");
    const title = st === "suspended" ? a("suspTitle") : st === "rejected" ? a("rejTitle") : a("waitTitle");
    const text = st === "suspended" ? a("suspBody") : st === "rejected" ? a("rejBody") : a("waitBody");
    const check = async (manual) => {
      try {
        const { user } = await api("GET", "/api/me");
        if (user.status === "active") {
          toast(a("welcomeIn"));
          return onApproved(user);
        }
        if (user.status !== st) {
          state.user = user;
          return ctx.render();
        }
        if (manual) toast(a("stillWaiting"));
      } catch (e) {
        if (e.status === 401) return onLogout();
        if (manual) toast(errText(e));
      }
    };
    screen.append(
      h("div", { class: "wait-top" }, langSwitch(() => ctx.render())),
      h("div", { class: "wait-card" },
        wordmark(),
        h("div", { class: "wait-icon" + (st === "pending" ? " pulse" : " off"), "aria-hidden": "true" }, icon(st === "pending" ? "clock" : "xmark")),
        h("h1", { class: "wait-title" }, title),
        h("p", { class: "wait-text" }, text),
        h("div", { class: "wait-me" }, avatar(u), h("span", { class: "row-text" }, h("span", { class: "row-value" }, u.name), h("span", { class: "row-label" }, u.email))),
        h("button", { type: "button", class: "btn btn-filled", onclick: () => check(true) }, a("checkAgain")),
        h("button", { type: "button", class: "btn btn-plain wait-logout", onclick: onLogout }, a("logout")))
    );
    const timer = setInterval(() => document.visibilityState === "visible" && check(false), 10000);
    const onVis = () => document.visibilityState === "visible" && check(false);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }

  return { panel, users, user, chat, waiting };
}
