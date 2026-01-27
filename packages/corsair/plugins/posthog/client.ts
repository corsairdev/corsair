import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import { request } from '../../async-core/request';
import { BaseWebhookHandler } from '../../async-core/webhook-handler';
import { verifyHmacSignature } from '../../async-core/webhook-utils';
import type {
	PostHogEventMap,
	PostHogEventName,
	PostHogWebhookPayload,
} from './webhooks/types';

export class PostHogAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'PostHogAPIError';
	}
}

const POSTHOG_API_BASE = 'https://app.posthog.com';

export async function makePostHogRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'POST', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: POSTHOG_API_BASE,
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
			throw new PostHogAPIError(error.message);
		}
		throw new PostHogAPIError('Unknown error');
	}
}

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

export class PostHogWebhookHandler extends BaseWebhookHandler<
	PostHogEventName,
	PostHogEventMap[PostHogEventName]
> {
	private secret?: string;

	constructor(options: PostHogWebhookHandlerOptions = {}) {
		super();
		this.secret = options.secret;
	}

	on<T extends PostHogEventName>(
		eventName: T,
		handler: PostHogEventHandler<T>,
	): this {
		return super.on(eventName, handler as any) as this;
	}

	off<T extends PostHogEventName>(
		eventName: T,
		handler: PostHogEventHandler<T>,
	): this {
		return super.off(eventName, handler as any) as this;
	}

	verifySignature(
		payload: string,
		signature: string,
		timestamp?: string,
	): boolean {
		if (!this.secret) {
			return true;
		}

		return verifyHmacSignature(payload, this.secret, signature);
	}

	async handleWebhook(
		headers: PostHogWebhookHeaders,
		payload: string | PostHogWebhookPayload | PostHogWebhookPayload[],
	): Promise<HandleWebhookResult> {
		const payloadString =
			typeof payload === 'string' ? payload : JSON.stringify(payload);

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

		for (const event of events) {
			const eventType: PostHogEventName = 'event.captured';
			try {
				await this.executeHandlers(eventType, event as any);
			} catch (error) {
				return {
					success: false,
					eventType: eventType,
					error:
						error instanceof Error ? error.message : 'Handler execution failed',
				};
			}
		}

		return {
			success: true,
			eventType: 'event.captured',
		};
	}
}

export function createWebhookHandler(
	options?: PostHogWebhookHandlerOptions,
): PostHogWebhookHandler {
	return new PostHogWebhookHandler(options);
}
