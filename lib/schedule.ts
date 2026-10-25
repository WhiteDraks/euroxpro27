import { content } from "./content";

// ============================================================
// EUROXPRO'27 — Indicative Conference Schedule Framework
// Status: Program to be announced (Provisional Framework)
// NOTE: Specific session titles, guest speakers, and workshop details
// are pending official release by the Organizing Committee.
// ============================================================

// Days and sessions are stored in content/site.json (congress.schedule) and edited from /admin.
export const isDraftSchedule = content.congress.schedule.showDraftNotice;
export const scheduleStatusLabel = "Program to be announced";

export const schedule = content.congress.schedule.days;
