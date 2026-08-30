import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CastingwordsAPIError extends Error {
	public readonly status?: number;
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

export const CASTINGWORDS_API_BASE = 'https://castingwords.com/store/API4';

type FormValue = string | number | boolean | string[] | undefined;

type RequestOptions = {
	method?: 'GET' | 'POST';
	query?: Record<string, string | number | boolean | undefined>;
	form?: Record<string, FormValue>;
};

export function toFormBody(fields: Record<string, FormValue>): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(fields)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const item of value) params.append(key, item);
			continue;
		}
		params.append(key, String(value));
	}
	return params.toString();
}

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
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const formBody = options.form
		? toFormBody({ api_key: apiKey, ...options.form })
		: undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query: method === 'GET' ? { api_key: apiKey, ...options.query } : undefined,
		body: formBody,
		mediaType: formBody ? 'application/x-www-form-urlencoded' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CastingwordsAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new CastingwordsAPIError(error.message, { cause: error });
		}
		throw new CastingwordsAPIError('Unknown CastingWords API error');
	}
}
