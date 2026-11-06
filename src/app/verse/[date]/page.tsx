"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  QrCode,
  Image as ImageIcon,
  Upload,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { QrCodeBox } from "@/components/QrCodeBox";
import QRCode from "qrcode";
import {
  WallpaperCanvas,
  WallpaperCanvasHandle,
  WallpaperCustomization,
} from "@/components/WallpaperCanvas";
import {
  VerseRecord,
  DEFAULT_CHURCH_SETTINGS,
  getAdjacentDate,
  resolveVerseForDate,
} from "@/lib/verseStore";

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DateVersePage() {
  const params = useParams();
  const router = useRouter();
  const urlDateParam =
    typeof params?.date === "string" ? params.date : undefined;

  const [rawDate, setRawDate] = useState<string>(
    () => urlDateParam || getTodayDateString()
  );

  useEffect(() => {
    if (urlDateParam) {
      setRawDate(urlDateParam);
    } else {
      setRawDate(getTodayDateString());
    }
  }, [urlDateParam]);

  const canvasRef = useRef<WallpaperCanvasHandle | null>(null);

  const [verse, setVerse] = useState<VerseRecord>(() =>
    resolveVerseForDate(urlDateParam || getTodayDateString())
  );
  const [activeTemplate, setActiveTemplate] = useState<
    "royal-navy" | "promise-poster" | "mobile-sunrise"
  >("royal-navy");
  const [userPhotoUrl, setUserPhotoUrl] = useState<string>("");
  const [showDateModal, setShowDateModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");

  useEffect(() => {
    let active = true;
    fetch(`/api/verses/${rawDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.verse) {
          setVerse(data.verse);
        }
      })
      .catch(() => {
        if (active) setVerse(resolveVerseForDate(rawDate));
      });

    return () => {
      active = false;
    };
  }, [rawDate]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3200);
  };

  const customization: WallpaperCustomization = {
    templateId: activeTemplate,
    backgroundUrl:
      activeTemplate === "royal-navy"
        ? "/images/navy-theme-ref.jpg"
        : activeTemplate === "promise-poster"
        ? "/images/vagdanam-sample.jpg"
        : "/images/hero-sunrise-cross.jpg",
    churchName: DEFAULT_CHURCH_SETTINGS.churchName,
    tagline: DEFAULT_CHURCH_SETTINGS.tagline,
    phoneNumbers: DEFAULT_CHURCH_SETTINGS.phoneNumbers,
    userPhotoUrl,
    churchLogoUrl: "",
    textColor: "#092D59",
    accentColor: "#FFC629",
    fontScale: 1,
    textYOffset: 0,
    overlayOpacity: 0.78,
    showUserPhoto: true,
    showEnglish: true,
    showFooter: true,
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUserPhotoUrl(reader.result);
        triggerToast("మీ ఫోటో వాల్పేపర్పై జోడించబడింది!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (format: "png" | "jpg" = "png") => {
    canvasRef.current?.downloadImage(
      format,
      `Grace-Mandhir-Vagdanam-${rawDate}.${format}`
    );
    triggerToast(`HD వాల్పేపర్ డౌన్‌లోడ్ ప్రారంభమైంది (${format.toUpperCase()})`);
  };

  const handleSaveAsMobileWallpaper = () => {
    setActiveTemplate("mobile-sunrise");
    setTimeout(() => {
      canvasRef.current?.downloadImage(
        "png",
        `Grace-Mandhir-Mobile-Wallpaper-${rawDate}.png`
      );
      triggerToast("1080×1920 మొబైల్ వాల్పేపర్ సేవ్ చేయబడింది!");
    }, 250);
  };

  const handleDownloadQrPng = async (urlToEncode: string, filename: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(urlToEncode, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#092D59",
          light: "#FFFFFF",
        },
      });
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast(`QR కోడ్ డౌన్‌లోడ్ అయింది: ${filename}`);
    } catch {
      triggerToast("QR కోడ్ డౌన్‌లోడ్ విఫలమైంది");
    }
  };

  const handleNativeOrSocialShare = async () => {
    const pageUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `https://gracemandhir.org/verse/${rawDate}`;
    const shareText = `💙 *ఈరోజు దేవుని వాక్యం (${rawDate})*\n\n"${verse.teluguVerse.replace(
      /\n/g,
      " "
    )}"\n— ${verse.teluguReference}\n\n"${verse.englishVerse}"\n— ${
      verse.englishReference
    }\n\n🙏 *GRACE MANDHIR*\n📲 ${pageUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        const blob = await canvasRef.current?.getBlob();
        if (blob) {
          const file = new File([blob], `Grace-Mandhir-${rawDate}.png`, {
            type: "image/png",
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "GRACE MANDHIR Daily Promise",
              text: shareText,
              files: [file],
            });
            return;
          }
        }
        await navigator.share({
          title: "GRACE MANDHIR Daily Promise",
          text: shareText,
          url: pageUrl,
        });
        return;
      } catch {
        // fallback to modal
      }
    }
    setShowShareModal(true);
  };

  const prevDate = getAdjacentDate(rawDate, -1);
  const nextDate = getAdjacentDate(rawDate, 1);

  return (
    <div className="min-h-screen flex flex-col text-slate-900 relative overflow-x-hidden bg-[#EAF5FF]">
      <Navbar />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-[#092D59] text-white text-sm font-bold shadow-2xl">
          <Check className="w-4 h-4 text-[#FFC629]" />
          <span className="font-telugu">{toastMsg}</span>
        </div>
      )}

      {/* Atmospheric Christian Sunrise & Draped Cross Background (Matches media_1793955774641_cdb9e1de.jpg) */}
      <div className="relative flex-1 flex flex-col justify-between">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 58% 34%, #FFFFFF 0%, #F2F8FF 42%, #DDF0FF 78%, #C8E4FF 100%)",
            }}
          />

          {/* Top-Right Green Tree Leaves & Draped Cross on Sunlit Hill */}
          <div className="hidden lg:block absolute top-0 right-0 w-[360px] h-[480px] opacity-95">
            {/* Warm Golden Sunburst behind Cross */}
            <div
              className="absolute top-36 right-8 w-72 h-72 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,220,100,0.85) 0%, rgba(255,198,41,0.28) 55%, transparent 75%)",
              }}
            />
            <svg viewBox="0 0 340 460" className="w-full h-full relative z-10">
              {/* Top-Right Green Tree Foliage */}
              <g fill="#3F7A20" opacity="0.9">
                <ellipse cx="260" cy="22" rx="45" ry="20" transform="rotate(15 260 22)" />
                <ellipse cx="310" cy="45" rx="48" ry="22" transform="rotate(-20 310 45)" />
                <ellipse cx="290" cy="18" rx="35" ry="16" fill="#589A2D" />
                <ellipse cx="330" cy="82" rx="36" ry="18" fill="#4D8B26" />
              </g>

              {/* Green Flower-Covered Hill */}
              <path
                d="M10 440 Q115 310 215 310 Q285 310 340 440 Z"
                fill="#557A2B"
              />
              <path
                d="M35 440 Q135 330 215 322 Q275 330 335 440 Z"
                fill="#6E9936"
              />
              {/* Foreground Rock */}
              <ellipse cx="215" cy="408" rx="36" ry="22" fill="#8C7A6B" />

              {/* Wooden Cross */}
              <rect x="200" y="132" width="22" height="205" rx="2" fill="#633216" />
              <rect x="146" y="176" width="130" height="20" rx="2" fill="#783D1B" />

              {/* White Easter Cloth Draped Across Crossbar */}
              <path
                d="M162 176 Q211 224 260 176 L270 258 Q254 244 246 196 Q211 232 176 196 Q168 244 152 258 Z"
                fill="#FFFFFF"
                stroke="#DCE6F2"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Bottom Royal Blue Curved Wave Footer Backdrop */}
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
            <svg
              viewBox="0 0 1440 140"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <path
                d="M0 45 Q360 110 720 75 T1440 35 L1440 140 L0 140 Z"
                fill="#092D59"
              />
            </svg>
          </div>
        </div>

        {/* Main Content Grid */}
        <main className="relative z-10 max-w-[1340px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT COLUMN: Framed Daily Promise Card (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Theme Switcher Pills + Upload Photo */}
              <div className="w-full max-w-[420px] flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
                <div className="inline-flex rounded-full bg-white/95 p-1 shadow-sm border border-[#B8D8F8]">
                  <button
                    type="button"
                    onClick={() => setActiveTemplate("royal-navy")}
                    className={`px-3.5 py-1 rounded-full font-nav-unique text-[11px] font-extrabold transition-all ${
                      activeTemplate === "royal-navy"
                        ? "bg-gradient-to-r from-[#092D59] to-[#12549A] text-white shadow"
                        : "text-[#092D59] hover:bg-blue-50"
                    }`}
                  >
                    Royal Navy Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTemplate("promise-poster")}
                    className={`px-3.5 py-1 rounded-full font-nav-unique text-[11px] font-extrabold transition-all ${
                      activeTemplate === "promise-poster"
                        ? "bg-[#186627] text-white shadow"
                        : "text-[#092D59] hover:bg-blue-50"
                    }`}
                  >
                    Green Vagdanam
                  </button>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 text-[#092D59] border border-[#B8D8F8] text-[11px] font-extrabold shadow-sm">
                  <Upload className="w-3.5 h-3.5 text-[#12549A]" />
                  <span className="font-nav-unique">మీ ఫోటో</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Live HTML5 Canvas Card */}
              <div className="w-full max-w-[415px]">
                <WallpaperCanvas
                  ref={canvasRef}
                  verse={verse}
                  customization={customization}
                  aspectMode="royal-card"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Royal Navy Blue "ఈరోజు దేవుని వాక్యం" Display (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-center text-center relative">
              {/* Top Royal Blue Brush-Stroke Banner ("ఈరోజు దేవుని వాక్యం") */}
              <div className="relative inline-flex flex-col items-center mb-3">
                <div
                  onClick={() => setShowDateModal(true)}
                  title="Click to select another calendar date"
                  className="cursor-pointer px-8 sm:px-14 py-3.5 rounded-full shadow-[0_10px_26px_rgba(9,45,89,0.3)] hover:scale-[1.02] transition-transform border-2 bg-gradient-to-r from-[#062347] via-[#12549A] to-[#062347] border-[#93C5FD]/60"
                >
                  <h1 className="font-card-display text-xl sm:text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
                    ఈరోజు దేవుని వాక్యం
                  </h1>
                </div>

                {/* Open Holy Bible Icon with Golden Lines Below Banner (Matches media_1793955774641_cdb9e1de.jpg) */}
                <div className="flex items-center justify-center gap-3 mt-3 w-64">
                  <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-[#D49212]" />
                  <BookOpen className="w-7 h-7 text-[#092D59]" />
                  <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-[#D49212]" />
                </div>
              </div>

              {/* Main Calligraphic Editorial Serif Telugu Verse (Distinct Body Font) */}
              <h2 className="font-body-serif-te text-2xl sm:text-4xl xl:text-[50px] font-black leading-[1.4] max-w-2xl px-2 drop-shadow-[0_2px_10px_rgba(255,255,255,0.95)] text-[#092D59]">
                {verse.teluguVerse.replace(/\n/g, " ")}
              </h2>

              {/* Sweeping Royal Blue Calligraphic Ribbon Swoosh Under Verse */}
              <div className="w-full max-w-xl h-8 my-1 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 500 35" className="w-full h-full">
                  <path
                    d="M40 22 Q240 4, 450 26 Q340 12, 40 22 Z"
                    fill="#12549A"
                  />
                </svg>
              </div>

              {/* Golden Cream Reference Pill ("📖 యెషయా 41:10") */}
              <div className="mt-1 inline-flex items-center gap-2.5 px-7 sm:px-8 py-2.5 rounded-full bg-gradient-to-b from-[#FFFDF2] via-[#FCE694] to-[#E6B43C] border-2 border-[#D49212] shadow-[0_6px_18px_rgba(180,125,12,0.28)] text-[#092D59] font-body-serif-te text-lg sm:text-2xl font-black">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#092D59]" />
                <span>{verse.teluguReference.replace(".", " ")}</span>
              </div>

              {/* Bold Italic Editorial Serif English Verse (Cormorant Garamond) */}
              <p className="font-body-editorial italic text-2xl sm:text-4xl font-bold leading-snug max-w-xl mt-5 px-2 text-[#092D59]">
                {verse.englishVerse}
              </p>

              {/* English Reference with Ornamental Lines */}
              <div className="flex items-center justify-center gap-3 mt-2 w-full max-w-md px-4">
                <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-[#092D59]/60" />
                <span className="font-brand-cinzel text-sm sm:text-base font-extrabold tracking-wider text-[#092D59]">
                  {verse.englishReference}
                </span>
                <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-[#092D59]/60" />
              </div>

              {/* 3 Prominent Action Pill Buttons (డౌన్‌లోడ్ | పంచుకోండి | వాల్పేపర్‌గా సేవ్ చేయండి) */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
                {/* 1. డౌన్‌లోడ్ (Deep Navy Pill Button) */}
                <button
                  type="button"
                  onClick={() => handleDownload("png")}
                  className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 rounded-full text-white font-nav-unique text-base sm:text-lg font-extrabold shadow-[0_10px_24px_rgba(9,45,89,0.38)] transition-all transform hover:-translate-y-0.5 bg-gradient-to-b from-[#12549A] via-[#092D59] to-[#051B38] hover:from-[#092D59] hover:to-[#12549A]"
                >
                  <Download className="w-5 h-5 text-[#FFC629]" />
                  <span>డౌన్‌లోడ్</span>
                </button>

                {/* 2. పంచుకోండి (White Glossy Pill Button) */}
                <button
                  type="button"
                  onClick={handleNativeOrSocialShare}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white hover:bg-[#F5FAFF] text-[#092D59] border-2 border-white font-telugu text-base sm:text-lg font-extrabold shadow-[0_8px_20px_rgba(9,45,89,0.14)] transition-all transform hover:-translate-y-0.5"
                >
                  <Share2 className="w-5 h-5 text-[#12549A]" />
                  <span>పంచుకోండి</span>
                </button>

                {/* 3. వాల్పేపర్‌గా సేవ్ చేయండి (White Glossy Pill Button) */}
                <button
                  type="button"
                  onClick={handleSaveAsMobileWallpaper}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-[#F5FAFF] text-[#092D59] border-2 border-white font-telugu text-base sm:text-lg font-extrabold shadow-[0_8px_20px_rgba(9,45,89,0.14)] transition-all transform hover:-translate-y-0.5"
                >
                  <ImageIcon className="w-5 h-5 text-[#12549A]" />
                  <span>వాల్పేపర్‌గా సేవ్ చేయండి</span>
                </button>
              </div>

              {/* Compact Date Switcher Row */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 text-xs font-extrabold text-[#092D59]">
                <Link
                  href={`/verse/${prevDate}`}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="font-telugu">నిన్నటి వాగ్దానం</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowDateModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-blue-200 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#12549A]" />
                  <span className="font-telugu">తేదీ మార్చండి ({rawDate})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#092D59] hover:bg-[#12549A] text-white border border-[#FFC629] shadow-sm"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#FFC629]" />
                  <span className="font-telugu">క్యాలెండర్ QR కోడ్</span>
                </button>
                <Link
                  href={`/verse/${nextDate}`}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white shadow-sm"
                >
                  <span className="font-telugu">రేపటి వాగ్దానం</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom 4-Column Floating Feature Card Bar (Matches media_1793955774641_cdb9e1de.jpg) */}
          <div className="mt-8 max-w-[1260px] mx-auto bg-white/98 backdrop-blur-md rounded-3xl shadow-[0_14px_38px_rgba(9,45,89,0.18)] border border-white p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-200">
            {/* 1. QR కోడ్ స్కాన్ చేయండి */}
            <Link
              href="/scan"
              className="flex flex-col items-center text-center px-3 py-1.5 group hover:-translate-y-0.5 transition-transform"
            >
              <QrCode className="w-10 h-10 text-[#092D59] mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-telugu text-base sm:text-lg font-black text-[#092D59]">
                QR కోడ్ స్కాన్ చేయండి
              </h3>
              <p className="font-telugu text-xs font-bold text-slate-600 mt-0.5">
                క్యాలెండర్‌లోని తేదీకి వాక్యం పొందండి
              </p>
            </Link>

            {/* 2. 2027 క్యాలెండర్ */}
            <Link
              href="/calendar"
              className="flex flex-col items-center text-center px-3 py-1.5 group hover:-translate-y-0.5 transition-transform"
            >
              <Calendar className="w-10 h-10 text-[#092D59] mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-telugu text-base sm:text-lg font-black text-[#092D59]">
                2027 క్యాలెండర్
              </h3>
              <p className="font-telugu text-xs font-bold text-slate-600 mt-0.5">
                365 రోజుల దేవుని వాక్యాలు
              </p>
            </Link>

            {/* 3. వాల్పేపర్ క్రియేట్ చేయండి */}
            <Link
              href={`/studio?date=${rawDate}`}
              className="flex flex-col items-center text-center px-3 py-1.5 group hover:-translate-y-0.5 transition-transform"
            >
              <ImageIcon className="w-10 h-10 text-[#092D59] mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-telugu text-base sm:text-lg font-black text-[#092D59]">
                వాల్పేపర్ క్రియేట్ చేయండి
              </h3>
              <p className="font-telugu text-xs font-bold text-slate-600 mt-0.5">
                మీ ఫోటో, చర్చి పేరుతో డిజైన్ చేసుకోండి
              </p>
            </Link>

            {/* 4. పంచుకోండి */}
            <button
              type="button"
              onClick={handleNativeOrSocialShare}
              className="flex flex-col items-center text-center px-3 py-1.5 group hover:-translate-y-0.5 transition-transform"
            >
              <Share2 className="w-10 h-10 text-[#092D59] mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-telugu text-base sm:text-lg font-black text-[#092D59]">
                పంచుకోండి
              </h3>
              <p className="font-telugu text-xs font-bold text-slate-600 mt-0.5">
                వాట్సాప్, ఫేస్‌బుక్, ఇతరులతో పంచండి
              </p>
            </button>
          </div>
        </main>
      </div>

      {/* Date Picker Modal */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-blue-200 text-slate-900">
            <h3 className="font-telugu text-xl font-extrabold text-[#092D59] mb-1">
              తేదీని ఎంచుకోండి (Select Calendar Date)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              ఏ తేదీకి సంబంధించిన దేవుని వాగ్దాన వాక్యాన్నైనా ఇక్కడ చూడవచ్చు.
            </p>

            <input
              type="date"
              defaultValue={rawDate}
              onChange={(e) => {
                if (e.target.value) {
                  setShowDateModal(false);
                  router.push(`/verse/${e.target.value}`);
                }
              }}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 font-bold text-slate-900 focus:outline-none focus:border-[#12549A] mb-4"
            />

            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { label: "Jan 05, 2027 (యెషయా 41:10)", d: "2027-01-05" },
                { label: "Nov 05, 2026 (కీర్తనలు 4:8)", d: "2026-11-05" },
                { label: "Jan 01, 2027 (New Year)", d: "2027-01-01" },
                { label: "Jan 03, 2027 (కీర్తనలు 23:1)", d: "2027-01-03" },
              ].map((item) => (
                <button
                  key={item.d}
                  type="button"
                  onClick={() => {
                    setShowDateModal(false);
                    router.push(`/verse/${item.d}`);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-colors ${
                    item.d === rawDate
                      ? "bg-[#092D59] text-white border-[#092D59]"
                      : "bg-blue-50/70 hover:bg-blue-100 text-[#092D59] border-blue-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowDateModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-blue-200 text-slate-900">
            <h3 className="font-telugu text-xl font-extrabold text-[#092D59] mb-4">
              వాగ్దాన వాక్యాన్ని పంచుకోండి (Share Promise)
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `💙 *ఈరోజు దేవుని వాక్యం (${rawDate})*\n"${verse.teluguVerse.replace(
                    /\n/g,
                    " "
                  )}" (${verse.teluguReference})\n"${verse.englishVerse}" (${
                    verse.englishReference
                  })\n🙏 GRACE MANDHIR: ${
                    typeof window !== "undefined" ? window.location.href : ""
                  }`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm shadow"
              >
                <span>WhatsApp Share</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1877F2] text-white font-bold text-sm shadow"
              >
                <span>Facebook Share</span>
              </a>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar QR Code & Scanner Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-[#B8D8F8] text-slate-900">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-body-serif-te text-2xl font-black text-[#092D59]">
                  క్యాలెండర్ QR కోడ్‌లు (Print &amp; Scan QR Codes)
                </h3>
                <p className="font-nav-unique text-xs font-semibold text-slate-600 mt-1">
                  మీ మొబైల్ కెమెరా లేదా Google Lens తో స్కాన్ చేస్తే నేరుగా ఆ రోజు వాగ్దాన వాక్యం ఓపెన్ అవుతుంది.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* 1. Master Auto-Daily QR Code */}
              <div className="rounded-2xl bg-[#F2F8FF] border-2 border-[#12549A] p-4 flex flex-col items-center text-center">
                <span className="px-3 py-0.5 rounded-full bg-[#092D59] text-[#FFC629] text-[11px] font-extrabold mb-2">
                  ★ 1. మెయిన్ క్యాలెండర్ QR (Recommended)
                </span>
                <h4 className="font-nav-unique text-sm font-black text-[#092D59] mb-2">
                  ప్రతిరోజూ ఆటోమేటిక్‌గా మారే QR కోడ్
                </h4>
                <QrCodeBox
                  date={rawDate}
                  customUrl={
                    typeof window !== "undefined"
                      ? window.location.origin
                      : "https://grace-mandhir-official.vercel.app"
                  }
                  size={150}
                />
                <p className="font-nav-unique text-[11px] font-semibold text-slate-600 mt-2">
                  ఈ ఒక్క QR కోడ్ క్యాలెండర్ మీద ప్రింట్ చేస్తే చాలు — ఏ రోజు స్కాన్ చేస్తే <strong>ఆ రోజు తేదీ &amp; వాగ్దాన వాక్యం</strong> ఆటోమేటిక్‌గా ఓపెన్ అవుతుంది!
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleDownloadQrPng(
                      typeof window !== "undefined"
                        ? window.location.origin
                        : "https://grace-mandhir-official.vercel.app",
                      "Grace-Mandhir-Master-Daily-QR.png"
                    )
                  }
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#092D59] to-[#12549A] text-white text-xs font-extrabold shadow"
                >
                  <Download className="w-4 h-4 text-[#FFC629]" />
                  <span>Download Master QR (PNG)</span>
                </button>
              </div>

              {/* 2. Date-Specific QR Code */}
              <div className="rounded-2xl bg-white border border-blue-200 p-4 flex flex-col items-center text-center">
                <span className="px-3 py-0.5 rounded-full bg-blue-100 text-[#092D59] text-[11px] font-extrabold mb-2">
                  2. ఈ తేదీ QR కోడ్ ({rawDate})
                </span>
                <h4 className="font-nav-unique text-sm font-black text-[#092D59] mb-2">
                  {rawDate} తేదీ ప్రత్యేక QR కోడ్
                </h4>
                <QrCodeBox date={rawDate} size={150} />
                <p className="font-nav-unique text-[11px] font-semibold text-slate-600 mt-2">
                  దీనిని స్కాన్ చేస్తే ఎప్పుడైనా <strong>{rawDate}</strong> తేదీ వాగ్దాన వాక్యం (`/verse/{rawDate}`) ఓపెన్ అవుతుంది.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleDownloadQrPng(
                      `${
                        typeof window !== "undefined"
                          ? window.location.origin
                          : "https://grace-mandhir-official.vercel.app"
                      }/verse/${rawDate}`,
                      `Grace-Mandhir-QR-${rawDate}.png`
                    )
                  }
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-[#092D59] border-2 border-[#092D59] text-xs font-extrabold"
                >
                  <Download className="w-4 h-4 text-[#12549A]" />
                  <span>Download {rawDate} QR (PNG)</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/calendar"
                  onClick={() => setShowQrModal(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#092D59] text-xs font-extrabold"
                >
                  <Calendar className="w-4 h-4 text-[#12549A]" />
                  <span>365 రోజుల QR కోడ్‌లు చూడండి (/calendar)</span>
                </Link>
                <Link
                  href="/scan"
                  onClick={() => setShowQrModal(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#092D59] text-xs font-extrabold"
                >
                  <QrCode className="w-4 h-4 text-[#12549A]" />
                  <span>కెమెరా QR స్కానర్ (/scan)</span>
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
