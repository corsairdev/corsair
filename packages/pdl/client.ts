import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class PdlAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Raw failed-response body; its shape depends on which failure layer
	// produced it, so handlers degrade it to text before matching.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly method?: PdlRequestOptions['method'];

	constructor(
		message: string,
		options: {
			cause?: Error;
			// Same untyped failure body as the field above.
			body?: unknown;
			method?: PdlRequestOptions['method'];
			status?: number;
			statusText?: string;
			retryAfter?: number;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PdlAPIError';
		this.body = options.body;
		this.method = options.method;
		this.status = options.status;
		this.statusText = options.statusText;
		this.retryAfter = options.retryAfter;
	}
}

export const PDL_API_BASE_URL = 'https://api.peopledatalabs.com';
export const PDL_SANDBOX_BASE_URL = 'https://sandbox.api.peopledatalabs.com';

// Search pages and bulk batches can outlive the shared 20s default.
const PDL_TIMEOUT_MS = 120_000;

export type PdlRequestOptions = {
	method?: 'GET' | 'POST';
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
	baseUrl?: string;
};

function buildConfig(apiKey: string, baseUrl?: string): OpenAPIConfig {
	return {
		BASE: baseUrl ?? PDL_API_BASE_URL,
		VERSION: '1.0.0',
		TIMEOUT: PDL_TIMEOUT_MS,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// No TOKEN: the shared client turns TOKEN into an Authorization: Bearer
		// header, and PDL authenticates with X-Api-Key instead.
		HEADERS: {
			'X-Api-Key': apiKey,
		},
	};
}

// ApiError.body is untyped: PDL envelopes, strings, and transport junk.
function errorDetail(body: unknown): string {
	if (body == null) return '';
	if (typeof body === 'string') return body;
	if (typeof body === 'object' && 'error' in body) {
		const error = body.error;
		if (typeof error === 'object' && error !== null) {
			const type = 'type' in error ? error.type : undefined;
			const message = 'message' in error ? error.message : undefined;
			const parts = [type, message].filter(
				(part): part is string => typeof part === 'string' && part.length > 0,
			);
			if (parts.length > 0) return parts.join(': ');
		}
	}
	try {
		return JSON.stringify(body);
	} catch {
		return String(body);
	}
}

/**
 * PDL's list-valued params (`required`, `data_include`) are documented as
 * comma-separated strings; the shared client would serialize arrays as
 * repeated keys.
 */
// Validated enrich inputs carry only strings, numbers, booleans, and string
// lists; a query param has no wire form beyond those, so anything else drops.
function queryScalar(value: unknown): string | number | boolean | undefined {
	return typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
		? value
		: undefined;
}

export function pdlQuery(
	// Callers pass different validated objects, so this reads an open record.
	input: Record<string, unknown>,
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(input).map(([key, value]) => [
			key,
			Array.isArray(value) ? value.join(',') : queryScalar(value),
		]),
	);
}

export async function makePDLRequest<T>(
	endpoint: string,
	apiKey: string,
	options: PdlRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, baseUrl } = options;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		body: body !== undefined ? body : undefined,
		mediaType:
			body !== undefined ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(buildConfig(apiKey, baseUrl), requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const detail = errorDetail(error.body);
			const hasMessage =
				Boolean(error.message) && error.message !== '[object Object]';
			const message = hasMessage
				? detail
					? `${error.message}: ${detail}`
					: error.message
				: detail || 'PDL request failed';
			throw new PdlAPIError(message, {
				cause: error,
				body: error.body,
				method,
				status: error.status,
				statusText: error.statusText,
				retryAfter: error.retryAfter,
			});
		}
		if (error instanceof Error) {
			throw new PdlAPIError(error.message, {
				cause: error,
				method,
			});
		}
		throw new PdlAPIError('Unknown PDL error', { method });
	}
}

/**
 * Enrichment, identify, and IP enrichment report "no match" as HTTP 404 — a
 * normal, billed outcome, not a failure.
 */
export async function requestPdlEnrichment<T>(
	endpoint: string,
	apiKey: string,
	options: PdlRequestOptions = {},
): Promise<T | null> {
	try {
		return await makePDLRequest<T>(endpoint, apiKey, options);
	} catch (error) {
		if (error instanceof PdlAPIError && error.status === 404) {
			return null;
		}
		throw error;
	}
}
