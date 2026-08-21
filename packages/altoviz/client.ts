import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const ALTOVIZ_API_BASE = 'https://api.altoviz.com';

/**
 * Measured live: quota is 100 requests over a rolling window. The 429 carries
 * `Retry-After` in milliseconds (13_000 / 36_000), not HTTP-spec seconds.
 * corsair/http multiplies that value by 1000, so transport-level retries would
 * sleep for hours and would also replay POSTs. maxRetries is 0 here.
 *
 * GET retries happen in `makeAltovizRequest` instead of corsair's bind layer:
 * bind awaits a successful retry then still throws the original error
 * (`packages/corsair/core/endpoints/bind.ts`). This plugin PR cannot change
 * that file.
 */
const ALTOVIZ_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

const GET_RETRY_LIMIT = 3;

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryDelayMs(error: unknown): number | undefined {
	if (error instanceof ApiError && error.status === 429) {
		return error.retryAfter != null ? error.retryAfter / 1000 : 1000;
	}
	return undefined;
}

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

	const retrySafe = method === 'GET';
	let lastError: unknown;
	for (let attempt = 1; attempt <= GET_RETRY_LIMIT + 1; attempt++) {
		try {
			return await request<T>(config, requestOptions, {
				rateLimitConfig: ALTOVIZ_RATE_LIMIT_CONFIG,
			});
		} catch (error) {
			lastError = error;
			const delay = retrySafe ? getRetryDelayMs(error) : undefined;
			if (delay == null || attempt > GET_RETRY_LIMIT) break;
			await sleep(delay);
		}
	}

	if (lastError instanceof Error) {
		const status = (lastError as { status?: number }).status;
		const body = (lastError as { body?: unknown }).body;
		throw new AltovizAPIError(lastError.message, {
			cause: lastError,
			status,
			body,
		});
	}
	throw new AltovizAPIError('Unknown error');
}
