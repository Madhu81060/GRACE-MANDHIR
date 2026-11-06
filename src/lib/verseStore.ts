export interface VerseRecord {
  id: string;
  date: string; // YYYY-MM-DD
  teluguVerse: string;
  teluguHighlightTop?: string;
  teluguHighlightMain?: string;
  teluguHighlightMid?: string;
  teluguHighlightSub?: string;
  englishVerse: string;
  teluguReference: string;
  englishReference: string;
  themeTitle: string;
  teluguThemeTitle: string;
  backgroundUrl: string;
  templateId: string;
}

export interface WallpaperBackground {
  id: string;
  name: string;
  teluguName: string;
  url: string;
  category: "sunrise" | "cross" | "nature" | "floral";
}

export interface WallpaperTemplate {
  id: string;
  name: string;
  teluguName: string;
  description: string;
  aspectRatio: "1:1" | "9:16";
}

export interface ChurchSettings {
  churchName: string;
  tagline: string;
  teluguTagline: string;
  phoneNumbers: string;
  whatsappNumber: string;
  pastorName: string;
  pastorPhotoUrl: string;
  logoUrl: string;
}

export const DEFAULT_CHURCH_SETTINGS: ChurchSettings = {
  churchName: "GRACE MANDHIR",
  tagline: "A House of Prayer for All Nations",
  teluguTagline: "సకల జనులకు ప్రార్థనా మందిరము",
  phoneNumbers: "7661845090.9666723272",
  whatsappNumber: "917661845090",
  pastorName: "Grace Mandhir Ministries",
  pastorPhotoUrl: "/images/vagdanam-sample.jpg",
  logoUrl: "",
};

export const DEFAULT_BACKGROUNDS: WallpaperBackground[] = [
  {
    id: "bg-vagdanam-nature",
    name: "Grace Mandhir Vagdanam Nature",
    teluguName: "వాగ్దానం ప్రకృతి నేపథ్యం",
    url: "/images/vagdanam-sample.jpg",
    category: "nature",
  },
  {
    id: "bg-good-shepherd",
    name: "Green Meadow & Good Shepherd",
    teluguName: "పచ్చిక బయలు & మంచి కాపరి",
    url: "/images/jesus-calendar-art.jpg",
    category: "nature",
  },
  {
    id: "bg-sunrise-cross",
    name: "Golden Mountain Sunrise & Cross",
    teluguName: "పర్వత సూర్యోదయం & సిలువ",
    url: "/images/hero-sunrise-cross.jpg",
    category: "sunrise",
  },
  {
    id: "bg-dove-lake",
    name: "Peaceful Dove & Reflected Cross",
    teluguName: "శాంతి పావురం & సిలువ",
    url: "/images/wallpaper-sunrise-cross.jpg",
    category: "cross",
  },
];

export const DEFAULT_TEMPLATES: WallpaperTemplate[] = [
  {
    id: "royal-burgundy",
    name: "Royal Burgundy & Golden Laurel (Unique Theme)",
    teluguName: "రాయల్ గోల్డ్ & మెరూన్ వాగ్దాన థీమ్",
    description:
      "Unique royal burgundy dome card with golden laurel wreaths, metallic gold reference plaque & Jesus artwork",
    aspectRatio: "1:1",
  },
  {
    id: "promise-poster",
    name: "Grace Mandhir Forest-Green Vagdanam",
    teluguName: "గ్రేస్ మందిర్ గ్రీన్ వాగ్దాన టెంప్లేట్",
    description:
      "Green gradient Vagdanam design with radial dotted date & pastor badges, 3D white/lime Telugu typography & diagonal social footer",
    aspectRatio: "1:1",
  },
  {
    id: "mobile-sunrise",
    name: "Grace Mobile Lockscreen (1080×1920)",
    teluguName: "మొబైల్ లాక్‌స్క్రీన్ వాల్పేపర్ (1080×1920)",
    description:
      "Vertical 9:16 lock-screen wallpaper with sunrise cross, church crest & bilingual verse",
    aspectRatio: "9:16",
  },
];

export const CURATED_VERSES: VerseRecord[] = [
  {
    id: "v-2026-11-05",
    date: "2026-11-05",
    teluguVerse:
      "నేను ఒంటరిగా నుండినను నీవే నన్ను సురక్షితముగా నివసింపజేయుదువు.",
    teluguHighlightTop: "నేను",
    teluguHighlightMain: "ఒంటరిగా",
    teluguHighlightMid: "నుండినను",
    teluguHighlightSub: "నీవే నన్ను సురక్షితముగా\nనివసింపజేయుదువు",
    englishVerse: "I will not be alone; You will make me dwell in safety.",
    teluguReference: "కీర్తనలు.4:8",
    englishReference: "Psalms 4:8",
    themeTitle: "Divine Protection & Safety",
    teluguThemeTitle: "ఈరోజు వాగ్దానం",
    backgroundUrl: "/images/vagdanam-sample.jpg",
    templateId: "promise-poster",
  },
  {
    id: "v-2026-11-06",
    date: "2026-11-06",
    teluguVerse:
      "నేను ఒంటరిగా నుండినను నీవే నన్ను సురక్షితముగా నివసింపజేయుదువు.",
    teluguHighlightTop: "నేను",
    teluguHighlightMain: "ఒంటరిగా",
    teluguHighlightMid: "నుండినను",
    teluguHighlightSub: "నీవే నన్ను సురక్షితముగా\nనివసింపజేయుదువు",
    englishVerse: "I will not be alone; You will make me dwell in safety.",
    teluguReference: "కీర్తనలు.4:8",
    englishReference: "Psalms 4:8",
    themeTitle: "Safe in His Hands",
    teluguThemeTitle: "ఈరోజు వాగ్దానం",
    backgroundUrl: "/images/vagdanam-sample.jpg",
    templateId: "promise-poster",
  },
  {
    id: "v-2026-11-07",
    date: "2026-11-07",
    teluguVerse: "నేను నిన్ను బలపరచి నీకు సహాయము చేయుదును.",
    teluguHighlightTop: "నేను",
    teluguHighlightMain: "నిన్ను బలపరచి",
    teluguHighlightMid: "ఎల్లప్పుడును",
    teluguHighlightSub: "నీకు సహాయము\nచేయుదును",
    englishVerse: "I will strengthen you and help you.",
    teluguReference: "యెషయా.41:10",
    englishReference: "Isaiah 41:10",
    themeTitle: "Strength & Help",
    teluguThemeTitle: "దేవుని బలము",
    backgroundUrl: "/images/jesus-calendar-art.jpg",
    templateId: "promise-poster",
  },
  {
    id: "v-2027-01-01",
    date: "2027-01-01",
    teluguVerse: "నేను నిన్ను బలపరచి నీకు సహాయము చేయుదును.",
    teluguHighlightTop: "నేను",
    teluguHighlightMain: "నిన్ను బలపరచి",
    teluguHighlightMid: "అనుదినము",
    teluguHighlightSub: "నీకు సహాయము\nచేయుదును",
    englishVerse: "I will strengthen you and help you.",
    teluguReference: "యెషయా.41:10",
    englishReference: "Isaiah 41:10",
    themeTitle: "New Year Promise 2027",
    teluguThemeTitle: "నూతన సంవత్సర వాగ్దానం",
    backgroundUrl: "/images/hero-sunrise-cross.jpg",
    templateId: "promise-poster",
  },
  {
    id: "v-2027-01-02",
    date: "2027-01-02",
    teluguVerse:
      "యెహోవా నిన్ను ఆశీర్వదించి నిన్ను కాపాడును గాక; నీమీద కృప చూపును గాక.",
    teluguHighlightTop: "యెహోవా",
    teluguHighlightMain: "ఆశీర్వదించి",
    teluguHighlightMid: "నిరంతరము",
    teluguHighlightSub: "నిన్ను కాపాడి నీమీద\nకృప చూపును గాక",
    englishVerse:
      "The Lord bless you and keep you; the Lord make His face shine upon you.",
    teluguReference: "సంఖ్యాకాండము.6:24",
    englishReference: "Numbers 6:24-25",
    themeTitle: "Aaronic Blessing",
    teluguThemeTitle: "ఆశీర్వాద వాక్యం",
    backgroundUrl: "/images/wallpaper-sunrise-cross.jpg",
    templateId: "promise-poster",
  },
  {
    id: "v-2027-01-03",
    date: "2027-01-03",
    teluguVerse:
      "యెహోవా నా కాపరి, నాకు లేమి కలుగదు. పచ్చికగల చోట్ల ఆయన నన్ను పరుండజేయుచున్నాడు.",
    teluguHighlightTop: "యెహోవా",
    teluguHighlightMain: "నా కాపరి",
    teluguHighlightMid: "ఎన్నడును",
    teluguHighlightSub: "నాకు ఏ మేలుకు\nలేమి కలుగదు",
    englishVerse:
      "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures.",
    teluguReference: "కీర్తనలు.23:1",
    englishReference: "Psalms 23:1-2",
    themeTitle: "The Good Shepherd",
    teluguThemeTitle: "మంచి కాపరి",
    backgroundUrl: "/images/jesus-calendar-art.jpg",
    templateId: "promise-poster",
  },
  {
    id: "v-2027-01-04",
    date: "2027-01-04",
    teluguVerse:
      "నేను మిమ్మును గూర్చి ఉద్దేశించిన సంగతులను నేనే ఎరుగుదును, అవి సమాధానకరమైన ఉద్దేశములే.",
    teluguHighlightTop: "నావి",
    teluguHighlightMain: "సమాధానకరమైన",
    teluguHighlightMid: "ఉద్దేశములే",
    teluguHighlightSub: "నిరీక్షణ గల భవిష్యత్తును\nమీకు ఇచ్చెదను",
    englishVerse:
      "For I know the plans I have for you, declares the Lord, plans for peace and a future with hope.",
    teluguReference: "యిర్మీయా.29:11",
    englishReference: "Jeremiah 29:11",
    themeTitle: "Future Filled With Hope",
    teluguThemeTitle: "నిరీక్షణ గల భవిష్యత్తు",
    backgroundUrl: "/images/hero-sunrise-cross.jpg",
    templateId: "promise-poster",
  },
  {
    id: "v-2027-01-05",
    date: "2027-01-05",
    teluguVerse: "నేను నిన్ను\nబలపరచి నీకు\nసహాయము చేయుదును.",
    teluguHighlightTop: "నేను",
    teluguHighlightMain: "నిన్ను బలపరచి",
    teluguHighlightMid: "ఎల్లప్పుడును",
    teluguHighlightSub: "నీకు సహాయము\nచేయుదును",
    englishVerse: "I will strengthen you and help you.",
    teluguReference: "యెషయా 41:10",
    englishReference: "Isaiah 41:10",
    themeTitle: "Divine Strength & Help",
    teluguThemeTitle: "ఈరోజు వాగ్దానం",
    backgroundUrl: "/images/royal-theme-ref.jpg",
    templateId: "royal-burgundy",
  },
];

const TELUGU_MONTHS = [
  "జనవరి",
  "ఫిబ్రవరి",
  "మార్చి",
  "ఏప్రిల్",
  "మే",
  "జూన్",
  "జూలై",
  "ఆగస్టు",
  "సెప్టెంబర్",
  "అక్టోబర్",
  "నవంబర్",
  "డిసెంబర్",
];

const TELUGU_WEEKDAYS = [
  "ఆదివారం",
  "సోమవారం",
  "మంగళవారం",
  "బుధవారం",
  "గురువారం",
  "శుక్రవారం",
  "శనివారం",
];

export function formatTeluguDateHeader(dateStr: string): string {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return "2026 నవంబర్ 05, గురువారం";
  }
  const [year, month, day] = parts;
  const dateObj = new Date(year, month - 1, day);
  const monthName = TELUGU_MONTHS[(month - 1 + 12) % 12] || "నవంబర్";
  const weekdayName = TELUGU_WEEKDAYS[dateObj.getDay()] || "గురువారం";
  const paddedDay = String(day).padStart(2, "0");
  return `${year} ${monthName} ${paddedDay}, ${weekdayName}`;
}

export function formatEnglishDateBadge(dateStr: string): {
  year: string;
  month: string;
  day: string;
} {
  const MONTHS_EN = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return { year: "2026", month: "NOVEMBER", day: "05" };
  }
  const [year, month, day] = parts;
  return {
    year: String(year),
    month: MONTHS_EN[(month - 1 + 12) % 12] || "NOVEMBER",
    day: String(day).padStart(2, "0"),
  };
}

export function getAdjacentDate(dateStr: string, offsetDays: number): string {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return "2026-11-05";
  }
  const [year, month, day] = parts;
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function resolveVerseForDate(
  dateStr: string,
  customVerses: VerseRecord[] = CURATED_VERSES
): VerseRecord {
  const exact = customVerses.find((v) => v.date === dateStr);
  if (exact) return exact;

  const hash = dateStr
    .split("")
    .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 1), 0);
  const pool = customVerses.length > 0 ? customVerses : CURATED_VERSES;
  const chosen = pool[hash % pool.length];
  return {
    ...chosen,
    id: `v-${dateStr}`,
    date: dateStr,
  };
}
