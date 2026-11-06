"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";
import {
  Camera,
  CameraOff,
  Upload,
  QrCode,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { QrCodeBox } from "@/components/QrCodeBox";

export default function QrScannerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [scannedResult, setScannedResult] = useState<string>("");
  const [manualDate, setManualDate] = useState<string>("2026-11-05");

  const extractDateAndNavigate = (rawText: string) => {
    setScannedResult(rawText);
    const match = rawText.match(/(\d{4}-\d{2}-\d{2})/);
    const targetDate = match ? match[1] : "2026-11-05";
    setTimeout(() => {
      router.push(`/verse/${targetDate}`);
    }, 650);
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId: number | null = null;

    async function startCamera() {
      if (!cameraActive) return;
      setCameraError("");
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          await videoRef.current.play();
          tick();
        }
      } catch (err) {
        setCameraError(
          "కెమెరా అనుమతి లభించలేదు లేదా కెమెరా అందుబాటులో లేదు. మీరు QR చిత్రాన్ని అప్‌లోడ్ చేయవచ్చు లేదా దిగువ తేదీని ఎంచుకోవచ్చు."
        );
        setCameraActive(false);
        console.warn("Camera access error:", err);
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = scanCanvasRef.current;
      if (
        video &&
        canvas &&
        video.readyState === video.HAVE_ENOUGH_DATA
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const code = jsQR(
            imageData.data,
            imageData.width,
            imageData.height,
            { inversionAttempts: "dontInvert" }
          );
          if (code && code.data) {
            setCameraActive(false);
            extractDateAndNavigate(code.data);
            return;
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    if (cameraActive) {
      startCamera();
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive]);

  const handleUploadQrImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          extractDateAndNavigate(code.data);
        } else {
          extractDateAndNavigate(`/verse/${manualDate}`);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF7FB] via-[#FCEBF4] to-[#F7DCEC] text-slate-900">
      <Navbar />

      <main className="max-w-[1180px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF2F8] border border-pink-200 text-[#8B1346] text-xs font-extrabold mb-2">
            <QrCode className="w-3.5 h-3.5" />
            <span>Grace Mandhir 2027 Christian Calendar QR Scanner</span>
          </span>
          <h1 className="font-telugu text-3xl sm:text-4xl font-black text-[#75145E]">
            QR కోడ్ స్కాన్ చేయండి
          </h1>
          <p className="font-telugu text-sm sm:text-base font-semibold text-slate-700 mt-2">
            మీ 2027 క్రైస్తవ క్యాలెండర్‌పై ఉన్న QR కోడ్‌ను కెమెరాతో స్కాన్ చేయండి లేదా QR
            ఇమేజ్‌ను అప్‌లోడ్ చేసి ఆ రోజు దేవుని వాగ్దాన వాల్పేపర్‌ను పొందండి.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Live Camera Viewfinder & Upload QR Image (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xl border border-pink-100">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center border-2 border-[#C81D66]/40">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                  />
                  {/* Scanning Target Frame Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-56 h-56 rounded-2xl border-4 border-[#FFC629] shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] relative">
                      <div className="absolute inset-x-2 top-1/2 h-0.5 bg-[#FFC629] animate-pulse" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-white space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#D41C68] to-[#75145E] mx-auto flex items-center justify-center shadow-lg">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="font-telugu text-xl font-extrabold">
                    కెమెరాతో QR కోడ్ స్కాన్ చేయండి
                  </h2>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Click &ldquo;Start Camera Scanner&rdquo; to scan your printed Grace
                    Mandhir Calendar QR code, or upload a QR image below.
                  </p>
                </div>
              )}

              <canvas ref={scanCanvasRef} className="hidden" />
            </div>

            {cameraError && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-telugu text-xs font-bold">
                {cameraError}
              </div>
            )}

            {scannedResult && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">
                    QR Code Scanned Successfully!
                  </p>
                  <p className="text-xs">Opening {scannedResult}...</p>
                </div>
              </div>
            )}

            {/* Scanner Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={() => setCameraActive(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D41C68] to-[#75145E] text-white font-telugu text-sm font-extrabold shadow-lg hover:opacity-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>కెమెరా ప్రారంభించండి (Start Camera Scanner)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCameraActive(false)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-rose-600 text-white font-bold text-sm shadow-lg"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>Stop Camera</span>
                </button>
              )}

              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#FDF2F8] hover:bg-pink-100 text-[#75145E] border border-pink-200 font-telugu text-sm font-extrabold transition-colors">
                <Upload className="w-4 h-4" />
                <span>QR ఇమేజ్ అప్‌లోడ్ చేయండి (Upload QR Image)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadQrImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Right: Manual Date Selector & Instant Sample QR Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Manual Date Picker Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
              <h3 className="flex items-center gap-2 font-telugu text-lg font-extrabold text-[#75145E] mb-2">
                <Calendar className="w-5 h-5 text-[#C81D66]" />
                <span>తేదీని స్వయంగా ఎంచుకోండి (Select Date Manually)</span>
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                క్యాలెండర్ అందుబాటులో లేకపోయినా ఏ తేదీ వాగ్దానాన్నైనా నేరుగా తెరవండి:
              </p>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-pink-200 font-bold text-slate-900 focus:outline-none focus:border-[#C81D66]"
                />
                <button
                  type="button"
                  onClick={() => router.push(`/verse/${manualDate}`)}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D41C68] to-[#75145E] text-white font-telugu text-sm font-extrabold shadow"
                >
                  <span>తెరవండి</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Instant Testable Calendar QR Codes */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
              <h3 className="flex items-center gap-2 font-telugu text-lg font-extrabold text-[#75145E] mb-1">
                <Sparkles className="w-5 h-5 text-[#C81D66]" />
                <span>నమూనా క్యాలెండర్ QR కోడ్‌లు (Click or Scan)</span>
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Click any QR card below to simulate scanning that calendar date:
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { date: "2026-11-05", ref: "కీర్తనలు 4:8" },
                  { date: "2026-11-06", ref: "కీర్తనలు 4:8 (Today)" },
                  { date: "2027-01-01", ref: "యెషయా 41:10" },
                  { date: "2027-01-03", ref: "కీర్తనలు 23:1" },
                ].map((item) => (
                  <div
                    key={item.date}
                    onClick={() => extractDateAndNavigate(`/verse/${item.date}`)}
                    className="cursor-pointer group p-3 rounded-2xl bg-[#FFF7FB] hover:bg-pink-50 border border-pink-200 flex flex-col items-center text-center transition-all hover:-translate-y-0.5"
                  >
                    <QrCodeBox date={item.date} size={86} />
                    <p className="text-xs font-extrabold text-[#75145E] mt-2">
                      {item.date}
                    </p>
                    <p className="font-telugu text-[11px] font-bold text-slate-600">
                      {item.ref}
                    </p>
                    <span className="mt-1.5 text-[10px] font-bold text-[#C81D66] group-hover:underline">
                      Simulate Scan →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
