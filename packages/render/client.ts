import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class RenderAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
		// unknown: Render's error body, usually { id, message }.
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'RenderAPIError';
	}
}

// Render explains most 4xx answers in the body's `message` field
// (for example which filter or plan was rejected); keep it in the error.
// unknown: the error body is untyped JSON or text; narrowed below.
const renderErrorDetail = (body: unknown): string | undefined => {
	if (typeof body === 'string') return body.trim().slice(0, 500) || undefined;
	if (body && typeof body === 'object' && 'message' in body) {
		const { message } = body;
		if (typeof message === 'string' && message) return message.slice(0, 500);
	}
	return undefined;
};

const RENDER_API_BASE = 'https://api.render.com';

/** A JSON request body: an object for most writes, an array for replace operations. */
// unknown: bodies arrive schema-validated but untyped; this guard narrows them.
export const isRenderJsonBody = (
	value: unknown,
): value is Record<string, unknown> | unknown[] =>
	Array.isArray(value) || (typeof value === 'object' && value !== null);

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export async function makeRenderRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Render request bodies differ by operation and are validated by the
		// corresponding endpoint schema before reaching this transport boundary.
		// Stricter typing is not feasible here because Render uses object bodies
		// for most writes and array bodies for replacement operations.
		// unknown: the endpoint schemas validate each provider-specific body.
		body?: /* unknown: provider-specific object or replacement-array body */
		Record<string, unknown> | unknown[];
		// unknown: filter values are schema-validated per operation; core
		// request() serialises strings, numbers, booleans and arrays.
		query?: Record<string, unknown>;
		headers?: Record<string, string>;
		mediaType?: string;
		// multipart/form-data fields; fetch sets the boundary Content-Type.
		formData?: Record<string, string | Blob>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, mediaType, formData } = options;

	const config: OpenAPIConfig = {
		BASE: RENDER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			...(formData ? {} : { 'Content-Type': 'application/json' }),
			Authorization: `Bearer ${apiKey}`,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: formData
			? undefined
			: (mediaType ?? 'application/json; charset=utf-8'),
		formData,
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const detail = renderErrorDetail(error.body);
			throw new RenderAPIError(
				detail ? `${error.message}: ${detail}` : error.message,
				error.status,
				undefined,
				error.retryAfter,
				error.body,
			);
		}
		throw error;
	}
}
