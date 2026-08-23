import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BouncerAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: number | string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'BouncerAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

/**
 * Bouncer serves its surface from a single host but two API versions:
 * email/domain/credits live under `v1.1`, the toxicity list jobs under `v1`.
 * The version therefore belongs to the endpoint path, not the base URL.
 *
 * https://docs.usebouncer.com/llms.txt
 */
export const BOUNCER_API_BASE = 'https://api.usebouncer.com';

/**
 * Redacts an email address for event logs (`logEventFromContext` persists its
 * payload to `corsair_events`) — keeps the first character and the domain for
 * debugging/correlation without storing the full address in plaintext.
 */
export function redactEmail(email: string): string {
	const atIndex = email.indexOf('@');
	if (atIndex <= 0) return '***';
	return `${email[0]}***${email.slice(atIndex)}`;
}

export async function makeBouncerRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// Bouncer authenticates with the `x-api-key` header only, so `TOKEN` is
	// deliberately unset: it would add a redundant `Authorization: Bearer`
	// carrying the same secret.
	const config: OpenAPIConfig = {
		BASE: BOUNCER_API_BASE,
		VERSION: '1.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		},
	};

	const cleanUrl = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const requestOptions: ApiRequestOptions = {
		method,
		url: cleanUrl,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new BouncerAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new BouncerAPIError(error.message, undefined, { cause: error });
		}
		throw new BouncerAPIError('Unknown error');
	}
}
