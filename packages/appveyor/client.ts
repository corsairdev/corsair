import { ApiError } from 'corsair/http';

export const APPVEYOR_API_BASE = 'https://ci.appveyor.com/api';

const MAX_RATE_LIMIT_RETRIES = 3;
const REQUEST_TIMEOUT_MS = 30_000;

export type AppVeyorRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	path?: Record<string, string | number>;
	query?: Record<string, string | number | boolean | undefined>;
	body?: unknown;
	responseType?: 'json' | 'text';
};

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Retry-After: delta-seconds or HTTP-date → non-negative delay ms. */
export function parseRetryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;

	const seconds = Number(header);
	if (Number.isFinite(seconds) && seconds >= 0) {
		return seconds * 1000;
	}

	const dateMs = Date.parse(header);
	if (!Number.isFinite(dateMs)) return undefined;

	const delayMs = dateMs - Date.now();
	return delayMs >= 0 ? delayMs : undefined;
}

function encodePath(
	path: Record<string, string | number> | undefined,
): Record<string, string> | undefined {
	if (!path) return undefined;
	return Object.fromEntries(
		Object.entries(path).map(([key, value]) => [
			key,
			encodeURIComponent(String(value)),
		]),
	);
}

function applyPath(
	endpoint: string,
	path?: Record<string, string | number>,
): string {
	const encoded = encodePath(path);
	if (!encoded) return endpoint;
	let out = endpoint;
	for (const [key, value] of Object.entries(encoded)) {
		out = out.replaceAll(`{${key}}`, value);
	}
	return out;
}

function buildUrl(endpoint: string, options: AppVeyorRequestOptions): string {
	const path = applyPath(endpoint, options.path);
	const url = new URL(
		path.startsWith('/') ? path.slice(1) : path,
		`${APPVEYOR_API_BASE}/`,
	);
	if (options.query) {
		for (const [key, value] of Object.entries(options.query)) {
			if (value !== undefined) url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

async function readResponseBody(
	response: Response,
	responseType: 'json' | 'text',
): Promise<unknown> {
	if (response.status === 204) return undefined;

	const contentType = response.headers.get('Content-Type') ?? '';
	if (responseType === 'text' || !contentType.includes('application/json')) {
		return await response.text();
	}

	try {
		return await response.json();
	} catch {
		return undefined;
	}
}

async function executeAppVeyorRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AppVeyorRequestOptions = {},
): Promise<T> {
	const method = options.method ?? 'GET';
	const responseType = options.responseType ?? 'json';
	const url = buildUrl(endpoint, options);
	const requestOptions = {
		method,
		url: endpoint,
		path: encodePath(options.path),
		query: options.query,
		body: method === 'GET' || method === 'DELETE' ? undefined : options.body,
	};

	let lastResponse: Response | undefined;
	let lastBody: unknown;

	for (let attempt = 0; attempt <= MAX_RATE_LIMIT_RETRIES; attempt++) {
		let response: Response;
		try {
			response = await fetch(url, {
				method,
				headers: {
					Accept: responseType === 'text' ? 'text/plain' : 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
				body:
					method === 'GET' || method === 'DELETE'
						? undefined
						: JSON.stringify(options.body),
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
			});
		} catch (error) {
			throw new ApiError(
				requestOptions,
				{
					url,
					ok: false,
					status: 0,
					statusText: 'Network Error',
					body: undefined,
				},
				error instanceof Error ? error.message : 'Unknown network error',
			);
		}

		lastResponse = response;
		lastBody = await readResponseBody(response, responseType);

		if (response.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
			const retryAfter =
				parseRetryAfterMs(response.headers.get('Retry-After')) ?? 1000;
			await sleep(retryAfter);
			continue;
		}

		if (!response.ok) {
			const retryAfter = parseRetryAfterMs(response.headers.get('Retry-After'));
			throw new ApiError(
				requestOptions,
				{
					url,
					ok: false,
					status: response.status,
					statusText: response.statusText,
					body: lastBody,
				},
				`${response.status} ${response.statusText}`.trim(),
				retryAfter !== undefined ? { retryAfter } : undefined,
			);
		}

		return lastBody as T;
	}

	const retryAfter = lastResponse
		? parseRetryAfterMs(lastResponse.headers.get('Retry-After'))
		: undefined;
	throw new ApiError(
		requestOptions,
		{
			url,
			ok: false,
			status: lastResponse?.status ?? 429,
			statusText: lastResponse?.statusText ?? 'Too Many Requests',
			body: lastBody,
		},
		'Too Many Requests',
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

export async function makeAppVeyorRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AppVeyorRequestOptions = {},
): Promise<T> {
	return executeAppVeyorRequest<T>(endpoint, apiKey, options);
}

export async function makeAppVeyorTextRequest(
	endpoint: string,
	apiKey: string,
): Promise<string> {
	return executeAppVeyorRequest<string>(endpoint, apiKey, {
		responseType: 'text',
	});
}
