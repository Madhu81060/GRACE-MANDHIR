"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  QrCode,
  Home,
  Calendar,
  Image as ImageIcon,
  HelpCircle,
  Phone,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { ChurchLogo } from "./ChurchLogo";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      te: "హోమ్",
      en: "Home",
      href: "/",
      icon: Home,
      match: (p: string) => p === "/",
    },
    {
      te: "ఈరోజు వాగ్దానం",
      en: "Promise",
      href: "/verse/2027-01-05",
      icon: BookOpen,
      match: (p: string) => p.startsWith("/verse"),
    },
    {
      te: "2027 క్యాలెండర్",
      en: "Calendar",
      href: "/calendar",
      icon: Calendar,
      match: (p: string) => p.startsWith("/calendar"),
    },
    {
      te: "వాల్పేపర్ క్రియేట్",
      en: "Studio",
      href: "/studio",
      icon: ImageIcon,
      match: (p: string) =>
        p.startsWith("/studio") || p.startsWith("/create-wallpaper"),
    },
    {
      te: "ఎలా పనిచేస్తుంది?",
      en: "QR Scan",
      href: "/scan",
      icon: HelpCircle,
      match: (p: string) => p.startsWith("/scan"),
    },
    {
      te: "సంప్రదించండి",
      en: "Contact",
      href: "/verse/2026-11-05",
      icon: Phone,
      match: () => false,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-[#D5E6F7] shadow-[0_6px_28px_rgba(9,45,89,0.08)]">
      {/* Top Royal Gold & Navy Signature Accent Line */}
      <div className="w-full h-1 bg-gradient-to-r from-[#092D59] via-[#FFC629] to-[#092D59]" />

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-[76px] sm:h-[84px] flex items-center justify-between gap-2">
        {/* Left: GRACE MANDHIR Only (No 'Church') + Golden Laurel Wreath Tagline */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
          >
            <div className="p-1.5 rounded-2xl bg-gradient-to-b from-[#EAF5FF] to-white border border-[#C6E0FA] shadow-sm group-hover:scale-105 transition-transform duration-300">
              <ChurchLogo size="sm" variant="navy" />
            </div>

            <div className="flex flex-col">
              <span className="font-nav-unique text-xl sm:text-[26px] font-black text-[#092D59] leading-none tracking-tight">
                గ్రేస్ మందిర్
              </span>
              <span className="font-brand-cinzel text-[11px] sm:text-[13.5px] font-extrabold text-[#12549A] tracking-[0.12em] uppercase mt-1">
                GRACE MANDHIR
              </span>
            </div>
          </Link>

          {/* Vertical Divider */}
          <div className="hidden md:block h-10 w-[1.5px] bg-gradient-to-b from-transparent via-[#B8D4F0] to-transparent mx-1" />

          {/* Golden Laurel Wreath Tagline Badge */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-[#FFFDF5] via-[#FFF9E6] to-[#FFFDF5] border border-[#F5D77F]/60 shadow-sm select-none">
            <svg
              viewBox="0 0 28 52"
              className="w-5 h-9 text-[#D49212] shrink-0"
              fill="currentColor"
            >
              <path d="M22 48 C10 38, 6 22, 18 4 C14 14, 15 32, 24 46 Z" />
              <ellipse cx="11" cy="36" rx="5" ry="2.4" transform="rotate(-35 11 36)" />
              <ellipse cx="9" cy="26" rx="5" ry="2.4" transform="rotate(-15 9 26)" />
              <ellipse cx="11" cy="16" rx="5" ry="2.4" transform="rotate(15 11 16)" />
              <ellipse cx="16" cy="8" rx="4.5" ry="2" transform="rotate(35 16 8)" />
            </svg>

            <div className="flex flex-col items-center text-center leading-tight px-1">
              <span className="font-nav-unique text-[11.5px] xl:text-[12.5px] font-bold text-[#092D59]">
                సమస్త జనులకు ప్రార్థన మందిరం
              </span>
              <span className="font-brand-cinzel text-[8.5px] xl:text-[9.5px] font-bold text-[#8A5A00] tracking-wider uppercase">
                A House of Prayer for All Nations
              </span>
            </div>

            <svg
              viewBox="0 0 28 52"
              className="w-5 h-9 text-[#D49212] shrink-0 transform scale-x-[-1]"
              fill="currentColor"
            >
              <path d="M22 48 C10 38, 6 22, 18 4 C14 14, 15 32, 24 46 Z" />
              <ellipse cx="11" cy="36" rx="5" ry="2.4" transform="rotate(-35 11 36)" />
              <ellipse cx="9" cy="26" rx="5" ry="2.4" transform="rotate(-15 9 26)" />
              <ellipse cx="11" cy="16" rx="5" ry="2.4" transform="rotate(15 11 16)" />
              <ellipse cx="16" cy="8" rx="4.5" ry="2" transform="rotate(35 16 8)" />
            </svg>
          </div>
        </div>

        {/* Center Unique Pill-Dock Navigation (Distinct Mandali + Outfit Font) */}
        <nav
          aria-label="Main Navigation"
          className="hidden xl:flex items-center gap-1 p-1.5 rounded-full bg-[#F0F7FF] border border-[#CDE2F8] shadow-inner"
        >
          {navItems.map((item) => {
            const isActive = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.te}
                href={item.href}
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-nav-unique text-[14px] font-bold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-[#092D59] to-[#12549A] text-white shadow-[0_4px_12px_rgba(9,45,89,0.28)]"
                    : "text-[#092D59] hover:bg-white hover:text-[#12549A]"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-[#FFC629]" : "text-[#12549A]"
                    }`}
                  />
                )}
                <span>{item.te}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: లాగిన్ (Login) Pill Button with Gold Rim */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#092D59] via-[#12549A] to-[#092D59] hover:from-[#061E3E] hover:to-[#092D59] text-white font-nav-unique text-sm font-bold border border-[#FFC629]/60 shadow-[0_4px_14px_rgba(9,45,89,0.28)] transition-all transform hover:-translate-y-0.5"
          >
            <User className="w-4 h-4 text-[#FFC629] stroke-[2.5]" />
            <span>లాగిన్ (Login)</span>
          </Link>
        </div>

        {/* Mobile & Tablet Action Bar */}
        <div className="flex xl:hidden items-center gap-2">
          <Link
            href="/scan"
            className="p-2.5 rounded-full bg-[#EAF5FF] text-[#092D59] border border-[#B8D8F8]"
            aria-label="Scan QR Code"
          >
            <QrCode className="w-5 h-5" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#092D59] text-white shadow-sm"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-blue-100 px-4 pt-3 pb-6 shadow-2xl space-y-2 animate-fade-in-up">
          {/* Mobile Tagline Banner */}
          <div className="md:hidden p-2.5 rounded-xl bg-[#FFFDF5] border border-[#F5D77F]/60 text-center mb-2">
            <p className="font-nav-unique text-xs font-bold text-[#092D59]">
              సమస్త జనులకు ప్రార్థన మందిరం
            </p>
            <p className="font-brand-cinzel text-[10px] font-bold text-[#8A5A00]">
              A House of Prayer for All Nations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = item.match(pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.te}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-nav-unique font-bold text-sm ${
                    isActive
                      ? "bg-gradient-to-r from-[#092D59] to-[#12549A] text-white shadow"
                      : "bg-slate-50 text-[#092D59] hover:bg-[#EAF5FF]"
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    {Icon && (
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-[#FFC629]" : "text-[#12549A]"
                        }`}
                      />
                    )}
                    <span>{item.te}</span>
                  </span>
                  <span className="text-[11px] opacity-75">{item.en}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FFC629] text-[#092D59] font-nav-unique font-bold text-sm shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>వాల్పేపర్ క్రియేట్ (Create Wallpaper)</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#092D59] text-white font-nav-unique font-bold text-sm shadow"
            >
              <User className="w-4 h-4 text-[#FFC629]" />
              <span>లాగిన్ (Admin Login)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
