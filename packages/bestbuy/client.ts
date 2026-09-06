import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Official Remix/Developer API host.
 * @see https://bestbuyapis.github.io/api-documentation/
 */
export const BESTBUY_API_BASE = 'https://api.bestbuy.com/v1';

/** 5 calls/sec and 50,000/day per Best Buy developer terms. */
export const BESTBUY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export class BestBuyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		options?: { cause?: Error; retryAfter?: number; body?: unknown },
	) {
		super(message, options);
		this.name = 'BestBuyAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.body ?? options.cause.body;
			this.retryAfter = options.cause.retryAfter ?? options.retryAfter;
		} else {
			this.retryAfter = options?.retryAfter;
			this.body = options?.body;
		}
	}
}

export function compactQuery(
	query: Record<string, string | number | boolean | undefined> | undefined,
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const out: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export type BestBuyRequestOptions = {
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makeBestBuyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BestBuyRequestOptions = {},
): Promise<T> {
	if (!apiKey.trim()) {
		throw new BestBuyAPIError('API key is required for Best Buy API requests');
	}

	const config: OpenAPIConfig = {
		BASE: BESTBUY_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint.startsWith('/') ? endpoint.slice(1) : endpoint,
		query: compactQuery({
			...options.query,
			apiKey: apiKey.trim(),
			format: 'json',
		}),
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: BESTBUY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new BestBuyAPIError(error.message, {
				cause: error,
				body: error.body,
				retryAfter: error.retryAfter,
			});
		}
		if (error instanceof Error) {
			throw new BestBuyAPIError(error.message, { cause: error });
		}
		throw new BestBuyAPIError('Unknown error');
	}
}
