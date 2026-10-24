/**
 * Browser Use Cloud API v4 authenticates with the `X-Browser-Use-API-Key` header.
 * Official: https://docs.browser-use.com/cloud/api-v4-overview
 */
export class BrowserUseAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfterMs?: number,
		// Request path, so a 503 retry can be limited to cancel.
		public readonly path?: string,
	) {
		super(message);
		this.name = 'BrowserUseAPIError';
	}
}

export class BrowserUseRateLimitError extends BrowserUseAPIError {
	constructor(
		message = 'Browser Use API rate limit exceeded',
		retryAfterMs?: number,
	) {
		super(message, 429, retryAfterMs);
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

type QueryValue = string | number | boolean | string[] | null | undefined;
type Query = Record<string, QueryValue>;

export function browserUseUrl(path: string, query: Query = {}): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			for (const item of value) params.append(key, item);
			continue;
		}
		params.set(key, String(value));
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
		// unknown is necessary: FastAPI detail is a string or a list of objects. A stricter type is not practical.
		const parsed: unknown = JSON.parse(text);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			return text;
		}
		const detail = Reflect.get(parsed, 'detail');
		const message = Reflect.get(parsed, 'message');
		if (typeof detail === 'string' && detail) return detail;
		if (detail !== undefined) return JSON.stringify(detail);
		if (typeof message === 'string' && message) return message;
	} catch {
		return text;
	}
	return text;
}

export async function requestBrowserUse(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PATCH';
		// unknown is necessary: each endpoint has its own body. A stricter shared type is not practical.
		body?: unknown;
		query?: Query;
	} = {},
	// unknown is necessary: the caller parses this JSON with that route's schema. A stricter return is not practical.
): Promise<unknown> {
	const method = options.method ?? 'GET';
	const headers: Record<string, string> = {
		'X-Browser-Use-API-Key': apiKey,
		Accept: 'application/json',
	};
	const hasBody = method !== 'GET' && options.body !== undefined;
	if (hasBody) headers['Content-Type'] = 'application/json';

	let res: Response;
	try {
		res = await fetch(browserUseUrl(path, options.query), {
			method,
			headers,
			body: hasBody ? JSON.stringify(options.body) : undefined,
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

	if (!res.ok) {
		const retry = retryAfterMs(res);
		const message = await parseErrorBody(res);
		if (res.status === 429) {
			throw new BrowserUseRateLimitError(message, retry);
		}
		// 503 on cancel carries Retry-After and asks for another attempt.
		throw new BrowserUseAPIError(message, res.status, retry, path);
	}

	const text = await res.text();
	try {
		// unknown is necessary: JSON.parse is untyped. A stricter return type is not practical.
		const parsed: unknown = JSON.parse(text);
		return parsed;
	} catch {
		throw new BrowserUseAPIError(
			'Browser Use returned a non-JSON response',
			res.status,
		);
	}
}
