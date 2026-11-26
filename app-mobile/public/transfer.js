// EUROXPRO'27 delegate app: airport transfers.
// Organizers set up the buses that pick delegates up at the airport and put
// people on them (one by one or by pasting a list from a spreadsheet).
// Delegates see their own bus, who rides with them, and the other buses.
// app.js hands in its helpers.
import { getLang } from "./i18n.js";

export const BUS_ICON =
  '<svg viewBox="0 0 24 24"><rect x="4.5" y="3.5" width="15" height="14" rx="3"/><path d="M4.5 11h15M8 17.5V20M16 17.5V20M7.5 7h9"/><circle cx="8" cy="14.3" r=".9"/><circle cx="16" cy="14.3" r=".9"/></svg>';

const T = {
  tr: {
    title: "Havalimanı transferi",
    tile: "Otobüsün, saatin ve kimlerle gideceğin",
    myBus: "Senin otobüsün",
    noBus: "Henüz bir otobüse atanmadın",
    noBusHint: "Organizasyon ekibi otobüsleri uçuşlara göre ayarlıyor. Uçuş bilgini aşağıya yazarsan seni doğru otobüse koymaları kolaylaşır.",
    route: "Güzergah",
    when: "Kalkış",
    meet: "Buluşma noktası",
    plate: "Plaka",
    driver: "Şoför",
    call: "Ara",
    openMap: "Haritada aç",
    note: "Not",
    onBus: "Bu otobüste",
    you: "Sen",
    flight: "Uçuş bilgim",
    flightHint: "Sadece sen ve organizasyon ekibi görür.",
    flightNo: "Uçuş no",
    arrival: "İniş",
    save: "Kaydet",
    saved: "Kaydedildi",
    allBuses: "Tüm otobüsler",
    findFriend: "Bir arkadaşını ara",
    noBuses: "Otobüs listesi henüz hazır değil. Hazır olunca burada göreceksin ve bildirim gelecek.",
    people: "{n} kişi",
    seats: "{n}/{c} koltuk",
    boardedN: "{n}/{m} bindi",
    st_scheduled: "Planlandı",
    st_boarding: "Biniş başladı",
    st_departed: "Yolda",
    st_arrived: "Vardı",
    st_cancelled: "İptal",
    updated: "Transfer bilgisi güncellendi",
    // organizer
    adminTitle: "Transfer yönetimi",
    adminTile: "Otobüsler, atamalar, biniş kontrolü",
    addBus: "Otobüs ekle",
    editBus: "Otobüsü düzenle",
    import: "Listeden aktar",
    export: "CSV indir",
    buses: "Otobüs",
    seated: "Atanan",
    boarded: "Binen",
    unassigned: "Atanmamış",
    unassignedTitle: "Otobüsü olmayan delegeler",
    allSeated: "Herkes bir otobüste.",
    name: "Ad",
    namePh: "Otobüs 1",
    from: "Nereden",
    fromPh: "Antalya Havalimanı T2",
    to: "Nereye",
    toPh: "Otel",
    date: "Tarih",
    time: "Saat",
    meetPh: "Dış hatlar çıkışı, 5 numaralı kapı",
    driverPh: "Ad Soyad",
    phone: "Şoför telefonu",
    cap: "Kapasite",
    notePh: "Delegelerin görmesi gereken kısa not",
    status: "Durum",
    statusPush: "Durum, saat, yer ya da plaka değişince bu otobüstekilere bildirim gider.",
    delete: "Otobüsü sil",
    deleteConfirm: "Silinsin mi? Yolcular atanmamış olur.",
    deleted: "Silindi",
    addPeople: "Delege ekle",
    search: "Ad, e-posta ya da birim ara",
    moveTo: "Otobüse koy…",
    move: "Taşı…",
    edit: "Düzenle",
    noTime: "Saat ve güzergah eklenmedi",
    remove: "Otobüsten çıkar",
    none: "Otobüs yok",
    added: "{n} otobüse eklendi",
    emptyBus: "Bu otobüste henüz kimse yok.",
    noFlight: "uçuş yok",
    importTitle: "Listeden aktar",
    importHint: "Excel ya da Google Sheets'ten kopyalayıp yapıştır. Her satıra bir kişi: e-posta (ya da tam ad), otobüs adı, isteğe bağlı uçuş no ve iniş saati (2027-03-29 14:30). Sekme, noktalı virgül ya da virgülle ayrılabilir. Olmayan otobüsler adıyla oluşturulur.",
    importPh: "ayse@aiesec.net\tOtobüs 1\tTK2412\t2027-03-29 14:30\nluca@aiesec.net\tOtobüs 2",
    importGo: "Aktar",
    importDone: "{a} kişi atandı, {c} yeni otobüs, {f} uçuş bilgisi",
    importMissing: "Bulunamayanlar ({n}): ",
    cancel: "Vazgeç",
    close: "Kapat",
    err_bad_flight: "Uçuş numarası geçersiz görünüyor (ör. TK2412).",
    err_bad_time: "Tarih ya da saat geçersiz.",
    err_bad_phone: "Telefon numarası geçersiz görünüyor.",
    err_name_required: "Otobüse bir ad ver.",
    err_too_many: "En fazla 80 otobüs eklenebilir.",
    err_empty: "Liste boş.",
  },
  en: {
    title: "Airport transfer",
    tile: "Your bus, its time and who rides with you",
    myBus: "Your bus",
    noBus: "You're not on a bus yet",
    noBusHint: "The organizing team is matching buses to flights. Add your flight below so they can put you on the right one.",
    route: "Route",
    when: "Leaves",
    meet: "Meeting point",
    plate: "Plate",
    driver: "Driver",
    call: "Call",
    openMap: "Open in Maps",
    note: "Note",
    onBus: "On this bus",
    you: "You",
    flight: "My flight",
    flightHint: "Only you and the organizing team see this.",
    flightNo: "Flight no.",
    arrival: "Lands",
    save: "Save",
    saved: "Saved",
    allBuses: "All buses",
    findFriend: "Find a friend",
    noBuses: "The bus list isn't ready yet. You'll see it here and get a notification when it is.",
    people: "{n} people",
    seats: "{n}/{c} seats",
    boardedN: "{n}/{m} on board",
    st_scheduled: "Scheduled",
    st_boarding: "Boarding",
    st_departed: "On the way",
    st_arrived: "Arrived",
    st_cancelled: "Cancelled",
    updated: "Transfer details updated",
    adminTitle: "Transfers",
    adminTile: "Buses, seating and boarding check",
    addBus: "Add a bus",
    editBus: "Edit bus",
    import: "Import a list",
    export: "Download CSV",
    buses: "Buses",
    seated: "Seated",
    boarded: "On board",
    unassigned: "No bus",
    unassignedTitle: "Delegates without a bus",
    allSeated: "Everyone has a bus.",
    name: "Name",
    namePh: "Bus 1",
    from: "From",
    fromPh: "Antalya Airport T2",
    to: "To",
    toPh: "Hotel",
    date: "Date",
    time: "Time",
    meetPh: "International arrivals, gate 5",
    driverPh: "Full name",
    phone: "Driver's phone",
    cap: "Seats",
    notePh: "A short note delegates should see",
    status: "Status",
    statusPush: "People on this bus get a notification when the status, time, place or plate changes.",
    delete: "Delete bus",
    deleteConfirm: "Delete? Its passengers will have no bus.",
    deleted: "Deleted",
    addPeople: "Add delegates",
    search: "Search name, e-mail or entity",
    moveTo: "Put on bus…",
    move: "Move…",
    edit: "Edit",
    noTime: "No time or route yet",
    remove: "Take off this bus",
    none: "No bus",
    added: "Added to {n}",
    emptyBus: "No one on this bus yet.",
    noFlight: "no flight",
    importTitle: "Import a list",
    importHint: "Copy from Excel or Google Sheets and paste. One person per line: e-mail (or full name), bus name, then optionally flight number and landing time (2027-03-29 14:30). Tabs, semicolons or commas all work. Buses that don't exist yet are created with that name.",
    importPh: "ayse@aiesec.net\tBus 1\tTK2412\t2027-03-29 14:30\nluca@aiesec.net\tBus 2",
    importGo: "Import",
    importDone: "{a} seated, {c} new buses, {f} flights",
    importMissing: "Not found ({n}): ",
    cancel: "Cancel",
    close: "Close",
    err_bad_flight: "That flight number doesn't look right (e.g. TK2412).",
    err_bad_time: "That date or time isn't valid.",
    err_bad_phone: "That phone number doesn't look right.",
    err_name_required: "Give the bus a name.",
    err_too_many: "You can add up to 80 buses.",
    err_empty: "The list is empty.",
  },
  pl: {
    title: "Transfer z lotniska",
    tile: "Twój autobus, godzina i kto jedzie z Tobą",
    myBus: "Twój autobus",
    noBus: "Nie masz jeszcze autobusu",
    noBusHint: "Organizatorzy dopasowują autobusy do lotów. Podaj swój lot poniżej, żeby łatwiej było przydzielić Ci właściwy.",
    route: "Trasa",
    when: "Odjazd",
    meet: "Miejsce zbiórki",
    plate: "Rejestracja",
    driver: "Kierowca",
    call: "Zadzwoń",
    openMap: "Otwórz w mapach",
    note: "Uwaga",
    onBus: "W tym autobusie",
    you: "Ty",
    flight: "Mój lot",
    flightHint: "Widzisz to tylko Ty i organizatorzy.",
    flightNo: "Nr lotu",
    arrival: "Lądowanie",
    save: "Zapisz",
    saved: "Zapisano",
    allBuses: "Wszystkie autobusy",
    findFriend: "Znajdź znajomego",
    noBuses: "Lista autobusów nie jest jeszcze gotowa. Zobaczysz ją tutaj i dostaniesz powiadomienie.",
    people: "{n} os.",
    seats: "{n}/{c} miejsc",
    boardedN: "{n}/{m} w autobusie",
    st_scheduled: "Zaplanowany",
    st_boarding: "Wsiadanie",
    st_departed: "W drodze",
    st_arrived: "Dojechał",
    st_cancelled: "Odwołany",
    updated: "Zaktualizowano transfer",
    adminTitle: "Transfery",
    adminTile: "Autobusy, przydziały i kontrola wsiadania",
    addBus: "Dodaj autobus",
    editBus: "Edytuj autobus",
    import: "Importuj listę",
    export: "Pobierz CSV",
    buses: "Autobusy",
    seated: "Przydzieleni",
    boarded: "W autobusie",
    unassigned: "Bez autobusu",
    unassignedTitle: "Delegaci bez autobusu",
    allSeated: "Każdy ma autobus.",
    name: "Nazwa",
    namePh: "Autobus 1",
    from: "Skąd",
    fromPh: "Lotnisko Antalya T2",
    to: "Dokąd",
    toPh: "Hotel",
    date: "Data",
    time: "Godzina",
    meetPh: "Przyloty międzynarodowe, wyjście 5",
    driverPh: "Imię i nazwisko",
    phone: "Telefon kierowcy",
    cap: "Miejsca",
    notePh: "Krótka uwaga dla delegatów",
    status: "Status",
    statusPush: "Osoby w tym autobusie dostaną powiadomienie, gdy zmieni się status, godzina, miejsce lub rejestracja.",
    delete: "Usuń autobus",
    deleteConfirm: "Usunąć? Pasażerowie zostaną bez autobusu.",
    deleted: "Usunięto",
    addPeople: "Dodaj delegatów",
    search: "Szukaj imienia, e-maila lub komitetu",
    moveTo: "Przydziel do…",
    move: "Przenieś…",
    edit: "Edytuj",
    noTime: "Brak godziny i trasy",
    remove: "Usuń z autobusu",
    none: "Bez autobusu",
    added: "Dodano do: {n}",
    emptyBus: "Nikogo jeszcze nie ma w tym autobusie.",
    noFlight: "brak lotu",
    importTitle: "Importuj listę",
    importHint: "Skopiuj z Excela lub Arkuszy Google i wklej. Jedna osoba w wierszu: e-mail (lub imię i nazwisko), nazwa autobusu, opcjonalnie nr lotu i godzina lądowania (2027-03-29 14:30). Tabulatory, średniki lub przecinki. Brakujące autobusy zostaną utworzone.",
    importPh: "ayse@aiesec.net\tAutobus 1\tTK2412\t2027-03-29 14:30\nluca@aiesec.net\tAutobus 2",
    importGo: "Importuj",
    importDone: "Przydzielono {a}, nowe autobusy: {c}, loty: {f}",
    importMissing: "Nie znaleziono ({n}): ",
    cancel: "Anuluj",
    close: "Zamknij",
    err_bad_flight: "Numer lotu wygląda na niepoprawny (np. TK2412).",
    err_bad_time: "Niepoprawna data lub godzina.",
    err_bad_phone: "Numer telefonu wygląda na niepoprawny.",
    err_name_required: "Nadaj autobusowi nazwę.",
    err_too_many: "Można dodać maksymalnie 80 autobusów.",
    err_empty: "Lista jest pusta.",
  },
};

export function tt(key, vars = {}) {
  const s = (T[getLang()] || T.en)[key] ?? T.en[key];
  if (s == null) return "";
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

const STATUSES = ["scheduled", "boarding", "departed", "arrived", "cancelled"];

export function makeTransfer(ctx) {
  const { h, api, toast, errText, icon, state, navBar, avatar, go, gcSheet, haptic, posLabel, locale, openPerson } = ctx;
  const err = (e) => (e?.code && tt("err_" + e.code)) || errText(e);
  const busIc = (cls = "") => h("span", { class: "icon " + cls, "aria-hidden": "true", html: BUS_ICON });
  const subLine = (p) => [p.position && posLabel(p.position), p.entity].filter(Boolean).join(" · ");
  const fmtDay = (d) => (d ? new Date(d + "T12:00:00Z").toLocaleDateString(locale(), { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }) : "");
  const when = (b) => [fmtDay(b.date), b.time].filter(Boolean).join(" · ");
  const fmtFlight = (f) => (f ? [f.no, f.at && `${fmtDay(f.at.slice(0, 10))} ${f.at.slice(11)}`].filter(Boolean).join(" · ") : "");
  const statusPill = (b) => h("span", { class: "bus-status st-" + (b.status || "scheduled") }, tt("st_" + (b.status || "scheduled")));
  const mapsUrl = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  const fold = (s) => String(s || "").toLocaleLowerCase(locale()).normalize("NFD").replace(/[̀-ͯ]/g, "");

  const listen = (fn) => {
    window.addEventListener("transfer-updated", fn);
    return () => window.removeEventListener("transfer-updated", fn);
  };

  // ---------------------------------------------------------------- delegate view
  function viewTransfer(screen) {
    const admin = state.user.role === "admin";
    const body = h("div", {}, h("div", { class: "loading" }));
    screen.append(
      navBar({ title: tt("title"), back: "/home", action: admin ? h("a", { href: "/transfer/admin", "data-link": true, class: "nav-action" }, tt("adminTitle")) : null }),
      body
    );
    let data = null;
    let q = "";
    const search = h("input", { type: "search", class: "search", placeholder: tt("findFriend"), "aria-label": tt("findFriend"), autocomplete: "off" });
    const allList = h("div", {});
    search.addEventListener("input", () => {
      q = fold(search.value.trim());
      drawAll();
    });

    const row = (k, v, extra = null) => h("div", { class: "row" }, h("span", { class: "row-text" }, h("span", { class: "row-label" }, k), h("span", { class: "row-value bus-val" }, v)), extra);
    const person = (p) =>
      h("button", { type: "button", class: "row", onclick: () => (p.id === state.user.id ? go("/profile") : openPerson(p.id)) },
        avatar(p),
        h("span", { class: "row-text" }, h("span", { class: "row-value" }, p.name + (p.id === state.user.id ? ` (${tt("you")})` : "")), h("span", { class: "row-label" }, subLine(p))),
        icon("chevron", "row-chevron"));

    const myCard = (b) =>
      h("section", { class: "bus-hero" + (b.status === "cancelled" ? " off" : "") },
        h("div", { class: "bus-hero-top" }, h("span", { class: "bus-kicker" }, busIc("bus-kicker-ic"), tt("myBus")), statusPill(b)),
        h("p", { class: "bus-name" }, b.name),
        b.date || b.time ? h("p", { class: "bus-when" }, when(b)) : "",
        b.from || b.to ? h("p", { class: "bus-route" }, h("span", {}, b.from || "…"), h("span", { class: "bus-arrow", "aria-hidden": "true" }, "→"), h("span", {}, b.to || "…")) : "",
        b.cap ? h("p", { class: "bus-sub" }, tt("seats", { n: b.count, c: b.cap })) : h("p", { class: "bus-sub" }, tt("people", { n: b.count })));

    const details = (b) => {
      const rows = [
        b.meet ? row(tt("meet"), b.meet, h("a", { class: "btn btn-small btn-tinted bus-map", href: mapsUrl(b.meet + (b.from ? ", " + b.from : "")), target: "_blank", rel: "noopener noreferrer" }, icon("map"), tt("openMap"))) : null,
        b.plate ? row(tt("plate"), h("span", { class: "bus-plate" }, b.plate)) : null,
        b.driver || b.phone ? row(tt("driver"), b.driver || b.phone, b.phone ? h("a", { class: "btn btn-small btn-tinted bus-map", href: "tel:" + b.phone.replace(/[^+0-9]/g, "") }, icon("phone"), tt("call")) : null) : null,
        b.note ? row(tt("note"), b.note) : null,
      ].filter(Boolean);
      return rows.length ? h("div", { class: "group bus-details" }, rows) : "";
    };

    const flightForm = () => {
      const f = data.flight || {};
      const no = h("input", { type: "text", maxlength: 12, value: f.no || "", placeholder: "TK2412", autocapitalize: "characters", autocomplete: "off", "aria-label": tt("flightNo") });
      const at = h("input", { type: "datetime-local", value: f.at || "", "aria-label": tt("arrival") });
      const btn = h("button", { type: "submit", class: "btn btn-tinted bus-save" }, tt("save"));
      return h("form", { onsubmit: async (e) => {
        e.preventDefault();
        btn.disabled = true;
        try {
          const r = await api("POST", "/api/transfers/flight", { no: no.value, at: at.value });
          data.flight = r.flight;
          haptic();
          toast(tt("saved"));
        } catch (e2) {
          toast(err(e2));
        } finally {
          btn.disabled = false;
        }
      } },
        h("h2", { class: "group-header" }, tt("flight")),
        h("div", { class: "group" },
          h("label", { class: "field" }, h("span", { class: "field-label" }, tt("flightNo")), no),
          h("label", { class: "field" }, h("span", { class: "field-label" }, tt("arrival")), at)),
        h("p", { class: "group-footer" }, tt("flightHint")),
        btn);
    };

    const drawAll = () => {
      if (!data) return;
      const others = data.buses.filter((b) => b.id !== data.mine);
      const shown = q
        ? data.buses.map((b) => ({ b, people: b.passengers.filter((p) => fold(`${p.name} ${p.entity}`).includes(q)) })).filter((x) => x.people.length || fold(x.b.name).includes(q))
        : others.map((b) => ({ b, people: null }));
      allList.replaceChildren(...shown.map(({ b, people }) =>
        h("details", { class: "bus-item", ...(q ? { open: true } : {}) },
          h("summary", { class: "bus-sum" },
            busIc("bus-sum-ic"),
            h("span", { class: "row-text" }, h("span", { class: "row-value" }, b.name), h("span", { class: "row-label" }, [when(b), b.from && b.to ? `${b.from} → ${b.to}` : b.from || b.to].filter(Boolean).join(" · "))),
            h("span", { class: "bus-count" }, String(b.count)),
            statusPill(b)),
          b.meet ? h("p", { class: "bus-item-meet" }, icon("pin"), b.meet) : "",
          h("div", { class: "bus-people" }, (people || b.passengers).length ? (people || b.passengers).map(person) : h("p", { class: "empty" }, tt("emptyBus"))))));
    };

    const draw = () => {
      const mine = data.buses.find((b) => b.id === data.mine);
      body.replaceChildren(
        mine
          ? h("div", {}, myCard(mine), details(mine), h("h2", { class: "group-header" }, `${tt("onBus")} · ${mine.count}`), h("div", { class: "group" }, mine.passengers.map(person)))
          : h("section", { class: "bus-hero bus-hero-empty" }, h("span", { class: "bus-kicker" }, busIc("bus-kicker-ic"), tt("myBus")), h("p", { class: "bus-name" }, tt("noBus")), h("p", { class: "bus-sub" }, tt("noBusHint"))),
        flightForm(),
        h("h2", { class: "group-header" }, `${tt("allBuses")} · ${data.buses.length}`),
        data.buses.length ? h("div", {}, data.buses.length > 1 ? h("div", { class: "bus-search" }, search) : "", allList) : h("p", { class: "empty" }, tt("noBuses"))
      );
      drawAll();
    };
    const load = (quiet) =>
      api("GET", "/api/transfers").then((d) => {
        const changed = data && quiet && JSON.stringify(d.buses.find((b) => b.id === d.mine) || null) !== JSON.stringify(data.buses.find((b) => b.id === data.mine) || null);
        data = d;
        // Keep typing in the flight form undisturbed: redraw only the lists then.
        if (quiet && body.contains(document.activeElement) && document.activeElement !== search) return drawAll();
        draw();
        if (changed) toast(tt("updated"));
      }).catch((e) => body.replaceChildren(h("p", { class: "empty" }, err(e))));
    load();
    return listen(() => load(true));
  }

  // ---------------------------------------------------------------- organizer view
  function viewTransferAdmin(screen) {
    if (state.user.role !== "admin") return go("/transfer", { replace: true });
    screen.classList.add("admin-screen");
    let data = null;
    let q = "";
    const open = new Set();
    const body = h("div", {}, h("div", { class: "loading" }));
    const search = h("input", { type: "search", class: "search", placeholder: tt("search"), "aria-label": tt("search"), autocomplete: "off" });
    search.addEventListener("input", () => {
      q = fold(search.value.trim());
      draw();
    });
    screen.append(navBar({ title: tt("adminTitle"), back: "/admin", action: h("a", { href: "/transfer", "data-link": true, class: "nav-action" }, busIc("")) }), body);

    const load = () => api("GET", "/api/transfers").then((d) => ((data = d), draw())).catch((e) => body.replaceChildren(h("p", { class: "empty" }, err(e))));
    const call = async (method, url, payload, okText) => {
      try {
        const r = await api(method, url, payload);
        if (okText) toast(okText);
        haptic();
        await load();
        return r;
      } catch (e) {
        toast(err(e));
        return null;
      }
    };
    const busSelect = (current, onPick) => {
      const sel = h("select", { class: "bus-select", "aria-label": tt("moveTo") },
        h("option", { value: "__" }, current ? tt("move") : tt("moveTo")),
        ...data.buses.filter((b) => b.id !== current).map((b) => h("option", { value: b.id }, `${b.name}${b.time ? " · " + b.time : ""} (${b.count}${b.cap ? "/" + b.cap : ""})`)),
        current ? h("option", { value: "" }, tt("remove")) : null);
      sel.addEventListener("change", () => sel.value !== "__" && onPick(sel.value));
      return sel;
    };
    const match = (p) => !q || fold(`${p.name} ${p.email} ${p.entity} ${p.flight?.no || ""}`).includes(q);

    const passenger = (b, p) => {
      const box = h("input", { type: "checkbox", class: "bus-check", checked: p.boarded, "aria-label": tt("boarded") });
      box.addEventListener("change", () => call("POST", "/api/transfers/board", { bus: b.id, uid: p.id, on: box.checked }));
      return h("div", { class: "row bus-pax" + (p.boarded ? " on" : "") },
        h("label", { class: "bus-check-wrap" }, box),
        h("button", { type: "button", class: "bus-pax-who", onclick: () => go("/admin/users/" + p.id) },
          avatar(p),
          h("span", { class: "row-text" }, h("span", { class: "row-value" }, p.name), h("span", { class: "row-label" }, [p.entity, fmtFlight(p.flight) || tt("noFlight")].filter(Boolean).join(" · ")))),
        busSelect(b.id, (to) => call("POST", "/api/transfers/assign", { uids: [p.id], bus: to })));
    };

    const busCard = (b) => {
      const shown = b.passengers.filter(match);
      if (q && !shown.length && !fold(b.name).includes(q)) return null;
      const isOpen = open.has(b.id) || !!q;
      const det = h("details", { class: "bus-item bus-admin", ...(isOpen ? { open: true } : {}) },
        h("summary", { class: "bus-sum" },
          busIc("bus-sum-ic"),
          h("span", { class: "row-text" },
            h("span", { class: "row-value" }, b.name, b.plate ? h("span", { class: "bus-plate bus-plate-sm" }, b.plate) : ""),
            h("span", { class: "row-label" }, [when(b), b.from && b.to ? `${b.from} → ${b.to}` : b.from || b.to].filter(Boolean).join(" · ") || tt("noTime")),
            h("span", { class: "row-label" }, [b.cap ? tt("seats", { n: b.count, c: b.cap }) : tt("people", { n: b.count }), tt("boardedN", { n: b.boardedCount, m: b.count })].join(" · "))),
          statusPill(b)),
        h("div", { class: "chips chips-scroll bus-chips", role: "radiogroup", "aria-label": tt("status") },
          STATUSES.map((st) => h("button", { type: "button", role: "radio", "aria-checked": String(b.status === st), class: "chip" + (b.status === st ? " on" : ""), onclick: () => b.status !== st && call("POST", "/api/transfers/buses", { id: b.id, status: st }, tt("st_" + st)) }, tt("st_" + st)))),
        h("div", { class: "bus-admin-actions" },
          h("button", { type: "button", class: "btn btn-small btn-tinted", onclick: () => addPeople(b) }, icon("plus"), tt("addPeople")),
          h("button", { type: "button", class: "btn btn-small btn-muted", onclick: () => editBus(b) }, icon("compose"), tt("edit"))),
        b.cap && b.count > b.cap ? h("p", { class: "bus-warn" }, tt("seats", { n: b.count, c: b.cap })) : "",
        h("div", { class: "bus-people" }, shown.length ? shown.map((p) => passenger(b, p)) : h("p", { class: "empty" }, tt("emptyBus"))));
      det.addEventListener("toggle", () => (det.open ? open.add(b.id) : open.delete(b.id)));
      return det;
    };

    const draw = () => {
      if (!data) return;
      const seated = data.buses.reduce((a, b) => a + b.count, 0);
      const boarded = data.buses.reduce((a, b) => a + b.boardedCount, 0);
      const stat = (n, label, cls = "") => h("div", { class: "adm-stat " + cls }, h("strong", {}, String(n)), h("span", {}, label));
      const un = data.unassigned.filter(match);
      const focused = document.activeElement === search;
      body.replaceChildren(
        h("div", { class: "adm-stats bus-stats" },
          stat(data.buses.length, tt("buses")),
          stat(seated, tt("seated")),
          stat(boarded, tt("boarded")),
          stat(data.unassigned.length, tt("unassigned"), data.unassigned.length ? "hot" : "")),
        h("div", { class: "bus-toolbar" },
          h("button", { type: "button", class: "btn btn-small", onclick: () => editBus(null) }, icon("plus"), tt("addBus")),
          h("button", { type: "button", class: "btn btn-small btn-tinted", onclick: importList }, icon("list"), tt("import")),
          h("button", { type: "button", class: "btn btn-small btn-muted", onclick: exportCsv }, tt("export"))),
        h("div", { class: "bus-search" }, search),
        h("h2", { class: "group-header" }, `${tt("buses")} · ${data.buses.length}`),
        data.buses.length ? h("div", { class: "bus-list" }, data.buses.map(busCard).filter(Boolean)) : h("p", { class: "empty" }, tt("noBuses")),
        h("h2", { class: "group-header" }, `${tt("unassignedTitle")} · ${data.unassigned.length}`),
        data.unassigned.length
          ? h("div", { class: "group" }, un.slice(0, 300).map((p) =>
              h("div", { class: "row bus-pax" },
                h("button", { type: "button", class: "bus-pax-who", onclick: () => go("/admin/users/" + p.id) },
                  avatar(p),
                  h("span", { class: "row-text" }, h("span", { class: "row-value" }, p.name), h("span", { class: "row-label" }, [p.entity, fmtFlight(p.flight) || tt("noFlight")].filter(Boolean).join(" · ")))),
                data.buses.length ? busSelect(null, (to) => call("POST", "/api/transfers/assign", { uids: [p.id], bus: to }, tt("added", { n: data.buses.find((b) => b.id === to)?.name || "" }))) : "")))
          : h("p", { class: "empty" }, tt("allSeated"))
      );
      if (focused) {
        search.focus();
        search.setSelectionRange(search.value.length, search.value.length);
      }
    };

    function editBus(b) {
      const { box, close } = gcSheet("bus-sheet");
      const v = b || {};
      const input = (name, label, attrs = {}) => {
        const el = h("input", { name, value: v[name] ?? "", "aria-label": label, autocomplete: "off", ...attrs });
        return [el, h("label", { class: "field" }, h("span", { class: "field-label" }, label), el)];
      };
      const [name, fName] = input("name", tt("name"), { maxlength: 40, placeholder: tt("namePh"), required: true });
      const [date, fDate] = input("date", tt("date"), { type: "date", value: v.date || "2027-03-29" });
      const [time, fTime] = input("time", tt("time"), { type: "time" });
      const [from, fFrom] = input("from", tt("from"), { maxlength: 80, placeholder: tt("fromPh") });
      const [to, fTo] = input("to", tt("to"), { maxlength: 80, placeholder: tt("toPh") });
      const [meet, fMeet] = input("meet", tt("meet"), { maxlength: 160, placeholder: tt("meetPh") });
      const [plate, fPlate] = input("plate", tt("plate"), { maxlength: 16, placeholder: "07 ABC 123", autocapitalize: "characters" });
      const [driver, fDriver] = input("driver", tt("driver"), { maxlength: 60, placeholder: tt("driverPh") });
      const [phone, fPhone] = input("phone", tt("phone"), { type: "tel", maxlength: 24, placeholder: "+90 5xx xxx xx xx" });
      const [cap, fCap] = input("cap", tt("cap"), { type: "number", min: 0, max: 99, inputmode: "numeric", value: v.cap || "", placeholder: "50" });
      const note = h("textarea", { rows: 2, maxlength: 300, placeholder: tt("notePh"), "aria-label": tt("note") }, v.noteOriginal || v.note || "");
      const saveBtn = h("button", { type: "submit", class: "btn btn-filled" }, tt("save"));
      const delBtn = b ? h("button", { type: "button", class: "link-btn destructive bus-del" }, tt("delete")) : "";
      let armed = false;
      if (b) delBtn.addEventListener("click", async () => {
        if (!armed) {
          armed = true;
          delBtn.textContent = tt("deleteConfirm");
          return;
        }
        if (await call("POST", `/api/transfers/buses/${encodeURIComponent(b.id)}/delete`, null, tt("deleted"))) close();
      });
      box.classList.add("bus-form-sheet");
      box.replaceChildren(
        h("div", { class: "sheet-grab", "aria-hidden": "true" }),
        h("h2", { class: "sheet-name" }, b ? tt("editBus") : tt("addBus")),
        h("form", { class: "bus-form", onsubmit: async (e) => {
          e.preventDefault();
          saveBtn.disabled = true;
          const r = await call("POST", "/api/transfers/buses", { ...(b ? { id: b.id } : {}), name: name.value, date: date.value, time: time.value, from: from.value, to: to.value, meet: meet.value, plate: plate.value, driver: driver.value, phone: phone.value, cap: cap.value, note: note.value }, tt("saved"));
          saveBtn.disabled = false;
          if (r) {
            if (!b && r.bus) open.add(r.bus.id);
            close();
          }
        } },
          h("div", { class: "group" }, fName, fDate, fTime, fFrom, fTo),
          h("div", { class: "group" }, fMeet, fPlate, fDriver, fPhone, fCap,
            h("label", { class: "field field-stack" }, h("span", { class: "field-label" }, tt("note")), note)),
          b ? h("p", { class: "group-footer" }, tt("statusPush")) : "",
          saveBtn),
        delBtn
      );
      setTimeout(() => !b && name.focus(), 300);
    }

    function addPeople(b) {
      const { box, close } = gcSheet("bus-sheet");
      const s = h("input", { type: "search", class: "search", placeholder: tt("search"), "aria-label": tt("search"), autocomplete: "off" });
      const list = h("div", { class: "group bus-pick" });
      const pool = () => [
        ...data.unassigned.map((p) => ({ p, on: null })),
        ...data.buses.filter((x) => x.id !== b.id).flatMap((x) => x.passengers.map((p) => ({ p, on: x }))),
      ];
      const drawList = () => {
        const qq = fold(s.value.trim());
        const items = pool().filter(({ p }) => !qq || fold(`${p.name} ${p.email} ${p.entity} ${p.flight?.no || ""}`).includes(qq)).slice(0, 80);
        list.replaceChildren(...(items.length ? items.map(({ p, on }) =>
          h("button", { type: "button", class: "row", onclick: async (e) => {
            e.currentTarget.disabled = true;
            await call("POST", "/api/transfers/assign", { uids: [p.id], bus: b.id }, tt("added", { n: b.name }));
            drawList();
          } },
            avatar(p),
            h("span", { class: "row-text" }, h("span", { class: "row-value" }, p.name), h("span", { class: "row-label" }, [on ? on.name : null, p.entity, fmtFlight(p.flight)].filter(Boolean).join(" · "))),
            icon("plus", "row-chevron"))) : [h("p", { class: "empty" }, tt("allSeated"))]));
      };
      s.addEventListener("input", drawList);
      box.replaceChildren(h("div", { class: "sheet-grab", "aria-hidden": "true" }), h("h2", { class: "sheet-name" }, `${tt("addPeople")} · ${b.name}`), h("div", { class: "bus-sheet-search" }, s), list, h("button", { type: "button", class: "btn btn-muted bus-close", onclick: close }, tt("close")));
      drawList();
    }

    function importList() {
      const { box, close } = gcSheet("bus-sheet");
      const ta = h("textarea", { class: "bus-import", rows: 8, placeholder: tt("importPh"), "aria-label": tt("importTitle"), spellcheck: false });
      const out = h("div", {});
      const go2 = h("button", { type: "button", class: "btn btn-filled", onclick: async () => {
        go2.disabled = true;
        const r = await call("POST", "/api/transfers/import", { text: ta.value });
        go2.disabled = false;
        if (!r) return;
        toast(tt("importDone", { a: r.assigned, c: r.created, f: r.flights }));
        out.replaceChildren(
          h("p", { class: "fineprint" }, tt("importDone", { a: r.assigned, c: r.created, f: r.flights })),
          r.missingCount ? h("p", { class: "fineprint bus-warn" }, tt("importMissing", { n: r.missingCount }) + r.missing.join(", ")) : ""
        );
        if (!r.missingCount) close();
      } }, tt("importGo"));
      box.replaceChildren(h("div", { class: "sheet-grab", "aria-hidden": "true" }), h("h2", { class: "sheet-name" }, tt("importTitle")), h("p", { class: "fineprint bus-import-hint" }, tt("importHint")), ta, out, go2, h("button", { type: "button", class: "btn btn-muted bus-close", onclick: close }, tt("cancel")));
    }

    function exportCsv() {
      const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const lines = [["bus", "date", "time", "from", "to", "meet", "plate", "driver", "driver_phone", "status", "name", "email", "entity", "flight", "lands", "boarded"].join(",")];
      for (const b of data.buses) for (const p of b.passengers) lines.push([b.name, b.date, b.time, b.from, b.to, b.meet, b.plate, b.driver, b.phone, b.status, p.name, p.email, p.entity, p.flight?.no, p.flight?.at?.replace("T", " "), p.boarded ? "yes" : ""].map(esc).join(","));
      for (const p of data.unassigned) lines.push(["", "", "", "", "", "", "", "", "", "", p.name, p.email, p.entity, p.flight?.no, p.flight?.at?.replace("T", " "), ""].map(esc).join(","));
      const url = URL.createObjectURL(new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" }));
      const a = h("a", { href: url, download: "euroxpro-transfers.csv" });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }

    load();
    return listen(() => {
      // Don't redraw under an open sheet's taps or while typing a search; the next change catches up.
      if (!document.querySelector(".sheet-backdrop")) load();
    });
  }

  return { viewTransfer, viewTransferAdmin };
}
