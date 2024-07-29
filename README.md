# Writer for [Mono-logger](https://github.com/bebrasmell/mono-logger)

Writer extension for [Mono-logger 1.5+](https://github.com/bebrasmell/mono-logger).
Please refer to its documentation before jumping into configuring the __Writer__.

This effect allows you to write logs to a file with minimum configuration.
```ts
import { Logger } from '@bebrasmell/mono-logger';
import { WriterEffect } from '@bebrasmell/mono-logger-writer';

const writerEffect = new WriterEffect({
  path: 'logs',
});

const logger = new Logger("writer", {
  effect: writerEffect,
});

logger.info("Hello, World!");

// Console: 7/29/2024, 16:16:16 [INF] writer Hello, world!
//
// + file: logs/mono-logger-2024629-0.log:
// 2024-07-29T13:18:07.235Z [INF] writer Hello, world!

```

## Changelog
Please see [CHANGELOG](./CHANGELOG.md) for latest changes.

## Prerequisites
- Node.js 12+
- Mono-logger 1.5+

## Installation
Assuming you have already installed [Mono-logger 1.5+](https://github.com/bebrasmell/mono-logger):

```bash
yarn add @bebrasmell/mono-logger-writer
```

Or

```bash
npm i @bebrasmell/mono-logger-writer
```

## Configuration
- `level` (LogLevel) – The minimum log level to write (e.g. `debug`, `info`, `warn`, `error`, `fatal`). Default: `debug`;

- `path` (string) – The directory to write logs. Default: `logs`;

- `filename` (function) – Function to generate the filename that accepts the current date and file iterator (starts with `0`) and returns a file name `string`;

- `transform` (function) – Function to transform the log message before writing to the file. Default: `undefined`;

- `max_file_size` (number) – The maximum file size in kilobytes before creating a new file. Default: `5 * 1024`KB (`~5`MB);


```ts
import { Logger, type LogLevel } from '@bebrasmell/mono-logger';
import { WriterEffect } from '@bebrasmell/mono-logger-writer';

const transformer = (ts: Date, level: LogLevel, topics: string[], ...messages: any[]) => {
  const timestamp = ts.toString();
  const lvl_str = level.toUpperCase();
  return `${timestamp} [${lvl_str}] ${topics.join(':')} ${messages.join(' ')}`;
};

const writerEffect = new WriterEffect({
  level: 'info',
  path: 'logs',
  filename: (date, i) => `my-log-${date.toISOString()}-${i}.log`,
  max_file_size: 20 * 1024, // 20MB
  transform: transformer,
});

const logger = new Logger("root", {
  effect: writerEffect,
});

logger.info("Hello, World!");

// Output:
// + file: logs/my-log-2024-07-29T13:34:40.782Z-0.log
// Mon Jul 29 2024 16:35:25 GMT+0300 (Istanbul Standard time) [INFO] root Hello, World!
```

### Size based rotation
The __Writer__ will create a new file when the current file size exceeds the `max_file_size` limit. File size is provided in kilobytes. Default file size is around 5MB, which can be changed by setting the `max_file_size` option. If you don't want your files to be rotated, you can just pass `Infinity` to this field.
In this case, the __iterator__ will not have any effect.

If you stop the app and run it again with all the same configuration, __iterator__ will be pointed to the __next of the last file number__. If you want to start from scratch, you can delete those files or change the `filename` function.

## How to screw things up
Common problems that can possibly happen fall into one (or more) of these categories:

- `fs` cannot write to the directory because of it's access rules;

- `fs` cannot write because the disk is full;

- File is being overwritten because it happened to have same filename and path (check the `path` and `filename` function);

- Provided `max_file_size` is smaller than a given record, so the file will be rotated immediately (and possibly infinitely if you dump __MASSIVE__ amount of data in one record);

## Contributing

Contribution is always welcomed!
These are several points of special interest:

- Improve test coverage (Jest);
- Edge case exploration;
- Stability and efficiency improvements (KISS);

You are also welcome to extend and improve [Mono-logger](https://github.com/bebrasmell/mono-logger) plugin ecosystem.

## License
MIT
