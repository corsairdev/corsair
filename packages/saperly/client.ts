import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class SaperlyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Tagged error bodies are `{_tag, ...fields}`. The shared client does not
	// type that envelope, so the raw JSON is kept for status matching.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly method?: SaperlyRequestOptions['method'];
	public readonly tag?: string;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			body?: unknown;
			method?: SaperlyRequestOptions['method'];
			status?: number;
			retryAfter?: number;
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'SaperlyAPIError';
		this.body = options?.body;
		this.method = options?.method;
		this.status = options?.status;
		this.retryAfter = options?.retryAfter;

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}

		this.tag = readTag(this.body);
	}
}

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

// https://saperly.com/openapi.json — production server, no version prefix.
export const SAPERLY_API_BASE = 'https://api.saperly.com';

// One transport attempt. Plugin handlers own retry policy, and enabled
// still extracts Retry-After on 429.
const NO_TRANSPORT_RETRY: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type SaperlyQueryValue = string | number | boolean | undefined;

export type SaperlyRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: object;
	query?: Record<string, SaperlyQueryValue>;
	path?: Record<string, string>;
	// Multipart values are strings or Blobs. The shared client types this as an open record.
	formData?: Record<string, unknown>;
	headers?: Record<string, string>;
	baseUrl?: string;
};

function retryAfterMs(response: Response): number | undefined {
	const header = response.headers.get('retry-after');
	if (!header) return undefined;
	const seconds = Number.parseInt(header, 10);
	if (!Number.isFinite(seconds)) return undefined;
	return seconds * 1000;
}

// Error bodies are JSON values until _tag is read off them.
function readTag(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null || !('_tag' in body)) {
		return undefined;
	}
	const tag = body._tag;
	return typeof tag === 'string' ? tag : undefined;
}

// Same untyped JSON body as readTag.
function describeFailure(status: number | undefined, body: unknown): string {
	const tag = readTag(body);
	if (tag) {
		return `Saperly ${status ?? 'error'}: ${JSON.stringify(body)}`;
	}
	if (typeof body === 'string' && body.length > 0) {
		return body;
	}
	return `Saperly request failed (${status ?? 'unknown'})`;
}

function buildConfig(baseUrl: string, apiKey: string): OpenAPIConfig {
	return {
		BASE: baseUrl,
		VERSION: '0.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
		},
	};
}

export async function makeSaperlyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: SaperlyRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, path, formData, headers } = options;
	const config = buildConfig(options.baseUrl ?? SAPERLY_API_BASE, apiKey);
	const hasForm = formData !== undefined;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		query,
		headers,
		formData: hasForm ? formData : undefined,
		body: !hasForm && body !== undefined ? body : undefined,
		mediaType:
			!hasForm && body !== undefined
				? 'application/json; charset=utf-8'
				: undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRY,
		});
	} catch (error) {
		if (error instanceof SaperlyAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			throw new SaperlyAPIError(describeFailure(error.status, error.body), {
				cause: error,
				method,
			});
		}
		if (error instanceof Error) {
			throw new SaperlyAPIError(error.message, { cause: error, method });
		}
		throw new SaperlyAPIError('Saperly request failed', { method });
	}
}

export type RecordingResult = {
	url: string;
};

// OpenAPI lists this as 200 application/json with an empty schema, and the
// operation description says the success path is a 302 to a download URL.
// Follow neither: read Location ourselves.
export async function makeSaperlyRecordingRequest(
	endpoint: string,
	apiKey: string,
	options: { baseUrl?: string; path: Record<string, string> },
): Promise<RecordingResult> {
	const base = options.baseUrl ?? SAPERLY_API_BASE;
	const rawId = options.path.id;
	if (!rawId) {
		throw new SaperlyAPIError('Recording request is missing the call id', {
			method: 'GET',
		});
	}
	const id = encodeURIComponent(rawId);
	const url = `${base}${endpoint.replace('{id}', id)}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			redirect: 'manual',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new SaperlyAPIError(error.message, {
				cause: error,
				method: 'GET',
			});
		}
		throw new SaperlyAPIError('Saperly request failed', { method: 'GET' });
	}

	if (response.status >= 300 && response.status < 400) {
		const location = response.headers.get('location');
		if (!location) {
			throw new SaperlyAPIError(
				`Saperly recording redirect ${response.status} had no Location`,
				{ method: 'GET' },
			);
		}
		return { url: location };
	}

	const text = await response.text();
	// The redirect body is text until JSON.parse, which returns any JSON value.
	let body: unknown;
	try {
		body = text.length > 0 ? JSON.parse(text) : undefined;
	} catch {
		body = text;
	}

	if (!response.ok) {
		throw new SaperlyAPIError(describeFailure(response.status, body), {
			body,
			method: 'GET',
			status: response.status,
			// The shared client only reads Retry-After on its own 429 path.
			retryAfter: response.status === 429 ? retryAfterMs(response) : undefined,
		});
	}

	if (
		typeof body === 'object' &&
		body !== null &&
		'url' in body &&
		typeof body.url === 'string'
	) {
		return { url: body.url };
	}

	throw new SaperlyAPIError(
		'Saperly recording response had no redirect Location or url',
		{ body, method: 'GET' },
	);
}
