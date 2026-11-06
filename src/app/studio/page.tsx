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
  const initialDate = searchParams.get("date") || "2026-11-05";

  const canvasRef = useRef<WallpaperCanvasHandle | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [verse, setVerse] = useState<VerseRecord>(() =>
    resolveVerseForDate(initialDate)
  );
  const [backgrounds, setBackgrounds] =
    useState<WallpaperBackground[]>(DEFAULT_BACKGROUNDS);
  const [toast, setToast] = useState<string>("");

  const [customization, setCustomization] = useState<WallpaperCustomization>({
    templateId: "promise-poster",
    backgroundUrl: "/images/vagdanam-sample.jpg",
    churchName: DEFAULT_CHURCH_SETTINGS.churchName,
    tagline: DEFAULT_CHURCH_SETTINGS.tagline,
    phoneNumbers: DEFAULT_CHURCH_SETTINGS.phoneNumbers,
    userPhotoUrl: "",
    churchLogoUrl: "",
    textColor: "#FFFFFF",
    accentColor: "#ECFF26",
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
    const text = `🌿 *${customization.churchName} - ఈరోజు వాగ్దానం (${selectedDate})*\n\n"${verse.teluguVerse}" (${verse.teluguReference})\n"${verse.englishVerse}" (${verse.englishReference})\n\n📲 View & Download Vagdanam: ${shareUrl}`;

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

  const isPosterMode = customization.templateId === "promise-poster";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF7FB] via-[#FCEBF4] to-[#F7DCEC] text-slate-900">
      <Navbar />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-[#186627] text-white text-sm font-bold shadow-2xl">
          <Check className="w-4 h-4 text-[#ECFF26]" />
          <span>{toast}</span>
        </div>
      )}

      <main className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* Top Studio Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-pink-200/80">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#186627] text-xs font-extrabold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Grace Mandhir Vagdanam &amp; Wallpaper Generator</span>
            </span>
            <h1 className="font-telugu text-2xl sm:text-4xl font-black text-[#75145E]">
              వాగ్దాన వాల్పేపర్ క్రియేట్ చేయండి{" "}
              <span className="font-serif italic font-bold text-xl sm:text-2xl text-slate-700">
                (Vagdanam Studio)
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleDownload("png")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#186627] to-[#0B4616] hover:from-[#12521E] hover:to-[#06320E] text-white font-telugu text-sm font-extrabold shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>PNG డౌన్‌లోడ్ (HD)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownload("jpg")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-pink-50 text-[#186627] border border-emerald-200 font-bold text-sm shadow-sm transition-all"
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
              <span className="font-telugu">WhatsApp షేర్</span>
            </button>
          </div>
        </div>

        {/* Studio Grid: Left Preview (5 Cols) | Right Controls (7 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
          {/* LEFT: Live Vagdanam Preview */}
          <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24">
            <div
              className={`w-full ${
                isPosterMode ? "max-w-[460px]" : "max-w-[350px]"
              }`}
            >
              <WallpaperCanvas
                ref={canvasRef}
                verse={verse}
                customization={customization}
                aspectMode={isPosterMode ? "poster" : "9:16"}
              />
            </div>
            <p className="text-xs font-bold text-slate-600 mt-3 text-center">
              Live Official Grace Mandhir Vagdanam Preview • Free HD Download
            </p>
          </div>

          {/* RIGHT: Personalization Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Date & 5-Tier Vagdanam Text Editor */}
            <div className="bg-white/95 rounded-2xl p-5 shadow-md border border-pink-100 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-telugu text-lg font-extrabold text-[#186627]">
                  <Calendar className="w-5 h-5 text-[#186627]" />
                  <span>1. తేదీ &amp; వాగ్దాన వాక్యం (Date &amp; Vagdanam Text)</span>
                </h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-emerald-300 text-sm font-bold text-[#186627] focus:outline-none"
                />
              </div>

              {/* 4-Tier Vagdanam Highlight Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80">
                <div>
                  <label className="block text-[11px] font-extrabold text-red-700 mb-1">
                    Red Oval Badge Word (ఉదా: నేను)
                  </label>
                  <input
                    type="text"
                    value={verse.teluguHighlightTop || ""}
                    onChange={(e) =>
                      setVerse({ ...verse, teluguHighlightTop: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-red-200 font-telugu text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-800 mb-1">
                    3D Giant White Word (ఉదా: ఒంటరిగా)
                  </label>
                  <input
                    type="text"
                    value={verse.teluguHighlightMain || ""}
                    onChange={(e) =>
                      setVerse({
                        ...verse,
                        teluguHighlightMain: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-telugu text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    White Sub-Word (ఉదా: నుండినను)
                  </label>
                  <input
                    type="text"
                    value={verse.teluguHighlightMid || ""}
                    onChange={(e) =>
                      setVerse({ ...verse, teluguHighlightMid: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-telugu text-sm font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-extrabold text-[#186627] mb-1">
                    Lime-Yellow Promise Lines (2 Lines)
                  </label>
                  <textarea
                    rows={2}
                    value={verse.teluguHighlightSub || ""}
                    onChange={(e) =>
                      setVerse({ ...verse, teluguHighlightSub: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-emerald-300 font-telugu text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    Reference (కీర్తనలు.4:8)
                  </label>
                  <input
                    type="text"
                    value={verse.teluguReference}
                    onChange={(e) =>
                      setVerse({ ...verse, teluguReference: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-telugu text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 2. Wallpaper Templates & Christian Backgrounds */}
            <div className="bg-white/95 rounded-2xl p-5 shadow-md border border-pink-100 space-y-4">
              <h2 className="flex items-center gap-2 font-telugu text-lg font-extrabold text-[#75145E]">
                <ImageIcon className="w-5 h-5 text-[#C81D66]" />
                <span>
                  2. టెంప్లేట్ &amp; నేపథ్య చిత్రాలు (Templates &amp; Backgrounds)
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEFAULT_TEMPLATES.map((tpl) => {
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
                          ? "bg-emerald-50 border-[#186627] ring-2 ring-[#186627]/30"
                          : "bg-slate-50/70 hover:bg-pink-50/50 border-slate-200"
                      }`}
                    >
                      <p className="font-telugu text-sm font-extrabold text-[#186627]">
                        {tpl.teluguName}
                      </p>
                      <p className="text-xs font-bold text-slate-800">
                        {tpl.name}
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
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-[#186627] text-xs font-bold transition-colors">
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
                            ? "border-[#186627] ring-2 ring-[#186627]/40 scale-[1.02]"
                            : "border-transparent hover:border-emerald-300"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={bg.url}
                          alt={bg.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-1 text-[10px] font-bold text-white truncate">
                          {bg.teluguName}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Pastor / Personal Photo & Church Footer */}
            <div className="bg-white/95 rounded-2xl p-5 shadow-md border border-pink-100 space-y-4">
              <h2 className="flex items-center gap-2 font-telugu text-lg font-extrabold text-[#75145E]">
                <Building2 className="w-5 h-5 text-[#C81D66]" />
                <span>
                  3. ఫోటో &amp; చర్చ్ వివరాలు (Top-Right Circle Photo &amp; Footer)
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    చర్చ్ పేరు (Left Footer Text)
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
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ఫోన్ నంబర్లు (Right Footer Numbers)
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
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="font-telugu text-sm font-extrabold text-[#186627]">
                    కుడివైపు సర్కిల్ ఫోటో మార్చండి (Upload Pastor / Personal Photo)
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Replaces the top-right dotted halo circular portrait
                  </p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#186627] hover:bg-[#12501E] text-white text-xs font-bold shadow">
                  <Upload className="w-3.5 h-3.5" />
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
            <div className="bg-white/95 rounded-2xl p-5 shadow-md border border-pink-100 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-telugu text-lg font-extrabold text-[#75145E]">
                  <Type className="w-5 h-5 text-[#C81D66]" />
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
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#75145E]"
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
                    className="w-full accent-[#186627]"
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
                    className="w-full accent-[#186627]"
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
        <div className="min-h-screen bg-[#FFF7FB] flex items-center justify-center text-[#186627] font-bold">
          Loading Grace Mandhir Vagdanam Studio...
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
