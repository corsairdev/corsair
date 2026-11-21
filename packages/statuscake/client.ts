import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const STATUSCAKE_API_BASE = 'https://api.statuscake.com/v1';

// Listing a large account pages through several requests, each of which is
// separately rate-limited; the 20 second default is tight for the whole
// chain to finish within one call.
const STATUSCAKE_TIMEOUT_MS = 60_000;

/**
 * Free plans allow 60 requests per minute and every plan has a burst limit of
 * 5 requests per second. Exceeding either answers 429, and x-ratelimit-reset
 * on every response says how many seconds until the enforced window lifts.
 * Retries themselves belong to error-handlers.ts, hence maxRetries: 0.
 * https://developers.statuscake.com/guides/api/ratelimiting
 */
const STATUSCAKE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'x-ratelimit-reset' },
};

/**
 * StatusCake error bodies say what was wrong; `errors` names each offending
 * parameter. Messages are documented as wording that may change, so nothing
 * downstream should match on the text.
 * https://developers.statuscake.com/guides/api/errors
 *
 * A failed call throws this: core's `ApiError` (R8: core and the 429 handler
 * read `status` and `retryAfter` from it), rebuilt without the request body
 * and query. Those carry contact-group emails and mobile numbers and uptime
 * basic-auth passwords, which core's own ApiError keeps on `request.body`.
 */
export class StatusCakeAPIError extends ApiError {
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
			// unknown: error bodies are usually the documented shape, but the
			// gateway answers a bare 403 with no body at all.
			body?: unknown;
			retryAfter?: number;
		},
	) {
		const url = `${STATUSCAKE_API_BASE}${options.path}`;
		super(
			{ method: options.method as ApiRequestOptions['method'], url },
			{
				url,
				ok: false,
				status: options.status,
				statusText: options.statusText ?? '',
				body: options.body,
			},
			message,
			{ retryAfter: options.retryAfter },
		);
		this.name = 'StatusCakeAPIError';
		this.method = options.method;
	}

	/**
	 * True for a bare 403: the gateway denies the request before the API app
	 * runs, answering no body at all (probed live with a bogus bearer), which
	 * reads as a bad token rather than a permission problem.
	 */
	get isAuthDenied(): boolean {
		const bare =
			this.body === undefined || this.body === null || this.body === '';
		return this.status === 403 && bare;
	}
}

export function describeStatusCakeError(
	status: number | undefined,
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const message = record?.message;
	const text =
		typeof message === 'string' && message.length > 0 ? message : fallback;
	return status === undefined ? text : `StatusCake ${status}: ${text}`;
}

export type StatusCakeQuery = Record<
	string,
	string | number | boolean | (string | number)[] | undefined
>;

/** One form field value; arrays repeat as the documented `field[]` keys. */
export type StatusCakeFormValue = string | number | boolean | undefined;

export type StatusCakeRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: StatusCakeQuery;
	/**
	 * Fields sent as an application/x-www-form-urlencoded body, the only
	 * format the API accepts. An empty array sends `field[]=`, the documented
	 * way to clear a field; an undefined field is left out and keeps its
	 * current value on an update.
	 */
	form?: Record<string, StatusCakeFormValue | (string | number)[]>;
};

/**
 * Encodes the documented field syntax: booleans as the text true/false and
 * arrays as repeated `field[]` keys. An empty array encodes as `field[]=`,
 * which the API reads as "clear this field".
 * https://developers.statuscake.com/guides/api/parameters
 */
export function encodeStatusCakeForm(
	form: StatusCakeRequest['form'],
): string | undefined {
	if (!form) return undefined;
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(form)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			const arrayKey = key.endsWith('[]') ? key : `${key}[]`;
			if (value.length === 0) {
				params.set(arrayKey, '');
				continue;
			}
			for (const item of value) {
				if (item === undefined) continue;
				params.append(arrayKey, String(item));
			}
			continue;
		}
		params.set(key, String(value));
	}
	return params.toString();
}

// unknown: the raw envelope is what the endpoint's zod output schema
// parses, so the client cannot name a stricter return type.
/**
 * Authenticated StatusCake request. Authenticates with
 * `Authorization: Bearer <token>`, sent by corsair/http through TOKEN.
 * Returns the raw JSON body: list answers carry `data` plus `metadata` and
 * `links`, and PUT/DELETE answer 204 with no body, so the endpoint's output
 * schema decides the shape.
 */
export async function makeStatusCakeRequest(
	apiToken: string,
	{ method, path, query, form }: StatusCakeRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: STATUSCAKE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: STATUSCAKE_TIMEOUT_MS,
		TOKEN: apiToken,
		HEADERS: { Accept: 'application/json' },
	};

	const body = encodeStatusCakeForm(form);
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType:
			body === undefined ? undefined : 'application/x-www-form-urlencoded',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: STATUSCAKE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (contact details and passwords in the
			// form body); status, retryAfter and the response body carry over.
			throw new StatusCakeAPIError(
				describeStatusCakeError(error.status, error.body, error.message),
				{
					method,
					path,
					status: error.status,
					statusText: error.statusText,
					body: error.body,
					retryAfter: error.retryAfter,
				},
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
