import { describe, it, expect } from 'vitest';
import { EventEmitter, Queue, createQueue } from '../src/index';

describe('EventEmitter', () => {
  it('creates emitter', () => {
    const emitter = new EventEmitter();
    expect(emitter).toBeDefined();
  });
});

describe('Queue', () => {
  it('creates queue', () => {
    const q = createQueue();
    expect(q).toBeDefined();
  });
});
