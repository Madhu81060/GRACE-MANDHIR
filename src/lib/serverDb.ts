import fs from "fs";
import path from "path";
import {
  CURATED_VERSES,
  DEFAULT_BACKGROUNDS,
  DEFAULT_CHURCH_SETTINGS,
  DEFAULT_TEMPLATES,
  VerseRecord,
  WallpaperBackground,
  WallpaperTemplate,
  ChurchSettings,
  resolveVerseForDate,
} from "./verseStore";

export interface DatabaseSchema {
  verses: VerseRecord[];
  backgrounds: WallpaperBackground[];
  templates: WallpaperTemplate[];
  settings: ChurchSettings;
}

const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "db.json");

function ensureDbFile(): DatabaseSchema {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE_PATH)) {
      const initial: DatabaseSchema = {
        verses: CURATED_VERSES,
        backgrounds: DEFAULT_BACKGROUNDS,
        templates: DEFAULT_TEMPLATES,
        settings: DEFAULT_CHURCH_SETTINGS,
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    return {
      verses: parsed.verses && parsed.verses.length > 0 ? parsed.verses : CURATED_VERSES,
      backgrounds:
        parsed.backgrounds && parsed.backgrounds.length > 0
          ? parsed.backgrounds
          : DEFAULT_BACKGROUNDS,
      templates:
        parsed.templates && parsed.templates.length > 0
          ? parsed.templates
          : DEFAULT_TEMPLATES,
      settings: parsed.settings || DEFAULT_CHURCH_SETTINGS,
    };
  } catch {
    return {
      verses: CURATED_VERSES,
      backgrounds: DEFAULT_BACKGROUNDS,
      templates: DEFAULT_TEMPLATES,
      settings: DEFAULT_CHURCH_SETTINGS,
    };
  }
}

export function readDb(): DatabaseSchema {
  return ensureDbFile();
}

export function writeDb(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write db.json:", err);
  }
}

export function getVerseByDateFromDb(dateStr: string): VerseRecord {
  const db = readDb();
  return resolveVerseForDate(dateStr, db.verses);
}
