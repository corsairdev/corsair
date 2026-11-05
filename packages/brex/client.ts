export class BrexAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'BrexAPIError';
	}
}

export class BrexRateLimitError extends BrexAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'BrexRateLimitError';
	}
}

/** Official production host: https://developer.brex.com/guides/authentication */
export const BREX_API_BASE = 'https://api.brex.com';
export const BREX_OAUTH_AUTHORIZE_URL =
	'https://accounts-api.brex.com/oauth2/default/v1/authorize';
export const BREX_OAUTH_TOKEN_URL =
	'https://accounts-api.brex.com/oauth2/default/v1/token';
const REQUEST_TIMEOUT_MS = 20_000;

export type BrexRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
};

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

function bodyMessage(body: unknown, fallback: string): string {
	if (typeof body === 'object' && body !== null) {
		const record = body as Record<string, unknown>;
		if (typeof record.message === 'string') return record.message;
		if (typeof record.error === 'string') return record.error;
	}
	return fallback;
}

function buildUrl(
	endpoint: string,
	query?: Record<string, string | number | boolean | undefined>,
): string {
	const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	const url = new URL(`${BREX_API_BASE}${path}`);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined) url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

export async function makeBrexRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BrexRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;
	const res = await fetch(buildUrl(endpoint, query), {
		method,
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
			...headers,
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});

	if (res.status === 204) return {} as T;

	let parsed: unknown;
	const text = await res.text();
	if (text) {
		try {
			parsed = JSON.parse(text);
		} catch {
			parsed = text;
		}
	}

	if (res.status === 429) {
		throw new BrexRateLimitError(
			bodyMessage(parsed, res.statusText || 'Too Many Requests'),
			retryAfterMs(res),
			parsed,
		);
	}
	if (!res.ok) {
		throw new BrexAPIError(
			bodyMessage(parsed, res.statusText || `Brex request failed`),
			res.status,
			res.status,
			parsed,
		);
	}
	return (parsed ?? {}) as T;
}
