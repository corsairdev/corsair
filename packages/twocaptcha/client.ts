import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TWOCAPTCHA_API_BASE = 'https://api.2captcha.com';

/** The API v2 methods this plugin calls; each one is `POST /<method>`. */
export type TwoCaptchaMethod =
	| 'createTask'
	| 'getTaskResult'
	| 'getBalance'
	| 'reportCorrect'
	| 'reportIncorrect';

/**
 * 2Captcha's API v2 answers HTTP 200 for almost everything and reports the
 * outcome in `errorId`: `0` is success; anything else is a failure, with the
 * reason in `errorCode` (such as `ERROR_KEY_DOES_NOT_EXIST`) and a message in
 * `errorDescription`. https://2captcha.com/api-docs/error-codes
 */
export class TwoCaptchaAPIError extends Error {
	/** The provider's numeric error id. */
	readonly errorId?: number;
	/** The provider's machine-readable reason, such as `ERROR_ZERO_BALANCE`. */
	readonly code?: string;
	/** The provider's human-readable text, when it sent one. */
	readonly providerMessage?: string;
	/** The API method that failed. */
	readonly method?: TwoCaptchaMethod;

	constructor(
		message: string,
		options: {
			errorId?: number;
			code?: string;
			providerMessage?: string;
			method?: TwoCaptchaMethod;
		} = {},
	) {
		super(message);
		this.name = 'TwoCaptchaAPIError';
		this.errorId = options.errorId;
		this.code = options.code;
		this.providerMessage = options.providerMessage;
		this.method = options.method;
	}

	/** The queue is full or the bid too low: wait and try again. */
	get isRateLimit(): boolean {
		return this.code === 'ERROR_NO_SLOT_AVAILABLE';
	}

	/** The account balance cannot cover the task. No retry helps. */
	get isInsufficientBalance(): boolean {
		return this.code === 'ERROR_ZERO_BALANCE';
	}

	/** The key is wrong or the account cannot use the API. */
	get isAuthError(): boolean {
		return (
			this.code === 'ERROR_KEY_DOES_NOT_EXIST' ||
			this.code === 'ERROR_IP_NOT_ALLOWED' ||
			this.code === 'ERROR_IP_BLOCKED' ||
			this.code === 'ERROR_ACCOUNT_SUSPENDED'
		);
	}

	/** The workers could not solve it. 2Captcha returns the price. */
	get isUnsolved(): boolean {
		return this.code === 'ERROR_CAPTCHA_UNSOLVABLE';
	}
}

/**
 * Reads the v2 envelope and throws `TwoCaptchaAPIError` when `errorId` is not 0.
 * A body without `errorId` (a proxy page, an HTML error) is a failure too.
 *
 * unknown: the body is JSON from the provider, or whatever a proxy returned.
 */
export function assertSucceeded(
	method: TwoCaptchaMethod,
	body: unknown,
): Record<string, unknown> {
	const record = asRecord(body);
	const errorId = record?.errorId;
	if (record && (errorId === 0 || errorId === '0')) return record;
	const code =
		typeof record?.errorCode === 'string' ? record.errorCode : undefined;
	const description =
		typeof record?.errorDescription === 'string'
			? record.errorDescription
			: undefined;
	const detail = [code, description].filter(Boolean).join(': ');
	throw new TwoCaptchaAPIError(
		`2Captcha ${method} failed: ${detail || 'unexpected response'}`,
		{
			errorId:
				typeof errorId === 'number'
					? errorId
					: typeof errorId === 'string' && /^\d+$/.test(errorId)
						? Number(errorId)
						: undefined,
			code,
			providerMessage: description,
			method,
		},
	);
}

/**
 * Drops what a failed request carried before the error leaves the plugin: the
 * JSON body holds `clientKey` and the caller's captcha parameters, and core's
 * ApiError keeps the request. The error itself, its status and retry data stay.
 */
function stripRequest(error: ApiError): void {
	const req = error.request as { body?: unknown; query?: unknown } | undefined;
	if (req) {
		req.body = undefined;
		req.query = undefined;
	}
}

/**
 * Sends `POST https://api.2captcha.com/<method>` with a JSON body that carries
 * the key as `clientKey`, then checks the envelope.
 *
 * unknown: each method takes its own body fields; the endpoint schemas
 * validated them before this call.
 */
export async function makeTwoCaptchaRequest(
	apiKey: string,
	method: TwoCaptchaMethod,
	body: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
	const config: OpenAPIConfig = {
		BASE: TWOCAPTCHA_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: `/${method}`,
		body: { clientKey: apiKey, ...body },
		mediaType: 'application/json',
	};

	let raw: unknown;
	try {
		raw = await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) stripRequest(error);
		throw error;
	}
	if (typeof raw === 'string') {
		try {
			raw = JSON.parse(raw);
		} catch {
			// Not JSON: assertSucceeded reports it as an unexpected response.
		}
	}
	return assertSucceeded(method, raw);
}
