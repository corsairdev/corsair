import * as crypto from 'crypto';
import type {
	LinearEventMap,
	LinearEventName,
	LinearWebhookEvent,
} from './linear-types';

export type LinearEventHandler<T extends LinearEventName> = (
	event: LinearEventMap[T],
) => void | Promise<void>;

export interface LinearWebhookHeaders {
	'linear-signature'?: string;
	'linear-delivery'?: string;
	[key: string]: string | undefined;
}

export interface LinearWebhookHandlerOptions {
	webhookSecret?: string;
}

export interface HandleWebhookResult {
	success: boolean;
	eventType?: string;
	action?: string;
	error?: string;
}

export class LinearWebhookHandler {
	private webhookSecret?: string;
	private handlers: Map<
		LinearEventName,
		LinearEventHandler<LinearEventName>[]
	> = new Map();

	constructor(options: LinearWebhookHandlerOptions = {}) {
		this.webhookSecret = options.webhookSecret;
	}

	on<T extends LinearEventName>(
		eventName: T,
		handler: LinearEventHandler<T>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		existingHandlers.push(handler as LinearEventHandler<LinearEventName>);
		this.handlers.set(eventName, existingHandlers);
		return this;
	}

	off<T extends LinearEventName>(
		eventName: T,
		handler: LinearEventHandler<T>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		const index = existingHandlers.indexOf(
			handler as LinearEventHandler<LinearEventName>,
		);
		if (index !== -1) {
			existingHandlers.splice(index, 1);
			this.handlers.set(eventName, existingHandlers);
		}
		return this;
	}

	verifySignature(payload: string, signature: string): boolean {
		if (!this.webhookSecret) {
			return true;
		}

		if (!signature) {
			return false;
		}

		const expectedSignature = crypto
			.createHmac('sha256', this.webhookSecret)
			.update(payload)
			.digest('hex');

		try {
			return crypto.timingSafeEqual(
				Buffer.from(signature),
				Buffer.from(expectedSignature),
			);
		} catch {
			return false;
		}
	}

	async handleWebhook(
		headers: LinearWebhookHeaders,
		payload: string | LinearWebhookEvent,
	): Promise<HandleWebhookResult> {
		const payloadString =
			typeof payload === 'string' ? payload : JSON.stringify(payload);

		const parsedPayload: LinearWebhookEvent =
			typeof payload === 'string' ? JSON.parse(payload) : payload;

		if (this.webhookSecret) {
			const signature = headers['linear-signature'];

			if (!signature) {
				return {
					success: false,
					error: 'Missing linear-signature header',
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

		const eventType = parsedPayload.type;
		const action = parsedPayload.action;

		const generalEventName = eventType as LinearEventName;
		const specificEventName =
			`${eventType}${action.charAt(0).toUpperCase() + action.slice(1)}` as LinearEventName;

		const generalHandlers = this.handlers.get(generalEventName) || [];
		const specificHandlers = this.handlers.get(specificEventName) || [];

		const allHandlers = [...generalHandlers, ...specificHandlers];

		try {
			for (const handler of allHandlers) {
				await handler(parsedPayload as any);
			}

			return {
				success: true,
				eventType,
				action,
			};
		} catch (error) {
			return {
				success: false,
				eventType,
				action,
				error:
					error instanceof Error ? error.message : 'Handler execution failed',
			};
		}
	}

	getRegisteredEvents(): LinearEventName[] {
		return Array.from(this.handlers.keys());
	}

	hasHandlers(eventName: LinearEventName): boolean {
		const handlers = this.handlers.get(eventName);
		return !!handlers && handlers.length > 0;
	}

	clearHandlers(eventName?: LinearEventName): this {
		if (eventName) {
			this.handlers.delete(eventName);
		} else {
			this.handlers.clear();
		}
		return this;
	}
}

export function createWebhookHandler(
	options?: LinearWebhookHandlerOptions,
): LinearWebhookHandler {
	return new LinearWebhookHandler(options);
}
