import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import { request } from '../../async-core/request';
import { BaseWebhookHandler } from '../../async-core/webhook-handler';
import { verifyHmacSignature } from '../../async-core/webhook-utils';
import type {
	ResendEventMap,
	ResendEventName,
	ResendWebhookPayload,
} from './webhooks/types';

export class ResendAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ResendAPIError';
	}
}

const RESEND_API_BASE = 'https://api.resend.com';

export async function makeResendRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: RESEND_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof Error) {
			throw new ResendAPIError(error.message);
		}
		throw new ResendAPIError('Unknown error');
	}
}

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

export class ResendWebhookHandler extends BaseWebhookHandler<
	ResendEventName,
	ResendEventMap[ResendEventName]
> {
	private secret?: string;

	constructor(options: ResendWebhookHandlerOptions = {}) {
		super();
		this.secret = options.secret;
	}

	on<T extends ResendEventName>(
		eventName: T,
		handler: ResendEventHandler<T>,
	): this {
		return super.on(eventName, handler as any) as this;
	}

	off<T extends ResendEventName>(
		eventName: T,
		handler: ResendEventHandler<T>,
	): this {
		return super.off(eventName, handler as any) as this;
	}

	verifySignature(payload: string, signature: string): boolean {
		if (!this.secret) {
			return true;
		}

		return verifyHmacSignature(payload, this.secret, signature);
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
		try {
			await this.executeHandlers(eventType, parsedPayload as any);
		} catch (error) {
			return {
				success: false,
				eventType: eventType,
				error:
					error instanceof Error ? error.message : 'Handler execution failed',
			};
		}

		return {
			success: true,
			eventType: eventType,
		};
	}
}

export function createWebhookHandler(
	options?: ResendWebhookHandlerOptions,
): ResendWebhookHandler {
	return new ResendWebhookHandler(options);
}
