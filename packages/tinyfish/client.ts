import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TinyFishError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// unknown: failure bodies carry { error: { code, message } } on the
	// documented paths, but the shape is not promised for every upstream case.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly method?: TinyFishRequestOptions['method'];
	public readonly code?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			body?: unknown;
			method?: TinyFishRequestOptions['method'];
			status?: number;
			statusText?: string;
			retryAfter?: number;
			code?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TinyFishError';
		this.body = options.body;
		this.method = options.method;
		this.status = options.status;
		this.statusText = options.statusText;
		this.retryAfter = options.retryAfter;
		this.code = options.code ?? errorCodeOf(options.body);

		if (options.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = this.retryAfter ?? options.cause.retryAfter;
			this.code = this.code ?? errorCodeOf(this.body);
		}
	}
}

export const TINYFISH_BASE_URLS = {
	agent: 'https://agent.tinyfish.ai',
	search: 'https://api.search.tinyfish.ai',
	fetch: 'https://api.fetch.tinyfish.ai',
	browser: 'https://api.browser.tinyfish.ai',
} as const;

export type TinyFishBaseUrl = keyof typeof TINYFISH_BASE_URLS;

// Search answers in 1-3s, but Agent sync runs take 15-60s and Fetch allows a
// 110s backend render per URL behind a 120s CDN ceiling. This cap matches the
// largest documented wait (Fetch's recommended 150s client timeout).
const TINYFISH_TIMEOUT_MS = 150_000;

export type TinyFishRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Validated endpoint inputs are specific objects; an index signature would
	// force a cast at every call.
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
};

// 429 policy belongs to error-handlers.ts (a daily-limit 429 must surface
// immediately, a per-minute one replays on Retry-After), so the transport
// makes a single attempt. The Retry-After header is still read into the
// thrown ApiError for the handlers to act on.
const NO_RETRY: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

function buildConfig(baseUrl: string, apiKey: string): OpenAPIConfig {
	return {
		BASE: baseUrl,
		VERSION: '1.0.0',
		TIMEOUT: TINYFISH_TIMEOUT_MS,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'X-API-Key': apiKey,
		},
	};
}

function errorCodeOf(body: unknown): string | undefined {
	if (body === null || typeof body !== 'object') return undefined;
	const error = (body as Record<string, unknown>).error;
	if (error === null || typeof error !== 'object') return undefined;
	const code = (error as Record<string, unknown>).code;
	return typeof code === 'string' && code.length > 0 ? code : undefined;
}

function errorDetail(body: unknown): string {
	if (body == null) return '';
	if (typeof body === 'string') return body;
	try {
		return JSON.stringify(body);
	} catch {
		return String(body);
	}
}

export async function makeTinyFishRequest<T>(
	base: TinyFishBaseUrl,
	endpoint: string,
	apiKey: string,
	options: TinyFishRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		body: body !== undefined ? body : undefined,
		mediaType:
			body !== undefined ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(
			buildConfig(TINYFISH_BASE_URLS[base], apiKey),
			requestOptions,
			{ rateLimitConfig: NO_RETRY },
		);
	} catch (error) {
		if (error instanceof ApiError) {
			const detail = errorDetail(error.body);
			const hasMessage =
				Boolean(error.message) && error.message !== '[object Object]';
			const message = hasMessage
				? detail
					? `${error.message}: ${detail}`
					: error.message
				: detail || 'TinyFish request failed';
			throw new TinyFishError(message, {
				cause: error,
				body: error.body,
				method,
			});
		}
		if (error instanceof Error) {
			throw new TinyFishError(error.message, { cause: error, method });
		}
		throw new TinyFishError('Unknown TinyFish error', { method });
	}
}

function retryAfterMsOf(response: Response): number | undefined {
	const raw = response.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

/**
 * Step artifacts answer as raw JPEG/HTML, which the shared JSON client would
 * decode as text, so this talks to `fetch` directly. Failures carry the same
 * status/code fields the error handlers match on as `makeTinyFishRequest`.
 */
export async function makeTinyFishRawRequest(
	base: TinyFishBaseUrl,
	endpoint: string,
	apiKey: string,
	accept: string,
): Promise<{ contentType: string; bytes: Buffer }> {
	let response: Response;
	try {
		response = await fetch(`${TINYFISH_BASE_URLS[base]}${endpoint}`, {
			headers: { Accept: accept, 'X-API-Key': apiKey },
			signal: AbortSignal.timeout(TINYFISH_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new TinyFishError(error.message, {
				cause: error,
				method: 'GET',
			});
		}
		throw new TinyFishError('Unknown TinyFish error', { method: 'GET' });
	}

	if (!response.ok) {
		const text = await response.text();
		let body: unknown = text;
		try {
			body = JSON.parse(text);
		} catch {
			// keep the raw text; error bodies are usually JSON but not promised
		}
		throw new TinyFishError(
			`TinyFish request failed (${response.status} ${response.statusText}): ${errorDetail(body)}`,
			{
				body,
				method: 'GET',
				status: response.status,
				statusText: response.statusText,
				retryAfter: retryAfterMsOf(response),
			},
		);
	}

	return {
		contentType: response.headers.get('Content-Type') ?? '',
		bytes: Buffer.from(await response.arrayBuffer()),
	};
}
