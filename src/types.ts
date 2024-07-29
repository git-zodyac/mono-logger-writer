import type { LogLevel } from "@bebrasmell/mono-logger";

export type TFilenameGenerator = (date: Date, iterator: number) => string;
export type TRecordTransformer = (
  timestamp: Date,
  level: LogLevel,
  topics: string[],
  ...messages: any[]
) => string;

/**
 * MonoLogger Writer config
 * @prop {LogLevel} level Minimum log level to write;
 * @prop {function} transform A function that transforms input data to record string;
 * @prop {string} path Directory path to write logs to;

 * For size based rotation:
 * @prop {number} max_file_size Maximum file size in Kilobytes (1024 bytes);
 * @prop {function} filename Filename generator (based on date and);

 * For daily rotation:
 * @prop {true} daily_rotation Enable daily rotation (will start new file every day);
 * @prop {function} filename Filename generator (based on date only);
 */
export interface iWriterConfig {
  /**
   * Minimum log level to write to file
   * @default debug
   */
  level?: LogLevel;

  /**
   * A function to transform input message and parameters to a record line
   * @param {timestamp} timestamp Timestamp
   * @param {LogLevel} level Log level
   * @param {string[]} topics Topics list, root to leaf
   * @param {...any[]} ...messages Raw input data
   * @returns {string} Message record
   */
  transform?: TRecordTransformer;

  /**
   * Path to logs folder to create log files in. If folder doesn't exist, writer will create one for you.
   * @default "logs"
   */
  path?: string;

  /**
   * Max file size in KB.
   * After breaking the limit, current file will be closed and a new file (with iterated name) will be created.
   * @default 5mb (5 * 1024 KB)
   */
  max_file_size?: number;

  /**
   * Function to generate file names.
   * @prop {Date} date Current date (when file was created)
   * @prop {number} iterator Current file number (ordinal)
   * @returns {string} File name
   */
  filename?: (date: Date, iter?: number) => string;

  /**
   * Enable daily rotation.
   * Log files will be created once per day
   */
  daily_rotation?: true;
}

export interface iWriterConfigBase {
  /**
   * Minimum log level to write to file
   * @default debug
   */
  level?: LogLevel;

  /**
   * A function to transform input message and parameters to a record line
   * @param {timestamp} timestamp Timestamp
   * @param {LogLevel} level Log level
   * @param {string[]} topics Topics list, root to leaf
   * @param {...any[]} ...messages Raw input data
   * @returns {string} Message record
   */
  transform?: TRecordTransformer;

  /**
   * Path to logs folder to create log files in. If folder doesn't exist, writer will create one for you.
   * @default "logs"
   */
  path?: string;
}

export interface iWriterConfigSizeRotation extends iWriterConfigBase {
  /**
   * Max file size in KB.
   * After breaking the limit, current file will be closed and a new file (with iterated name) will be created.
   * @default 5mb (5 * 1024 KB)
   */
  max_file_size?: number;
}

export interface iWriterConfigDaily extends iWriterConfigBase {}
