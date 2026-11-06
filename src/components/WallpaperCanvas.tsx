"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import { VerseRecord, formatEnglishDateBadge } from "@/lib/verseStore";

export interface WallpaperCustomization {
  templateId: string; // 'royal-navy' | 'royal-burgundy' | 'promise-poster' | 'mobile-sunrise'
  backgroundUrl: string;
  churchName: string;
  tagline: string;
  phoneNumbers: string;
  userPhotoUrl: string;
  churchLogoUrl: string;
  textColor: string;
  accentColor: string;
  fontScale: number;
  textYOffset: number;
  overlayOpacity: number;
  showUserPhoto: boolean;
  showEnglish: boolean;
  showFooter: boolean;
}

export interface WallpaperCanvasHandle {
  downloadImage: (format: "png" | "jpg", filename?: string) => void;
  getDataUrl: (format?: "png" | "jpg") => string | null;
  getBlob: () => Promise<Blob | null>;
}

interface WallpaperCanvasProps {
  verse: VerseRecord;
  customization: WallpaperCustomization;
  className?: string;
  aspectMode?: "9:16" | "poster" | "royal-card";
}

const TELUGU_MONTHS_SHORT = [
  "జనవరి",
  "ఫిబ్రవరి",
  "మార్చి",
  "ఏప్రిల్",
  "మే",
  "జూన్",
  "జూలై",
  "ఆగస్టు",
  "సెప్టెంబర్",
  "అక్టోబర్",
  "నవంబర్",
  "డిసెంబర్",
];

function getTeluguMonthForDate(dateStr: string): string {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || isNaN(parts[1])) return "జనవరి";
  return TELUGU_MONTHS_SHORT[(parts[1] - 1 + 12) % 12] || "జనవరి";
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const manualLines = text.split("\n");
  const lines: string[] = [];
  for (const mLine of manualLines) {
    const words = mLine.trim().split(/\s+/);
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawGoldenLaurelBranch(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  flipX: boolean
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(flipX ? -scale : scale, scale);

  const goldGrad = ctx.createLinearGradient(0, -140, 0, 140);
  goldGrad.addColorStop(0, "#FFF0A8");
  goldGrad.addColorStop(0.5, "#F5B935");
  goldGrad.addColorStop(1, "#C98208");

  ctx.strokeStyle = goldGrad;
  ctx.fillStyle = goldGrad;
  ctx.lineWidth = 3.5;

  ctx.beginPath();
  ctx.moveTo(28, 120);
  ctx.bezierCurveTo(-18, 55, -20, -45, 22, -120);
  ctx.stroke();

  const leafPositions = [
    { x: 14, y: 95, rot: -0.55 },
    { x: 0, y: 65, rot: -0.4 },
    { x: -9, y: 32, rot: -0.2 },
    { x: -12, y: -2, rot: 0.02 },
    { x: -8, y: -36, rot: 0.22 },
    { x: 0, y: -68, rot: 0.42 },
    { x: 13, y: -98, rot: 0.6 },
  ];

  for (const lf of leafPositions) {
    ctx.save();
    ctx.translate(lf.x, lf.y);
    ctx.rotate(lf.rot);
    ctx.beginPath();
    ctx.ellipse(-12, 0, 14, 5.5, -0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, -4, 12, 5, 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawRadialDottedHalo(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  innerR: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, innerR + 6, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.88)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const numSpokes = 40;
  const rings = [
    { dist: innerR + 11, dotR: 2.1, alpha: 0.85 },
    { dist: innerR + 16, dotR: 1.7, alpha: 0.65 },
    { dist: innerR + 21, dotR: 1.3, alpha: 0.45 },
    { dist: innerR + 26, dotR: 0.9, alpha: 0.25 },
  ];

  for (let s = 0; s < numSpokes; s++) {
    const angle = (s / numSpokes) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    for (const rg of rings) {
      ctx.beginPath();
      ctx.arc(cx + cos * rg.dist, cy + sin * rg.dist, rg.dotR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${rg.alpha})`;
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawChurchCrestOnCanvas(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  ctx.beginPath();
  ctx.rect(-5.5, -42, 11, 52);
  ctx.rect(-19, -28, 38, 9.5);
  ctx.fill();

  ctx.lineWidth = 4.2;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.bezierCurveTo(-12, 4, -30, 3, -44, 9);
  ctx.lineTo(-38, 28);
  ctx.bezierCurveTo(-25, 23, -11, 24, 0, 32);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.bezierCurveTo(12, 4, 30, 3, 44, 9);
  ctx.lineTo(38, 28);
  ctx.bezierCurveTo(25, 23, 11, 24, 0, 32);
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-48, 38);
  ctx.lineTo(48, 38);
  ctx.stroke();

  ctx.restore();
}

export const WallpaperCanvas = forwardRef<
  WallpaperCanvasHandle,
  WallpaperCanvasProps
>(
  (
    { verse, customization, className = "", aspectMode = "royal-card" },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isRendering, setIsRendering] = useState(false);

    const tpl = customization.templateId || "royal-navy";
    const isCardTpl = tpl === "royal-navy" || tpl === "royal-burgundy";
    const width = isCardTpl ? 900 : 1080;
    const height = isCardTpl
      ? 1140
      : tpl === "promise-poster" && aspectMode !== "9:16"
      ? 1080
      : 1920;

    useImperativeHandle(ref, () => ({
      downloadImage: (format: "png" | "jpg", filename?: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const mime = format === "jpg" ? "image/jpeg" : "image/png";
        const dataUrl = canvas.toDataURL(mime, 0.96);
        const link = document.createElement("a");
        link.download =
          filename || `Grace-Mandhir-Vagdanam-${verse.date}.${format}`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      getDataUrl: (format: "png" | "jpg" = "png") => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const mime = format === "jpg" ? "image/jpeg" : "image/png";
        return canvas.toDataURL(mime, 0.95);
      },
      getBlob: () => {
        return new Promise((resolve) => {
          const canvas = canvasRef.current;
          if (!canvas) return resolve(null);
          canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
        });
      },
    }));

    useEffect(() => {
      let cancelled = false;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const loadImg = (src: string): Promise<HTMLImageElement | null> =>
        new Promise((resolve) => {
          if (!src) return resolve(null);
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });

      async function render() {
        setIsRendering(true);
        const activeBgUrl =
          customization.backgroundUrl ||
          verse.backgroundUrl ||
          "/images/navy-theme-ref.jpg";

        const [
          bgImg,
          userImg,
          logoImg,
          samplePastorImg,
          royalRefImg,
          navyRefImg,
        ] = await Promise.all([
          loadImg(activeBgUrl),
          loadImg(customization.userPhotoUrl),
          loadImg(customization.churchLogoUrl),
          loadImg("/images/vagdanam-sample.jpg"),
          loadImg("/images/royal-theme-ref.jpg"),
          loadImg("/images/navy-theme-ref.jpg"),
        ]);

        if (cancelled || !ctx) return;

        ctx.clearRect(0, 0, width, height);

        // ====================================================================
        // TEMPLATE 1: ROYAL NAVY BLUE, WHITE & GOLD CARD
        // (Matches media_1793955774641_cdb9e1de.jpg left card!)
        // ====================================================================
        if (tpl === "royal-navy") {
          const upperH = 545;

          // 1. Upper Jesus in Royal Blue Mantle & Child Golden Sunlight Artwork
          if (navyRefImg) {
            ctx.drawImage(navyRefImg, 48, 86, 298, 200, 0, 0, width, upperH);
          } else if (bgImg) {
            ctx.drawImage(bgImg, 0, 0, width, upperH);
          }

          // Top-Left Rounded Date Card Badge ("2027 / జనవరి / 05" with Royal Navy Cap)
          const dateBadge = formatEnglishDateBadge(verse.date);
          const teMonth = getTeluguMonthForDate(verse.date);
          const bx = 42;
          const by = 36;
          const bw = 152;
          const bh = 186;

          ctx.save();
          drawRoundedRect(ctx, bx, by, bw, bh, 26);
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "rgba(9,45,89,0.28)";
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.clip();

          // Top Royal Navy Blue Header Strip for Year
          const capGrad = ctx.createLinearGradient(bx, by, bx + bw, by);
          capGrad.addColorStop(0, "#092D59");
          capGrad.addColorStop(1, "#12549A");
          ctx.fillStyle = capGrad;
          ctx.fillRect(bx, by, bw, 52);

          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.font = "800 30px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(dateBadge.year, bx + bw / 2, by + 37);

          // Middle Telugu Month ("జనవరి")
          ctx.fillStyle = "#092D59";
          ctx.font = "900 30px 'Noto Sans Telugu', sans-serif";
          ctx.fillText(teMonth, bx + bw / 2, by + 94);

          // Bottom Large Day Number ("05")
          ctx.fillStyle = "#092D59";
          ctx.font = "900 72px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(dateBadge.day, bx + bw / 2, by + 166);
          ctx.restore();

          // Top-Right Circular Pastor / Personal Portrait Frame
          if (customization.showUserPhoto) {
            const pcx = width - 118;
            const pcy = 122;
            const pr = 76;

            ctx.save();
            ctx.beginPath();
            ctx.arc(pcx, pcy, pr + 6, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = "rgba(0,0,0,0.25)";
            ctx.shadowBlur = 16;
            ctx.fill();
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = "#F5C242";
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(pcx, pcy, pr, 0, Math.PI * 2);
            ctx.clip();

            if (userImg) {
              ctx.drawImage(userImg, pcx - pr, pcy - pr, pr * 2, pr * 2);
            } else if (samplePastorImg) {
              ctx.drawImage(
                samplePastorImg,
                838,
                25,
                136,
                136,
                pcx - pr,
                pcy - pr,
                pr * 2,
                pr * 2
              );
            }
            ctx.restore();
          }

          // 2. Lower Crisp White / Soft Sky Dome Card with Curved Golden Arch
          const archSideY = 535;
          const archPeakY = 472;
          const footerH = 104;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, archSideY);
          ctx.quadraticCurveTo(width / 2, archPeakY, width, archSideY);
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();

          const whiteDomeGrad = ctx.createLinearGradient(
            0,
            archPeakY,
            0,
            height - footerH
          );
          whiteDomeGrad.addColorStop(0, "#FFFFFF");
          whiteDomeGrad.addColorStop(0.65, "#F5FAFF");
          whiteDomeGrad.addColorStop(1, "#EAF5FF");
          ctx.fillStyle = whiteDomeGrad;
          ctx.fill();

          // Metallic Golden Arch Stroke along the curve
          ctx.beginPath();
          ctx.moveTo(0, archSideY);
          ctx.quadraticCurveTo(width / 2, archPeakY, width, archSideY);
          const goldStroke = ctx.createLinearGradient(0, 0, width, 0);
          goldStroke.addColorStop(0, "#D49212");
          goldStroke.addColorStop(0.5, "#FFE885");
          goldStroke.addColorStop(1, "#D49212");
          ctx.strokeStyle = goldStroke;
          ctx.lineWidth = 8;
          ctx.stroke();
          ctx.restore();

          // 3. Deep Navy Blue & Gold "ఈరోజు వాగ్దానం" Royal Pill Badge on the Arch Apex
          const pillW = 350;
          const pillH = 68;
          const pillX = (width - pillW) / 2;
          const pillY = 466;

          ctx.save();
          drawRoundedRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
          const navyBadgeGrad = ctx.createLinearGradient(
            pillX,
            pillY,
            pillX,
            pillY + pillH
          );
          navyBadgeGrad.addColorStop(0, "#12549A");
          navyBadgeGrad.addColorStop(0.5, "#092D59");
          navyBadgeGrad.addColorStop(1, "#051B38");
          ctx.fillStyle = navyBadgeGrad;
          ctx.shadowColor = "rgba(9,45,89,0.35)";
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.lineWidth = 3.5;
          ctx.strokeStyle = "#F5C242";
          ctx.stroke();

          ctx.fillStyle = "#FFF4B8";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "900 36px 'Noto Sans Telugu', sans-serif";
          ctx.fillText(
            verse.teluguThemeTitle || "ఈరోజు వాగ్దానం",
            width / 2,
            pillY + pillH / 2 + 3
          );
          ctx.restore();

          // 4. Bold Deep Navy Blue (#092D59) Telugu Verse Lines
          const scale = customization.fontScale || 1;
          const yOffset = customization.textYOffset || 0;
          ctx.save();
          ctx.textAlign = "center";
          ctx.fillStyle = "#092D59";
          ctx.font = `900 ${Math.round(64 * scale)}px 'Ramabhadra', 'Noto Sans Telugu', sans-serif`;

          const vLines = wrapCanvasText(
            ctx,
            verse.teluguVerse.replace(/\n/g, " "),
            width - 130
          );
          let curY = 665 + yOffset;
          for (const line of vLines) {
            ctx.fillText(line, width / 2, curY);
            curY += 92 * scale;
          }
          ctx.restore();

          // 5. Golden Cream Reference Pill ("📖 యెషయా 41:10") with Navy Ornamental Lines
          const refPlaqueW = 390;
          const refPlaqueH = 72;
          const refPlaqueX = (width - refPlaqueW) / 2;
          const refPlaqueY = 895;

          ctx.save();
          // Left & Right Navy Ornamental Lines with Diamond Tips
          ctx.strokeStyle = "#092D59";
          ctx.fillStyle = "#092D59";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(85, refPlaqueY + refPlaqueH / 2);
          ctx.lineTo(refPlaqueX - 18, refPlaqueY + refPlaqueH / 2);
          ctx.moveTo(refPlaqueX + refPlaqueW + 18, refPlaqueY + refPlaqueH / 2);
          ctx.lineTo(width - 85, refPlaqueY + refPlaqueH / 2);
          ctx.stroke();

          drawRoundedRect(
            ctx,
            refPlaqueX,
            refPlaqueY,
            refPlaqueW,
            refPlaqueH,
            refPlaqueH / 2
          );
          const creamGoldGrad = ctx.createLinearGradient(
            refPlaqueX,
            refPlaqueY,
            refPlaqueX,
            refPlaqueY + refPlaqueH
          );
          creamGoldGrad.addColorStop(0, "#FFF9DB");
          creamGoldGrad.addColorStop(0.5, "#FCE592");
          creamGoldGrad.addColorStop(1, "#E5B53A");
          ctx.fillStyle = creamGoldGrad;
          ctx.shadowColor = "rgba(9,45,89,0.18)";
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = "#D49212";
          ctx.stroke();

          ctx.fillStyle = "#092D59";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "900 38px 'Noto Sans Telugu', sans-serif";
          ctx.fillText(
            `📖 ${verse.teluguReference.replace(".", " ")}`,
            width / 2,
            refPlaqueY + refPlaqueH / 2 + 2
          );
          ctx.restore();

          // 6. Bottom Curved Deep Navy Blue Footer Strip ("GRACE MANDHIR CHURCH" + Social Icons)
          if (customization.showFooter) {
            const fy = height - footerH;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(0, fy);
            ctx.quadraticCurveTo(width / 2, fy + 32, width, fy);
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();

            const footNavyGrad = ctx.createLinearGradient(0, fy, width, height);
            footNavyGrad.addColorStop(0, "#062144");
            footNavyGrad.addColorStop(0.5, "#092D59");
            footNavyGrad.addColorStop(1, "#0B3B75");
            ctx.fillStyle = footNavyGrad;
            ctx.fill();

            // Left: GRACE MANDHIR (No 'CHURCH')
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "left";
            ctx.font = "900 34px 'Cinzel', 'Montserrat', sans-serif";
            ctx.fillText(
              (customization.churchName || "GRACE MANDHIR")
                .replace(/\s*CHURCH/i, "")
                .toUpperCase(),
              42,
              fy + 68
            );

            // Right: YouTube, Facebook, Instagram, WhatsApp Badges
            const badges = [
              { col: "#FF0000", ch: "▶", x: 635 },
              { col: "#1877F2", ch: "f", x: 695 },
              { col: "#E1306C", ch: "◎", x: 755 },
              { col: "#22C55E", ch: "✆", x: 815 },
            ];
            for (const b of badges) {
              ctx.beginPath();
              ctx.arc(b.x, fy + 56, 22, 0, Math.PI * 2);
              ctx.fillStyle = b.col;
              ctx.fill();
              ctx.fillStyle = "#FFFFFF";
              ctx.textAlign = "center";
              ctx.font = "bold 21px sans-serif";
              ctx.fillText(b.ch, b.x, fy + 64);
            }
            ctx.restore();
          }

          setIsRendering(false);
          return;
        }

        // ====================================================================
        // TEMPLATE 2: ROYAL BURGUNDY & GOLDEN LAUREL CARD
        // ====================================================================
        if (tpl === "royal-burgundy") {
          const upperH = 545;
          if (royalRefImg) {
            ctx.drawImage(
              royalRefImg,
              72,
              88,
              298,
              200,
              0,
              0,
              width,
              upperH
            );
          } else if (bgImg) {
            ctx.drawImage(bgImg, 0, 0, width, upperH);
          }

          const dateBadge = formatEnglishDateBadge(verse.date);
          const teMonth = getTeluguMonthForDate(verse.date);
          const bx = 42;
          const by = 36;
          const bw = 152;
          const bh = 186;

          ctx.save();
          drawRoundedRect(ctx, bx, by, bw, bh, 26);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.clip();

          ctx.fillStyle = "#9B0F48";
          ctx.fillRect(bx, by, bw, 52);

          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.font = "800 30px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(dateBadge.year, bx + bw / 2, by + 37);

          ctx.fillStyle = "#1E1B4B";
          ctx.font = "900 30px 'Noto Sans Telugu', sans-serif";
          ctx.fillText(teMonth, bx + bw / 2, by + 94);

          ctx.fillStyle = "#750835";
          ctx.font = "900 72px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(dateBadge.day, bx + bw / 2, by + 166);
          ctx.restore();

          if (customization.showUserPhoto) {
            const pcx = width - 118;
            const pcy = 122;
            const pr = 76;

            ctx.save();
            ctx.beginPath();
            ctx.arc(pcx, pcy, pr + 6, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = "#EAB308";
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(pcx, pcy, pr, 0, Math.PI * 2);
            ctx.clip();

            if (userImg) {
              ctx.drawImage(userImg, pcx - pr, pcy - pr, pr * 2, pr * 2);
            } else if (samplePastorImg) {
              ctx.drawImage(
                samplePastorImg,
                838,
                25,
                136,
                136,
                pcx - pr,
                pcy - pr,
                pr * 2,
                pr * 2
              );
            }
            ctx.restore();
          }

          const archSideY = 535;
          const archPeakY = 468;
          const footerH = 74;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, archSideY);
          ctx.quadraticCurveTo(width / 2, archPeakY, width, archSideY);
          ctx.lineTo(width, height - footerH);
          ctx.lineTo(0, height - footerH);
          ctx.closePath();

          const burgGrad = ctx.createRadialGradient(
            width / 2,
            660,
            40,
            width / 2,
            780,
            560
          );
          burgGrad.addColorStop(0, "#B51252");
          burgGrad.addColorStop(0.55, "#85093B");
          burgGrad.addColorStop(1, "#4D0320");
          ctx.fillStyle = burgGrad;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, archSideY);
          ctx.quadraticCurveTo(width / 2, archPeakY, width, archSideY);
          ctx.strokeStyle = "#F5C242";
          ctx.lineWidth = 6;
          ctx.stroke();
          ctx.restore();

          const pillW = 340;
          const pillH = 66;
          const pillX = (width - pillW) / 2;
          const pillY = 466;

          ctx.save();
          drawRoundedRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
          ctx.fillStyle = "#7B0938";
          ctx.fill();
          ctx.lineWidth = 3.5;
          ctx.strokeStyle = "#F7C952";
          ctx.stroke();

          ctx.fillStyle = "#FFF4B8";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "900 36px 'Noto Sans Telugu', sans-serif";
          ctx.fillText(
            verse.teluguThemeTitle || "ఈరోజు వాగ్దానం",
            width / 2,
            pillY + pillH / 2 + 3
          );
          ctx.restore();

          drawGoldenLaurelBranch(ctx, 86, 725, 1.05, false);
          drawGoldenLaurelBranch(ctx, width - 86, 725, 1.05, true);

          const scale = customization.fontScale || 1;
          const yOffset = customization.textYOffset || 0;
          ctx.save();
          ctx.textAlign = "center";
          ctx.fillStyle = "#FFFFFF";
          ctx.font = `900 ${Math.round(62 * scale)}px 'Ramabhadra', 'Noto Sans Telugu', sans-serif`;

          const vLines = wrapCanvasText(ctx, verse.teluguVerse, width - 250);
          const totalBlockH = vLines.length * 84 * scale;
          let curY = 735 - totalBlockH / 2 + 48 * scale + yOffset;
          for (const line of vLines) {
            ctx.fillText(line, width / 2, curY);
            curY += 86 * scale;
          }
          ctx.restore();

          const refPlaqueW = 430;
          const refPlaqueH = 74;
          const refPlaqueX = (width - refPlaqueW) / 2;
          const refPlaqueY = 945;

          ctx.save();
          drawRoundedRect(
            ctx,
            refPlaqueX,
            refPlaqueY,
            refPlaqueW,
            refPlaqueH,
            22
          );
          ctx.fillStyle = "#F5B82E";
          ctx.fill();
          ctx.fillStyle = "#4A0720";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "900 38px 'Noto Sans Telugu', sans-serif";
          ctx.fillText(
            `📖 ${verse.teluguReference.replace(".", " ")}`,
            width / 2,
            refPlaqueY + refPlaqueH / 2 + 2
          );
          ctx.restore();

          if (customization.showFooter) {
            const fy = height - footerH;
            ctx.save();
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, fy, width, footerH);
            ctx.fillStyle = "#6E0833";
            ctx.textAlign = "left";
            ctx.font = "900 22px 'Cinzel', 'Montserrat', sans-serif";
            ctx.fillText(
              (customization.churchName || "GRACE MANDHIR")
                .replace(/\s*CHURCH/i, "")
                .toUpperCase(),
              24,
              fy + 45
            );
            ctx.fillStyle = "#0F172A";
            ctx.font = "900 22px 'Plus Jakarta Sans', sans-serif";
            ctx.fillText("7661845090, 9666723272", 606, fy + 45);
            ctx.restore();
          }

          setIsRendering(false);
          return;
        }

        // Draw Background Image for Other Templates
        if (bgImg) {
          const imgRatio = bgImg.width / bgImg.height;
          const canvasRatio = width / height;
          let drawW = width;
          let drawH = height;
          let offsetX = 0;
          let offsetY = 0;

          if (imgRatio > canvasRatio) {
            drawH = height;
            drawW = height * imgRatio;
            offsetX = -(drawW - width) / 2;
          } else {
            drawW = width;
            drawH = width / imgRatio;
            offsetY = -(drawH - height) / 2;
          }
          ctx.drawImage(bgImg, offsetX, offsetY, drawW, drawH);
        }

        // ====================================================================
        // TEMPLATE 3: FOREST-GREEN VAGDANAM TEMPLATE (media_1793954272535_e516da07.jpg)
        // ====================================================================
        if (tpl === "promise-poster") {
          const isSquare = height === 1080;
          const footerH = isSquare ? 46 : 64;

          const greenStart = isSquare ? 420 : 780;
          const greenGrad = ctx.createLinearGradient(0, greenStart, 0, height);
          greenGrad.addColorStop(0, "rgba(11, 96, 28, 0)");
          greenGrad.addColorStop(0.2, "rgba(11, 96, 28, 0.72)");
          greenGrad.addColorStop(0.38, "rgba(9, 86, 24, 0.96)");
          greenGrad.addColorStop(0.72, "rgba(6, 72, 19, 0.99)");
          greenGrad.addColorStop(1, "#043D10");
          ctx.fillStyle = greenGrad;
          ctx.fillRect(0, greenStart, width, height - greenStart);

          const dateBadge = formatEnglishDateBadge(verse.date);
          const dateCx = 102;
          const dateCy = 98;
          const dateR = 66;

          drawRadialDottedHalo(ctx, dateCx, dateCy, dateR);

          ctx.save();
          ctx.beginPath();
          ctx.arc(dateCx, dateCy, dateR, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.arc(dateCx, dateCy, dateR - 3, 0, Math.PI * 2);
          ctx.clip();

          ctx.fillStyle = "#1B6B2A";
          ctx.textAlign = "center";
          ctx.font = "900 24px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(dateBadge.year, dateCx, dateCy - 33);

          const ribH = 26;
          const ribY = dateCy - 26;
          ctx.fillStyle = "#227B34";
          ctx.fillRect(dateCx - dateR, ribY, dateR * 2, ribH);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "800 18px 'Plus Jakarta Sans', sans-serif";
          ctx.fillText(dateBadge.month, dateCx, ribY + 19);

          ctx.fillStyle = "#186627";
          ctx.font = "900 62px 'Plus Jakarta Sans', Impact, sans-serif";
          ctx.fillText(dateBadge.day, dateCx, dateCy + 51);
          ctx.restore();

          if (customization.showUserPhoto) {
            const photoCx = width - 122;
            const photoCy = 98;
            const photoR = 68;

            drawRadialDottedHalo(ctx, photoCx, photoCy, photoR);

            ctx.save();
            ctx.beginPath();
            ctx.arc(photoCx, photoCy, photoR, 0, Math.PI * 2);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();
            ctx.clip();

            if (userImg) {
              ctx.drawImage(
                userImg,
                photoCx - photoR,
                photoCy - photoR,
                photoR * 2,
                photoR * 2
              );
            } else if (samplePastorImg) {
              ctx.drawImage(
                samplePastorImg,
                838,
                25,
                136,
                136,
                photoCx - photoR,
                photoCy - photoR,
                photoR * 2,
                photoR * 2
              );
            }
            ctx.restore();
          }

          const scale = customization.fontScale || 1;
          const yShift = customization.textYOffset || 0;
          const words = verse.teluguVerse.trim().split(/\s+/);
          const topWord = verse.teluguHighlightTop || words[0] || "నేను";
          const mainWord =
            verse.teluguHighlightMain || words[1] || "ఒంటరిగా";
          const midWord =
            verse.teluguHighlightMid || words[2] || "నుండినను";
          const subText =
            verse.teluguHighlightSub ||
            words.slice(3).join(" ") ||
            "నీవే నన్ను సురక్షితముగా\nనివసింపజేయుదువు";

          const baseAnchorY = (isSquare ? 452 : 1140) + yShift;

          ctx.save();
          ctx.font = `900 ${Math.round(52 * scale)}px 'Ramabhadra', 'Noto Sans Telugu', sans-serif`;
          const topTextW = ctx.measureText(topWord).width;
          const ovalRx = Math.max(82, topTextW / 2 + 34) * scale;
          const ovalRy = 38 * scale;
          const ovalCx = width / 2 + 12;
          const ovalCy = baseAnchorY;

          ctx.beginPath();
          ctx.ellipse(ovalCx, ovalCy, ovalRx, ovalRy, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#D90416";
          ctx.fill();
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(topWord, ovalCx, ovalCy + 4);
          ctx.restore();

          const mainY = baseAnchorY + 148 * scale;
          ctx.save();
          ctx.textAlign = "center";
          ctx.font = `900 ${Math.round(134 * scale)}px 'Ramabhadra', 'Noto Sans Telugu', sans-serif`;
          for (let d = 12; d >= 1; d--) {
            ctx.fillStyle = d > 6 ? "rgba(2, 24, 6, 0.85)" : "#8E9E93";
            ctx.fillText(mainWord, width / 2 + 8, mainY + d);
          }
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(mainWord, width / 2 + 8, mainY);
          ctx.restore();

          const midY = mainY + 76 * scale;
          ctx.save();
          ctx.textAlign = "center";
          ctx.font = `900 ${Math.round(58 * scale)}px 'Ramabhadra', 'Noto Sans Telugu', sans-serif`;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(midWord, width / 2 + 8, midY);
          ctx.restore();

          ctx.save();
          ctx.textAlign = "center";
          ctx.font = `900 ${Math.round(62 * scale)}px 'Ramabhadra', 'Noto Sans Telugu', sans-serif`;
          const subLines = wrapCanvasText(ctx, subText, width - 90);
          let curSubY = midY + 84 * scale;
          for (const line of subLines.slice(0, 2)) {
            ctx.fillStyle = "rgba(2, 22, 6, 0.95)";
            ctx.fillText(line, width / 2 + 4, curSubY + 6);
            ctx.fillStyle = "#ECFF26";
            ctx.fillText(line, width / 2, curSubY);
            curSubY += 76 * scale;
          }
          ctx.restore();

          const refY = Math.min(height - footerH - 18, curSubY + 2 * scale);
          ctx.save();
          ctx.textAlign = "center";
          ctx.font = `700 ${Math.round(31 * scale)}px 'Noto Sans Telugu', sans-serif`;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(verse.teluguReference, width / 2 + 4, refY);
          ctx.restore();

          if (customization.showFooter) {
            const fy = height - footerH;
            ctx.save();
            ctx.fillStyle = "#084D15";
            ctx.fillRect(0, fy, width, footerH);

            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "left";
            ctx.font = "italic 800 35px 'Plus Jakarta Sans', sans-serif";
            ctx.fillText("GRACE MANDHIR", 20, fy + footerH - 10);

            ctx.beginPath();
            ctx.moveTo(344, fy);
            ctx.lineTo(width, fy);
            ctx.lineTo(width, height);
            ctx.lineTo(304, height);
            ctx.closePath();
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();

            const textBaseY = fy + footerH - 11;
            ctx.fillStyle = "#145A23";
            ctx.font = "900 31px 'Plus Jakarta Sans', sans-serif";
            ctx.fillText("7661845090.9666723272", 742, textBaseY);
            ctx.restore();
          }
        } else {
          // Mobile Lockscreen 1080x1920
          const grad = ctx.createLinearGradient(0, 0, 0, height);
          grad.addColorStop(0, "rgba(234, 245, 255, 0.94)");
          grad.addColorStop(0.55, "rgba(255, 255, 255, 0.82)");
          grad.addColorStop(1, "rgba(9, 45, 89, 0.55)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          if (logoImg) {
            ctx.drawImage(logoImg, width / 2 - 70, 140, 140, 140);
          } else {
            drawChurchCrestOnCanvas(ctx, width / 2, 195, 1.55, "#092D59");
          }

          ctx.save();
          ctx.textAlign = "center";
          ctx.fillStyle = "#092D59";
          ctx.font = "800 46px 'Playfair Display', Georgia, serif";
          ctx.fillText(customization.churchName, width / 2, 315);
          ctx.restore();

          const scale = customization.fontScale || 1;
          ctx.save();
          ctx.textAlign = "center";
          ctx.fillStyle = "#092D59";
          ctx.font = `800 ${Math.round(68 * scale)}px 'Noto Sans Telugu', sans-serif`;
          const teLines = wrapCanvasText(
            ctx,
            verse.teluguVerse.replace(/\n/g, " "),
            width - 160
          );
          let curY = 540 + customization.textYOffset;
          for (const line of teLines) {
            ctx.fillText(line, width / 2, curY);
            curY += 96 * scale;
          }
          ctx.restore();
        }

        setIsRendering(false);
      }

      render();

      return () => {
        cancelled = true;
      };
    }, [verse, customization, width, height, tpl]);

    return (
      <div className={`relative select-none ${className}`}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full h-auto rounded-3xl shadow-[0_20px_50px_rgba(9,45,89,0.22)] border-[6px] border-white"
        />
        {isRendering && (
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px] rounded-3xl flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-white/90 text-[#092D59] text-xs font-bold shadow">
              Rendering HD...
            </span>
          </div>
        )}
      </div>
    );
  }
);

WallpaperCanvas.displayName = "WallpaperCanvas";
