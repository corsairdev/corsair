import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { YouSearchRequest } from './endpoints/types';

export class YoucomAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'YoucomAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const YOUCOM_API_BASE = 'https://ydc-index.io';

const YOUCOM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

function shouldUsePost(input: YouSearchRequest): boolean {
	return (
		(input.include_domains?.length ?? 0) > 0 ||
		(input.exclude_domains?.length ?? 0) > 0 ||
		(input.boost_domains?.length ?? 0) > 0
	);
}

function buildSearchPayload(input: YouSearchRequest): Record<string, unknown> {
	const payload: Record<string, unknown> = {
		query: input.query,
	};

	if (input.count !== undefined) payload.count = input.count;
	if (input.freshness !== undefined) payload.freshness = input.freshness;
	if (input.offset !== undefined) payload.offset = input.offset;
	if (input.country !== undefined) payload.country = input.country;
	if (input.language !== undefined) payload.language = input.language;
	if (input.safesearch !== undefined) payload.safesearch = input.safesearch;
	if (input.livecrawl !== undefined) payload.livecrawl = input.livecrawl;
	if (input.livecrawl_formats !== undefined) {
		payload.livecrawl_formats = input.livecrawl_formats;
	}
	if (input.crawl_timeout !== undefined) {
		payload.crawl_timeout = input.crawl_timeout;
	}
	if (input.include_domains !== undefined) {
		payload.include_domains = input.include_domains;
	}
	if (input.exclude_domains !== undefined) {
		payload.exclude_domains = input.exclude_domains;
	}
	if (input.boost_domains !== undefined) {
		payload.boost_domains = input.boost_domains;
	}

	return payload;
}

function buildGetQuery(
	input: YouSearchRequest,
): Record<string, string | number | string[] | undefined> {
	const query: Record<string, string | number | string[] | undefined> = {
		query: input.query,
	};

	if (input.count !== undefined) query.count = input.count;
	if (input.freshness !== undefined) query.freshness = input.freshness;
	if (input.offset !== undefined) query.offset = input.offset;
	if (input.country !== undefined) query.country = input.country;
	if (input.language !== undefined) query.language = input.language;
	if (input.safesearch !== undefined) query.safesearch = input.safesearch;
	if (input.livecrawl !== undefined) query.livecrawl = input.livecrawl;
	if (input.livecrawl_formats !== undefined) {
		query.livecrawl_formats = input.livecrawl_formats;
	}
	if (input.crawl_timeout !== undefined) {
		query.crawl_timeout = input.crawl_timeout;
	}

	return query;
}

export async function makeYoucomRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | string[] | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: YOUCOM_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			...(isWrite ? { 'Content-Type': 'application/json' } : {}),
			'X-API-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: YOUCOM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new YoucomAPIError(error.message, String(error.status), {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new YoucomAPIError(error.message, undefined, { cause: error });
		}
		throw new YoucomAPIError('Unknown error');
	}
}

export async function makeYoucomSearchRequest<T>(
	apiKey: string,
	input: YouSearchRequest,
): Promise<T> {
	if (shouldUsePost(input)) {
		return makeYoucomRequest<T>('/v1/search', apiKey, {
			method: 'POST',
			body: buildSearchPayload(input),
		});
	}

	return makeYoucomRequest<T>('/v1/search', apiKey, {
		method: 'GET',
		query: buildGetQuery(input),
	});
}
