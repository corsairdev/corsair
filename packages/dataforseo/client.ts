import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const DATAFORSEO_API_BASE = 'https://api.dataforseo.com';
// Same API with prepared sample data and no charges:
// https://docs.dataforseo.com/v3/appendix/sandbox/
export const DATAFORSEO_SANDBOX_BASE = 'https://sandbox.dataforseo.com';

// Live SERP and LLM tasks can run up to 120s on DataForSEO's side.
const DATAFORSEO_TIMEOUT_MS = 130_000;

// 20000 ok, 20100 task created. The task also completed for 40102 (no search
// results; empty result) and 40106 (partial results, unparsed pages not charged).
const SUCCESS_CODES = new Set([20000, 20100, 40102, 40106]);

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error.
const DATAFORSEO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export class DataForSeoAPIError extends Error {
	readonly status?: number;
	/** DataForSEO's own five-digit status code, e.g. 40204. */
	readonly code?: number;
	readonly retryAfter?: number;
	// unknown: the response body when the HTTP request itself failed.
	readonly body?: unknown;

	constructor(message: string, options: { code?: number; cause?: Error } = {}) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'DataForSeoAPIError';
		this.code = options.code;
		if (options.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/** The plugin key is `login:password`; keyBuilder packs it. */
export function packCredentials(login: string, password: string): string {
	return `${login}:${password}`;
}

const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;
const PRINTABLE = /^[\x20-\x7e]+$/;

function hasBothHalves(text: string): boolean {
	const colon = text.indexOf(':');
	return colon > 0 && colon < text.length - 1;
}

/**
 * True when `value` is the base64 of `login:password` that DataForSEO's
 * dashboard shows ready-made, so it is sent as it is instead of encoded twice.
 */
function isEncodedCredential(value: string): boolean {
	if (value.includes(':') || !BASE64.test(value)) return false;
	const decoded = Buffer.from(value, 'base64').toString('utf8');
	return (
		PRINTABLE.test(decoded) &&
		hasBothHalves(decoded) &&
		Buffer.from(decoded, 'utf8').toString('base64') === value
	);
}

/**
 * The whole credential in one string: `login:password`, or the dashboard's
 * base64 of it. Hub's single key field and Corsair's own key arrive this way.
 */
export function isWholeCredential(value: string): boolean {
	return hasBothHalves(value) || isEncodedCredential(value);
}

/** The value of the HTTP Basic `Authorization` header for a credential. */
export function basicToken(credentials: string): string {
	return isEncodedCredential(credentials)
		? credentials
		: Buffer.from(credentials).toString('base64');
}

// unknown: the envelope is checked before the response schema runs, so its
// codes and messages are narrowed here instead of trusted.
type Envelope = {
	status_code?: unknown;
	status_message?: unknown;
	tasks?: { status_code?: unknown; status_message?: unknown }[] | null;
};

// unknown: takes the unchecked envelope fields above.
function failure(code: unknown, message: unknown): DataForSeoAPIError {
	const numeric = typeof code === 'number' ? code : undefined;
	return new DataForSeoAPIError(
		`${numeric ?? 'unknown'} ${typeof message === 'string' ? message : 'DataForSEO request failed'}`,
		{ code: numeric },
	);
}

/**
 * DataForSEO answers HTTP 200 for most failures and reports them in the
 * envelope `status_code` and in each task's `status_code`.
 */
export function assertTasksSucceeded(envelope: Envelope): void {
	if (!SUCCESS_CODES.has(envelope.status_code as number)) {
		throw failure(envelope.status_code, envelope.status_message);
	}
	for (const task of envelope.tasks ?? []) {
		if (!SUCCESS_CODES.has(task.status_code as number)) {
			throw failure(task.status_code, task.status_message);
		}
	}
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeDataForSeoRequest(
	path: string,
	credentials: string,
	options: {
		method?: 'GET' | 'POST';
		path?: Record<string, string>;
		/** One task; sent as the single-element array the API expects. */
		task?: object;
		sandbox?: boolean;
	} = {},
): Promise<unknown> {
	const { method = 'GET', task } = options;

	const config: OpenAPIConfig = {
		BASE: options.sandbox ? DATAFORSEO_SANDBOX_BASE : DATAFORSEO_API_BASE,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: DATAFORSEO_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Basic ${basicToken(credentials)}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		path: options.path,
		body: task ? [task] : undefined,
		mediaType: task ? 'application/json; charset=utf-8' : undefined,
	};

	let response: unknown;
	try {
		response = await request<unknown>(config, requestOptions, {
			rateLimitConfig: DATAFORSEO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const body = error.body as Envelope | undefined;
			throw new DataForSeoAPIError(
				`${error.status} ${typeof body?.status_message === 'string' ? body.status_message : error.message}`,
				{
					code:
						typeof body?.status_code === 'number'
							? body.status_code
							: undefined,
					cause: error,
				},
			);
		}
		if (error instanceof Error) {
			throw new DataForSeoAPIError(error.message, { cause: error });
		}
		throw new DataForSeoAPIError('Unknown DataForSEO API error');
	}

	assertTasksSucceeded(response as Envelope);
	return response;
}
