import * as crypto from 'crypto';

export interface HandleWebhookResult {
	success: boolean;
	eventType?: string;
	error?: string;
	[key: string]: any;
}

export interface BaseWebhookHeaders {
	[key: string]: string | undefined;
}

export interface BaseWebhookHandlerOptions {
	secret?: string;
}

export abstract class BaseWebhookHandler<
	TEventName extends string = string,
	TEventPayload = unknown,
	THeaders extends BaseWebhookHeaders = BaseWebhookHeaders,
> {
	protected secret?: string;
	protected handlers: Map<TEventName, ((event: TEventPayload) => void | Promise<void>)[]> =
		new Map();

	constructor(options: BaseWebhookHandlerOptions = {}) {
		this.secret = options.secret;
	}

	on<T extends TEventName>(
		eventName: T,
		handler: (event: TEventPayload) => void | Promise<void>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		existingHandlers.push(handler);
		this.handlers.set(eventName, existingHandlers);
		return this;
	}

	off<T extends TEventName>(
		eventName: T,
		handler: (event: TEventPayload) => void | Promise<void>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		const index = existingHandlers.indexOf(handler);
		if (index !== -1) {
			existingHandlers.splice(index, 1);
			this.handlers.set(eventName, existingHandlers);
		}
		return this;
	}

	protected abstract extractEventName(
		headers: THeaders,
		payload: string | unknown,
	): TEventName | undefined;

	protected abstract parsePayload(payload: string | unknown): TEventPayload;

	protected abstract getSignatureFromHeaders(headers: THeaders): string | undefined;

	protected verifySignature(
		payload: string | Buffer,
		signature: string,
		headers?: THeaders,
	): boolean {
		if (!this.secret) {
			return true;
		}

		if (!signature) {
			return false;
		}

		const payloadBuffer =
			typeof payload === 'string' ? Buffer.from(payload) : payload;

		const expectedSignature = this.computeSignature(payloadBuffer);

		try {
			const receivedSignature = this.normalizeSignature(signature);
			return crypto.timingSafeEqual(
				Buffer.from(expectedSignature),
				Buffer.from(receivedSignature),
			);
		} catch {
			return false;
		}
	}

	protected computeSignature(payload: Buffer): string {
		if (!this.secret) {
			return '';
		}
		return crypto.createHmac('sha256', this.secret).update(payload).digest('hex');
	}

	protected normalizeSignature(signature: string): string {
		return signature.replace(/^(sha256=|sha1=)/, '');
	}

	async handleWebhook(
		headers: THeaders,
		payload: string | unknown,
	): Promise<HandleWebhookResult> {
		const payloadString =
			typeof payload === 'string' ? payload : JSON.stringify(payload);

		const eventName = this.extractEventName(headers, payload);
		if (!eventName) {
			return {
				success: false,
				error: 'Could not extract event name from webhook',
			};
		}

		if (this.secret) {
			const signature = this.getSignatureFromHeaders(headers);
			if (!signature) {
				return {
					success: false,
					error: 'Missing signature header',
				};
			}

			const isValid = this.verifySignature(payloadString, signature, headers);
			if (!isValid) {
				return {
					success: false,
					eventType: eventName,
					error: 'Invalid signature',
				};
			}
		}

		const parsedPayload = this.parsePayload(payload);

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

	getRegisteredEvents(): TEventName[] {
		return Array.from(this.handlers.keys());
	}

	hasHandlers(eventName: TEventName): boolean {
		const handlers = this.handlers.get(eventName);
		return !!handlers && handlers.length > 0;
	}

	clearHandlers(eventName?: TEventName): this {
		if (eventName) {
			this.handlers.delete(eventName);
		} else {
			this.handlers.clear();
		}
		return this;
	}
}

