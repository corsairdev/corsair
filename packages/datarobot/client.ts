import type { DatarobotQueryValue } from './utils';

export class DatarobotAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			status?: number;
			statusText?: string;
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'DatarobotAPIError';
		this.status = options?.status;
		this.statusText = options?.statusText;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
	}
}

export const DEFAULT_DATAROBOT_ORIGIN = 'https://app.datarobot.com';
const REQUEST_TIMEOUT_MS = 20_000;

function resolveOrigin(raw?: string): string {
	if (raw === undefined) {
		return DEFAULT_DATAROBOT_ORIGIN;
	}
	const value = raw.trim();
	if (!value) {
		throw new DatarobotAPIError('Invalid DataRobot origin');
	}
	const withScheme = value.includes('://') ? value : `https://${value}`;
	try {
		return new URL(withScheme).origin;
	} catch {
		throw new DatarobotAPIError('Invalid DataRobot origin');
	}
}

function buildRequestUrl(
	origin: string,
	endpoint: string,
	query?: Record<string, DatarobotQueryValue>,
): string {
	if (endpoint.includes('{')) {
		throw new DatarobotAPIError('Unresolved DataRobot path parameter');
	}
	const url = new URL(endpoint, `${origin}/`);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) {
				continue;
			}
			url.searchParams.append(key, String(value));
		}
	}
	if (url.protocol !== 'https:' || url.origin !== origin) {
		throw new DatarobotAPIError(
			'DataRobot request URL must be HTTPS on the configured origin',
		);
	}
	return url.toString();
}

function abortSignal(
	timeoutMs: number,
	caller?: AbortSignal,
): { signal: AbortSignal; cancel: () => void } {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	const onAbort = () => controller.abort();
	if (caller) {
		if (caller.aborted) {
			controller.abort();
		} else {
			caller.addEventListener('abort', onAbort, { once: true });
		}
	}
	return {
		signal: controller.signal,
		cancel: () => {
			clearTimeout(timer);
			caller?.removeEventListener('abort', onAbort);
		},
	};
}

export async function makeDatarobotRequest<T>(
	endpoint: string,
	keyOrCtx:
		| string
		| {
				key: string;
				options?: { baseUrl?: string; host?: string };
		  },
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, DatarobotQueryValue>;
		signal?: AbortSignal;
	} = {},
): Promise<T> {
	const apiKey = typeof keyOrCtx === 'string' ? keyOrCtx : keyOrCtx.key;
	if (!apiKey?.trim()) {
		throw new DatarobotAPIError('DataRobot API key is missing');
	}

	const ctxBase =
		typeof keyOrCtx === 'object'
			? keyOrCtx.options?.baseUrl || keyOrCtx.options?.host
			: undefined;

	const { method = 'GET', body, query, signal: callerSignal } = options;
	const origin = resolveOrigin(ctxBase);
	if (!origin.startsWith('https:')) {
		throw new DatarobotAPIError('DataRobot origin must be HTTPS');
	}
	const url = buildRequestUrl(origin, endpoint, query);
	const headers: Record<string, string> = {
		Accept: 'application/json',
		Authorization: apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`,
	};
	const payload =
		method === 'POST' ||
		method === 'PUT' ||
		method === 'PATCH' ||
		method === 'DELETE'
			? body
			: undefined;
	if (payload !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	const abort = abortSignal(REQUEST_TIMEOUT_MS, callerSignal);
	let response: Response | undefined;
	let text = '';
	try {
		response = await fetch(url, {
			method,
			headers,
			body: payload === undefined ? undefined : JSON.stringify(payload),
			signal: abort.signal,
			redirect: payload === undefined ? 'follow' : 'error',
		});
		text = await response.text();
	} catch (error) {
		if (error instanceof Error) {
			throw new DatarobotAPIError(error.message, { cause: error });
		}
		throw new DatarobotAPIError('Unknown DataRobot error');
	} finally {
		abort.cancel();
	}

	let parsed: unknown;
	if (text.length > 0) {
		try {
			parsed = JSON.parse(text) as unknown;
		} catch {
			parsed = text;
		}
	}

	if (!response.ok) {
		const retryAfterRaw = response.headers.get('retry-after');
		const retryAfter = retryAfterRaw ? Number(retryAfterRaw) : undefined;
		throw new DatarobotAPIError(
			response.statusText || `HTTP ${response.status}`,
			{
				status: response.status,
				statusText: response.statusText,
				body: parsed,
				retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined,
			},
		);
	}

	return parsed as T;
}
