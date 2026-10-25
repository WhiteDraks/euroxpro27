import type { ScheduleDay } from "./types";

// ============================================================
// EUROXPRO'27 — Congress Schedule
// Confirmed Dates: 31 March – 4 April 2027 | Antalya, Türkiye
// ============================================================

export const isDraftSchedule = false; // Officially scheduled framework for 31 March – 4 April 2027

export const schedule: ScheduleDay[] = [
  {
    day: 1,
    date: "Wednesday, 31 March 2027",
    label: "Arrival Day",
    sessions: [
      {
        id: "d1-1",
        time: "10:00",
        endTime: "18:00",
        title: "Delegate Arrivals & AYT Airport Welcome Desk",
        type: "logistics",
        location: "Antalya Airport (AYT) & Congress Resort Lobby",
        description:
          "Welcome to the Turkish Riviera! Delegates arrive at Antalya Airport (AYT) where the OC Welcome Desk greets delegations and assists with transfers to the congress hotel.",
      },
      {
        id: "d1-2",
        time: "14:00",
        endTime: "17:30",
        title: "Congress Hotel Check-In & Accreditation",
        type: "logistics",
        location: "Resort Accreditation Foyer",
        description:
          "Collect your official EUROXPRO'27 delegate kit, name badge, room keycard, and Mediterranean congress agenda.",
      },
      {
        id: "d1-3",
        time: "19:00",
        endTime: "20:30",
        title: "Mediterranean Welcome Dinner",
        type: "social",
        location: "Resort Seaside Terrace",
        description:
          "Join fellow delegates for an informal coastal dinner. Meet the Organizing Committee, network with European peers, and enjoy Mediterranean cuisine.",
        dressCode: "Smart Casual",
      },
      {
        id: "d1-4",
        time: "20:45",
        endTime: "22:15",
        title: "Opening Ceremony: Mediterranean Horizons",
        type: "plenary",
        location: "Main Plenary Amphitheatre",
        description:
          "The official opening of EUROXPRO'27 in Antalya, featuring flag parade ceremonies, welcoming addresses from AIESEC leadership, and keynote orientations.",
        dressCode: "Smart Casual",
      },
    ],
  },
  {
    day: 2,
    date: "Thursday, 1 April 2027",
    label: "Congress Day 1",
    sessions: [
      {
        id: "d2-1",
        time: "08:00",
        endTime: "09:00",
        title: "Breakfast",
        type: "break",
        location: "Resort Dining Hall",
        description: "Mediterranean buffet breakfast included for all registered delegates.",
      },
      {
        id: "d2-2",
        time: "09:00",
        endTime: "10:45",
        title: "Opening Plenary: Leading Beyond Boundaries",
        type: "plenary",
        location: "Main Plenary Amphitheatre",
        description:
          "High-impact morning plenary examining European geopolitical trends, cross-border youth mobility, and systemic leadership in times of change.",
        speaker: "[Keynote Speaker TBC]",
      },
      {
        id: "d2-3",
        time: "10:45",
        endTime: "11:15",
        title: "Networking & Turkish Coffee Break",
        type: "networking",
        location: "Plenary Foyer & Gardens",
        description: "Fresh Turkish tea, coffee, and structured networking with international delegates.",
      },
      {
        id: "d2-4",
        time: "11:15",
        endTime: "13:00",
        title: "Impact Workshop Track 1: Operational Excellence",
        type: "workshop",
        location: "Breakout Rooms Taurus 1–4",
        description:
          "Targeted breakouts for Local Committee Presidents and VPs focusing on talent development, entity financial sustainability, and exchange pipeline growth.",
      },
      {
        id: "d2-5",
        time: "13:00",
        endTime: "14:30",
        title: "Lunch",
        type: "break",
        location: "Resort Dining Hall",
        description: "Buffet lunch featuring fresh local produce, Turkish mezes, and hot mains.",
      },
      {
        id: "d2-6",
        time: "14:30",
        endTime: "16:15",
        title: "Workshop Track 2: Cross-Border Partnerships",
        type: "workshop",
        location: "Breakout Rooms Taurus 1–4",
        description:
          "Facilitated bilateral matchmaking sessions between European entities to establish exchange cooperations and co-delivery projects.",
      },
      {
        id: "d2-7",
        time: "16:15",
        endTime: "16:45",
        title: "Afternoon Refreshment Break",
        type: "break",
        location: "Plenary Foyer",
        description: "Light refreshments and citrus infusions.",
      },
      {
        id: "d2-8",
        time: "16:45",
        endTime: "18:15",
        title: "Plenary: The Future of Global Youth Leadership",
        type: "plenary",
        location: "Main Plenary Amphitheatre",
        description:
          "Panel discussion on how youth-led organizations drive the UN Sustainable Development Goals across Europe and the Mediterranean basin.",
      },
      {
        id: "d2-9",
        time: "20:00",
        endTime: "22:30",
        title: "Global Village & Entity Night",
        type: "social",
        location: "Resort Grand Courtyard",
        description:
          "The legendary AIESEC Global Village! Delegations share culinary treats, regional drinks, folklore, and country pride from across Europe.",
        dressCode: "National / Cultural Attire",
      },
    ],
  },
  {
    day: 3,
    date: "Friday, 2 April 2027",
    label: "Congress Day 2",
    sessions: [
      {
        id: "d3-1",
        time: "08:00",
        endTime: "09:00",
        title: "Breakfast",
        type: "break",
        location: "Resort Dining Hall",
        description: "Buffet breakfast at the hotel.",
      },
      {
        id: "d3-2",
        time: "09:00",
        endTime: "10:30",
        title: "Morning Plenary: Sustainable Impact at Scale",
        type: "plenary",
        location: "Main Plenary Amphitheatre",
        description:
          "Guest leaders from European business and NGO spheres discussing youth empowerment and sustainable innovation.",
      },
      {
        id: "d3-3",
        time: "10:30",
        endTime: "11:00",
        title: "Morning Break",
        type: "break",
        location: "Plenary Foyer",
        description: "Coffee and networking.",
      },
      {
        id: "d3-4",
        time: "11:00",
        endTime: "13:00",
        title: "Workshop Track 3: Deep Dives & Skill Clinics",
        type: "workshop",
        location: "Breakout Rooms Taurus 1–4",
        description:
          "Intensive skill workshops on digital marketing, stakeholder relations, and youth mental resilience.",
      },
      {
        id: "d3-5",
        time: "13:00",
        endTime: "14:00",
        title: "Lunch",
        type: "break",
        location: "Resort Dining Hall",
        description: "Lunch prior to the afternoon cultural excursion.",
      },
      {
        id: "d3-6",
        time: "14:30",
        endTime: "18:30",
        title: "Cultural Afternoon: Antalya & Kaleiçi Discovery",
        type: "social",
        location: "Kaleiçi Historic Quarter & Roman Harbor",
        description:
          "Guided delegate cultural expedition exploring the ancient Roman harbor, Hadrian's Gate, Ottoman alleys of Kaleiçi, and the Mediterranean cliff panoramas.",
      },
      {
        id: "d3-7",
        time: "20:00",
        endTime: "22:30",
        title: "Riviera Evening Social",
        type: "social",
        location: "Antalya Coastline Venue",
        description:
          "Relaxed evening gathering with music and networking under the Mediterranean night sky.",
        dressCode: "Smart Casual",
      },
    ],
  },
  {
    day: 4,
    date: "Saturday, 3 April 2027",
    label: "Congress Day 3",
    sessions: [
      {
        id: "d4-1",
        time: "08:00",
        endTime: "09:15",
        title: "Breakfast",
        type: "break",
        location: "Resort Dining Hall",
        description: "Breakfast buffet.",
      },
      {
        id: "d4-2",
        time: "09:30",
        endTime: "11:30",
        title: "Plenary: The European Roadmap 2030",
        type: "plenary",
        location: "Main Plenary Amphitheatre",
        description:
          "Strategic congress synthesis: collective European priorities, action mandates, and legislative commitments.",
      },
      {
        id: "d4-3",
        time: "11:30",
        endTime: "12:00",
        title: "Break",
        type: "break",
        location: "Plenary Foyer",
        description: "Coffee and delegate conversations.",
      },
      {
        id: "d4-4",
        time: "12:00",
        endTime: "13:30",
        title: "Regional Roundtables & Mandate Ratification",
        type: "workshop",
        location: "Breakout Rooms Taurus 1–4",
        description:
          "Regional caucuses concluding legislative proposals and establishing sub-regional partnerships.",
      },
      {
        id: "d4-5",
        time: "13:30",
        endTime: "15:00",
        title: "Lunch",
        type: "break",
        location: "Resort Dining Hall",
        description: "Lunch and free time to prepare for the Gala evening.",
      },
      {
        id: "d4-6",
        time: "19:30",
        endTime: "23:30",
        title: "Turkish Night & Awards Gala",
        type: "social",
        location: "Grand Ballroom & Riviera Gardens",
        description:
          "The signature celebration of EUROXPRO'27: a formal Turkish Night with regional gastronomy, live music, folkloric performances, and the European Leadership Awards.",
        dressCode: "Black Tie / Formal / Traditional Attire",
      },
    ],
  },
  {
    day: 5,
    date: "Sunday, 4 April 2027",
    label: "Closing Day",
    sessions: [
      {
        id: "d5-1",
        time: "08:00",
        endTime: "09:30",
        title: "Final Breakfast",
        type: "break",
        location: "Resort Dining Hall",
        description: "Final congress breakfast.",
      },
      {
        id: "d5-2",
        time: "09:30",
        endTime: "11:00",
        title: "Closing Ceremony & Congress Reflections",
        type: "plenary",
        location: "Main Plenary Amphitheatre",
        description:
          "Reflective plenary celebrating achievements, screening the congress video, and honouring the Organizing Committee.",
      },
      {
        id: "d5-3",
        time: "11:00",
        endTime: "12:00",
        title: "Farewell Circle & Group Photography",
        type: "social",
        location: "Resort Amphitheatre Steps",
        description: "Official EUROXPRO'27 group photos and heartfelt farewells with delegates.",
      },
      {
        id: "d5-4",
        time: "12:00",
        endTime: "13:30",
        title: "Farewell Mediterranean Lunch",
        type: "break",
        location: "Resort Dining Hall",
        description: "Final meal together before airport departures.",
      },
      {
        id: "d5-5",
        time: "13:30",
        endTime: "19:00",
        title: "Hotel Check-Out & Airport Transfers",
        type: "logistics",
        location: "Resort Lobby & AYT Airport Shuttles",
        description:
          "Delegates check out of rooms and board coordinated shuttles to Antalya Airport (AYT). Safe travels across Europe and the world!",
      },
    ],
  },
];
