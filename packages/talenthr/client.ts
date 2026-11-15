import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TALENTHR_API_BASE = 'https://pubapi.talenthr.io/v1';

/**
 * TalentHR answers `{ success: false, error: { message, code, hr_code,
 * hr_code_key } }` and repeats the HTTP status in `error.code`. A bad key
 * arrives as a 401 carrying `not_found_tenancy`, which reads like a missing
 * tenant rather than a rejected key, so the status is what identifies auth
 * failures and the body only supplies the message.
 * https://apidocs.talenthr.io
 */
export class TalentHRAPIError extends Error {
	readonly status?: number;
	/** TalentHR's own `error.code`, which repeats the HTTP status. */
	readonly code?: number;
	/** TalentHR's `error.hr_code`, e.g. 40 for `not_found_tenancy`. */
	readonly hrCode?: number;
	/** TalentHR's `error.hr_code_key`, e.g. `not_found_tenancy`. */
	readonly hrCodeKey?: string;
	/** Milliseconds from a Retry-After header, when TalentHR sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: number;
			hrCode?: number;
			hrCodeKey?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TalentHRAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.code = options.code;
		this.hrCode = options.hrCode;
		this.hrCodeKey = options.hrCodeKey;
	}

	/**
	 * True when the request carried a valid-looking key but the tenant behind
	 * it does not exist. TalentHR sends this as a 401, so a handler that
	 * matches every 401 would otherwise report a working key as rejected.
	 */
	get isTenantNotFound(): boolean {
		return this.hrCodeKey === 'not_found_tenancy';
	}

	/**
	 * A 401 whose body names a missing tenant still means the key was refused.
	 * Keeping the two readings separate lets a handler match either one.
	 */
	get isAuthError(): boolean {
		return this.status === 401;
	}
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. TalentHR documents 2000 requests per
// minute per key and no Retry-After header.
const TALENTHR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

type TalentHRErrorDetails = {
	message?: string;
	code?: number;
	hrCode?: number;
	hrCodeKey?: string;
};

// unknown: the body is untyped until asRecord narrows it; a proxy can answer
// with HTML or text instead of TalentHR's JSON envelope.
function readErrorDetails(body: unknown): TalentHRErrorDetails {
	const record = asRecord(body);
	const error = asRecord(record?.error);
	if (!error) return {};

	const message = error.message;
	const code = error.code;
	const hrCode = error.hr_code;
	const hrCodeKey = error.hr_code_key;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		code: typeof code === 'number' ? code : undefined,
		hrCode: typeof hrCode === 'number' ? hrCode : undefined,
		hrCodeKey:
			typeof hrCodeKey === 'string' && hrCodeKey.length > 0
				? hrCodeKey
				: undefined,
	};
}

// unknown: same open error body as readErrorDetails.
export function describeTalentHRError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const details = readErrorDetails(body);
	const text = details.message ?? fallback;
	const label = [status, details.hrCodeKey]
		.filter((p) => p !== undefined)
		.join(' ');
	return label ? `TalentHR ${label}: ${text}` : text;
}

export type TalentHRQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type TalentHRRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: TalentHRQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * Multipart bodies go through `formData` because corsair/http only encodes
	 * a JSON body, and `booking.create` is documented as form-data.
	 */
	formData?: Record<string, string | number | boolean | undefined>;
};

/**
 * TalentHR authenticates with HTTP Basic, where the API key is the username
 * and the password is irrelevant (the docs send a random string, and an empty
 * one is accepted). corsair/http only builds a Basic header when both
 * USERNAME and PASSWORD are non-empty, so the header is built here and TOKEN
 * stays unset.
 */
export function basicAuthHeader(apiKey: string): string {
	return `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
}

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined where the route answers with no body.
export async function makeTalentHRRequest(
	apiKey: string,
	{ method, path, query, body, formData }: TalentHRRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TALENTHR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: basicAuthHeader(apiKey),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: formData === undefined ? body : undefined,
		formData,
		// A multipart request must not carry a Content-Type: fetch writes the
		// boundary itself, and setting the header by hand breaks the parse.
		mediaType:
			formData !== undefined
				? undefined
				: body === undefined
					? undefined
					: 'application/json',
	};

	try {
		// unknown: the response shape is the endpoint's concern, not the
		// client's; the caller parses it with its zod output schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TALENTHR_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const details = readErrorDetails(error.body);
			throw new TalentHRAPIError(
				describeTalentHRError(error.status, error.body, error.message),
				{
					cause: error,
					code: details.code,
					hrCode: details.hrCode,
					hrCodeKey: details.hrCodeKey,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TalentHRAPIError(error.message, {
				cause: error instanceof Error ? error : undefined,
				method,
			});
		}
		throw new TalentHRAPIError('Unknown TalentHR error', { method });
	}
}
