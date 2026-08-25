import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GroqcloudAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;
	/** Error payload from Groq: `{ error: { message, type, code } }`. */
	public readonly body?: unknown;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error; status?: number; retryAfterMs?: number },
	) {
		super(message);
		this.name = 'GroqcloudAPIError';

		// Carry the transport status and rate-limit metadata. Without this,
		// `error-handlers.ts` can never match a 429: corsair throws it with the
		// message "Too Many Requests", which contains neither "429" nor
		// "rate_limited", so the text fallback never fires either.
		const cause = options?.cause;
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.retryAfter = cause.retryAfter;
			this.body = cause.body;
		} else if (options?.status !== undefined) {
			this.status = options.status;
			this.retryAfter = options.retryAfterMs;
		}
	}
}

const GROQCLOUD_API_BASE = 'https://api.groq.com/openai/v1';

export async function makeGroqcloudRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: GROQCLOUD_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new GroqcloudAPIError(error.message, undefined, { cause: error });
		}
		throw new GroqcloudAPIError('Unknown error');
	}
}

export type GroqcloudMultipartFieldValue = string | string[] | undefined;

/**
 * Deadline for multipart uploads. This path uses `fetch` directly (the shared
 * transport does not do multipart), so it needs its own timeout — otherwise a
 * stalled upstream holds the request open until the runtime's network timeout.
 */
const MULTIPART_TIMEOUT_MS = 120_000;

/**
 * `Retry-After` is sent in seconds; the retry policy expects milliseconds.
 * The value may be fractional (e.g. "2.5").
 */
function parseRetryAfterMs(response: Response): number | undefined {
	const header = response.headers.get('retry-after');
	if (!header) return undefined;
	const seconds = Number.parseFloat(header);
	return Number.isFinite(seconds) && seconds >= 0
		? Math.round(seconds * 1000)
		: undefined;
}

function throwFromFetchResponse(response: Response, bodyText: string): never {
	throw new GroqcloudAPIError(
		`Generic Error: status: ${response.status}; status text: ${response.statusText}; body: "${bodyText}"`,
		undefined,
		{ status: response.status, retryAfterMs: parseRetryAfterMs(response) },
	);
}

const buildUrl = (endpoint: string): string => {
	const baseUrl = GROQCLOUD_API_BASE.endsWith('/')
		? GROQCLOUD_API_BASE.slice(0, -1)
		: GROQCLOUD_API_BASE;
	const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	return `${baseUrl}/${path}`;
};

export function parseGroqcloudMultipartBody<T>(
	contentType: string | null,
	bodyText: string,
): T {
	const ct = (contentType ?? '').toLowerCase();
	const contentTypeSaysJson =
		ct.includes('application/json') || ct.includes('+json');

	if (contentTypeSaysJson) {
		return JSON.parse(bodyText) as T;
	}

	const trimmed = bodyText.trimStart();
	if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
		try {
			return JSON.parse(bodyText) as T;
		} catch {
			// fall through
		}
	}

	return { text: bodyText } as T;
}

export async function multipartGroqcloudRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		/** Empty when the request instead points Groq at a `url` field. */
		files?: Array<{ field: string; file: Blob | string; fileName: string }>;
		fields?: Record<string, GroqcloudMultipartFieldValue>;
	},
): Promise<T> {
	const { files = [], fields = {} } = options;

	const formData = new FormData();
	for (const { field, file, fileName } of files) {
		const blob = typeof file === 'string' ? new Blob([file]) : file;
		formData.append(field, blob, fileName);
	}
	for (const [key, value] of Object.entries(fields)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const item of value) {
				formData.append(key, item);
			}
		} else {
			formData.append(key, value);
		}
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), MULTIPART_TIMEOUT_MS);

	let response: Response;
	let bodyText: string;
	try {
		response = await fetch(buildUrl(endpoint), {
			method: 'POST',
			headers: { Authorization: `Bearer ${apiKey}` },
			body: formData,
			signal: controller.signal,
		});
		bodyText = await response.text();
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			throw new GroqcloudAPIError(
				`Request timed out after ${MULTIPART_TIMEOUT_MS}ms`,
			);
		}
		throw error instanceof Error
			? new GroqcloudAPIError(error.message)
			: new GroqcloudAPIError('Unknown error');
	} finally {
		clearTimeout(timeout);
	}

	if (!response.ok) {
		throwFromFetchResponse(response, bodyText);
	}

	return parseGroqcloudMultipartBody<T>(
		response.headers.get('content-type'),
		bodyText,
	);
}
