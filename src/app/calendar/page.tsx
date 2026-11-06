"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, QrCode, ArrowRight, Sparkles, Printer } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { QrCodeBox } from "@/components/QrCodeBox";
import { resolveVerseForDate, CURATED_VERSES } from "@/lib/verseStore";

const MONTHS_2027 = [
  { num: "01", en: "January", te: "జనవరి", days: 31 },
  { num: "02", en: "February", te: "ఫిబ్రవరి", days: 28 },
  { num: "03", en: "March", te: "మార్చి", days: 31 },
  { num: "04", en: "April", te: "ఏప్రిల్", days: 30 },
  { num: "05", en: "May", te: "మే", days: 31 },
  { num: "06", en: "June", te: "జూన్", days: 30 },
  { num: "07", en: "July", te: "జూలై", days: 31 },
  { num: "08", en: "August", te: "ఆగస్టు", days: 31 },
  { num: "09", en: "September", te: "సెప్టెంబర్", days: 30 },
  { num: "10", en: "October", te: "అక్టోబర్", days: 31 },
  { num: "11", en: "November", te: "నవంబర్", days: 30 },
  { num: "12", en: "December", te: "డిసెంబర్", days: 31 },
];

export default function CalendarDirectoryPage() {
  const [selectedYear, setSelectedYear] = useState<string>("2027");
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(0);

  const activeMonth = MONTHS_2027[selectedMonthIdx];
  const daysArray = Array.from({ length: activeMonth.days }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF7FB] via-[#FCEBF4] to-[#F7DCEC] text-slate-900">
      <Navbar />

      <main className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-pink-200">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F8] border border-pink-200 text-[#8B1346] text-xs font-extrabold mb-2">
              <QrCode className="w-3.5 h-3.5" />
              <span>365 Days Unique QR Code Christian Calendar</span>
            </span>
            <h1 className="font-telugu text-3xl sm:text-4xl font-black text-[#75145E]">
              2027 క్రైస్తవ క్యాలెండర్ &amp; QR కోడ్‌లు
            </h1>
            <p className="font-telugu text-sm font-semibold text-slate-700 mt-1">
              ప్రతి తేదీకి ఒక ప్రత్యేకమైన QR కోడ్ మరియు దేవుని వాగ్దాన వాక్యం. ఏ తేదీనైనా క్లిక్
              చేసి వాల్పేపర్ పొందండి.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-full bg-white p-1 border border-pink-200 shadow-sm">
              {["2026", "2027"].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    selectedYear === yr
                      ? "bg-gradient-to-r from-[#D41C68] to-[#75145E] text-white"
                      : "text-slate-700 hover:text-[#75145E]"
                  }`}
                >
                  {yr} Calendar
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 text-[#75145E] border border-pink-200 text-xs font-extrabold shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Month QR Sheet</span>
            </button>
          </div>
        </div>

        {/* 12 Months Selector Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
          {MONTHS_2027.map((m, idx) => {
            const active = idx === selectedMonthIdx;
            return (
              <button
                key={m.num}
                type="button"
                onClick={() => setSelectedMonthIdx(idx)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all shrink-0 border ${
                  active
                    ? "bg-gradient-to-r from-[#D41C68] to-[#75145E] text-white border-transparent shadow-md scale-105"
                    : "bg-white hover:bg-pink-50 text-slate-800 border-pink-100"
                }`}
              >
                <span className="font-telugu block text-sm font-extrabold">
                  {m.te}
                </span>
                <span className="opacity-80">{m.en}</span>
              </button>
            );
          })}
        </div>

        {/* Date Cards Grid with Unique QR Codes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {daysArray.map((day) => {
            const dateStr = `${selectedYear}-${activeMonth.num}-${String(
              day
            ).padStart(2, "0")}`;
            const verse = resolveVerseForDate(dateStr, CURATED_VERSES);

            return (
              <div
                key={dateStr}
                className="bg-white/95 rounded-2xl p-4 shadow-md border border-pink-100 hover:border-[#C81D66] hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FDF2F8] text-[#C81D66] text-[11px] font-extrabold border border-pink-200">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                      <h3 className="font-telugu text-base font-extrabold text-[#75145E] mt-1.5">
                        {verse.teluguReference}
                      </h3>
                      <p className="text-xs font-bold text-slate-500">
                        {verse.englishReference}
                      </p>
                    </div>

                    <Link href={`/verse/${dateStr}`}>
                      <QrCodeBox
                        date={dateStr}
                        size={68}
                        showCenterLogo={false}
                      />
                    </Link>
                  </div>

                  <p className="font-telugu text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed">
                    &ldquo;{verse.teluguVerse}&rdquo;
                  </p>
                  <p className="font-serif italic text-xs text-slate-600 line-clamp-2 mt-1">
                    &ldquo;{verse.englishVerse}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/verse/${dateStr}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#C81D66] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span className="font-telugu">వాగ్దానం చూడండి</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/studio?date=${dateStr}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-[#75145E] text-[11px] font-bold"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Customize</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
