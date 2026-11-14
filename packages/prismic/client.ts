import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Prismic has two APIs on two hosts, with different contracts:
 *
 * - The **Content API** reads published documents from
 *   `https://<repository>.prismic.io/api/v2`. It needs no credential for a public
 *   repository; a private one needs the repository's access token as `access_token`.
 * - The **Migration API** writes documents to `https://migration.prismic.io`. It
 *   needs a write token in `Authorization: Bearer <token>` and the repository id in
 *   a `repository` header.
 */
export const PRISMIC_CONTENT_HOST_SUFFIX = '.prismic.io';
export const PRISMIC_MIGRATION_BASE = 'https://migration.prismic.io';

/** The Content API allows 200 requests per second per repository. */
const PRISMIC_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The two APIs report errors differently.
 *
 * The Content API answers `{ type, message }`, such as
 * `{"type":"api_security_error","message":"Invalid access token"}`, and a plain
 * `401` when the repository does not exist.
 *
 * The Migration API answers an **array** of `{ property, value?, error }`,
 * naming each invalid field, and a `403` with
 * `{"Message":"User is not authorized ..."}` for a bad write token. Its 429 is
 * `{"message":"Rate limit exceeded.","request_id":"..."}`.
 */
export class PrismicAPIError extends Error {
	readonly status?: number;
	/** The stable error kind, such as `api_security_error`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Prismic sent one. */
	readonly retryAfter?: number;
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached Prismic (DNS, reset, abort). */
	readonly transport: boolean;
	/** Set when Prismic rejected the credential rather than the request. */
	readonly credentialsRejected: boolean;
	/** Per-field rejections the Migration API reported, when it sent them. */
	readonly fieldErrors?: { property: string; error: string }[];

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			transport?: boolean;
			credentialsRejected?: boolean;
			fieldErrors?: { property: string; error: string }[];
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'PrismicAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.credentialsRejected = options.credentialsRejected ?? false;
		this.fieldErrors = options.fieldErrors;
	}
}

/** Unparsed bodies: an error body before a guard narrows it, and a response
 * body before the caller's output schema parses it. */
type Untyped = unknown; // unknown: see the note above.

function asRecord(value: Untyped): Record<string, Untyped> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, Untyped>)
		: undefined;
}

function readString(
	record: Record<string, Untyped> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** The Content API's error kind, such as `api_security_error`. */
export function readErrorType(body: Untyped): string | undefined {
	return readString(asRecord(body), 'type');
}

/**
 * The human message, from whichever shape arrived. The Content API sends
 * `message`, the Migration API sends `Message` on a 403 and `message` on a 429.
 */
export function readErrorMessage(body: Untyped): string | undefined {
	const record = asRecord(body);
	return readString(record, 'message') ?? readString(record, 'Message');
}

/** The per-field rejections the Migration API sends as an array. */
export function readFieldErrors(
	body: Untyped,
): { property: string; error: string }[] | undefined {
	if (!Array.isArray(body)) return undefined;
	const entries: { property: string; error: string }[] = [];
	for (const item of body) {
		const record = asRecord(item);
		const property = readString(record, 'property');
		const error = readString(record, 'error');
		if (property !== undefined && error !== undefined) {
			entries.push({ property, error });
		}
	}
	return entries.length > 0 ? entries : undefined;
}

/**
 * A credential rejection is the Content API's `api_security_error` on a 401, or
 * the Migration API's access-denied `403`. The Migration API's 429 is a rate
 * limit, not a credential problem.
 */
export function isCredentialRejection(
	status: number | undefined,
	body: Untyped,
): boolean {
	if (status === 401) return true;
	if (status !== 403) return false;
	const message = readErrorMessage(body);
	return message !== undefined && /not authorized|accessdenied/i.test(message);
}

export function describePrismicError(
	status: number | undefined,
	body: Untyped,
	fallback: string,
): string {
	const fieldErrors = readFieldErrors(body);
	if (fieldErrors) {
		// A field rejection names each bad property, which is what a caller needs.
		const summary = fieldErrors
			.slice(0, 3)
			.map((entry) => `${entry.property}: ${entry.error}`)
			.join('; ');
		const label = status === undefined ? '' : `Prismic ${status}: `;
		return `${label}${summary}`;
	}
	const message = readErrorMessage(body) ?? fallback;
	const type = readErrorType(body);
	const label = [status, type].filter((part) => part !== undefined).join(' ');
	return label ? `Prismic ${label}: ${message}` : message;
}

/** A query value; a list is sent as the repeated key PostGrid-style, no brackets. */
export type PrismicQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type PrismicRequest = {
	method: 'GET' | 'POST' | 'PUT';
	/**
	 * Which API this call is for. It decides the host, and whether the write token
	 * and `repository` header are sent, so it is stated rather than inferred from
	 * the path: both APIs take paths that start with `/`.
	 */
	api: 'content' | 'migration';
	/** A path on the chosen API, or a full path and query from `nextPagePath`. */
	url: string;
	query?: PrismicQuery;
	// unknown: each endpoint's input schema has already validated the body.
	body?: Untyped;
};

/**
 * Reads a Content API `next_page`, keeping only the path and query so the call
 * stays on the configured repository host.
 *
 * Prismic prints an absolute CDN URL, such as
 * `https://<repo>.cdn.prismic.io/api/v2/documents/search?...`, and the API answers
 * on both hosts. Only the path and query are rebuilt here, with any `access_token`
 * the URL carried preserved, since it is what authorises a private repository.
 */
export function nextPagePath(nextUrl: string): string {
	const url = new URL(nextUrl);
	const search = url.searchParams.toString();
	return search ? `${url.pathname}?${search}` : url.pathname;
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/** The Content API host for a repository id. */
export function contentBase(repository: string): string {
	return `https://${repository}${PRISMIC_CONTENT_HOST_SUFFIX}/api/v2`;
}

export type PrismicCredentials = {
	/** The write token, needed only by the Migration API. */
	writeToken?: string;
	/** The repository's access token, needed only by a private Content API. */
	accessToken?: string;
	/** The repository id, sent on Migration calls and used in the Content host. */
	repository: string;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makePrismicRequest(
	credentials: PrismicCredentials,
	{ method, api, url, query, body }: PrismicRequest,
): Promise<Untyped> {
	if (!credentials.repository.trim()) {
		throw new AuthMissingError('prismic', 'api_key');
	}

	// A Migration call is the only one that writes, and it needs the write token.
	const isMigration = api === 'migration';
	if (isMigration) {
		if (!credentials.writeToken?.trim()) {
			throw new AuthMissingError('prismic', 'api_key');
		}
		if (/[\r\n]/.test(credentials.writeToken)) {
			throw new PrismicAPIError('The write token must not contain newlines');
		}
	}

	const headers: Record<string, string> = { Accept: 'application/json' };
	if (isMigration && credentials.writeToken) {
		headers.Authorization = `Bearer ${credentials.writeToken}`;
		headers.repository = credentials.repository;
	}
	if (body !== undefined) headers['Content-Type'] = 'application/json';

	const config: OpenAPIConfig = {
		BASE: isMigration
			? PRISMIC_MIGRATION_BASE
			: contentBase(credentials.repository),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url,
		// A private repository needs the access token on every read.
		query:
			isMigration || !credentials.accessToken
				? query
				: { ...query, access_token: credentials.accessToken },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the caller's output schema parses the body returned here.
		return await request<Untyped>(config, requestOptions, {
			rateLimitConfig: PRISMIC_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new PrismicAPIError(
				describePrismicError(error.status, error.body, error.statusText),
				{
					status: error.status,
					code: readErrorType(error.body),
					retryAfter: error.retryAfter,
					method,
					credentialsRejected: isCredentialRejection(error.status, error.body),
					fieldErrors: readFieldErrors(error.body),
				},
			);
		}
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new PrismicAPIError(error.message, {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new PrismicAPIError('Unknown Prismic error', {
			method,
			transport: true,
		});
	}
}
