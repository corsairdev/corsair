import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TRIGGERCMD_API_BASE = 'https://www.triggercmd.com';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale, so a partial one either skips the
// rate-limit block or throws reading `headerNames`.
const TRIGGERCMD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * TRIGGERcmd answers every failure as `{ err: "Invalid Token!" }` with a 401,
 * and answers an unknown route with a 404 and no body at all. That difference
 * is useful: a 404 means the path is wrong, a 401 means it is right and the
 * token is not.
 *
 * The token also works as a `?token=` query parameter, which the provider's own
 * CLI and docs use. This client sends it as a Bearer header instead, so it never
 * appears in a URL that an `ApiError` would capture.
 */
export class TriggerCmdAPIError extends Error {
	readonly status?: number;
	/** The provider's own message, such as `Invalid Token!`. */
	readonly providerMessage?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, which decides replay safety. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			providerMessage?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TriggerCmdAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.providerMessage =
			options.providerMessage ?? readProviderMessage(cause?.body);
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** True for the 401 the provider sends when no token or a wrong one arrives. */
	get isAuthError(): boolean {
		return (
			this.status === 401 &&
			/invalid token|no authorization header/i.test(this.providerMessage ?? '')
		);
	}

	/**
	 * True when the route itself does not exist. The provider answers a 404 with
	 * no body, which is how this differs from an auth failure.
	 */
	get isUnknownRoute(): boolean {
		return this.status === 404;
	}
}

// unknown: the error body is `{ err }` on failure and empty on a 404.
function readProviderMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	const err = record?.err;
	return typeof err === 'string' && err.length > 0 ? err : undefined;
}

export function describeTriggerCmdError(
	status: number | undefined,
	// unknown: a proxy can answer HTML or text where JSON is expected.
	body: unknown,
	fallback: string,
): { message: string; providerMessage?: string } {
	const providerMessage = readProviderMessage(body);
	const text =
		providerMessage ??
		(typeof asRecord(body)?.message === 'string'
			? String(asRecord(body)?.message)
			: fallback);
	return {
		message: status === undefined ? text : `TRIGGERcmd ${status}: ${text}`,
		providerMessage,
	};
}

export type TriggerCmdQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type TriggerCmdRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: TriggerCmdQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export async function makeTriggerCmdRequest(
	apiToken: string,
	{ method, path, query, body }: TriggerCmdRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TRIGGERCMD_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiToken}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TRIGGERCMD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof TriggerCmdAPIError) throw error;
		if (error instanceof ApiError) {
			const described = describeTriggerCmdError(
				error.status,
				error.body,
				error.message,
			);
			throw new TriggerCmdAPIError(described.message, {
				cause: error,
				providerMessage: described.providerMessage,
				method,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TriggerCmdAPIError(error.message, { cause: error, method });
		}
		throw new TriggerCmdAPIError('Unknown TRIGGERcmd error', { method });
	}
}
