import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Persona documents no rate-limit retry contract, so 429s get core's
 * standard handling: up to three retries honouring Retry-After (R8: the
 * plugin adds no second retry layer). A 429 is refused before the call
 * runs, so a retry is safe for the writes too.
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Persona requires a dated API version header on every call; without it the
 * API answers 400 asking for the version.
 */
const API_VERSION = '2023-01-18';

/**
 * A failed call throws this: core's `ApiError` (R8: core and the handlers
 * read `status` and `retryAfter` from it), rebuilt without the request body
 * and query. Inquiry records carry personal data, which core's own ApiError
 * keeps on the request.
 */
export class PersonaAPIError extends ApiError {
	/** The HTTP method of the failed request, for replay-safety decisions. */
	readonly method: string;

	constructor(
		message: string,
		options: {
			method: string;
			/** Request path, without query. */
			path: string;
			status: number;
			statusText?: string;
			// unknown: error bodies can be the { errors: [...] } envelope or
			// non-JSON from a proxy.
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(
			{
				method: options.method as ApiRequestOptions['method'],
				url: options.path,
			},
			{
				url: options.path,
				ok: false,
				status: options.status,
				statusText: options.statusText ?? '',
				body: options.body,
			},
			message,
			{ retryAfter: options.retryAfter },
		);
		this.name = 'PersonaAPIError';
		this.method = options.method;
	}
}

/**
 * Extracts the readable part of a Persona error body. Errors are
 * `{"errors":[{"title":"Must be authenticated to access this endpoint"}]}`
 * (verified live with an invalid token).
 */
export function describePersonaError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const errors = Array.isArray(record?.errors) ? record.errors : [];
	const first = asRecord(errors[0]);
	const text =
		(typeof first?.title === 'string' && first.title.length > 0
			? first.title
			: undefined) ??
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		fallback;
	return text;
}

export type PersonaQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type PersonaRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: PersonaQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across POST/PATCH shapes.
	body?: unknown;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Persona request. API keys authenticate with an
 * Authorization Bearer header, and every call carries the dated
 * Persona-Version header the API requires.
 * https://docs.withpersona.com/api-reference
 */
export async function makePersonaRequest(
	apiKey: string,
	{ method, path, query, body }: PersonaRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.withpersona.com/api/v1',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			'Persona-Version': API_VERSION,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		body: method === 'POST' || method === 'PATCH' ? body : undefined,
		mediaType:
			method === 'POST' || method === 'PATCH' ? 'application/json' : undefined,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (inquiries carry personal data).
			// Core's fallback message embeds the whole response body, so the
			// text comes from the provider's error or the status.
			const detail = describePersonaError(
				error.body,
				error.statusText || 'request failed',
			);
			throw new PersonaAPIError(`Persona ${error.status}: ${detail}`, {
				method,
				path,
				status: error.status,
				statusText: error.statusText,
				body: error.body,
				retryAfter: error.retryAfter,
			});
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
