"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Image as ImageIcon,
  ArrowRight,
  Calendar,
  Pencil,
  Share2,
  BookOpen,
} from "lucide-react";
import { CalendarMockup } from "./CalendarMockup";
import { PhoneMockup } from "./PhoneMockup";
import { resolveVerseForDate, CURATED_VERSES } from "@/lib/verseStore";

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number>(5);

  const activeDateStr = `2027-01-${String(selectedDay).padStart(2, "0")}`;
  const activeVerse = resolveVerseForDate(activeDateStr, CURATED_VERSES);

  const handleSharePlatform = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/verse/2027-01-05`
        : "https://gracemandhir.org/verse/2027-01-05";
    const text = `ప్రతిరోజూ దేవుని వాక్యం – మీ మొబైల్ స్క్రీన్పై!\n"${activeVerse.teluguVerse.replace(
      /\n/g,
      " "
    )}" (${activeVerse.teluguReference})\n${activeVerse.englishVerse} (${
      activeVerse.englishReference
    })\nGrace Mandhir: ${shareUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Grace Mandhir - Daily Bible Verse Wallpaper",
          text,
          url: shareUrl,
        });
        return;
      } catch {
        // fallback to WhatsApp
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-84px)] overflow-hidden flex flex-col justify-between select-none bg-[#092D59]">
      {/* Cinematic Sunrise & Mountain Cross Background with Royal Navy & Gold Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-sunrise-cross.jpg"
          alt="Grace Mandhir Sunrise Mountain Cross Background"
          className="w-full h-full object-cover object-right animate-bg-zoom"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(95deg, rgba(9,45,89,0.96) 0%, rgba(9,45,89,0.88) 40%, rgba(18,84,154,0.52) 68%, rgba(9,45,89,0.25) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 75% 32%, rgba(255,198,41,0.28) 0%, transparent 55%)",
          }}
        />
      </div>

      {/* Main 3-Part Hero Composition */}
      <div className="relative z-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-4">
          {/* LEFT SIDE – TELUGU & ENGLISH TEXT CONTENT (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#12549A]/60 text-[#FFC629] border border-[#FFC629]/40 text-xs font-bold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="font-nav-unique">
                ప్రతిరోజూ దేవుని వాక్యం – మీ మొబైల్ స్క్రీన్పై
              </span>
            </div>

            <h1 className="font-body-serif-te font-black tracking-tight leading-[1.15]">
              <span className="block text-3xl sm:text-4xl xl:text-[44px] mb-1 text-white telugu-heading-shadow">
                ప్రతిరోజూ
              </span>
              <span className="block text-5xl sm:text-6xl xl:text-[66px] py-1 text-[#FFC629] gold-text-glow">
                దేవుని వాక్యం
              </span>
            </h1>

            <p className="font-body-serif-te text-lg sm:text-xl xl:text-[22px] font-extrabold mt-2 text-[#EAF5FF]">
              మీ జీవితానికి నూతన ప్రోత్సాహం
            </p>

            {/* Golden Divider */}
            <div className="flex items-center justify-center lg:justify-start gap-2 my-3 w-full max-w-xs">
              <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-[#FFC629]" />
              <span className="text-sm text-[#FFC629]">✦ 📖 ✦</span>
              <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-[#FFC629]" />
            </div>

            <div className="mb-3">
              <h2 className="font-body-editorial italic text-2xl sm:text-3xl font-bold text-[#FFC629]">
                Daily Word of God
              </h2>
              <p className="font-brand-cinzel text-xs sm:text-sm font-bold tracking-wider text-white uppercase mt-0.5">
                A New Blessing Every Day
              </p>
            </div>

            <p className="font-nav-unique text-sm sm:text-[15.5px] font-medium leading-[1.75] max-w-lg mb-6 text-[#EAF5FF]/95">
              2027 క్రైస్తవ క్యాలెండర్లో ప్రతి తేదీకి ఒక ప్రత్యేకమైన QR కోడ్
              ఉంటుంది. దానిని స్కాన్ చేసి ఆ రోజుకు సంబంధించిన దేవుని వాక్యాన్ని
              అందమైన వాల్పేపర్గా పొందండి.
            </p>

            {/* Two Prominent Functional CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 w-full">
              <Link
                href="/scan"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#FFD84D] to-[#FFC629] text-[#092D59] font-nav-unique text-[15px] sm:text-base font-extrabold shadow-[0_8px_24px_rgba(255,198,41,0.4)] transition-all transform hover:-translate-y-0.5"
              >
                <QrCode className="w-5 h-5 shrink-0" />
                <span>QR కోడ్ స్కాన్ చేయండి</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/studio"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#092D59] hover:bg-[#EAF5FF] font-nav-unique text-[15px] sm:text-base font-extrabold shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-all transform hover:-translate-y-0.5"
              >
                <ImageIcon className="w-5 h-5 shrink-0 text-[#12549A]" />
                <span>వాల్పేపర్ క్రియేట్ చేయండి</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* CENTER & RIGHT SIDE – 3D CALENDAR + SMARTPHONE MOCKUP (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-6 sm:gap-5 xl:gap-7 pt-2">
            <div className="animate-float-slow">
              <CalendarMockup
                selectedDay={selectedDay}
                onSelectDay={(day) => setSelectedDay(day)}
                onOpenDateUrl={(dateStr) => router.push(`/verse/${dateStr}`)}
              />
            </div>

            <div className="animate-float-delayed">
              <PhoneMockup
                verse={activeVerse}
                onClickPhone={() => router.push(`/verse/${activeDateStr}`)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 4-Column Floating Feature Bar (Pure Royal Navy & White) */}
      <div className="relative z-30 max-w-[1180px] w-full mx-auto px-4 sm:px-6 pb-6 pt-1">
        <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.28)] border border-blue-100 px-4 py-3.5 grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-200">
          <Link
            href="/calendar"
            className="flex items-center justify-center gap-3 px-2 py-1 group hover:scale-[1.02] transition-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EAF5FF] border border-blue-200 flex items-center justify-center text-[#092D59] group-hover:bg-[#092D59] group-hover:text-white transition-colors shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="font-nav-unique text-left">
              <p className="text-sm sm:text-[15px] font-extrabold text-[#092D59] leading-tight">
                365 రోజుల
              </p>
              <p className="text-sm sm:text-[15px] font-extrabold text-[#092D59] leading-tight">
                వాక్యాలు
              </p>
            </div>
          </Link>

          <Link
            href="/verse/2027-01-05"
            className="flex items-center justify-center gap-3 px-2 py-1 group hover:scale-[1.02] transition-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EAF5FF] border border-blue-200 flex items-center justify-center text-[#092D59] group-hover:bg-[#092D59] group-hover:text-white transition-colors shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="font-nav-unique text-left">
              <p className="text-sm sm:text-[15px] font-extrabold text-[#092D59] leading-tight">
                అందమైన
              </p>
              <p className="text-sm sm:text-[15px] font-extrabold text-[#092D59] leading-tight">
                వాల్పేపర్లు
              </p>
            </div>
          </Link>

          <Link
            href="/studio"
            className="flex items-center justify-center gap-3 px-2 py-1 group hover:scale-[1.02] transition-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EAF5FF] border border-blue-200 flex items-center justify-center text-[#092D59] group-hover:bg-[#092D59] group-hover:text-white transition-colors shrink-0">
              <Pencil className="w-6 h-6" />
            </div>
            <div className="font-nav-unique text-left">
              <p className="text-sm sm:text-[15px] font-extrabold text-[#092D59] leading-tight">
                మీ ఫోటో &amp;
              </p>
              <p className="text-sm sm:text-[15px] font-extrabold text-[#092D59] leading-tight">
                పేరుతో కస్టమైజ్
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleSharePlatform}
            className="flex items-center justify-center gap-3 px-2 py-1 group hover:scale-[1.02] transition-transform text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EAF5FF] border border-blue-200 flex items-center justify-center text-[#092D59] group-hover:bg-[#092D59] group-hover:text-white transition-colors shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="font-nav-unique text-left">
              <p className="text-sm sm:text-[15px] font-extrabold text-[#092D59] leading-tight">
                స్నేహితులతో
              </p>
              <p className="text-sm sm:text-[15px] font-extrabold text-[#092D59] leading-tight">
                పంచుకోండి
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
