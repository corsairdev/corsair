import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	BinaryResponse,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LexofficeAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LexofficeAPIError';
	}
}

export const LEXOFFICE_API_BASE = 'https://api.lexware.io/v1';

/**
 * Transport-level retries are disabled so Corsair's endpoint error handlers
 * own the retry policy while still extracting `Retry-After` for 429 handling.
 */
export const LEXOFFICE_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export type LexofficeQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[]
	| undefined;

/**
 * Drops `undefined` query parameters so omitted options are not sent as empty strings.
 */
export function compactQuery(
	query: Record<string, LexofficeQueryValue>,
): Record<string, LexofficeQueryValue> {
	const defined: Record<string, LexofficeQueryValue> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			defined[key] = value;
		}
	}
	return defined;
}

export function sanitizeApiError<T>(error: T): T {
	if (!(error instanceof ApiError)) return error;

	if (error.request) {
		Object.assign(error.request, {
			url: LEXOFFICE_API_BASE,
			headers: undefined,
			query: undefined,
			body: undefined,
			formData: undefined,
		});
	}

	// Keep the shared ApiError instance and retry metadata but discard provider
	// text and request/response payloads that may contain customer data.
	error.message = 'Lexware API request failed';
	Object.assign(error, {
		url: LEXOFFICE_API_BASE,
		statusText: 'Lexware API Error',
		stack: 'ApiError: Lexware API request failed',
		body: { message: 'Lexware API request failed' },
	});

	return error;
}

export type LexofficeRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// `unknown` because request bodies are verified by Zod before transmission
	body?: Record<string, unknown> | object;
	query?: Record<string, LexofficeQueryValue>;
	headers?: Record<string, string>;
	formData?: Record<string, string | Blob>;
	responseType?: 'binary';
};

export async function makeLexofficeRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: LexofficeRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		headers,
		formData,
		responseType,
	} = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('lexoffice', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: LEXOFFICE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: authHeaders,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			!formData && (method === 'POST' || method === 'PUT' || method === 'PATCH')
				? body
				: undefined,
		formData,
		mediaType: formData ? undefined : 'application/json; charset=utf-8',
		query: query ? compactQuery(query) : undefined,
		headers,
		responseType,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: LEXOFFICE_NO_TRANSPORT_RETRIES,
		});
		// `error` is unknown because the shared transport may reject any value.
	} catch (error) {
		if (error instanceof ApiError) {
			throw sanitizeApiError(error);
		}
		if (error instanceof Error) {
			throw new LexofficeAPIError('Lexware API request failed');
		}
		throw new LexofficeAPIError('Lexware API request failed');
	}
}

export function toLexofficeFileResponse(response: BinaryResponse): {
	kind: 'binary';
	contentType: string;
	base64: string;
	sizeBytes: number;
} {
	return {
		kind: 'binary',
		contentType: response.contentType ?? '',
		base64: Buffer.from(response.bytes).toString('base64'),
		sizeBytes: response.bytes.byteLength,
	};
}
