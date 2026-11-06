"use client";

import React from "react";
import { ChurchLogo } from "./ChurchLogo";
import { QrCodeBox } from "./QrCodeBox";

interface CalendarMockupProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onOpenDateUrl?: (dateStr: string) => void;
}

const WEEKDAYS = [
  { te: "ఆది", en: "SUN", isSun: true },
  { te: "సోమ", en: "MON", isSun: false },
  { te: "మంగళ", en: "TUE", isSun: false },
  { te: "బుధ", en: "WED", isSun: false },
  { te: "గురు", en: "THU", isSun: false },
  { te: "శుక్ర", en: "FRI", isSun: false },
  { te: "శని", en: "SAT", isSun: false },
];

// Matches the exact layout of Reference Image 1 (1..6 on first row, 7..13, 14..20, 21..27, 28..31)
const CALENDAR_CELLS: (number | null)[] = [
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  null,
  null,
  null,
];

export const CalendarMockup: React.FC<CalendarMockupProps> = ({
  selectedDay,
  onSelectDay,
  onOpenDateUrl,
}) => {
  const formattedDate = `2027-01-${String(selectedDay).padStart(2, "0")}`;

  return (
    <div className="relative inline-block select-none group">
      {/* Ground Table Shadow */}
      <div className="absolute -bottom-4 left-4 right-2 h-8 bg-black/35 blur-xl rounded-full pointer-events-none" />

      <div className="relative flex items-end">
        {/* Left 3D Triangular Tent Stand Side Panel */}
        <div
          className="hidden sm:block w-10 h-[370px] bg-gradient-to-br from-[#F3E5EE] via-[#E2CBD9] to-[#C6A9BC] rounded-l-lg shadow-inner border-l border-t border-b border-white/70 origin-bottom-right -mr-2 z-0"
          style={{
            transform: "skewY(12deg) translateY(-14px)",
          }}
        >
          {/* Inner tent shadow fold */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#9C7A8F]/60 to-transparent"
            style={{ clipPath: "polygon(0 100%, 100% 25%, 100% 100%)" }}
          />
        </div>

        {/* Main Front Calendar Sheet */}
        <div
          className="relative z-10 w-[305px] sm:w-[335px] bg-white rounded-xl shadow-[0_22px_45px_rgba(45,10,30,0.32),0_4px_12px_rgba(0,0,0,0.15)] border border-white/95 overflow-visible transition-transform duration-500 group-hover:-translate-y-1"
          style={{
            transform: "rotate(-1.2deg)",
          }}
        >
          {/* Metallic Silver Twin-Wire Spiral Binding Rings at Top */}
          <div className="absolute -top-4 left-3 right-3 flex justify-between items-center z-30 pointer-events-none px-1">
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Metallic Ring */}
                <div className="w-2.5 h-7 rounded-full bg-gradient-to-r from-slate-300 via-white to-slate-400 border border-slate-400/80 shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                {/* Punch Hole */}
                <div className="w-2.5 h-2 rounded-full bg-slate-700/80 -mt-1.5 shadow-inner" />
              </div>
            ))}
          </div>

          {/* Upper Christian Artwork Header Panel */}
          <div className="relative h-[205px] w-full overflow-hidden rounded-t-xl pt-4 px-3">
            {/* Sunrise & Cross Mountain Background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-sunrise-cross.jpg"
              alt="2027 Christian Calendar Sunrise Cross"
              className="absolute inset-0 w-full h-full object-cover object-right scale-105"
            />

            {/* Soft Rose-Gold & Cream Sky Wash on Top/Center for Crisp Text */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5FA]/95 via-[#FCE7F3]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#581038]/35 via-transparent to-transparent" />

            {/* Decorative Pink Blossoms Accent in Top-Left Corner */}
            <div className="absolute -top-2 -left-2 w-24 h-20 pointer-events-none opacity-95">
              <svg viewBox="0 0 100 80" className="w-full h-full">
                <circle cx="22" cy="24" r="11" fill="#F43F5E" opacity="0.85" />
                <circle cx="38" cy="16" r="9" fill="#FB7185" opacity="0.9" />
                <circle cx="14" cy="40" r="8" fill="#EC4899" opacity="0.85" />
                <circle cx="22" cy="24" r="3.5" fill="#FEF08A" />
                <circle cx="38" cy="16" r="2.8" fill="#FEF08A" />
                <circle cx="14" cy="40" r="2.5" fill="#FEF08A" />
              </svg>
            </div>

            {/* Center Church Logo & Calendar Title */}
            <div className="relative z-10 flex flex-col items-center text-center mt-1">
              <ChurchLogo size="sm" variant="rose" />
              <h3 className="font-brand-cinzel text-[15px] font-extrabold text-[#75145E] leading-tight mt-0.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                Grace Mandhir
              </h3>
              <p className="font-serif text-[13px] font-bold text-[#4A0E2E] leading-tight">
                Christian Calendar
              </p>
              <p className="font-serif text-3xl font-black text-[#8B1346] tracking-wider leading-none mt-0.5 drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
                2027
              </p>
            </div>

            {/* Bottom-Left Real Scannable QR Code Card */}
            <div className="absolute bottom-2.5 left-3 z-20 flex items-end gap-2">
              <QrCodeBox
                date={formattedDate}
                size={84}
                onClick={() => onOpenDateUrl?.(formattedDate)}
                className="ring-2 ring-white shadow-lg"
              />
            </div>
          </div>

          {/* Lower Calendar Monthly Grid Section */}
          <div className="bg-gradient-to-b from-white via-[#FFFBFD] to-[#FDF4F8] px-3.5 pt-2.5 pb-3.5 rounded-b-xl border-t border-pink-100">
            {/* Month Pill Badge ("జనవరి - January") */}
            <div className="flex justify-center mb-2">
              <div className="px-5 py-0.5 rounded-full bg-gradient-to-r from-[#D41C68] to-[#75145E] text-white text-xs font-bold shadow-sm tracking-wide">
                <span className="font-telugu">జనవరి</span> - January
              </div>
            </div>

            {/* 7-Column Bilingual Weekday Headers */}
            <div className="grid grid-cols-7 gap-0.5 text-center border-b border-pink-100 pb-1 mb-1">
              {WEEKDAYS.map((wd) => (
                <div key={wd.en} className="flex flex-col leading-tight">
                  <span
                    className={`font-telugu text-[9px] font-bold ${
                      wd.isSun ? "text-[#C81D66]" : "text-slate-700"
                    }`}
                  >
                    {wd.te}
                  </span>
                  <span
                    className={`text-[8px] font-extrabold tracking-tighter ${
                      wd.isSun ? "text-[#C81D66]" : "text-slate-600"
                    }`}
                  >
                    {wd.en}
                  </span>
                </div>
              ))}
            </div>

            {/* Dates Grid (Interactive) */}
            <div className="grid grid-cols-7 gap-y-0.5 gap-x-0.5 text-center">
              {CALENDAR_CELLS.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="h-6" />;
                }
                const isSunday = idx % 7 === 0;
                const isSelected = day === selectedDay;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => onSelectDay(day)}
                    title={`Select Jan ${day}, 2027 Bible Verse`}
                    className={`h-6 w-full rounded-md text-[13px] font-extrabold flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-[#D41C68] to-[#75145E] text-white shadow-sm scale-110 ring-2 ring-[#FFC629]"
                        : isSunday
                        ? "text-[#C81D66] hover:bg-pink-50"
                        : "text-slate-900 hover:bg-pink-50"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
