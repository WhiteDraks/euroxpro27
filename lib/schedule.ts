import type { ScheduleDay } from "./types";

// ============================================================
// EUROXPRO'27 — Congress Schedule
// Replace with official schedule when confirmed by the OC
// ============================================================

export const isDraftSchedule = true; // Set to false when schedule is officially confirmed

export const schedule: ScheduleDay[] = [
  {
    day: 1,
    date: "Day 1 [DATE TBC]",
    label: "Arrival Day",
    sessions: [
      {
        id: "d1-1",
        time: "10:00",
        endTime: "18:00",
        title: "Delegate Arrivals & Check-In",
        type: "logistics",
        location: "[Hotel Name]",
        description:
          "Welcome to Istanbul! Delegates arrive and check in at the congress hotel. The welcome desk will be open throughout the day.",
      },
      {
        id: "d1-2",
        time: "14:00",
        endTime: "17:00",
        title: "City Orientation Walk [Optional]",
        type: "social",
        location: "Meeting Point: Hotel Lobby",
        description:
          "An optional guided orientation walk around the local area for early arrivals. Get your bearings and meet fellow delegates.",
      },
      {
        id: "d1-3",
        time: "19:00",
        endTime: "20:00",
        title: "Welcome Dinner",
        type: "social",
        location: "[Venue Name]",
        description:
          "Join your fellow delegates for an informal welcome dinner. A great opportunity to meet the Organizing Committee and make new connections.",
        dressCode: "Smart Casual",
      },
      {
        id: "d1-4",
        time: "20:30",
        endTime: "22:00",
        title: "Opening Ceremony",
        type: "plenary",
        location: "[Main Hall]",
        description:
          "The official opening of EUROXPRO'27, featuring welcoming remarks from the LC President, Organizing Committee President, and guest speakers.",
        dressCode: "Smart Casual",
      },
    ],
  },
  {
    day: 2,
    date: "Day 2 [DATE TBC]",
    label: "Congress Day 1",
    sessions: [
      {
        id: "d2-1",
        time: "08:00",
        endTime: "09:00",
        title: "Breakfast",
        type: "break",
        location: "[Hotel Restaurant]",
        description: "Breakfast included for all delegates at the hotel.",
      },
      {
        id: "d2-2",
        time: "09:00",
        endTime: "10:30",
        title: "Opening Plenary: The Future of Global Leadership",
        type: "plenary",
        location: "[Main Hall]",
        description:
          "The congress kicks off with an inspiring keynote on emerging leadership trends and the role of young people in shaping global systems.",
        speaker: "[Keynote Speaker TBC]",
      },
      {
        id: "d2-3",
        time: "10:30",
        endTime: "11:00",
        title: "Networking Break",
        type: "networking",
        location: "[Foyer Area]",
        description: "Coffee, tea, and networking with fellow delegates.",
      },
      {
        id: "d2-4",
        time: "11:00",
        endTime: "12:30",
        title: "Workshop Block A",
        type: "workshop",
        location: "[Breakout Rooms]",
        description:
          "Choose from multiple parallel workshop tracks covering leadership, sustainability, entrepreneurship, and cultural exchange.",
      },
      {
        id: "d2-5",
        time: "12:30",
        endTime: "14:00",
        title: "Lunch",
        type: "break",
        location: "[Hotel Restaurant]",
        description: "Lunch included for all delegates.",
      },
      {
        id: "d2-6",
        time: "14:00",
        endTime: "15:30",
        title: "Workshop Block B",
        type: "workshop",
        location: "[Breakout Rooms]",
        description:
          "Second workshop session with different facilitators and topics.",
      },
      {
        id: "d2-7",
        time: "15:30",
        endTime: "16:00",
        title: "Break",
        type: "break",
        location: "[Foyer Area]",
        description: "Refreshment break.",
      },
      {
        id: "d2-8",
        time: "16:00",
        endTime: "17:30",
        title: "Plenary: AIESEC and the Global Development Agenda",
        type: "plenary",
        location: "[Main Hall]",
        description:
          "An exploration of how AIESEC's mission connects to the UN Sustainable Development Goals and youth-led global impact.",
      },
      {
        id: "d2-9",
        time: "19:30",
        endTime: "22:00",
        title: "Evening Social: Bosphorus Night",
        type: "social",
        location: "[Location TBC]",
        description:
          "An evening social event with views of the Bosphorus. Details to be confirmed.",
        dressCode: "Smart Casual",
      },
    ],
  },
  {
    day: 3,
    date: "Day 3 [DATE TBC]",
    label: "Congress Day 2",
    sessions: [
      {
        id: "d3-1",
        time: "08:00",
        endTime: "09:00",
        title: "Breakfast",
        type: "break",
        location: "[Hotel Restaurant]",
        description: "Breakfast included for all delegates.",
      },
      {
        id: "d3-2",
        time: "09:00",
        endTime: "10:30",
        title: "Morning Plenary: Perspectives from Across Europe",
        type: "plenary",
        location: "[Main Hall]",
        description:
          "Delegate representatives share insights and learnings from their home countries and LC experiences.",
      },
      {
        id: "d3-3",
        time: "10:30",
        endTime: "11:00",
        title: "Break",
        type: "break",
        location: "[Foyer Area]",
        description: "Coffee break.",
      },
      {
        id: "d3-4",
        time: "11:00",
        endTime: "13:00",
        title: "Workshop Block C: Deep-Dive Sessions",
        type: "workshop",
        location: "[Breakout Rooms]",
        description:
          "Extended deep-dive workshop sessions for detailed exploration of key congress themes.",
      },
      {
        id: "d3-5",
        time: "13:00",
        endTime: "14:30",
        title: "Lunch",
        type: "break",
        location: "[Hotel Restaurant]",
        description: "Lunch break.",
      },
      {
        id: "d3-6",
        time: "14:30",
        endTime: "17:00",
        title: "Cultural Afternoon: Istanbul Experience",
        type: "social",
        location: "Various Istanbul Locations",
        description:
          "A guided cultural afternoon exploring Istanbul. Routes and activities to be confirmed by the Organizing Committee.",
      },
      {
        id: "d3-7",
        time: "19:30",
        endTime: "23:00",
        title: "Turkish Night Gala",
        type: "social",
        location: "[Gala Venue TBC]",
        description:
          "The signature evening of EUROXPRO'27 — a Turkish Night celebration with traditional music, cuisine, and cultural performances. Dress to impress!",
        dressCode: "Formal / Traditional Attire",
      },
    ],
  },
  {
    day: 4,
    date: "Day 4 [DATE TBC]",
    label: "Closing Day",
    sessions: [
      {
        id: "d4-1",
        time: "08:00",
        endTime: "09:00",
        title: "Breakfast",
        type: "break",
        location: "[Hotel Restaurant]",
        description: "Final breakfast at the hotel.",
      },
      {
        id: "d4-2",
        time: "09:00",
        endTime: "10:30",
        title: "Closing Plenary: Reflections and Commitments",
        type: "plenary",
        location: "[Main Hall]",
        description:
          "Delegates share their key takeaways and make commitments to carry the congress spirit back to their home entities.",
      },
      {
        id: "d4-3",
        time: "10:30",
        endTime: "11:30",
        title: "OC Presentations & Acknowledgements",
        type: "plenary",
        location: "[Main Hall]",
        description:
          "The Organizing Committee shares final remarks, delegate feedback results, and special acknowledgements.",
      },
      {
        id: "d4-4",
        time: "11:30",
        endTime: "12:30",
        title: "Closing Ceremony",
        type: "plenary",
        location: "[Main Hall]",
        description:
          "The official closing of EUROXPRO'27. A moment to celebrate what we achieved together.",
      },
      {
        id: "d4-5",
        time: "12:30",
        endTime: "14:00",
        title: "Farewell Lunch",
        type: "break",
        location: "[Hotel Restaurant]",
        description: "A final meal together before delegates depart.",
      },
      {
        id: "d4-6",
        time: "14:00",
        title: "Delegate Departures",
        type: "logistics",
        location: "Hotel Lobby",
        description:
          "Delegates check out and depart. Safe travels! The OC team will be available to assist with any last-minute needs.",
      },
    ],
  },
];
