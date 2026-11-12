/**
 * Shared plumbing for the offline suites.
 *
 * The few types this plugin cannot pin down live here, each once rather than at
 * every call site, and each with the reason a stricter type is not feasible.
 */

export type MockedFetch = jest.SpyInstance;

/**
 * Queues one JSON answer on a fetch spy.
 *
 * A call whose *output* must be rejected has to pass a body that breaks the
 * operation's schema, so the parameter cannot be the operation's output type:
 * the schema under test is what narrows it, one call later.
 */
// unknown: a mocked response body is arbitrary JSON until the operation's own
// output schema parses it, which is the thing under test. A page envelope is an
// object while the v5 login page is bare HTML, so both are allowed.
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

/** Queues one non-JSON answer, for the login page a missing header returns. */
export function respondRaw(
	fetchMock: MockedFetch,
	body: string,
	status = 200,
	contentType = 'text/html',
): void {
	fetchMock.mockResolvedValueOnce(
		new Response(body, { status, headers: { 'Content-Type': contentType } }),
	);
}

/**
 * Swallows a rejection so the caller can assert on it. Every caller narrows the
 * reason before reading a field, which is why the return is open: only the
 * assertion knows what the operation was expected to throw.
 */
export async function captureError<T>(promise: Promise<T>): Promise<Error> {
	let caught: unknown;
	try {
		await promise;
	} catch (error) {
		caught = error;
	}
	// The resolved case is thrown outside the try, so the catch above cannot
	// mistake this helper's own failure for the operation's rejection.
	if (caught === undefined) {
		throw new Error('the operation resolved; this test expects a rejection');
	}
	// A non-Error rejection is itself worth failing on: this plugin throws
	// Route4MeAPIError or ZodError and nothing else.
	if (caught instanceof Error) return caught;
	throw new Error(
		`the operation rejected with a non-Error value: ${String(caught)}`,
	);
}

/**
 * Calls any endpoint with the fake context it needs.
 *
 * Every concrete endpoint is assignable to this: its parameters are declared
 * `never`, so contravariance lets the call through.
 */
// unknown: an endpoint's output type differs per operation, so a shared call
// signature cannot name one; each test narrows it to the type it asserts on.
export type AnyEndpoint = (
	ctx: never,
	input: never,
) => Promise<unknown /* unknown: see the note above */>;

/** The fake context carries only what the endpoints read: `ctx.key`. */
export function invoke(
	endpoint: AnyEndpoint,
	// A validation-rejection case has to pass a value no schema accepts, so the
	// parameter stays open; every accepted call is still checked by its schema.
	input: unknown, // unknown: a rejection case passes a value no schema accepts
): Promise<unknown /* unknown: see AnyEndpoint */> {
	return endpoint({ key: 'route4me-test-key' } as never, input as never);
}

/** A decoded request body: JSON with values the test has not checked yet. */
// unknown: a request body is JSON this suite built from a schema's output, and
// the assertion is what claims a given field's type.
export type UnverifiedBody = Record<string, unknown /* unknown: see above */>;

export type CapturedRequest = {
	origin: string;
	path: string;
	query: Record<string, string>;
	/** Every occurrence of a repeated query parameter, in order. */
	allQuery: (name: string) => string[];
	method: string | undefined;
	headers: Headers;
	contentType: string;
	/** The JSON body, for an operation that sends one. */
	json: () => UnverifiedBody;
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
		allQuery: (name: string) => parsed.searchParams.getAll(name),
		method: init.method,
		headers,
		contentType: headers.get('content-type') ?? '',
		json: () => JSON.parse(String(body)) as UnverifiedBody,
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
