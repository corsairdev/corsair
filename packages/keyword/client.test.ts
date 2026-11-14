import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	describeKeywordError,
	isKeywordRateLimit,
	makeKeywordRequest,
	projectSegment,
	readErrors,
	stripProjectAuth,
} from './client';
import { KEYWORD_CONTENT_TYPE, projectNotFound } from './test-fixtures';

const API_KEY = 'kw-test-token';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(status === 204 ? null : JSON.stringify(body), {
			status,
			headers: status === 204 ? {} : { 'Content-Type': KEYWORD_CONTENT_TYPE },
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
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response with respond first');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('projectSegment', () => {
	it('encodes a plain name', () => {
		expect(projectSegment('Disney')).toBe('Disney');
	});

	it('keeps the [sub] marker readable and encodes the spaces', () => {
		expect(projectSegment('Disney[sub]Disney Classics')).toBe(
			'Disney[sub]Disney%20Classics',
		);
	});

	it('encodes a slash so the name cannot escape its segment', () => {
		expect(projectSegment('a/b')).toBe('a%2Fb');
	});
});

describe('readErrors', () => {
	it('reads the first error of a JSON:API envelope', () => {
		expect(
			readErrors({
				errors: [
					{ code: '401', title: 'Unauthorized', message: 'Unauthenticated.' },
				],
			}),
		).toEqual({
			code: '401',
			title: 'Unauthorized',
			message: 'Unauthenticated.',
		});
	});

	it('reads a numeric code as a string', () => {
		expect(
			readErrors({ errors: [{ code: 422, message: 'Bad' }] }),
		).toMatchObject({
			code: '422',
		});
	});

	it('falls back to detail when there is no message', () => {
		expect(readErrors({ errors: [{ detail: 'A detail' }] })).toMatchObject({
			message: 'A detail',
		});
	});

	it.each([[undefined], [null], [{}], [[]], [{ errors: [] }]])(
		'returns nothing for %j',
		(body) => {
			expect(readErrors(body)).toEqual({});
		},
	);
});

describe('describeKeywordError', () => {
	it('puts the status in front of the message', () => {
		expect(
			describeKeywordError(
				401,
				{ errors: [{ message: 'Unauthenticated.' }] },
				'x',
			),
		).toBe('Keyword 401: Unauthenticated.');
	});

	it('falls back to the title when there is no message', () => {
		expect(
			describeKeywordError(403, { errors: [{ title: 'Forbidden' }] }, 'x'),
		).toBe('Keyword 403: Forbidden');
	});

	it('uses the fallback when the body has neither', () => {
		expect(describeKeywordError(500, undefined, 'Internal Server Error')).toBe(
			'Keyword 500: Internal Server Error',
		);
	});
});

describe('stripProjectAuth', () => {
	it('removes the project auth key at any depth', () => {
		const cleaned = stripProjectAuth({
			data: [
				{
					attributes: { auth: 'SECRET', name: 'Disney' },
					nested: { auth: 'SECRET2' },
				},
			],
		});

		expect(JSON.stringify(cleaned)).not.toContain('SECRET');
		expect(cleaned).toEqual({
			data: [{ attributes: { name: 'Disney' }, nested: {} }],
		});
	});

	it('removes the Intercom identity hash users/self returns (live, 11-14)', () => {
		const cleaned = stripProjectAuth({
			data: {
				type: 'user',
				attributes: {
					user_id: 294208,
					intercom_hash: 'INTERCOM-HMAC',
					intercom_user_id: 'intercom-user',
				},
			},
		});

		expect(JSON.stringify(cleaned)).not.toContain('INTERCOM-HMAC');
	});

	it('leaves a value that is not a record alone', () => {
		expect(stripProjectAuth('a string')).toBe('a string');
		expect(stripProjectAuth(42)).toBe(42);
		expect(stripProjectAuth(null)).toBeNull();
	});
});

describe('makeKeywordRequest', () => {
	it('sends the key as a bearer token', async () => {
		respond({ data: [] });

		await makeKeywordRequest(API_KEY, {
			method: 'GET',
			path: '/groups/active',
		});

		expect(lastRequest().headers.get('authorization')).toBe(
			`Bearer ${API_KEY}`,
		);
	});

	it('addresses the v2 API', async () => {
		respond({ data: [] });

		await makeKeywordRequest(API_KEY, {
			method: 'GET',
			path: '/groups/active',
		});

		expect(lastRequest().path).toBe('/api/v2/groups/active');
	});

	it('sends a body as JSON and sets the content type', async () => {
		respond({ data: {} });

		await makeKeywordRequest(API_KEY, {
			method: 'POST',
			path: '/groups',
			body: { data: { type: 'group', attributes: { category: 'X' } } },
		});

		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toBe(
			'{"data":{"type":"group","attributes":{"category":"X"}}}',
		);
	});

	it('sends no body and no content type for a request with none', async () => {
		respond({ data: [] });

		await makeKeywordRequest(API_KEY, { method: 'DELETE', path: '/groups/X' });

		const sent = lastRequest();
		expect(sent.body).toBeUndefined();
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('turns a JSON:API error into one error with the status as its code', async () => {
		respond(
			{
				errors: [
					{
						code: '422',
						title: 'Invalid',
						message: 'The url field is required.',
					},
				],
			},
			422,
		);

		await expect(
			makeKeywordRequest(API_KEY, { method: 'POST', path: '/groups' }),
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 422,
			body: { errors: [{ code: '422' }] },
			message: 'Keyword 422: The url field is required.',
			request: { method: 'POST' },
		});
	});

	it('parses a body Keyword sends as application/vnd.api+json', async () => {
		respond({ data: [{ type: 'group', id: 'corsair.dev' }] });

		await expect(
			makeKeywordRequest(API_KEY, { method: 'GET', path: '/groups' }),
		).resolves.toEqual({ data: [{ type: 'group', id: 'corsair.dev' }] });
	});

	it('reads the error envelope of a vnd.api+json error body', async () => {
		respond(projectNotFound, 404);

		await expect(
			makeKeywordRequest(API_KEY, {
				method: 'GET',
				path: '/groups/missing/keywords',
			}),
		).rejects.toMatchObject({
			status: 404,
			body: { errors: [{ code: '1001' }] },
			message: 'Keyword 404: The project not found',
		});
	});

	it('fails clearly on a success body that is not JSON', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('<html>maintenance</html>', {
				status: 200,
				headers: { 'Content-Type': 'text/html' },
			}),
		);

		await expect(
			makeKeywordRequest(API_KEY, { method: 'GET', path: '/groups' }),
		).rejects.toMatchObject({
			name: 'KeywordAPIError',
			message: 'Keyword answered a body that is not JSON',
		});
	});

	it('keeps a Retry-After header as milliseconds', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({ errors: [{ code: '429', message: 'Slow' }] }),
				{
					status: 429,
					headers: { 'Content-Type': KEYWORD_CONTENT_TYPE, 'Retry-After': '4' },
				},
			),
		);

		const error = await makeKeywordRequest(API_KEY, {
			method: 'GET',
			path: '/users/self',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ retryAfter: 4000 });
		expect(isKeywordRateLimit(error)).toBe(true);
	});

	it('keeps no body on the error, so a project auth key cannot leak', async () => {
		respond(
			{
				errors: [
					{ code: '422', message: 'Bad', detail: 'auth: PROJECT-AUTH-KEY' },
				],
			},
			422,
		);

		const error = await makeKeywordRequest(API_KEY, {
			method: 'POST',
			path: '/groups',
			body: { url: 'secret-sent-value' },
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect(inspect(error, { depth: 10 })).not.toContain('PROJECT-AUTH-KEY');
		expect(inspect(error, { depth: 10 })).not.toContain('secret-sent-value');
	});

	it('uses a fixed message when the body has none, not the raw body', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('gateway said: project auth PROJECT-AUTH-KEY', {
				status: 504,
				headers: { 'Content-Type': 'text/plain' },
			}),
		);

		const error = await makeKeywordRequest(API_KEY, {
			method: 'GET',
			path: '/groups',
		}).catch((caught: unknown) => caught);

		expect(error).toMatchObject({
			status: 504,
			message: 'Keyword 504: Keyword request failed',
		});
	});

	it('marks a transport failure and keeps its cause, which never held a body', async () => {
		const dropped = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(dropped);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKeywordRequest(API_KEY, {
			method: 'GET',
			path: '/users/self',
		}).catch((caught: unknown) => caught)) as Error;

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
			makeKeywordRequest(API_KEY, {
				method: 'POST',
				path: '/keywords/refresh',
			}),
		).rejects.toMatchObject({
			timedOut: true,
			transport: true,
			method: 'POST',
		});
	});
});
