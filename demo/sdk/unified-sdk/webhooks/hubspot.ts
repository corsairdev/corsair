import * as crypto from 'crypto';
import type {
	HubSpotEventMap,
	HubSpotEventName,
	HubSpotWebhookEvent,
	HubSpotWebhookPayload,
} from './hubspot-types';

export type HubSpotEventHandler<T extends HubSpotEventName> = (
	event: HubSpotEventMap[T],
) => void | Promise<void>;

export interface HubSpotWebhookHeaders {
	'x-hubspot-signature-v2'?: string;
	'x-hubspot-signature-v3'?: string;
	'x-hubspot-request-timestamp'?: string;
	'content-type'?: string;
	[key: string]: string | undefined;
}

export interface HubSpotWebhookHandlerOptions {
	secret?: string;
}

export interface HandleWebhookResult {
	success: boolean;
	eventType?: HubSpotEventName;
	error?: string;
}

export class HubSpotWebhookHandler {
	private secret?: string;
	private handlers: Map<HubSpotEventName, HubSpotEventHandler<HubSpotEventName>[]> =
		new Map();

	constructor(options: HubSpotWebhookHandlerOptions = {}) {
		this.secret = options.secret;
	}

	on<T extends HubSpotEventName>(
		eventName: T,
		handler: HubSpotEventHandler<T>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		existingHandlers.push(handler as HubSpotEventHandler<HubSpotEventName>);
		this.handlers.set(eventName, existingHandlers);
		return this;
	}

	off<T extends HubSpotEventName>(
		eventName: T,
		handler: HubSpotEventHandler<T>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		const index = existingHandlers.indexOf(
			handler as HubSpotEventHandler<HubSpotEventName>,
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

		// HubSpot uses SHA-256 HMAC with the secret
		// The signature format is: sha256=<hash>
		const expectedSignature = crypto
			.createHmac('sha256', this.secret)
			.update(payload)
			.digest('hex');

		// HubSpot sends signature as "sha256=<hash>" or just the hash
		const receivedHash = signature.replace('sha256=', '');

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
		headers: HubSpotWebhookHeaders,
		payload: string | HubSpotWebhookPayload | HubSpotWebhookPayload[],
	): Promise<HandleWebhookResult> {
		const payloadString =
			typeof payload === 'string' ? payload : JSON.stringify(payload);

		// HubSpot can send single events or arrays of events
		let events: HubSpotWebhookPayload[];
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
			const signature =
				headers['x-hubspot-signature-v3'] ||
				headers['x-hubspot-signature-v2'];
			const timestamp = headers['x-hubspot-request-timestamp'];

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
			const eventType = event.subscriptionType as HubSpotEventName;
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
			eventType: events[0]?.subscriptionType as HubSpotEventName,
		};
	}

	getRegisteredEvents(): HubSpotEventName[] {
		return Array.from(this.handlers.keys());
	}

	hasHandlers(eventName: HubSpotEventName): boolean {
		const handlers = this.handlers.get(eventName);
		return !!handlers && handlers.length > 0;
	}

	clearHandlers(eventName?: HubSpotEventName): this {
		if (eventName) {
			this.handlers.delete(eventName);
		} else {
			this.handlers.clear();
		}
		return this;
	}
}

export function createWebhookHandler(
	options?: HubSpotWebhookHandlerOptions,
): HubSpotWebhookHandler {
	return new HubSpotWebhookHandler(options);
}

