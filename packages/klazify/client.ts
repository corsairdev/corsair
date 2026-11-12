import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const KLAZIFY_API_BASE = 'https://www.klazify.com';

/**
 * Klazify authenticates with a single Bearer token, so the whole credential is
 * the account's `api_key` and `ctx.key` carries it unchanged.
 */
export type KlazifyCredentials = string;

/** Klazify answers a rejected plan or credential with this body. */
export type KlazifyErrorBody = {
	success?: boolean;
	error?: string;
	message?: string;
};

/**
 * Klazify documents no rate-limit headers, so this keeps the transport's
 * retries off (retrying belongs to `error-handlers.ts`) while still reading
 * `Retry-After` if the service ever starts sending one.
 */
const KLAZIFY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The free plan cannot call the API at all: every endpoint answers 401 with
 * `error: "Plan free no available"`. That is a permanent condition until the
 * account is upgraded, so it is worth naming on the error.
 */
const PLAN_REQUIRED_MARKER = 'plan';

export class KlazifyAPIError extends Error {
	readonly status: number;
	/** Klazify's machine-readable label, e.g. `Unauthorized`. */
	readonly errorLabel?: string;
	/** Klazify's human-readable sentence. */
	readonly detail?: string;
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			errorLabel?: string;
			detail?: string;
			method?: string;
		} = {},
	) {
		// The cause is kept only for a transport failure, which never reached
		// Klazify. A provider rejection is passed as copied fields instead:
		// ApiError holds the request on `request.body`, and a discovery query can
		// carry the caller's own search terms.
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'KlazifyAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status ?? 0;
		this.errorLabel = options.errorLabel;
		this.detail = options.detail;
		this.method = options.method ?? cause?.request.method;
	}

	/** True when the account's plan does not include API access. */
	get isPlanRequired(): boolean {
		const label = (this.errorLabel ?? '').toLowerCase();
		const detail = (this.detail ?? '').toLowerCase();
		return (
			this.status === 401 &&
			(label.includes(PLAN_REQUIRED_MARKER) || detail.includes('paid plan'))
		);
	}

	/** True for a missing or rejected key, as opposed to a plan restriction. */
	get isAuthError(): boolean {
		return (
			this.status === 401 &&
			(this.errorLabel ?? '').toLowerCase() === 'unauthorized'
		);
	}
}

// unknown: the failure body is untyped until read, and Klazify could answer
// with HTML from an edge layer where JSON was expected.
function readErrorFields(body: unknown): {
	errorLabel?: string;
	detail?: string;
} {
	const record = asRecord(body);
	const label = record?.error;
	const detail = record?.message;
	return {
		errorLabel: typeof label === 'string' ? label : undefined,
		detail: typeof detail === 'string' ? detail : undefined,
	};
}

export type KlazifyQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type KlazifyRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: KlazifyQuery;
	// unknown: the operation's input schema has already validated the body, and
	// the body shape differs per endpoint.
	body?: unknown;
};

// unknown: callers parse the answer with the operation's zod output schema,
// which is what decides each endpoint's real type.
export async function makeKlazifyRequest(
	apiKey: KlazifyCredentials,
	{ method, path, query, body }: KlazifyRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: KLAZIFY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The token goes through TOKEN, which renders `Authorization: Bearer`,
		// exactly what Klazify documents.
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the response body's type comes from the calling operation's
		// output schema, which parses it straight after this returns.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: KLAZIFY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const { errorLabel, detail } = readErrorFields(error.body);
			const summary = [errorLabel, detail].filter(Boolean).join(': ');
			throw new KlazifyAPIError(
				summary
					? `Klazify ${error.status}: ${summary}`
					: `Klazify ${error.status}: ${error.message}`,
				{ status: error.status, errorLabel, detail, method },
			);
		}
		// DOMException (a fetch timeout) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new KlazifyAPIError(error.message, { cause: error, method });
		}
		throw new KlazifyAPIError('Unknown Klazify error', { method });
	}
}

export { ApiError };
