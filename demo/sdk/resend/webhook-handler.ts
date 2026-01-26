import * as crypto from 'crypto';
import type {
	ResendEventMap,
	ResendEventName,
	ResendWebhookPayload,
} from './webhooks';

export type ResendEventHandler<T extends ResendEventName> = (
	event: ResendEventMap[T],
) => void | Promise<void>;

export interface ResendWebhookHeaders {
	'resend-signature'?: string;
	'content-type'?: string;
	[key: string]: string | undefined;
}

export interface ResendWebhookHandlerOptions {
	secret?: string;
}

export interface HandleWebhookResult {
	success: boolean;
	eventType?: ResendEventName;
	error?: string;
}

export class ResendWebhookHandler {
	private secret?: string;
	private handlers: Map<ResendEventName, ResendEventHandler<ResendEventName>[]> =
		new Map();

	constructor(options: ResendWebhookHandlerOptions = {}) {
		this.secret = options.secret;
	}

	on<T extends ResendEventName>(
		eventName: T,
		handler: ResendEventHandler<T>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		existingHandlers.push(handler as ResendEventHandler<ResendEventName>);
		this.handlers.set(eventName, existingHandlers);
		return this;
	}

	off<T extends ResendEventName>(
		eventName: T,
		handler: ResendEventHandler<T>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		const index = existingHandlers.indexOf(
			handler as ResendEventHandler<ResendEventName>,
		);
		if (index !== -1) {
			existingHandlers.splice(index, 1);
			this.handlers.set(eventName, existingHandlers);
		}
		return this;
	}

	verifySignature(payload: string, signature: string): boolean {
		if (!this.secret) {
			return true;
		}

		if (!signature) {
			return false;
		}

		const expectedSignature = crypto
			.createHmac('sha256', this.secret)
			.update(payload)
			.digest('hex');

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
		headers: ResendWebhookHeaders,
		payload: string | ResendWebhookPayload,
	): Promise<HandleWebhookResult> {
		const payloadString =
			typeof payload === 'string' ? payload : JSON.stringify(payload);

		const parsedPayload: ResendWebhookPayload =
			typeof payload === 'string' ? JSON.parse(payload) : payload;

		if (this.secret) {
			const signature = headers['resend-signature'];

			if (!signature) {
				return {
					success: false,
					error: 'Missing signature header',
				};
			}

			const isValid = this.verifySignature(payloadString, signature);
			if (!isValid) {
				return {
					success: false,
					error: 'Invalid signature',
				};
			}
		}

		const eventType = parsedPayload.type as ResendEventName;
		const handlers = this.handlers.get(eventType) || [];

		try {
			for (const handler of handlers) {
				await handler(parsedPayload as any);
			}

			return {
				success: true,
				eventType: eventType,
			};
		} catch (error) {
			return {
				success: false,
				eventType: eventType,
				error:
					error instanceof Error ? error.message : 'Handler execution failed',
			};
		}
	}

	getRegisteredEvents(): ResendEventName[] {
		return Array.from(this.handlers.keys());
	}

	hasHandlers(eventName: ResendEventName): boolean {
		const handlers = this.handlers.get(eventName);
		return !!handlers && handlers.length > 0;
	}

	clearHandlers(eventName?: ResendEventName): this {
		if (eventName) {
			this.handlers.delete(eventName);
		} else {
			this.handlers.clear();
		}
		return this;
	}
}

export function createWebhookHandler(
	options?: ResendWebhookHandlerOptions,
): ResendWebhookHandler {
	return new ResendWebhookHandler(options);
}
