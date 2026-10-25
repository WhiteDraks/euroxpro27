import type { ScheduleDay } from "./types";

// ============================================================
// EUROXPRO'27 — Indicative Conference Schedule Framework
// Status: Program to be announced (Provisional Framework)
// NOTE: Specific session titles, guest speakers, and workshop details
// are pending official release by the Organizing Committee.
// ============================================================

export const isDraftSchedule = true;
export const scheduleStatusLabel = "Program to be announced";

export const schedule: ScheduleDay[] = [
  {
    day: 1,
    date: "Wednesday, 31 March 2027",
    label: "Arrival & Opening",
    sessions: [
      {
        id: "d1-1",
        time: "10:00 – 18:00",
        title: "Delegate Arrivals & AYT Airport Welcome Desk",
        type: "logistics",
        location: "Antalya Airport (AYT) & Congress Welcome Desk",
        description:
          "Official arrival period for international delegations. Organizing Committee welcome desks at AYT facilitate greeting and transit coordination to the official congress lodging.",
      },
      {
        id: "d1-2",
        time: "14:00 – 18:30",
        title: "Delegate Accreditation & Badge Collection",
        type: "logistics",
        location: "Congress Accreditation Desk",
        description:
          "Accreditation and distribution of official EUROXPRO'27 delegate kits, credentials, and regional documentation.",
      },
      {
        id: "d1-3",
        time: "19:00 – 20:30",
        title: "Mediterranean Welcome Dinner",
        type: "social",
        location: "Congress Dining Terrace",
        description:
          "Opening coastal dinner bringing together national teams, entity leaders, and the Organizing Committee.",
        dressCode: "Smart Casual",
      },
      {
        id: "d1-4",
        time: "20:45 – 22:30",
        title: "Opening Plenary: Mediterranean Assembly",
        type: "plenary",
        location: "Main Plenary Hall",
        description:
          "Official opening assembly of EUROXPRO'27. Formal flag ceremony, welcome addresses from AIESEC in Türkiye leadership, and orientation for the days ahead.",
        dressCode: "Smart Casual",
      },
    ],
  },
  {
    day: 2,
    date: "Thursday, 1 April 2027",
    label: "Regional Alignment",
    sessions: [
      {
        id: "d2-1",
        time: "08:00 – 09:00",
        title: "Breakfast & Morning Briefing",
        type: "break",
        location: "Dining Hall",
        description: "Morning buffet and day orientation for all accredited delegates.",
      },
      {
        id: "d2-2",
        time: "09:00 – 10:45",
        title: "Plenary 1: Regional Alignment & Priorities (Title TBA)",
        type: "plenary",
        location: "Main Plenary Hall",
        description:
          "Indicative morning plenary focused on European organizational priorities, regional performance metrics, and strategic direction. Official speaker lineup to be announced.",
      },
      {
        id: "d2-3",
        time: "11:15 – 13:00",
        title: "Parallel Functional Tracks: Session 1 (Topics TBA)",
        type: "workshop",
        location: "Breakout Rooms",
        description:
          "Specialized capacity building tracks designed for local committee presidents, vice presidents, and functional leaders. Session topics to be announced.",
      },
      {
        id: "d2-4",
        time: "14:30 – 17:30",
        title: "Entity Collaboration & Knowledge Exchange",
        type: "networking",
        location: "Congress Hall",
        description:
          "Structured bilateral meetings between national entities to establish exchange partnerships and share operational best practices.",
      },
      {
        id: "d2-5",
        time: "20:30 – 23:30",
        title: "Global Village & Cultural Night",
        type: "social",
        location: "Congress Event Pavilion",
        description:
          "The signature AIESEC Global Village celebrating cultural diversity across Europe with national booths, authentic delicacies, and cultural performances.",
        dressCode: "Traditional / National Attire",
      },
    ],
  },
  {
    day: 3,
    date: "Friday, 2 April 2027",
    label: "Exchange & Growth",
    sessions: [
      {
        id: "d3-1",
        time: "09:00 – 10:45",
        title: "Plenary 2: Expanding Global Opportunities (Title TBA)",
        type: "plenary",
        location: "Main Plenary Hall",
        description:
          "Strategic session dedicated to scaling international youth exchanges (Global Volunteer, Global Talent, Global Teacher) across European territories.",
      },
      {
        id: "d3-2",
        time: "11:15 – 13:00",
        title: "Parallel Functional Tracks: Session 2 (Topics TBA)",
        type: "workshop",
        location: "Breakout Rooms",
        description:
          "Action-oriented workshops focusing on marketing, product delivery, customer experience, and talent management.",
      },
      {
        id: "d3-3",
        time: "14:30 – 18:00",
        title: "Leadership Development & Partnership Forum",
        type: "workshop",
        location: "Congress Hall",
        description:
          "Collaborative forums exploring youth leadership competencies, external partnerships, and organizational sustainability.",
      },
      {
        id: "d3-4",
        time: "20:30 – 23:00",
        title: "Mediterranean Evening Gathering",
        type: "social",
        location: "Seaside Venue",
        description:
          "Cultural evening providing delegates an informal setting to build lifelong connections and experience regional hospitality.",
        dressCode: "Smart Casual",
      },
    ],
  },
  {
    day: 4,
    date: "Saturday, 3 April 2027",
    label: "Governance & Gala",
    sessions: [
      {
        id: "d4-1",
        time: "09:00 – 12:30",
        title: "Legislative Assembly & Regional Motions (Indicative)",
        type: "plenary",
        location: "Main Plenary Hall",
        description:
          "Formal regional governance session covering legislative votes, regional updates, and collaborative agreements among Member Committees.",
      },
      {
        id: "d4-2",
        time: "14:00 – 17:00",
        title: "Strategic Commitments & Entity Goal Setting",
        type: "workshop",
        location: "Breakout Rooms",
        description:
          "Entities align on quantitative goals, exchange targets, and multilateral commitments for the upcoming operational cycle.",
      },
      {
        id: "d4-3",
        time: "19:30 – 23:30",
        title: "Turkish Night & Regional Awards Gala",
        type: "social",
        location: "Grand Ballroom",
        description:
          "The signature gala banquet of EUROXPRO'27. Formal celebration of Turkish gastronomy, folklore, and recognition of outstanding regional achievements.",
        dressCode: "Black Tie / Formal Evening Attire",
      },
    ],
  },
  {
    day: 5,
    date: "Sunday, 4 April 2027",
    label: "Closing & Departures",
    sessions: [
      {
        id: "d5-1",
        time: "09:30 – 11:30",
        title: "Closing Ceremony & Regional Declaration",
        type: "plenary",
        location: "Main Plenary Hall",
        description:
          "Official closing assembly: reflection on congress outcomes, presentation of the regional declaration, and ceremonial handover.",
        dressCode: "Smart Casual",
      },
      {
        id: "d5-2",
        time: "12:00 – 13:30",
        title: "Farewell Luncheon",
        type: "social",
        location: "Dining Hall & Terraces",
        description:
          "Final gathering for delegates to celebrate congress accomplishments and say farewell to European colleagues.",
      },
      {
        id: "d5-3",
        time: "14:00 – 20:00",
        title: "Official Check-Out & Airport Transfers to AYT",
        type: "logistics",
        location: "Lobby & Transit Bays",
        description:
          "Coordinated delegate check-out and scheduled transfer departures to Antalya Airport (AYT) for international flights.",
      },
    ],
  },
];
