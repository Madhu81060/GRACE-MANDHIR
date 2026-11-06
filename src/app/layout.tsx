import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grace Mandhir | A House of Prayer for All Nations",
  description:
    "గ్రేస్ మందిర్ - ప్రతిరోజూ దేవుని వాక్యం. Scan the 2027 Grace Mandhir Christian Calendar QR code to receive your daily Telugu & English Bible verse wallpaper.",
  keywords: [
    "Grace Mandhir",
    "గ్రేస్ మందిర్",
    "A House of Prayer for All Nations",
    "2027 Christian Calendar",
    "Telugu Bible Verse Wallpaper",
    "ప్రతిరోజూ దేవుని వాక్యం",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="te">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Mandali&family=Montserrat:ital,wght@0,700;0,800;0,900;1,800&family=Noto+Sans+Telugu:wght@500;600;700;800;900&family=Noto+Serif+Telugu:wght@600;700;800;900&family=Outfit:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Ramabhadra&family=Suranna&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#EAF5FF] text-slate-900">
        {children}
      </body>
    </html>
  );
}
