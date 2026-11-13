import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Every service sits under `/rpvWebService/<Script>.php`. The docs write the host
 * as `api.realvalidation.com`, which is the company's registered name
 * (RealValidation, Inc.); `api.realphonevalidation.com` does not resolve.
 */
export const REALPHONEVALIDATION_API_BASE =
	'https://api.realvalidation.com/rpvWebService';

export type RealPhoneValidationService =
	| 'TurboV3.php'
	| 'Turbo.php'
	| 'RealPhoneValidationTurbo.php'
	| 'RealPhoneValidationScrub.php'
	| 'ScrubPlus.php'
	| 'RealPhoneValidationActive.php'
	| 'WirelessID.php'
	| 'DNCLookup.php'
	| 'DNCPlus.php'
	| 'RealPhoneValidationFraudChk.php'
	| 'ReassignedNumberLookup.php'
	| 'EmailVerify.php';

/**
 * A phone-validation answer is not always a success. Most services report a bad
 * request *inside* the response body with a `200`-shaped envelope:
 *
 * ```json
 * { "status": "invalid phone", "error_text": {} }
 * { "status": "ERROR", "error_text": "missing token" }
 * { "RESPONSECODE": "-1", "RESPONSEMSG": "unauthorized" }
 * ```
 *
 * An unrecognised token is `unauthorized` in the body, and the only failures with
 * a non-2xx status are the documented `403` for throttling and whatever the load
 * balancer returns. So the body is read, not just the status.
 */
export class RealPhoneValidationAPIError extends Error {
	readonly status?: number;
	/**
	 * The service's own status word, when the body carried one: `ERROR`,
	 * `unauthorized`, `invalid phone` and so on.
	 */
	readonly serviceStatus?: string;
	/** The body's `error_text` or `RESPONSEMSG`, when it said anything. */
	readonly detail?: string;
	/** Milliseconds from a Retry-After header, when the host sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;
	/** The service the call was for, such as Turbo.php. */
	readonly service?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			serviceStatus?: string;
			detail?: string;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
			service?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RealPhoneValidationAPIError';
		this.status = options.status;
		this.serviceStatus = options.serviceStatus;
		this.detail = options.detail;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
		this.service = options.service;
	}

	/**
	 * The token was not accepted. Every service says so in the body, as
	 * `unauthorized`, `ERROR` with `"missing token"`, `RESPONSECODE: "-1"` with
	 * `RESPONSEMSG: "unauthorized"`, or a `102` for an exhausted balance.
	 */
	get isAuthError(): boolean {
		if (this.status === 401) return true;
		// Code 102 is an exhausted balance, not a bad token, and its message
		// ("The user is invalid") would otherwise match the detail check below.
		if (this.serviceStatus === '102') return false;
		if (this.serviceStatus === 'unauthorized') return true;
		const detail = this.detail?.toLowerCase() ?? '';
		return (
			detail.includes('token') ||
			detail.includes('unauthorized') ||
			detail.includes('suspended') ||
			detail.includes('user is invalid')
		);
	}

	/**
	 * The token is fine but the account is out of balance. The email service
	 * uses 102 for a malformed address instead, so 102 means a balance only on
	 * the phone routes.
	 */
	get isQuotaError(): boolean {
		if (this.service === 'EmailVerify.php' && this.serviceStatus === '102') {
			return false;
		}
		return (
			this.serviceStatus === '102' ||
			(this.detail?.toLowerCase().includes('balance') ?? false)
		);
	}

	/**
	 * A phone or email the service could not read: `invalid phone`,
	 * `invalid-format`, `invalid-phone`, `bad-zip-code`, `-1` for a missing
	 * number, or the email service's `-1` and `102` for a malformed address. A
	 * `-1` whose message is `server-unavailable` or `timeout` is an outage, not a
	 * bad value.
	 */
	get isValidationError(): boolean {
		if (this.status === 400 || this.status === 422) return true;
		if (this.isServerError) return false;
		const status = this.serviceStatus;
		if (this.service === 'EmailVerify.php' && status === '102') return true;
		return (
			status === 'invalid phone' ||
			status === 'invalid-format' ||
			status === 'invalid-phone' ||
			status === 'bad-zip-code' ||
			status === '-1'
		);
	}

	/**
	 * The documented `403` is the load balancer refusing more than the recommended
	 * 10 calls a second, not a permission problem; the services have no
	 * permission model beyond the token itself.
	 */
	get isRateLimit(): boolean {
		return this.status === 403 || this.status === 429;
	}

	/**
	 * The service itself was unreachable: `server-unavailable` as the status, or
	 * as the message of a `-1` (Wireless ID, email), or the email service's
	 * `timeout`.
	 */
	get isServerError(): boolean {
		const detail = this.detail?.toLowerCase();
		return (
			(this.status ?? 0) >= 500 ||
			this.serviceStatus === 'server-unavailable' ||
			detail === 'server-unavailable' ||
			detail === 'timeout'
		);
	}
}

/**
 * Reads a failure body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): {
	status?: string;
	detail?: string;
	retval?: string;
} {
	const record = asRecord(body);
	if (!record) return {};

	// The email service reports a failed request with `retval: "-1"` (or `102`
	// for a malformed address) and no `status` at all, so this is the only
	// signal it gives that nothing ran.
	const rawRetval = record.retval;
	const retval =
		typeof rawRetval === 'string'
			? rawRetval
			: typeof rawRetval === 'number'
				? String(rawRetval)
				: undefined;

	// The services disagree on the key and its case: lowercase `status` on the
	// Turbo, Scrub, DNC Plus and email routes, uppercase `RESPONSECODE` on
	// Wireless ID, DNC Lookup, Active and Reassigned Number.
	const rawStatus = record.status ?? record.RESPONSECODE;
	const status =
		typeof rawStatus === 'string' && rawStatus.length > 0
			? rawStatus
			: typeof rawStatus === 'number'
				? String(rawStatus)
				: undefined;

	// `error_text` is `{}` when there is no error, a string when there is, and
	// absent on some routes; `RESPONSEMSG` is the other spelling.
	const rawDetail = record.error_text ?? record.RESPONSEMSG ?? record.error;
	const detail =
		typeof rawDetail === 'string' && rawDetail.trim().length > 0
			? rawDetail
			: undefined;

	return { status, detail, retval };
}

/**
 * Builds the message for an error body. The service's own status word is the most
 * useful part, so it comes first.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRealPhoneValidationError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { status: serviceStatus, detail } = failure(body);
	// The service's own word is the most specific label, so it wins over the HTTP
	// status even when it is also the text.
	const text = detail ?? serviceStatus ?? fallback;
	const label =
		serviceStatus !== undefined
			? `RealPhoneValidation ${serviceStatus}`
			: status === undefined
				? 'RealPhoneValidation'
				: `RealPhoneValidation ${status}`;
	return `${label}: ${text}`;
}

/**
 * True when an answer, though a 2xx, is a refusal the services express in the
 * body. Callers use this to decide whether to hand back a result or throw.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function readServiceRefusal(body: unknown): {
	refused: boolean;
	status?: string;
	detail?: string;
} {
	const { status, detail, retval } = failure(body);
	// The email service's only failure signals are retval -1 and 102.
	if (status === undefined) {
		return retval === '-1' || retval === '102'
			? { refused: true, status: retval, detail }
			: { refused: false };
	}
	const lowered = status.toLowerCase();
	// A connection status word is the answer, not a refusal.
	const refused =
		lowered === 'error' ||
		lowered === 'unauthorized' ||
		lowered === '-1' ||
		lowered === '102' ||
		lowered === 'invalid phone' ||
		lowered === 'invalid-format' ||
		lowered === 'invalid-phone' ||
		lowered === 'bad-zip-code' ||
		lowered === 'server-unavailable';
	return { refused, status, detail };
}

/** A query value; every service takes flat strings. */
export type RealPhoneValidationQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RealPhoneValidationRequest = {
	method: 'GET' | 'POST';
	query?: RealPhoneValidationQuery;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * The docs recommend **10 calls per second** and answer a burst with a `403`.
 * There is no Retry-After documented, so the handler backs off on its own and
 * uses the header only if one arrives.
 */
const REALPHONEVALIDATION_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	// corsair/http reads Retry-After only from a response this matches. With
	// maxRetries 0 it never retries here: the 403 is also what the load balancer
	// answers to a malformed token, so error-handlers.ts decides on retries.
	isRateLimitError: (status) => status === 403 || status === 429,
};

/**
 * The token travels as the `token` query parameter, which is the only transport
 * these services support: they predate bearer headers and the docs' examples all
 * use `?token=`. It is therefore in the URL, which the overview warns about.
 */
function config(): OpenAPIConfig {
	return {
		BASE: REALPHONEVALIDATION_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRealPhoneValidationRequest(
	apiKey: string,
	service: RealPhoneValidationService,
	{ method, query, replayable }: RealPhoneValidationRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: `/${service}`,
		// `output: json` is required: omitting it returns XML, which this plugin
		// cannot parse. It is set last so a caller cannot override it.
		query: { ...query, token: apiKey, output: 'json' },
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(config(), requestOptions, {
			rateLimitConfig: REALPHONEVALIDATION_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the token in the query
			// string, so the fields the handlers need are copied and the cause is
			// dropped.
			throw new RealPhoneValidationAPIError(
				describeRealPhoneValidationError(
					error.status,
					error.body,
					error.message,
				),
				{
					status: error.status,
					serviceStatus: fields.status,
					detail: fields.detail,
					retryAfter: error.retryAfter,
					method,
					replayable,
					service,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RealPhoneValidationAPIError(error.message, {
				cause: error,
				method,
				replayable,
				service,
			});
		}
		throw new RealPhoneValidationAPIError('Unknown RealPhoneValidation error', {
			method,
			replayable,
			service,
		});
	}
}

/**
 * Throws when a 2xx body is really a refusal. The services answer `200` with
 * `status: "ERROR"` or `status: "invalid phone"`, and a caller that treated those
 * as a validation result would act on a phone number nobody looked up.
 * unknown: the body is untyped until `readServiceRefusal` narrows it.
 */
export function assertNotRefused(
	body: unknown,
	service: RealPhoneValidationService,
	request: { method: 'GET' | 'POST'; replayable: boolean },
): void {
	const { refused, status, detail } = readServiceRefusal(body);
	if (!refused) return;
	throw new RealPhoneValidationAPIError(
		describeRealPhoneValidationError(undefined, body, 'refused'),
		{
			serviceStatus: status,
			detail,
			method: request.method,
			replayable: request.replayable,
			service,
		},
	);
}
