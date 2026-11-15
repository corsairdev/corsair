import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Every method is called as `https://api.unisender.com/{lang}/api/{method}`, with
 * the key and arguments as form fields. The docs recommend POST over GET because
 * GET arguments are written to server logs, so every call here is a POST.
 */
export const UNISENDER_API_BASE = 'https://api.unisender.com';
export const UNISENDER_API_LANG = 'en';

/**
 * A refusal is a flat object with a slug `code` and a human `error` that carries
 * Ramp-style error ids:
 *
 * ```json
 * {"error":"Error ID:8446F32E…. There is no user with api_key 'BADKEY'","code":"invalid_api_key"}
 * {"error":"Error ID:84998422…. Access Denied.","code":"access_denied"}
 * ```
 *
 * Both captured live. Note the split: a **wrong key is `401` `invalid_api_key`,
 * while no key at all is `403` `access_denied`** — the reverse of what a caller
 * might assume, so `isAuthError` covers both.
 */
export class UnisenderAPIError extends Error {
	readonly status?: number;
	/** The body's `code`, such as invalid_api_key or unknown_method. */
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when Unisender sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** The Unisender method that failed, such as getLists. */
	readonly apiMethod?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			retryAfter?: number;
			method?: string;
			apiMethod?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'UnisenderAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.apiMethod = options.apiMethod;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * The key was refused. A wrong key is `invalid_api_key` at 401 and a missing one
	 * is `access_denied` at 403, so both count, and so does a key whose API access
	 * was switched off in the dashboard.
	 */
	get isAuthError(): boolean {
		return (
			this.code === 'invalid_api_key' ||
			this.code === 'access_denied' ||
			this.status === 401
		);
	}

	/** The method name does not exist, which is a code error rather than a bad key. */
	get isUnknownMethod(): boolean {
		return this.code === 'unknown_method';
	}

	/** An argument Unisender refused, such as an address that is not an email. */
	get isValidationError(): boolean {
		return this.code === 'invalid_arg' || this.status === 400;
	}

	/** The balance is spent, which no retry fixes. */
	get isQuotaError(): boolean {
		return this.code === 'not_enough_money';
	}

	/**
	 * The per-key or per-IP call limit. It is 1200 a minute generally and 60 for
	 * `sendEmail`, and Unisender names it with the `api_call_limit_exceeded_` prefix.
	 */
	get isRateLimit(): boolean {
		return (
			this.status === 429 ||
			(this.code?.startsWith('api_call_limit_exceeded') ?? false)
		);
	}

	/** A temporary failure Unisender says to retry. */
	get isRetryable(): boolean {
		return this.code === 'retry_later' || (this.status ?? 0) >= 500;
	}
}

/**
 * Reads a refusal body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): { message?: string; code?: string } {
	const record = asRecord(body);
	const error = record?.error;
	const code = record?.code;
	return {
		message: typeof error === 'string' && error.length > 0 ? error : undefined,
		code: typeof code === 'string' && code.length > 0 ? code : undefined,
	};
}

/**
 * True when a body is Unisender's error envelope. A refusal carries a string `code`,
 * and the docs show one that also includes `"result": ""`; checking `result` first
 * would treat that refusal as a success on a permissive schema such as
 * `lists.delete`. A string `code` wins over a present `result`.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function isUnisenderFailure(body: unknown): boolean {
	const record = asRecord(body);
	if (!record) return false;
	return typeof record.code === 'string' && record.code.length > 0;
}

/**
 * Builds the message for an error body. The `code` is the part a caller can act on,
 * so it goes first and the long `error` text follows.
 *
 * A wrong key is echoed verbatim in the provider's text
 * (`There is no user with api_key 'BADKEY'`), so the submitted key is redacted here.
 * Dropping the `ApiError` cause was not enough on its own: the message itself would
 * carry the key into logs and into anything that serialises the error.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeUnisenderError(
	status: number | undefined,
	body: unknown,
	fallback: string,
	apiKey?: string,
): string {
	const { message, code } = failure(body);
	const text = redactKey(message ?? fallback, apiKey);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return label ? `Unisender ${label}: ${text}` : text;
}

/** Replaces every occurrence of the submitted key with a placeholder. */
export function redactKey(text: string, apiKey?: string): string {
	if (!apiKey || apiKey.length === 0) return text;
	return text.split(apiKey).join('[redacted]');
}

/**
 * A form value. Unisender takes flat, bracketed and repeated keys. `undefined` is
 * allowed so a caller can pass an optional field through directly; `encodeForm`
 * drops it.
 */
export type UnisenderForm = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type UnisenderRequest = {
	/** The Unisender method name, such as getLists. */
	apiMethod: string;
	form: UnisenderForm;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * Unisender documents a per-key and per-IP limit (1200 a minute, 60 for sendEmail)
 * and names the exceeded code, so `corsair/http` must not retry: the handler reads
 * the code and the documented backoff. A `retry_later` is also honoured there.
 */
const UNISENDER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	// The limit arrives as a `code` in the body, which the error handlers read.
	isRateLimitError: () => false,
};

/**
 * The key travels in the form as `api_key`, which is the only transport Unisender
 * documents; a POST body keeps it out of the URL, which is why POST is used.
 */
function config(): OpenAPIConfig {
	return {
		BASE: UNISENDER_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};
}

/**
 * Encodes a form the way Unisender reads it.
 *
 * A plain key becomes `key=value`. An array becomes the repeated `key[]=value` form,
 * which its argument syntax documents. A bracketed key such as
 * `data[0][1]` is passed through as written, because
 * `URLSearchParams` would escape its brackets and Unisender would read it as one
 * literal name.
 */
export function encodeForm(form: UnisenderForm): string {
	const parts: string[] = [];
	for (const [key, value] of Object.entries(form)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const entry of value) {
				parts.push(`${encodeFormKey(`${key}[]`)}=${encodeURIComponent(entry)}`);
			}
			continue;
		}
		parts.push(`${encodeFormKey(key)}=${encodeURIComponent(String(value))}`);
	}
	return parts.join('&');
}

/**
 * Encodes a form key while keeping the bracket syntax Unisender requires.
 *
 * A caller-supplied field name reaches this as part of a bracketed key such as
 * `fields[order+id]`, and `fields` / `metadata` names are arbitrary. Passing them
 * through raw let `&`, `+` and `=` inside a name start or end a parameter, so a
 * name could add its own argument: `fields[x]&overwrite=1&y` would overwrite a
 * contact's fields on what the caller expected to be a plain subscribe. Only the
 * brackets stay literal; everything inside a segment is percent-encoded.
 */
function encodeFormKey(key: string): string {
	return key
		.split(/([[\]])/)
		.map((part) =>
			part === '[' || part === ']' ? part : encodeURIComponent(part),
		)
		.join('');
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeUnisenderRequest(
	apiKey: string,
	{ apiMethod, form, replayable }: UnisenderRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/${UNISENDER_API_LANG}/api/${apiMethod}`,
		body: `${encodeForm(form)}&format=json&api_key=${encodeURIComponent(apiKey)}`,
		mediaType: 'application/x-www-form-urlencoded',
	};

	let raw: unknown;
	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the method's shape.
		raw = await request<unknown>(config(), requestOptions, {
			rateLimitConfig: UNISENDER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the api_key in the body, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new UnisenderAPIError(
				describeUnisenderError(error.status, error.body, error.message, apiKey),
				{
					status: error.status,
					code: fields.code,
					retryAfter: error.retryAfter,
					method: 'POST',
					apiMethod,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new UnisenderAPIError(error.message, {
				cause: error,
				method: 'POST',
				apiMethod,
				replayable,
			});
		}
		throw new UnisenderAPIError('Unknown Unisender error', {
			method: 'POST',
			apiMethod,
			replayable,
		});
	}

	// A failure that arrived with a 200 is thrown here rather than handed to the
	// output schema, which would accept it as a result.
	if (isUnisenderFailure(raw)) {
		const fields = failure(raw);
		// Most refusals arrive this way (live 11-12), so the key is redacted here too.
		throw new UnisenderAPIError(
			describeUnisenderError(undefined, raw, 'refused', apiKey),
			{
				code: fields.code,
				method: 'POST',
				apiMethod,
				replayable,
			},
		);
	}

	return raw;
}
