import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GOOGLE_ADMIN_API_BASE =
	'https://admin.googleapis.com/admin/directory/v1';

// The Directory API answers a 429 for concurrent-request limits and a 403 with
// `userRateLimitExceeded` or `quotaExceeded` for per-user limits. Google asks
// callers to back off exponentially, and sends no Retry-After on either.
const GOOGLE_ADMIN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Retries belong to error-handlers.ts, which knows which failures are safe
	// to repeat. The config still reads Retry-After when Google sends one.
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status, body) =>
		status === 429 ||
		(status === 403 && isRateLimitReason(readErrorReason(body))),
};

/**
 * The `errors[0].reason` code, or `error.status`, of Google's error envelope.
 *
 * unknown: an error body is untyped until this narrows it, and a proxy can
 * answer with HTML or text instead of Google's envelope.
 */
function readErrorReason(
	body: unknown, // unknown: an error body is untyped until narrowed below.
): string | undefined {
	if (body === null || typeof body !== 'object') return undefined;
	const error = (body as { error?: unknown }).error; // unknown: envelope member.
	if (error === null || typeof error !== 'object') return undefined;
	// unknown: `errors` is an array of objects in Google's envelope, and
	// anything else on a gateway response.
	const record = error as { status?: unknown; errors?: unknown }; // unknown: gateway body.
	if (Array.isArray(record.errors)) {
		const first: unknown = record.errors[0]; // unknown: element before checking.
		if (first !== null && typeof first === 'object') {
			const reason = (first as { reason?: unknown }).reason; // unknown: reason field.
			if (typeof reason === 'string') return reason;
		}
	}
	return typeof record.status === 'string' ? record.status : undefined;
}

/**
 * The 403 reasons that mean "slow down" rather than "not allowed".
 *
 * `userRateLimitExceeded` is the per-user query limit, and `quotaExceeded` is a
 * concurrency limit; Google's guidance for both is exponential backoff.
 * `dailyLimitExceeded` and `limitExceeded` are exhausted quotas for the day, so
 * they are deliberately absent: waiting out a backoff cannot fix those.
 */
const RATE_LIMIT_REASONS = new Set([
	'userRateLimitExceeded',
	'quotaExceeded',
	'rateLimitExceeded',
]);

export function isRateLimitReason(reason: string | undefined): boolean {
	return reason !== undefined && RATE_LIMIT_REASONS.has(reason);
}

/**
 * The reason code on a failure, for the error handlers to match.
 *
 * unknown: a caught value can be anything at runtime; only an ApiError carries
 * a provider body, and anything else has no reason code.
 */
export function readFailureReason(
	error: unknown, // unknown: a caught value can be anything at runtime.
): string | undefined {
	return error instanceof ApiError ? readErrorReason(error.body) : undefined;
}

export type GoogleAdminQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type GoogleAdminRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** A path relative to the API base, with every segment already encoded. */
	path: string;
	query?: GoogleAdminQuery;
	body?: unknown; // unknown: each endpoint builds this from a zod-parsed input.
};

/**
 * A failure that never reached Google: a dropped connection, a DNS failure, a
 * timeout or an abort. It carries the request method so the error handlers can
 * replay a read and leave a write alone, which a bare TypeError cannot.
 */
export class GoogleAdminTransportError extends Error {
	readonly method: GoogleAdminRequest['method'];

	constructor(
		message: string,
		method: GoogleAdminRequest['method'],
		cause: Error,
	) {
		super(message, { cause });
		this.name = 'GoogleAdminTransportError';
		this.method = method;
	}
}

/**
 * Sends one Directory API request.
 *
 * core's ApiError is rethrown untouched (R8): its `status` and `retryAfter` are
 * what the error handlers match and what core reads to refresh the OAuth token
 * after a 401. Wrapping it would hide both. Anything else failed before a
 * response arrived, so it becomes a GoogleAdminTransportError.
 *
 * unknown: the resolved value is the raw response body. Callers parse it with
 * the endpoint's zod output schema, and it is undefined for the operations that
 * answer with an empty body.
 */
export async function makeGoogleAdminRequest(
	token: string,
	{ method, path, query, body }: GoogleAdminRequest,
): Promise<unknown> {
	// unknown: parsed by the caller's output schema.
	const config: OpenAPIConfig = {
		BASE: GOOGLE_ADMIN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType:
			method === 'GET' || method === 'DELETE'
				? undefined
				: 'application/json; charset=utf-8',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			// unknown: untyped body.
			rateLimitConfig: GOOGLE_ADMIN_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw error;
		// DOMException (a timeout or abort) can fail `instanceof Error` across
		// realms, so both are accepted.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GoogleAdminTransportError(error.message, method, error);
		}
		throw new GoogleAdminTransportError(
			'Unknown transport failure',
			method,
			new Error('Unknown'),
		);
	}
}

/** Encodes one path segment: user, group, member and alias keys can be emails. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Encodes an organizational unit path for the `{+orgUnitPath}` expansion, which
 * keeps the slashes. The path parameter is documented as the full path minus
 * its leading slash, e.g. `engineering/apps`.
 */
export function orgUnitSegment(path: string): string {
	return path
		.split('/')
		.filter((part) => part.length > 0)
		.map((part) => encodeURIComponent(part))
		.join('/');
}
