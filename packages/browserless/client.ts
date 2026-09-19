/**
 * Browserless REST APIs authenticate with `?token=` (or Authorization).
 * Official: https://docs.browserless.io/rest-apis/intro
 */
export class BrowserlessAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'BrowserlessAPIError';
	}
}

export class BrowserlessRateLimitError extends BrowserlessAPIError {
	constructor(
		message = 'Browserless API rate limit exceeded',
		public readonly retryAfterMs?: number,
	) {
		super(message, 429);
		this.name = 'BrowserlessRateLimitError';
	}
}

export const BROWSERLESS_API_BASE = 'https://production-sfo.browserless.io';
const REQUEST_TIMEOUT_MS = 90_000;
/** Official `timeout` is the whole request; keep a short window for the response body. */
const TRANSFER_GRACE_MS = 10_000;
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

export type BrowserlessLaunchQuery = {
	stealth?: boolean;
	timeout?: number;
	proxy?: string;
	blockAds?: boolean;
};

/** Official `?timeout=` is milliseconds for the whole request. */
export function requestAbortMs(query?: BrowserlessLaunchQuery): number {
	if (query?.timeout === undefined) return REQUEST_TIMEOUT_MS;
	return query.timeout + TRANSFER_GRACE_MS;
}

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

function filenameFrom(res: Response): string | undefined {
	const raw = res.headers.get('Content-Disposition');
	const match = raw?.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
	return match?.[1]
		? decodeURIComponent(match[1].replace(/"/g, ''))
		: undefined;
}

export function browserlessUrl(
	path: string,
	apiKey: string,
	query: BrowserlessLaunchQuery = {},
): string {
	const params = new URLSearchParams({ token: apiKey });
	if (query.stealth === true) params.set('stealth', 'true');
	if (query.timeout !== undefined) params.set('timeout', String(query.timeout));
	if (query.proxy) params.set('proxy', query.proxy);
	if (query.blockAds === true) params.set('blockAds', 'true');
	const suffix = path.startsWith('/') ? path : `/${path}`;
	return `${BROWSERLESS_API_BASE}${suffix}?${params}`;
}

async function parseErrorBody(res: Response): Promise<string> {
	const text = await res.text();
	if (!text) return `Browserless request failed (${res.status})`;
	try {
		const body = JSON.parse(text) as { message?: unknown; error?: unknown };
		if (typeof body.message === 'string' && body.message) return body.message;
		if (typeof body.error === 'string' && body.error) return body.error;
	} catch {
		return text;
	}
	return text;
}

async function send(
	path: string,
	apiKey: string,
	options: {
		body?: unknown;
		code?: string;
		query?: BrowserlessLaunchQuery;
	},
): Promise<Response> {
	const headers: Record<string, string> = {
		'Cache-Control': 'no-cache',
	};
	let body: string;
	if (options.code !== undefined && options.body === undefined) {
		headers['Content-Type'] = 'application/javascript';
		body = options.code;
	} else {
		headers['Content-Type'] = 'application/json';
		body = JSON.stringify(options.body ?? {});
	}

	let res: Response;
	try {
		res = await fetch(browserlessUrl(path, apiKey, options.query), {
			method: 'POST',
			headers,
			body,
			signal: AbortSignal.timeout(requestAbortMs(options.query)),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new BrowserlessAPIError('Browserless request timed out');
		}
		throw new BrowserlessAPIError(
			error instanceof Error ? error.message : 'Browserless request failed',
		);
	}

	if (res.status === 429) {
		const retry = retryAfterMs(res);
		await res.body?.cancel();
		throw new BrowserlessRateLimitError(undefined, retry);
	}
	if (!res.ok) {
		throw new BrowserlessAPIError(await parseErrorBody(res), res.status);
	}
	return res;
}

export async function requestBrowserlessJson<T>(
	path: string,
	apiKey: string,
	options: { body?: unknown; query?: BrowserlessLaunchQuery } = {},
): Promise<T> {
	const res = await send(path, apiKey, options);
	const text = await res.text();
	try {
		return JSON.parse(text) as T;
	} catch {
		throw new BrowserlessAPIError(
			'Browserless returned a non-JSON response',
			res.status,
		);
	}
}

export async function requestBrowserlessText(
	path: string,
	apiKey: string,
	options: { body?: unknown; query?: BrowserlessLaunchQuery } = {},
): Promise<{ html: string; contentType: string }> {
	const res = await send(path, apiKey, options);
	return {
		html: await res.text(),
		contentType: res.headers.get('Content-Type') ?? 'text/html',
	};
}

export async function requestBrowserlessFile(
	path: string,
	apiKey: string,
	options: {
		body?: unknown;
		code?: string;
		query?: BrowserlessLaunchQuery;
	} = {},
): Promise<{ base64: string; contentType: string; filename?: string }> {
	const res = await send(path, apiKey, options);
	const bytes = Buffer.from(await res.arrayBuffer());
	return {
		base64: bytes.toString('base64'),
		contentType: res.headers.get('Content-Type') ?? 'application/octet-stream',
		filename: filenameFrom(res),
	};
}

export async function requestBrowserlessFunction(
	apiKey: string,
	input: {
		code: string;
		context?: Record<string, unknown>;
		query?: BrowserlessLaunchQuery;
	},
): Promise<
	| { kind: 'json'; data: unknown; contentType: string }
	| { kind: 'file'; base64: string; contentType: string; filename?: string }
> {
	const res = await send('/function', apiKey, {
		body: input.context
			? { code: input.code, context: input.context }
			: { code: input.code },
		query: input.query,
	});
	const contentType =
		res.headers.get('Content-Type') ?? 'application/octet-stream';
	if (
		contentType.includes('application/json') ||
		contentType.includes('text/json')
	) {
		return { kind: 'json', data: JSON.parse(await res.text()), contentType };
	}
	const bytes = Buffer.from(await res.arrayBuffer());
	return {
		kind: 'file',
		base64: bytes.toString('base64'),
		contentType,
		filename: filenameFrom(res),
	};
}
