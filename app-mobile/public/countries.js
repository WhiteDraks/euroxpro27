// Countries delegates come from, shared by the app (world map, recap) and the
// API (global connections). Entity names are free text ("AIESEC in Poland",
// "AIESEC in Warsaw"); match them to a country by its name in any of our
// languages or a big city. Countries outside the list below are still found by
// their English, Turkish or Polish name.
export const COUNTRIES = [
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

const word = (words) => new RegExp(`(^|[^\\p{L}])(${words})([^\\p{L}]|$)`, "iu");
const COUNTRY_RE = COUNTRIES.map(([code, name, lat, lng, words]) => ({ code, name, lat, lng, re: word(words) }));

// Every ISO code the world map draws; used for the name fallback.
export const ALL_CODES = "AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CK CL CM CN CO CR CU CV CW CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GG GH GL GM GN GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SH SI SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TL TM TN TO TR TT TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS XK YE ZA ZM ZW".split(" ");

let fallback = null;
function fallbackList() {
  if (fallback) return fallback;
  const known = new Set(COUNTRIES.map((c) => c[0]));
  const names = ["en", "tr", "pl"].map((l) => {
    try {
      return new Intl.DisplayNames([l], { type: "region" });
    } catch {
      return null;
    }
  }).filter(Boolean);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  fallback = ALL_CODES.filter((c) => !known.has(c))
    .map((code) => {
      const all = [...new Set(names.map((n) => n.of(code)).filter((n) => n && n !== code && n.length > 3))];
      // Longest names first so "Papua New Guinea" wins over "Guinea".
      return all.length ? { code, name: names[0]?.of(code) || code, len: Math.max(...all.map((n) => n.length)), re: word(all.map(esc).join("|")) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.len - a.len);
  return fallback;
}

export function countryOf(entity) {
  const s = entity || "";
  if (!s) return null;
  return COUNTRY_RE.find((c) => c.re.test(s)) || fallbackList().find((c) => c.re.test(s)) || null;
}

export const flag = (code) => String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
