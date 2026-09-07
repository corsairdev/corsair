import type { ApiRequestOptions } from 'corsair/http';
import { ApiError } from 'corsair/http';

const TOKEN_METRICS_API_BASE = 'https://api.tokenmetrics.com/v2/';
const REQUEST_TIMEOUT_MS = 20_000;

function retryAfterMs(response: Response): number | undefined {
	const value = response.headers.get('retry-after');
	if (!value) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const date = Date.parse(value);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

async function responseBody(response: Response): Promise<unknown> {
	if (response.status === 204) return undefined;
	const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
	if (contentType.includes('json')) return await response.json();
	return await response.text();
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
	const response = await fetch(url, {
		method: 'GET',
		headers: { Accept: 'application/json', api_key: normalizedKey },
		redirect: 'error',
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});
	const body = await responseBody(response);

	if (!response.ok) {
		const providerMessage =
			typeof body === 'object' && body !== null && 'message' in body
				? String((body as { message: unknown }).message)
				: response.statusText ||
					`Token Metrics request failed (${response.status})`;
		throw new ApiError(
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
	}

	return body as T;
}
