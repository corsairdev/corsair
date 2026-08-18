import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

const ALTOVIZ_API_BASE = 'https://api.altoviz.com';

/**
 * Measured live, twice, minutes apart: the quota is exactly 100 requests over
 * a rolling window, and the 429 that follows carries `Retry-After` in
 * milliseconds — 13,000 on one run, 36,000 on the other, since it reports
 * time left in the *current* window rather than a fixed cooldown. Honouring it
 * produced an immediate 200 both times, so `Retry-After` is authoritative:
 * sleep for exactly what it says rather than doubling on top of it.
 *
 * A success carries no rate-limit header of any kind (no `RateLimit-Limit`,
 * no `RateLimit-Remaining`), so the client cannot throttle proactively — only
 * react once the 429 arrives.
 */
const ALTOVIZ_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export class AltovizAPIError extends Error {
	public readonly status?: number;
	public readonly body?: unknown;

	constructor(
		message: string,
		options?: { cause?: Error; status?: number; body?: unknown },
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'AltovizAPIError';
		this.status = options?.status;
		this.body = options?.body;
	}
}

/**
 * Path ids go through `options.path` and a constant `{id}` template, never
 * concatenated into the URL string. That keeps caller values off the
 * `{(.*?)}` placeholder regex in `corsair/http` (CodeQL js/polynomial-redos).
 */
export type AltovizRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
	path?: Record<string, string | number>;
	/**
	 * For the one multipart operation in the surface (purchase invoice upload).
	 * A plain record — the shared transport builds the actual `FormData` and
	 * accepts string or Blob values per field.
	 */
	formData?: Record<string, unknown>;
};

/**
 * Issues an Altoviz request with the X-API-KEY header, this plugin's rate-limit
 * retry policy, and error handlers.
 *
 * Three routes (the PDF downloads) answer with `application/pdf`, which the
 * shared transport's `getResponseBody` decodes with `response.text()` — lossless
 * for the JSON/text paths every other operation here uses, lossy for those
 * three. That is a `corsair/async-core` limitation flagged in the PR rather
 * than fixed here (see `packages/googledrive`'s `filesDownload` for the same
 * caveat on another plugin), so `download` responses in this plugin type their
 * body as an opaque string and document that it may not be byte-exact.
 */
export async function makeAltovizRequest<T>(
	url: string,
	apiKey: string,
	options: AltovizRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, formData, path } = options;

	const config: OpenAPIConfig = {
		BASE: ALTOVIZ_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		ENCODE_PATH: encodeURIComponent,
		HEADERS: {
			'X-API-KEY': apiKey,
			...(formData ? {} : { 'Content-Type': 'application/json' }),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: url.startsWith('/') ? url : `/${url}`,
		path,
		body: formData ? undefined : body,
		formData,
		mediaType: formData ? undefined : 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: ALTOVIZ_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof Error) {
			const status = (error as { status?: number }).status;
			const body = (error as { body?: unknown }).body;
			throw new AltovizAPIError(error.message, { cause: error, status, body });
		}
		throw new AltovizAPIError('Unknown error');
	}
}
