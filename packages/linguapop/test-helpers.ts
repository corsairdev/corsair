import { LinguapopAPIError } from './client';
import type { LinguapopContext } from './index';

export type JsonBody =
	| string
	| number
	| boolean
	| null
	| JsonBody[]
	| { [key: string]: JsonBody };

export function jsonResponse(
	body: JsonBody,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

export function problemResponse(body: JsonBody, status = 400): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/problem+json; charset=utf-8' },
	});
}

export function textResponse(
	body: string,
	status = 200,
	contentType = 'text/plain; charset=utf-8',
): Response {
	return new Response(body, {
		status,
		headers: { 'Content-Type': contentType },
	});
}

// A promise can reject with any value, so the rejection reason has no static
// type; linguapopFailure narrows it.
type Rejection = unknown; // unknown: a rejection reason has no static type.

export async function captureError<T>(promise: Promise<T>): Promise<Rejection> {
	return promise.catch((caught: Rejection) => caught);
}

/** Awaits a rejection and asserts it is a LinguapopAPIError. */
export async function linguapopFailure<T>(
	promise: Promise<T>,
): Promise<LinguapopAPIError> {
	const error = await captureError(promise);
	if (!(error instanceof LinguapopAPIError)) {
		throw new Error(`Expected a LinguapopAPIError, got ${String(error)}`);
	}
	return error;
}

export type RecordedCall = {
	url: string;
	parsed: URL;
	method: string | undefined;
	headers: Headers;
	/** The raw body string, undefined when none was sent. */
	rawBody: string | undefined;
	body: JsonBody | undefined;
};

/** Reads the last call a `fetch` spy received. */
export function lastCall(fetchMock: jest.SpyInstance): RecordedCall {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const rawBody = typeof init.body === 'string' ? init.body : undefined;
	return {
		url,
		parsed: new URL(url),
		method: init.method,
		headers: new Headers(init.headers),
		rawBody,
		body: rawBody === undefined ? undefined : (JSON.parse(rawBody) as JsonBody),
	};
}

/**
 * A context with only what the endpoints read: `key`, and the log path's
 * `$getAccountId`. The log writer tolerates a missing database, so it is left
 * out. bound-client.test.ts runs the same endpoints against a real context.
 */
export function makeContext(key: string): LinguapopContext {
	const ctx = { key, $getAccountId: jest.fn(async () => 'account-1') };
	// The endpoints never touch the rest of the context, so a full
	// CorsairPluginContext would only add dead fixture code.
	return ctx as unknown as LinguapopContext; // unknown: partial context, see above.
}
