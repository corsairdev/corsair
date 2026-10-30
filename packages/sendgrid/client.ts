import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class SendGridAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly body?: unknown,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'SendGridAPIError';
	}
}

const SENDGRID_API_BASE = 'https://api.sendgrid.com/v3';

/** Parse Retry-After on 429; do not retry here. Endpoint policy owns retries. */
const SENDGRID_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeSendGridRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		responseHeader?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, responseHeader } = options;
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

	const config: OpenAPIConfig = {
		BASE: SENDGRID_API_BASE,
		VERSION: 'v3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: cleanEndpoint,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query:
			method === 'GET' || method === 'DELETE' || method === 'PATCH'
				? query
				: undefined,
		responseHeader,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: SENDGRID_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const bodyObj =
				typeof error.body === 'object' && error.body !== null
					? (error.body as Record<string, unknown>)
					: undefined;
			const firstError =
				Array.isArray(bodyObj?.errors) &&
				typeof bodyObj.errors[0] === 'object' &&
				bodyObj.errors[0] !== null
					? (bodyObj.errors[0] as Record<string, unknown>)
					: undefined;
			const msg =
				typeof firstError?.message === 'string'
					? firstError.message
					: error.message;
			throw new SendGridAPIError(
				msg,
				typeof firstError?.field === 'string' ? firstError.field : undefined,
				error.status,
				error.body,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new SendGridAPIError(error.message);
		}
		throw new SendGridAPIError('Unknown error');
	}
}
