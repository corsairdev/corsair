import { asRecord } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LINKHUT_API_BASE = 'https://api.ln.ht';
export const LINKHUT_MIN_INTERVAL_MS = 1000;

const TRANSPORT_MESSAGE = 'Linkhut request failed before a response arrived';

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

/** What the error handlers need to know about the request behind an error. */
export type LinkhutRequestFacts = {
	method: string;
	/** Whether the request may be sent again after a 5xx or a dropped
	 * connection. False for every operation that changes data unless it is an
	 * update that converges. */
	replayable: boolean;
	/** True when no response arrived: a reset, a DNS failure, a timeout, an
	 * abort, or linkhut's HTTP 999 throttle signal, which fetch rejects. */
	transport: boolean;
};

// Facts ride beside the error, so the thrown value stays core's ApiError
// (or a plain Error for a transport failure) with nothing added to it.
const requestFacts = new WeakMap<Error, LinkhutRequestFacts>();

export function linkhutRequestFacts(
	error: Error,
): LinkhutRequestFacts | undefined {
	return requestFacts.get(error);
}

function remember<E extends Error>(error: E, facts: LinkhutRequestFacts): E {
	requestFacts.set(error, facts);
	return error;
}

/**
 * Builds the core `ApiError` the plugin throws for an answer linkhut gave.
 * The request keeps only its method and path: the query holds the user's
 * bookmark urls, titles and tags. The body is kept only when it is JSON
 * (`{ errors }` or `{ result_code }`); an HTML error page is dropped.
 */
export function linkhutApiError(
	request: { method: string; path: string },
	response: { status: number; statusText?: string; body?: unknown }, // unknown: the provider's error body
	message: string,
	replayable: boolean,
	retryAfter?: number,
): ApiError {
	const body = asRecord(response.body) ?? undefined;
	const error = new ApiError(
		{ method: request.method as 'GET', url: request.path },
		{
			url: `${LINKHUT_API_BASE}${request.path}`,
			ok: response.status >= 200 && response.status < 300,
			status: response.status,
			statusText: response.statusText ?? '',
			body,
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
	return remember(error, {
		method: request.method,
		replayable,
		transport: false,
	});
}

function statusMessage(
	status: number,
	body: unknown, // unknown: the provider's error body
): string {
	const joined = readErrorMessages(body).join('; ');
	const base = `Linkhut HTTP ${status}`;
	return joined ? `${base}: ${joined}` : base;
}

/**
 * Trims surrounding whitespace (a pasted token often ends in a newline) and
 * refuses a token that still holds whitespace or a control character. Such a
 * value cannot go in an Authorization header, and fetch would quote it back
 * in its error message.
 */
export function normaliseLinkhutKey(apiKey: string): string {
	const key = apiKey.trim();
	if (!key || /[\s\x00-\x1f\x7f]/.test(key)) {
		throw new Error(
			'Linkhut API key is empty or holds whitespace or control characters',
		);
	}
	return key;
}

// "Please wait at least one second between HTTP queries, or you are likely to
// get automatically throttled. If you are releasing a library to access the
// API, you must do this." Tests can lower this to 0 and restore it.
export const linkhutRequestGap = { minIntervalMs: LINKHUT_MIN_INTERVAL_MS };

let turn: Promise<void> = Promise.resolve();
let lastSentAt: number | undefined;

// Each HTTP attempt takes the queue in turn, so two parallel calls get two
// slots a full interval apart instead of passing the same check together.
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
 * Resolves with the parsed JSON body. A 429 is retried by core (three times,
 * honouring Retry-After), and every attempt, retries included, waits for its
 * slot in the one-second gap. Rejects with core's `ApiError` when linkhut
 * answered, and with a plain `Error` carrying a fixed message when no
 * response arrived; `linkhutRequestFacts(error)` tells the two apart.
 */
export async function makeLinkhutRequest(
	apiKey: string,
	{ method, path, query, replayable }: LinkhutRequest,
): Promise<unknown /* unknown: raw response body, typed by each endpoint's output schema */> {
	const token = normaliseLinkhutKey(apiKey);

	const config: OpenAPIConfig = {
		BASE: LINKHUT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		// Core resolves HEADERS right before it sends each attempt, its own
		// 429 retries included, so waiting for the slot here keeps every
		// attempt in the gap and records its send time.
		// The docs ask libraries for an identifiable User-Agent, because
		// default identifiers "tend to get banned from time to time".
		HEADERS: async () => {
			await waitForSlot();
			return {
				Accept: 'application/json',
				'User-Agent': 'Corsair Linkhut integration',
			};
		},
	};

	const requestOptions: ApiRequestOptions = { method, url: path, query };

	try {
		return await request(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw linkhutApiError(
				{ method, path },
				{
					status: error.status,
					statusText: error.statusText,
					body: error.body,
				},
				statusMessage(error.status, error.body),
				replayable,
				error.retryAfter,
			);
		}
		// A throttle can also land here: linkhut signals some of them with
		// HTTP 999, and fetch rejects any status outside 200 to 599 as a
		// network error. The original error is not kept: its message can quote
		// request headers.
		const name =
			error instanceof Error || error instanceof DOMException
				? error.name
				: undefined;
		const failure = new Error(
			name ? `${TRANSPORT_MESSAGE} (${name})` : TRANSPORT_MESSAGE,
		);
		failure.name = 'LinkhutNetworkError';
		throw remember(failure, { method, replayable, transport: true });
	}
}
