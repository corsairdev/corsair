import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { z } from 'zod';

const BASE = 'https://core.callpage.io';

const CALLPAGE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

type CallPageQueryValue =
	| string
	| number
	| boolean
	| number[]
	| string[]
	| undefined;

type CallPageEnvelope = {
	hasError?: boolean;
	errorCode?: string | number;
	message?: string;
	// Safe: the payload is parsed with the endpoint's zod schema before it is returned.
	// A narrower type is not practical because the payload shape differs per endpoint.
	data?: unknown;
};

export class CallPageAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;
	public readonly method?: string;

	constructor(
		message: string,
		public readonly code?: string | number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'CallPageAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.retryAfter = options.cause.retryAfter;
			this.method = options.cause.request.method;
		}
	}
}

// Safe: the caller parses the result with the endpoint's schema instead of casting it.
// A narrower type is not practical because the payload shape differs per endpoint.
function unwrapCallPagePayload(response: CallPageEnvelope): unknown {
	if (
		response &&
		typeof response === 'object' &&
		'data' in response &&
		('hasError' in response || 'errorCode' in response || 'message' in response)
	) {
		return response.data;
	}
	return response;
}

// CallPage is a PHP backend: repeated `ids=1&ids=2` keeps only the last value,
// so array filters must be sent as `ids[]=1&ids[]=2`.
function toPhpQuery(
	query: Record<string, CallPageQueryValue>,
): Record<string, CallPageQueryValue> {
	return Object.fromEntries(
		Object.entries(query).map(([key, value]) =>
			Array.isArray(value) ? [`${key}[]`, value] : [key, value],
		),
	);
}

export async function makeCallPageRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
		// Safe: the transport only serializes the body to JSON and never reads it.
		// A narrower type is not practical because bodies are validated inputs of many shapes.
		body?: unknown;
		query?: Record<string, CallPageQueryValue>;
		schema: z.ZodType<T>;
		unwrap?: boolean;
	},
): Promise<T> {
	const { method = 'GET', body, query, schema, unwrap = true } = options;
	const config: OpenAPIConfig = {
		BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: apiKey,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PATCH' ? body : undefined,
		mediaType: 'application/json',
		query: query && toPhpQuery(query),
	};

	try {
		const response = await request<CallPageEnvelope>(config, requestOptions, {
			rateLimitConfig:
				method === 'GET'
					? CALLPAGE_RATE_LIMIT_CONFIG
					: { ...CALLPAGE_RATE_LIMIT_CONFIG, maxRetries: 0 },
		});

		if (response.hasError) {
			throw new CallPageAPIError(
				response.message || 'CallPage API request failed',
				response.errorCode,
			);
		}

		const payload = unwrap ? unwrapCallPagePayload(response) : response;
		return schema.parse(payload);
	} catch (error) {
		if (error instanceof CallPageAPIError) throw error;
		if (error instanceof ApiError) {
			throw new CallPageAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new CallPageAPIError(error.message);
		}
		throw new CallPageAPIError('Unknown CallPage API error');
	}
}
