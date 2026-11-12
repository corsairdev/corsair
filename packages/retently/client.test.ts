import {
	describeRetentlyError,
	makeRetentlyRequest,
	RETENTLY_API_BASE,
	RETENTLY_API_VERSION,
	RetentlyAPIError,
	segment,
} from './client';
import {
	BAD_KEY,
	INVALID_KEY,
	RATE_LIMITED,
	READ_ONLY_KEY,
} from './test-fixtures';

const API_KEY = 'retently-secret-test-key';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

function respond(
	// unknown: response bodies are arbitrary JSON.
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<RetentlyAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RetentlyAPIError);
	if (!(error instanceof RetentlyAPIError)) throw error;
	return error;
}

describe('Retently client', () => {
	it('joins the host and version into the base URL', () => {
		expect(RETENTLY_API_BASE).toBe('https://app.retently.com');
		expect(RETENTLY_API_VERSION).toBe('/api/v2');
	});

	it('sends the key in X-Api-Key and Accept: application/json', async () => {
		respond({ code: 200, message: 'Success.' }, 200);

		await makeRetentlyRequest(API_KEY, {
			method: 'GET',
			path: '/ping',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://app.retently.com/api/v2/ping');
		const headers = new Headers(init.headers);
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(headers.get('accept')).toBe('application/json');
		// The legacy transports must not be used.
		expect(headers.get('authorization')).toBeNull();
		expect(url).not.toContain('api_key');
	});

	it('drops the key from the query string even for a GET', async () => {
		respond({ code: 200, message: 'Success.' }, 200);

		await makeRetentlyRequest(API_KEY, {
			method: 'GET',
			path: '/customers',
			query: { email: 'john@example.com' },
			replayable: true,
		});

		const url = fetchMock.mock.calls[0][0] as string;
		expect(url).toContain('email=john%40example.com');
		expect(url).not.toContain(API_KEY);
	});

	it('serialises a body as JSON with a JSON media type', async () => {
		respond({ code: 200 }, 200);

		await makeRetentlyRequest(API_KEY, {
			method: 'POST',
			path: '/customers',
			body: { subscribers: [{ email: 'john@example.com' }] },
			replayable: false,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(init.method).toBe('POST');
		expect(JSON.parse(String(init.body))).toEqual({
			subscribers: [{ email: 'john@example.com' }],
		});
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
	});

	it('reads the envelope code and message from a 401', async () => {
		respond(BAD_KEY, 401);

		const error = await failure(
			makeRetentlyRequest(API_KEY, {
				method: 'GET',
				path: '/customers',
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.code).toBe(401);
		expect(error.message).toBe('Retently 401: Account not found');
		expect(error.isAuthError).toBe(true);
		expect(error.isNotFound).toBe(false);
	});

	it('reports a read-only key as a permission error, not an auth error', async () => {
		respond(READ_ONLY_KEY, 403);

		const error = await failure(
			makeRetentlyRequest(API_KEY, {
				method: 'POST',
				path: '/customers',
				replayable: false,
			}),
		);

		expect(error.status).toBe(403);
		expect(error.isPermissionError).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('keeps the documented "Invalid API key." wording', async () => {
		respond(INVALID_KEY, 401);

		const error = await failure(
			makeRetentlyRequest(API_KEY, {
				method: 'POST',
				path: '/survey',
				replayable: false,
			}),
		);

		expect(error.message).toBe('Retently 401: Invalid API key.');
	});

	it('records whether the failed call may be replayed', async () => {
		respond(RATE_LIMITED, 429, { 'Retry-After': '12' });

		const error = await failure(
			makeRetentlyRequest(API_KEY, {
				method: 'POST',
				path: '/import',
				replayable: false,
			}),
		);

		expect(error.replayable).toBe(false);
		expect(error.method).toBe('POST');
		// corsair/http reports Retry-After in milliseconds.
		expect(error.retryAfter).toBe(12000);
	});

	it('marks a GET replayable when the operation says so', async () => {
		respond({ code: 500, message: 'boom' }, 500);

		const error = await failure(
			makeRetentlyRequest(API_KEY, {
				method: 'GET',
				path: '/feedback',
				replayable: true,
			}),
		);

		expect(error.status).toBe(500);
		expect(error.replayable).toBe(true);
	});

	it('wraps a transport failure and keeps the original cause', async () => {
		const cause = new Error('socket hang up');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await failure(
			makeRetentlyRequest(API_KEY, {
				method: 'GET',
				path: '/ping',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.message).toBe('socket hang up');
		expect(error.method).toBe('GET');
		expect(error.replayable).toBe(true);
		// A transport error carries no request, so it retains no credentials.
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the request headers', async () => {
		respond(BAD_KEY, 401);

		const error = await failure(
			makeRetentlyRequest(API_KEY, {
				method: 'GET',
				path: '/customers',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});

	it('does not add an envelope code that repeats the status', () => {
		expect(
			describeRetentlyError(404, { code: 404, message: 'Nope' }, 'x'),
		).toBe('Retently 404: Nope');
	});

	it('adds an envelope code that differs from the status', () => {
		expect(
			describeRetentlyError(502, { code: 500, message: 'Down' }, 'x'),
		).toBe('Retently 502 500: Down');
	});

	it('falls back to the supplied message when the body has none', () => {
		expect(describeRetentlyError(500, null, 'Server error')).toBe(
			'Retently 500: Server error',
		);
		expect(describeRetentlyError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});

	it('ignores an empty message in the envelope', () => {
		expect(describeRetentlyError(400, { message: '' }, 'Bad request')).toBe(
			'Retently 400: Bad request',
		);
	});

	it('percent-encodes a path segment', () => {
		expect(segment('a b/c')).toBe('a%20b%2Fc');
	});
});
