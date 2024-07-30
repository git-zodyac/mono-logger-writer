import logger from "@bebrasmell/mono-logger";
import { WriterEffect } from "./dist/index.js";

const writer = new WriterEffect({
  // daily_rotation: true,
  path: "logs",
});
const w_logger = logger.topic("writer", {
  effect: writer,
});

w_logger.info("Hello, world");

let records = 0;
const iters = 100_000;
const break_at = Math.floor(Math.random() * iters);
while (records < iters) {
  w_logger.debug(`This is record ${records} containing a longer, longer, longer string`);
  if (records % 50 == 0) w_logger.warn(`This record is special: ${records}.`);
  if (records == break_at) {
    throw new Error(`Breaking at record ${records}`);
  }

  records++;
}

// const interval = setInterval(() => {
//   if (records > 10000) return clearInterval(interval);

//   w_logger.debug(`This is record ${records} containing a longer, longer, longer string`);
//   if (records % 50 == 0) w_logger.warn(`This record is special: ${records}.`);
//   records++;
// }, 1000);
