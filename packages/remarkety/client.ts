import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The API is served from the app host under `/api/v1`. `api.remarkety.com` also
 * answers, but redirects to a login page for anything that is not an exact API
 * route, so the app host is the one used.
 */
export const REMARKETY_API_BASE = 'https://app.remarkety.com/api/v1';

/**
 * A failure is `{message, status: "ERROR", guid}`:
 *
 * ```json
 * {"message":"Missing or invalid API Key","status":"ERROR","guid":"6af39fd3ea435"}
 * ```
 *
 * Captured live at a 401. **The `Accept: application/json` header is load-bearing**:
 * without it the same failed call comes back as an HTML login page, so the client
 * always sends it.
 */
export class RemarketyAPIError extends Error {
	readonly status?: number;
	/** The body's `status`, which is the string ERROR rather than a code. */
	readonly resultStatus?: string;
	/** The body's `guid`, which identifies one failure for support. */
	readonly guid?: string;
	/** Milliseconds from a Retry-After header, when Remarkety sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			resultStatus?: string;
			guid?: string;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RemarketyAPIError';
		this.status = options.status;
		this.resultStatus = options.resultStatus;
		this.guid = options.guid;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The token is missing or wrong: "Missing or invalid API Key". */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** No such store, campaign or rule. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/**
	 * A body Remarkety refused. The email-template route answers a 400 with an
	 * `errors` array, which `errors` carries when it is present.
	 */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}
}

/**
 * Reads a failure body. The email-template route nests individual problems under
 * `errors[].msg`, so those are collected too.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): {
	message?: string;
	status?: string;
	guid?: string;
	errors?: string[];
} {
	const record = asRecord(body);
	if (!record) return {};
	const message = record.message;
	const status = record.status;
	const guid = record.guid;
	const rawErrors = record.errors;
	const errors = Array.isArray(rawErrors)
		? rawErrors
				.map((entry) => {
					const problem = asRecord(entry);
					const msg = problem?.msg ?? problem?.message;
					return typeof msg === 'string' && msg.length > 0 ? msg : undefined;
				})
				.filter((entry): entry is string => entry !== undefined)
		: undefined;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		status:
			typeof status === 'string' && status.length > 0 ? status : undefined,
		guid: typeof guid === 'string' && guid.length > 0 ? guid : undefined,
		errors: errors && errors.length > 0 ? errors : undefined,
	};
}

/**
 * Builds the message for an error body, appending the individual `errors` and the
 * `guid` when either is present — the guid is what support asks for.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRemarketyError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message, errors, guid } = failure(body);
	const text = message ?? fallback;
	const head = status === undefined ? text : `Remarkety ${status}: ${text}`;
	const withErrors = errors ? `${head} (${errors.join('; ')})` : head;
	return guid ? `${withErrors} [guid ${guid}]` : withErrors;
}

/**
 * True when a body is Remarkety's failure envelope rather than data. A successful
 * store or campaign has no `status` field, so `status: "ERROR"` is unambiguous.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function isRemarketyFailure(body: unknown): boolean {
	return failure(body).status === 'ERROR';
}

/** A query value. The product search takes `q`, `limit`, `page` and `minUpdate`. */
export type RemarketyQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RemarketyRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	/** Path below `/api/v1`, starting with a slash. */
	path: string;
	query?: RemarketyQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * Remarkety documents no rate limit and no Retry-After. A 429 is honoured if one
 * ever arrives and the backoff is exponential otherwise.
 */
const REMARKETY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The token goes in `X-Token`, which the Swagger document names first. It also
 * accepts `token` as a query parameter, but a key in a URL is logged by every
 * proxy, so the header is used.
 *
 * `Accept: application/json` is sent on every call: without it a refusal comes
 * back as an HTML login page rather than the JSON error envelope.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: REMARKETY_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', 'X-Token': apiKey },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRemarketyRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RemarketyRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	let raw: unknown;
	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		raw = await request<unknown>(configWith(apiKey), requestOptions, {
			rateLimitConfig: REMARKETY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the X-Token header, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RemarketyAPIError(
				describeRemarketyError(error.status, error.body, error.message),
				{
					status: error.status,
					resultStatus: fields.status,
					guid: fields.guid,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RemarketyAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RemarketyAPIError('Unknown Remarkety error', {
			method,
			replayable,
		});
	}

	// A failure that arrived with a 200 is thrown here rather than handed to the
	// output schema, which would accept it as a record.
	if (isRemarketyFailure(raw)) {
		const fields = failure(raw);
		throw new RemarketyAPIError(
			describeRemarketyError(undefined, raw, 'refused'),
			{
				resultStatus: fields.status,
				guid: fields.guid,
				method,
				replayable,
			},
		);
	}

	return raw;
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
