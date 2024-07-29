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
while (records < 100000) {
  w_logger.debug(`This is record ${records} containing a longer, longer, longer string`);
  records++;
}

// const interval = setInterval(() => {
//   if (records > 10000) return clearInterval(interval);

//   w_logger.debug(`This is record ${records} containing a longer, longer, longer string`);
//   if (records % 50 == 0) w_logger.warn(`This record is special: ${records}.`);
//   records++;
// }, 1000);
