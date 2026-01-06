/**
 * Base webhook handler for plugin webhook processing
 * Provides common functionality for signature verification, event handling, and payload processing
 */

/**
 * Base webhook handler result
 */
export interface BaseHandleWebhookResult {
	success: boolean;
	eventType?: string;
	error?: string;
	challenge?: string;
}

/**
 * Base webhook handler options
 */
export interface BaseWebhookHandlerOptions {
	/**
	 * Secret for signature verification (optional)
	 * If not provided, signature verification will be skipped
	 */
	secret?: string;
}

/**
 * Base webhook headers interface
 */
export interface BaseWebhookHeaders {
	[key: string]: string | undefined;
}

/**
 * Signature verification function type
 */
export type SignatureVerifier = (
	payload: string | Buffer,
	signature: string,
	headers?: BaseWebhookHeaders,
) => boolean;

/**
 * Event name extractor function type
 * Extracts the event name from headers and/or payload
 */
export type EventNameExtractor = (
	headers: BaseWebhookHeaders,
	payload: unknown,
) => string | undefined;

/**
 * Payload parser function type
 * Parses the raw payload into a structured format
 */
export type PayloadParser<T = unknown> = (
	payload: string | unknown,
) => T;

/**
 * Base webhook handler configuration
 */
export interface BaseWebhookHandlerConfig<
	TEventName extends string = string,
	TEventPayload = unknown,
> {
	/**
	 * Secret for signature verification
	 */
	secret?: string;
	/**
	 * Function to verify webhook signature
	 */
	verifySignature?: SignatureVerifier;
	/**
	 * Function to extract event name from headers/payload
	 */
	extractEventName: EventNameExtractor;
	/**
	 * Function to parse payload
	 */
	parsePayload?: PayloadParser<TEventPayload>;
}

/**
 * Event handler function type
 */
export type BaseEventHandler<TEventPayload = unknown> = (
	payload: TEventPayload,
) => void | Promise<void>;

/**
 * Base webhook handler class
 * Plugins can extend this class to implement their specific webhook handling
 */
export class BaseWebhookHandler<
	TEventName extends string = string,
	TEventPayload = unknown,
> {
	protected secret?: string;
	protected handlers: Map<TEventName, BaseEventHandler<TEventPayload>[]> =
		new Map();
	protected verifySignatureFn?: SignatureVerifier;
	protected extractEventNameFn: EventNameExtractor;
	protected parsePayloadFn?: PayloadParser<TEventPayload>;

	constructor(config: BaseWebhookHandlerConfig<TEventName, TEventPayload>) {
		this.secret = config.secret;
		this.verifySignatureFn = config.verifySignature;
		this.extractEventNameFn = config.extractEventName;
		this.parsePayloadFn = config.parsePayload;
	}

	/**
	 * Register an event handler
	 */
	on(eventName: TEventName, handler: BaseEventHandler<TEventPayload>): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		existingHandlers.push(handler);
		this.handlers.set(eventName, existingHandlers);
		return this;
	}

	/**
	 * Unregister an event handler
	 */
	off(eventName: TEventName, handler: BaseEventHandler<TEventPayload>): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		const index = existingHandlers.indexOf(handler);
		if (index !== -1) {
			existingHandlers.splice(index, 1);
			this.handlers.set(eventName, existingHandlers);
		}
		return this;
	}

	/**
	 * Verify webhook signature
	 * Override this method in subclasses for custom verification logic
	 */
	protected verifySignature(
		payload: string | Buffer,
		signature: string,
		headers?: BaseWebhookHeaders,
	): boolean {
		if (!this.secret) {
			// If no secret is configured, skip verification
			return true;
		}

		if (!this.verifySignatureFn) {
			// If no custom verifier, default to always returning true when secret exists
			// Subclasses should override this or provide verifySignatureFn
			return true;
		}

		return this.verifySignatureFn(payload, signature, headers);
	}

	/**
	 * Extract event name from headers and payload
	 */
	protected extractEventName(
		headers: BaseWebhookHeaders,
		payload: unknown,
	): TEventName | undefined {
		const eventName = this.extractEventNameFn(headers, payload);
		return eventName as TEventName | undefined;
	}

	/**
	 * Parse payload
	 */
	protected parsePayload(payload: string | unknown): TEventPayload {
		if (this.parsePayloadFn) {
			return this.parsePayloadFn(payload);
		}

		// Default: parse JSON if string, otherwise return as-is
		if (typeof payload === 'string') {
			try {
				return JSON.parse(payload) as TEventPayload;
			} catch {
				return payload as TEventPayload;
			}
		}

		return payload as TEventPayload;
	}

	/**
	 * Handle incoming webhook
	 * This is the main entry point for processing webhooks
	 */
	async handleWebhook(
		headers: BaseWebhookHeaders,
		payload: string | unknown,
	): Promise<BaseHandleWebhookResult> {
		const payloadString =
			typeof payload === 'string' ? payload : JSON.stringify(payload);

		// Extract event name
		const eventName = this.extractEventName(headers, payload);
		if (!eventName) {
			return {
				success: false,
				error: 'Could not extract event name from webhook',
			};
		}

		// Verify signature if secret is configured
		if (this.secret) {
			const signature = this.getSignatureFromHeaders(headers);
			if (!signature) {
				return {
					success: false,
					error: 'Missing signature header',
				};
			}

			const isValid = this.verifySignature(
				payloadString,
				signature,
				headers,
			);
			if (!isValid) {
				return {
					success: false,
					error: 'Invalid signature',
				};
			}
		}

		// Parse payload
		const parsedPayload = this.parsePayload(payload);

		// Get handlers for this event
		const handlers = this.handlers.get(eventName) || [];

		// Execute handlers
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

	/**
	 * Get signature from headers
	 * Override this in subclasses to extract signature from specific header names
	 */
	protected getSignatureFromHeaders(headers: BaseWebhookHeaders): string | undefined {
		// Default: look for common signature header names
		return (
			headers['x-signature'] ||
			headers['x-hub-signature'] ||
			headers['x-hub-signature-256'] ||
			headers['x-slack-signature'] ||
			headers['linear-signature']
		);
	}

	/**
	 * Get all registered event names
	 */
	getRegisteredEvents(): TEventName[] {
		return Array.from(this.handlers.keys());
	}

	/**
	 * Clear all handlers for a specific event
	 */
	clear(eventName: TEventName): this {
		this.handlers.delete(eventName);
		return this;
	}

	/**
	 * Clear all handlers
	 */
	clearAll(): this {
		this.handlers.clear();
		return this;
	}
}

/**
 * Common signature verification utilities
 */
export const SignatureVerifiers = {
	/**
	 * HMAC SHA256 signature verification (used by GitHub, etc.)
	 */
	hmacSha256(secret: string): SignatureVerifier {
		return (payload: string | Buffer, signature: string) => {
			if (typeof window === 'undefined' && typeof require !== 'undefined') {
				// Node.js environment
				const crypto = require('crypto');
				if (!signature.startsWith('sha256=')) {
					return false;
				}

				const expectedSignature = `sha256=${crypto
					.createHmac('sha256', secret)
					.update(payload)
					.digest('hex')}`;
				return crypto.timingSafeEqual(
					Buffer.from(signature),
					Buffer.from(expectedSignature),
				);
			}
			// Browser environment - would need Web Crypto API implementation
			throw new Error('HMAC SHA256 not implemented for browser environment');
		};
	},

	/**
	 * HMAC SHA1 signature verification (legacy)
	 */
	hmacSha1(secret: string): SignatureVerifier {
		return (payload: string | Buffer, signature: string) => {
			if (typeof window === 'undefined' && typeof require !== 'undefined') {
				const crypto = require('crypto');
				if (!signature.startsWith('sha1=')) {
					return false;
				}

				const expectedSignature = `sha1=${crypto
					.createHmac('sha1', secret)
					.update(payload)
					.digest('hex')}`;
				return crypto.timingSafeEqual(
					Buffer.from(signature),
					Buffer.from(expectedSignature),
				);
			}
			throw new Error('HMAC SHA1 not implemented for browser environment');
		};
	},
};

