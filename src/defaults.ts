import { CODES } from "@bebrasmell/mono-logger";
import type { TFilenameGenerator, TRecordTransformer } from "./types";

export const DEFAULT_FILENAME: TFilenameGenerator = (d, i) => {
  const ts = `${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
  return `mono-logger-${ts}-${i}.log`;
};

export const DEFAULT_TRANSFORMER: TRecordTransformer = (ts, lvl, topics, ...args) => {
  const topics_str = topics.join(":");
  const content = args
    .map((c) => {
      if (c instanceof Error) return c.stack;
    if (typeof c === "object") return JSON.stringify(c);
      return c;
    })
    .join(" ");

  // return `${ts.toISOString()} [${lvl}] ${topics_str} ${content}`;
  return `${ts.toISOString()} [${CODES[lvl]}] ${topics_str} ${content}`;
};
