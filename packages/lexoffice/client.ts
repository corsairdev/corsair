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

/**
 * Provider text kept on a sanitized error only when it carries no email
 * address, bearer token or long token-like value.
 */
function safeProviderText(value: unknown): string | undefined {
	if (typeof value !== 'string' || value.length === 0 || value.length > 300) {
		return undefined;
	}
	// Lexware issue identifiers such as contact_has_not_mappable_phone_number are
	// lowercase snake_case and safe at any length.
	if (/^[a-z]+(?:_[a-z]+)*$/.test(value)) return value;
	if (/@|bearer/i.test(value) || /[A-Za-z0-9_-]{24,}/.test(value)) {
		return undefined;
	}
	return value;
}

// `unknown` because provider error bodies are untyped JSON.
function safeIssueList(value: unknown): Record<string, string>[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const issues = value.flatMap((issue: unknown) => {
		if (typeof issue !== 'object' || issue === null) return [];
		const kept: Record<string, string> = {};
		for (const field of ['i18nKey', 'source', 'type'] as const) {
			const text = safeProviderText((issue as Record<string, unknown>)[field]);
			if (text !== undefined) kept[field] = text;
		}
		return Object.keys(kept).length > 0 ? [kept] : [];
	});
	return issues.length > 0 ? issues : undefined;
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

	// Keep the shared ApiError instance and retry metadata. Drop request data and
	// provider payloads, except Lexware's own validation text and issue keys,
	// which name the failing field without echoing customer values.
	// `unknown` because provider error bodies are untyped JSON.
	const providerBody: Record<string, unknown> =
		typeof error.body === 'object' && error.body !== null ? error.body : {};
	const providerMessage = safeProviderText(providerBody.message);
	const issueList = safeIssueList(providerBody.IssueList);
	const message = providerMessage
		? `Lexware API request failed: ${providerMessage}`
		: 'Lexware API request failed';
	error.message = message;
	Object.assign(error, {
		url: LEXOFFICE_API_BASE,
		statusText: 'Lexware API Error',
		stack: `ApiError: ${message}`,
		body: {
			message: providerMessage ?? 'Lexware API request failed',
			...(issueList ? { IssueList: issueList } : {}),
		},
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
		contentType: response.contentType ?? 'application/octet-stream',
		base64: Buffer.from(response.bytes).toString('base64'),
		sizeBytes: response.bytes.byteLength,
	};
}
