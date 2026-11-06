export interface DailyVerse {
  day: number;
  month: string;
  monthTelugu: string;
  year: number;
  teluguVerse: string;
  englishVerse: string;
  teluguReference: string;
  englishReference: string;
  themeTitle: string;
  wallpaperImage: string;
}

export interface NavItem {
  label: string;
  href: string;
  id: string;
}

export const JANUARY_2027_VERSES: Record<number, DailyVerse> = {
  1: {
    day: 1,
    month: "JANUARY",
    monthTelugu: "జనవరి",
    year: 2027,
    teluguVerse: "యెహోవా నిన్ను ఆశీర్వదించి నిన్ను కాపాడును గాక; యెహోవా నీకు తన ముఖకాంతిని ప్రకాశింపజేసి నీమీద కృప చూపును గాక.",
    englishVerse: "The Lord bless you and keep you; the Lord make His face shine upon you and be gracious to you.",
    teluguReference: "సంఖ్యాకాండము 6:24-25",
    englishReference: "Numbers 6:24-25",
    themeTitle: "New Year Blessing",
    wallpaperImage: "/images/hero-sunrise-cross.jpg",
  },
  3: {
    day: 3,
    month: "JANUARY",
    monthTelugu: "జనవరి",
    year: 2027,
    teluguVerse: "యెహోవా నా కాపరి, నాకు లేమి కలుగదు. పచ్చికగల చోట్ల ఆయన నన్ను పరుండజేయుచున్నాడు.",
    englishVerse: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures.",
    teluguReference: "కీర్తనలు 23:1-2",
    englishReference: "Psalm 23:1-2",
    themeTitle: "The Good Shepherd",
    wallpaperImage: "/images/wallpaper-sunrise-cross.jpg",
  },
  10: {
    day: 10,
    month: "JANUARY",
    monthTelugu: "జనవరి",
    year: 2027,
    teluguVerse: "భయపడకుము, నేను నీకు తోడైయున్నాను; దిగులుపడకుము, నేను నీ దేవుడను. నిన్ను బలపరతును.",
    englishVerse: "Fear not, for I am with you; be not dismayed, for I am your God. I will strengthen you.",
    teluguReference: "యెషయా 41:10",
    englishReference: "Isaiah 41:10",
    themeTitle: "Divine Strength",
    wallpaperImage: "/images/hero-sunrise-cross.jpg",
  },
  15: {
    day: 15,
    month: "JANUARY",
    monthTelugu: "జనవరి",
    year: 2027,
    teluguVerse: "నేను మిమ్మును గూర్చి ఉద్దేశించిన సంగతులను నేనే ఎరుగుదును, అవి సమాధానకరమైన ఉద్దేశములే.",
    englishVerse: "For I know the plans I have for you, declares the Lord, plans for peace and a future with hope.",
    teluguReference: "యిర్మీయా 29:11",
    englishReference: "Jeremiah 29:11",
    themeTitle: "Promise of Hope",
    wallpaperImage: "/images/wallpaper-sunrise-cross.jpg",
  },
  24: {
    day: 24,
    month: "JANUARY",
    monthTelugu: "జనవరి",
    year: 2027,
    teluguVerse: "ప్రభువు నందు ఎల్లప్పుడును ఆనందించుడి; మరల చెప్పుదును, ఆనందించుడి.",
    englishVerse: "Rejoice in the Lord always; again I will say, rejoice!",
    teluguReference: "ఫిలిప్పీయులకు 4:4",
    englishReference: "Philippians 4:4",
    themeTitle: "Joy in the Lord",
    wallpaperImage: "/images/hero-sunrise-cross.jpg",
  },
};

export function getVerseForDay(day: number): DailyVerse {
  if (JANUARY_2027_VERSES[day]) {
    return JANUARY_2027_VERSES[day];
  }
  return {
    day,
    month: "JANUARY",
    monthTelugu: "జనవరి",
    year: 2027,
    teluguVerse: "యెహోవా నిన్ను ఆశీర్వదించి నిన్ను కాపాడును గాక; యెహోవా నీకు తన ముఖకాంతిని ప్రకాశింపజేసి నీమీద కృప చూపును గాక.",
    englishVerse: "The Lord bless you and keep you; the Lord make His face shine upon you and be gracious to you.",
    teluguReference: "సంఖ్యాకాండము 6:24-25",
    englishReference: "Numbers 6:24-25",
    themeTitle: "Daily Blessing",
    wallpaperImage: day % 2 === 0 ? "/images/wallpaper-sunrise-cross.jpg" : "/images/hero-sunrise-cross.jpg",
  };
}
