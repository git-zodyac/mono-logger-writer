# Mono-logger

A simple logger module with topics and side-effects capabilities.
It comes pretty useful when need to share common loggers across multiple modules or to nest loggers with different topics (e.g. function executors for debugging purposes).

Default logs format:
```log
7/26/2024, 20:54:26 [DBG] hello, world
```

## Changelog
Please see [CHANGELOG](./CHANGELOG.md) for latest changes.

## Installation
```bash
yarn add @bebrasmell/mono-logger
```

Or

```bash
npm i @bebrasmell/mono-logger
```

## Topics
You can create a new child logger with a specific topic. This way you can filter logs by topic.

```typescript
import { Logger } from '@bebrasmell/mono-logger';

const logger = new Logger();
const subLogger = logger.topic('sub-topic');
const deepSubLogger = subLogger.topic('deep-sub-topic');

deepSubLogger.log('hello, world');

// Output:
// 7/26/2024, 21:11:09 [DBG] sub-topic:deep-sub-topic hello, world
```

You can also access parent logger from a child logger.

```typescript
import { Logger } from '@bebrasmell/mono-logger';

const logger = new Logger();
const subLogger = logger.topic('sub-topic');
const deepSubLogger = subLogger.topic('deep-sub-topic');

deepSubLogger._parent?.log('hello, world');

// Output:
// 7/26/2024, 21:11:09 [DBG] sub-topic hello, world
```

## Configuration
Configuration can be set for the root logger or specific topic and its descendants. It means, that topic configuration will be inherited from it's parent. When you provide options for a new topic, it's going to override its parent configuration entirely.

Example:
```typescript
const root_logger = new Logger("root", {
    level: "info",
});

const sub_logger = root_logger.topic("leaf", {});

sub_logger.debug("I am still here!");
// Output:
// 7/26/2024, 21:11:09 [DBG] root:leaf I am still here!
```

You can configure the logger with:
- ```level```: (e.g. debug) The minimum log level to be displayed.
- ```prefix```: (function) A prefix to be added to each log record before topics.
- ```date_format```: (function) The date formatter function to be used in logs.
- ```effect```: (function) A side-effect function to be called on each log record. It receives log level, list of topics and spread raw data array passed to logger.
- ```transform```: (function) A function to transform log records before being displayed.
- ```force_effect```: (boolean) If true, side-effects will be called even if log level is below the minimum level.


```typescript
import { Logger } from '@bebrasmell/mono-logger';

const ex_logger = new Logger('example', {
  level: 'debug',
  prefix: () => 'my-app',
  date_format: (date) => date.toISOString(),
  effect: (level, topics, ...data) => console.log(level, topics, ...data),
  transform: (m) => `yes, ${m}`,
  force_effect: true,
});

ex_logger.log('hello', 'world');

// Output:
// 2024-07-26T18:47:01.978Z [DBG] my-app example yes, hello yes, world
// debug [ 'example' ] hello world
```

## Side effects
You can assign any side effect you want to any topic and it's descendants (see Configuration). So each time you log something, the logger fires the ```effect``` function with parameters:
- ```level``` - log level
- ```topics``` (array, root to leaf)
- ```...raw``` data you passed to logger

By default, when you log something below the minimum log level specified in Topic Configuration, ```effect``` is not fired. You can force logger to fire it by passing ```force_effect```.


## License
MIT
