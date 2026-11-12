import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TEXTIT_API_BASE = 'https://textit.com/api/v2';

// Make one attempt, while retaining Retry-After on the resulting ApiError.
const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export class TextItAPIError extends Error {
	readonly status?: number;
	// Error bodies vary by status and provider response, so callers must narrow them.
	readonly body?: unknown;
	/** Retry-After in milliseconds, if TextIt provided it. */
	readonly retryAfter?: number;
	readonly method?: string;

	constructor(message: string, cause: Error, method: string) {
		super(message, { cause });
		this.name = 'TextItAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
		}
		this.method = method;
	}
}

export type TextItRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// Different endpoints submit different validated JSON bodies; no single shape fits.
	body?: unknown;
	formData?: { file: Blob };
};

/** The endpoint's output schema narrows this untrusted, endpoint-specific JSON or 204 response. */
export async function makeTextItRequest(
	key: string,
	spec: TextItRequest,
): Promise<unknown> {
	if (!key?.trim()) throw new AuthMissingError('textit', 'api_key');
	const config: OpenAPIConfig = {
		BASE: TEXTIT_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Authorization: `Token ${key}` },
	};
	const options: ApiRequestOptions = {
		method: spec.method,
		url: spec.path,
		query: spec.query,
		body: spec.body,
		formData: spec.formData,
		mediaType: spec.body === undefined ? undefined : 'application/json',
	};
	try {
		// The generic transport sees all resource shapes; the endpoint validates the result.
		return await request<unknown>(config, options, { rateLimitConfig });
	} catch (error) {
		if (error instanceof Error)
			throw new TextItAPIError(error.message, error, spec.method);
		throw new TextItAPIError(
			'Unknown TextIt error',
			new Error(String(error)),
			spec.method,
		);
	}
}
