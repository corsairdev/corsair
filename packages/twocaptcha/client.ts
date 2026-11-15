import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TWOCAPTCHA_API_BASE = 'https://2captcha.com';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale, so a partial one either skips the
// rate-limit block or throws reading `headerNames`.
const TWOCAPTCHA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * 2Captcha answers HTTP 200 for almost everything and puts the outcome in
 * `status`: `1` is success and `0` is failure, with the reason in `request` and
 * a human message in `error_text`. A wrong key, a bad body and an unsolved
 * captcha all arrive as 200.
 *
 * `getTaskResult` is the one exception worth knowing: while a task is still
 * being solved it answers `status: 0` with `request: 'CAPCHA_NOT_READY'`, which
 * is not an error at all but a "poll again" answer. The endpoint therefore
 * returns that state rather than throwing.
 */
export class TwoCaptchaAPIError extends Error {
	readonly status?: number;
	/** The provider's machine-readable reason, such as `ERROR_WRONG_USER_KEY`. */
	readonly code?: string;
	/** The provider's human-readable text, when it sent one. */
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
			code?: string;
			providerMessage?: string;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TwoCaptchaAPIError';
		this.status = options.status;
		this.code = options.code;
		this.providerMessage = options.providerMessage;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
	}

	get isRateLimit(): boolean {
		return (
			this.status === 429 ||
			this.code === 'ERROR_TOO_MANY_REQUESTS' ||
			this.code === 'ERROR_NO_SLOT_AVAILABLE'
		);
	}

	/** The account balance cannot cover the task. No retry helps. */
	get isInsufficientBalance(): boolean {
		return this.code === 'ERROR_ZERO_BALANCE';
	}

	/** The key is wrong, malformed, or has no account. */
	get isAuthError(): boolean {
		return (
			this.code === 'ERROR_WRONG_USER_KEY' ||
			this.code === 'ERROR_KEY_DOES_NOT_EXIST'
		);
	}

	/** The captcha could not be solved. The task is still billable. */
	get isUnsolved(): boolean {
		return this.code === 'ERROR_CAPTCHA_UNSOLVABLE';
	}
}

/**
 * Reads the `{ status, request, error_text }` envelope. A `status` of `1` means
 * success and `request` holds the payload; `0` means `request` holds the code.
 */
export type TwoCaptchaEnvelope = {
	ok: boolean;
	/** The payload on success: a task id, a token, or a balance. */
	value?: string;
	/** The provider's code on failure, or `CAPCHA_NOT_READY` while solving. */
	code?: string;
	errorText?: string;
};

// unknown: the body is the JSON envelope, a bare string when `json: 0` was used,
// or a proxy page.
export function readEnvelope(body: unknown): TwoCaptchaEnvelope {
	if (typeof body === 'string') {
		const trimmed = body.trim();
		if (trimmed === 'OK' || trimmed.startsWith('OK|')) {
			return { ok: true, value: trimmed.slice(3) };
		}
		const [code, ...rest] = trimmed.split('|');
		return { ok: false, code, errorText: rest.join('|') || undefined };
	}
	const record = asRecord(body);
	const status = record?.status;
	const request = record?.request;
	const value =
		typeof request === 'string'
			? request
			: request === null
				? undefined
				: undefined;
	const raw = typeof request === 'number' ? String(request) : value;
	if (status === 1) return { ok: true, value: raw };
	if (status === 0 || status === undefined) {
		return {
			ok: false,
			code: raw,
			errorText:
				typeof record?.error_text === 'string' ? record.error_text : undefined,
		};
	}
	return { ok: false, code: raw };
}

/** True for the "keep polling" answer from `getTaskResult`. */
export function isNotReady(envelope: TwoCaptchaEnvelope): boolean {
	return !envelope.ok && envelope.code === 'CAPCHA_NOT_READY';
}

export function describeTwoCaptchaError(
	status: number | undefined,
	// unknown: the body is the envelope, a bare string, or a proxy page.
	body: unknown,
	fallback: string,
): { message: string; code?: string; providerMessage?: string } {
	const envelope = readEnvelope(body);
	const text = envelope.errorText ?? fallback;
	const label = [status, envelope.code]
		.filter((p) => p !== undefined)
		.join(' ');
	return {
		message: label ? `2Captcha ${label}: ${text}` : text,
		code: envelope.code,
		providerMessage: envelope.errorText,
	};
}

/**
 * 2Captcha takes every request as a form POST or query string, never JSON, and
 * `key` is one of the few names `ApiError` redacts from a query string. The body
 * is where a caller's captcha parameters travel, so this error never keeps the
 * cause or the body.
 */
export type TwoCaptchaRequest = {
	method: 'GET' | 'POST';
	path: string;
	/** Query values, used by the `res.php` actions. */
	query?: Record<string, string | number | boolean | undefined>;
	/** Form values, used by `in.php` and the task API. */
	formData?: Record<string, string | number | boolean | undefined>;
};

export async function makeTwoCaptchaRequest(
	apiKey: string,
	{ method, path, query, formData }: TwoCaptchaRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TWOCAPTCHA_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, key: apiKey, json: 1 },
		formData: formData === undefined ? undefined : { ...formData, key: apiKey },
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TWOCAPTCHA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof TwoCaptchaAPIError) throw error;
		if (error instanceof ApiError) {
			// The cause is dropped: it holds the form body, which carries the
			// captcha parameters and the key, and ApiError redacts neither.
			const described = describeTwoCaptchaError(
				error.status,
				error.body,
				error.message,
			);
			throw new TwoCaptchaAPIError(described.message, {
				status: error.status,
				code: described.code,
				providerMessage: described.providerMessage,
				retryAfter: error.retryAfter,
				method,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TwoCaptchaAPIError(error.message, { method });
		}
		throw new TwoCaptchaAPIError('Unknown 2Captcha error', { method });
	}
}
