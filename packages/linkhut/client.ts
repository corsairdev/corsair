import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LINKHUT_API_BASE = 'https://api.ln.ht';
export const LINKHUT_MIN_INTERVAL_MS = 1000;

const TRANSPORT_MESSAGE = 'Linkhut request failed before a response arrived';

const STATUS_TEXT: Record<number, string> = {
	400: 'Bad Request',
	401: 'Unauthorized',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	406: 'Not Acceptable',
	408: 'Request Timeout',
	422: 'Unprocessable Content',
	429: 'Too Many Requests',
	500: 'Internal Server Error',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout',
};

// Only `errors[].message` is read, so an HTML page is never echoed.
function readErrorMessages(
	body: unknown, // unknown: an error body is untyped until asRecord narrows it
): string[] {
	const errors = asRecord(body)?.errors;
	if (!Array.isArray(errors)) return [];
	return errors.flatMap((entry) => {
		const message = asRecord(entry)?.message;
		return typeof message === 'string' && message ? [message] : [];
	});
}

function statusText(status: number): string {
	const reason = STATUS_TEXT[status];
	return reason ? `Linkhut HTTP ${status} ${reason}` : `Linkhut HTTP ${status}`;
}

// fetch rejects with a TypeError or a DOMException, but a test can reject
// with anything.
function transportMessage(
	reason: unknown, // unknown: a rejected promise carries any value
): string {
	if (reason instanceof Error || reason instanceof DOMException) {
		return reason.message || TRANSPORT_MESSAGE;
	}
	return typeof reason === 'string' && reason ? reason : TRANSPORT_MESSAGE;
}

export class LinkhutAPIError extends Error {
	/** HTTP status of the failed request. Absent when no response arrived. */
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when linkhut sent one. */
	readonly retryAfter?: number;
	/** The provider's error text: the `errors[].message` values joined with
	 * `"; "`, or a `result_code` other than `"done"`. */
	readonly code?: string;
	/** Whether the failed request may be sent again. False for every
	 * mutating operation. */
	readonly replayable: boolean;
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			// Kept only for a transport failure, which never held a body. It
			// stays non-enumerable.
			cause?: unknown; // unknown: the original error, which can be any value
			status?: number;
			retryAfter?: number;
			code?: string;
			replayable?: boolean;
			method?: string;
		} = {},
	) {
		super(
			message,
			options.cause === undefined ? undefined : { cause: options.cause },
		);
		this.name = 'LinkhutAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.code = options.code;
		// No flag means the request must not be sent again.
		this.replayable = options.replayable ?? false;
		this.method = options.method;
	}

	/** True when no response arrived: a reset, a DNS failure, a timeout, an
	 * abort, or linkhut's HTTP 999 throttle signal, which fetch rejects. */
	get isTransportError(): boolean {
		return this.status === undefined;
	}

	/** True for a 429 and for any 5xx. linkhut documents a 500 as throttling. */
	get isThrottled(): boolean {
		return this.status === 429 || (this.status ?? 0) >= 500;
	}
}

// "Please wait at least one second between HTTP queries, or you are likely to
// get automatically throttled. If you are releasing a library to access the
// API, you must do this." Tests can lower this to 0 and restore it.
export const linkhutRequestGap = { minIntervalMs: LINKHUT_MIN_INTERVAL_MS };

let turn: Promise<void> = Promise.resolve();
let lastSentAt: number | undefined;

// Each request takes the queue in turn, so two parallel calls get two slots a
// full interval apart instead of passing the same check together.
function waitForSlot(): Promise<void> {
	if (linkhutRequestGap.minIntervalMs <= 0) {
		// Turning the gap off also clears the slot it keeps, so the next call
		// with it on does not wait on an old timestamp.
		lastSentAt = undefined;
		return Promise.resolve();
	}
	const slot = turn.then(async () => {
		const now = Date.now();
		// A timestamp in the future means the clock moved backwards since the
		// last request: a corrected system clock, or a test that installed a
		// new fake clock. Waiting for it would block for the size of the jump.
		const wait =
			lastSentAt === undefined || lastSentAt > now
				? 0
				: lastSentAt + linkhutRequestGap.minIntervalMs - now;
		if (wait > 0) {
			await new Promise((resolve) => setTimeout(resolve, wait));
		}
		lastSentAt = Date.now();
	});
	turn = slot;
	return slot;
}

// error-handlers.ts owns retries, so the client makes one attempt. `enabled`
// and `headerNames` stay set because they are what makes corsair/http read
// Retry-After onto a 429. 429 is its default rate-limit matcher.
const LINKHUT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type LinkhutQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type LinkhutRequest = {
	method: 'GET';
	path: string;
	query?: LinkhutQuery;
	// "All API methods are GET requests, even when good REST habits suggest
	// they should use a different verb." Four of them mutate, so the method
	// says nothing about whether a repeat is safe. Each operation says it here.
	replayable: boolean;
};

/**
 * Sends one GET to `https://api.ln.ht` with the token as
 * `Authorization: Bearer <key>`. An `undefined` query value is not sent.
 * Resolves with the parsed JSON body. Rejects with `LinkhutAPIError`: with a
 * `status` when linkhut answered, without one when the request got no
 * response (the original error is then the non-enumerable `cause`).
 */
export async function makeLinkhutRequest(
	apiKey: string,
	{ method, path, query, replayable }: LinkhutRequest,
): Promise<unknown /* unknown: raw response body, typed by each endpoint's output schema */> {
	await waitForSlot();

	const config: OpenAPIConfig = {
		BASE: LINKHUT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		// The docs ask libraries for an identifiable User-Agent, because
		// default identifiers "tend to get banned from time to time".
		HEADERS: {
			Accept: 'application/json',
			'User-Agent': 'Corsair Linkhut integration',
		},
	};

	const requestOptions: ApiRequestOptions = { method, url: path, query };

	try {
		return await request(config, requestOptions, {
			rateLimitConfig: LINKHUT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const joined = readErrorMessages(error.body).join('; ');
			throw new LinkhutAPIError(
				joined
					? `${statusText(error.status)}: ${joined}`
					: statusText(error.status),
				{
					status: error.status,
					retryAfter: error.retryAfter,
					code: joined || undefined,
					replayable,
					method,
				},
			);
		}
		// A throttle can also land here: linkhut signals some of them with
		// HTTP 999, and fetch rejects any status outside 200 to 599 as a
		// network error, so no body ever exists to read.
		throw new LinkhutAPIError(transportMessage(error), {
			cause: error,
			replayable,
			method,
		});
	}
}
