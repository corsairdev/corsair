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
export const BESTBUY_MAX_RPS = 5;
export const BESTBUY_MAX_CALLS_PER_DAY = 50_000;
const MIN_INTERVAL_MS = 1000 / BESTBUY_MAX_RPS;

export const BESTBUY_HTTP_RETRIES = 3;

// corsair/http retries skip this file's limiter; we retry 429 here after throttle.
export const BESTBUY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: false,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

type OutboundBucket = {
	gate: Promise<void>;
	nextAt: number;
	utcDay: string;
	callsToday: number;
};

// ponytail: per-key, process-local. Multi-instance 50k/day needs a shared counter.
const outboundByKey = new Map<string, OutboundBucket>();

export function resetBestBuyLimiterForTests(): void {
	outboundByKey.clear();
}

function bucketFor(apiKey: string): OutboundBucket {
	const existing = outboundByKey.get(apiKey);
	if (existing) return existing;
	const created: OutboundBucket = {
		gate: Promise.resolve(),
		nextAt: 0,
		utcDay: '',
		callsToday: 0,
	};
	outboundByKey.set(apiKey, created);
	return created;
}

function claimDailyQuota(bucket: OutboundBucket): void {
	const day = new Date().toISOString().slice(0, 10);
	if (day !== bucket.utcDay) {
		bucket.utcDay = day;
		bucket.callsToday = 0;
	}
	if (bucket.callsToday >= BESTBUY_MAX_CALLS_PER_DAY) {
		throw new BestBuyAPIError(
			'Best Buy daily quota of 50,000 calls reached in this process',
		);
	}
	bucket.callsToday += 1;
}

function throttleOutbound(apiKey: string): Promise<void> {
	const bucket = bucketFor(apiKey);
	const scheduled = bucket.gate.then(async () => {
		claimDailyQuota(bucket);
		const now = Date.now();
		const start = Math.max(now, bucket.nextAt);
		bucket.nextAt = start + MIN_INTERVAL_MS;
		const wait = start - now;
		if (wait > 0) {
			await new Promise((resolve) => setTimeout(resolve, wait));
		}
	});
	bucket.gate = scheduled.catch(() => undefined);
	return scheduled;
}

/** Remix error JSON: `{"errorCode":"403","errorMessage":"..."}`. */
export type BestBuyErrorBody = {
	errorCode?: string;
	errorMessage?: string;
};

function asErrorBody(body: ApiError['body']): BestBuyErrorBody | undefined {
	if (!body || typeof body !== 'object') return undefined;
	const record = body as Record<string, string | number | boolean | null>;
	return {
		errorCode:
			typeof record.errorCode === 'string' ? record.errorCode : undefined,
		errorMessage:
			typeof record.errorMessage === 'string' ? record.errorMessage : undefined,
	};
}

export class BestBuyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: BestBuyErrorBody;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			retryAfter?: number;
			body?: BestBuyErrorBody;
		},
	) {
		super(message, options);
		this.name = 'BestBuyAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.body ?? asErrorBody(options.cause.body);
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

/** GET Remix JSON. Callers must parse the body with the endpoint Zod schema. */
export async function makeBestBuyRequest(
	endpoint: string,
	apiKey: string,
	options: BestBuyRequestOptions = {},
): Promise<Record<string, string | number | boolean | object | null>> {
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

	const key = apiKey.trim();
	let lastError: BestBuyAPIError | undefined;
	for (let attempt = 0; attempt <= BESTBUY_HTTP_RETRIES; attempt++) {
		await throttleOutbound(key);
		try {
			return await request(config, requestOptions, {
				rateLimitConfig: BESTBUY_RATE_LIMIT_CONFIG,
			});
		} catch (error) {
			lastError =
				error instanceof ApiError
					? new BestBuyAPIError(error.message, {
							cause: error,
							body: asErrorBody(error.body),
							retryAfter: error.retryAfter,
						})
					: error instanceof Error
						? new BestBuyAPIError(error.message, { cause: error })
						: new BestBuyAPIError('Unknown error');
			if (lastError.status !== 429 || attempt === BESTBUY_HTTP_RETRIES) {
				throw lastError;
			}
			const wait =
				lastError.retryAfter ??
				BESTBUY_RATE_LIMIT_CONFIG.initialRetryDelay *
					BESTBUY_RATE_LIMIT_CONFIG.backoffMultiplier ** attempt;
			if (wait > 0) {
				await new Promise((resolve) => setTimeout(resolve, wait));
			}
		}
	}
	throw lastError ?? new BestBuyAPIError('Unknown error');
}
