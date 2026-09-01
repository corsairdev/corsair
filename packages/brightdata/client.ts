import { AuthMissingError } from 'corsair/core';

export function requireBrightDataKey(key: string | undefined): string {
	if (!key) {
		throw new AuthMissingError('brightdata', 'api_key');
	}
	return key;
}

export class BrightDataAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'BrightDataAPIError';
	}
}

export class BrightDataRateLimitError extends BrightDataAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'BrightDataRateLimitError';
	}
}

const BRIGHTDATA_API_BASE = 'https://api.brightdata.com';
const REQUEST_TIMEOUT_MS = 60_000;

export type BrightDataRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined>;
};

function queryString(
	query?: Record<string, string | number | boolean | undefined>,
): string {
	if (!query) return '';
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) params.set(key, String(value));
	}
	const qs = params.toString();
	return qs ? `?${qs}` : '';
}

function bodyMessage(body: unknown, fallback: string): string {
	if (typeof body === 'string' && body) return body;
	if (body && typeof body === 'object') {
		if ('error' in body) return String((body as { error: unknown }).error);
		if ('message' in body)
			return String((body as { message: unknown }).message);
	}
	return fallback;
}

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

export async function makeBrightDataRequest<T>(
	endpoint: string,
	apiKey: string | undefined,
	options: BrightDataRequestOptions = {},
): Promise<T> {
	const key = requireBrightDataKey(apiKey);
	const { method = 'GET', body, query } = options;
	const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	const url = `${BRIGHTDATA_API_BASE}${path}${queryString(query)}`;
	const headers: Record<string, string> = {
		Accept: 'application/json',
		Authorization: `Bearer ${key}`,
	};
	const hasJsonBody =
		method === 'POST' || method === 'PUT' || method === 'PATCH';
	if (hasJsonBody) headers['Content-Type'] = 'application/json';

	let res: Response;
	try {
		res = await fetch(url, {
			method,
			headers,
			body: hasJsonBody ? JSON.stringify(body) : undefined,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		throw new BrightDataAPIError(
			error instanceof Error ? error.message : 'Bright Data request failed',
		);
	}

	let parsed: unknown;
	try {
		const text = await res.text();
		if (text) {
			try {
				parsed = JSON.parse(text);
			} catch {
				parsed = text;
			}
		}
	} catch (error) {
		if (res.status === 429) {
			throw new BrightDataRateLimitError(
				error instanceof Error ? error.message : 'Too Many Requests',
				retryAfterMs(res),
			);
		}
		throw new BrightDataAPIError(
			error instanceof Error ? error.message : 'Bright Data request failed',
			res.status,
			res.status,
		);
	}

	if (res.status === 429) {
		throw new BrightDataRateLimitError(
			bodyMessage(parsed, 'Too Many Requests'),
			retryAfterMs(res),
			parsed,
		);
	}
	if (!res.ok) {
		throw new BrightDataAPIError(
			bodyMessage(parsed, `Bright Data API error ${res.status}`),
			res.status,
			res.status,
			parsed,
		);
	}
	return parsed as T;
}
