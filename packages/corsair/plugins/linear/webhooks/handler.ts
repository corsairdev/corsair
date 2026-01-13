import { BaseWebhookHandler } from '../../../core/webhook-handler';
import { verifyHmacSignature } from '../../../core/webhook-utils';
import type {
	LinearEventMap,
	LinearEventName,
	LinearWebhookEvent,
} from './types';

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

export class LinearWebhookHandler extends BaseWebhookHandler<
	LinearEventName,
	LinearEventMap[LinearEventName]
> {
	private webhookSecret?: string;

	constructor(options: LinearWebhookHandlerOptions = {}) {
		super();
		this.webhookSecret = options.webhookSecret;
	}

	on<T extends LinearEventName>(
		eventName: T,
		handler: LinearEventHandler<T>,
	): this {
		return super.on(eventName, handler as any) as this;
	}

	off<T extends LinearEventName>(
		eventName: T,
		handler: LinearEventHandler<T>,
	): this {
		return super.off(eventName, handler as any) as this;
	}

	verifySignature(payload: string, signature: string): boolean {
		if (!this.webhookSecret) {
			return true;
		}

		return verifyHmacSignature(payload, this.webhookSecret, signature);
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
}

export function createWebhookHandler(
	options?: LinearWebhookHandlerOptions,
): LinearWebhookHandler {
	return new LinearWebhookHandler(options);
}

