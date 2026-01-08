import * as crypto from 'crypto';
import type {
	PostHogEventMap,
	PostHogEventName,
	PostHogWebhookEvent,
	PostHogWebhookPayload,
} from './posthog-types';

export type PostHogEventHandler<T extends PostHogEventName> = (
	event: PostHogEventMap[T],
) => void | Promise<void>;

export interface PostHogWebhookHeaders {
	'x-posthog-signature'?: string;
	'x-posthog-timestamp'?: string;
	'content-type'?: string;
	[key: string]: string | undefined;
}

export interface PostHogWebhookHandlerOptions {
	secret?: string;
}

export interface HandleWebhookResult {
	success: boolean;
	eventType?: PostHogEventName;
	error?: string;
}

export class PostHogWebhookHandler {
	private secret?: string;
	private handlers: Map<PostHogEventName, PostHogEventHandler<PostHogEventName>[]> =
		new Map();

	constructor(options: PostHogWebhookHandlerOptions = {}) {
		this.secret = options.secret;
	}

	on<T extends PostHogEventName>(
		eventName: T,
		handler: PostHogEventHandler<T>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		existingHandlers.push(handler as PostHogEventHandler<PostHogEventName>);
		this.handlers.set(eventName, existingHandlers);
		return this;
	}

	off<T extends PostHogEventName>(
		eventName: T,
		handler: PostHogEventHandler<T>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		const index = existingHandlers.indexOf(
			handler as PostHogEventHandler<PostHogEventName>,
		);
		if (index !== -1) {
			existingHandlers.splice(index, 1);
			this.handlers.set(eventName, existingHandlers);
		}
		return this;
	}

	verifySignature(
		payload: string,
		signature: string,
		timestamp?: string,
	): boolean {
		if (!this.secret) {
			return true; // Skip verification if no secret is configured
		}

		if (!signature) {
			return false;
		}

		// PostHog uses SHA-256 HMAC with the secret
		// The signature format may vary, but typically it's just the hash
		const expectedSignature = crypto
			.createHmac('sha256', this.secret)
			.update(payload)
			.digest('hex');

		// PostHog may send signature with or without prefix
		const receivedHash = signature.replace(/^sha256=/, '');

		try {
			return crypto.timingSafeEqual(
				Buffer.from(expectedSignature),
				Buffer.from(receivedHash),
			);
		} catch {
			return false;
		}
	}

	async handleWebhook(
		headers: PostHogWebhookHeaders,
		payload: string | PostHogWebhookPayload | PostHogWebhookPayload[],
	): Promise<HandleWebhookResult> {
		const payloadString =
			typeof payload === 'string' ? payload : JSON.stringify(payload);

		// PostHog can send single events or arrays of events
		let events: PostHogWebhookPayload[];
		if (typeof payload === 'string') {
			try {
				const parsed = JSON.parse(payload);
				events = Array.isArray(parsed) ? parsed : [parsed];
			} catch {
				return {
					success: false,
					error: 'Invalid JSON payload',
				};
			}
		} else if (Array.isArray(payload)) {
			events = payload;
		} else {
			events = [payload];
		}

		// Verify signature if secret is configured
		if (this.secret) {
			const signature = headers['x-posthog-signature'];
			const timestamp = headers['x-posthog-timestamp'];

			if (!signature) {
				return {
					success: false,
					error: 'Missing signature header',
				};
			}

			const isValid = this.verifySignature(payloadString, signature, timestamp);
			if (!isValid) {
				return {
					success: false,
					error: 'Invalid signature',
				};
			}
		}

		// Process each event
		for (const event of events) {
			// PostHog webhooks typically represent captured events
			const eventType: PostHogEventName = 'event.captured';
			const handlers = this.handlers.get(eventType) || [];

			try {
				for (const handler of handlers) {
					await handler(event as any);
				}
			} catch (error) {
				return {
					success: false,
					eventType: eventType,
					error:
						error instanceof Error
							? error.message
							: 'Handler execution failed',
				};
			}
		}

		return {
			success: true,
			eventType: 'event.captured',
		};
	}

	getRegisteredEvents(): PostHogEventName[] {
		return Array.from(this.handlers.keys());
	}

	hasHandlers(eventName: PostHogEventName): boolean {
		const handlers = this.handlers.get(eventName);
		return !!handlers && handlers.length > 0;
	}

	clearHandlers(eventName?: PostHogEventName): this {
		if (eventName) {
			this.handlers.delete(eventName);
		} else {
			this.handlers.clear();
		}
		return this;
	}
}

export function createWebhookHandler(
	options?: PostHogWebhookHandlerOptions,
): PostHogWebhookHandler {
	return new PostHogWebhookHandler(options);
}

