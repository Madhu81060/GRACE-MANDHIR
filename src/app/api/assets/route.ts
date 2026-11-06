import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/serverDb";
import { WallpaperBackground, ChurchSettings } from "@/lib/verseStore";

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    backgrounds: db.backgrounds,
    templates: db.templates,
    settings: db.settings,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = readDb();

    if (body.type === "background" && body.background) {
      const bg: WallpaperBackground = {
        id: body.background.id || `bg-${Date.now()}`,
        name: body.background.name || "Custom Christian Background",
        teluguName: body.background.teluguName || "క్రైస్తవ నేపథ్యం",
        url: body.background.url,
        category: body.background.category || "sunrise",
      };
      db.backgrounds.unshift(bg);
      writeDb(db);
      return NextResponse.json({ backgrounds: db.backgrounds });
    }

    if (body.type === "settings" && body.settings) {
      const nextSettings: ChurchSettings = {
        ...db.settings,
        ...body.settings,
      };
      db.settings = nextSettings;
      writeDb(db);
      return NextResponse.json({ settings: db.settings });
    }

    return NextResponse.json({ error: "Invalid asset payload" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update assets", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bgId = searchParams.get("bgId");
  const db = readDb();
  if (bgId) {
    db.backgrounds = db.backgrounds.filter((b) => b.id !== bgId);
    writeDb(db);
  }
  return NextResponse.json({ backgrounds: db.backgrounds });
}
