import fs from "node:fs";
import Path from "node:path";

const META_FILE = ".writer-meta";
export function writeMetaFile(dir: string, iter = 0) {
  const meta_path = Path.resolve(dir, META_FILE);
  const ts = new Date().toISOString();
  fs.writeFileSync(meta_path, `${ts}\n${iter}`);
}

export function readMetaFile(dir: string): [Date, number] {
  try {
    const meta_path = Path.resolve(dir, META_FILE);
    const meta = fs.readFileSync(meta_path, "utf-8");
    if (!meta) throw new Error("Empty meta file");

    const lines = meta.split("\n");
    if (lines.length < 2) throw new Error("Incorrect number of lines");

    const [raw_date, raw_iter] = lines;

    if (!raw_date) throw new Error("Empty date line");
    const date = new Date(raw_date);
    const iter = Number.parseInt(raw_iter);

    if (Number.isNaN(iter)) return [date, 0];

    return [date, iter];
  } catch (e) {
    return [new Date(), 0];
  }
}
