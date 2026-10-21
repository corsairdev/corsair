/**
 * Browser Use Cloud API v4 authenticates with the `X-Browser-Use-API-Key` header.
 * Official: https://docs.browser-use.com/cloud/api-v4-overview
 */
export class BrowserUseAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'BrowserUseAPIError';
	}
}

export class BrowserUseRateLimitError extends BrowserUseAPIError {
	constructor(
		message = 'Browser Use API rate limit exceeded',
		public readonly retryAfterMs?: number,
	) {
		super(message, 429);
		this.name = 'BrowserUseRateLimitError';
	}
}

export const BROWSER_USE_API_BASE = 'https://api.browser-use.com/api/v4';
const REQUEST_TIMEOUT_MS = 60_000;
const NO_DEK_ERROR_PATTERN = /no dek found/i;

export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

type Query = Record<string, string | number | boolean | undefined>;

export function browserUseUrl(path: string, query: Query = {}): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) params.set(key, String(value));
	}
	const suffix = path.startsWith('/') ? path : `/${path}`;
	const qs = params.toString();
	return `${BROWSER_USE_API_BASE}${suffix}${qs ? `?${qs}` : ''}`;
}

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

/** Errors come back as `{ detail: string | object }` (FastAPI). */
async function parseErrorBody(res: Response): Promise<string> {
	const text = await res.text();
	if (!text) return `Browser Use request failed (${res.status})`;
	try {
		const body = JSON.parse(text) as { detail?: unknown; message?: unknown };
		if (typeof body.detail === 'string' && body.detail) return body.detail;
		if (body.detail !== undefined) return JSON.stringify(body.detail);
		if (typeof body.message === 'string' && body.message) return body.message;
	} catch {
		return text;
	}
	return text;
}

export async function requestBrowserUse<T>(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PATCH';
		body?: unknown;
		query?: Query;
	} = {},
): Promise<T> {
	const method = options.method ?? 'GET';
	const headers: Record<string, string> = {
		'X-Browser-Use-API-Key': apiKey,
		Accept: 'application/json',
	};
	if (method !== 'GET') headers['Content-Type'] = 'application/json';

	let res: Response;
	try {
		res = await fetch(browserUseUrl(path, options.query), {
			method,
			headers,
			body: method === 'GET' ? undefined : JSON.stringify(options.body ?? {}),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new BrowserUseAPIError('Browser Use request timed out');
		}
		throw new BrowserUseAPIError(
			error instanceof Error ? error.message : 'Browser Use request failed',
		);
	}

	if (res.status === 429) {
		const retry = retryAfterMs(res);
		throw new BrowserUseRateLimitError(await parseErrorBody(res), retry);
	}
	if (!res.ok) {
		throw new BrowserUseAPIError(await parseErrorBody(res), res.status);
	}

	const text = await res.text();
	try {
		return JSON.parse(text) as T;
	} catch {
		throw new BrowserUseAPIError(
			'Browser Use returned a non-JSON response',
			res.status,
		);
	}
}
