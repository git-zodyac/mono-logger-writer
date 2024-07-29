import { type LogLevel, MonoEffect } from "@bebrasmell/mono-logger";
import fs from "node:fs";
import Path from "node:path";
import { DEFAULT_FILENAME, DEFAULT_TRANSFORMER } from "./defaults";
import type { TFilenameGenerator, TRecordTransformer, iWriterConfig } from "./types";
import { readMetaFile, writeMetaFile } from "./utils";

export class WriterEffect extends MonoEffect {
  private dir_path: string;
  private filename_gen: TFilenameGenerator;
  private readonly max_file_size: number;
  private readonly transformer: TRecordTransformer;
  private readonly daily_rotate: boolean;

  private current_stream?: fs.WriteStream;
  private current_output_path?: string;
  private current_file_size = 0;
  private next_iter = 0;

  constructor(config?: iWriterConfig) {
    super(
      (ts, lvl, topics, ...args) => this.executor.bind(this)(ts, lvl, topics, ...args),
      config?.level,
    );

    this.dir_path = config?.path ?? "logs";
    this.transformer = config?.transform ?? DEFAULT_TRANSFORMER;
    this.max_file_size = (config?.max_file_size ?? 5 * 1024) * 1024;
    this.filename_gen = config?.filename ?? DEFAULT_FILENAME;
    this.daily_rotate = config?.daily_rotation ?? false;

    this.setupFolder();
  }

  // Daily rotation
  private rotation_needed = false;
  private currentTimer?: NodeJS.Timeout;
  private setupDailyRotation() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const diff = next.getTime() - now.getTime();

    this.currentTimer = setTimeout(() => {
      this.rotation_needed = true;
      this.currentTimer = undefined;
    }, diff);
  }

  // Files and folders
  private setupFolder() {
    if (fs.existsSync(this.dir_path)) {
      fs.accessSync(this.dir_path, fs.constants.W_OK);

      const meta = readMetaFile(this.dir_path);
      this.next_iter = meta[1] + 1;
      return;
    }

    fs.mkdirSync(this.dir_path, { recursive: true });
    writeMetaFile(this.dir_path, this.next_iter);
  }

  private output_path() {
    const ts = new Date();
    const filename = this.filename_gen(ts, this.next_iter);

    return Path.resolve(this.dir_path, filename);
  }

  // Streams
  private closeCurrentStream() {
    if (!this.current_stream) return;
    if (!this.current_stream.closed) this.current_stream.close();
    else this.current_stream.close();

    this.current_output_path = undefined;
    this.current_file_size = 0;
  }

  private createStream(): fs.WriteStream {
    if (this.current_stream) this.closeCurrentStream();

    if (this.daily_rotate) {
      if (this.currentTimer) clearTimeout(this.currentTimer);
      this.setupDailyRotation();

      this.current_output_path = this.output_path();
    } else {
      while (true) {
        const path = this.output_path();
        try {
          const stats = fs.statSync(path);
          if (stats.size > this.max_file_size) {
            this.next_iter++;
            continue;
          }
        } catch (e) {}

        this.current_output_path = path;
        break;
      }
    }

    this.current_stream = fs.createWriteStream(this.current_output_path);

    writeMetaFile(this.dir_path, this.next_iter);
    this.next_iter++;

    return this.current_stream;
  }

  private selectStream(record: string): fs.WriteStream {
    if (!this.current_stream) return this.createStream();

    if (this.daily_rotate) {
      if (this.rotation_needed) {
        this.rotation_needed = false;
        this.createStream();
      }
    } else {
      const out_size = this.current_file_size + Buffer.byteLength(record, "utf-8");
      if (out_size > this.max_file_size) return this.createStream();
    }

    return this.current_stream;
  }

  // Effect
  private executor(ts: Date, level: LogLevel, topics: string[], ...args: any[]) {
    const record = this.transformer(ts, level, topics, ...args);
    const content = `${record}\n`;

    const stream = this.selectStream(content);

    stream.write(content);
    this.current_file_size += Buffer.byteLength(content, "utf-8");
  }
}
