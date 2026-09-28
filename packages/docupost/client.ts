import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { z } from 'zod';
import { z as zod } from 'zod';

export class DocupostAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DocupostAPIError';
	}
}

const DOCUPOST_API_BASE = 'https://app.docupost.com/api/1.1/wf';

const DOCUPOST_GET_RATE_LIMIT: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

const DOCUPOST_WRITE_RATE_LIMIT: RateLimitConfig = {
	...DOCUPOST_GET_RATE_LIMIT,
	enabled: false,
	maxRetries: 0,
};

const DefaultDocupostResponseSchema = zod.record(
	zod.string(),
	// unknown is necessary because Docupost workflow responses carry varying result keys; a closed value union is infeasible because the provider does not publish a stable response catalog
	zod.unknown(),
);

export async function makeDocupostRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown is necessary because write bodies are operation-specific JSON bags; a closed union is infeasible because the transport is shared across endpoints
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		outputSchema?: z.ZodType<T>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query = {}, outputSchema } = options;

	const config: OpenAPIConfig = {
		BASE: DOCUPOST_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
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
		query: {
			api_token: apiKey,
			...query,
		},
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig:
				method === 'GET' ? DOCUPOST_GET_RATE_LIMIT : DOCUPOST_WRITE_RATE_LIMIT,
		});
		const schema = outputSchema ?? DefaultDocupostResponseSchema;
		const parsed = schema.safeParse(response);
		if (!parsed.success) {
			throw new DocupostAPIError(
				`Docupost response failed schema validation: ${parsed.error.message}`,
			);
		}
		return parsed.data as T;
	} catch (error) {
		if (error instanceof DocupostAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new DocupostAPIError(error.message);
		}
		throw new DocupostAPIError('Unknown error');
	}
}
