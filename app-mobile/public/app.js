// EUROXPRO'27 delegate app. Plain JavaScript modules, no framework.
import { t, setLang, getLang, detectLang, LANGS, locale } from "./i18n.js";
import { PLACES, CENTER } from "./places.js";

const root = document.getElementById("app");
// Set to e.g. "/app" if the app is ever served from a sub-folder.
const BASE = "";
const withBase = (path) => (!BASE || path.startsWith(BASE + "/") || path === BASE ? path : BASE + path);
const here = () => (BASE && location.pathname.startsWith(BASE) ? location.pathname.slice(BASE.length) : location.pathname) || "/";
const state = {
  user: null,
  agenda: null,
  conversations: null,
  unread: 0,
  installPrompt: null,
  announcements: null,
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
  plenary:
    '<svg viewBox="0 0 24 24"><path d="M3.5 9 12 4l8.5 5M5 9v8.5M9.7 9v8.5M14.3 9v8.5M19 9v8.5M3.5 20h17"/></svg>',
  meet: '<svg viewBox="0 0 24 24"><rect x="5.5" y="3.5" width="13" height="17" rx="2.5"/><path d="M12 15.2s-3.2-2-3.2-4.1a1.8 1.8 0 0 1 3.2-1.1 1.8 1.8 0 0 1 3.2 1.1c0 2.1-3.2 4.1-3.2 4.1z"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
  xmark: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5v10h13v-10M10 19.5v-5h4v5"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24"><path d="M4 10v4h3l7 4.5v-13L7 10z"/><path d="M17.5 9a4 4 0 0 1 0 6"/></svg>',
  inbox: '<svg viewBox="0 0 24 24"><path d="M3.5 13.5 6 5.5h12l2.5 8v5h-17z"/><path d="M3.5 13.5H9a3 3 0 0 0 6 0h5.5"/></svg>',
  team: '<svg viewBox="0 0 24 24"><path d="M12 3.5 19 6v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M12 15V3.5M8 7.5l4-4 4 4M7 11H5.5v9.5h13V11H17"/></svg>',
  qr: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  tv: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 20.5h8"/></svg>',
  trophy: '<svg viewBox="0 0 24 24"><path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0zM7.5 6H4.5a3 3 0 0 0 3 4M16.5 6h3a3 3 0 0 1-3 4M12 13.5V17M8.5 20.5h7M9.5 17h5v3.5h-5z"/></svg>',
  bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12.5H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  compass: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24"><path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5zM18.5 15.5c.3 1.8 1 2.5 2.8 2.8-1.8.3-2.5 1-2.8 2.8-.3-1.8-1-2.5-2.8-2.8 1.8-.3 2.5-1 2.8-2.8z"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
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

// Person avatar: their own photo, otherwise a person silhouette on a colour
// picked from their id so the same person always looks the same.
const AVATAR_TONES = ["tone-0", "tone-1", "tone-2", "tone-3", "tone-4"];
const PERSON_SVG = '<svg viewBox="0 0 24 24" class="person-svg"><circle cx="12" cy="8.2" r="4.4"/><path d="M3.6 22.5c.5-5.1 3.9-8.3 8.4-8.3s7.9 3.2 8.4 8.3z"/></svg>';
function toneOf(p) {
  let hash = 0;
  for (const ch of p.id || p.name || "") hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}
function avatar(person, cls = "") {
  const p = typeof person === "string" ? { name: person } : person || {};
  if (p.photo) return h("span", { class: `avatar has-photo ${cls}`, "aria-hidden": "true" }, h("img", { src: p.photo, alt: "", loading: "lazy", decoding: "async" }));
  return h("span", { class: `avatar figure ${toneOf(p)} ${cls}`, "aria-hidden": "true", html: PERSON_SVG });
}
// Small standing person for the plenary hall; the head is their photo if they have one.
function figure(p) {
  return h(
    "span",
    { class: `fig ${toneOf(p)}`, "aria-hidden": "true" },
    h("span", { class: "fig-head" }, p.photo ? h("img", { src: p.photo, alt: "", loading: "lazy", decoding: "async" }) : null),
    h("span", { class: "fig-arm l" }),
    h("span", { class: "fig-arm r" }),
    h("span", { class: "fig-body" }),
    h("span", { class: "fig-leg l" }),
    h("span", { class: "fig-leg r" })
  );
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
  { path: "/home", view: viewHome, tab: "home" },
  { path: "/agenda", view: viewAgenda, tab: "agenda" },
  { path: "/agenda/:id", view: viewSession, tab: "agenda" },
  { path: "/map", view: viewMap, tab: "agenda" },
  { path: "/plenary", view: viewPlenary, tab: "home" },
  { path: "/meet", view: viewMeet, tab: "meet" },
  { path: "/messages", view: viewConversations, tab: "messages" },
  { path: "/messages/new", view: viewPeople, tab: "messages" },
  { path: "/messages/:id", view: viewChat, tab: "messages", hideTabs: true },
  { path: "/profile", view: viewProfile, tab: "profile" },
  { path: "/people", view: viewDirectory, tab: "home" },
  { path: "/team", view: viewTeam, tab: "home" },
  { path: "/info", view: viewInfo, tab: "home" },
  { path: "/requests", view: viewRequests, tab: "home" },
  { path: "/quest", view: viewQuest, tab: "home" },
  { path: "/quest/admin", view: viewQuestAdmin, tab: "home" },
  { path: "/q/:code", view: viewQuestCode, tab: "home" },
  { path: "/approvals", view: viewApprovals, tab: "home" },
  { path: "/approvals/live", view: viewApprovalsLive, hideTabs: true },
  { path: "/approvals/edit", view: viewApprovalsEdit, tab: "home" },
  { path: "/store", view: viewStore, tab: "home" },
  { path: "/world", view: viewWorld, tab: "home" },
  { path: "/recap", view: viewRecap, tab: "home" },
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
  if (!found) return go(state.user ? "/home" : "/welcome", { replace: true });
  const { route, params } = found;
  if (route.guest && state.user) return go("/home", { replace: true });
  if (!route.guest && !state.user) {
    if (route.path === "/q/:code") sessionStorage.setItem("questCode", params.code);
    return go("/welcome", { replace: true });
  }

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
    ["home", "/home", "tabHome"],
    ["agenda", "/agenda", "tabAgenda"],
    ["meet", "/meet", "tabMeet"],
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
    h("img", { class: "welcome-img", src: HERO_IMG, alt: "", decoding: "async", fetchpriority: "high" }),
    h("div", { class: "welcome-shade" }),
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
  pushResync();
  go("/home", { replace: true });
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
      const { user } = await api("POST", "/api/auth/login", data);
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
      { row: h("label", { class: "field" }, h("span", { class: "field-label" }, t("position")), positionSelect("", "position")) },
      langField,
    ],
    footer: h("p", { class: "auth-switch" }, t("haveAccount") + " ", h("a", { href: "/login", "data-link": true }, t("login"))),
    onSubmit: async (data) => {
      const { user } = await api("POST", "/api/auth/register", { ...data, lang });
      await afterAuth(user);
    },
  });
  form.querySelector(".group-footer").textContent = `${t("passwordHint")}. ${t("languageHint")}`;
}

// ------------------------------------------------------------------ agenda

async function loadAgenda(force) {
  if (state.agenda && !force) return state.agenda;
  const { agenda } = await api("GET", "/api/agenda");
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
      s.audience?.length ? h("span", { class: "session-aud" }, s.audience.map(posLabel).join(" · ")) : null,
      statusBadge(s),
      s.note ? h("span", { class: "session-note" }, s.note) : null
    ),
    icon("chevron", "row-chevron")
  );
}

function viewAgenda(screen) {
  screen.append(
    largeTitle(t("tabAgenda"), h("a", { href: "/map", "data-link": true, class: "icon-btn", "aria-label": t("tabMap"), title: t("tabMap") }, icon("map")))
  );
  const body = h("div", { class: "agenda" });
  screen.append(body);
  let selected = sessionStorage.getItem("agendaDay");
  let timer;
  const pos = state.user.position;
  let mine = pos && sessionStorage.getItem("agendaMine") === "1";
  const banner = h("div");
  latestAnnouncement().then((a) => a && banner.replaceChildren(announcementBanner(a))).catch(() => {});

  const draw = (agenda) => {
    const today = dayKeyNow();
    if (!selected || !agenda.days.some((d) => d.date === selected)) {
      selected = agenda.days.some((d) => d.date === today) ? today : agenda.days[0].date;
    }
    const day = agenda.days.find((d) => d.date === selected);
    const now = nowMs();
    const shown = day.sessions.filter((s) => !mine || forPosition(s, pos));
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
      banner,
      liveCard(agenda),
      days,
      pos
        ? h("div", { class: "pad-x" }, segmented([["all", t("all")], ["mine", `${t("myProgram")} · ${posLabel(pos)}`]], mine ? "mine" : "all", (v) => {
            mine = v === "mine";
            sessionStorage.setItem("agendaMine", mine ? "1" : "0");
            draw(agenda);
          }, t("myProgram")))
        : null,
      h(
        "div",
        { class: "section-head" },
        h("h2", {}, day.label),
        h("span", {}, `${fmtDay(day.date, { weekday: "long", day: "numeric", month: "long" })} · ${t("sessions", { n: shown.length })}`)
      ),
      h("div", { class: "group sessions" }, shown.map((s) => sessionRow(day, s, now))),
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
      [ "people", t("forPositions"), s.audience?.length ? s.audience.map(posLabel).join(", ") : t("everyone") ],
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
  const audience = new Set(s.audience || []);
  const chips = h("div", { class: "chips" }, POSITIONS.map((p) => {
    const b = h("button", { type: "button", class: "chip" + (audience.has(p) ? " on" : ""), "aria-pressed": String(audience.has(p)) }, posLabel(p));
    b.addEventListener("click", () => {
      audience.has(p) ? audience.delete(p) : audience.add(p);
      b.classList.toggle("on", audience.has(p));
      b.setAttribute("aria-pressed", String(audience.has(p)));
    });
    return b;
  }));
  const btn = h("button", { type: "submit", class: "btn btn-filled" }, t("save"));
  return h(
    "form",
    {
      class: "admin",
      onsubmit: async (e) => {
        e.preventDefault();
        btn.disabled = true;
        try {
          await api("PATCH", "/api/agenda/sessions/" + s.id, { status, start: start.value, end: end.value, location: loc.value, note: note.value, audience: [...audience] });
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
      h("label", { class: "field field-stack" }, h("span", { class: "field-label" }, t("note")), note),
      h("div", { class: "field field-stack" }, h("span", { class: "field-label" }, t("forPositions")), chips, h("span", { class: "row-label" }, t("audienceHint")))
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
    navBar({ title: t("tabMap"), back: "/agenda" }),
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
  const { conversations } = await api("GET", "/api/conversations");
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
          c.id === "general" ? h("span", { class: "avatar avatar-general" }, icon("people")) : avatar(c.peer),
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
              const { id } = await api("POST", "/api/conversations/dm", { userId: p.id });
              go("/messages/" + encodeURIComponent(id), { replace: true });
            },
          },
          avatar(p),
          h("span", { class: "row-text" }, h("span", { class: "row-value" }, p.name), h("span", { class: "row-label" }, [p.entity, LANGS.find((l) => l.code === p.lang)?.label].filter(Boolean).join(" · "))),
          icon("chevron", "row-chevron")
        )
      )
    );
  };
  search.addEventListener("input", draw);
  api("GET", "/api/people").then((d) => {
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
  const markRead = () => api("POST", `/api/conversations/${encodeURIComponent(id)}/read`).then(refreshConversations).catch(() => {});

  api("GET", `/api/conversations/${encodeURIComponent(id)}/messages`)
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
      const { message } = await api("POST", `/api/conversations/${encodeURIComponent(id)}/messages`, { text });
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

// ------------------------------------------------------------------ meet (swipe)

function matchOverlay(peer, conv) {
  const close = () => box.remove();
  const box = h(
    "div",
    { class: "overlay", role: "dialog", "aria-modal": "true", "aria-label": t("itsAMatch") },
    h(
      "div",
      { class: "match-box" },
      h("div", { class: "match-pair" }, avatar(state.user), avatar(peer)),
      h("h2", {}, t("itsAMatch")),
      h("p", {}, t("matchText", { name: peer.name })),
      h("button", { type: "button", class: "btn btn-filled", onclick: () => { close(); go("/messages/" + encodeURIComponent(conv)); } }, t("sayHello")),
      h("button", { type: "button", class: "btn btn-plain", onclick: close }, t("keepSwiping"))
    )
  );
  document.body.append(box);
  box.querySelector(".btn-filled").focus();
  celebrate();
}

function viewMeet(screen) {
  const strip = h("div", { class: "matches-strip", "aria-label": t("matches") });
  const deckEl = h("div", { class: "deck" });
  const nopeBtn = h("button", { type: "button", class: "swipe-btn nope", "aria-label": t("pass") }, icon("xmark"));
  const likeBtn = h("button", { type: "button", class: "swipe-btn like", "aria-label": t("like") }, icon("heart"));
  screen.append(
    largeTitle(t("tabMeet")),
    h("p", { class: "group-footer meet-intro" }, t("meetIntro")),
    strip,
    deckEl,
    h("div", { class: "swipe-actions" }, nopeBtn, likeBtn)
  );
  let deck = [];
  let busy = false;

  const drawMatches = async () => {
    try {
      const { matches } = await api("GET", "/api/meet/matches");
      strip.hidden = !matches.length;
      strip.replaceChildren(
        ...matches.map((m) =>
          h("a", { class: "match-chip", href: "/messages/" + encodeURIComponent(m.conv), "data-link": true }, avatar(m), h("span", {}, m.name.split(" ")[0]))
        )
      );
    } catch {}
  };

  const card = (p, behind) => {
    const langLabel = LANGS.find((l) => l.code === p.lang)?.label;
    return h(
      "article",
      { class: "card" + (behind ? " behind" : ""), "data-id": p.id, "aria-label": p.name },
      h("span", { class: "card-stamp like" }, t("like")),
      h("span", { class: "card-stamp nope" }, t("pass")),
      h("div", { class: "card-face" }, avatar(p)),
      h("h2", { class: "card-name" }, p.name),
      h("p", { class: "card-sub" }, [p.entity, langLabel].filter(Boolean).join(" · ")),
      p.bio ? h("p", { class: "card-bio" }, p.bio) : null,
      p.bioTranslated ? h("p", { class: "card-note" }, t("translatedFrom")) : null
    );
  };

  const draw = () => {
    if (!deck.length) {
      nopeBtn.disabled = likeBtn.disabled = true;
      deckEl.replaceChildren(h("div", { class: "deck-empty" }, icon("meet"), h("p", {}, t("deckEmpty"))));
      return;
    }
    nopeBtn.disabled = likeBtn.disabled = false;
    const cards = deck.slice(0, 2).map((p, i) => card(p, i === 1)).reverse();
    deckEl.replaceChildren(...cards);
    attachDrag(deckEl.lastElementChild);
  };

  const decide = async (like, el) => {
    if (busy || !deck.length) return;
    busy = true;
    const p = deck[0];
    const top = el || deckEl.querySelector(".card:not(.behind)");
    if (top) {
      top.classList.add("leaving");
      top.style.transform = `translateX(${like ? 140 : -140}%) rotate(${like ? 24 : -24}deg)`;
      top.style.opacity = "0";
    }
    try {
      const r = await api("POST", "/api/meet/swipe", { userId: p.id, like });
      if (r.match) {
        matchOverlay(r.peer, r.conv);
        drawMatches();
      }
    } catch (e) {
      toast(errText(e));
    }
    setTimeout(() => {
      deck.shift();
      busy = false;
      if (deck.length < 3) load(); else draw();
    }, 300);
  };

  function attachDrag(el) {
    if (!el) return;
    let startX = 0, startY = 0, dx = 0, dragging = false;
    const like = el.querySelector(".card-stamp.like");
    const nope = el.querySelector(".card-stamp.nope");
    el.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      dx = 0;
      el.classList.remove("snap");
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      dx = e.clientX - startX;
      const dy = (e.clientY - startY) * 0.3;
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 18}deg)`;
      like.style.opacity = String(Math.max(0, Math.min(1, dx / 90)));
      nope.style.opacity = String(Math.max(0, Math.min(1, -dx / 90)));
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(dx) > 100) return decide(dx > 0, el);
      el.classList.add("snap");
      el.style.transform = "";
      like.style.opacity = nope.style.opacity = "0";
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  const load = async () => {
    try {
      const { deck: fresh } = await api("GET", "/api/meet/deck");
      const have = new Set(deck.map((p) => p.id));
      deck = deck.concat(fresh.filter((p) => !have.has(p.id)));
    } catch (e) {
      toast(errText(e));
    }
    draw();
  };

  nopeBtn.addEventListener("click", () => decide(false));
  likeBtn.addEventListener("click", () => decide(true));
  const onKey = (e) => {
    if (e.target.closest("input, textarea")) return;
    if (e.key === "ArrowLeft") decide(false);
    if (e.key === "ArrowRight") decide(true);
  };
  document.addEventListener("keydown", onKey);
  deckEl.append(h("div", { class: "loading" }));
  load();
  drawMatches();
  return () => document.removeEventListener("keydown", onKey);
}

// ------------------------------------------------------------------ plenary hall
// An empty hall where everyone who has the app open right now walks around.

function viewPlenary(screen) {
  const hall = h(
    "div",
    { class: "hall", role: "group", "aria-label": t("tabPlenary") },
    h("div", { class: "stage" }, h("span", { class: "screen-board" }, "EUROXPRO'27"), h("span", { class: "podium" })),
    h("div", { class: "seats l" }),
    h("div", { class: "seats r" }),
    h("div", { class: "aisle" })
  );
  // Heat layer: the floor warms up where people gather.
  const heat = h("canvas", { class: "hall-heat", "aria-hidden": "true" });
  hall.prepend(heat);
  const count = h("p", { class: "hall-count", "aria-live": "polite" });
  screen.append(navBar({ title: t("tabPlenary"), back: "/home" }), h("div", { class: "pad-top" }), hall, count, h("p", { class: "fineprint" }, t("plenaryHint")));
  const walkers = new Map(); // id -> { el, x, y, timer }
  let sheet = null;
  let alive = true;

  const bounds = () => ({ w: hall.clientWidth, h: hall.clientHeight });
  const place = (w, x, y) => {
    const b = bounds();
    w.x = Math.max(4, Math.min(b.w - 64, x));
    w.y = Math.max(60, Math.min(b.h - 92, y));
    w.el.style.zIndex = String(Math.round(w.y)); // people nearer the front stand in front
    w.el.style.transform = `translate(${w.x}px, ${w.y}px)`;
  };
  const wander = (w) => {
    if (!alive) return;
    const b = bounds();
    const nx = w.x + (Math.random() - 0.5) * b.w * 0.6;
    const ny = w.y + (Math.random() - 0.5) * b.h * 0.5;
    w.el.classList.add("bob");
    place(w, nx, ny);
    clearTimeout(w.stop);
    w.stop = setTimeout(() => w.el.classList.remove("bob"), 4000);
    w.timer = setTimeout(() => wander(w), 4500 + Math.random() * 5000);
  };

  const showPerson = (p) => {
    sheet?.remove();
    const mine = p.id === state.user.id;
    sheet = h(
      "div",
      { class: "person-sheet" },
      avatar(p),
      h("span", { class: "row-text" }, h("span", { class: "row-value" }, mine ? `${p.name} (${t("you")})` : p.name), h("span", { class: "row-label" }, [p.entity, LANGS.find((l) => l.code === p.lang)?.label].filter(Boolean).join(" · "))),
      mine
        ? null
        : h("button", { type: "button", class: "btn btn-small", onclick: async () => {
            const { id } = await api("POST", "/api/conversations/dm", { userId: p.id });
            go("/messages/" + encodeURIComponent(id));
          } }, t("send"))
    );
    hall.append(sheet);
  };

  const sync = (people) => {
    const b = bounds();
    const ids = new Set(people.map((p) => p.id));
    for (const [id, w] of walkers) {
      if (!ids.has(id)) {
        clearTimeout(w.timer);
        w.el.remove();
        walkers.delete(id);
      }
    }
    for (const p of people) {
      if (walkers.has(p.id)) continue;
      const mine = p.id === state.user.id;
      const el = h(
        "button",
        { type: "button", class: "walker" + (mine ? " me" : ""), "aria-label": p.name },
        figure(p),
        h("span", { class: "walker-name" }, mine ? t("you") : p.name.split(" ")[0])
      );
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        showPerson(p);
      });
      const w = { el, x: 0, y: 0, timer: null };
      el.style.transition = "none";
      hall.append(el);
      place(w, Math.random() * b.w, 70 + Math.random() * (b.h - 130));
      requestAnimationFrame(() => (el.style.transition = ""));
      walkers.set(p.id, w);
      if (!mine) w.timer = setTimeout(() => wander(w), 600 + Math.random() * 3000);
    }
    count.textContent = t("inHall", { n: people.length });
  };

  // Tap the floor to walk your own avatar there.
  hall.addEventListener("click", (e) => {
    if (e.target.closest(".person-sheet")) return;
    sheet?.remove();
    sheet = null;
    const me = walkers.get(state.user.id);
    if (!me) return;
    const r = hall.getBoundingClientRect();
    me.el.classList.add("bob");
    place(me, e.clientX - r.left - 30, e.clientY - r.top - 62);
    clearTimeout(me.stop);
    me.stop = setTimeout(() => me.el.classList.remove("bob"), 4000);
  });

  const drawHeat = () => {
    const w = hall.clientWidth, hh = hall.clientHeight;
    if (!w) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    if (heat.width !== Math.round(w * dpr)) {
      heat.width = Math.round(w * dpr);
      heat.height = Math.round(hh * dpr);
    }
    const x = heat.getContext("2d");
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.clearRect(0, 0, w, hh);
    x.globalCompositeOperation = "lighter";
    const r = Math.max(60, w * 0.22);
    for (const p of walkers.values()) {
      const cx = p.x + 30, cy = p.y + 70;
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "rgba(240,107,91,0.32)");
      g.addColorStop(0.5, "rgba(247,178,103,0.12)");
      g.addColorStop(1, "rgba(247,178,103,0)");
      x.fillStyle = g;
      x.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
  };
  const heatTimer = setInterval(drawHeat, 700);
  const refresh = () =>
    api("GET", "/api/plenary")
      .then((d) => alive && sync(d.people))
      .catch(() => {});
  refresh();
  const timer = setInterval(() => document.visibilityState === "visible" && refresh(), 8000);
  return () => {
    alive = false;
    clearInterval(timer);
    clearInterval(heatTimer);
    for (const w of walkers.values()) clearTimeout(w.timer);
  };
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
      const d = await api("GET", "/api/sync?since=" + syncSince);
      syncSince = d.now;
      let refreshList = false;
      for (const m of d.messages) {
        window.dispatchEvent(new CustomEvent("chat-message", { detail: m }));
        const viewing = here() === "/messages/" + encodeURIComponent(m.conv) || here() === "/messages/" + m.conv;
        if (!viewing && m.from !== state.user?.id) refreshList = true;
      }
      for (const peer of d.matches || []) toast(t("matchText", { name: peer.name }));
      if (d.announce) {
        state.announcements = null;
        window.dispatchEvent(new Event("announcements-updated"));
        if (here() !== "/info") toast(t("newAnnouncementToast"));
      }
      if (d.approvals) window.dispatchEvent(new Event("approvals-updated"));
      if (d.quest) window.dispatchEvent(new Event("quest-updated"));
      if (d.request) {
        window.dispatchEvent(new Event("requests-updated"));
        if (here() !== "/requests") toast(t("requestToast"));
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

// Square JPEG made on the phone, so uploads stay small (about 20-40 KB).
async function photoDataUrl(file) {
  let src;
  try {
    src = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    src = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
  const w = src.width, hgt = src.height, side = Math.min(w, hgt);
  const c = document.createElement("canvas");
  c.width = c.height = 320;
  c.getContext("2d").drawImage(src, (w - side) / 2, (hgt - side) / 2, side, side, 0, 0, 320, 320);
  return c.toDataURL("image/jpeg", 0.82);
}

// Photo, short intro and visibility for the Meet tab.
function meetProfile(u) {
  const save = async (patch) => {
    try {
      const { user } = await api("PATCH", "/api/me", patch);
      state.user = user;
      const big = document.querySelector(".profile-head .avatar");
      if (big) big.replaceWith(avatar(user, "avatar-lg"));
      drawPhoto();
      toast(t("saved"));
    } catch (err) {
      toast(errText(err));
    }
  };
  const fileIn = h("input", { type: "file", accept: "image/*", hidden: true });
  fileIn.addEventListener("change", async () => {
    const f = fileIn.files?.[0];
    fileIn.value = "";
    if (!f) return;
    try {
      await save({ photo: await photoDataUrl(f) });
    } catch {
      toast(t("err_bad_photo"));
    }
  });
  const photoRow = h("div", { class: "photo-row" });
  const drawPhoto = () =>
    photoRow.replaceChildren(
      avatar(state.user, "avatar-lg"),
      h("div", { class: "photo-actions" },
        h("button", { type: "button", class: "btn btn-tinted", onclick: () => fileIn.click() }, state.user.photo ? t("changePhoto") : t("choosePhoto")),
        state.user.photo ? h("button", { type: "button", class: "link-btn destructive", onclick: () => save({ photo: "" }) }, t("removePhoto")) : null),
      fileIn
    );
  drawPhoto();
  const bio = h("textarea", { rows: 3, maxlength: 160, placeholder: t("bioPlaceholder"), "aria-label": t("bio") }, u.bio || "");
  const bioSave = h("button", { type: "button", class: "btn btn-filled", hidden: true, onclick: () => { save({ bio: bio.value }); bioSave.hidden = true; } }, t("save"));
  bio.addEventListener("input", () => (bioSave.hidden = bio.value.trim() === (state.user.bio || "")));
  const sw = h("input", { type: "checkbox", class: "switch", role: "switch", "aria-label": t("showInMeet") });
  sw.checked = u.meet !== false;
  sw.addEventListener("change", () => save({ meet: sw.checked }));
  return h(
    "div",
    {},
    h("h2", { class: "group-header" }, t("meetProfile")),
    h(
      "div",
      { class: "group" },
      h("div", { class: "field field-stack" }, h("span", { class: "field-label" }, t("photo")), photoRow, h("span", { class: "row-label" }, t("photoHint"))),
      h("label", { class: "field field-stack" }, h("span", { class: "field-label" }, t("bio")), bio),
      h("label", { class: "field switch-row" }, h("span", { class: "field-label" }, t("showInMeet")), sw)
    ),
    bioSave,
    h("p", { class: "group-footer" }, t("meetProfileHint"))
  );
}

function viewProfile(screen) {
  const u = state.user;
  const nameIn = h("input", { type: "text", value: u.name, maxlength: 60, autocomplete: "name", "aria-label": t("name") });
  const entityIn = h("input", { type: "text", value: u.entity, maxlength: 60, placeholder: t("entityHint"), "aria-label": t("entity") });
  const posIn = positionSelect(u.position || "");
  const titleIn = u.role === "admin" ? h("input", { type: "text", value: u.title || "", maxlength: 40, placeholder: t("teamTitleHint"), "aria-label": t("teamTitle") }) : null;
  const saveBtn = h("button", { type: "submit", class: "btn btn-filled", hidden: true }, t("save"));
  const dirty = () =>
    (saveBtn.hidden =
      nameIn.value.trim() === u.name && entityIn.value.trim() === u.entity && posIn.value === (u.position || "") && (!titleIn || titleIn.value.trim() === (u.title || "")));
  for (const el of [nameIn, entityIn, posIn, titleIn]) el?.addEventListener("input", dirty);
  posIn.addEventListener("change", dirty);

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
      avatar(u, "avatar-lg"),
      h("div", {}, h("p", { class: "profile-name" }, u.name), h("p", { class: "profile-sub" }, u.email), u.role === "admin" ? h("span", { class: "status status-admin" }, t("organizer")) : null)
    ),
    h(
      "form",
      {
        onsubmit: async (e) => {
          e.preventDefault();
          try {
            const { user } = await api("PATCH", "/api/me", { name: nameIn.value, entity: entityIn.value, position: posIn.value, ...(titleIn ? { title: titleIn.value } : {}) });
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
        h("label", { class: "field" }, h("span", { class: "field-label" }, t("entity")), entityIn),
        h("label", { class: "field" }, h("span", { class: "field-label" }, t("position")), posIn),
        titleIn ? h("label", { class: "field" }, h("span", { class: "field-label" }, t("teamTitle")), titleIn) : null
      ),
      saveBtn
    ),
    meetProfile(u),
    h("h2", { class: "group-header" }, t("language")),
    h(
      "div",
      { class: "group" },
      h(
        "div",
        { class: "field field-stack" },
        segmented(LANGS.map((l) => [l.code, l.label]), u.lang, async (lang) => {
          try {
            const { user } = await api("PATCH", "/api/me", { lang });
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
    notificationSettings(),
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
            await api("POST", "/api/auth/logout").catch(() => {});
            stopStream();
            Object.assign(state, { user: null, agenda: null, conversations: null, unread: 0, announcements: null });
            go("/welcome", { replace: true });
          },
        },
        h("span", { class: "row-text" }, h("span", { class: "row-value" }, t("logout")))
      )
    ),
    h("p", { class: "fineprint center" }, "EUROXPRO'27 · AIESEC in Türkiye")
  );
}

// ------------------------------------------------------------------ celebrations
// Confetti and a short buzz for matches, quest check-ins and rewards.
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function celebrate({ buzz = true } = {}) {
  if (buzz) try { navigator.vibrate?.([25, 40, 70]); } catch {}
  if (reduceMotion()) return;
  const c = h("canvas", { class: "confetti", "aria-hidden": "true" });
  document.body.append(c);
  const dpr = Math.min(2, devicePixelRatio || 1);
  const W = (c.width = innerWidth * dpr), H = (c.height = innerHeight * dpr);
  const ctx = c.getContext("2d");
  const colors = ["#8B1E3F", "#F06B5B", "#F7B267", "#4DB6A0", "#2E86C1", "#FFFFFF"];
  const parts = Array.from({ length: 140 }, (_, i) => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.2,
    y: H * 0.42,
    vx: (Math.random() - 0.5) * 22 * dpr,
    vy: (-14 - Math.random() * 16) * dpr,
    r: (4 + Math.random() * 5) * dpr,
    a: Math.random() * Math.PI,
    va: (Math.random() - 0.5) * 0.4,
    c: colors[i % colors.length],
    round: Math.random() < 0.3,
  }));
  const t0 = performance.now();
  const frame = (now) => {
    const k = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += 0.55 * dpr;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.va;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, k - 1.6));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.c;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else ctx.fillRect(-p.r / 2, -p.r, p.r, p.r * 2);
      ctx.restore();
    }
    if (k < 2.6) requestAnimationFrame(frame);
    else c.remove();
  };
  requestAnimationFrame(frame);
}

// Count a number up to its value (big totals, points).
function countUp(el, to, ms = 900) {
  const from = Number(el.dataset.n || 0);
  el.dataset.n = to;
  if (reduceMotion() || from === to) return (el.textContent = fmtNum(to));
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / ms);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmtNum(Math.round(from + (to - from) * e));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const fmtNum = (n) => Number(n).toLocaleString(locale());

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = h("script", { src });
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}

// ------------------------------------------------------------------ sunset theme
// In the evening (Antalya time) the accent colours turn to sunset tones.
function sunsetNow() {
  const d = new Date(nowMs() + TZ_OFFSET);
  const m = d.getUTCHours() * 60 + d.getUTCMinutes();
  return m >= 17 * 60 && m < 21 * 60;
}
function applySunset() {
  const on = sunsetNow();
  document.documentElement.classList.toggle("sunset", on);
}
applySunset();
setInterval(applySunset, 60000);

// ------------------------------------------------------------------ explorer quest
function stationCodeFrom(text) {
  const s = String(text || "").trim();
  const m = s.match(/\/q\/([A-Za-z0-9]{4,12})/);
  return (m ? m[1] : s).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

async function questCheckin(code) {
  try {
    const r = await api("POST", "/api/quest/checkin", { code });
    if (r.fresh) {
      celebrate();
      toast(t("questGot", { pts: r.station.pts, name: r.station.name }));
    } else toast(t("questAlready", { name: r.station.name }));
    if (r.all) setTimeout(() => toast(t("questAll")), 2800);
    window.dispatchEvent(new Event("quest-updated"));
    return r;
  } catch (err) {
    toast(err.code === "bad_code" ? t("questBadCode") : errText(err));
    return null;
  }
}

// Camera scanner: the browser's own detector where there is one (Android
// Chrome), otherwise the bundled jsQR (iPhone).
function openScanner(onCode) {
  const video = h("video", { playsinline: true, muted: true, autoplay: true });
  const status = h("p", { class: "scan-status" }, t("scanHint"));
  let stream = null, raf = 0, done = false;
  const close = () => {
    done = true;
    cancelAnimationFrame(raf);
    stream?.getTracks().forEach((tr) => tr.stop());
    ov.remove();
  };
  const ov = h(
    "div",
    { class: "scanner", role: "dialog", "aria-modal": "true", "aria-label": t("scanTitle") },
    video,
    h("div", { class: "scan-frame" }),
    h("div", { class: "scan-top" }, h("button", { type: "button", class: "icon-btn scan-x", "aria-label": t("close"), onclick: close }, icon("xmark"))),
    status
  );
  document.body.append(ov);
  (async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    } catch {
      status.textContent = t("scanNoCamera");
      return;
    }
    if (done) return close();
    video.srcObject = stream;
    await video.play().catch(() => {});
    let detect;
    if ("BarcodeDetector" in window) {
      try {
        const bd = new BarcodeDetector({ formats: ["qr_code"] });
        detect = async () => (await bd.detect(video))[0]?.rawValue;
      } catch {}
    }
    if (!detect) {
      await loadScript("/vendor/qr/jsQR.js");
      const cv = document.createElement("canvas");
      const cx = cv.getContext("2d", { willReadFrequently: true });
      detect = async () => {
        const w = video.videoWidth, hh = video.videoHeight;
        if (!w) return null;
        const s = Math.min(1, 640 / w);
        cv.width = w * s;
        cv.height = hh * s;
        cx.drawImage(video, 0, 0, cv.width, cv.height);
        const img = cx.getImageData(0, 0, cv.width, cv.height);
        return window.jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" })?.data;
      };
    }
    let last = 0;
    const loop = async (now) => {
      if (done) return;
      if (now - last > 180) {
        last = now;
        const v = await detect().catch(() => null);
        if (v && stationCodeFrom(v)) {
          close();
          return onCode(stationCodeFrom(v));
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  })();
}

function viewQuest(screen) {
  const admin = state.user.role === "admin";
  const head = h("section", { class: "quest-head" });
  const body = h("div", {}, h("div", { class: "loading" }));
  const codeIn = h("input", { type: "text", maxlength: 12, placeholder: t("questCodeHint"), autocapitalize: "characters", "aria-label": t("questCode") });
  screen.append(
    navBar({ title: t("quest"), back: "/home", action: admin ? h("a", { href: "/quest/admin", "data-link": true, class: "nav-action" }, t("organizer")) : null }),
    head,
    h(
      "div",
      { class: "quest-actions" },
      h("button", { type: "button", class: "btn btn-filled", onclick: () => openScanner(async (c) => (await questCheckin(c)) && draw()) }, icon("qr"), t("scanStation")),
      h("form", { class: "quest-code", onsubmit: async (e) => {
        e.preventDefault();
        const c = stationCodeFrom(codeIn.value);
        if (!c) return;
        if (await questCheckin(c)) codeIn.value = "";
        draw();
      } }, codeIn, h("button", { type: "submit", class: "btn btn-small" }, t("ok")))
    ),
    body
  );
  const ptsEl = h("span", { class: "quest-pts" }, "0");
  const draw = async () => {
    let d;
    try {
      d = await api("GET", "/api/quest");
    } catch (err) {
      body.replaceChildren(h("p", { class: "empty" }, errText(err)));
      return;
    }
    const done = d.stations.filter((s) => s.done).length;
    const ring = h("span", { class: "quest-ring" });
    ring.style.setProperty("--p", String(done / d.stations.length));
    head.replaceChildren(
      ring,
      h("div", { class: "quest-head-text" },
        h("span", { class: "kicker" }, t("questScore")),
        h("span", {}, ptsEl, h("span", { class: "quest-pts-unit" }, " " + t("pts"))),
        h("span", { class: "quest-sub" }, [t("questStations", { n: done, total: d.stations.length }), d.rank ? t("questRank", { n: d.rank }) : null].filter(Boolean).join(" · ")))
    );
    countUp(ptsEl, d.points);
    body.replaceChildren(
      h("h2", { class: "group-header" }, t("questTrail")),
      h("ol", { class: "trail" }, d.stations.map((s, i) =>
        h("li", { class: "trail-stop" + (s.done ? " done" : "") },
          h("span", { class: "trail-dot" }, s.done ? icon("check") : String(i + 1)),
          h("span", { class: "trail-name" }, s.name),
          h("span", { class: "trail-pts" }, `+${s.pts}`)))),
      h("h2", { class: "group-header" }, `${t("questRewards")} · ${t("questBalance", { n: d.balance })}`),
      h("div", { class: "group" }, d.rewards.map((r) => {
        const can = !r.claimed && d.balance >= r.cost;
        return h("div", { class: "row reward" },
          h("span", { class: "row-text" }, h("span", { class: "row-value" }, r.name), h("span", { class: "row-label" }, `${r.cost} ${t("pts")}`)),
          r.claimed
            ? h("span", { class: "status " + (r.claimed === "given" ? "status-ok" : "status-wait") }, r.claimed === "given" ? t("questGiven") : t("questPending"))
            : h("button", { type: "button", class: "btn btn-small" + (can ? "" : " btn-muted"), disabled: !can, onclick: async () => {
                try {
                  await api("POST", "/api/quest/claim", { rewardId: r.id });
                  celebrate();
                  toast(t("questClaimed"));
                  draw();
                } catch (err) {
                  toast(errText(err));
                }
              } }, t("questClaim")));
      })),
      h("p", { class: "group-footer" }, t("questRewardHint")),
      d.board.length
        ? h("div", {},
            h("h2", { class: "group-header" }, t("questBoard")),
            h("ol", { class: "group board" }, d.board.map((p, i) =>
              h("li", { class: "row" + (p.id === state.user.id ? " me" : "") },
                h("span", { class: "board-rank" }, String(i + 1)),
                avatar(p),
                h("span", { class: "row-text" }, h("span", { class: "row-value" }, p.name), h("span", { class: "row-label" }, p.entity)),
                h("span", { class: "board-pts" }, fmtNum(p.points))))))
        : ""
    );
  };
  draw();
  window.addEventListener("quest-updated", draw);
  return () => window.removeEventListener("quest-updated", draw);
}

// /q/CODE: what the printed QR codes open.
function viewQuestCode(screen, { code }) {
  screen.append(navBar({ title: t("quest"), back: "/home" }), h("div", { class: "loading" }));
  questCheckin(stationCodeFrom(code)).finally(() => go("/quest", { replace: true }));
}

function viewQuestAdmin(screen) {
  const box = h("div", {}, h("div", { class: "loading" }));
  screen.append(navBar({ title: t("questCodes"), back: "/quest", action: h("button", { type: "button", class: "nav-action", onclick: () => print() }, t("print")) }), box);
  (async () => {
    const [{ stations }, { claims }] = await Promise.all([api("GET", "/api/quest"), api("GET", "/api/quest/claims")]);
    await loadScript("/vendor/qr/qrcode.js");
    const qrSvg = (text) => {
      const q = window.qrcode(0, "M");
      q.addData(text);
      q.make();
      const n = q.getModuleCount();
      let d = "";
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c + 4},${r + 4}h1v1h-1z`;
      return `<svg viewBox="0 0 ${n + 8} ${n + 8}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
    };
    box.replaceChildren(
      h("p", { class: "fineprint" }, t("questCodesHint")),
      h("div", { class: "qr-grid" }, stations.map((s) =>
        h("figure", { class: "qr-card" },
          h("span", { class: "qr-img", html: qrSvg(`${location.origin}/q/${s.code}`) }),
          h("figcaption", {}, h("strong", {}, s.name), h("span", {}, `${s.code} · +${s.pts} ${t("pts")}`))))),
      h("h2", { class: "group-header no-print" }, t("questClaims")),
      claims.length
        ? h("div", { class: "group no-print" }, claims.map((c) => {
            const btn = h("button", { type: "button", class: "btn btn-small" + (c.status === "given" ? " btn-muted" : "") }, c.status === "given" ? t("questGiven") : t("questMarkGiven"));
            btn.addEventListener("click", async () => {
              const r = await api("POST", `/api/quest/claims/${c.uid}/${c.rid}`).catch((e) => toast(errText(e)));
              if (!r) return;
              c.status = r.status;
              btn.textContent = r.status === "given" ? t("questGiven") : t("questMarkGiven");
              btn.classList.toggle("btn-muted", r.status === "given");
            });
            return h("div", { class: "row" }, h("span", { class: "row-text" }, h("span", { class: "row-value" }, c.reward), h("span", { class: "row-label" }, [c.name, c.entity].filter(Boolean).join(" · "))), btn);
          }))
        : h("p", { class: "empty no-print" }, t("questNoClaims"))
    );
  })().catch((e) => box.replaceChildren(h("p", { class: "empty" }, errText(e))));
}

// ------------------------------------------------------------------ approvals league
// Like AIESEC's "top performing LCs": rank by approvals, realizations or
// completes, per product, with the top three on a podium.
const pct = (a, g) => (g ? Math.round((a / g) * 100) : 0);
const PRODUCTS = ["GV", "GTa", "GTe"];
const METRICS = ["apd", "re", "co"];
const metricVal = (x, m, prod) => (prod === "all" ? PRODUCTS.reduce((a, k) => a + (x.p?.[k]?.[m] || 0), 0) : x.p?.[prod]?.[m] || 0);
const shortLc = (name) => name.replace(/^AIESEC in /i, "");
function groupByMc(lcs) {
  const m = new Map();
  for (const x of lcs) {
    const g = m.get(x.mc) || { id: "mc:" + x.mc, name: x.mc, mc: "", approved: 0, goal: 0, week: 0, n: 0, p: Object.fromEntries(PRODUCTS.map((k) => [k, { apd: 0, re: 0, co: 0 }])) };
    g.approved += x.approved;
    g.goal += x.goal;
    g.week += x.week || 0;
    g.n++;
    for (const k of PRODUCTS) for (const mm of METRICS) g.p[k][mm] += x.p?.[k]?.[mm] || 0;
    m.set(x.mc, g);
  }
  return [...m.values()];
}
// Rank with ties sharing a place (1, 2, 2, 4).
function ranked(items, val) {
  const sorted = items.slice().sort((a, b) => val(b) - val(a) || a.name.localeCompare(b.name));
  let place = 0;
  return sorted.map((x, i) => {
    if (i === 0 || val(x) !== val(sorted[i - 1])) place = i + 1;
    return { x, v: val(x), place };
  });
}

function viewApprovals(screen) {
  const admin = state.user.role === "admin";
  const pref = (k, d) => sessionStorage.getItem("appr." + k) || d;
  let mode = pref("mode", "lc"), mc = pref("mc", "all"), metric = pref("metric", "apd"), prod = pref("prod", "all");
  const remember = () => Object.entries({ mode, mc, metric, prod }).forEach(([k, v]) => sessionStorage.setItem("appr." + k, v));
  let data = null;
  const total = h("section", { class: "appr-total" });
  const prodChips = h("div", { class: "chips chips-scroll prod-chips" });
  const mcChips = h("div", { class: "chips chips-scroll" });
  const podium = h("div", { class: "podium-wrap" });
  const list = h("ol", { class: "league" }, h("div", { class: "loading" }));
  screen.append(
    navBar({ title: t("approvals"), back: "/home", action: admin ? h("a", { href: "/approvals/edit", "data-link": true, class: "nav-action" }, t("edit")) : null }),
    total,
    h("div", { class: "pad-x" }, segmented(METRICS.map((m) => [m, t("m_" + m)]), metric, (v) => {
      metric = v;
      draw();
    }, t("approvals"))),
    prodChips,
    h("div", { class: "pad-x appr-tools" },
      segmented([["lc", t("apprLc")], ["mc", t("apprMc")]], mode, (v) => {
        mode = v;
        draw();
      }, t("approvals")),
      h("a", { href: "/approvals/live", "data-link": true, class: "btn btn-small appr-live-btn" }, icon("tv"), t("apprLive"))),
    mcChips,
    podium,
    list
  );
  const totalNum = h("span", { class: "appr-big" }, "0");
  const chipRow = (el, values, cur, label, set) =>
    el.replaceChildren(...values.map((v) => h("button", { type: "button", class: "chip" + (v === cur ? " on" : ""), onclick: () => {
      set(v);
      draw();
    } }, label(v))));
  const draw = () => {
    if (!data) return;
    remember();
    const all = data.lcs;
    const val = (x) => metricVal(x, metric, prod);
    const T = all.reduce((a, x) => a + val(x), 0);
    const G = all.reduce((a, x) => a + x.goal, 0);
    const apdT = all.reduce((a, x) => a + metricVal(x, "apd", prod), 0);
    const showGoal = metric === "apd" && prod === "all";
    const bar = h("span", { class: "appr-bar" }, h("span", {}));
    bar.firstChild.style.setProperty("--w", (showGoal ? Math.min(100, pct(T, G)) : metric === "apd" ? 100 : Math.min(100, pct(T, apdT))) + "%");
    total.replaceChildren(
      h("span", { class: "kicker" }, `${t("apprEurope")} · `, h("span", { lang: "en" }, `${t("m_" + metric)}${prod === "all" ? "" : " · " + prod}`)),
      h("span", { class: "appr-line" }, totalNum, showGoal ? h("span", { class: "appr-goal" }, ` / ${fmtNum(G)}`) : ""),
      bar,
      h("span", { class: "appr-meta" }, [
        showGoal ? t("apprToGoal", { p: pct(T, G) }) : metric !== "apd" ? t("apprConv", { p: pct(T, apdT) }) : null,
        t("apprLcs", { n: all.length }),
        t("apprMcs", { n: new Set(all.map((x) => x.mc)).size }),
      ].filter(Boolean).join(" · ")),
      data.demo ? h("span", { class: "appr-demo" }, t("apprDemo")) : ""
    );
    countUp(totalNum, T);
    chipRow(prodChips, ["all", ...PRODUCTS], prod, (v) => (v === "all" ? t("allProducts") : v), (v) => (prod = v));
    const mcs = [...new Set(all.map((x) => x.mc))].sort();
    mcChips.hidden = mode !== "lc";
    chipRow(mcChips, ["all", ...mcs], mc, (v) => (v === "all" ? t("all") : v), (v) => (mc = v));
    const items = mode === "mc" ? groupByMc(all) : all.filter((x) => mc === "all" || x.mc === mc);
    const rows = ranked(items, val);
    const top = Math.max(1, rows[0]?.v || 0);
    const sub = (x) => (mode === "mc" ? t("apprLcs", { n: x.n }) : x.mc);
    // Podium: 2nd, 1st, 3rd.
    const podiumRows = rows.slice(0, 3);
    podium.replaceChildren(
      ...(podiumRows.length === 3
        ? [h("div", { class: "lbpod" }, [podiumRows[1], podiumRows[0], podiumRows[2]].map((r, i) => {
            const step = h("span", { class: "podium-step" }, h("span", { class: "podium-place" }, String(r.place)));
            return h("div", { class: "podium-col p" + r.place + (i === 1 ? " first" : "") },
              h("span", { class: "podium-name" }, mode === "mc" ? r.x.name : shortLc(r.x.name)),
              h("span", { class: "podium-sub" }, sub(r.x)),
              h("span", { class: "podium-val" }, fmtNum(r.v)),
              step);
          }))]
        : [])
    );
    list.replaceChildren(...rows.slice(podiumRows.length === 3 ? 3 : 0).map((r, i) => {
      const x = r.x;
      const p = showGoal ? pct(x.approved, x.goal) : null;
      const fill = h("span", { class: "league-fill" + (p >= 100 ? " done" : "") });
      fill.style.setProperty("--w", (showGoal ? Math.min(100, p) : (r.v / top) * 100) + "%");
      fill.style.setProperty("--d", i * 30 + "ms");
      return h("li", { class: "league-row" },
        h("span", { class: "league-rank" }, String(r.place)),
        h("span", { class: "league-main" },
          h("span", { class: "league-name" }, mode === "mc" ? x.name : shortLc(x.name), h("span", { class: "league-mc" }, sub(x))),
          h("span", { class: "league-track" }, fill),
          h("span", { class: "league-nums" },
            showGoal ? `${fmtNum(x.approved)} / ${fmtNum(x.goal)}` : h("strong", { class: "league-val" }, fmtNum(r.v)),
            showGoal ? h("span", { class: "league-pct" }, `${p}%`) : h("span", {}, METRICS.filter((m) => m !== metric).map((m) => `${t("m_" + m + "_s")} ${fmtNum(metricVal(x, m, prod))}`).join(" · ")),
            showGoal && x.week ? h("span", { class: "league-week " + (x.week > 0 ? "up" : "down") }, `${x.week > 0 ? "▲" : "▼"} ${Math.abs(x.week)}`) : null)));
    }));
  };
  const load = () => api("GET", "/api/approvals").then((d) => {
    data = d;
    draw();
  }).catch((e) => list.replaceChildren(h("p", { class: "empty" }, errText(e))));
  load();
  window.addEventListener("approvals-updated", load);
  return () => window.removeEventListener("approvals-updated", load);
}

// Full-screen race for the big screen in the plenary. It cycles through
// approvals, realizations and completes on its own.
function viewApprovalsLive(screen) {
  screen.classList.add("live-board");
  const bars = h("div", { class: "race" });
  const big = h("span", { class: "lb-big" }, "0");
  const goal = h("span", { class: "lb-goal" });
  const pctEl = h("span", { class: "lb-pct" });
  const clock = h("span", { class: "lb-clock" });
  const label = h("span", { class: "kicker" });
  const tabs = h("div", { class: "lb-tabs" });
  let mode = "lc";
  let metric = "apd";
  let auto = true;
  let data = null;
  const rows = new Map();
  const autoBtn = h("button", { type: "button", class: "lb-btn on" }, t("apprAuto"));
  autoBtn.addEventListener("click", () => {
    auto = !auto;
    autoBtn.classList.toggle("on", auto);
  });
  screen.append(
    h("header", { class: "lb-head" },
      h("a", { href: "/approvals", "data-link": true, class: "lb-back", "aria-label": t("back") }, icon("back")),
      wordmark(),
      h("span", { class: "lb-title" }, t("apprLiveTitle")),
      clock,
      autoBtn,
      h("button", { type: "button", class: "lb-btn", onclick: () => {
        mode = mode === "lc" ? "mc" : "lc";
        rows.clear();
        bars.replaceChildren();
        draw();
      } }, t("apprSwitch")),
      h("button", { type: "button", class: "lb-btn", onclick: () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()) }, t("fullscreen"))),
    h("section", { class: "lb-total" }, label, h("span", { class: "lb-line" }, big, goal), pctEl, tabs),
    bars
  );
  const draw = () => {
    if (!data) return;
    const d = data;
    tabs.replaceChildren(...METRICS.map((m) => h("button", { type: "button", class: "lb-tab" + (m === metric ? " on" : ""), onclick: () => {
      metric = m;
      draw();
    } }, t("m_" + m))));
    const val = (x) => metricVal(x, metric, "all");
    const items = ranked(mode === "mc" ? groupByMc(d.lcs) : d.lcs, val).slice(0, 12);
    const max = Math.max(1, ...items.map((r) => Math.max(r.v, metric === "apd" ? r.x.goal : 0)));
    const T = d.lcs.reduce((a, x) => a + val(x), 0), G = d.lcs.reduce((a, x) => a + x.goal, 0), A = d.lcs.reduce((a, x) => a + x.approved, 0);
    label.replaceChildren(`${t("apprEurope")} · `, h("span", { lang: "en" }, t("m_" + metric)));
    countUp(big, T, 1400);
    goal.textContent = metric === "apd" ? ` / ${fmtNum(G)}` : "";
    pctEl.textContent = metric === "apd" ? t("apprToGoal", { p: pct(T, G) }) : t("apprConv", { p: pct(T, A) });
    // FLIP: remember where rows were, re-order, then animate from there.
    const before = new Map([...rows].map(([id, r]) => [id, r.el.getBoundingClientRect().top]));
    const seen = new Set();
    items.forEach((it, i) => {
      const x = it.x;
      seen.add(x.id);
      let r = rows.get(x.id);
      if (!r) {
        const fill = h("span", { class: "race-fill" });
        const goalMark = h("span", { class: "race-goal" });
        const num = h("span", { class: "race-num" }, "0");
        const el = h("div", { class: "race-row" },
          h("span", { class: "race-rank" }),
          h("span", { class: "race-name" }, mode === "mc" ? x.name : shortLc(x.name), h("span", { class: "race-mc" }, mode === "mc" ? "" : x.mc)),
          h("span", { class: "race-track" }, fill, goalMark),
          num);
        r = { el, fill, goalMark, num };
        rows.set(x.id, r);
      }
      r.el.querySelector(".race-rank").textContent = String(it.place);
      r.el.classList.toggle("lead", it.place === 1);
      r.fill.style.setProperty("--w", (it.v / max) * 100 + "%");
      r.goalMark.hidden = metric !== "apd";
      r.goalMark.style.setProperty("--g", (x.goal / max) * 100 + "%");
      countUp(r.num, it.v, 1200);
      bars.append(r.el);
    });
    for (const [id, r] of rows) if (!seen.has(id)) (r.el.remove(), rows.delete(id));
    if (reduceMotion()) return;
    for (const [id, r] of rows) {
      const old = before.get(id);
      if (old == null) continue;
      const dy = old - r.el.getBoundingClientRect().top;
      if (!dy) continue;
      r.el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
  };
  const load = () => api("GET", "/api/approvals").then((d) => {
    data = d;
    draw();
  }).catch(() => {});
  load();
  const tick = () => (clock.textContent = new Date(nowMs()).toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }));
  tick();
  const timers = [
    setInterval(load, 20000),
    setInterval(tick, 10000),
    setInterval(() => {
      if (!auto) return;
      metric = METRICS[(METRICS.indexOf(metric) + 1) % METRICS.length];
      draw();
    }, 15000),
  ];
  window.addEventListener("approvals-updated", load);
  return () => {
    timers.forEach(clearInterval);
    window.removeEventListener("approvals-updated", load);
  };
}

// Organizers: one card per LC with approvals, realizations and completes per
// product, or paste rows straight from a spreadsheet.
function viewApprovalsEdit(screen) {
  const box = h("div", { class: "appr-edit" }, h("div", { class: "loading" }));
  let rows = [];
  const save = h("button", { type: "button", class: "btn btn-filled" }, t("save"));
  const paste = h("textarea", { rows: 5, class: "appr-paste", placeholder: "AIESEC in Istanbul; Türkiye; GV; 40; 25; 10\nAIESEC in Warsaw; Poland; GTa; 12; 8; 3", "aria-label": t("apprPaste") });
  screen.append(
    navBar({ title: t("apprEdit"), back: "/approvals" }),
    h("p", { class: "fineprint" }, t("apprEditHint")),
    h("details", { class: "appr-import" },
      h("summary", {}, t("apprPaste")),
      h("p", { class: "fineprint" }, t("apprPasteHint")),
      paste,
      h("button", { type: "button", class: "btn btn-small", onclick: () => {
        let n = 0;
        for (const line of paste.value.split(/\r?\n/)) {
          const c = line.split(/[;\t,]/).map((s) => s.trim());
          if (c.length < 4 || !c[0]) continue;
          const prodKey = PRODUCTS.find((k) => k.toLowerCase() === c[2].replace(/^[io]/i, "").toLowerCase());
          if (!prodKey) continue;
          let r = rows.find((x) => x.name.toLowerCase() === c[0].toLowerCase());
          if (!r) {
            r = { id: "", name: c[0], mc: c[1], goal: 0, p: Object.fromEntries(PRODUCTS.map((k) => [k, { apd: 0, re: 0, co: 0 }])) };
            rows.push(r);
          }
          if (c[1]) r.mc = c[1];
          r.p[prodKey] = { apd: Number(c[3]) || 0, re: Number(c[4]) || 0, co: Number(c[5]) || 0 };
          n++;
        }
        toast(t("apprPasted", { n }));
        draw();
      } }, t("apprApply"))),
    box,
    h("div", { class: "pad-x appr-edit-actions" },
      h("button", { type: "button", class: "btn", onclick: () => {
        rows.unshift({ id: "", name: "AIESEC in ", mc: "", goal: 0, p: Object.fromEntries(PRODUCTS.map((k) => [k, { apd: 0, re: 0, co: 0 }])) });
        draw();
      } }, t("apprAdd")),
      save,
      h("button", { type: "button", class: "btn", onclick: async () => {
        if (!confirm(t("apprNewWeekQ"))) return;
        await api("POST", "/api/approvals/new-week").then(() => toast(t("saved"))).catch((e) => toast(errText(e)));
      } }, t("apprNewWeek")))
  );
  const numIn = (get, set, label) => {
    const el = h("input", { type: "number", min: 0, inputmode: "numeric", value: get(), "aria-label": label });
    el.addEventListener("input", () => set(Number(el.value) || 0));
    return el;
  };
  const draw = () => {
    box.replaceChildren(...rows.map((r, i) => {
      const txt = (k, cls) => {
        const el = h("input", { type: "text", class: cls, value: r[k], "aria-label": t(k === "name" ? "apprLc" : "apprMc") });
        el.addEventListener("input", () => (r[k] = el.value));
        return el;
      };
      return h("div", { class: "appr-card" },
        h("div", { class: "appr-card-head" }, txt("name", "e-name"), txt("mc", "e-mc"),
          h("button", { type: "button", class: "icon-btn", "aria-label": t("delete"), onclick: () => {
            rows.splice(i, 1);
            draw();
          } }, icon("xmark"))),
        h("div", { class: "appr-grid" },
          h("span", {}), ...METRICS.map((m) => h("span", { class: "appr-grid-h" }, t("m_" + m + "_s"))),
          ...PRODUCTS.flatMap((k) => [h("span", { class: "appr-grid-h" }, k), ...METRICS.map((m) => numIn(() => r.p[k][m], (v) => (r.p[k][m] = v), `${k} ${t("m_" + m)}`))]),
          h("span", { class: "appr-grid-h" }, t("apprGoal")), numIn(() => r.goal, (v) => (r.goal = v), t("apprGoal"))));
    }));
  };
  api("GET", "/api/approvals").then((d) => {
    rows = d.lcs.map((x) => JSON.parse(JSON.stringify(x)));
    draw();
  });
  save.addEventListener("click", async () => {
    save.disabled = true;
    try {
      await api("POST", "/api/approvals", { lcs: rows });
      toast(t("saved"));
      go("/approvals");
    } catch (e) {
      toast(errText(e));
    } finally {
      save.disabled = false;
    }
  });
}

// ------------------------------------------------------------------ conference store
function productArt(p) {
  const art = h("span", { class: "product-art art-" + (p.id.startsWith("wb") ? "band" : p.id) });
  art.style.setProperty("--c", p.color);
  return art;
}

function viewStore(screen) {
  const admin = state.user.role === "admin";
  const basket = new Map(); // key id|size -> {id,size,qty,price,name}
  const grid = h("div", { class: "store-grid" }, h("div", { class: "loading" }));
  const mine = h("div", {});
  const bar = h("div", { class: "basket", hidden: true });
  screen.append(
    navBar({ title: t("store"), back: "/home" }),
    h("section", { class: "store-hero" }, h("span", { class: "kicker" }, t("storeKicker")), h("h2", {}, t("storeTitle")), h("p", {}, t("storeSub"))),
    grid,
    mine,
    bar
  );
  const drawBar = () => {
    const items = [...basket.values()];
    bar.hidden = !items.length;
    const n = items.reduce((a, x) => a + x.qty, 0);
    const sum = items.reduce((a, x) => a + x.qty * x.price, 0);
    bar.replaceChildren(
      h("span", { class: "basket-text" }, h("strong", {}, t("storeItems", { n })), ` · €${sum}`),
      h("button", { type: "button", class: "btn btn-small", onclick: async () => {
        try {
          await api("POST", "/api/store/reserve", { items });
          basket.clear();
          celebrate();
          toast(t("storeReserved"));
          load();
        } catch (e) {
          toast(errText(e));
        }
      } }, t("storeReserve"))
    );
  };
  const load = async () => {
    let d;
    try {
      d = await api("GET", "/api/store");
    } catch (e) {
      return grid.replaceChildren(h("p", { class: "empty" }, errText(e)));
    }
    grid.replaceChildren(...d.products.filter((p) => p.on || admin).map((p) => {
      const size = p.sizes.length ? h("select", { class: "size", "aria-label": t("storeSize") }, p.sizes.map((s) => h("option", { value: s }, s))) : null;
      if (size) size.value = p.sizes.includes("M") ? "M" : p.sizes[0];
      const add = h("button", { type: "button", class: "btn btn-small", disabled: !p.on }, t("storeAdd"));
      add.addEventListener("click", () => {
        const key = p.id + "|" + (size?.value || "");
        const cur = basket.get(key) || { id: p.id, size: size?.value || "", qty: 0, price: p.price, name: p.name };
        cur.qty = Math.min(10, cur.qty + 1);
        basket.set(key, cur);
        try { navigator.vibrate?.(12); } catch {}
        add.classList.remove("pop");
        void add.offsetWidth;
        add.classList.add("pop");
        drawBar();
      });
      const toggle = admin ? h("button", { type: "button", class: "chip" + (p.on ? " on" : ""), onclick: async () => {
        await api("POST", "/api/store/products/" + p.id, { on: !p.on }).catch((e) => toast(errText(e)));
        load();
      } }, p.on ? t("storeOn") : t("storeOff")) : null;
      return h("article", { class: "product" + (p.on ? "" : " off") }, productArt(p),
        h("span", { class: "product-cat" }, t("cat_" + p.cat)),
        h("h3", {}, p.name),
        h("span", { class: "product-foot" }, h("span", { class: "price" }, `€${p.price}`), size, add),
        toggle);
    }));
    const res = d.reservations.filter((r) => admin || r.status !== "cancelled");
    if (!res.length) return mine.replaceChildren();
    const totals = new Map();
    if (admin) for (const r of res) if (r.status !== "cancelled") for (const it of r.items) totals.set(it.name + (it.size ? ` (${it.size})` : ""), (totals.get(it.name + (it.size ? ` (${it.size})` : "")) || 0) + it.qty);
    mine.replaceChildren(...[
      admin ? h("h2", { class: "group-header" }, t("storeTotals")) : null,
      admin ? h("div", { class: "group" }, [...totals].map(([k, v]) => h("div", { class: "row" }, h("span", { class: "row-text" }, h("span", { class: "row-value" }, k)), h("strong", {}, `× ${v}`)))) : null,
      h("h2", { class: "group-header" }, admin ? t("storeAllRes") : t("storeMine")),
      h("div", { class: "group" }, res.map((r) => {
        const st = h("span", { class: "status " + (r.status === "collected" ? "status-ok" : r.status === "cancelled" ? "status-off" : "status-wait") }, t("res_" + r.status));
        const act = admin
          ? r.status !== "cancelled" && h("button", { type: "button", class: "btn btn-small", onclick: async () => {
              await api("POST", "/api/store/reservations/" + r.id, { status: r.status === "collected" ? "reserved" : "collected" }).catch((e) => toast(errText(e)));
              load();
            } }, r.status === "collected" ? t("undo") : t("storeCollected"))
          : r.status === "reserved" && h("button", { type: "button", class: "btn btn-small btn-muted", onclick: async () => {
              await api("POST", "/api/store/reservations/" + r.id, { status: "cancelled" }).catch((e) => toast(errText(e)));
              load();
            } }, t("cancel"));
        return h("div", { class: "row res" },
          h("span", { class: "row-text" },
            h("span", { class: "row-value" }, admin ? [r.name, r.entity].filter(Boolean).join(" · ") : r.items.map((i) => `${i.qty}× ${i.name}${i.size ? " " + i.size : ""}`).join(", ")),
            h("span", { class: "row-label" }, admin ? r.items.map((i) => `${i.qty}× ${i.name}${i.size ? " " + i.size : ""}`).join(", ") + ` · €${r.total}` : `€${r.total} · ${t("storePayThere")}`)),
          st, act || null);
      }))
    ].filter(Boolean));
  };
  load();
}

// ------------------------------------------------------------------ world map of delegates
// Entity names are free text ("AIESEC in Poland", "AIESEC in Warsaw"); match
// them to a country by its name in any of our languages or a big city.
const COUNTRIES = [
  ["TR", "Türkiye", 39.0, 35.2, "turkey|türkiye|turkiye|istanbul|ankara|izmir|antalya|bursa|eskisehir|eskişehir|adana|konya|trabzon|kayseri"],
  ["PL", "Poland", 52.1, 19.4, "poland|polska|polonya|warsaw|warszawa|krakow|kraków|wroclaw|wrocław|gdansk|gdańsk|poznan|poznań|lodz|łódź|katowice|lublin"],
  ["DE", "Germany", 51.2, 10.4, "germany|deutschland|almanya|niemcy|berlin|munich|münchen|hamburg|cologne|köln|frankfurt|stuttgart"],
  ["IT", "Italy", 42.8, 12.6, "italy|italia|italya|włochy|rome|roma|milan|milano|turin|torino|naples|bologna"],
  ["ES", "Spain", 40.3, -3.7, "spain|españa|ispanya|hiszpania|madrid|barcelona|seville|sevilla|valencia"],
  ["FR", "France", 46.6, 2.4, "france|fransa|francja|paris|lyon|marseille|toulouse|lille"],
  ["PT", "Portugal", 39.6, -8.0, "portugal|portekiz|portugalia|lisbon|lisboa|porto"],
  ["GB", "United Kingdom", 53.0, -1.8, "united kingdom|uk|britain|ingiltere|birleşik krallık|wielka brytania|london|manchester|edinburgh|glasgow"],
  ["IE", "Ireland", 53.3, -7.9, "ireland|irlanda|irlandia|dublin"],
  ["NL", "Netherlands", 52.2, 5.5, "netherlands|holland|hollanda|holandia|amsterdam|rotterdam|utrecht"],
  ["BE", "Belgium", 50.6, 4.6, "belgium|belçika|belgia|brussels|antwerp|ghent|leuven"],
  ["AT", "Austria", 47.6, 14.1, "austria|avusturya|österreich|vienna|wien|graz|linz|innsbruck|salzburg"],
  ["CH", "Switzerland", 46.8, 8.2, "switzerland|isviçre|szwajcaria|zurich|zürich|geneva|bern|lausanne"],
  ["CZ", "Czechia", 49.8, 15.5, "czech|çekya|czechy|prague|praha|brno"],
  ["SK", "Slovakia", 48.7, 19.7, "slovakia|slovakya|słowacja|bratislava|kosice"],
  ["HU", "Hungary", 47.2, 19.4, "hungary|macaristan|węgry|budapest|szeged|debrecen"],
  ["RO", "Romania", 45.9, 24.9, "romania|romanya|rumunia|bucharest|bucuresti|cluj|iasi|iași|timisoara|timișoara"],
  ["BG", "Bulgaria", 42.7, 25.3, "bulgaria|bulgaristan|bułgaria|sofia|varna|plovdiv"],
  ["GR", "Greece", 39.3, 22.0, "greece|yunanistan|grecja|athens|thessaloniki"],
  ["CY", "Cyprus", 35.1, 33.3, "cyprus|kıbrıs|cypr|nicosia"],
  ["HR", "Croatia", 45.1, 15.5, "croatia|hırvatistan|chorwacja|zagreb|split"],
  ["SI", "Slovenia", 46.1, 14.8, "slovenia|slovenya|słowenia|ljubljana|maribor"],
  ["RS", "Serbia", 44.0, 20.9, "serbia|sırbistan|belgrade|beograd|novi sad"],
  ["BA", "Bosnia and Herzegovina", 44.2, 17.8, "bosnia|bosna|sarajevo"],
  ["MK", "North Macedonia", 41.6, 21.7, "macedonia|makedonya|skopje"],
  ["AL", "Albania", 41.2, 20.0, "albania|arnavutluk|tirana"],
  ["ME", "Montenegro", 42.7, 19.3, "montenegro|karadağ|podgorica"],
  ["XK", "Kosovo", 42.6, 20.9, "kosovo|pristina|prishtina"],
  ["DK", "Denmark", 56.0, 9.5, "denmark|danimarka|dania|copenhagen|aarhus"],
  ["SE", "Sweden", 62.0, 15.0, "sweden|isveç|szwecja|stockholm|gothenburg|lund|uppsala"],
  ["NO", "Norway", 61.0, 9.0, "norway|norveç|norwegia|oslo|bergen|trondheim"],
  ["FI", "Finland", 62.5, 26.0, "finland|finlandiya|finlandia|helsinki|tampere|turku"],
  ["IS", "Iceland", 64.9, -18.6, "iceland|izlanda|islandia|reykjavik"],
  ["EE", "Estonia", 58.7, 25.5, "estonia|estonya|tallinn|tartu"],
  ["LV", "Latvia", 56.9, 24.6, "latvia|letonya|łotwa|riga"],
  ["LT", "Lithuania", 55.3, 23.9, "lithuania|litvanya|litwa|vilnius|kaunas"],
  ["UA", "Ukraine", 49.0, 31.4, "ukraine|ukrayna|ukraina|kyiv|kiev|lviv|kharkiv|odesa"],
  ["MD", "Moldova", 47.2, 28.5, "moldova|mołdawia|chisinau"],
  ["GE", "Georgia", 42.3, 43.4, "georgia|gürcistan|gruzja|tbilisi"],
  ["AM", "Armenia", 40.2, 44.9, "armenia|ermenistan|yerevan"],
  ["AZ", "Azerbaijan", 40.3, 47.7, "azerbaijan|azerbaycan|baku"],
  ["MT", "Malta", 35.9, 14.4, "malta|valletta"],
  ["LU", "Luxembourg", 49.8, 6.1, "luxembourg|lüksemburg"],
];
const COUNTRY_RE = COUNTRIES.map(([code, name, lat, lng, words]) => ({ code, name, lat, lng, re: new RegExp(`(^|[^\\p{L}])(${words})([^\\p{L}]|$)`, "iu") }));
const countryOf = (entity) => COUNTRY_RE.find((c) => c.re.test(entity || "")) || null;
const flag = (code) => (code === "XK" ? "🇽🇰" : String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)));

function viewWorld(screen) {
  const mapEl = h("div", { class: "world-map", role: "img", "aria-label": t("worldTitle") });
  const list = h("div", { class: "group" });
  const head = h("p", { class: "world-sum" });
  screen.append(navBar({ title: t("worldTitle"), back: "/people" }), h("div", { class: "world-wrap" }, mapEl), head, list);
  const L = window.L;
  let map = null;
  if (L) {
    map = L.map(mapEl, { zoomControl: false, attributionControl: true, scrollWheelZoom: false }).setView([48, 18], 3);
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png`, {
      maxZoom: 8,
      subdomains: "abcd",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);
  }
  api("GET", "/api/world").then(({ entities }) => {
    const counts = new Map();
    for (const e of entities) {
      const c = countryOf(e);
      if (c) counts.set(c, (counts.get(c) || 0) + 1);
    }
    const rows = [...counts].sort((a, b) => b[1] - a[1]);
    const max = Math.max(1, ...rows.map((r) => r[1]));
    head.textContent = t("worldSum", { n: entities.length, c: rows.length });
    if (map) {
      for (const [c, n] of rows) {
        const size = 18 + Math.sqrt(n / max) * 46;
        L.marker([c.lat, c.lng], {
          icon: L.divIcon({ className: "heat-dot", html: `<span class="heat-core"></span><span class="heat-label">${n}</span>`, iconSize: [size, size], iconAnchor: [size / 2, size / 2] }),
          title: `${c.name}: ${n}`,
        }).addTo(map);
      }
      if (rows.length) map.fitBounds(L.latLngBounds([[36.9, 30.7], ...rows.map(([c]) => [c.lat, c.lng])]), { padding: [40, 40], maxZoom: 5 });
      // Antalya, where everyone is heading.
      L.marker([36.9, 30.7], { icon: L.divIcon({ className: "heat-home", html: "<span></span>", iconSize: [14, 14], iconAnchor: [7, 7] }), title: "Antalya" }).addTo(map);
    }
    list.replaceChildren(...rows.map(([c, n]) => {
      const bar = h("span", { class: "world-bar" });
      bar.style.setProperty("--w", (n / max) * 100 + "%");
      return h("div", { class: "row" }, h("span", { class: "world-flag" }, flag(c.code)), h("span", { class: "row-text" }, h("span", { class: "row-value" }, c.name), bar), h("strong", {}, String(n)));
    }));
  }).catch((e) => list.replaceChildren(h("p", { class: "empty" }, errText(e))));
  return () => map?.remove();
}

// ------------------------------------------------------------------ congress recap (a story to share)
const CONGRESS_END = Date.parse("2027-04-04T18:00:00+03:00");

function viewRecap(screen) {
  screen.classList.add("recap-screen");
  const deck = h("div", { class: "story" }, h("div", { class: "loading" }));
  const share = h("button", { type: "button", class: "btn btn-filled" }, icon("share"), t("recapShare"));
  screen.append(navBar({ title: t("recapTitle"), back: "/home" }), deck, h("div", { class: "pad-x recap-actions" }, share), h("p", { class: "fineprint center" }, nowMs() < CONGRESS_END ? t("recapSoFar") : t("recapDone")));
  let d = null;
  api("GET", "/api/recap").then((r) => {
    d = r;
    const countries = new Set(r.entities.map((e) => countryOf(e)?.code).filter(Boolean));
    const stat = (n, label, cls = "") => h("div", { class: "story-stat " + cls }, h("span", { class: "story-num", "data-n": "0" }, "0"), h("span", { class: "story-label" }, label));
    const s1 = stat(r.matches, t("recapMet"));
    const s2 = stat(r.messages, t("recapMessages"));
    const s3 = stat(r.points, t("recapPoints"), "accent");
    const s4 = stat(countries.size, t("recapCountries"));
    deck.replaceChildren(
      h("div", { class: "story-card" },
        h("span", { class: "story-sun" }),
        h("div", { class: "story-top" }, wordmark(), h("span", { class: "story-dates" }, "Antalya · 31.03–04.04.2027")),
        h("p", { class: "story-hi" }, t("recapHi", { name: r.name.split(" ")[0] })),
        h("div", { class: "story-grid" }, s1, s2, s3, s4),
        r.topPeer
          ? h("div", { class: "story-peer" }, avatar(r.topPeer, "avatar-lg"), h("span", {}, h("span", { class: "story-label" }, t("recapTop")), h("strong", {}, r.topPeer.name), h("span", { class: "story-small" }, t("recapTopN", { n: r.topPeer.messages }))))
          : null,
        r.rank ? h("p", { class: "story-small" }, t("recapRank", { n: r.rank, total: r.players })) : null,
        h("p", { class: "story-tag" }, "#EUROXPRO27")
      )
    );
    [[s1, r.matches], [s2, r.messages], [s3, r.points], [s4, countries.size]].forEach(([el, n], i) => setTimeout(() => countUp(el.firstChild, n, 1100), 250 + i * 180));
  }).catch((e) => deck.replaceChildren(h("p", { class: "empty" }, errText(e))));

  // 1080×1920 image for Instagram stories, drawn on a canvas.
  share.addEventListener("click", async () => {
    if (!d) return;
    const c = document.createElement("canvas");
    c.width = 1080;
    c.height = 1920;
    const x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, 0, 1920);
    g.addColorStop(0, "#2B0F2E");
    g.addColorStop(0.45, "#8B1E3F");
    g.addColorStop(0.75, "#F06B5B");
    g.addColorStop(1, "#F7B267");
    x.fillStyle = g;
    x.fillRect(0, 0, 1080, 1920);
    x.fillStyle = "rgba(255,214,150,0.9)";
    x.beginPath();
    x.arc(540, 1560, 230, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = "rgba(31,77,107,0.85)";
    x.fillRect(0, 1600, 1080, 320);
    const font = (w, s) => `${w} ${s}px -apple-system, "SF Pro Display", "Inter", "Segoe UI", sans-serif`;
    x.fillStyle = "#fff";
    x.font = font(800, 64);
    x.fillText("EUROXPRO'27", 90, 170);
    x.font = font(500, 36);
    x.globalAlpha = 0.8;
    x.fillText("Antalya · 31.03–04.04.2027", 90, 225);
    x.globalAlpha = 1;
    x.font = font(800, 84);
    const hi = t("recapHi", { name: d.name.split(" ")[0] });
    hi.split("\n").forEach((line, i) => x.fillText(line, 90, 400 + i * 96));
    const countries = new Set(d.entities.map((e) => countryOf(e)?.code).filter(Boolean)).size;
    const stats = [[d.matches, t("recapMet")], [d.messages, t("recapMessages")], [d.points, t("recapPoints")], [countries, t("recapCountries")]];
    stats.forEach(([n, label], i) => {
      const cx = 90 + (i % 2) * 470, cy = 640 + Math.floor(i / 2) * 300;
      x.fillStyle = "rgba(255,255,255,0.12)";
      x.beginPath();
      x.roundRect(cx, cy, 430, 260, 36);
      x.fill();
      x.fillStyle = "#fff";
      x.font = font(800, 120);
      x.fillText(fmtNum(n), cx + 36, cy + 150);
      x.font = font(600, 34);
      x.globalAlpha = 0.85;
      x.fillText(label, cx + 36, cy + 215);
      x.globalAlpha = 1;
    });
    if (d.topPeer) {
      x.font = font(600, 36);
      x.globalAlpha = 0.85;
      x.fillText(t("recapTop"), 90, 1310);
      x.globalAlpha = 1;
      x.font = font(800, 60);
      x.fillText(d.topPeer.name, 90, 1385);
    }
    x.font = font(800, 44);
    x.fillText("#EUROXPRO27", 90, 1820);
    const blob = await new Promise((r) => c.toBlob(r, "image/png"));
    const file = new File([blob], "euroxpro27-recap.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "EUROXPRO'27" });
        return;
      } catch (e) {
        if (e.name === "AbortError") return;
      }
    }
    const a = h("a", { href: URL.createObjectURL(blob), download: "euroxpro27-recap.png" });
    document.body.append(a);
    a.click();
    a.remove();
  });
}

// ------------------------------------------------------------------ push notifications
// Reminders 10 minutes before a session, programme changes, announcements
// and direct messages, even when the app is closed. On iPhone this needs
// iOS 16.4+ and the app added to the Home Screen.
const isIos = () => /iPhone|iPad/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const pushSupported = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

function b64uBytes(s) {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
}

// "on" | "off" | "denied" | "ios-install" | "unsupported"
async function pushStatus() {
  if (!pushSupported()) return isIos() && !isStandalone() ? "ios-install" : "unsupported";
  if (Notification.permission === "denied") return "denied";
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub && Notification.permission === "granted" ? "on" : "off";
  } catch {
    return "unsupported";
  }
}

async function pushSubscribe() {
  if (!pushSupported()) throw Object.assign(new Error("push_unsupported"), { code: "push_unsupported" });
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw Object.assign(new Error("push_denied"), { code: "push_denied" });
  const reg = await navigator.serviceWorker.ready;
  const { key } = await api("GET", "/api/push");
  const want = b64uBytes(key);
  let sub = await reg.pushManager.getSubscription();
  const have = sub?.options?.applicationServerKey ? new Uint8Array(sub.options.applicationServerKey) : null;
  if (sub && (!have || have.length !== want.length || have.some((b, i) => b !== want[i]))) {
    await sub.unsubscribe().catch(() => {});
    sub = null;
  }
  sub ||= await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: want });
  await api("POST", "/api/push/subscribe", { subscription: sub.toJSON() });
}

async function pushUnsubscribe() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;
  await api("POST", "/api/push/unsubscribe", { endpoint: sub.endpoint }).catch(() => {});
  await sub.unsubscribe().catch(() => {});
}

// After signing in, make sure the server knows this device (it may have been
// subscribed under another account, or the server lost it).
async function pushResync() {
  if ((await pushStatus()) !== "on") return;
  try {
    const sub = await (await navigator.serviceWorker.ready).pushManager.getSubscription();
    await api("POST", "/api/push/subscribe", { subscription: sub.toJSON() });
  } catch {}
}

const pushErrText = (e) => (e.code === "push_denied" ? t("pushDenied") : e.code === "push_unsupported" ? t("pushUnsupported") : errText(e));

function notificationSettings() {
  const wrap = h("div", {});
  const draw = async () => {
    const st = await pushStatus();
    let prefs = null;
    if (st === "on") prefs = (await api("GET", "/api/push").catch(() => ({}))).prefs || null;
    const master = h("input", { type: "checkbox", class: "switch", role: "switch", "aria-label": t("pushTitle") });
    master.checked = st === "on";
    master.disabled = st === "unsupported" || st === "ios-install" || st === "denied";
    master.addEventListener("change", async () => {
      master.disabled = true;
      try {
        if (master.checked) {
          await pushSubscribe();
          toast(t("pushOn"));
        } else await pushUnsubscribe();
      } catch (err) {
        toast(pushErrText(err));
      }
      draw();
    });
    const rows = [h("label", { class: "field switch-row" }, h("span", { class: "field-label" }, icon("bell", "inline-icon"), t("pushTitle")), master)];
    if (st === "on" && prefs) {
      for (const k of ["sessions", "changes", "announce", "messages"]) {
        const sw = h("input", { type: "checkbox", class: "switch", role: "switch", "aria-label": t("push_" + k) });
        sw.checked = prefs[k] !== false;
        sw.addEventListener("change", () => api("POST", "/api/push/prefs", { [k]: sw.checked }).catch((err) => toast(errText(err))));
        rows.push(h("label", { class: "field switch-row" }, h("span", { class: "field-label sub" }, t("push_" + k)), sw));
      }
      rows.push(
        h("button", { type: "button", class: "row row-action", onclick: async () => {
          try {
            const { sent } = await api("POST", "/api/push/test");
            toast(sent ? t("pushTestSent") : t("pushTestNone"));
          } catch (err) {
            toast(errText(err));
          }
        } }, h("span", { class: "row-text" }, h("span", { class: "row-value tint" }, t("pushTest"))))
      );
    }
    const hint = { "ios-install": t("pushIosHint"), unsupported: t("pushUnsupported"), denied: t("pushDenied"), off: t("pushHint"), on: t("pushHint") }[st];
    wrap.replaceChildren(h("h2", { class: "group-header" }, t("notifications")), h("div", { class: "group" }, rows), h("p", { class: "group-footer" }, hint));
  };
  draw();
  return wrap;
}

if ("serviceWorker" in navigator) {
  // A tapped notification while the app is open: go to its page.
  navigator.serviceWorker.addEventListener("message", (e) => {
    if (e.data?.type === "open" && e.data.url) {
      const u = new URL(e.data.url, location.origin);
      if (u.origin === location.origin) go(u.pathname + u.search);
    }
  });
}

// ------------------------------------------------------------------ home
// Like the 2024 app's main page: one big button per area of the congress.
// Kaleiçi harbour, the same photo the website opens with.
const HERO_IMG = "https://images.unsplash.com/photo-1654162115137-4f083a2ac627?auto=format&fit=crop&w=1200&q=70";
const CONGRESS_START = Date.parse("2027-03-31T10:00:00+03:00");

function countdownParts(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
}

function viewHome(screen) {
  const u = state.user;
  screen.classList.add("home");
  const cleanups = [];

  // Hero: photo of Antalya with a live countdown, or what's on during the congress.
  const heroBody = h("div", { class: "hero-body" });
  const hero = h(
    "section",
    { class: "hero" },
    h("img", { class: "hero-img", src: HERO_IMG, alt: "", decoding: "async", fetchpriority: "high" }),
    h("div", { class: "hero-shade" }),
    h("div", { class: "hero-top" }, wordmark(), h("a", { href: "/profile", "data-link": true, class: "home-me", "aria-label": t("tabProfile") }, avatar(u))),
    heroBody
  );
  const units = ["cdDays", "cdHours", "cdMin", "cdSec"];
  const cells = units.map(() => h("span", { class: "cd-num" }, "0"));
  const drawHero = () => {
    const now = nowMs();
    if (now < CONGRESS_START) {
      if (!heroBody.querySelector(".cd")) {
        heroBody.replaceChildren(
          h("p", { class: "hero-hello" }, t("hello", { name: u.name.split(" ")[0] })),
          h("p", { class: "hero-kicker" }, t("untilCongress")),
          h("div", { class: "cd" }, units.map((k, i) => h("span", { class: "cd-cell" }, cells[i], h("span", { class: "cd-unit" }, t(k))))),
          h("p", { class: "hero-sub" }, t("dates"))
        );
      }
      countdownParts(CONGRESS_START - now).forEach((v, i) => (cells[i].textContent = i ? String(v).padStart(2, "0") : v));
    } else {
      const agenda = state.agenda || cachedAgenda();
      heroBody.replaceChildren(h("p", { class: "hero-hello" }, t("hello", { name: u.name.split(" ")[0] })), agenda ? liveCard(agenda) : h("p", { class: "hero-sub" }, t("dates")));
    }
  };
  drawHero();
  const tick = setInterval(drawHero, 1000);
  cleanups.push(() => clearInterval(tick));

  // Tiles fill in with live numbers as they arrive.
  const tile = (href, ic, label, cls = "") => {
    const sub = h("span", { class: "tile-sub" });
    const extra = h("span", { class: "tile-extra" });
    const el = h("a", { href, "data-link": true, class: "tile " + cls }, h("span", { class: "tile-head" }, icon(ic, "tile-ic"), icon("chevron", "tile-go")), extra, h("span", { class: "tile-label" }, label), sub);
    return { el, sub, extra };
  };
  const agendaT = tile("/agenda", "agenda", t("tabAgenda"), "wide accent");
  const peopleT = tile("/people", "people", t("directory"));
  const hallT = tile("/plenary", "plenary", t("tabPlenary"), "dark");
  const meetT = tile("/meet", "meet", t("tabMeet"), "accent-soft");
  const annT = tile("/info", "megaphone", t("announcements"), "wide");
  const teamT = tile("/team", "team", t("team"));
  const reqT = tile("/requests", "inbox", t("requests"));
  const mapT = tile("/map", "map", t("tabMap"));
  const questT = tile("/quest", "compass", t("quest"), "sunset-tile");
  const apprT = tile("/approvals", "trophy", t("approvals"), "wide dark");
  const storeT = tile("/store", "bag", t("store"));
  const recapT = tile("/recap", "sparkle", t("recapTitle"), "wide recap-tile");
  questT.sub.textContent = t("questTile");
  storeT.sub.textContent = t("storeTile");
  recapT.sub.textContent = t("recapTile");
  apprT.sub.textContent = t("apprTile");
  agendaT.sub.textContent = t("homeAgendaSub");
  peopleT.sub.textContent = t("directoryHint");
  hallT.sub.textContent = t("plenaryTile");
  meetT.sub.textContent = t("meetTile");
  annT.sub.textContent = t("announcementsHint");
  teamT.sub.textContent = t("teamHint");
  reqT.sub.textContent = t("requestsHint");
  mapT.sub.textContent = t("mapTile");

  const nudge = h("div", { class: "push-nudge-slot" });
  pushStatus().then((st) => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem("pushNudge") === "off";
    } catch {}
    if (dismissed || !["off", "ios-install"].includes(st)) return;
    const close = () => {
      try {
        localStorage.setItem("pushNudge", "off");
      } catch {}
      nudge.replaceChildren();
    };
    const card = h(
      "div",
      { class: "push-nudge" },
      icon("bell", "push-nudge-icon"),
      h("div", { class: "push-nudge-text" }, h("strong", {}, t("pushNudgeTitle")), h("span", {}, st === "ios-install" ? t("pushIosHint") : t("pushNudgeBody"))),
      st === "off"
        ? h("button", { type: "button", class: "btn btn-small", onclick: async () => {
            try {
              await pushSubscribe();
              toast(t("pushOn"));
              close();
            } catch (err) {
              toast(pushErrText(err));
            }
          } }, t("pushTurnOn"))
        : null,
      h("button", { type: "button", class: "icon-btn push-nudge-x", "aria-label": t("close"), onclick: close }, icon("xmark"))
    );
    nudge.replaceChildren(card);
  });

  screen.append(
    hero,
    nudge,
    h("div", { class: "bento" }, [...(nowMs() > CONGRESS_END - 864e5 ? [recapT] : []), agendaT, peopleT, hallT, meetT, questT, apprT, storeT, teamT, annT, reqT, mapT].map((x, i) => {
      x.el.style.setProperty("--i", i);
      return x.el;
    }))
  );

  // Next session for the agenda tile.
  const nextSession = (agenda) => {
    const now = nowMs();
    const up = allSessions(agenda).filter((x) => x.s.status !== "cancelled" && x.end > now).sort((a, b) => a.start - b.start)[0];
    if (!up) return;
    agendaT.extra.replaceChildren(h("span", { class: "tile-big" }, up.s.title), h("span", { class: "tile-meta" }, `${fmtDay(up.day.date, { weekday: "short", day: "numeric", month: "short" })} · ${up.s.start} · ${up.s.location}`));
    agendaT.sub.textContent = "";
  };
  const cachedA = state.agenda || cachedAgenda();
  if (cachedA) nextSession(cachedA);
  loadAgenda().then(nextSession).catch(() => {});

  // Faces of a few delegates and how many there are.
  api("GET", "/api/people").then(({ people }) => {
    const faces = people.slice(0, 4).map((p) => avatar(p, "face"));
    peopleT.extra.replaceChildren(h("span", { class: "faces" }, faces), h("span", { class: "tile-num" }, String(people.length + 1)));
  }).catch(() => {});

  // Matches so far for the Meet tile.
  api("GET", "/api/meet/matches").then(({ matches }) => {
    if (!matches.length) return;
    meetT.extra.replaceChildren(h("span", { class: "faces" }, matches.slice(0, 4).map((p) => avatar(p, "face"))), h("span", { class: "tile-num" }, String(matches.length)));
    meetT.sub.textContent = t("matchesCount", { n: matches.length });
  }).catch(() => {});

  // How many people are in the hall right now, with tiny figures.
  const hallCount = () =>
    api("GET", "/api/plenary").then(({ people }) => {
      hallT.extra.replaceChildren(h("span", { class: "mini-hall" }, people.slice(0, 6).map((p) => figure(p))), h("span", { class: "tile-num" }, String(people.length)));
      hallT.sub.textContent = t("inHall", { n: people.length });
    }).catch(() => {});
  hallCount();
  const hallTimer = setInterval(() => document.visibilityState === "visible" && hallCount(), 15000);
  cleanups.push(() => clearInterval(hallTimer));

  const drawAnn = () =>
    latestAnnouncement().then((a) => {
      if (!a) return;
      annT.extra.replaceChildren(h("span", { class: "tile-big" }, a.title), a.deadline ? h("span", { class: "tile-meta strong" }, deadlineText(a)) : null);
      annT.sub.textContent = "";
    }).catch(() => {});
  drawAnn();
  window.addEventListener("announcements-updated", drawAnn);
  cleanups.push(() => window.removeEventListener("announcements-updated", drawAnn));

  // Quest points and the approvals race, live.
  api("GET", "/api/quest").then((d) => {
    const done = d.stations.filter((s) => s.done).length;
    questT.extra.replaceChildren(h("span", { class: "tile-num" }, `${d.points} ${t("pts")}`));
    questT.sub.textContent = t("questStations", { n: done, total: d.stations.length });
  }).catch(() => {});
  api("GET", "/api/approvals").then((d) => {
    const top = d.lcs.slice().sort((a, b) => b.approved / (b.goal || 1) - a.approved / (a.goal || 1)).slice(0, 4);
    const A = d.lcs.reduce((a, x) => a + x.approved, 0), G = d.lcs.reduce((a, x) => a + x.goal, 0);
    apprT.extra.replaceChildren(
      h("span", { class: "mini-race" }, top.map((x) => {
        const b = h("span", { class: "mini-bar" }, h("span", {}), h("em", {}, x.name.replace(/^AIESEC in /, "")));
        b.firstChild.style.setProperty("--w", Math.min(100, pct(x.approved, x.goal)) + "%");
        return b;
      })),
      h("span", { class: "tile-num" }, `${pct(A, G)}%`)
    );
    apprT.sub.textContent = t("apprTileSub", { a: fmtNum(A), g: fmtNum(G) });
  }).catch(() => {});

  // Opened a station QR before signing in: check in now.
  const pendingCode = sessionStorage.getItem("questCode");
  if (pendingCode) {
    sessionStorage.removeItem("questCode");
    setTimeout(() => go("/q/" + pendingCode), 0);
  }

  return () => cleanups.forEach((f) => f());
}

// ------------------------------------------------------------------ congress modules
// Modelled on the 2024 delegate app: delegates by position, the CC team,
// announcements with deadlines, and requests/complaints to the organizers.

const POSITIONS = ["MCPc", "MCPe", "MCVP", "LCP", "LCVP", "Other"];
const posLabel = (p) => (p === "Other" ? t("pos_Other") : p);
const forPosition = (s, pos) => !s.audience?.length || s.audience.includes(pos);

function positionSelect(value, name) {
  const sel = h("select", { name, "aria-label": t("position") }, h("option", { value: "" }, t("positionNone")), POSITIONS.map((p) => h("option", { value: p }, posLabel(p))));
  sel.value = value;
  return sel;
}

// Bottom sheet with someone's card and a message button.
async function openPerson(id) {
  if (id === state.user.id) return;
  const box = h("div", { class: "sheet", role: "dialog", "aria-modal": "true" }, h("div", { class: "loading" }));
  const back = h("div", { class: "sheet-backdrop", onclick: (e) => e.target === back && close() }, box);
  const close = () => {
    back.classList.remove("show");
    setTimeout(() => back.remove(), 250);
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (e) => e.key === "Escape" && close();
  document.addEventListener("keydown", onKey);
  document.body.append(back);
  requestAnimationFrame(() => back.classList.add("show"));
  try {
    const { person: p } = await api("GET", "/api/people/" + encodeURIComponent(id));
    box.replaceChildren(
      h("div", { class: "sheet-grab", "aria-hidden": "true" }),
      avatar(p, "avatar-xl"),
      h("h2", { class: "sheet-name" }, p.name),
      h("p", { class: "sheet-sub" }, [p.title, p.position && posLabel(p.position), p.entity].filter(Boolean).join(" · ")),
      p.bio ? h("p", { class: "sheet-bio" }, p.bio) : null,
      p.bioTranslated ? h("p", { class: "fineprint center" }, t("translatedFrom")) : null,
      h("button", { type: "button", class: "btn btn-filled", onclick: async () => {
        const { id: conv } = await api("POST", "/api/conversations/dm", { userId: p.id });
        close();
        go("/messages/" + encodeURIComponent(conv));
      } }, icon("messages"), t("sendMessage"))
    );
  } catch (e) {
    toast(errText(e));
    close();
  }
}

function viewDirectory(screen) {
  const search = h("input", { type: "search", class: "search", placeholder: t("searchPeople"), "aria-label": t("searchPeople"), autocomplete: "off" });
  let filter = sessionStorage.getItem("dirPos") || "";
  const chips = h("div", { class: "chips chips-scroll", role: "radiogroup", "aria-label": t("position") });
  const list = h("div", { class: "group" }, h("div", { class: "loading" }));
  screen.append(navBar({ title: t("directory"), back: "/home", action: h("a", { href: "/world", "data-link": true, class: "nav-action" }, icon("globe"), t("worldShort")) }), h("div", { class: "pad" }, search), chips, list);
  let people = [];
  const drawChips = () =>
    chips.replaceChildren(
      ...[["", t("all")], ...POSITIONS.map((p) => [p, posLabel(p)])].map(([v, label]) => {
        const n = v ? people.filter((p) => p.position === v).length : people.length;
        return h("button", { type: "button", role: "radio", "aria-checked": String(filter === v), class: "chip" + (filter === v ? " on" : ""), onclick: () => {
          filter = v;
          sessionStorage.setItem("dirPos", v);
          drawChips();
          draw();
        } }, label, h("span", { class: "chip-n" }, n));
      })
    );
  const draw = () => {
    const q = search.value.trim().toLocaleLowerCase(locale());
    const items = people.filter((p) => (!filter || p.position === filter) && (!q || `${p.name} ${p.entity}`.toLocaleLowerCase(locale()).includes(q)));
    if (!items.length) return list.replaceChildren(h("p", { class: "empty" }, t("noPeople")));
    list.replaceChildren(
      ...items.map((p) =>
        h("button", { type: "button", class: "row", onclick: () => openPerson(p.id) },
          avatar(p),
          h("span", { class: "row-text" }, h("span", { class: "row-value" }, p.name), h("span", { class: "row-label" }, [p.position && posLabel(p.position), p.entity].filter(Boolean).join(" · "))),
          icon("chevron", "row-chevron"))
      )
    );
  };
  search.addEventListener("input", draw);
  api("GET", "/api/people").then((d) => {
    people = d.people;
    drawChips();
    draw();
  }).catch((e) => list.replaceChildren(h("p", { class: "empty" }, errText(e))));
}

function viewTeam(screen) {
  const grid = h("div", { class: "team-grid" }, h("div", { class: "loading" }));
  screen.append(navBar({ title: t("team"), back: "/home" }), grid);
  api("GET", "/api/team").then(({ team }) => {
    if (!team.length) return grid.replaceChildren(h("p", { class: "empty" }, t("teamEmpty")));
    grid.replaceChildren(
      ...team.map((p) =>
        h("button", { type: "button", class: "team-card", onclick: () => openPerson(p.id) },
          avatar(p, "avatar-xl"),
          h("span", { class: "team-name" }, p.name),
          h("span", { class: "team-title" }, p.title || t("organizer")))
      )
    );
  }).catch((e) => grid.replaceChildren(h("p", { class: "empty" }, errText(e))));
}

async function loadAnnouncements() {
  if (!state.announcements) state.announcements = (await api("GET", "/api/announcements")).announcements;
  return state.announcements;
}
async function latestAnnouncement() {
  const list = await loadAnnouncements();
  const now = Date.now();
  // Prefer the nearest open deadline, otherwise the newest post.
  const open = list.filter((a) => a.deadline && deadlineMs(a.deadline) > now).sort((a, b) => deadlineMs(a.deadline) - deadlineMs(b.deadline));
  return open[0] || list[0] || null;
}
// Deadlines are entered in Türkiye time.
const deadlineMs = (v) => Date.parse(v + ":00+03:00");
function deadlineText(a) {
  if (!a.deadline) return "";
  const ms = deadlineMs(a.deadline);
  const when = new Intl.DateTimeFormat(locale(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }).format(ms);
  const left = ms - Date.now();
  return `${t("deadline")}: ${when} · ${left > 0 ? t("timeLeft", { t: fmtDuration(left) }) : t("deadlinePassed")}`;
}
function announcementBanner(a) {
  const closed = a.deadline && deadlineMs(a.deadline) <= Date.now();
  return h("a", { href: "/info", "data-link": true, class: "ann-banner" + (closed ? " closed" : "") },
    icon("megaphone", "ann-icon"),
    h("span", { class: "row-text" }, h("span", { class: "ann-title" }, a.title), h("span", { class: "ann-sub" }, deadlineText(a) || a.body)),
    icon("chevron", "row-chevron"));
}

function viewInfo(screen) {
  const list = h("div", { class: "ann-list" }, h("div", { class: "loading" }));
  const admin = state.user.role === "admin";
  screen.append(navBar({ title: t("announcements"), back: "/home" }));
  if (admin) {
    const title = h("input", { type: "text", maxlength: 120, required: true, "aria-label": t("annTitle") });
    const body = h("textarea", { rows: 3, maxlength: 1000, "aria-label": t("annBody") });
    const deadline = h("input", { type: "datetime-local", "aria-label": t("deadline") });
    const btn = h("button", { type: "submit", class: "btn btn-filled" }, t("post"));
    screen.append(h("form", { class: "admin", onsubmit: async (e) => {
      e.preventDefault();
      btn.disabled = true;
      try {
        await api("POST", "/api/announcements", { title: title.value, body: body.value, deadline: deadline.value });
        e.target.reset();
        state.announcements = null;
        draw();
        toast(t("saved"));
      } catch (err) {
        toast(errText(err));
      } finally {
        btn.disabled = false;
      }
    } },
      h("h2", { class: "group-header" }, `${t("organizer")} · ${t("newAnnouncement")}`),
      h("div", { class: "group" },
        h("label", { class: "field" }, h("span", { class: "field-label" }, t("annTitle")), title),
        h("label", { class: "field field-stack" }, h("span", { class: "field-label" }, t("annBody")), body),
        h("label", { class: "field" }, h("span", { class: "field-label" }, t("deadline")), deadline)),
      btn));
  }
  screen.append(list);
  const draw = () =>
    loadAnnouncements().then((items) => {
      if (!items.length) return list.replaceChildren(h("p", { class: "empty" }, t("noAnnouncements")));
      list.replaceChildren(
        ...items.map((a) => {
          const closed = a.deadline && deadlineMs(a.deadline) <= Date.now();
          return h("article", { class: "ann" + (a.deadline ? " has-deadline" : "") + (closed ? " closed" : "") },
            a.deadline ? h("p", { class: "ann-deadline" }, icon("clock"), deadlineText(a)) : null,
            h("h2", { class: "ann-title" }, a.title),
            a.body ? h("p", { class: "ann-body" }, a.body) : null,
            h("p", { class: "ann-meta" }, `${a.by} · ${fmtTime(a.at)}${a.titleOriginal || a.bodyOriginal ? " · " + t("translatedFrom") : ""}`),
            admin ? h("button", { type: "button", class: "link-btn destructive", onclick: async () => {
              await api("POST", `/api/announcements/${a.id}/delete`).catch((e) => toast(errText(e)));
              state.announcements = null;
              draw();
            } }, t("delete")) : null);
        })
      );
    }).catch((e) => list.replaceChildren(h("p", { class: "empty" }, errText(e))));
  draw();
  const onUpdate = () => draw();
  window.addEventListener("announcements-updated", onUpdate);
  return () => window.removeEventListener("announcements-updated", onUpdate);
}

function viewRequests(screen) {
  const admin = state.user.role === "admin";
  let kind = "request";
  const text = h("textarea", { rows: 4, maxlength: 1000, required: true, placeholder: t("requestPlaceholder"), "aria-label": t("newRequest") });
  const btn = h("button", { type: "submit", class: "btn btn-filled" }, t("send"));
  const list = h("div", { class: "req-list" }, h("div", { class: "loading" }));
  screen.append(
    navBar({ title: t("requests"), back: "/home" }),
    h("form", { onsubmit: async (e) => {
      e.preventDefault();
      btn.disabled = true;
      try {
        await api("POST", "/api/requests", { kind, text: text.value });
        text.value = "";
        toast(t("sent"));
        draw();
      } catch (err) {
        toast(errText(err));
      } finally {
        btn.disabled = false;
      }
    } },
      h("h2", { class: "group-header" }, t("newRequest")),
      h("div", { class: "group" },
        h("div", { class: "field field-stack" }, segmented(["request", "complaint", "lost"].map((k) => [k, t("kind_" + k)]), kind, (v) => (kind = v), t("newRequest"))),
        h("label", { class: "field field-stack" }, text)),
      h("p", { class: "group-footer" }, t("requestHint")),
      btn),
    h("h2", { class: "group-header" }, admin ? t("allRequests") : t("myRequests")),
    list
  );
  const card = (q) => {
    const reply = admin ? h("textarea", { rows: 2, maxlength: 1000, placeholder: t("replyPlaceholder"), "aria-label": t("reply") }, q.replyOriginal || q.reply || "") : null;
    const update = async (patch) => {
      try {
        await api("POST", "/api/requests/" + q.id, patch);
        toast(t("saved"));
        draw();
      } catch (err) {
        toast(errText(err));
      }
    };
    return h("article", { class: "req" + (q.status === "done" ? " done" : "") },
      h("div", { class: "req-head" },
        h("span", { class: "req-kind kind-" + q.kind }, t("kind_" + q.kind)),
        h("span", { class: "status " + (q.status === "done" ? "status-done" : "status-open") }, t("req_" + q.status)),
        h("span", { class: "req-time" }, fmtTime(q.at))),
      admin ? h("p", { class: "req-from" }, [q.name, q.entity].filter(Boolean).join(" · ")) : null,
      h("p", { class: "req-text" }, q.text),
      q.textOriginal ? h("p", { class: "fineprint" }, t("translatedFrom")) : null,
      !admin && q.reply ? h("div", { class: "req-reply" }, h("span", { class: "row-label" }, `${t("reply")} · ${q.replyBy || t("organizer")}`), h("p", {}, q.reply)) : null,
      admin
        ? h("div", { class: "req-admin" }, reply,
            h("div", { class: "req-actions" },
              h("button", { type: "button", class: "btn btn-tinted", onclick: () => update({ reply: reply.value }) }, t("reply")),
              h("button", { type: "button", class: "btn btn-plain", onclick: () => update({ status: q.status === "done" ? "open" : "done" }) }, q.status === "done" ? t("reopen") : t("markDone"))))
        : null);
  };
  const draw = () =>
    api("GET", "/api/requests").then(({ requests }) => {
      if (!requests.length) return list.replaceChildren(h("p", { class: "empty" }, t("noRequests")));
      list.replaceChildren(...requests.map(card));
    }).catch((e) => list.replaceChildren(h("p", { class: "empty" }, errText(e))));
  draw();
  const onUpdate = () => draw();
  window.addEventListener("requests-updated", onUpdate);
  return () => window.removeEventListener("requests-updated", onUpdate);
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
    const { user } = await api("GET", "/api/me");
    state.user = user;
    setLang(user.lang);
    startStream();
    pushResync();
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
  if (here() === "/" || here() === "/index.html") history.replaceState({}, "", withBase(state.user ? "/home" : "/welcome"));
  render();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

boot();
