# @creadev.org/event

> Event - emitter, pubsub, queue

[![npm](https://img.shields.io/npm/v/@creadev.org/event)](https://www.npmjs.com/package/@creadev.org/event)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Install

```bash
npm install @creadev.org/event
```

## Usage

```typescript
import { EventEmitter, Queue, PubSub, createEvent } from '@creadev.org/event';

const emitter = createEvent();
emitter.on('event', (data) => console.log(data));
emitter.emit('event', { data: 'value' });

const queue = new Queue();
await queue.enqueue('job', { data: 'job' });
```

## API

| Class | Description |
|-------|-------------|
| `EventEmitter<T>` | Event emitter |
| `Queue` | Job queue |
| `PubSub` | Publish-subscribe |

## License

MIT
