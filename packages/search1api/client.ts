import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class Search1APIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// error handlers needle-match this payload; its shape is provider-owned
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly method?: Search1APIRequestOptions['method'];

	constructor(
		message: string,
		// unknown: the provider does not fix an error shape.
		options: {
			cause?: Error;
			body?: unknown;
			method?: Search1APIRequestOptions['method'];
			status?: number;
			statusText?: string;
			retryAfter?: number;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'Search1APIError';
		this.body = options.body;
		this.method = options.method;
		this.status = options.status;
		this.statusText = options.statusText;
		this.retryAfter = options.retryAfter;

		if (options.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = this.retryAfter ?? options.cause.retryAfter;
		}
	}
}

export const SEARCH1API_BASE_URL = 'https://api.search1api.com';

// /search, /news, /ask and /trending answer in seconds, but /crawl, /extract
// and /screenshot render live pages and regularly outlive the shared 20s
// default. This cap matches the slowest documented wait plus render time.
const SEARCH1API_TIMEOUT_MS = 120_000;

export type Search1APIRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Validated endpoint inputs are specific objects; an index signature would
	// force a cast at every call.
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
};

function buildConfig(apiKey: string): OpenAPIConfig {
	return {
		BASE: SEARCH1API_BASE_URL,
		VERSION: '1.0.0',
		TIMEOUT: SEARCH1API_TIMEOUT_MS,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};
}

// ApiError.body is untyped, so detail rendering must handle every shape
function errorDetail(body: unknown): string {
	if (body == null) return '';
	if (typeof body === 'string') return body;
	try {
		return JSON.stringify(body);
	} catch {
		return String(body);
	}
}

export async function makeSearch1APIRequest<T>(
	endpoint: string,
	apiKey: string,
	options: Search1APIRequestOptions = {},
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
		// The shared client retries 429s on its own, which is safe here: the
		// provider rejects the request before a billed search runs, so nothing
		// is charged for the attempts that got rate limited.
		return await request<T>(buildConfig(apiKey), requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const detail = errorDetail(error.body);
			const hasMessage =
				Boolean(error.message) && error.message !== '[object Object]';
			const message = hasMessage
				? detail
					? `${error.message}: ${detail}`
					: error.message
				: detail || 'Search1API request failed';
			throw new Search1APIError(message, {
				cause: error,
				body: error.body,
				method,
			});
		}
		if (error instanceof Error) {
			throw new Search1APIError(error.message, { cause: error, method });
		}
		throw new Search1APIError('Unknown Search1API error', { method });
	}
}

export type Search1APIScreenshotFile = {
	contentType: string;
	base64: string;
	sizeBytes: number;
};

function retryAfterMsOf(response: Response): number | undefined {
	const raw =
		response.headers.get('Retry-After') ?? response.headers.get('retry-after');
	if (!raw) return undefined;
	const seconds = Number(raw);
	return Number.isFinite(seconds) ? seconds * 1000 : undefined;
}

// a screenshot failure body may be json or plain text; parse and fall back
async function readErrorBody(response: Response): Promise<unknown> {
	const text = await response.text();
	if (!text) return undefined;
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

/**
 * POST /screenshot answers with raw PNG/JPEG/WebP bytes, which the shared
 * JSON client cannot return, so this endpoint talks to `fetch` directly.
 * Failures carry the same shape as `makeSearch1APIRequest`.
 */
export async function requestSearch1APIScreenshot(
	// a validated endpoint input, as in Search1APIRequestOptions.body; the
	// screenshot body shape lives in the endpoint schemas, not the client
	body: object,
	apiKey: string,
): Promise<Search1APIScreenshotFile> {
	let response: Response;
	try {
		response = await fetch(`${SEARCH1API_BASE_URL}/screenshot`, {
			method: 'POST',
			headers: {
				Accept: 'image/png, image/jpeg, image/webp',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(SEARCH1API_TIMEOUT_MS),
		});
	} catch (error) {
		const timedOut = error instanceof Error && error.name === 'TimeoutError';
		throw new Search1APIError(
			timedOut
				? 'Search1API screenshot request timed out'
				: error instanceof Error
					? error.message
					: 'Unknown Search1API error',
			{
				cause: error instanceof Error ? error : undefined,
				method: 'POST',
			},
		);
	}

	if (!response.ok) {
		const body = await readErrorBody(response);
		throw new Search1APIError(
			`Screenshot request failed (${response.status} ${response.statusText}): ${errorDetail(body)}`,
			{
				body,
				method: 'POST',
				status: response.status,
				statusText: response.statusText,
				retryAfter: retryAfterMsOf(response),
			},
		);
	}

	const contentType = response.headers.get('Content-Type') ?? '';
	if (!contentType.startsWith('image/')) {
		throw new Search1APIError(
			`Search1API screenshot returned a non-image response (${contentType || 'no content type'})`,
			{
				body: await readErrorBody(response),
				method: 'POST',
				status: response.status,
				statusText: response.statusText,
			},
		);
	}

	const bytes = Buffer.from(await response.arrayBuffer());
	return {
		contentType,
		base64: bytes.toString('base64'),
		sizeBytes: bytes.byteLength,
	};
}
