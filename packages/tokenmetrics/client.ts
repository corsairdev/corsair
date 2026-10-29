import type { ApiRequestOptions } from 'corsair/http';
import { ApiError } from 'corsair/http';

const TOKEN_METRICS_API_BASE = 'https://api.tokenmetrics.com/v2/';
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_RATE_LIMIT_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

function retryAfterMs(response: Response): number | undefined {
	const value = response.headers.get('retry-after');
	if (!value) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const date = Date.parse(value);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

// Provider responses vary across endpoints and error bodies, so we return
// unknown and let each endpoint schema narrow the payload.
async function responseBody(response: Response): Promise<unknown> {
	if (response.status === 204) return undefined;
	const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
	const text = await response.text();
	if (!text.trim()) return undefined;
	if (contentType.includes('json')) {
		try {
			return JSON.parse(text);
		} catch {
			return text;
		}
	}
	return text;
}

function calculateRetryDelay(attempt: number, retryAfter?: number): number {
	if (retryAfter !== undefined) return retryAfter;
	return Math.min(INITIAL_RETRY_DELAY_MS * 2 ** (attempt - 1), 60_000);
}

async function sleep(ms: number): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function makeTokenMetricsRequest<T>(
	endpoint: string,
	apiKey: string,
	query: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
	const normalizedKey = apiKey.trim();
	if (!normalizedKey) throw new Error('Token Metrics API key is required');

	const url = new URL(endpoint.replace(/^\/+/, ''), TOKEN_METRICS_API_BASE);
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: `${url.pathname}${url.search}`,
		query,
	};
	let attempt = 0;
	while (true) {
		const response = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/json', api_key: normalizedKey },
			redirect: 'error',
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
		const body = await responseBody(response);

		// Cast is safe: callers immediately Zod-parse `T` (or treat as opaque).
		if (response.ok) return body as T;

		const providerMessage =
			typeof body === 'object' && body !== null && 'message' in body
				? String(body.message)
				: response.statusText ||
					`Token Metrics request failed (${response.status})`;
		const error = new ApiError(
			requestOptions,
			{
				url: url.toString(),
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body,
			},
			providerMessage,
			{ retryAfter: retryAfterMs(response) },
		);

		if (error.status !== 429 || attempt >= MAX_RATE_LIMIT_RETRIES) throw error;

		attempt += 1;
		await sleep(calculateRetryDelay(attempt, error.retryAfter));
	}
}
