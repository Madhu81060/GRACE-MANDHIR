"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrCodeBoxProps {
  date: string;
  customUrl?: string;
  size?: number;
  showCenterLogo?: boolean;
  className?: string;
  onClick?: () => void;
}

export const QrCodeBox: React.FC<QrCodeBoxProps> = ({
  date,
  customUrl,
  size = 112,
  showCenterLogo = true,
  className = "",
  onClick,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://grace-mandhir-official.vercel.app";
    const targetUrl = customUrl || `${origin}/verse/${date}`;

    QRCode.toDataURL(targetUrl, {
      width: Math.max(size * 3, 512),
      margin: 1,
      errorCorrectionLevel: "H",
      color: {
        dark: "#092D59",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("QR generation error:", err);
      });

    return () => {
      active = false;
    };
  }, [date, customUrl, size]);

  return (
    <div
      onClick={onClick}
      title={`Scan or click to open /verse/${date}`}
      className={`relative inline-flex items-center justify-center bg-white rounded-lg p-1.5 shadow-[0_4px_14px_rgba(9,45,89,0.18)] border border-[#C6E0FA] ${
        onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {qrDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={qrDataUrl}
          alt={`QR Code for ${date} Bible Verse`}
          className="w-full h-full object-contain rounded"
        />
      ) : (
        <div className="w-full h-full bg-slate-100 animate-pulse rounded flex items-center justify-center text-[10px] text-slate-400">
          QR
        </div>
      )}

      {showCenterLogo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-white shadow-sm border border-[#12549A]/40 flex items-center justify-center">
            <span className="text-[10px] font-black text-[#092D59] leading-none">
              ✞
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
