import type { ApiBody } from './client';
import {
	describeLinklyError,
	LinklyAPIError,
	makeLinklyRequest,
	segment,
} from './client';
import {
	linklyError,
	rateLimited,
	textUnauthorized,
	unauthorized,
	validationError,
} from './test-fixtures';

const API_KEY = 'linkly-secret-test-key';

let fetchMock: jest.SpyInstance;

function respond(
	body: unknown, // unknown: response bodies are arbitrary JSON or text
	status = 200,
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

// A rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<ApiBody>): Promise<LinklyAPIError> {
	// unknown: a promise can reject with any value, so the catch binds it as
	// an opaque value before the instanceof check narrows it.
	const error = await promise.catch((e: unknown) => e); // unknown: see above
	expect(error).toBeInstanceOf(LinklyAPIError);
	if (!(error instanceof LinklyAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeLinklyRequest', () => {
	it('authenticates with a Bearer Authorization header', async () => {
		respond([{ id: 42, name: 'Marketing' }], 200);

		const result = await makeLinklyRequest(API_KEY, {
			method: 'GET',
			path: '/api/v1/workspaces',
		});

		expect(result).toEqual([{ id: 42, name: 'Marketing' }]);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.linklyhq.com/api/v1/workspaces');
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(headers.get('accept')).toBe('application/json');
	});

	it('never puts the key in the query', async () => {
		respond([], 200);

		await makeLinklyRequest(API_KEY, {
			method: 'GET',
			path: '/api/v1/workspace/42/list_links',
			query: { page: 2 },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://api.linklyhq.com/api/v1/workspace/42/list_links?page=2',
		);
		expect(url).not.toContain(API_KEY);
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({ id: 1 }, 200);

		await makeLinklyRequest(API_KEY, {
			method: 'POST',
			path: '/api/v1/link',
			body: { workspace_id: 42, url: 'https://www.example.com' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			workspace_id: 42,
			url: 'https://www.example.com',
		});
	});

	it('sends no body or content type on a bodyless DELETE', async () => {
		respond('"Link deleted."', 200);

		await makeLinklyRequest(API_KEY, {
			method: 'DELETE',
			path: '/api/v1/workspace/42/links/30',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('drops undefined query fields', async () => {
		respond({ traffic: [] }, 200);

		await makeLinklyRequest(API_KEY, {
			method: 'GET',
			path: '/api/v1/workspace/42/clicks',
			query: { start: '2026-06-01', end: undefined, bots: false },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://api.linklyhq.com/api/v1/workspace/42/clicks?start=2026-06-01&bots=false',
		);
	});

	it('reads the code and message of the error envelope', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'GET',
				path: '/api/v1/workspaces',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.code).toBe('unauthorized');
		expect(error.method).toBe('GET');
		expect(error.replaySafe).toBe(true);
		expect(error.message).toBe('Linkly 401: Not authorized');
	});

	it('reads a plain-text 401, which the spec documents for some routes', async () => {
		respond(textUnauthorized, 401);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'GET',
				path: '/api/v1/workspaces',
			}),
		);
		expect(error.message).toBe('Linkly 401: Not authorized');
		expect(error.code).toBeUndefined();
	});

	it('keeps a 429 body code and treats it as a rate limit', async () => {
		respond(rateLimited, 429);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'GET',
				path: '/api/v1/workspace/42/clicks',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.code).toBe('rate_limit_exceeded');
		expect(error.isRateLimit).toBe(true);
		expect(error.body).toEqual(rateLimited);
	});

	it('keeps the field-keyed 400 validation body', async () => {
		respond(validationError, 400);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'POST',
				path: '/api/v1/link',
				body: { workspace_id: 42, url: 'https://www.example.com', slug: '!!!' },
			}),
		);
		expect(error.status).toBe(400);
		expect(error.code).toBeUndefined();
		expect(error.body).toEqual(validationError);
		expect(error.message).toBe('Linkly 400: slug: is invalid');
	});

	it('leaves the API key out of the error and its serialisations', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'GET',
				path: '/api/v1/workspaces',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(error.cause).toBeUndefined();
	});

	it('wraps a gateway 429 with no Linkly body', async () => {
		respond('', 429);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'GET',
				path: '/api/v1/workspaces',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.isRateLimit).toBe(true);
	});

	it('wraps network failures and keeps the method and replay safety', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'POST',
				path: '/api/v1/link',
				body: { workspace_id: 42, url: 'https://www.example.com' },
				replaySafe: false,
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('POST');
		expect(error.replaySafe).toBe(false);
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('marks a GET replay-safe by default', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'GET',
				path: '/api/v1/workspaces',
			}),
		);
		expect(error.replaySafe).toBe(true);
	});
});

describe('describeLinklyError', () => {
	it('joins several field errors', () => {
		expect(
			describeLinklyError(
				400,
				{ slug: ['is invalid'], url: ['is required'] },
				'x',
			),
		).toBe('Linkly 400: slug: is invalid; url: is required');
	});

	it('prefers the envelope error over the field walk', () => {
		expect(
			describeLinklyError(500, linklyError('Boom', 'internal_error'), 'x'),
		).toBe('Linkly 500: Boom');
	});

	it('falls back when the body has no error text', () => {
		expect(describeLinklyError(503, '<html>down</html>', 'Unavailable')).toBe(
			'Linkly 503: Unavailable',
		);
		expect(describeLinklyError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('https://hooks.example.com/a?b=1')).toBe(
			'https%3A%2F%2Fhooks.example.com%2Fa%3Fb%3D1',
		);
		expect(segment(12)).toBe('12');
	});
});
