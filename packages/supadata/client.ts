import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';

/**
 * Supadata returns HTTP 429 with a standard `Retry-After` header once the
 * plan's per-second rate limit is exceeded.
 * https://docs.supadata.ai/api-reference/introduction
 */
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;
const BACKOFF_MULTIPLIER = 2;
const MAX_RETRY_DELAY_MS = 60_000;

const SUPADATA_API_BASE = 'https://api.supadata.ai/v1';
const REQUEST_TIMEOUT_MS = 20_000;

/**
 * Reads `Retry-After`, which may be either a delay in seconds or an HTTP date.
 * The result is capped so a long server-supplied delay cannot stall a run.
 */
export function extractRetryAfterMs(res: Response): number | undefined {
	const retryAfter = res.headers.get('retry-after');
	if (!retryAfter) {
		return undefined;
	}

	let delayMs: number | undefined;

	const seconds = Number(retryAfter);
	if (Number.isInteger(seconds) && seconds >= 0) {
		delayMs = seconds * 1000;
	} else {
		const retryAt = Date.parse(retryAfter);
		if (!Number.isNaN(retryAt)) {
			delayMs = Math.max(0, retryAt - Date.now());
		}
	}

	return delayMs === undefined
		? undefined
		: Math.min(delayMs, MAX_RETRY_DELAY_MS);
}

function numericHeader(res: Response, name: string): number | undefined {
	const raw = res.headers.get(name);
	if (!raw) return undefined;
	const value = Number(raw);
	return Number.isFinite(value) ? value : undefined;
}

function calculateRetryDelay(attempt: number, retryAfterMs?: number): number {
	if (retryAfterMs !== undefined) {
		return retryAfterMs;
	}
	const delay = INITIAL_RETRY_DELAY_MS * BACKOFF_MULTIPLIER ** (attempt - 1);
	return Math.min(delay, MAX_RETRY_DELAY_MS);
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Strips the API key out of a value before it is attached to an error.
 *
 * Supadata echoes the supplied key back in the `details` of a 401 — literally
 * `Invalid API Key: sd_…`. ApiError keeps the response body verbatim, so
 * without this the key would travel into every log line, error report and
 * retry record produced from that failure.
 */
function redactKey<T>(value: T, apiKey: string): T {
	if (!apiKey) return value;
	if (typeof value === 'string') {
		return value.split(apiKey).join('[REDACTED]') as T;
	}
	if (Array.isArray(value)) {
		return value.map((item) => redactKey(item, apiKey)) as T;
	}
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, item]) => [
				key,
				redactKey(item, apiKey),
			]),
		) as T;
	}
	return value;
}

/**
 * Builds the message for a failed request from Supadata's standard error
 * payload (`{ error, message, details, documentationUrl }`), falling back to
 * the status line when the body is empty or not JSON.
 */
function errorMessage(body: unknown, res: Response): string {
	if (body && typeof body === 'object') {
		const record = body as Record<string, unknown>;
		const parts = [record.message, record.details].filter(
			(part): part is string => typeof part === 'string' && part.length > 0,
		);
		if (parts.length > 0) {
			// De-duplicate when `message` and `details` carry the same text.
			return [...new Set(parts)].join(': ');
		}
		if (typeof record.error === 'string' && record.error.length > 0) {
			return record.error;
		}
	}
	if (typeof body === 'string' && body.length > 0) {
		return body;
	}
	return `Supadata API error: ${res.status} ${res.statusText}`;
}

async function parseBody(res: Response): Promise<unknown> {
	if (res.status === 204) return undefined;
	const text = await res.text();
	if (!text) return undefined;
	const contentType = res.headers.get('content-type') ?? '';
	if (!contentType.includes('application/json')) return text;
	try {
		return JSON.parse(text) as unknown;
	} catch {
		return text;
	}
}

export async function makeSupadataRequest(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | string[] | undefined>;
	} = {},
): Promise<unknown> {
	const { method = 'GET', body, query } = options;

	const url = new URL(`${SUPADATA_API_BASE}/${endpoint.replace(/^\//, '')}`);

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) continue;
			if (Array.isArray(value)) {
				for (const item of value) url.searchParams.append(key, item);
			} else {
				url.searchParams.set(key, String(value));
			}
		}
	}

	const requestBody =
		method === 'POST' || method === 'PUT' || method === 'PATCH'
			? JSON.stringify(body ?? {})
			: undefined;

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'x-api-key': apiKey,
	};
	if (requestBody !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	// Headers are deliberately left off the ApiError request record: ApiError
	// redacts the URL and query string but stores headers verbatim, which would
	// put the API key into every thrown error.
	const errorRequest: ApiRequestOptions = {
		method,
		url: url.toString(),
		...(requestBody !== undefined ? { body } : {}),
	};

	const maxAttempts = MAX_RETRIES + 1;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		let res: Response;
		try {
			// redirect: 'error' keeps the x-api-key header from being forwarded to
			// a redirect target. corsair/http's request() wrapper does not expose a
			// redirect option, so fetch() is used directly here — the same approach
			// taken by the vestaboard and castingwords plugins.
			res = await fetch(url, {
				method,
				redirect: 'error',
				headers,
				body: requestBody,
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
			});
		} catch (error) {
			// Network failures, refused redirects and timeouts are not retryable.
			throw error instanceof Error ? error : new Error('Network error');
		}

		if (res.status === 429 && attempt < maxAttempts) {
			await sleep(calculateRetryDelay(attempt, extractRetryAfterMs(res)));
			continue;
		}

		const parsed = await parseBody(res);

		if (!res.ok) {
			const safeBody = redactKey(parsed, apiKey);
			const result: ApiResult = {
				url: url.toString(),
				ok: res.ok,
				status: res.status,
				statusText: res.statusText,
				body: safeBody,
			};
			throw new ApiError(errorRequest, result, errorMessage(safeBody, res), {
				retryAfter: extractRetryAfterMs(res),
				rateLimitReset: numericHeader(res, 'x-ratelimit-reset'),
				rateLimitRemaining: numericHeader(res, 'x-ratelimit-remaining'),
				rateLimitLimit: numericHeader(res, 'x-ratelimit-limit'),
			});
		}

		return parsed;
	}

	// Unreachable: the final attempt either returns or throws above.
	throw new Error('Supadata: exceeded maximum retry attempts');
}
