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
// output schema parses it, which is the thing under test. A campaign-id list is
// a bare array and a proxy failure is bare text, so both are allowed.
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

/** Queues one non-JSON answer, for the cases where a proxy changes the body. */
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
	try {
		await promise;
		throw new Error('the operation resolved; this test expects a rejection');
	} catch (caught) {
		// A non-Error rejection is itself worth failing on: this plugin throws
		// TaggunAPIError or ZodError and nothing else.
		if (caught instanceof Error) return caught;
		throw new Error(
			`the operation rejected with a non-Error value: ${String(caught)}`,
		);
	}
}

/**
 * Calls any endpoint with the fake context it needs.
 *
 * Every concrete endpoint is assignable to this: its parameters are declared
 * `never`, so contravariance lets the call through. The return stays open
 * because each operation has its own output type, which the test asserts on.
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
	return endpoint({ key: 'taggun-test-key' } as never, input as never);
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
	/** The JSON body, for an operation that sends one. */
	json: () => UnverifiedBody;
	/** The multipart body, for an operation that uploads a file. */
	form: () => FormData;
	/** The body whichever encoding was used, when only its presence matters. */
	raw: () => FormData | string | null | undefined;
};

/** The request the spy last saw, decoded for assertions. */
export function lastRequest(fetchMock: MockedFetch): CapturedRequest {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const headers = new Headers(init.headers);
	// fetch's body is a `BodyInit`, which covers a JSON string and a FormData;
	// the operation under test decides which of the two it built.
	const body = init.body as FormData | string | null | undefined;
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers,
		contentType: headers.get('content-type') ?? '',
		json: () => JSON.parse(String(body)) as UnverifiedBody,
		form: () => body as FormData,
		raw: () => body,
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

/** A 1x1 PNG, so an upload test sends a real Blob rather than an empty one. */
export const PNG_BYTES = Buffer.from(
	'89504e470d0a1a0a0000000d494844520000000100000001080600000' +
		'01f15c4890000000a49444154789c6360000002000154a24f5f0000000049454e44ae426082',
	'hex',
);

export function pngFile(name = 'receipt.png'): File {
	return new File([new Uint8Array(PNG_BYTES)], name, { type: 'image/png' });
}
