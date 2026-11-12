/**
 * Shared plumbing for the offline suites.
 *
 * The few types this plugin cannot pin down live here, each once rather than at
 * every call site, and each with the reason a stricter type is not feasible.
 */

import type { RepairshoprContext } from './index';

export type MockedFetch = jest.SpyInstance;

/**
 * Queues one JSON answer on a fetch spy.
 *
 * A call whose *output* must be rejected has to pass a body that breaks the
 * operation's schema, so the parameter cannot be the operation's output type:
 * the schema under test is what narrows it, one call later.
 */
// unknown: a mocked response body is arbitrary JSON until the operation's own
// output schema parses it, which is the thing under test.
export type MockedBody = object | string | number | boolean | null;

export function respond(
	fetchMock: MockedFetch,
	body: MockedBody,
	status = 200,
	headers: Record<string, string> = {},
): void {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

/**
 * Swallows a rejection so the caller can assert on it. Every caller narrows the
 * reason before reading a field, which is why the return is open.
 */
export async function captureError<T>(promise: Promise<T>): Promise<Error> {
	try {
		await promise;
		throw new Error('the operation resolved; this test expects a rejection');
	} catch (caught) {
		// A non-Error rejection is itself worth failing on: this plugin throws
		// RepairshoprAPIError or ZodError and nothing else.
		if (caught instanceof Error) return caught;
		throw new Error(
			`the operation rejected with a non-Error value: ${String(caught)}`,
		);
	}
}

/**
 * Every concrete endpoint is assignable to this: its parameters are declared
 * `never`, so contravariance lets the call through.
 */
// unknown: an endpoint's output type differs per operation, so a shared call
// signature cannot name one; each test narrows it to the type it asserts on.
export type AnyEndpoint = (
	ctx: never,
	input: never,
) => Promise<unknown /* unknown: see the note above */>;

/**
 * A context carrying only what the endpoints read: `key`, `options.subdomain`
 * and `keys.get_subdomain`. The real context also carries a database, hooks and
 * the rest of the key manager, which the endpoints never touch.
 */
function fakeContext(
	subdomain?: string,
	stored: () => Promise<string | null> = async () => subdomain ?? null,
): RepairshoprContext {
	return {
		key: 'repairshopr-test-key',
		options: { subdomain },
		keys: {
			get_subdomain: stored,
		},
		// unknown: a real context carries a database, hooks and the whole key
		// manager; the endpoints read none of them, so the fixture is cast at this
		// single boundary rather than reimplementing a context core builds.
	} as unknown as RepairshoprContext;
}

/** Calls any endpoint with the fake context it needs. */
export function invoke(
	endpoint: AnyEndpoint,
	// A validation-rejection case has to pass a value no schema accepts, so the
	// parameter stays open; every accepted call is still checked by its schema.
	input: unknown, // unknown: a rejection case passes a value no schema accepts
	subdomain = 'acme',
): Promise<unknown /* unknown: see AnyEndpoint */> {
	return endpoint(fakeContext(subdomain) as never, input as never);
}

/**
 * Calls an endpoint on a plugin created without `subdomain`, so the only source
 * is the value stored on the account, read through `get_subdomain`.
 */
export function invokeWithStoredSubdomain(
	endpoint: AnyEndpoint,
	input: unknown, // unknown: same open input as `invoke`
	stored: () => Promise<string | null>,
): Promise<unknown /* unknown: see AnyEndpoint */> {
	return endpoint(fakeContext(undefined, stored) as never, input as never);
}

/** A decoded request body: JSON with values the test has not checked yet. */
// unknown: a request body is JSON this suite built from a schema's output, and
// the assertion is what claims a given field's type.
export type UnverifiedBody = Record<string, unknown /* unknown: see above */>;

export type CapturedRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	method: string | undefined;
	headers: Headers;
	contentType: string;
	json: () => UnverifiedBody;
	hasBody: boolean;
};

/** The request the spy last saw, decoded for assertions. */
export function lastRequest(fetchMock: MockedFetch): CapturedRequest {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const headers = new Headers(init.headers);
	const body = init.body;
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers,
		contentType: headers.get('content-type') ?? '',
		json: () => JSON.parse(String(body)) as UnverifiedBody,
		hasBody: body !== undefined && body !== null,
	};
}

/**
 * A fetch spy with nothing queued rejects rather than falling through to the
 * real fetch, which would send a live request from a unit test.
 */
export function spyOnFetch(): MockedFetch {
	return jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response with respond() first');
	});
}
