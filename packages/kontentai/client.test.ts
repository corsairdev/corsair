import { ApiError } from 'corsair/http';
import {
	describeKontentError,
	makeKontentRequest,
	nextSkipFrom,
	readError,
} from './client';

const ENVIRONMENT_ID = '975bf280-fd91-488c-994c-2f04416e5ee3';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('readError', () => {
	it('reads the message, code and request id', () => {
		expect(
			readError({
				message: 'The requested content item was not found.',
				request_id: 'abc',
				error_code: 100,
				specific_code: 0,
			}),
		).toEqual({
			message: 'The requested content item was not found.',
			requestId: 'abc',
			errorCode: 100,
			specificCode: 0,
		});
	});

	it.each([[undefined], [null], [{}], [[]], ['text']])(
		'returns empty fields for %j',
		(body) => {
			expect(readError(body)).toEqual({
				message: undefined,
				requestId: undefined,
				errorCode: undefined,
				specificCode: undefined,
			});
		},
	);
});

describe('describeKontentError', () => {
	it('puts the status and code in front, with the request id last', () => {
		expect(
			describeKontentError(
				404,
				{ message: 'Not found', request_id: 'abc', error_code: 100 },
				'x',
			),
		).toBe('Kontent 404 100: Not found (request abc)');
	});

	it('leaves the request id out when there is none', () => {
		expect(describeKontentError(429, { message: 'Slow down' }, 'x')).toBe(
			'Kontent 429: Slow down',
		);
	});

	it('uses the fallback when the body has no message', () => {
		expect(describeKontentError(503, undefined, 'Service Unavailable')).toBe(
			'Kontent 503: Service Unavailable',
		);
	});
});

describe('nextSkipFrom', () => {
	it('reads the skip out of a full next_page URL', () => {
		expect(
			nextSkipFrom(
				{
					pagination: {
						next_page: `https://deliver.kontent.ai/${ENVIRONMENT_ID}/items?limit=10&skip=20`,
					},
				},
				10,
				10,
				10,
			),
		).toBe(20);
	});

	it('treats an empty next_page as the last page, even on a full page', () => {
		expect(
			nextSkipFrom({ pagination: { next_page: '' } }, 0, 10, 10),
		).toBeNull();
	});

	it('reads a relative next_page', () => {
		expect(
			nextSkipFrom({ pagination: { next_page: '/items?skip=30' } }, 20, 10, 10),
		).toBe(30);
	});

	it('falls back to a full page when the body has no pagination', () => {
		expect(nextSkipFrom({ items: [] }, 0, 10, 10)).toBe(10);
	});

	it('reports no next page on a short page without pagination', () => {
		expect(nextSkipFrom({ items: [] }, 0, 3, 10)).toBeNull();
	});
});

describe('makeKontentRequest', () => {
	it('addresses the environment under deliver.kontent.ai', async () => {
		respond({ items: [] });

		await makeKontentRequest(ENVIRONMENT_ID, { method: 'GET', path: '/items' });

		expect(lastRequest().path).toBe(`/${ENVIRONMENT_ID}/items`);
	});

	it('sends no authorization header without a Delivery API key', async () => {
		respond({ items: [] });

		await makeKontentRequest(ENVIRONMENT_ID, { method: 'GET', path: '/items' });

		expect(lastRequest().headers.get('authorization')).toBeNull();
	});

	it('sends a preview read to preview-deliver.kontent.ai with the key', async () => {
		respond({ items: [] });

		await makeKontentRequest(
			ENVIRONMENT_ID,
			{ method: 'GET', path: '/items', preview: true },
			'delivery-key',
		);

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(new URL(url).origin).toBe('https://preview-deliver.kontent.ai');
		expect(lastRequest().headers.get('authorization')).toBe(
			'Bearer delivery-key',
		);
	});

	it('refuses a request with no environment ID before it is sent', async () => {
		await expect(
			makeKontentRequest('', { method: 'GET', path: '/items' }),
		).rejects.toMatchObject({
			name: 'KontentAPIError',
			message: expect.stringContaining('environment ID'),
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('turns an error body into one error with its code', async () => {
		respond(
			{
				message: "The requested content item 'nope' was not found.",
				request_id: 'abc',
				error_code: 100,
			},
			404,
		);

		await expect(
			makeKontentRequest(ENVIRONMENT_ID, {
				method: 'GET',
				path: '/items/nope',
			}),
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 404,
			body: { error_code: 100, request_id: 'abc' },
			message:
				"Kontent 404 100: The requested content item 'nope' was not found. (request abc)",
			request: { method: 'GET' },
		});
	});

	it('keeps filter values out of an HTTP error', async () => {
		respond({ message: 'Unauthorized', request_id: 'r1', error_code: 0 }, 401);

		const error = await makeKontentRequest(ENVIRONMENT_ID, {
			method: 'GET',
			path: '/items',
			query: { 'elements.email': 'alice@example.com', limit: 5 },
			// unknown: a rejection value has no static type; checked below.
		}).catch((caught: unknown) => caught);
		if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
		const serialized = JSON.stringify(error);
		expect(serialized).not.toContain('alice');
		expect(error.request).toEqual({
			method: 'GET',
			url: `/${ENVIRONMENT_ID}/items`,
		});
		expect(error.url).toBe(
			`https://deliver.kontent.ai/${ENVIRONMENT_ID}/items`,
		);
		expect(error.status).toBe(401);
	});

	it('keeps a Retry-After header as milliseconds', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ message: 'Slow down' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '3' },
			}),
		);

		await expect(
			makeKontentRequest(ENVIRONMENT_ID, { method: 'GET', path: '/items' }),
		).rejects.toMatchObject({ retryAfter: 3000, status: 429 });
	});

	it('passes an HTTP failure on as core ApiError', async () => {
		respond({ message: 'Not found', error_code: 100 }, 404);

		await expect(
			makeKontentRequest(ENVIRONMENT_ID, { method: 'GET', path: '/items' }),
		).rejects.toBeInstanceOf(ApiError);
	});

	it('marks a transport failure and keeps its cause, which never held a body', async () => {
		const dropped = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(dropped);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKontentRequest(ENVIRONMENT_ID, {
			method: 'GET',
			path: '/items',
		}).catch((caught: unknown) => caught)) as Error;

		expect(error).toMatchObject({ transport: true, message: 'fetch failed' });
		expect(error.cause).toBe(dropped);
	});

	it('separates a timeout from a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		await expect(
			makeKontentRequest(ENVIRONMENT_ID, { method: 'GET', path: '/items' }),
		).rejects.toMatchObject({ timedOut: true, transport: true });
	});
});
