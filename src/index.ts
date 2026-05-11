/**
 * @creadev.org/event
 *
 * Event emitter, pub/sub, queue.
 */

export type EventHandler<T = unknown> = (data: T) => void;

export interface EventOptions {
  maxListeners?: number;
}

export interface QueueJob {
  id: string;
  type: string;
  data: unknown;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

// ==================== EVENT EMITTER ====================

export class EventEmitter<T = unknown> {
  private handlers = new Map<string, EventHandler<T>[]>();
  private maxListeners: number;

  constructor(options: EventOptions = {}) {
    this.maxListeners = options.maxListeners ?? 100;
  }

  emit(type: string, data: T): number {
    const handlers = this.handlers.get(type) ?? [];
    handlers.forEach(fn => { try { fn(data); } catch (e) { console.error('Event error:', e); } });
    return handlers.length;
  }

  on(type: string, handler: EventHandler<T>): this {
    const handlers = this.handlers.get(type) ?? [];
    handlers.push(handler);
    this.handlers.set(type, handlers);
    return this;
  }

  once(type: string, handler: EventHandler<T>): this {
    const wrapper = (data: T) => { handler(data); this.off(type, wrapper); };
    return this.on(type, wrapper);
  }

  off(type: string, handler: EventHandler<T>): this {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const idx = handlers.indexOf(handler);
      if (idx >= 0) handlers.splice(idx, 1);
    }
    return this;
  }

  removeAllListeners(type?: string): this {
    if (type) this.handlers.delete(type);
    else this.handlers.clear();
    return this;
  }

  eventTypes(): string[] { return Array.from(this.handlers.keys()); }
  listenerCount(type: string): number { return (this.handlers.get(type) ?? []).length; }
}

// ==================== QUEUE ====================

export class Queue {
  private jobs = new Map<string, QueueJob>();
  private queue: string[] = [];

  enqueue(type: string, data: unknown): string {
    const id = Math.random().toString(36).substring(2, 10);
    const job: QueueJob = { id, type, data, status: 'pending', createdAt: Date.now() };
    this.jobs.set(id, job);
    this.queue.push(id);
    return id;
  }

  async process<T>(handler: (job: QueueJob) => Promise<T>): Promise<T | undefined> {
    if (this.queue.length === 0) return undefined;
    const id = this.queue.shift()!;
    const job = this.jobs.get(id)!;
    job.status = 'running';
    job.startedAt = Date.now();
    try {
      const result = await handler(job);
      job.status = 'completed';
      job.completedAt = Date.now();
      return result;
    } catch (err) {
      job.status = 'failed';
      job.error = (err as Error).message;
      job.completedAt = Date.now();
      throw err;
    }
  }

  get(id: string): QueueJob | undefined { return this.jobs.get(id); }
  list(status?: QueueJob['status']): QueueJob[] {
    return Array.from(this.jobs.values()).filter(j => !status || j.status === status);
  }
  pending(): number { return this.list('pending').length; }
  clean(olderThan?: number): number {
    const cutoff = olderThan ?? Date.now() - 86400000;
    let cleaned = 0;
    for (const [id, job] of this.jobs) {
      if (job.status === 'completed' && (job.completedAt ?? 0) < cutoff) {
        this.jobs.delete(id);
        cleaned++;
      }
    }
    return cleaned;
  }
}

// ==================== PUBSUB ====================

export class PubSub extends EventEmitter {
  subscribe(topic: string, handler: EventHandler): this { return this.on(topic, handler); }
  publish(topic: string, data: unknown): number { return this.emit(topic, data); }
  unsubscribe(topic: string, handler: EventHandler): this { return this.off(topic, handler); }
}

// ==================== FACTORY ====================

export function createEvent<T>(options?: EventOptions): EventEmitter<T> { return new EventEmitter<T>(options); }
export function createQueue(): Queue { return new Queue(); }
export function createPubSub(): PubSub { return new PubSub(); }
