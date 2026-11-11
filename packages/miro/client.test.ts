import {
	describeMiroError,
	MiroAPIError,
	makeMiroRequest,
	readError,
	statusOnlyDescription,
} from './client';
import {
	badRequest,
	boardNotFound,
	rateLimited,
	tokenNotProvided,
	unauthorized,
} from './test-fixtures';

const API_KEY = 'miro-secret-test-token';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<MiroAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(MiroAPIError);
	if (!(error instanceof MiroAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeMiroRequest', () => {
	it('sends the token as a bearer token', async () => {
		respond({ id: 'board-1' }, 200);

		const result = await makeMiroRequest(API_KEY, {
			method: 'GET',
			path: '/v2/boards/board-1',
		});

		expect(result).toEqual({ id: 'board-1' });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.miro.com/v2/boards/board-1');
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(init.body).toBeUndefined();
	});

	it('POSTs JSON with the body and a JSON content type', async () => {
		respond({ id: 'board-1' }, 201);

		await makeMiroRequest(API_KEY, {
			method: 'POST',
			path: '/v2/boards',
			body: { name: 'Roadmap' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({ name: 'Roadmap' });
	});

	it('sends no body on a DELETE', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await makeMiroRequest(API_KEY, {
			method: 'DELETE',
			path: '/v2/boards/board-1',
		});

		expect(result).toBeUndefined();
		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
	});

	it('never puts the token in the query string', async () => {
		respond({}, 200);

		await makeMiroRequest(API_KEY, {
			method: 'GET',
			path: '/v2/boards',
			query: { limit: 10 },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).not.toContain(API_KEY);
	});

	it('reads code and message from a 401', async () => {
		respond(tokenNotProvided, 401);

		const error = await failure(
			makeMiroRequest(API_KEY, { method: 'GET', path: '/v2/boards' }),
		);
		expect(error.status).toBe(401);
		expect(error.code).toBe('tokenNotProvided');
		expect(error.message).toBe(
			'Miro 401 tokenNotProvided: No authorization data was found on the request',
		);
		expect(error.method).toBe('GET');
	});

	it('reads a 404', async () => {
		respond(boardNotFound, 404);

		const error = await failure(
			makeMiroRequest(API_KEY, { method: 'GET', path: '/v2/boards/x' }),
		);
		expect(error.code).toBe('notFound');
		expect(error.message).toContain('Board not found');
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(rateLimited, 429, { 'Retry-After': '4' });

		const error = await failure(
			makeMiroRequest(API_KEY, { method: 'POST', path: '/v2/boards' }),
		);
		expect(error.status).toBe(429);
		expect(error.code).toBe('rateLimitExceeded');
		expect(error.retryAfter).toBe(4_000);
		// One attempt: the handlers own the retry.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('keeps only code and message on the error, never the request body', async () => {
		// A rejected board write can echo what was sent, and ApiError does not
		// redact a body.
		respond(
			{
				status: 400,
				code: 'invalidArgument',
				message: 'The request body is invalid',
				context: { name: 'leaked-board-name' },
			},
			400,
		);

		const error = await failure(
			makeMiroRequest(API_KEY, { method: 'POST', path: '/v2/boards' }),
		);
		expect(error.body).toEqual({
			code: 'invalidArgument',
			message: 'The request body is invalid',
		});
		expect(
			String(require('node:util').inspect(error, { depth: null })),
		).not.toContain('leaked-board-name');
	});

	it('never prints the token', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeMiroRequest(API_KEY, { method: 'GET', path: '/v2/boards' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(
			String(require('node:util').inspect(error, { depth: null })),
		).not.toContain(API_KEY);
	});

	it('wraps a transport failure and keeps its method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeMiroRequest(API_KEY, { method: 'PATCH', path: '/v2/boards/x' }),
		);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('PATCH');
		expect(error.message).toContain('fetch failed');
	});
});

describe('readError', () => {
	it('reads code, message and type', () => {
		expect(readError(badRequest)).toEqual({
			code: 'invalidArgument',
			message: 'The request body is invalid',
			type: 'error',
		});
	});

	it('returns empty fields for a body with nothing to read', () => {
		expect(readError({})).toEqual({
			code: undefined,
			message: undefined,
			type: undefined,
		});
		expect(readError(null).code).toBeUndefined();
		expect(readError('<html>Bad Gateway</html>').code).toBeUndefined();
	});
});

describe('describeMiroError', () => {
	it('joins the status and code', () => {
		expect(describeMiroError(404, boardNotFound, 'fallback')).toBe(
			'Miro 404 notFound: Board not found',
		);
	});

	it('falls back when the body carries nothing', () => {
		expect(describeMiroError(502, null, 'Bad Gateway')).toBe(
			'Miro 502: Bad Gateway',
		);
	});
});

describe('statusOnlyDescription', () => {
	it('names no body content', () => {
		expect(statusOnlyDescription(504, 'Gateway Timeout')).toBe(
			'request failed (Gateway Timeout)',
		);
		expect(statusOnlyDescription(undefined, undefined)).toBe('request failed');
	});
});

describe('an unmapped status', () => {
	it('does not put the echoed body in the message', async () => {
		// The shared client has no message for 504, so its ApiError.message embeds
		// the whole response body.
		respond({ echoed: { name: 'leaked-board-name' } }, 504);

		const error = await failure(
			makeMiroRequest(API_KEY, { method: 'POST', path: '/v2/boards' }),
		);

		expect(error.status).toBe(504);
		expect(error.message).toBe('Miro 504: request failed');
		expect(
			String(require('node:util').inspect(error, { depth: null })),
		).not.toContain('leaked-board-name');
	});
});
