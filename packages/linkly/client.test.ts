import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import type { ApiBody } from './client';
import {
	describeLinklyError,
	linklyErrorCode,
	linklyRequestFacts,
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

// Core's 429 backoff sleeps 1 + 2 + 4 s before the last attempt.
jest.setTimeout(30_000);

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
async function failure(promise: Promise<ApiBody>): Promise<ApiError> {
	// unknown: a promise can reject with any value, so the catch binds it as
	// an opaque value before the instanceof check narrows it.
	const error = await promise.catch((e: unknown) => e); // unknown: see above
	expect(error).toBeInstanceOf(ApiError);
	if (!(error instanceof ApiError)) throw error;
	return error;
}

beforeEach(() => {
	// A call with no queued response throws instead of reaching Linkly
	// (CodeRabbit nitpick on client.test.ts:48).
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
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
		expect(linklyErrorCode(error.body)).toBe('unauthorized');
		expect(linklyRequestFacts(error)).toEqual({
			method: 'GET',
			replaySafe: true,
		});
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
		expect(linklyErrorCode(error.body)).toBeUndefined();
	});

	it('leaves 429 retries to core, then throws its ApiError with the body', async () => {
		for (let i = 0; i < 4; i += 1) respond(rateLimited, 429);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'GET',
				path: '/api/v1/workspace/42/clicks',
			}),
		);
		expect(error.status).toBe(429);
		expect(linklyErrorCode(error.body)).toBe('rate_limit_exceeded');
		expect(error.isRateLimitError()).toBe(true);
		expect(error.body).toEqual(rateLimited);
		// One attempt plus core's three retries.
		expect(fetchMock).toHaveBeenCalledTimes(4);
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
		expect(linklyErrorCode(error.body)).toBeUndefined();
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
		expect(inspect(error, { depth: 10 })).not.toContain(API_KEY);
	});

	it('drops the request body, so passwords and destinations stay out of the error', async () => {
		respond(validationError, 400);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'POST',
				path: '/api/v1/link',
				body: {
					workspace_id: 42,
					url: 'https://private.example.com/secret-offer',
					password: 'hunter2-link-password',
				},
			}),
		);
		const dump = inspect(error, { depth: 10 });
		expect(error.request.body).toBeUndefined();
		expect(dump).not.toContain('hunter2-link-password');
		expect(dump).not.toContain('secret-offer');
		expect(error.request.method).toBe('POST');
	});

	it('masks the webhook URL in an unsubscribe path, so a hook token stays out of the error', async () => {
		respond(linklyError('Not found', 'not_found'), 404);
		const hook = 'https://hooks.example.com/hook-secret-token';

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'DELETE',
				path: `/api/v1/link/30/webhooks/${segment(hook)}`,
			}),
		);
		// CodeRabbit thread on client.ts:160.
		const dump = inspect(error, { depth: 10 });
		expect(dump).not.toContain('hook-secret-token');
		expect(JSON.stringify(error)).not.toContain('hook-secret-token');
		expect(error.url).toBe(
			'https://api.linklyhq.com/api/v1/link/30/webhooks/[REDACTED]',
		);
		expect(error.status).toBe(404);
	});

	it('passes timeoutMs to core as its request timeout, and keeps core default otherwise', async () => {
		const timeout = jest.spyOn(AbortSignal, 'timeout');
		respond([], 200);
		respond([], 200);

		await makeLinklyRequest(API_KEY, {
			method: 'POST',
			path: '/api/v1/links',
			body: [],
			timeoutMs: 60_000,
		});
		await makeLinklyRequest(API_KEY, {
			method: 'GET',
			path: '/api/v1/workspaces',
		});

		// CodeRabbit thread on client.ts:185.
		expect(timeout.mock.calls.map(([ms]) => ms)).toEqual([60_000, 20_000]);
		timeout.mockRestore();
	});

	it('throws a gateway 429 with no Linkly body after core retries', async () => {
		for (let i = 0; i < 4; i += 1) respond('', 429);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'GET',
				path: '/api/v1/workspaces',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.isRateLimitError()).toBe(true);
	});

	it('rethrows network failures as they are, with the method and replay safety beside them', async () => {
		const cause = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await makeLinklyRequest(API_KEY, {
			method: 'POST',
			path: '/api/v1/link',
			body: { workspace_id: 42, url: 'https://www.example.com' },
			replaySafe: false,
		}).catch((e: unknown) => e); // unknown: any rejection value
		expect(error).toBe(cause);
		expect(linklyRequestFacts(error)).toEqual({
			method: 'POST',
			replaySafe: false,
		});
	});

	it('marks a GET replay-safe by default', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeLinklyRequest(API_KEY, {
				method: 'GET',
				path: '/api/v1/workspaces',
			}),
		);
		expect(linklyRequestFacts(error)?.replaySafe).toBe(true);
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
