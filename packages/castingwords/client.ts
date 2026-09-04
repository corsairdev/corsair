import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CastingwordsAPIError extends Error {
	public readonly status?: number;
	// API error bodies vary by endpoint; unknown forces callers to narrow before use.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'CastingwordsAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/** Official Store API v4: https://castingwords.com/docs/developer/SimpleAPI.html */
export const CASTINGWORDS_API_BASE = 'https://castingwords.com/store/API4';

type JsonValue = string | number | boolean | string[] | undefined;

type RequestOptions = {
	method?: 'GET' | 'POST';
	query?: Record<string, string | number | boolean | undefined>;
	body?: Record<string, JsonValue>;
};

export async function makeCastingwordsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: RequestOptions = {},
): Promise<T> {
	const method = options.method ?? 'GET';
	const config: OpenAPIConfig = {
		BASE: CASTINGWORDS_API_BASE,
		VERSION: '4.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: { Accept: 'application/json' },
	};

	const jsonBody =
		method === 'POST' ? { api_key: apiKey, ...options.body } : undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query: method === 'GET' ? { api_key: apiKey, ...options.query } : undefined,
		body: jsonBody,
		mediaType: jsonBody ? 'application/json' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		return handleRequestError(error);
	}
}

// Catch values are untyped at runtime; unknown forces narrowing to ApiError/Error
// before rethrowing as CastingwordsAPIError.
function handleRequestError(error: unknown): never {
	if (error instanceof ApiError) {
		throw new CastingwordsAPIError(error.message, { cause: error });
	}
	if (error instanceof Error) {
		throw new CastingwordsAPIError(error.message, { cause: error });
	}
	throw new CastingwordsAPIError('Unknown CastingWords API error');
}
