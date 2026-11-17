import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * ProAbono serves each account from its own host, `api-<account>.proabono.com`,
 * so the base is built from the account number rather than hardcoded.
 */
export const PROABONO_HOST_SUFFIX = '.proabono.com';

/**
 * ProAbono documents no rate limit and sends no Retry-After, so handlers own the
 * retries.
 */
const PROABONO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * ProAbono answers a problem as `{ Code, Message }`, where `Code` is a stable
 * string such as `Error.AuthenticationFailed`. A **422** is the exception: it
 * carries a *list* of validation errors, which is kept as `validationErrors`.
 *
 * A **204** is a normal answer meaning "no result", so a read that finds nothing
 * is not an error.
 */
export class ProabonoAPIError extends Error {
	readonly status?: number;
	/** The stable string code, such as `Error.AuthenticationFailed`. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when ProAbono sent one. */
	readonly retryAfter?: number;
	/** The request method, so handlers can refuse to replay a write. */
	readonly method?: string;
	/** Set when the request never reached ProAbono (DNS, reset, abort). */
	readonly transport: boolean;
	/** Set when ProAbono rejected the credentials rather than the request. */
	readonly credentialsRejected: boolean;
	/** The per-field validation errors a 422 carries, when it sent them. */
	readonly validationErrors?: { Code?: string; Message?: string }[];

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
			validationErrors?: { Code?: string; Message?: string }[];
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ProabonoAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.transport = options.transport ?? false;
		this.credentialsRejected = options.credentialsRejected ?? false;
		this.validationErrors = options.validationErrors;
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

/** The stable string code, such as `Error.AuthenticationFailed`. */
export function readErrorCode(body: Untyped): string | undefined {
	return readString(asRecord(body), 'Code');
}

/** The human `Message`. */
export function readErrorMessage(body: Untyped): string | undefined {
	return readString(asRecord(body), 'Message');
}

/** The per-field errors a 422 carries, when the body is a list. */
export function readValidationErrors(
	body: Untyped,
): { Code?: string; Message?: string }[] | undefined {
	if (!Array.isArray(body)) return undefined;
	const entries: { Code?: string; Message?: string }[] = [];
	for (const item of body) {
		const record = asRecord(item);
		if (!record) continue;
		entries.push({
			Code: readString(record, 'Code'),
			Message: readString(record, 'Message'),
		});
	}
	return entries.length > 0 ? entries : undefined;
}

/**
 * The authentication failure is `Error.AuthenticationFailed` on a 401. A 403 is
 * different: ProAbono documents it for a customer with no valid payment
 * information, which is a request problem rather than a broken key.
 */
export function isCredentialRejection(
	status: number | undefined,
	body: Untyped,
): boolean {
	if (status !== 401) return false;
	const code = readErrorCode(body);
	return code === undefined || /authentication/i.test(code);
}

export function describeProabonoError(
	status: number | undefined,
	body: Untyped,
	fallback: string,
): string {
	const validationErrors = readValidationErrors(body);
	if (validationErrors) {
		const summary = validationErrors
			.slice(0, 3)
			.map((entry) => [entry.Code, entry.Message].filter(Boolean).join(' '))
			.filter((text) => text.length > 0)
			.join('; ');
		const label = status === undefined ? '' : `ProAbono ${status}: `;
		return `${label}${summary || fallback}`;
	}
	const code = readErrorCode(body);
	const message = readErrorMessage(body) ?? fallback;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `ProAbono ${label}: ${message}` : message;
}

export type ProabonoQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type ProabonoRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: ProabonoQuery;
	// unknown: each endpoint's input schema has already validated the body.
	body?: Untyped;
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * The account part of the host: letters, digits and inner hyphens only, so a
 * stored value cannot add a dot, slash, `@` or port and move the request (and
 * the Basic credentials) to another host.
 */
const ACCOUNT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

/**
 * Reads the account from what a user is likely to paste: the number itself
 * (`42`) or the whole API endpoint from the ProAbono back office
 * (`https://api-42.proabono.com`).
 */
export function normalizeAccount(value: string): string {
	const trimmed = value.trim();
	const endpoint = /^(?:https:\/\/)?api-([^/.]+)\.proabono\.com\/?$/i.exec(
		trimmed,
	);
	return endpoint?.[1] ?? trimmed;
}

/** The API host for an account number, such as `42` for `api-42.proabono.com`. */
export function apiBase(account: string): string {
	const normalized = normalizeAccount(account);
	if (!ACCOUNT_PATTERN.test(normalized)) {
		throw new ProabonoAPIError(
			'The ProAbono account must be the number in your API endpoint, such as 42 for api-42.proabono.com',
		);
	}
	return `https://api-${normalized}${PROABONO_HOST_SUFFIX}`;
}

export type ProabonoCredentials = {
	/** The agent key, sent as the HTTP Basic username. */
	agentKey: string;
	/** The API key, sent as the HTTP Basic password. */
	apiKey: string;
	/** The account number that forms the host, such as `42`. */
	account: string;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeProabonoRequest(
	credentials: ProabonoCredentials,
	{ method, path, query, body }: ProabonoRequest,
): Promise<Untyped> {
	if (!credentials.agentKey.trim() || !credentials.apiKey.trim()) {
		throw new AuthMissingError('proabono', 'api_key');
	}
	if (!credentials.account.trim()) {
		// The account number is part of the host, so there is no request without it.
		throw new AuthMissingError('proabono', 'api_key');
	}
	if (
		/[\r\n]/.test(credentials.agentKey) ||
		/[\r\n]/.test(credentials.apiKey)
	) {
		throw new ProabonoAPIError('The API keys must not contain newlines');
	}

	// ProAbono documents HTTP Basic with the agent key as username and the API
	// key as password, and both are non-empty, so core's USERNAME/PASSWORD pair
	// renders the header.
	const config: OpenAPIConfig = {
		BASE: apiBase(credentials.account.trim()),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		USERNAME: credentials.agentKey,
		PASSWORD: credentials.apiKey,
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
		// unknown: the caller's output schema parses the body returned here.
		return await request<Untyped>(config, requestOptions, {
			rateLimitConfig: PROABONO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Core's ApiError goes through (R8) so its status, Retry-After and
		// validation body stay readable to callers and handlers alike.
		if (error instanceof ApiError) throw error;
		// DOMException (fetch aborts and timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new ProabonoAPIError(error.message, {
				cause: error,
				method,
				transport: true,
			});
		}
		throw new ProabonoAPIError('Unknown ProAbono error', {
			method,
			transport: true,
		});
	}
}
