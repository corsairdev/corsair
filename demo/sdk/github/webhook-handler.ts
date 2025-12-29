import * as crypto from 'crypto';
import type {
  CommitCommentEvent,
  DeploymentEvent,
  PullRequestEvent,
  PushEvent,
  StarEvent,
  TeamAddEvent,
  WatchEvent,
} from './webhooks';

export type WebhookEventName =
  | 'commit_comment'
  | 'deployment'
  | 'pull_request'
  | 'push'
  | 'star'
  | 'team_add'
  | 'watch';

export interface WebhookEventMap {
  commit_comment: CommitCommentEvent;
  deployment: DeploymentEvent;
  pull_request: PullRequestEvent;
  push: PushEvent;
  star: StarEvent;
  team_add: TeamAddEvent;
  watch: WatchEvent;
}

export type WebhookEventHandler<T extends WebhookEventName> = (
  event: WebhookEventMap[T]
) => void | Promise<void>;

export interface WebhookHeaders {
  'x-github-event'?: string;
  'x-hub-signature-256'?: string;
  'x-github-delivery'?: string;
  [key: string]: string | undefined;
}

export interface GithubWebhookHandlerOptions {
  secret?: string;
}

export interface HandleWebhookResult {
  success: boolean;
  eventType?: WebhookEventName;
  error?: string;
}

export class GithubWebhookHandler {
  private secret?: string;
  private handlers: Map<WebhookEventName, WebhookEventHandler<WebhookEventName>[]> = new Map();

  constructor(options: GithubWebhookHandlerOptions = {}) {
    this.secret = options.secret;
  }

  on<T extends WebhookEventName>(
    eventName: T,
    handler: WebhookEventHandler<T>
  ): this {
    const existingHandlers = this.handlers.get(eventName) || [];
    existingHandlers.push(handler as WebhookEventHandler<WebhookEventName>);
    this.handlers.set(eventName, existingHandlers);
    return this;
  }

  off<T extends WebhookEventName>(
    eventName: T,
    handler: WebhookEventHandler<T>
  ): this {
    const existingHandlers = this.handlers.get(eventName) || [];
    const index = existingHandlers.indexOf(handler as WebhookEventHandler<WebhookEventName>);
    if (index !== -1) {
      existingHandlers.splice(index, 1);
      this.handlers.set(eventName, existingHandlers);
    }
    return this;
  }

  verifySignature(payload: string | Buffer, signature: string): boolean {
    if (!this.secret) {
      return true;
    }

    if (!signature) {
      return false;
    }

    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', this.secret)
      .update(payload)
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  }

  async handleWebhook(
    headers: WebhookHeaders,
    payload: string | object
  ): Promise<HandleWebhookResult> {
    const eventName = headers['x-github-event'] as WebhookEventName | undefined;
    const signature = headers['x-hub-signature-256'];

    if (!eventName) {
      return {
        success: false,
        error: 'Missing x-github-event header',
      };
    }

    const payloadString = typeof payload === 'string' 
      ? payload 
      : JSON.stringify(payload);

    if (this.secret && signature) {
      const isValid = this.verifySignature(payloadString, signature);
      if (!isValid) {
        return {
          success: false,
          eventType: eventName,
          error: 'Invalid signature',
        };
      }
    } else if (this.secret && !signature) {
      return {
        success: false,
        eventType: eventName,
        error: 'Missing signature header',
      };
    }

    const parsedPayload = typeof payload === 'string' 
      ? JSON.parse(payload) 
      : payload;

    const handlers = this.handlers.get(eventName) || [];

    try {
      for (const handler of handlers) {
        await handler(parsedPayload);
      }

      return {
        success: true,
        eventType: eventName,
      };
    } catch (error) {
      return {
        success: false,
        eventType: eventName,
        error: error instanceof Error ? error.message : 'Handler execution failed',
      };
    }
  }

  getRegisteredEvents(): WebhookEventName[] {
    return Array.from(this.handlers.keys());
  }

  hasHandlers(eventName: WebhookEventName): boolean {
    const handlers = this.handlers.get(eventName);
    return !!handlers && handlers.length > 0;
  }

  clearHandlers(eventName?: WebhookEventName): this {
    if (eventName) {
      this.handlers.delete(eventName);
    } else {
      this.handlers.clear();
    }
    return this;
  }
}

export function createWebhookHandler(options?: GithubWebhookHandlerOptions): GithubWebhookHandler {
  return new GithubWebhookHandler(options);
}

