"use client";

import React, { useState } from "react";
import DateVersePage from "./verse/[date]/page";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { BookOpen, Calendar } from "lucide-react";

export default function HomePage() {
  const [homeView, setHomeView] = useState<"promise" | "calendar-hero">(
    "promise"
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#EAF5FF] overflow-x-hidden">
      {/* Floating View Switcher Pill in Bottom-Left so user can view both the Royal Navy Promise View & 3D Calendar Hero View */}
      <div className="fixed bottom-4 left-4 z-50 inline-flex items-center rounded-full bg-white/95 backdrop-blur-md p-1 shadow-[0_8px_28px_rgba(9,45,89,0.25)] border border-[#B8D8F8]">
        <button
          type="button"
          onClick={() => setHomeView("promise")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-nav-unique text-xs font-bold transition-all ${
            homeView === "promise"
              ? "bg-gradient-to-r from-[#092D59] to-[#12549A] text-white shadow"
              : "text-[#092D59] hover:bg-blue-50"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#FFC629]" />
          <span>ఈరోజు వాక్యం (Promise View)</span>
        </button>
        <button
          type="button"
          onClick={() => setHomeView("calendar-hero")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-nav-unique text-xs font-bold transition-all ${
            homeView === "calendar-hero"
              ? "bg-gradient-to-r from-[#092D59] to-[#12549A] text-white shadow"
              : "text-[#092D59] hover:bg-blue-50"
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#FFC629]" />
          <span>2027 క్యాలెండర్ (3D Hero)</span>
        </button>
      </div>

      {homeView === "promise" ? (
        <DateVersePage />
      ) : (
        <main className="min-h-screen flex flex-col bg-[#EAF5FF] overflow-x-hidden">
          <Navbar />
          <HeroSection />
        </main>
      )}
    </div>
  );
}
