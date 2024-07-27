import { Logger } from "./dist/index.js";

const formatter = new Intl.DateTimeFormat({
  hourCycle: "h11",
});

const re_log = new Logger(
  "root", {
  prefix: () => "That's me",
  // transform: (s) => `yo ${s}`,
  date_format: formatter.format,
});

re_log.log("hello", "world", { "oi": "mate" });

const logger = new Logger();
const subLogger = logger.topic('sub-topic');
const deepSubLogger = subLogger.topic('deep-sub-topic');

deepSubLogger._parent?.log('hello, world');

deepSubLogger.debug('hello, debug');
deepSubLogger.info('hello, info');
deepSubLogger.warn('hello, warn');
deepSubLogger.error('hello, error');
deepSubLogger.fatal('hello, fatal');
deepSubLogger.log('hello, log');
deepSubLogger.verbose('hello, verbose');

const ex_logger = new Logger('example', {
  level: 'info',
  prefix: () => 'my-app',
  date_format: (date) => date.toISOString(),
  effect: (level, topics, ...data) => console.log(level, topics, ...data),
  transform: (m) => `yes, ${m}`,
  force_effect: true,
});

ex_logger.info('hello', 'me');
