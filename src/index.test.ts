import { describe, it, expect, beforeEach } from 'vitest';
import { EventEmitter, Queue, PubSub, createEvent, createQueue, createPubSub } from '../src/index';

describe('EventEmitter', () => {
  let emitter: EventEmitter;
  beforeEach(() => { emitter = new EventEmitter(); });
  it('creates emitter', () => { expect(emitter).toBeDefined(); });
  it('emits events', () => {
    let called = false;
    emitter.on('test', () => { called = true; });
    emitter.emit('test');
    expect(called).toBe(true);
  });
});

describe('Queue', () => {
  it('creates queue', () => {
    const q = createQueue();
    expect(q).toBeDefined();
  });
});
