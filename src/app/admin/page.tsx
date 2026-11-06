"use client";

import React, { useEffect, useState } from "react";
import {
  Lock,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Save,
  Check,
  LogOut,
  ExternalLink,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { QrCodeBox } from "@/components/QrCodeBox";
import {
  VerseRecord,
  WallpaperBackground,
  ChurchSettings,
  DEFAULT_CHURCH_SETTINGS,
  CURATED_VERSES,
  DEFAULT_BACKGROUNDS,
} from "@/lib/verseStore";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("admin@gracemandhir.org");
  const [password, setPassword] = useState<string>("Grace@2027");
  const [authError, setAuthError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "verses" | "backgrounds" | "branding"
  >("verses");
  const [verses, setVerses] = useState<VerseRecord[]>(CURATED_VERSES);
  const [backgrounds, setBackgrounds] =
    useState<WallpaperBackground[]>(DEFAULT_BACKGROUNDS);
  const [settings, setSettings] = useState<ChurchSettings>(
    DEFAULT_CHURCH_SETTINGS
  );
  const [toast, setToast] = useState<string>("");

  const [formVerse, setFormVerse] = useState<Partial<VerseRecord>>({
    date: "2027-01-06",
    teluguVerse: "",
    englishVerse: "",
    teluguReference: "",
    englishReference: "",
    teluguThemeTitle: "ఈరోజు వాగ్దానం",
    themeTitle: "Daily Blessing",
    backgroundUrl: "/images/navy-theme-ref.jpg",
    templateId: "royal-navy",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  useEffect(() => {
    const savedToken = sessionStorage.getItem("gmc_admin_token");
    if (savedToken) {
      setIsAuthenticated(true);
    }
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/verses")
      .then((r) => r.json())
      .then((d) => {
        if (d?.verses) setVerses(d.verses);
      })
      .catch(() => {});

    fetch("/api/assets")
      .then((r) => r.json())
      .then((d) => {
        if (d?.backgrounds) setBackgrounds(d.backgrounds);
        if (d?.settings) setSettings(d.settings);
      })
      .catch(() => {});
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        sessionStorage.setItem("gmc_admin_token", data.token);
        setIsAuthenticated(true);
        showToast("Welcome to Grace Mandhir Admin Dashboard!");
      } else {
        setAuthError(data.error || "Invalid credentials");
      }
    } catch {
      setAuthError("Login failed. Please try again.");
    }
  };

  const handleSaveVerse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVerse.date || !formVerse.teluguVerse || !formVerse.englishVerse) {
      showToast("Please fill in Date, Telugu Verse, and English Verse.");
      return;
    }

    const res = await fetch("/api/verses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formVerse),
    });
    const data = await res.json();
    if (res.ok && data.verses) {
      setVerses(data.verses);
      showToast(`Saved Bible Verse & QR Code for ${formVerse.date}!`);
    }
  };

  const handleDeleteVerse = async (id: string, date: string) => {
    const res = await fetch(`/api/verses?id=${id}&date=${date}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok && data.verses) {
      setVerses(data.verses);
      showToast(`Deleted verse for ${date}`);
    }
  };

  const handleUploadNewBackground = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        const res = await fetch("/api/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "background",
            background: {
              name: file.name.replace(/\.[^.]+$/, ""),
              teluguName: "క్రైస్తవ వాల్పేపర్ నేపథ్యం",
              url: reader.result,
              category: "sunrise",
            },
          }),
        });
        const data = await res.json();
        if (data?.backgrounds) {
          setBackgrounds(data.backgrounds);
          showToast("New Christian background uploaded!");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChurchSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "settings",
        settings,
      }),
    });
    const data = await res.json();
    if (data?.settings) {
      setSettings(data.settings);
      showToast("Grace Mandhir branding settings saved!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F4F9FF] via-[#EAF5FF] to-[#DCEBFA] text-slate-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-blue-200">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#092D59] to-[#12549A] text-[#FFC629] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-brand-cinzel text-2xl font-extrabold text-center text-[#092D59]">
              GRACE MANDHIR LOGIN
            </h1>
            <p className="font-nav-unique text-xs text-center text-slate-600 mt-1 mb-6">
              క్యాలెండర్ వాక్యాలు &amp; QR కోడ్‌ల నిర్వహణ
            </p>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm font-bold focus:outline-none focus:border-[#12549A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 text-sm font-bold focus:outline-none focus:border-[#12549A]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#092D59] to-[#12549A] text-white font-bold text-sm shadow-lg hover:opacity-95 transition-opacity"
              >
                Sign In to Admin Dashboard
              </button>
            </form>

            <div className="mt-4 p-3 rounded-xl bg-[#EAF5FF] border border-blue-200 text-[11px] text-[#092D59] text-center">
              Demo Credentials pre-filled: <strong>admin@gracemandhir.org</strong>{" "}
              / <strong>Grace@2027</strong>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F4F9FF] via-[#EAF5FF] to-[#DCEBFA] text-slate-900">
      <Navbar />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-[#092D59] text-white text-sm font-bold shadow-2xl">
          <Check className="w-4 h-4 text-[#FFC629]" />
          <span>{toast}</span>
        </div>
      )}

      <main className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-blue-200">
          <div>
            <h1 className="font-brand-cinzel text-2xl sm:text-3xl font-extrabold text-[#092D59]">
              GRACE MANDHIR – Admin Dashboard
            </h1>
            <p className="font-nav-unique text-xs sm:text-sm font-semibold text-slate-600">
              Manage Daily Telugu &amp; English Bible Verses, Calendar QR Codes,
              Wallpaper Backgrounds &amp; Branding
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("verses")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                activeTab === "verses"
                  ? "bg-gradient-to-r from-[#092D59] to-[#12549A] text-white shadow"
                  : "bg-white text-[#092D59] border border-blue-200"
              }`}
            >
              Verses &amp; QR Codes ({verses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("backgrounds")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                activeTab === "backgrounds"
                  ? "bg-gradient-to-r from-[#092D59] to-[#12549A] text-white shadow"
                  : "bg-white text-[#092D59] border border-blue-200"
              }`}
            >
              Backgrounds ({backgrounds.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("branding")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                activeTab === "branding"
                  ? "bg-gradient-to-r from-[#092D59] to-[#12549A] text-white shadow"
                  : "bg-white text-[#092D59] border border-blue-200"
              }`}
            >
              Branding
            </button>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("gmc_admin_token");
                setIsAuthenticated(false);
              }}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-red-100 text-red-800 text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {activeTab === "verses" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-lg border border-blue-100 h-fit">
              <h2 className="flex items-center gap-2 font-nav-unique text-lg font-extrabold text-[#092D59] mb-4">
                <Plus className="w-5 h-5 text-[#12549A]" />
                <span>వాక్యాన్ని జోడించండి / సవరించండి (Add / Edit Date Verse)</span>
              </h2>

              <form onSubmit={handleSaveVerse} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assign Calendar Date (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    value={formVerse.date || ""}
                    onChange={(e) =>
                      setFormVerse({ ...formVerse, date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telugu Bible Verse (తెలుగు వాక్యం)
                  </label>
                  <textarea
                    rows={3}
                    value={formVerse.teluguVerse || ""}
                    onChange={(e) =>
                      setFormVerse({
                        ...formVerse,
                        teluguVerse: e.target.value,
                      })
                    }
                    placeholder="ఉదా: నేను నిన్ను బలపరచి నీకు సహాయము చేయుదును."
                    className="w-full px-3.5 py-2 rounded-xl border border-blue-200 font-card-display text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    English Bible Verse
                  </label>
                  <textarea
                    rows={2}
                    value={formVerse.englishVerse || ""}
                    onChange={(e) =>
                      setFormVerse({
                        ...formVerse,
                        englishVerse: e.target.value,
                      })
                    }
                    placeholder="e.g. I will strengthen you and help you."
                    className="w-full px-3.5 py-2 rounded-xl border border-blue-200 text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telugu Reference
                    </label>
                    <input
                      type="text"
                      value={formVerse.teluguReference || ""}
                      onChange={(e) =>
                        setFormVerse({
                          ...formVerse,
                          teluguReference: e.target.value,
                        })
                      }
                      placeholder="యెషయా 41:10"
                      className="w-full px-3 py-2 rounded-xl border border-blue-200 font-card-display text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      English Reference
                    </label>
                    <input
                      type="text"
                      value={formVerse.englishReference || ""}
                      onChange={(e) =>
                        setFormVerse({
                          ...formVerse,
                          englishReference: e.target.value,
                        })
                      }
                      placeholder="Isaiah 41:10"
                      className="w-full px-3 py-2 rounded-xl border border-blue-200 text-sm"
                    />
                  </div>
                </div>

                {formVerse.date && (
                  <div className="p-3 rounded-2xl bg-[#EAF5FF] border border-blue-200 flex items-center gap-3">
                    <QrCodeBox
                      date={formVerse.date}
                      size={64}
                      showCenterLogo={false}
                    />
                    <div className="text-xs">
                      <p className="font-extrabold text-[#092D59]">
                        Auto-Generated Date QR Code
                      </p>
                      <p className="text-slate-600">
                        Target URL: <code>/verse/{formVerse.date}</code>
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#092D59] to-[#12549A] text-white font-bold text-sm shadow-lg"
                >
                  <Save className="w-4 h-4 text-[#FFC629]" />
                  <span>Save Verse &amp; Generate QR Code</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {verses.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <QrCodeBox date={v.date} size={72} showCenterLogo={false} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5FF] text-[#092D59] text-xs font-extrabold border border-blue-200">
                          {v.date}
                        </span>
                        <span className="font-nav-unique text-xs font-extrabold text-[#12549A]">
                          {v.teluguReference.replace(".", " ")} (
                          {v.englishReference})
                        </span>
                      </div>
                      <p className="font-card-display text-sm font-bold text-[#092D59] mt-1">
                        {v.teluguVerse.replace(/\n/g, " ")}
                      </p>
                      <p className="font-body-editorial italic text-sm text-slate-600 mt-0.5">
                        {v.englishVerse}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      href={`/verse/${v.date}`}
                      className="p-2 rounded-xl bg-[#EAF5FF] hover:bg-blue-100 text-[#092D59]"
                      title="Open Verse Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setFormVerse(v)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="Edit Verse"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVerse(v.id, v.date)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                      title="Delete Verse"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "backgrounds" && (
          <div className="pt-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-blue-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-nav-unique text-lg font-extrabold text-[#092D59]">
                  వాల్పేపర్ నేపథ్య చిత్రాలు (Manage Christian Backgrounds)
                </h2>
                <p className="text-xs text-slate-600">
                  Upload high-resolution Christian sunrise, cross, or nature
                  backgrounds for daily wallpapers.
                </p>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#092D59] to-[#12549A] text-white text-xs font-extrabold shadow">
                <Upload className="w-4 h-4 text-[#FFC629]" />
                <span>Upload New Background Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadNewBackground}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {backgrounds.map((bg) => (
                <div
                  key={bg.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-blue-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bg.url}
                    alt={bg.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-nav-unique text-sm font-extrabold text-[#092D59]">
                        {bg.teluguName}
                      </p>
                      <p className="text-xs text-slate-600">{bg.name}</p>
                    </div>
                    <ImageIcon className="w-5 h-5 text-[#12549A]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "branding" && (
          <div className="pt-6 max-w-2xl mx-auto">
            <form
              onSubmit={handleSaveChurchSettings}
              className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100 space-y-4"
            >
              <h2 className="font-brand-cinzel text-xl font-bold text-[#092D59]">
                Grace Mandhir Branding &amp; Contact Settings
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={settings.churchName}
                  onChange={(e) =>
                    setSettings({ ...settings, churchName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  English Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) =>
                    setSettings({ ...settings, tagline: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-200 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Footer Contact Phone Numbers
                </label>
                <input
                  type="text"
                  value={settings.phoneNumbers}
                  onChange={(e) =>
                    setSettings({ ...settings, phoneNumbers: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-200 text-sm font-bold"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#092D59] to-[#12549A] text-white font-bold text-sm shadow"
              >
                <Save className="w-4 h-4 text-[#FFC629]" />
                <span>Save Settings</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
