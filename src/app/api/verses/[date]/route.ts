import { NextRequest, NextResponse } from "next/server";
import { getVerseByDateFromDb, readDb } from "@/lib/serverDb";

export async function GET(
  _request: NextRequest,
  { params }: { params: { date: string } }
) {
  const dateStr = params.date || "2026-11-06";
  const verse = getVerseByDateFromDb(dateStr);
  const db = readDb();
  return NextResponse.json({
    verse,
    settings: db.settings,
  });
}
