import {
	describeFreshBooksError,
	FreshBooksAPIError,
	makeFreshBooksRequest,
	readFreshBooksErrors,
	segment,
} from './client';
import {
	accountNotFound,
	bareAuthError,
	bareRouteMiss,
	oauthError,
} from './test-fixtures';

const API_KEY = 'fb-test-access-token';

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
async function failure(promise: Promise<unknown>): Promise<FreshBooksAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(FreshBooksAPIError);
	if (!(error instanceof FreshBooksAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeFreshBooksRequest', () => {
	it('authenticates with a Bearer header and no query key', async () => {
		respond({ ok: true }, 200);

		await makeFreshBooksRequest(API_KEY, {
			method: 'GET',
			path: '/auth/api/v1/users/me',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.freshbooks.com/auth/api/v1/users/me');
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(headers.get('content-type')).toBeNull();
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({ ok: true }, 200);

		await makeFreshBooksRequest(API_KEY, {
			method: 'POST',
			path: '/accounting/account/LJArJ4/users/clients',
			body: { client: { fname: 'Melville' } },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			client: { fname: 'Melville' },
		});
	});

	it('sends no body or content type on a bodyless DELETE', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		await expect(
			makeFreshBooksRequest(API_KEY, {
				method: 'DELETE',
				path: '/timetracking/business/77128/time_entries/5095',
			}),
		).resolves.toBeUndefined();

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('encodes bracket query keys for the transport', async () => {
		respond({ ok: true }, 200);

		await makeFreshBooksRequest(API_KEY, {
			method: 'GET',
			path: '/accounting/account/LJArJ4/users/clients',
			query: { page: 1, per_page: 100 },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://api.freshbooks.com/accounting/account/LJArJ4/users/clients?page=1&per_page=100',
		);
	});

	it('describes an accounting error with its errno', async () => {
		respond(accountNotFound, 404);

		const error = await failure(
			makeFreshBooksRequest(API_KEY, {
				method: 'GET',
				path: '/accounting/account/FAKEACC/users/clients',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.errno).toBe(404);
		expect(error.method).toBe('GET');
		expect(error.message).toBe(
			'FreshBooks 404 errno 404: Account not found',
		);
	});

	it('describes a bare auth error from the projects family', async () => {
		respond(bareAuthError, 401);

		const error = await failure(
			makeFreshBooksRequest(API_KEY, {
				method: 'GET',
				path: '/projects/business/77128/projects',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.errno).toBeUndefined();
		expect(error.message).toBe(
			'FreshBooks 401: Authentication is required to complete this request.',
		);
	});

	it('describes a bare route miss', async () => {
		respond(bareRouteMiss, 404);

		const error = await failure(
			makeFreshBooksRequest(API_KEY, {
				method: 'GET',
				path: '/projects/business/FAKEBIZ/projects',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.message).toBe(
			'FreshBooks 404: The requested URL was not found on the server.',
		);
	});

	it('describes an OAuth2 error body from the auth family', async () => {
		respond(oauthError, 401);

		const error = await failure(
			makeFreshBooksRequest(API_KEY, {
				method: 'GET',
				path: '/auth/api/v1/users/me',
			}),
		);
		expect(error.message).toBe(
			'FreshBooks 401: This action requires authentication to continue.',
		);
	});

	it('reads Retry-After into the error', async () => {
		respond({ ok: true }, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeFreshBooksRequest(API_KEY, {
				method: 'GET',
				path: '/accounting/account/LJArJ4/users/clients',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps transport failures with the method and no status', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeFreshBooksRequest(API_KEY, {
				method: 'GET',
				path: '/auth/api/v1/users/me',
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
	});

	it('leaves the access token out of the error, message and inspect', async () => {
		respond(accountNotFound, 404);

		const error = await failure(
			makeFreshBooksRequest(API_KEY, {
				method: 'GET',
				path: '/accounting/account/FAKEACC/users/clients',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		// The ApiError cause is dropped, not attached: it holds the request
		// with the Authorization header, which no core redaction covers.
		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('Bearer');
		const { inspect } = await import('node:util');
		expect(inspect(error)).not.toContain(API_KEY);
	});
});

describe('describeFreshBooksError', () => {
	it('falls back when the body has no error text', () => {
		expect(describeFreshBooksError(503, '<html>down</html>', 'Down')).toBe(
			'FreshBooks 503: Down',
		);
		expect(describeFreshBooksError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});

	it('prefers the accounting message over the top level', () => {
		const body = {
			response: { errors: [{ errno: 1012, message: 'Not found' }] },
			message: 'ignored',
		};
		expect(describeFreshBooksError(404, body, 'x')).toBe(
			'FreshBooks 404 errno 1012: Not found',
		);
	});
});

describe('readFreshBooksErrors', () => {
	it('returns nothing for a success envelope', () => {
		const body = { response: { result: { client: { id: 1 } } } };
		expect(readFreshBooksErrors(body)).toEqual([]);
	});

	it('skips entries without a message', () => {
		const body = { response: { errors: [{ errno: 7 }, { message: 'bad' }] } };
		expect(readFreshBooksErrors(body)).toEqual([{ message: 'bad', errno: undefined }]);
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment(12)).toBe('12');
	});
});
