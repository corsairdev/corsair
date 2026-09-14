import type { ApiRequestOptions } from 'corsair/http';
import { ApiError } from 'corsair/http';

const ZENSERP_API_BASE = 'https://app.zenserp.com/';
const REQUEST_TIMEOUT_MS = 45_000;

export type ZenserpQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

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
	const text = await response.text();
	if (!text.trim()) return undefined;
	const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
	if (contentType.includes('json')) {
		try {
			return JSON.parse(text);
		} catch {
			return text;
		}
	}
	return text;
}

export async function makeZenserpRequest<T>(
	endpoint: string,
	apiKey: string,
	query: ZenserpQuery = {},
): Promise<T> {
	const normalizedKey = apiKey.trim();
	if (!normalizedKey) throw new Error('Zenserp API key is required');

	const url = new URL(endpoint.replace(/^\/+/, ''), ZENSERP_API_BASE);
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const item of value) url.searchParams.append(key, item);
		} else {
			url.searchParams.set(key, String(value));
		}
	}

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: `${url.pathname}${url.search}`,
		query,
	};
	const response = await fetch(url, {
		method: 'GET',
		headers: { Accept: 'application/json', apikey: normalizedKey },
		redirect: 'error',
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});
	const body = await responseBody(response);

	if (!response.ok) {
		const providerMessage =
			typeof body === 'object' && body !== null && 'error' in body
				? String((body as { error: unknown }).error)
				: response.statusText || `Zenserp request failed (${response.status})`;
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
