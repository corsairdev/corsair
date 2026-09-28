import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { z } from 'zod';
import { z as zod } from 'zod';

export class FlutterwaveAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'FlutterwaveAPIError';
	}
}

const FLUTTERWAVE_API_BASE = 'https://api.flutterwave.com/v3';

const FLUTTERWAVE_GET_RATE_LIMIT: RateLimitConfig = {
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

const FLUTTERWAVE_WRITE_RATE_LIMIT: RateLimitConfig = {
	...FLUTTERWAVE_GET_RATE_LIMIT,
	enabled: false,
	maxRetries: 0,
};

const DefaultFlutterwaveEnvelopeSchema = zod
	.object({
		status: zod.string(),
		message: zod.string().optional(),
		// unknown is necessary because Flutterwave meta keys vary by product; a closed key union is infeasible because v3 does not publish a stable meta catalog
		meta: zod.record(zod.string(), zod.unknown()).optional(),
		// unknown is necessary because fallback envelopes are used only when a route schema is omitted; a closed data union is infeasible because transport is shared across 53 operations
		data: zod.unknown().optional(),
	})
	.loose();

export async function makeFlutterwaveRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown is necessary because write bodies are operation-specific JSON bags; a closed union of 53 payload shapes is infeasible because the transport is shared
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		outputSchema?: z.ZodType<T>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, outputSchema } = options;

	const config: OpenAPIConfig = {
		BASE: FLUTTERWAVE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		query,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig:
				method === 'GET'
					? FLUTTERWAVE_GET_RATE_LIMIT
					: FLUTTERWAVE_WRITE_RATE_LIMIT,
		});
		const schema =
			outputSchema ?? (DefaultFlutterwaveEnvelopeSchema as z.ZodType<T>);
		const parsed = schema.safeParse(response);
		if (!parsed.success) {
			throw new FlutterwaveAPIError(
				`Flutterwave response failed schema validation: ${parsed.error.message}`,
			);
		}
		return parsed.data;
	} catch (error) {
		if (error instanceof FlutterwaveAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new FlutterwaveAPIError(error.message);
		}
		throw new FlutterwaveAPIError('Unknown error');
	}
}
