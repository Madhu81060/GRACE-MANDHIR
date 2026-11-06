"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Download,
  Share2,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Type,
  Building2,
  Calendar,
  RotateCcw,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import {
  WallpaperCanvas,
  WallpaperCanvasHandle,
  WallpaperCustomization,
} from "@/components/WallpaperCanvas";
import {
  DEFAULT_BACKGROUNDS,
  DEFAULT_CHURCH_SETTINGS,
  DEFAULT_TEMPLATES,
  VerseRecord,
  WallpaperBackground,
  resolveVerseForDate,
} from "@/lib/verseStore";

function StudioContent() {
  const searchParams = useSearchParams();
  const initialDate = searchParams.get("date") || "2027-01-05";

  const canvasRef = useRef<WallpaperCanvasHandle | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [verse, setVerse] = useState<VerseRecord>(() =>
    resolveVerseForDate(initialDate)
  );
  const [backgrounds, setBackgrounds] =
    useState<WallpaperBackground[]>(DEFAULT_BACKGROUNDS);
  const [toast, setToast] = useState<string>("");

  const [customization, setCustomization] = useState<WallpaperCustomization>({
    templateId: "royal-navy",
    backgroundUrl: "/images/navy-theme-ref.jpg",
    churchName: DEFAULT_CHURCH_SETTINGS.churchName,
    tagline: DEFAULT_CHURCH_SETTINGS.tagline,
    phoneNumbers: DEFAULT_CHURCH_SETTINGS.phoneNumbers,
    userPhotoUrl: "",
    churchLogoUrl: "",
    textColor: "#092D59",
    accentColor: "#FFC629",
    fontScale: 1,
    textYOffset: 0,
    overlayOpacity: 0.78,
    showUserPhoto: true,
    showEnglish: true,
    showFooter: true,
  });

  useEffect(() => {
    fetch(`/api/verses/${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.verse) {
          setVerse(data.verse);
        }
      })
      .catch(() => {
        setVerse(resolveVerseForDate(selectedDate));
      });
  }, [selectedDate]);

  useEffect(() => {
    fetch("/api/assets")
      .then((r) => r.json())
      .then((data) => {
        if (data?.backgrounds?.length) {
          setBackgrounds(data.backgrounds);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleFileToDataUrl = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "userPhotoUrl" | "churchLogoUrl" | "backgroundUrl",
    label: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomization((prev) => ({
          ...prev,
          [field]: reader.result as string,
        }));
        showToast(`${label} uploaded successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (format: "png" | "jpg") => {
    canvasRef.current?.downloadImage(
      format,
      `Grace-Mandhir-Vagdanam-${selectedDate}.${format}`
    );
    showToast(`Downloaded HD ${format.toUpperCase()} Vagdanam Wallpaper!`);
  };

  const handleShareWhatsApp = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/verse/${selectedDate}`
        : `https://gracemandhir.org/verse/${selectedDate}`;
    const text = `💙 *${customization.churchName} - ఈరోజు వాగ్దానం (${selectedDate})*\n\n"${verse.teluguVerse.replace(
      /\n/g,
      " "
    )}" (${verse.teluguReference})\n"${verse.englishVerse}" (${
      verse.englishReference
    })\n\n📲 View & Download: ${shareUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        const blob = await canvasRef.current?.getBlob();
        if (blob) {
          const file = new File(
            [blob],
            `Grace-Mandhir-Vagdanam-${selectedDate}.png`,
            { type: "image/png" }
          );
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: customization.churchName,
              text,
              files: [file],
            });
            return;
          }
        }
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

  const isPosterMode = customization.templateId !== "mobile-sunrise";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F4F9FF] via-[#EAF5FF] to-[#DCEBFA] text-slate-900">
      <Navbar />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-[#092D59] text-white text-sm font-bold shadow-2xl">
          <Check className="w-4 h-4 text-[#FFC629]" />
          <span>{toast}</span>
        </div>
      )}

      <main className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* Top Studio Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-blue-200/80">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-blue-200 text-[#092D59] text-xs font-extrabold mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D49212]" />
              <span>Grace Mandhir Official Vagdanam &amp; Wallpaper Studio</span>
            </span>
            <h1 className="font-body-serif-te text-2xl sm:text-4xl font-black text-[#092D59]">
              వాగ్దాన వాల్పేపర్ క్రియేట్ చేయండి{" "}
              <span className="font-body-editorial italic font-bold text-xl sm:text-2xl text-[#12549A]">
                (Vagdanam Studio)
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleDownload("png")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#092D59] to-[#12549A] hover:from-[#061E3E] hover:to-[#092D59] text-white font-nav-unique text-sm font-bold shadow-lg transition-all"
            >
              <Download className="w-4 h-4 text-[#FFC629]" />
              <span>PNG డౌన్‌లోడ్ (HD)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownload("jpg")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-blue-50 text-[#092D59] border border-blue-200 font-bold text-sm shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>JPG</span>
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5B] text-white font-bold text-sm shadow-md transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-nav-unique">WhatsApp షేర్</span>
            </button>
          </div>
        </div>

        {/* Studio Grid: Left Preview (5 Cols) | Right Controls (7 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
          {/* LEFT: Live Vagdanam Preview */}
          <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24">
            <div
              className={`w-full ${
                isPosterMode ? "max-w-[440px]" : "max-w-[350px]"
              }`}
            >
              <WallpaperCanvas
                ref={canvasRef}
                verse={verse}
                customization={customization}
                aspectMode={isPosterMode ? "royal-card" : "9:16"}
              />
            </div>
            <p className="text-xs font-bold text-[#092D59]/80 mt-3 text-center">
              Live Grace Mandhir Preview • Free HD Download without Registration
            </p>
          </div>

          {/* RIGHT: Personalization Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Date & Verse Content */}
            <div className="bg-white/98 rounded-2xl p-5 shadow-md border border-blue-100 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-nav-unique text-lg font-extrabold text-[#092D59]">
                  <Calendar className="w-5 h-5 text-[#12549A]" />
                  <span>1. తేదీ &amp; దేవుని వాక్యం (Date &amp; Bible Verse)</span>
                </h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-blue-200 text-sm font-bold text-[#092D59] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    తెలుగు వాక్యం (Telugu Bible Verse)
                  </label>
                  <textarea
                    rows={3}
                    value={verse.teluguVerse}
                    onChange={(e) =>
                      setVerse({ ...verse, teluguVerse: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-blue-200 font-card-display text-sm font-bold focus:outline-none focus:border-[#12549A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ఆంగ్ల వాక్యం (English Bible Verse)
                  </label>
                  <textarea
                    rows={3}
                    value={verse.englishVerse}
                    onChange={(e) =>
                      setVerse({ ...verse, englishVerse: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-blue-200 text-sm font-medium focus:outline-none focus:border-[#12549A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    తెలుగు రిఫరెన్స్ (యెషయా 41:10)
                  </label>
                  <input
                    type="text"
                    value={verse.teluguReference}
                    onChange={(e) =>
                      setVerse({ ...verse, teluguReference: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-blue-200 font-card-display text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    English Reference (Isaiah 41:10)
                  </label>
                  <input
                    type="text"
                    value={verse.englishReference}
                    onChange={(e) =>
                      setVerse({ ...verse, englishReference: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-blue-200 text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. Templates & Christian Backgrounds */}
            <div className="bg-white/98 rounded-2xl p-5 shadow-md border border-blue-100 space-y-4">
              <h2 className="flex items-center gap-2 font-nav-unique text-lg font-extrabold text-[#092D59]">
                <ImageIcon className="w-5 h-5 text-[#12549A]" />
                <span>
                  2. టెంప్లేట్ &amp; నేపథ్య చిత్రాలు (Templates &amp; Backgrounds)
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: "royal-navy",
                    te: "రాయల్ నేవీ & గోల్డ్",
                    en: "Royal Navy & Gold Card",
                  },
                  {
                    id: "promise-poster",
                    te: "గ్రీన్ వాగ్దాన పోస్టర్",
                    en: "Forest-Green Vagdanam",
                  },
                  {
                    id: "mobile-sunrise",
                    te: "1080×1920 మొబైల్ స్క్రీన్",
                    en: "Full Mobile Lockscreen",
                  },
                ].map((tpl) => {
                  const active = customization.templateId === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() =>
                        setCustomization((prev) => ({
                          ...prev,
                          templateId: tpl.id,
                        }))
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        active
                          ? "bg-[#EAF5FF] border-[#092D59] ring-2 ring-[#092D59]/30"
                          : "bg-slate-50/70 hover:bg-blue-50/50 border-slate-200"
                      }`}
                    >
                      <p className="font-nav-unique text-sm font-extrabold text-[#092D59]">
                        {tpl.te}
                      </p>
                      <p className="text-xs font-bold text-slate-600">
                        {tpl.en}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600">
                    Select Background Image:
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5FF] hover:bg-blue-100 text-[#092D59] text-xs font-bold transition-colors border border-blue-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom Background</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileToDataUrl(
                          e,
                          "backgroundUrl",
                          "Custom Background"
                        )
                      }
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {backgrounds.map((bg) => {
                    const isSelected = customization.backgroundUrl === bg.url;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() =>
                          setCustomization((prev) => ({
                            ...prev,
                            backgroundUrl: bg.url,
                          }))
                        }
                        className={`group relative rounded-xl overflow-hidden border-2 h-24 transition-all ${
                          isSelected
                            ? "border-[#092D59] ring-2 ring-[#092D59]/40 scale-[1.02]"
                            : "border-transparent hover:border-blue-300"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={bg.url}
                          alt={bg.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-[#092D59]/80 px-2 py-1 text-[10px] font-bold text-white truncate">
                          {bg.teluguName}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Personal Photo & GRACE MANDHIR Footer */}
            <div className="bg-white/98 rounded-2xl p-5 shadow-md border border-blue-100 space-y-4">
              <h2 className="flex items-center gap-2 font-nav-unique text-lg font-extrabold text-[#092D59]">
                <Building2 className="w-5 h-5 text-[#12549A]" />
                <span>
                  3. ఫోటో &amp; మందిరం వివరాలు (Portrait Photo &amp; Footer)
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    మందిరం పేరు (Brand Name)
                  </label>
                  <input
                    type="text"
                    value={customization.churchName}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        churchName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-blue-200 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ఫోన్ నంబర్లు (Contact Numbers)
                  </label>
                  <input
                    type="text"
                    value={customization.phoneNumbers}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        phoneNumbers: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-blue-200 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EAF5FF]/70 border border-blue-200 flex items-center justify-between">
                <div>
                  <p className="font-nav-unique text-sm font-extrabold text-[#092D59]">
                    కుడివైపు సర్కిల్ ఫోటో మార్చండి (Upload Portrait Photo)
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Appears in the top-right circular golden frame
                  </p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#092D59] hover:bg-[#12549A] text-white text-xs font-bold shadow">
                  <Upload className="w-3.5 h-3.5 text-[#FFC629]" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileToDataUrl(e, "userPhotoUrl", "Portrait Photo")
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 4. Text Size & Vertical Position */}
            <div className="bg-white/98 rounded-2xl p-5 shadow-md border border-blue-100 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-nav-unique text-lg font-extrabold text-[#092D59]">
                  <Type className="w-5 h-5 text-[#12549A]" />
                  <span>4. సైజు &amp; స్థానం (Text Size &amp; Vertical Position)</span>
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setCustomization((prev) => ({
                      ...prev,
                      fontScale: 1,
                      textYOffset: 0,
                    }))
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#092D59]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Font Scale ({Math.round(customization.fontScale * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.75"
                    max="1.2"
                    step="0.05"
                    value={customization.fontScale}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        fontScale: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-[#092D59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vertical Text Offset ({customization.textYOffset}px)
                  </label>
                  <input
                    type="range"
                    min="-140"
                    max="140"
                    step="10"
                    value={customization.textYOffset}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        textYOffset: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full accent-[#092D59]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EAF5FF] flex items-center justify-center text-[#092D59] font-bold">
          Loading Grace Mandhir Studio...
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
