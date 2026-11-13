import { describeKeenError, makeKeenRequest, redactKeenKey } from './client';

const API_KEY = 'abcdef0123456789abcdef0123456789';
const PROJECT_ID = '523b527836bf5a3216000006';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(status === 204 ? null : JSON.stringify(body), {
			status,
			headers: status === 204 ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		query: parsed.searchParams.toString(),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('redactKeenKey', () => {
	it('replaces the key where Keen echoes it', () => {
		expect(
			redactKeenKey(
				`Specified API Key is invalid. API Key: '${API_KEY}'.`,
				API_KEY,
			),
		).toBe("Specified API Key is invalid. API Key: '[REDACTED]'.");
	});

	it('replaces every occurrence', () => {
		expect(redactKeenKey(`${API_KEY} and ${API_KEY}`, API_KEY)).toBe(
			'[REDACTED] and [REDACTED]',
		);
	});

	it('leaves a message without the key alone', () => {
		expect(redactKeenKey('Resource not found.', API_KEY)).toBe(
			'Resource not found.',
		);
	});

	it('is a no-op when no key is known', () => {
		expect(redactKeenKey('anything', '')).toBe('anything');
	});
});

describe('describeKeenError', () => {
	it('puts the status and code in front of the message', () => {
		expect(
			describeKeenError(
				400,
				{ message: 'Bad analysis', error_code: 'BadRequestError' },
				'fallback',
				API_KEY,
			),
		).toBe('Keen 400 BadRequestError: Bad analysis');
	});

	it('falls back to the error message when the body has none', () => {
		expect(
			describeKeenError(500, undefined, 'Internal Server Error', API_KEY),
		).toBe('Keen 500: Internal Server Error');
	});

	it('redacts the key inside the body’s message', () => {
		expect(
			describeKeenError(
				401,
				{ message: `Invalid key ${API_KEY}`, error_code: 'InvalidApiKeyError' },
				'fallback',
				API_KEY,
			),
		).not.toContain(API_KEY);
	});
});

describe('makeKeenRequest', () => {
	it('sends the key bare in Authorization, with no Bearer scheme', async () => {
		respond({ result: 1 });

		await makeKeenRequest(
			{ apiKey: API_KEY, projectId: PROJECT_ID },
			{ method: 'GET', path: '/events' },
		);

		expect(lastRequest().headers.get('authorization')).toBe(API_KEY);
	});

	it('puts the project ID in the path', async () => {
		respond({ result: 1 });

		await makeKeenRequest(
			{ apiKey: API_KEY, projectId: PROJECT_ID },
			{ method: 'GET', path: '/events' },
		);

		expect(lastRequest().path).toBe(`/3.0/projects/${PROJECT_ID}/events`);
	});

	it('sends a body as JSON and sets the content type', async () => {
		respond({ created: true });

		await makeKeenRequest(
			{ apiKey: API_KEY, projectId: PROJECT_ID },
			{ method: 'POST', path: '/events/purchases', body: { a: 1 } },
		);

		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toBe('{"a":1}');
	});

	it('sends no body and no content type for a request with none', async () => {
		respond({ result: 1 });

		await makeKeenRequest(
			{ apiKey: API_KEY, projectId: PROJECT_ID },
			{ method: 'GET', path: '/events' },
		);

		const sent = lastRequest();
		expect(sent.body).toBeUndefined();
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('returns undefined for a 204', async () => {
		respond(undefined, 204);

		await expect(
			makeKeenRequest(
				{ apiKey: API_KEY, projectId: PROJECT_ID },
				{ method: 'DELETE', path: '/datasets/x' },
			),
		).resolves.toBeUndefined();
	});

	it('refuses a request with no project ID before it is sent', async () => {
		await expect(
			makeKeenRequest(
				{ apiKey: API_KEY, projectId: '' },
				{ method: 'GET', path: '/events' },
			),
		).rejects.toMatchObject({
			name: 'KeenAPIError',
			message: expect.stringContaining('project ID'),
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('keeps the code and drops the cause that holds the echoed key', async () => {
		respond(
			{
				message: `Specified API Key is invalid. API Key: '${API_KEY}'.`,
				error_code: 'InvalidApiKeyError',
			},
			401,
		);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKeenRequest(
			{ apiKey: API_KEY, projectId: PROJECT_ID },
			{ method: 'GET', path: '/events' },
		).catch((caught: unknown) => caught)) as Error & { code?: string };

		expect(error).toMatchObject({ status: 401, code: 'InvalidApiKeyError' });
		expect(error.cause).toBeUndefined();
		expect(error).not.toHaveProperty('body');
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});

	it('keeps a transport failure’s cause, which never held a body', async () => {
		const dropped = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(dropped);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKeenRequest(
			{ apiKey: API_KEY, projectId: PROJECT_ID },
			{ method: 'GET', path: '/events' },
		).catch((caught: unknown) => caught)) as Error;

		expect(error).toMatchObject({
			transport: true,
			message: 'fetch failed',
			method: 'GET',
		});
		expect(error.cause).toBe(dropped);
	});

	it('separates a timeout from a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		await expect(
			makeKeenRequest(
				{ apiKey: API_KEY, projectId: PROJECT_ID },
				{ method: 'POST', path: '/events/purchases' },
			),
		).rejects.toMatchObject({
			timedOut: true,
			transport: true,
			method: 'POST',
		});
	});

	it('waits past the five minutes Keen gives a query before timing out', async () => {
		const timeout = jest.spyOn(AbortSignal, 'timeout');
		respond({ result: 1 });

		await makeKeenRequest(
			{ apiKey: API_KEY, projectId: PROJECT_ID },
			{ method: 'POST', path: '/queries/count', body: {} },
		);

		expect(timeout).toHaveBeenCalledWith(expect.any(Number));
		expect(timeout.mock.calls[0]?.[0]).toBeGreaterThan(300_000);
		timeout.mockRestore();
	});

	it('keeps a Retry-After header as milliseconds', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({ message: 'Slow down', error_code: 'SlowDown' }),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '5' },
				},
			),
		);

		await expect(
			makeKeenRequest(
				{ apiKey: API_KEY, projectId: PROJECT_ID },
				{ method: 'GET', path: '/events' },
			),
		).rejects.toMatchObject({ retryAfter: 5000, isRateLimit: true });
	});

	it('reports an unknown key as an auth error and a forbidden key as not', async () => {
		respond({ message: 'nope', error_code: 'ForbiddenError' }, 403);

		await expect(
			makeKeenRequest(
				{ apiKey: API_KEY, projectId: PROJECT_ID },
				{ method: 'GET', path: '/events' },
			),
		).rejects.toMatchObject({ status: 403, isAuthError: false });
	});
});
