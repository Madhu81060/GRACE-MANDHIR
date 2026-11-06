"use client";

import React from "react";
import { Wifi, Battery } from "lucide-react";
import { ChurchLogo } from "./ChurchLogo";
import { VerseRecord } from "@/lib/verseStore";

interface PhoneMockupProps {
  verse: VerseRecord;
  onClickPhone?: () => void;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  verse,
  onClickPhone,
}) => {
  return (
    <div className="relative inline-flex items-center select-none group">
      {/* 3D Curved Golden-Blue Arrow Connecting Calendar QR to Smartphone */}
      <div
        className="hidden sm:block absolute -left-24 top-[42%] -translate-y-1/2 w-32 h-24 z-30 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 160 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_8px_16px_rgba(9,45,89,0.35)]"
        >
          <defs>
            <linearGradient
              id="curvedNavyGoldArrow"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="50%"
            >
              <stop offset="0%" stopColor="#FFC629" />
              <stop offset="50%" stopColor="#12549A" />
              <stop offset="100%" stopColor="#092D59" />
            </linearGradient>
          </defs>
          <path
            d="M 8 58 C 45 25, 95 25, 122 48 L 130 33 L 154 68 L 112 78 L 118 63 C 90 44, 48 45, 8 58 Z"
            fill="url(#curvedNavyGoldArrow)"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Ground Shadow under Phone */}
      <div className="absolute -bottom-4 left-3 right-3 h-7 bg-[#092D59]/35 blur-xl rounded-full pointer-events-none" />

      {/* Outer Metallic Smartphone Frame */}
      <div
        onClick={onClickPhone}
        title="Click to customize or download this wallpaper"
        className="relative z-20 w-[238px] sm:w-[254px] h-[465px] sm:h-[490px] rounded-[42px] p-[9px] bg-gradient-to-b from-slate-700 via-slate-900 to-black shadow-[0_25px_50px_rgba(9,45,89,0.45),0_0_0_1.5px_rgba(255,255,255,0.35)] cursor-pointer transition-transform duration-500 group-hover:-translate-y-1.5"
        style={{
          transform: "rotate(1.6deg)",
        }}
      >
        <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-slate-600 rounded-l" />
        <div className="absolute -left-[3px] top-36 w-[3px] h-12 bg-slate-600 rounded-l" />
        <div className="absolute -right-[3px] top-32 w-[3px] h-14 bg-slate-600 rounded-r" />

        {/* Inner Phone Screen */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-[#EAF5FF] flex flex-col justify-between">
          {/* Bottom Scenic Sunrise & Glowing Cross Artwork */}
          <div className="absolute inset-0 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-sunrise-cross.jpg"
              alt="Sunrise and Cross Wallpaper Background"
              className="w-full h-full object-cover object-right-bottom"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(234,245,255,0.97) 0%, rgba(242,249,255,0.94) 48%, rgba(234,245,255,0.78) 68%, rgba(255,215,140,0.22) 86%, rgba(9,45,89,0.4) 100%)",
              }}
            />
          </div>

          {/* Status Bar + Notch */}
          <div className="relative z-20 pt-2.5 px-5 flex items-center justify-between text-[11px] font-bold text-[#092D59]">
            <span>9:41</span>
            <div className="w-16 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Main Wallpaper Content inside Phone */}
          <div className="relative z-20 flex-1 flex flex-col items-center px-3.5 pt-2 text-center">
            <ChurchLogo size="sm" variant="navy" />
            <h4 className="font-brand-cinzel text-[14px] font-extrabold text-[#092D59] leading-tight mt-1">
              GRACE MANDHIR
            </h4>

            {/* Telugu Bible Verse */}
            <p className="font-card-display text-[16.5px] sm:text-[17.5px] font-extrabold text-[#092D59] leading-[1.42] mt-3 px-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
              {verse.teluguVerse.replace(/\n/g, " ")}
            </p>

            {/* Golden Reference Pill Badge */}
            <div className="mt-2.5 px-4 py-1 rounded-full bg-gradient-to-b from-[#FFF9DB] to-[#F5C242] border border-[#D49212] text-[#092D59] font-card-display text-xs font-extrabold shadow-sm">
              {verse.teluguReference.replace(".", " ")}
            </div>

            {/* English Bible Verse */}
            <p className="font-body-editorial italic text-[14px] font-bold text-[#092D59] leading-snug mt-2.5 px-2 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              {verse.englishVerse}
            </p>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="relative z-20 pb-2 flex justify-center">
            <div className="w-24 h-1 rounded-full bg-white/80 shadow" />
          </div>
        </div>
      </div>
    </div>
  );
};
