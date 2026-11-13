// Places shown on the map. Coordinates are WGS84 (lat, lng).
// The congress venue and hotel are added here once they are announced.
export const CENTER = [36.8841, 30.7056];

export const PLACES = [
  {
    id: "ayt",
    cat: "transport",
    lat: 36.9003,
    lng: 30.7928,
    name: { tr: "Antalya Havalimanı (AYT)", en: "Antalya Airport (AYT)", pl: "Lotnisko Antalya (AYT)" },
    desc: {
      tr: "Varış günü karşılama masası burada olacak.",
      en: "The welcome desk is here on arrival day.",
      pl: "W dniu przyjazdu działa tu punkt powitalny.",
    },
  },
  {
    id: "otogar",
    cat: "transport",
    lat: 36.9228,
    lng: 30.672,
    name: { tr: "Antalya Otogarı", en: "Antalya Bus Terminal", pl: "Dworzec autobusowy Antalya" },
    desc: {
      tr: "Şehirlerarası otobüsler ve tramvay bağlantısı.",
      en: "Intercity buses, with a tram link to the centre.",
      pl: "Autobusy międzymiastowe i tramwaj do centrum.",
    },
  },
  {
    id: "kaleici",
    cat: "explore",
    lat: 36.8838,
    lng: 30.7058,
    name: { tr: "Kaleiçi", en: "Kaleiçi (Old Town)", pl: "Kaleiçi (Stare Miasto)" },
    desc: {
      tr: "Dar sokaklar, eski liman ve akşam yürüyüşü için en iyi yer.",
      en: "Narrow streets and the old harbour. Best for an evening walk.",
      pl: "Wąskie uliczki i stary port. Idealne na wieczorny spacer.",
    },
  },
  {
    id: "hadrian",
    cat: "explore",
    lat: 36.8853,
    lng: 30.7085,
    name: { tr: "Hadrian Kapısı", en: "Hadrian's Gate", pl: "Brama Hadriana" },
    desc: {
      tr: "MS 130'da yapılmış Roma kapısı, Kaleiçi'nin girişi.",
      en: "Roman gate from AD 130 at the entrance to Kaleiçi.",
      pl: "Rzymska brama z 130 r. n.e., wejście do Kaleiçi.",
    },
  },
  {
    id: "museum",
    cat: "explore",
    lat: 36.8857,
    lng: 30.6807,
    name: { tr: "Antalya Müzesi", en: "Antalya Museum", pl: "Muzeum w Antalyi" },
    desc: {
      tr: "Perge ve bölgedeki antik kentlerden eserler.",
      en: "Finds from Perge and other ancient cities nearby.",
      pl: "Zabytki z Perge i innych starożytnych miast regionu.",
    },
  },
  {
    id: "konyaalti",
    cat: "explore",
    lat: 36.864,
    lng: 30.634,
    name: { tr: "Konyaaltı Plajı", en: "Konyaaltı Beach", pl: "Plaża Konyaaltı" },
    desc: {
      tr: "Toros Dağları manzaralı uzun çakıl plaj.",
      en: "Long pebble beach facing the Taurus Mountains.",
      pl: "Długa kamienista plaża z widokiem na góry Taurus.",
    },
  },
  {
    id: "duden",
    cat: "explore",
    lat: 36.8519,
    lng: 30.7838,
    name: { tr: "Düden Şelalesi", en: "Düden Waterfalls", pl: "Wodospady Düden" },
    desc: {
      tr: "Falezlerden denize dökülen şelale.",
      en: "A waterfall dropping from the cliffs into the sea.",
      pl: "Wodospad spadający z klifów prosto do morza.",
    },
  },
  {
    id: "lara",
    cat: "explore",
    lat: 36.851,
    lng: 30.859,
    name: { tr: "Lara Plajı", en: "Lara Beach", pl: "Plaża Lara" },
    desc: {
      tr: "Doğu yakasında kumsal ve oteller bölgesi.",
      en: "Sandy beach and hotel strip on the east side.",
      pl: "Piaszczysta plaża i strefa hoteli na wschodzie miasta.",
    },
  },
];
