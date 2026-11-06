"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HeartHandshake,
  Globe,
} from "lucide-react";
import { DEFAULT_CHURCH_SETTINGS } from "@/lib/verseStore";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prayerRequest.trim()) return;
    setSubmitted(true);
    const whatsappText = encodeURIComponent(
      `🙏 *ప్రార్థన విన్నపం (Prayer Request - GRACE MANDHIR)*\n\n👤 పేరు: ${name}\n📞 ఫోన్: ${phone}\n📝 ప్రార్థన అంశం: ${prayerRequest}`
    );
    window.open(
      `https://wa.me/${DEFAULT_CHURCH_SETTINGS.whatsappNumber}?text=${whatsappText}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F4F9FF] via-[#EAF5FF] to-[#DCEBFA] text-slate-900">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-blue-200 text-[#092D59] text-xs font-extrabold mb-3 shadow-sm">
            <HeartHandshake className="w-4 h-4 text-[#12549A]" />
            <span>GRACE MANDHIR • A House of Prayer for All Nations</span>
          </span>
          <h1 className="font-body-serif-te text-3xl sm:text-5xl font-black text-[#092D59]">
            మమ్మల్ని సంప్రదించండి
          </h1>
          <p className="font-nav-unique text-sm sm:text-base font-semibold text-slate-700 mt-2">
            ప్రార్థన విన్నపములు, 2027 QR క్యాలెండర్ ప్రతుల కొరకు లేదా ఆత్మీయ సహాయం కొరకు మమ్మల్ని సంప్రదించండి.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Cols: Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone Numbers Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#EAF5FF] flex items-center justify-center text-[#092D59]">
                  <Phone className="w-5 h-5 text-[#12549A]" />
                </div>
                <div>
                  <h2 className="font-body-serif-te text-lg font-black text-[#092D59]">
                    ఫోన్ నంబర్లు (Call Us)
                  </h2>
                  <p className="text-xs font-bold text-slate-500">
                    24/7 Prayer Helpline &amp; Calendar Enquiries
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <a
                  href="tel:7661845090"
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F4F9FF] hover:bg-blue-100/70 border border-blue-200 transition-colors"
                >
                  <span className="font-brand-cinzel text-base font-black text-[#092D59]">
                    +91 76618 45090
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#092D59] text-white text-xs font-bold">
                    కాల్ చేయండి
                  </span>
                </a>
                <a
                  href="tel:9666723272"
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F4F9FF] hover:bg-blue-100/70 border border-blue-200 transition-colors"
                >
                  <span className="font-brand-cinzel text-base font-black text-[#092D59]">
                    +91 96667 23272
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#092D59] text-white text-xs font-bold">
                    కాల్ చేయండి
                  </span>
                </a>
              </div>
            </div>

            {/* WhatsApp Direct Card */}
            <div className="bg-gradient-to-br from-[#062144] via-[#092D59] to-[#12549A] text-white rounded-3xl p-6 shadow-xl border border-[#FFC629]/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#FFC629]" />
                </div>
                <div>
                  <h2 className="font-body-serif-te text-lg font-black">
                    వాట్సాప్ లో రోజువారీ వాగ్దానం
                  </h2>
                  <p className="text-xs text-blue-100">
                    Join GRACE MANDHIR Daily Promise WhatsApp Group
                  </p>
                </div>
              </div>
              <p className="font-nav-unique text-xs text-blue-100 leading-relaxed mb-4">
                ప్రతిరోజూ ఉదయం దేవుని వాగ్దాన వాల్పేపర్ మీ వాట్సాప్ నంబర్‌కు పొందుటకు కింది బటన్ క్లిక్ చేసి మెసేజ్ పంపండి.
              </p>
              <a
                href={`https://wa.me/${DEFAULT_CHURCH_SETTINGS.whatsappNumber}?text=${encodeURIComponent(
                  "ప్రైజ్ ది లార్డ్! GRACE MANDHIR రోజువారీ వాగ్దాన వాక్యాలు నా వాట్సాప్ కు పంపగలరు."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-nav-unique text-sm font-black shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp లో మెసేజ్ చేయండి</span>
              </a>
            </div>

            {/* Worship Timings & Ministry Info */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-blue-100 space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#12549A]" />
                <h3 className="font-body-serif-te text-base font-black text-[#092D59]">
                  ఆరాధన సమయాలు (Worship Timings)
                </h3>
              </div>
              <ul className="font-nav-unique text-xs font-bold text-slate-700 space-y-2 pl-2">
                <li>• ఆదివారం ఆరాధన (Sunday Worship): ఉదయం 9:00 AM – 12:30 PM</li>
                <li>• ఉపవాస ప్రార్థన (Friday Fasting Prayer): ఉదయం 10:00 AM – 2:00 PM</li>
                <li>• ప్రతిరోజూ ఉదయం వాగ్దాన ప్రార్థన: ఉదయం 6:00 AM</li>
              </ul>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#092D59]">
                <MapPin className="w-4 h-4 text-[#12549A]" />
                <span>GRACE MANDHIR — సమస్త జనులకు ప్రార్థన మందిరం</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#12549A]">
                <Globe className="w-4 h-4" />
                <span>YouTube &amp; Facebook: GRACE MANDHIR</span>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Prayer Request Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-100">
            <h2 className="font-body-serif-te text-2xl font-black text-[#092D59] mb-1">
              ప్రార్థన విన్నపం పంపండి (Send Prayer Request)
            </h2>
            <p className="font-nav-unique text-xs sm:text-sm font-semibold text-slate-600 mb-6">
              మీ ప్రార్థన అవసరతలను మాకు తెలియజేయండి. గ్రేస్ మందిర్ ప్రార్థన బృందం మీ కొరకు మరియు మీ కుటుంబం కొరకు ప్రత్యేకంగా ప్రార్థిస్తారు.
            </p>

            {submitted && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="font-nav-unique text-xs sm:text-sm font-bold">
                  మీ ప్రార్థన విన్నపం స్వీకరించబడింది! వాట్సాప్ ద్వారా కూడా మా ప్రార్థన బృందానికి పంపబడింది.
                </p>
              </div>
            )}

            <form onSubmit={handlePrayerSubmit} className="space-y-4">
              <div>
                <label className="block font-nav-unique text-xs font-extrabold text-[#092D59] mb-1.5">
                  మీ పేరు (Your Name) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="మీ పూర్తి పేరు టైప్ చేయండి..."
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-[#F9FCFF] text-sm font-bold text-slate-900 focus:outline-none focus:border-[#12549A]"
                />
              </div>

              <div>
                <label className="block font-nav-unique text-xs font-extrabold text-[#092D59] mb-1.5">
                  ఫోన్ / వాట్సాప్ నంబర్ (Phone Number)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="ఉదా: 9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-[#F9FCFF] text-sm font-bold text-slate-900 focus:outline-none focus:border-[#12549A]"
                />
              </div>

              <div>
                <label className="block font-nav-unique text-xs font-extrabold text-[#092D59] mb-1.5">
                  మీ ప్రార్థన విన్నపం (Your Prayer Request) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={prayerRequest}
                  onChange={(e) => setPrayerRequest(e.target.value)}
                  placeholder="మీ ప్రార్థన అవసరతను ఇక్కడ రాయండి..."
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-[#F9FCFF] text-sm font-bold text-slate-900 focus:outline-none focus:border-[#12549A]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-[#092D59] via-[#12549A] to-[#092D59] hover:from-[#062144] hover:to-[#092D59] text-white font-nav-unique text-sm sm:text-base font-black shadow-[0_10px_24px_rgba(9,45,89,0.28)] transition-all transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4 text-[#FFC629]" />
                <span>ప్రార్థన విన్నపం పంపండి (Send via WhatsApp)</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
