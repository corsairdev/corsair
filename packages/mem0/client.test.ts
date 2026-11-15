import {
	describeMem0Error,
	Mem0APIError,
	makeMem0Request,
	segment,
} from './client';
import {
	badRequest,
	memory,
	memoryNotFound,
	rateLimited,
	serverError,
	unauthorized,
} from './test-fixtures';

const API_KEY = 'm0-secret-test-key';

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

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<Mem0APIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(Mem0APIError);
	if (!(error instanceof Mem0APIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeMem0Request', () => {
	it('authenticates with Authorization: Token and no x-api-key header', async () => {
		respond(memory, 200);

		const result = await makeMem0Request(API_KEY, {
			method: 'GET',
			path: '/v1/memories/ea925981/',
		});

		expect(result).toEqual(memory);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.mem0.ai/v1/memories/ea925981/');
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('authorization')).toBe(`Token ${API_KEY}`);
		expect(headers.get('x-api-key')).toBeNull();
		expect(headers.get('content-type')).toBeNull();
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({ results: [] }, 200);

		await makeMem0Request(API_KEY, {
			method: 'POST',
			path: '/v3/memories/search/',
			body: { query: 'hobbies', filters: { user_id: 'alice' } },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			query: 'hobbies',
			filters: { user_id: 'alice' },
		});
	});

	it('sends no body or content type on a bodyless DELETE', async () => {
		respond(memoryNotFound, 200);

		await makeMem0Request(API_KEY, {
			method: 'DELETE',
			path: '/v1/memories/ea925981/',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('encodes a metadata filter map as nested query keys', async () => {
		respond({ message: 'Delete in progress.' }, 200);

		await makeMem0Request(API_KEY, {
			method: 'DELETE',
			path: '/v1/memories/',
			query: { user_id: 'alice', metadata: { tier: 'gold' } },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('user_id=alice');
		expect(url).toContain('metadata%5Btier%5D=gold');
	});

	it('reads the message of a 400 from a v3 endpoint', async () => {
		respond(badRequest('Invalid input data.'), 400);

		const error = await failure(
			makeMem0Request(API_KEY, {
				method: 'POST',
				path: '/v3/memories/add/',
				body: {},
			}),
		);
		expect(error.status).toBe(400);
		expect(error.method).toBe('POST');
		expect(error.isRateLimit).toBe(false);
		expect(error.message).toBe('Mem0 400: Invalid input data.');
	});

	it('prefers details.message over the error field of a 401', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeMem0Request(API_KEY, {
				method: 'GET',
				path: '/v1/memories/ea925981/',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.body).toEqual(unauthorized);
		expect(error.message).toBe('Mem0 401: Invalid API key');
	});

	it('reads the error field of a 404', async () => {
		respond(memoryNotFound, 404);

		const error = await failure(
			makeMem0Request(API_KEY, {
				method: 'GET',
				path: '/v1/memories/ea925981/',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.message).toBe('Mem0 404: Memory not found!');
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(rateLimited, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeMem0Request(API_KEY, {
				method: 'POST',
				path: '/v3/memories/search/',
				body: {},
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('resolves a 204 as undefined', async () => {
		respondEmpty(204);

		await expect(
			makeMem0Request(API_KEY, {
				method: 'DELETE',
				path: '/v1/memories/ea925981/',
			}),
		).resolves.toBeUndefined();
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeMem0Request(API_KEY, {
				method: 'GET',
				path: '/v1/memories/ea925981/',
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makeMem0Request(API_KEY, {
				method: 'POST',
				path: '/v3/memories/add/',
				body: {},
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
	});

	it('leaves the API key out of errors', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeMem0Request(API_KEY, {
				method: 'GET',
				path: '/v1/memories/ea925981/',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});
});

describe('describeMem0Error', () => {
	it('reads the details.message of a v3 error', () => {
		expect(describeMem0Error(400, badRequest('Invalid input data.'), 'x')).toBe(
			'Mem0 400: Invalid input data.',
		);
	});

	it('prefers details.message over a generic error field', () => {
		expect(describeMem0Error(500, serverError, 'x')).toBe(
			'Mem0 500: An unexpected error occurred.',
		);
	});

	it('reads the error field when there are no details', () => {
		expect(describeMem0Error(500, { error: 'Internal error' }, 'x')).toBe(
			'Mem0 500: Internal error',
		);
	});

	it('reads the first message of a field-keyed validation error', () => {
		const body = { name: ['This field is required.'] };
		expect(describeMem0Error(400, body, 'x')).toBe(
			'Mem0 400: name: This field is required.',
		);
	});

	it('falls back when the body has no error text', () => {
		expect(describeMem0Error(503, '<html>down</html>', 'Unavailable')).toBe(
			'Mem0 503: Unavailable',
		);
		expect(describeMem0Error(undefined, undefined, 'timeout')).toBe('timeout');
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment(12)).toBe('12');
	});
});
