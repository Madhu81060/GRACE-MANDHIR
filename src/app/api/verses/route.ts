import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/serverDb";
import { VerseRecord } from "@/lib/verseStore";

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    verses: db.verses,
    total: db.verses.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<VerseRecord>;
    if (!body.date || !body.teluguVerse || !body.englishVerse) {
      return NextResponse.json(
        { error: "Date, Telugu verse, and English verse are required." },
        { status: 400 }
      );
    }

    const db = readDb();
    const newVerse: VerseRecord = {
      id: body.id || `v-${body.date}`,
      date: body.date,
      teluguVerse: body.teluguVerse,
      teluguHighlightTop:
        body.teluguHighlightTop || body.teluguVerse.split(" ")[0] || "దేవుని",
      teluguHighlightMain:
        body.teluguHighlightMain ||
        body.teluguVerse.split(" ").slice(1, 3).join(" ") ||
        "వాగ్దానము",
      teluguHighlightSub:
        body.teluguHighlightSub ||
        body.teluguVerse.split(" ").slice(3).join(" ") ||
        body.teluguVerse,
      englishVerse: body.englishVerse,
      teluguReference: body.teluguReference || "కీర్తనలు 23:1",
      englishReference: body.englishReference || "Psalms 23:1",
      themeTitle: body.themeTitle || "Daily Blessing",
      teluguThemeTitle: body.teluguThemeTitle || "ఈరోజు వాగ్దానం",
      backgroundUrl: body.backgroundUrl || "/images/hero-sunrise-cross.jpg",
      templateId: body.templateId || "promise-poster",
    };

    const existingIdx = db.verses.findIndex(
      (v) => v.date === newVerse.date || v.id === newVerse.id
    );
    if (existingIdx >= 0) {
      db.verses[existingIdx] = newVerse;
    } else {
      db.verses.unshift(newVerse);
    }

    writeDb(db);
    return NextResponse.json({ verse: newVerse, verses: db.verses });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save verse", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const date = searchParams.get("date");

    const db = readDb();
    db.verses = db.verses.filter(
      (v) => (id ? v.id !== id : true) && (date ? v.date !== date : true)
    );
    writeDb(db);
    return NextResponse.json({ verses: db.verses });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete verse", details: String(error) },
      { status: 500 }
    );
  }
}
