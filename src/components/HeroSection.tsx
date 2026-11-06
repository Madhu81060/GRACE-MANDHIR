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
  Palette,
} from "lucide-react";
import { CalendarMockup } from "./CalendarMockup";
import { PhoneMockup } from "./PhoneMockup";
import { resolveVerseForDate, CURATED_VERSES } from "@/lib/verseStore";

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [heroTheme, setHeroTheme] = useState<"rose" | "navy">("rose");

  const activeDateStr = `2027-01-${String(selectedDay).padStart(2, "0")}`;
  const activeVerse = resolveVerseForDate(activeDateStr, CURATED_VERSES);

  const handleSharePlatform = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/verse/2026-11-05`
        : "https://gracemandhir.org/verse/2026-11-05";
    const text = `ప్రతిరోజూ దేవుని వాక్యం – మీ మొబైల్ స్క్రీన్పై!\n"${activeVerse.teluguVerse}" (${activeVerse.teluguReference})\n${activeVerse.englishVerse} (${activeVerse.englishReference})\nGrace Mandhir Church Daily Promise Wallpaper: ${shareUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Grace Mandhir Church - Daily Bible Verse Wallpaper",
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

  const isNavy = heroTheme === "navy";

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden flex flex-col justify-between select-none">
      {/* Cinematic Sunrise & Mountain Cross Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-sunrise-cross.jpg"
          alt="Grace Mandhir Church Sunrise Mountain Cross Background"
          className="w-full h-full object-cover object-right animate-bg-zoom"
        />

        {isNavy ? (
          /* Deep Navy Blue (#092D59) & Royal Blue (#12549A) Cinematic Gradient Overlay */
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(95deg, rgba(9,45,89,0.96) 0%, rgba(9,45,89,0.88) 38%, rgba(18,84,154,0.52) 68%, rgba(9,45,89,0.25) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 75% 32%, rgba(255,198,41,0.28) 0%, transparent 55%)",
              }}
            />
          </>
        ) : (
          /* Soft Rose-Blush & Golden Sunrise Overlay Matching Reference Image 1 */
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(95deg, rgba(255,248,252,0.96) 0%, rgba(253,235,245,0.92) 42%, rgba(246,214,234,0.72) 68%, rgba(255,222,195,0.45) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 52% 28%, rgba(255,255,255,0.75) 0%, transparent 60%)",
              }}
            />
          </>
        )}

        {/* Realistic Wooden Tabletop Surface at the Bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-44 sm:h-52 border-t border-[#D8B4A0]/60"
          style={{
            background: isNavy
              ? "linear-gradient(180deg, rgba(28,18,16,0.78) 0%, rgba(15,10,12,0.95) 100%)"
              : "linear-gradient(180deg, rgba(235,204,186,0.82) 0%, rgba(206,165,142,0.94) 45%, rgba(178,132,108,0.98) 100%)",
          }}
        >
          {/* Subtle wood grain lines */}
          <div
            className="w-full h-full opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 11px, rgba(90,45,25,0.22) 12px)",
            }}
          />
        </div>
      </div>

      {/* Decorative Top-Right & Bottom-Left Pink Blossom Branches (Matches Reference Image 1) */}
      <div
        className="hidden md:block absolute top-0 right-0 w-64 h-64 pointer-events-none z-10 opacity-90"
        aria-hidden="true"
      >
        <svg viewBox="0 0 240 240" className="w-full h-full">
          <path
            d="M240 0 Q175 45 140 110 M195 30 Q150 40 115 25 M210 65 Q185 110 195 160"
            stroke="#3F6212"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <ellipse cx="155" cy="70" rx="16" ry="7" transform="rotate(-30 155 70)" fill="#4D7C0F" />
          <ellipse cx="195" cy="115" rx="18" ry="8" transform="rotate(25 195 115)" fill="#65A30D" />
          {/* Pink Blossoms */}
          <g>
            <circle cx="140" cy="40" r="18" fill="#F43F5E" opacity="0.9" />
            <circle cx="140" cy="40" r="5" fill="#FEF08A" />
            <circle cx="178" cy="58" r="22" fill="#EC4899" opacity="0.92" />
            <circle cx="178" cy="58" r="6" fill="#FEF08A" />
            <circle cx="215" cy="36" r="19" fill="#FB7185" opacity="0.9" />
            <circle cx="215" cy="36" r="5" fill="#FEF08A" />
            <circle cx="212" cy="88" r="20" fill="#F43F5E" opacity="0.9" />
            <circle cx="212" cy="88" r="5.5" fill="#FEF08A" />
            <circle cx="225" cy="138" r="17" fill="#EC4899" opacity="0.88" />
            <circle cx="225" cy="138" r="4.5" fill="#FEF08A" />
          </g>
        </svg>
      </div>

      {/* Theme Toggle Pill in Top-Right of Hero */}
      <div className="relative z-30 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 flex justify-between items-center">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border shadow-sm ${
            isNavy
              ? "bg-[#092D59]/80 text-[#FFC629] border-[#FFC629]/40"
              : "bg-white/85 text-[#75145E] border-[#E8C5DC]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="font-telugu">
            ప్రతిరోజూ దేవుని వాక్యం – మీ మొబైల్ స్క్రీన్పై
          </span>
        </div>

        <button
          type="button"
          onClick={() => setHeroTheme(isNavy ? "rose" : "rose" === heroTheme ? "navy" : "rose")}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm border ${
            isNavy
              ? "bg-[#FFC629] text-[#092D59] border-white/40"
              : "bg-white/90 text-[#092D59] border-pink-200 hover:bg-[#092D59] hover:text-white"
          }`}
          title="Switch between Reference Rose Sunrise & Royal Navy Gold themes"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>{isNavy ? "Rose Sunrise Theme" : "Navy & Gold Theme"}</span>
        </button>
      </div>

      {/* Main 3-Part Hero Composition */}
      <div className="relative z-20 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6 lg:py-4 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-4">
          {/* LEFT SIDE – TELUGU & ENGLISH TEXT CONTENT (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left animate-fade-in-up">
            {/* Main Telugu Heading */}
            <h1 className="font-telugu font-black tracking-tight leading-[1.15]">
              <span
                className={`block text-3xl sm:text-4xl xl:text-[44px] mb-1 ${
                  isNavy
                    ? "text-white telugu-heading-shadow"
                    : "text-[#75145E] drop-shadow-[0_2px_2px_rgba(255,255,255,0.9)]"
                }`}
              >
                ప్రతిరోజూ
              </span>
              <span
                className={`block text-5xl sm:text-6xl xl:text-[68px] py-1 ${
                  isNavy
                    ? "text-[#FFC629] gold-text-glow"
                    : "bg-gradient-to-b from-[#B8145A] via-[#8B1346] to-[#590A31] bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(117,20,94,0.2)]"
                }`}
              >
                దేవుని వాక్యం
              </span>
            </h1>

            {/* Telugu Subtitle */}
            <p
              className={`font-telugu text-lg sm:text-xl xl:text-[22px] font-extrabold mt-2 ${
                isNavy ? "text-[#EAF5FF]" : "text-slate-900"
              }`}
            >
              మీ జీవితానికి నూతన ప్రోత్సాహం
            </p>

            {/* Decorative Golden / Rose Floral Separator */}
            <div className="flex items-center justify-center lg:justify-start gap-2 my-3 w-full max-w-xs">
              <div
                className={`h-[1.5px] flex-1 ${
                  isNavy
                    ? "bg-gradient-to-r from-transparent to-[#FFC629]"
                    : "bg-gradient-to-r from-transparent to-[#8B1346]/60"
                }`}
              />
              <span
                className={`text-sm ${
                  isNavy ? "text-[#FFC629]" : "text-[#8B1346]"
                }`}
              >
                🌿 ✦ 📖 ✦ 🌿
              </span>
              <div
                className={`h-[1.5px] flex-1 ${
                  isNavy
                    ? "bg-gradient-to-l from-transparent to-[#FFC629]"
                    : "bg-gradient-to-l from-transparent to-[#8B1346]/60"
                }`}
              />
            </div>

            {/* English Heading & Subtitle */}
            <div className="mb-3">
              <h2
                className={`font-serif italic text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isNavy ? "text-[#FFC629]" : "text-[#8B1346]"
                }`}
              >
                Daily Word of God
              </h2>
              <p
                className={`text-sm sm:text-base font-bold tracking-wide mt-0.5 ${
                  isNavy ? "text-white" : "text-slate-900"
                }`}
              >
                A New Blessing Every Day
              </p>
            </div>

            {/* Description in Telugu */}
            <p
              className={`font-telugu text-sm sm:text-[15.5px] font-semibold leading-[1.75] max-w-lg mb-6 ${
                isNavy ? "text-[#EAF5FF]/95" : "text-slate-900"
              }`}
            >
              2027 క్రైస్తవ క్యాలెండర్లో ప్రతి తేదీకి ఒక ప్రత్యేకమైన QR కోడ్
              ఉంటుంది. దానిని స్కాన్ చేసి ఆ రోజుకు సంబంధించిన దేవుని వాక్యాన్ని
              అందమైన వాల్పేపర్గా పొందండి.
            </p>

            {/* Two Prominent Functional CTA Buttons (Matches Reference Image 1 & Prompt) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 w-full">
              {/* Button 1: QR కోడ్ స్కాన్ చేయండి */}
              <Link
                href="/scan"
                className={`group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-telugu text-[15px] sm:text-base font-extrabold transition-all duration-300 transform hover:-translate-y-0.5 ${
                  isNavy
                    ? "bg-gradient-to-b from-[#FFD84D] to-[#FFC629] text-[#092D59] shadow-[0_8px_24px_rgba(255,198,41,0.4)]"
                    : "bg-gradient-to-r from-[#D41C68] via-[#9E1656] to-[#75145E] text-white shadow-[0_8px_22px_rgba(142,20,80,0.38)] hover:shadow-[0_12px_28px_rgba(142,20,80,0.5)]"
                }`}
              >
                <QrCode className="w-5 h-5 shrink-0" />
                <span>QR కోడ్ స్కాన్ చేయండి</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Button 2: వాల్పేపర్ క్రియేట్ చేయండి */}
              <Link
                href="/studio"
                className={`group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-telugu text-[15px] sm:text-base font-extrabold transition-all duration-300 transform hover:-translate-y-0.5 ${
                  isNavy
                    ? "bg-white text-[#092D59] hover:bg-[#EAF5FF] shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
                    : "bg-white/95 text-[#75145E] border-2 border-[#C81D66]/45 hover:border-[#75145E] hover:bg-[#FFF5FA] shadow-[0_6px_18px_rgba(117,20,94,0.14)]"
                }`}
              >
                <ImageIcon className="w-5 h-5 shrink-0 text-[#C81D66]" />
                <span>వాల్పేపర్ క్రియేట్ చేయండి</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Additional Quick Link to Explore Today's Verse (/verse/2026-11-05) */}
            <div className="mt-3.5 flex items-center gap-3 text-xs font-bold">
              <Link
                href="/verse/2026-11-05"
                className={`inline-flex items-center gap-1.5 underline underline-offset-4 ${
                  isNavy
                    ? "text-[#FFC629] hover:text-white"
                    : "text-[#8B1346] hover:text-[#D41C68]"
                }`}
              >
                <span>✨ ఈరోజు వాగ్దాన వాక్యం చూడండి (Explore Today&apos;s Verse)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CENTER & RIGHT SIDE – 3D CALENDAR + CURVED ARROW + SMARTPHONE MOCKUP (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-6 sm:gap-5 xl:gap-7 pt-2">
            {/* Center: Realistic 3D 2027 Spiral Desk Calendar */}
            <div className="animate-float-slow">
              <CalendarMockup
                selectedDay={selectedDay}
                onSelectDay={(day) => setSelectedDay(day)}
                onOpenDateUrl={(dateStr) => router.push(`/verse/${dateStr}`)}
              />
            </div>

            {/* Right: Realistic Smartphone Displaying Daily Bible Verse Wallpaper */}
            <div className="animate-float-delayed">
              <PhoneMockup
                verse={activeVerse}
                onClickPhone={() => router.push(`/verse/${activeDateStr}`)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Open Holy Bible on Wooden Tabletop (Bottom-Left Decor Matching Reference Image 1) */}
      <div
        className="hidden xl:block absolute bottom-7 left-12 w-52 h-24 pointer-events-none z-20"
        aria-hidden="true"
      >
        <svg viewBox="0 0 240 100" className="w-full h-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.38)]">
          {/* Dark Leather Cover */}
          <path
            d="M15 72 L118 82 L225 65 L205 42 L118 55 L35 45 Z"
            fill="#2A1215"
          />
          {/* Gold Page Edges */}
          <path
            d="M20 68 L118 78 L220 61 L216 54 L118 70 L24 60 Z"
            fill="#E5C185"
          />
          {/* Left Open Page */}
          <path
            d="M24 60 Q72 42 118 66 L118 40 Q74 20 36 38 Z"
            fill="#FFFDF9"
            stroke="#D6C7B2"
            strokeWidth="1"
          />
          {/* Right Open Page */}
          <path
            d="M118 66 Q165 38 216 54 L202 30 Q160 14 118 40 Z"
            fill="#FAF3E8"
            stroke="#D6C7B2"
            strokeWidth="1"
          />
          {/* Red Silk Bookmark Ribbon */}
          <path
            d="M118 66 Q128 82 142 94"
            stroke="#BE123C"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom 4-Column Floating Feature Bar (Matches Reference Image 1 Bottom Strip) */}
      <div className="relative z-30 max-w-[1160px] w-full mx-auto px-4 sm:px-6 pb-5 pt-1">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_35px_rgba(45,10,30,0.22)] border border-pink-100/90 px-4 py-3.5 grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 lg:divide-x divide-pink-200/70">
          {/* Feature 1: 365 రోజుల వాక్యాలు */}
          <Link
            href="/calendar"
            className="flex items-center justify-center gap-3 px-2 py-1 group hover:scale-[1.02] transition-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FDF2F8] border border-pink-200 flex items-center justify-center text-[#B8145A] group-hover:bg-[#B8145A] group-hover:text-white transition-colors shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="font-telugu text-left">
              <p className="text-sm sm:text-[15px] font-extrabold text-slate-900 leading-tight">
                365 రోజుల
              </p>
              <p className="text-sm sm:text-[15px] font-extrabold text-slate-900 leading-tight">
                వాక్యాలు
              </p>
            </div>
          </Link>

          {/* Feature 2: అందమైన వాల్పేపర్లు */}
          <Link
            href="/verse/2026-11-05"
            className="flex items-center justify-center gap-3 px-2 py-1 group hover:scale-[1.02] transition-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FDF2F8] border border-pink-200 flex items-center justify-center text-[#B8145A] group-hover:bg-[#B8145A] group-hover:text-white transition-colors shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="font-telugu text-left">
              <p className="text-sm sm:text-[15px] font-extrabold text-slate-900 leading-tight">
                అందమైన
              </p>
              <p className="text-sm sm:text-[15px] font-extrabold text-slate-900 leading-tight">
                వాల్పేపర్లు
              </p>
            </div>
          </Link>

          {/* Feature 3: మీ ఫోటో & చర్చ్ పేరుతో కస్టమైజ్ */}
          <Link
            href="/studio"
            className="flex items-center justify-center gap-3 px-2 py-1 group hover:scale-[1.02] transition-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FDF2F8] border border-pink-200 flex items-center justify-center text-[#B8145A] group-hover:bg-[#B8145A] group-hover:text-white transition-colors shrink-0">
              <Pencil className="w-6 h-6" />
            </div>
            <div className="font-telugu text-left">
              <p className="text-sm sm:text-[15px] font-extrabold text-slate-900 leading-tight">
                మీ ఫోటో &amp;
              </p>
              <p className="text-sm sm:text-[15px] font-extrabold text-slate-900 leading-tight">
                చర్చ్ పేరుతో కస్టమైజ్
              </p>
            </div>
          </Link>

          {/* Feature 4: స్నేహితులతో పంచుకోండి */}
          <button
            type="button"
            onClick={handleSharePlatform}
            className="flex items-center justify-center gap-3 px-2 py-1 group hover:scale-[1.02] transition-transform text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FDF2F8] border border-pink-200 flex items-center justify-center text-[#B8145A] group-hover:bg-[#B8145A] group-hover:text-white transition-colors shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="font-telugu text-left">
              <p className="text-sm sm:text-[15px] font-extrabold text-slate-900 leading-tight">
                స్నేహితులతో
              </p>
              <p className="text-sm sm:text-[15px] font-extrabold text-slate-900 leading-tight">
                పంచుకోండి
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
