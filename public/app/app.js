// EUROXPRO'27 delegate app. Plain JavaScript modules, no framework.
import { t, setLang, getLang, detectLang, LANGS, locale } from "./i18n.js";
import { PLACES, CENTER } from "./places.js";

const root = document.getElementById("app");
// The app lives under /app on the congress website.
const BASE = "/app";
const withBase = (path) => (path.startsWith(BASE + "/") || path === BASE ? path : BASE + path);
const here = () => location.pathname.replace(/^\/app(?=\/|$)/, "") || "/";
const state = {
  user: null,
  agenda: null,
  conversations: null,
  unread: 0,
  installPrompt: null,
};
let cleanup = null; // teardown of the current view (timers, map, listeners)

// ------------------------------------------------------------------ DOM

function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "html") el.innerHTML = v; // only used with the icon constants below
    else if (k === "href" && attrs["data-link"] != null) el.setAttribute("href", withBase(v));
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

// SF Symbols-like outline icons (static strings, never user data).
const ICON = {
  agenda:
    '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  map: '<svg viewBox="0 0 24 24"><path d="M9 4.5 3.5 6.8v13l5.5-2.3 6 2.3 5.5-2.3v-13L15 6.8z"/><path d="M9 4.5v13M15 6.8v13"/></svg>',
  messages:
    '<svg viewBox="0 0 24 24"><path d="M12 4c4.97 0 9 3.36 9 7.5S16.97 19 12 19c-1.1 0-2.15-.16-3.12-.46L4.5 20l1.2-3.6C4.03 15.06 3 13.36 3 11.5 3 7.36 7.03 4 12 4z"/></svg>',
  profile:
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20c.9-3.6 3.9-5.5 7.5-5.5s6.6 1.9 7.5 5.5"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 4.5 7.5 12l7.5 7.5"/></svg>',
  chevron: '<svg viewBox="0 0 24 24"><path d="m9.5 6 6 6-6 6"/></svg>',
  compose:
    '<svg viewBox="0 0 24 24"><path d="M19.5 13v5.5a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2H11"/><path d="m17.5 3.5 3 3L12 15l-4 1 1-4z"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>',
  locate: '<svg viewBox="0 0 24 24"><path d="M20.5 3.5 3.5 10.6l7.1 2.8 2.8 7.1z"/></svg>',
  globe:
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.3 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.3-3.5-8.5S9.6 5.9 12 3.5z"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  people:
    '<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="3.3"/><path d="M3 19c.7-3 3-4.6 6-4.6s5.3 1.6 6 4.6"/><circle cx="17" cy="8" r="2.6"/><path d="M16.5 13.2c2.4.1 4.1 1.5 4.6 4"/></svg>',
  shirt: '<svg viewBox="0 0 24 24"><path d="M8.5 3.5 4 6l1.8 4 2-1V20.5h8.4V9l2 1L20 6l-4.5-2.5c-.5 1.5-1.9 2.5-3.5 2.5S9 5 8.5 3.5z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M12 15V3.5M8 7.5l4-4 4 4M7 11H5.5v9.5h13V11H17"/></svg>',
};
const icon = (name, cls = "") => h("span", { class: "icon " + cls, "aria-hidden": "true", html: ICON[name] });

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function avatar(name, cls = "") {
  return h("span", { class: "avatar " + cls, "aria-hidden": "true" }, initials(name || "?"));
}

let toastTimer;
function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = h("div", { class: "toast", role: "status" });
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

// ------------------------------------------------------------------ API

async function api(method, path, body) {
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: "same-origin",
      headers: body ? { "content-type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error("network"), { code: "network" });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || "generic"), { code: data.error || "generic", status: res.status });
  return data;
}

const errText = (e) => {
  const k = "err_" + (e.code || "generic");
  const s = t(k);
  return s === k ? t("err_generic") : s;
};

// ------------------------------------------------------------------ time
// The congress runs on Türkiye time (UTC+3 all year, no DST).

const TZ_OFFSET = 3 * 3600 * 1000;
function nowMs() {
  const sim = sessionStorage.getItem("simNow");
  return sim ? Number(sim) + (performance.now() - Number(sessionStorage.getItem("simAt") || 0)) : Date.now();
}
(() => {
  // Testing aid: ?now=2027-04-01T10:30 pretends it is that Antalya time.
  const p = new URLSearchParams(location.search).get("now");
  if (p === "off") sessionStorage.removeItem("simNow");
  else if (p) {
    const ms = Date.parse(p + "+03:00");
    if (!Number.isNaN(ms)) {
      sessionStorage.setItem("simNow", ms);
      sessionStorage.setItem("simAt", performance.now());
    }
  }
})();

function sessionTimes(day, s) {
  const [y, mo, d] = day.date.split("-").map(Number);
  const at = (hm) => {
    const [hh, mm] = hm.split(":").map(Number);
    return Date.UTC(y, mo - 1, d, hh, mm) - TZ_OFFSET;
  };
  let start = at(s.start);
  let end = at(s.end);
  if (end <= start) end += 864e5; // runs past midnight
  return { start, end };
}

function dayKeyNow() {
  return new Date(nowMs() + TZ_OFFSET).toISOString().slice(0, 10);
}

function fmtDuration(ms) {
  const min = Math.max(1, Math.round(ms / 60000));
  if (min < 60) return t("minutes", { n: min });
  const hrs = Math.floor(min / 60);
  const rest = min % 60;
  if (hrs >= 24) return t("days", { n: Math.floor(hrs / 24) });
  return rest ? `${t("hours", { n: hrs })} ${t("minutes", { n: rest })}` : t("hours", { n: hrs });
}

function fmtDay(iso, opts = { weekday: "short", day: "numeric" }) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale(), { ...opts, timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

function fmtClock(ms) {
  return new Intl.DateTimeFormat(locale(), { hour: "2-digit", minute: "2-digit" }).format(new Date(ms));
}

function fmtMsgDay(ms) {
  const d = new Date(ms);
  const today = new Date();
  const y = new Date(Date.now() - 864e5);
  const same = (a, b) => a.toDateString() === b.toDateString();
  if (same(d, today)) return t("today");
  if (same(d, y)) return t("yesterday");
  return new Intl.DateTimeFormat(locale(), { day: "numeric", month: "long" }).format(d);
}

// ------------------------------------------------------------------ router

const ROUTES = [
  { path: "/welcome", view: viewWelcome, guest: true },
  { path: "/login", view: viewLogin, guest: true },
  { path: "/register", view: viewRegister, guest: true },
  { path: "/agenda", view: viewAgenda, tab: "agenda" },
  { path: "/agenda/:id", view: viewSession, tab: "agenda" },
  { path: "/map", view: viewMap, tab: "map" },
  { path: "/messages", view: viewConversations, tab: "messages" },
  { path: "/messages/new", view: viewPeople, tab: "messages" },
  { path: "/messages/:id", view: viewChat, tab: "messages", hideTabs: true },
  { path: "/profile", view: viewProfile, tab: "profile" },
];

function match(pathname) {
  for (const r of ROUTES) {
    const keys = [];
    const re = new RegExp("^" + r.path.replace(/:(\w+)/g, (_, k) => (keys.push(k), "([^/]+)")) + "/?$");
    const m = pathname.match(re);
    if (m) return { route: r, params: Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) };
  }
  return null;
}

function go(path, { replace = false } = {}) {
  const full = withBase(path);
  if (full === location.pathname) return render();
  history[replace ? "replaceState" : "pushState"]({}, "", full);
  render();
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-link]");
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  go(a.getAttribute("href"));
});
window.addEventListener("popstate", () => render());

function render() {
  if (cleanup) cleanup();
  cleanup = null;
  const found = match(here());
  if (!found) return go(state.user ? "/agenda" : "/welcome", { replace: true });
  const { route, params } = found;
  if (route.guest && state.user) return go("/agenda", { replace: true });
  if (!route.guest && !state.user) return go("/welcome", { replace: true });

  const screen = h("main", { class: "screen" + (route.hideTabs ? " no-tabs" : "") });
  const parts = [screen];
  if (route.tab && !route.hideTabs) parts.push(tabBar(route.tab));
  root.replaceChildren(...parts);
  root.dataset.view = route.path;
  const result = route.view(screen, params);
  if (typeof result === "function") cleanup = result;
  window.scrollTo(0, 0);
}

function tabBar(active) {
  const tabs = [
    ["agenda", "/agenda", "tabAgenda"],
    ["map", "/map", "tabMap"],
    ["messages", "/messages", "tabMessages"],
    ["profile", "/profile", "tabProfile"],
  ];
  return h(
    "nav",
    { class: "tabbar", "aria-label": "EUROXPRO'27" },
    tabs.map(([name, href, label]) =>
      h(
        "a",
        { href, "data-link": true, class: "tab" + (name === active ? " active" : ""), "aria-current": name === active ? "page" : null },
        h("span", { class: "tab-icon" }, icon(name), name === "messages" ? h("span", { class: "badge", id: "unread-badge", hidden: !state.unread }, state.unread > 99 ? "99+" : state.unread) : null),
        h("span", { class: "tab-label" }, t(label))
      )
    )
  );
}

function updateBadge() {
  const b = document.getElementById("unread-badge");
  if (!b) return;
  b.hidden = !state.unread;
  b.textContent = state.unread > 99 ? "99+" : state.unread;
}

function navBar({ title, back, action }) {
  return h(
    "header",
    { class: "navbar" },
    back
      ? h("a", { href: back, "data-link": true, class: "nav-back", "aria-label": t("back") }, icon("back"), h("span", {}, t("back")))
      : h("span"),
    h("h1", { class: "nav-title" }, title),
    action || h("span")
  );
}

function largeTitle(title, action) {
  return h("header", { class: "large-title" }, h("h1", {}, title), action || null);
}

function segmented(options, value, onChange, label) {
  const wrap = h("div", { class: "segmented", role: "radiogroup", "aria-label": label || "" });
  for (const [val, text] of options) {
    const btn = h(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": String(val === value),
        class: val === value ? "on" : "",
        onclick: () => {
          for (const b of wrap.children) {
            b.classList.toggle("on", b === btn);
            b.setAttribute("aria-checked", String(b === btn));
          }
          onChange(val);
        },
      },
      text
    );
    wrap.append(btn);
  }
  return wrap;
}

// ------------------------------------------------------------------ auth views

function langSwitch(onChange) {
  return segmented(
    LANGS.map((l) => [l.code, l.short]),
    getLang(),
    (code) => {
      setLang(code);
      onChange();
    },
    t("language")
  );
}

function wordmark() {
  return h("div", { class: "wordmark", "aria-label": "EUROXPRO'27" }, h("span", {}, "EURO"), h("span", { class: "x" }, "X"), h("span", {}, "PRO"), h("span", { class: "yr" }, "’27"));
}

function viewWelcome(screen) {
  screen.classList.add("welcome");
  screen.append(
    h("div", { class: "welcome-top" }, langSwitch(render)),
    h(
      "div",
      { class: "welcome-body" },
      wordmark(),
      h("p", { class: "welcome-tagline" }, t("tagline")),
      h("p", { class: "welcome-dates" }, t("dates"))
    ),
    h(
      "div",
      { class: "welcome-actions" },
      h("a", { href: "/register", "data-link": true, class: "btn btn-filled" }, t("signup")),
      h("a", { href: "/login", "data-link": true, class: "btn btn-plain" }, t("login"))
    )
  );
}

function field({ label, name, type = "text", autocomplete, hint, value = "", required = true, maxlength, placeholder }) {
  const input = h("input", { id: "f-" + name, name, type, autocomplete, required, maxlength, placeholder, value, spellcheck: type === "text" ? null : "false", autocapitalize: type === "email" || type === "password" ? "off" : null });
  const row = h("label", { class: "field", for: "f-" + name }, h("span", { class: "field-label" }, label), input);
  if (type === "password") {
    const toggle = h("button", { type: "button", class: "field-toggle", onclick: () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      toggle.textContent = show ? t("hide") : t("show");
    } }, t("show"));
    row.append(toggle);
  }
  return { row, input, hint };
}

function authForm(screen, { title, fields, submitLabel, footer, onSubmit }) {
  const error = h("p", { class: "form-error", role: "alert", hidden: true });
  const submit = h("button", { type: "submit", class: "btn btn-filled" }, submitLabel);
  const groups = h("div", { class: "group" }, fields.map((f) => f.row));
  const hints = fields.filter((f) => f.hint).map((f) => f.hint);
  const form = h(
    "form",
    {
      class: "auth-form",
      novalidate: true,
      onsubmit: async (e) => {
        e.preventDefault();
        error.hidden = true;
        submit.disabled = true;
        try {
          await onSubmit(Object.fromEntries(new FormData(form)));
        } catch (err) {
          error.textContent = errText(err);
          error.hidden = false;
        } finally {
          submit.disabled = false;
        }
      },
    },
    groups,
    hints.length ? h("p", { class: "group-footer" }, hints.join(" · ")) : null,
    error,
    submit,
    footer
  );
  screen.append(navBar({ title: "", back: "/welcome" }), h("div", { class: "auth" }, largeTitle(title), form));
  return form;
}

async function afterAuth(user) {
  state.user = user;
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch {}
  setLang(user.lang);
  startStream();
  go("/agenda", { replace: true });
}

function viewLogin(screen) {
  authForm(screen, {
    title: t("login"),
    submitLabel: t("login"),
    fields: [
      field({ label: t("email"), name: "email", type: "email", autocomplete: "email", placeholder: "name@example.com" }),
      field({ label: t("password"), name: "password", type: "password", autocomplete: "current-password" }),
    ],
    footer: h("p", { class: "auth-switch" }, t("noAccount") + " ", h("a", { href: "/register", "data-link": true }, t("signup"))),
    onSubmit: async (data) => {
      const { user } = await api("POST", "/api/app/auth/login", data);
      await afterAuth(user);
    },
  });
}

function viewRegister(screen) {
  let lang = getLang();
  const langField = {
    row: h(
      "div",
      { class: "field field-stack" },
      h("span", { class: "field-label" }, t("language")),
      segmented(LANGS.map((l) => [l.code, l.label]), lang, (v) => (lang = v), t("language"))
    ),
  };
  const form = authForm(screen, {
    title: t("signup"),
    submitLabel: t("createAccount"),
    fields: [
      field({ label: t("name"), name: "name", autocomplete: "name", maxlength: 60 }),
      field({ label: t("email"), name: "email", type: "email", autocomplete: "email", placeholder: "name@example.com" }),
      field({ label: t("password"), name: "password", type: "password", autocomplete: "new-password", hint: t("passwordHint") }),
      field({ label: t("entity"), name: "entity", autocomplete: "organization", required: false, maxlength: 60, placeholder: t("entityHint") }),
      langField,
    ],
    footer: h("p", { class: "auth-switch" }, t("haveAccount") + " ", h("a", { href: "/login", "data-link": true }, t("login"))),
    onSubmit: async (data) => {
      const { user } = await api("POST", "/api/app/auth/register", { ...data, lang });
      await afterAuth(user);
    },
  });
  form.querySelector(".group-footer").textContent = `${t("passwordHint")}. ${t("languageHint")}`;
}

// ------------------------------------------------------------------ agenda

async function loadAgenda(force) {
  if (state.agenda && !force) return state.agenda;
  const { agenda } = await api("GET", "/api/app/agenda");
  state.agenda = agenda;
  try {
    localStorage.setItem("agenda:" + getLang(), JSON.stringify(agenda));
  } catch {}
  return agenda;
}

function cachedAgenda() {
  try {
    return JSON.parse(localStorage.getItem("agenda:" + getLang()));
  } catch {
    return null;
  }
}

function allSessions(agenda) {
  const out = [];
  for (const day of agenda.days) for (const s of day.sessions) out.push({ day, s, ...sessionTimes(day, s) });
  return out;
}

function liveCard(agenda) {
  const now = nowMs();
  const list = allSessions(agenda).filter((x) => x.s.status !== "cancelled");
  const first = list[0];
  const last = list.reduce((a, b) => (b.end > a.end ? b : a), list[0]);
  const card = h("section", { class: "live-card", "aria-live": "polite" });

  if (now < first.start - 864e5) {
    const days = Math.ceil((first.start - now) / 864e5);
    card.append(
      h("p", { class: "live-kicker" }, t("untilCongress")),
      h("p", { class: "countdown" }, t("days", { n: days })),
      h("p", { class: "live-sub" }, t("dates"))
    );
    return card;
  }
  if (now > last.end) {
    card.append(h("p", { class: "live-sub" }, t("congressOver")));
    return card;
  }

  const current = list.filter((x) => x.start <= now && now < x.end);
  const upcoming = list.filter((x) => x.start > now).sort((a, b) => a.start - b.start)[0];

  card.append(h("p", { class: "live-kicker" }, h("span", { class: "live-dot" }), t("live")));
  if (current.length) {
    for (const x of current) {
      const pct = Math.min(100, ((now - x.start) / (x.end - x.start)) * 100);
      card.append(
        h(
          "a",
          { class: "live-item", href: "/agenda/" + x.s.id, "data-link": true },
          h("span", { class: "live-label" }, t("now")),
          h("span", { class: "live-title" }, x.s.title),
          h("span", { class: "live-meta" }, `${x.s.location} · ${t("endsIn", { t: fmtDuration(x.end - now) })}`),
          h("span", { class: "progress" }, h("span", { class: "progress-bar", style: null, "data-pct": pct.toFixed(1) }))
        )
      );
    }
  } else {
    card.append(h("p", { class: "live-sub" }, t("nothingNow")));
  }
  if (upcoming) {
    card.append(
      h(
        "a",
        { class: "live-item next", href: "/agenda/" + upcoming.s.id, "data-link": true },
        h("span", { class: "live-label" }, t("next")),
        h("span", { class: "live-title" }, upcoming.s.title),
        h("span", { class: "live-meta" }, `${upcoming.s.start} · ${t("startsIn", { t: fmtDuration(upcoming.start - now) })}`)
      )
    );
  }
  // CSP blocks inline style attributes, so widths are set through the CSSOM.
  for (const bar of card.querySelectorAll(".progress-bar")) bar.style.width = bar.dataset.pct + "%";
  return card;
}

function statusBadge(s) {
  if (!s.status || s.status === "scheduled") return null;
  return h("span", { class: "status status-" + s.status }, t("status_" + s.status));
}

function sessionRow(day, s, now) {
  const { start, end } = sessionTimes(day, s);
  const live = start <= now && now < end && s.status !== "cancelled";
  const past = now >= end;
  return h(
    "a",
    {
      href: "/agenda/" + s.id,
      "data-link": true,
      class: "session" + (live ? " is-live" : "") + (past ? " is-past" : "") + (s.status === "cancelled" ? " is-cancelled" : ""),
    },
    h("span", { class: "session-time" }, h("span", {}, s.start), h("span", { class: "session-end" }, s.end)),
    h(
      "span",
      { class: "session-main" },
      h("span", { class: "session-type type-" + s.type }, live ? t("now") : t("type_" + s.type)),
      h("span", { class: "session-title" }, s.title),
      h("span", { class: "session-loc" }, s.location),
      statusBadge(s),
      s.note ? h("span", { class: "session-note" }, s.note) : null
    ),
    icon("chevron", "row-chevron")
  );
}

function viewAgenda(screen) {
  screen.append(largeTitle(t("tabAgenda")));
  const body = h("div", { class: "agenda" });
  screen.append(body);
  let selected = sessionStorage.getItem("agendaDay");
  let timer;

  const draw = (agenda) => {
    const today = dayKeyNow();
    if (!selected || !agenda.days.some((d) => d.date === selected)) {
      selected = agenda.days.some((d) => d.date === today) ? today : agenda.days[0].date;
    }
    const day = agenda.days.find((d) => d.date === selected);
    const now = nowMs();
    const days = h(
      "div",
      { class: "day-picker", role: "tablist" },
      agenda.days.map((d) =>
        h(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": String(d.date === selected),
            class: "day" + (d.date === selected ? " on" : "") + (d.date === today ? " today" : ""),
            onclick: () => {
              selected = d.date;
              sessionStorage.setItem("agendaDay", selected);
              draw(agenda);
            },
          },
          h("span", { class: "day-wd" }, fmtDay(d.date, { weekday: "short" })),
          h("span", { class: "day-num" }, fmtDay(d.date, { day: "numeric" }))
        )
      )
    );
    body.replaceChildren(
      liveCard(agenda),
      days,
      h(
        "div",
        { class: "section-head" },
        h("h2", {}, day.label),
        h("span", {}, `${fmtDay(day.date, { weekday: "long", day: "numeric", month: "long" })} · ${t("sessions", { n: day.sessions.length })}`)
      ),
      h("div", { class: "group sessions" }, day.sessions.map((s) => sessionRow(day, s, now))),
      h("p", { class: "fineprint" }, (agenda.draft ? t("draft") + " " : "") + t("localTime"))
    );
  };

  const cached = state.agenda || cachedAgenda();
  if (cached) draw(cached);
  else body.append(h("div", { class: "loading" }));
  loadAgenda(!!state.agenda)
    .then(draw)
    .catch(() => cached || body.replaceChildren(h("p", { class: "empty" }, t("err_network"))));
  timer = setInterval(() => state.agenda && draw(state.agenda), 30000);
  const onUpdate = () => state.agenda && draw(state.agenda);
  window.addEventListener("agenda-updated", onUpdate);
  return () => {
    clearInterval(timer);
    window.removeEventListener("agenda-updated", onUpdate);
  };
}

function viewSession(screen, { id }) {
  const draw = (agenda) => {
    let day, s;
    for (const d of agenda.days) {
      const f = d.sessions.find((x) => x.id === id);
      if (f) (day = d), (s = f);
    }
    if (!s) return go("/agenda", { replace: true });
    const { start, end } = sessionTimes(day, s);
    const now = nowMs();
    const live = start <= now && now < end && s.status !== "cancelled";
    const rows = [
      [ "clock", t("time"), `${fmtDay(day.date, { weekday: "long", day: "numeric", month: "long" })}, ${s.start} – ${s.end}` ],
      [ "pin", t("location"), s.location ],
      s.dressCode ? [ "shirt", t("dressCode"), s.dressCode ] : null,
    ].filter(Boolean);
    screen.replaceChildren(
      navBar({ title: t("tabAgenda"), back: "/agenda" }),
      h(
        "article",
        { class: "detail" },
        h("p", { class: "session-type type-" + s.type + (live ? " live" : "") }, live ? t("now") : t("type_" + s.type)),
        h("h1", { class: "detail-title" }, s.title),
        statusBadge(s),
        s.note ? h("p", { class: "detail-note" }, s.note) : null,
        live ? h("p", { class: "detail-live" }, t("endsIn", { t: fmtDuration(end - now) })) : null,
        h(
          "div",
          { class: "group" },
          rows.map(([ic, label, value]) =>
            h("div", { class: "row" }, icon(ic, "row-icon"), h("span", { class: "row-text" }, h("span", { class: "row-label" }, label), h("span", { class: "row-value" }, value)))
          )
        ),
        h("p", { class: "detail-desc" }, s.description),
        s.titleOriginal ? h("p", { class: "fineprint" }, t("translatedFrom")) : null,
        state.user.role === "admin" ? adminEditor(s) : null
      )
    );
  };
  const agenda = state.agenda || cachedAgenda();
  if (agenda) draw(agenda);
  loadAgenda(true).then(draw).catch(() => {});
  const onUpdate = () => state.agenda && draw(state.agenda);
  window.addEventListener("agenda-updated", onUpdate);
  return () => window.removeEventListener("agenda-updated", onUpdate);
}

// Organizers (ADMIN_EMAILS on the server) can push live changes.
function adminEditor(s) {
  let status = s.status || "scheduled";
  const start = h("input", { type: "time", value: s.start, "aria-label": t("start") });
  const end = h("input", { type: "time", value: s.end, "aria-label": t("end") });
  const loc = h("input", { type: "text", value: s.locationOriginal || s.location, maxlength: 120, "aria-label": t("location") });
  const note = h("textarea", { rows: 2, maxlength: 280, "aria-label": t("note") }, s.noteOriginal || s.note || "");
  const btn = h("button", { type: "submit", class: "btn btn-filled" }, t("save"));
  return h(
    "form",
    {
      class: "admin",
      onsubmit: async (e) => {
        e.preventDefault();
        btn.disabled = true;
        try {
          await api("PATCH", "/api/app/agenda/sessions/" + s.id, { status, start: start.value, end: end.value, location: loc.value, note: note.value });
          toast(t("saved"));
          await loadAgenda(true);
          window.dispatchEvent(new Event("agenda-updated"));
        } catch (err) {
          toast(errText(err));
        } finally {
          btn.disabled = false;
        }
      },
    },
    h("h2", { class: "group-header" }, `${t("organizer")} · ${t("editSession")}`),
    h(
      "div",
      { class: "group" },
      h("div", { class: "field field-stack" }, h("span", { class: "field-label" }, t("status")),
        segmented(["scheduled", "delayed", "moved", "cancelled"].map((v) => [v, t("status_" + v)]), status, (v) => (status = v), t("status"))),
      h("label", { class: "field" }, h("span", { class: "field-label" }, t("start")), start),
      h("label", { class: "field" }, h("span", { class: "field-label" }, t("end")), end),
      h("label", { class: "field" }, h("span", { class: "field-label" }, t("location")), loc),
      h("label", { class: "field field-stack" }, h("span", { class: "field-label" }, t("note")), note)
    ),
    btn
  );
}

// ------------------------------------------------------------------ map

const isApple = /iPhone|iPad|Macintosh/.test(navigator.userAgent);

function directionsUrl(p) {
  return isApple
    ? `https://maps.apple.com/?daddr=${p.lat},${p.lng}&q=${encodeURIComponent(p.name.en)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
}

function currentTheme() {
  const pref = document.documentElement.dataset.theme;
  if (pref === "light" || pref === "dark") return pref;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function viewMap(screen) {
  const lang = getLang();
  let cat = "all";
  let selected = null;
  const mapEl = h("div", { class: "map", role: "application", "aria-label": t("tabMap") });
  const list = h("div", { class: "group places" });
  const card = h("div", { class: "place-card", hidden: true });
  const locateBtn = h("button", { type: "button", class: "map-btn", "aria-label": t("locateMe"), title: t("locateMe") }, icon("locate"));

  screen.classList.add("map-screen");
  screen.append(
    largeTitle(t("tabMap")),
    h("div", { class: "map-wrap" }, mapEl, locateBtn, card),
    h(
      "div",
      { class: "map-sheet" },
      segmented([["all", t("all")], ["congress", t("cat_congress")], ["transport", t("cat_transport")], ["explore", t("cat_explore")]], cat, (v) => {
        cat = v;
        drawList();
      }, t("places")),
      list
    )
  );

  if (!window.L) {
    mapEl.append(h("p", { class: "empty" }, t("err_network")));
  }
  const L = window.L;
  let map, tiles, markers = {}, meMarker;
  if (L) {
    map = L.map(mapEl, { zoomControl: false, attributionControl: true }).setView(CENTER, 12);
    const fitAll = () => map.fitBounds(L.latLngBounds(PLACES.map((p) => [p.lat, p.lng])), { padding: [28, 28] });
    const setTiles = () => {
      if (tiles) tiles.remove();
      const style = currentTheme() === "dark" ? "dark_all" : "light_all";
      tiles = L.tileLayer(`https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`, {
        maxZoom: 19,
        subdomains: "abcd",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map);
    };
    setTiles();
    for (const p of PLACES) {
      const m = L.marker([p.lat, p.lng], {
        icon: L.divIcon({ className: "pin pin-" + p.cat, html: "<span></span>", iconSize: [22, 22], iconAnchor: [11, 11] }),
        title: p.name[lang],
        keyboard: true,
      }).addTo(map);
      m.on("click", () => select(p, false));
      markers[p.id] = m;
    }
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", setTiles);
    window.addEventListener("theme-changed", setTiles);
    setTimeout(() => {
      map.invalidateSize();
      fitAll();
    }, 50);
    var unbind = () => {
      mq.removeEventListener("change", setTiles);
      window.removeEventListener("theme-changed", setTiles);
      map.remove();
    };
  }

  locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation || !map) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ll = [pos.coords.latitude, pos.coords.longitude];
        if (meMarker) meMarker.setLatLng(ll);
        else meMarker = L.circleMarker(ll, { radius: 8, color: "#fff", weight: 3, fillColor: "#0a84ff", fillOpacity: 1 }).addTo(map);
        map.flyTo(ll, 14);
      },
      () => toast(t("err_generic")),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  function select(p, fly = true) {
    selected = p.id;
    for (const [pid, m] of Object.entries(markers)) m.getElement()?.classList.toggle("on", pid === p.id);
    if (map && fly) map.flyTo([p.lat, p.lng], 15, { duration: 0.6 });
    card.hidden = false;
    card.replaceChildren(
      h("div", { class: "place-card-text" }, h("strong", {}, p.name[lang]), h("span", {}, p.desc[lang])),
      h("a", { class: "btn btn-small", href: directionsUrl(p), target: "_blank", rel: "noopener" }, t("directions"))
    );
    drawList();
  }

  function drawList() {
    const items = PLACES.filter((p) => cat === "all" || p.cat === cat);
    const rows = items.map((p) =>
      h(
        "button",
        { type: "button", class: "row place" + (p.id === selected ? " on" : ""), onclick: () => { select(p); mapEl.scrollIntoView({ behavior: "smooth", block: "center" }); } },
        h("span", { class: "pin-dot pin-" + p.cat }),
        h("span", { class: "row-text" }, h("span", { class: "row-value" }, p.name[lang]), h("span", { class: "row-label" }, t("cat_" + p.cat))),
        icon("chevron", "row-chevron")
      )
    );
    if (cat === "all" || cat === "congress") {
      rows.unshift(h("div", { class: "row muted" }, h("span", { class: "pin-dot pin-congress" }), h("span", { class: "row-text" }, h("span", { class: "row-value" }, t("venueTba")))));
    }
    list.replaceChildren(...rows);
  }
  drawList();
  return () => unbind && unbind();
}

// ------------------------------------------------------------------ messages

async function refreshConversations() {
  const { conversations } = await api("GET", "/api/app/conversations");
  state.conversations = conversations;
  state.unread = conversations.reduce((n, c) => n + c.unread, 0);
  updateBadge();
  return conversations;
}

function convTitle(c) {
  return c.id === "general" ? t("general") : c.peer.name;
}

function viewConversations(screen) {
  const compose = h("a", { href: "/messages/new", "data-link": true, class: "icon-btn", "aria-label": t("newMessage"), title: t("newMessage") }, icon("compose"));
  const list = h("div", { class: "group convs" });
  screen.append(largeTitle(t("tabMessages"), compose), list);
  const draw = (convs) => {
    list.replaceChildren(
      ...convs.map((c) => {
        const last = c.last;
        const preview = last ? (last.from === state.user.id ? `${t("you")}: ` : c.id === "general" ? `${last.fromName}: ` : "") + last.text : c.id === "general" ? t("generalSub") : "";
        return h(
          "a",
          { href: "/messages/" + encodeURIComponent(c.id), "data-link": true, class: "row conv" + (c.unread ? " has-unread" : "") },
          c.id === "general" ? h("span", { class: "avatar avatar-general" }, icon("people")) : avatar(c.peer.name),
          h(
            "span",
            { class: "row-text" },
            h("span", { class: "conv-top" }, h("span", { class: "row-value" }, convTitle(c)), last ? h("time", { class: "conv-time" }, fmtTime(last.at)) : null),
            h("span", { class: "conv-bottom" }, h("span", { class: "row-label conv-preview" }, preview), c.unread ? h("span", { class: "pill", "aria-label": t("unread", { n: c.unread }) }, c.unread) : null)
          )
        );
      })
    );
  };
  if (state.conversations) draw(state.conversations);
  else list.append(h("div", { class: "loading" }));
  refreshConversations().then(draw).catch((e) => toast(errText(e)));
  const onMsg = () => state.conversations && draw(state.conversations);
  window.addEventListener("conversations-updated", onMsg);
  return () => window.removeEventListener("conversations-updated", onMsg);
}

function fmtTime(ms) {
  const d = new Date(ms);
  if (d.toDateString() === new Date().toDateString()) return fmtClock(ms);
  return new Intl.DateTimeFormat(locale(), { day: "numeric", month: "short" }).format(d);
}

function viewPeople(screen) {
  const search = h("input", { type: "search", class: "search", placeholder: t("searchPeople"), "aria-label": t("searchPeople"), autocomplete: "off" });
  const list = h("div", { class: "group" });
  screen.append(navBar({ title: t("newMessage"), back: "/messages" }), h("div", { class: "pad" }, search), list);
  let people = [];
  const draw = () => {
    const q = search.value.trim().toLocaleLowerCase(locale());
    const items = people.filter((p) => !q || `${p.name} ${p.entity}`.toLocaleLowerCase(locale()).includes(q));
    if (!items.length) return list.replaceChildren(h("p", { class: "empty" }, t("noPeople")));
    list.replaceChildren(
      ...items.map((p) =>
        h(
          "button",
          {
            type: "button",
            class: "row",
            onclick: async () => {
              const { id } = await api("POST", "/api/app/conversations/dm", { userId: p.id });
              go("/messages/" + encodeURIComponent(id), { replace: true });
            },
          },
          avatar(p.name),
          h("span", { class: "row-text" }, h("span", { class: "row-value" }, p.name), h("span", { class: "row-label" }, [p.entity, LANGS.find((l) => l.code === p.lang)?.label].filter(Boolean).join(" · "))),
          icon("chevron", "row-chevron")
        )
      )
    );
  };
  search.addEventListener("input", draw);
  api("GET", "/api/app/people").then((d) => {
    people = d.people;
    draw();
  }).catch((e) => toast(errText(e)));
}

function bubble(m, prev) {
  const mine = m.from === state.user.id;
  const showName = !mine && (!prev || prev.from !== m.from) && m.conv === "general";
  let showingOriginal = false;
  const text = h("span", { class: "bubble-text" }, m.text);
  const toggle = m.translated
    ? h(
        "button",
        {
          type: "button",
          class: "translated",
          onclick: () => {
            showingOriginal = !showingOriginal;
            text.textContent = showingOriginal ? m.original : m.text;
            toggle.textContent = `${showingOriginal ? LANGS.find((l) => l.code === m.lang)?.label || m.lang : t("translatedFrom")} · ${showingOriginal ? t("showTranslation") : t("showOriginal")}`;
          },
        },
        `${t("translatedFrom")} · ${t("showOriginal")}`
      )
    : null;
  return h(
    "div",
    { class: "msg" + (mine ? " mine" : ""), "data-id": m.id },
    showName ? h("span", { class: "msg-name" }, m.fromName) : null,
    h("div", { class: "bubble", title: fmtClock(m.at) }, text, h("time", { class: "msg-time" }, fmtClock(m.at))),
    toggle
  );
}

function viewChat(screen, { id }) {
  screen.classList.add("chat-screen");
  const isGeneral = id === "general";
  const header = navBar({ title: isGeneral ? t("general") : "…", back: "/messages" });
  const scroller = h("div", { class: "chat", role: "log", "aria-live": "polite" });
  const input = h("textarea", { rows: 1, placeholder: t("messagePlaceholder"), "aria-label": t("messagePlaceholder"), maxlength: 2000, enterkeyhint: "send" });
  const sendBtn = h("button", { type: "submit", class: "send", "aria-label": t("send"), disabled: true }, icon("send"));
  const composer = h("form", { class: "composer" }, input, sendBtn);
  screen.append(header, scroller, composer);

  const messages = [];
  let lastDay = null;
  const append = (m, animate) => {
    if (messages.some((x) => x.id === m.id)) return;
    const day = fmtMsgDay(m.at);
    if (day !== lastDay) {
      scroller.append(h("p", { class: "chat-day" }, day));
      lastDay = day;
    }
    const el = bubble(m, messages[messages.length - 1]);
    if (animate) el.classList.add("pop");
    scroller.append(el);
    messages.push(m);
  };
  const toBottom = () => (scroller.scrollTop = scroller.scrollHeight);
  const markRead = () => api("POST", `/api/app/conversations/${encodeURIComponent(id)}/read`).then(refreshConversations).catch(() => {});

  api("GET", `/api/app/conversations/${encodeURIComponent(id)}/messages`)
    .then((d) => {
      const title = isGeneral ? t("general") : d.peer?.name || "";
      header.querySelector(".nav-title").replaceChildren(
        h("span", {}, title),
        h("small", {}, isGeneral ? t("generalSub") : [d.peer?.entity, LANGS.find((l) => l.code === d.peer?.lang)?.label].filter(Boolean).join(" · "))
      );
      if (!d.messages.length) scroller.append(h("p", { class: "empty chat-empty" }, t("noMessages")));
      d.messages.forEach((m) => append(m));
      toBottom();
      markRead();
    })
    .catch(() => go("/messages", { replace: true }));

  const autosize = () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 140) + "px";
    sendBtn.disabled = !input.value.trim();
  };
  input.addEventListener("input", autosize);
  input.addEventListener("keydown", (e) => {
    const touch = matchMedia("(pointer: coarse)").matches;
    if (e.key === "Enter" && !e.shiftKey && !touch && !e.isComposing) {
      e.preventDefault();
      composer.requestSubmit();
    }
  });
  composer.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    sendBtn.disabled = true;
    try {
      const { message } = await api("POST", `/api/app/conversations/${encodeURIComponent(id)}/messages`, { text });
      scroller.querySelector(".chat-empty")?.remove();
      append(message, true);
      input.value = "";
      autosize();
      toBottom();
    } catch (err) {
      toast(errText(err));
      sendBtn.disabled = false;
    }
    input.focus();
  });

  const onMsg = (e) => {
    const m = e.detail;
    if (m.conv !== id) return;
    scroller.querySelector(".chat-empty")?.remove();
    const nearBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 120;
    append(m, true);
    if (nearBottom || m.from === state.user.id) toBottom();
    markRead();
  };
  window.addEventListener("chat-message", onMsg);
  return () => window.removeEventListener("chat-message", onMsg);
}

// ------------------------------------------------------------------ live stream

// Vercel functions can't keep a connection open, so the app asks the
// server for news every few seconds while it is on screen.
const POLL_MS = 4000;
let pollTimer = null;
let syncSince = 0;

async function poll() {
  clearTimeout(pollTimer);
  if (!state.user) return;
  if (document.visibilityState === "visible" && navigator.onLine) {
    try {
      const d = await api("GET", "/api/app/sync?since=" + syncSince);
      syncSince = d.now;
      let refreshList = false;
      for (const m of d.messages) {
        window.dispatchEvent(new CustomEvent("chat-message", { detail: m }));
        const viewing = here() === "/messages/" + encodeURIComponent(m.conv) || here() === "/messages/" + m.conv;
        if (!viewing && m.from !== state.user?.id) refreshList = true;
      }
      if (refreshList) refreshConversations().then(() => window.dispatchEvent(new Event("conversations-updated"))).catch(() => {});
      if (d.agenda) {
        await loadAgenda(true);
        window.dispatchEvent(new Event("agenda-updated"));
        if (d.agendaChange && here().startsWith("/agenda")) toast(t("updatedLive"));
      }
    } catch (e) {
      if (e.status === 401) {
        state.user = null;
        return go("/welcome", { replace: true });
      }
    }
  }
  pollTimer = setTimeout(poll, POLL_MS);
}

function startStream() {
  syncSince = Date.now();
  poll();
}

function stopStream() {
  clearTimeout(pollTimer);
  pollTimer = null;
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && state.user) poll();
});

// ------------------------------------------------------------------ profile

function applyTheme(pref) {
  if (pref === "light" || pref === "dark") document.documentElement.dataset.theme = pref;
  else delete document.documentElement.dataset.theme;
  const meta = document.querySelector('meta[name="theme-color"]:not([media])');
  if (meta) meta.content = currentTheme() === "dark" ? "#000000" : "#ffffff";
  window.dispatchEvent(new Event("theme-changed"));
}

function getThemePref() {
  try {
    return localStorage.getItem("theme") || "system";
  } catch {
    return "system";
  }
}

function viewProfile(screen) {
  const u = state.user;
  const nameIn = h("input", { type: "text", value: u.name, maxlength: 60, autocomplete: "name", "aria-label": t("name") });
  const entityIn = h("input", { type: "text", value: u.entity, maxlength: 60, placeholder: t("entityHint"), "aria-label": t("entity") });
  const saveBtn = h("button", { type: "submit", class: "btn btn-filled", hidden: true }, t("save"));
  const dirty = () => (saveBtn.hidden = nameIn.value.trim() === u.name && entityIn.value.trim() === u.entity);
  nameIn.addEventListener("input", dirty);
  entityIn.addEventListener("input", dirty);

  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const ios = /iPhone|iPad/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  let installRow;
  if (standalone) installRow = h("div", { class: "row" }, icon("share", "row-icon"), h("span", { class: "row-text" }, h("span", { class: "row-value" }, t("installed"))));
  else if (state.installPrompt)
    installRow = h("button", { type: "button", class: "row row-action", onclick: async () => {
      state.installPrompt.prompt();
      await state.installPrompt.userChoice;
      state.installPrompt = null;
      render();
    } }, icon("share", "row-icon"), h("span", { class: "row-text" }, h("span", { class: "row-value tint" }, t("install"))));
  else installRow = h("div", { class: "row" }, icon("share", "row-icon"), h("span", { class: "row-text" }, h("span", { class: "row-value" }, t("install")), h("span", { class: "row-label" }, ios ? t("installHelpIos") : t("installHelpOther"))));

  screen.append(
    largeTitle(t("tabProfile")),
    h(
      "div",
      { class: "profile-head" },
      avatar(u.name, "avatar-lg"),
      h("div", {}, h("p", { class: "profile-name" }, u.name), h("p", { class: "profile-sub" }, u.email), u.role === "admin" ? h("span", { class: "status status-admin" }, t("organizer")) : null)
    ),
    h(
      "form",
      {
        onsubmit: async (e) => {
          e.preventDefault();
          try {
            const { user } = await api("PATCH", "/api/app/me", { name: nameIn.value, entity: entityIn.value });
            state.user = user;
            toast(t("saved"));
            render();
          } catch (err) {
            toast(errText(err));
          }
        },
      },
      h("h2", { class: "group-header" }, t("account")),
      h(
        "div",
        { class: "group" },
        h("label", { class: "field" }, h("span", { class: "field-label" }, t("name")), nameIn),
        h("label", { class: "field" }, h("span", { class: "field-label" }, t("entity")), entityIn)
      ),
      saveBtn
    ),
    h("h2", { class: "group-header" }, t("language")),
    h(
      "div",
      { class: "group" },
      h(
        "div",
        { class: "field field-stack" },
        segmented(LANGS.map((l) => [l.code, l.label]), u.lang, async (lang) => {
          try {
            const { user } = await api("PATCH", "/api/app/me", { lang });
            state.user = user;
            setLang(lang);
            state.agenda = null;
            state.conversations = null;
            render();
          } catch (err) {
            toast(errText(err));
          }
        }, t("language"))
      )
    ),
    h("p", { class: "group-footer" }, t("languageHint")),
    h("h2", { class: "group-header" }, t("appearance")),
    h(
      "div",
      { class: "group" },
      h(
        "div",
        { class: "field field-stack" },
        segmented([["system", t("appearance_system")], ["light", t("appearance_light")], ["dark", t("appearance_dark")]], getThemePref(), (v) => {
          try {
            localStorage.setItem("theme", v);
          } catch {}
          applyTheme(v);
        }, t("appearance"))
      )
    ),
    h("div", { class: "group group-spaced" }, installRow),
    h(
      "div",
      { class: "group group-spaced" },
      h(
        "button",
        {
          type: "button",
          class: "row row-action row-destructive",
          onclick: async () => {
            await api("POST", "/api/app/auth/logout").catch(() => {});
            stopStream();
            Object.assign(state, { user: null, agenda: null, conversations: null, unread: 0 });
            go("/welcome", { replace: true });
          },
        },
        h("span", { class: "row-text" }, h("span", { class: "row-value" }, t("logout")))
      )
    ),
    h("p", { class: "fineprint center" }, "EUROXPRO'27 · AIESEC in Türkiye")
  );
}

// ------------------------------------------------------------------ boot

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  state.installPrompt = e;
});

function offlineBanner() {
  let el = document.querySelector(".offline");
  if (navigator.onLine) return el?.remove();
  if (!el) document.body.prepend(h("div", { class: "offline", role: "status" }, t("offline")));
}
window.addEventListener("online", offlineBanner);
window.addEventListener("offline", offlineBanner);

async function boot() {
  applyTheme(getThemePref());
  setLang(detectLang());
  try {
    const { user } = await api("GET", "/api/app/me");
    state.user = user;
    setLang(user.lang);
    startStream();
    refreshConversations().catch(() => {});
  } catch (e) {
    // Offline but signed in before: keep the last known profile so the
    // saved agenda and map still open.
    if (e.code === "network") {
      try {
        state.user = JSON.parse(localStorage.getItem("user"));
      } catch {}
    }
  }
  if (state.user) {
    try {
      localStorage.setItem("user", JSON.stringify(state.user));
    } catch {}
  } else {
    try {
      localStorage.removeItem("user");
    } catch {}
  }
  offlineBanner();
  if (here() === "/" || here() === "/index.html") history.replaceState({}, "", withBase(state.user ? "/agenda" : "/welcome"));
  render();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/app/sw.js", { scope: "/app/" }).catch(() => {}));
}

boot();
