import { inspect as util_inspect } from 'node:util';
import {
	makeSegmentRequest,
	pathSegment,
	paginationQuery,
	SegmentAPIError,
	SEGMENT_API_BASE,
	SEGMENT_DEFAULT_PAGE_SIZE,
} from './client';
import { forbiddenBody, sourceEnvelope, unauthorizedBody } from './test-fixtures';

const TOKEN = 'sst-secret-token';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
// unknown: response bodies are arbitrary JSON or text.
function respond(
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
// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<SegmentAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(SegmentAPIError);
	if (!(error instanceof SegmentAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeSegmentRequest', () => {
	it('authenticates with a Bearer token on api.segmentapis.com', async () => {
		respond(sourceEnvelope, 200);

		const result = await makeSegmentRequest(TOKEN, {
			method: 'GET',
			path: '/sources/abc',
		});

		expect(result).toEqual(sourceEnvelope);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${SEGMENT_API_BASE}/sources/abc`);
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
	});

	it('serializes pagination as dot-style query params', async () => {
		respond(sourceEnvelope, 200);

		await makeSegmentRequest(TOKEN, {
			method: 'GET',
			path: '/sources',
			query: { 'pagination.count': 25, 'pagination.cursor': 'Mw==' },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('pagination.count=25');
		expect(url).toContain('pagination.cursor=Mw%3D%3D');
	});

	it('sends JSON bodies with a JSON content type', async () => {
		respond(sourceEnvelope, 201);

		await makeSegmentRequest(TOKEN, {
			method: 'POST',
			path: '/sources',
			body: { slug: 'swift', metadataId: 'dZeHygTSD4', enabled: true },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			slug: 'swift',
			metadataId: 'dZeHygTSD4',
			enabled: true,
		});
	});

	it('sends no body or content type on a bodyless POST', async () => {
		respond(sourceEnvelope, 200);

		await makeSegmentRequest(TOKEN, {
			method: 'POST',
			path: '/sources/abc/writekey',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('surfaces the 403 forbidden message on a bad token', async () => {
		respond(forbiddenBody, 403);

		const error = await failure(
			makeSegmentRequest(TOKEN, {
				method: 'GET',
				path: '/no/such/route',
			}),
		);
		expect(error.status).toBe(403);
		expect(error.method).toBe('GET');
		expect(error.message).toContain('Not authorized');
	});

	it('surfaces the 401 message when no header was sent', async () => {
		respond(unauthorizedBody, 401);

		const error = await failure(
			makeSegmentRequest('', { method: 'GET', path: '/' }),
		);
		expect(error.status).toBe(401);
	});

	it('reads Retry-After into retryAfter', async () => {
		respond(forbiddenBody, 429, { 'Retry-After': '60' });

		const error = await failure(
			makeSegmentRequest(TOKEN, {
				method: 'GET',
				path: '/sources',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(60_000);
	});

	it('falls back to the 429 body msBeforeNext when no header came', async () => {
		respond(
			{
				errors: [{ type: 'RateLimited', message: 'Rate limit exceeded' }],
				data: { msBeforeNext: 2500 },
			},
			429,
		);

		const error = await failure(
			makeSegmentRequest(TOKEN, {
				method: 'GET',
				path: '/sources',
			}),
		);
		expect(error.retryAfter).toBe(2500);
	});

	// unknown: util.inspect shows non-enumerable fields JSON.stringify hides.
	it('keeps the response body and the token out of errors', async () => {
		respond(forbiddenBody, 403);

		const error = await failure(
			makeSegmentRequest(TOKEN, {
				method: 'GET',
				path: '/sources',
				query: { 'pagination.count': SEGMENT_DEFAULT_PAGE_SIZE },
			}),
		);
		// Source bodies embed writeKeys, so no error ever carries a body.
		expect(JSON.stringify(error)).not.toContain('errors');
		expect(error.message).not.toContain(TOKEN);
		expect(util_inspect(error)).not.toContain(TOKEN);
		expect(util_inspect(error)).not.toContain('forbidden');
	});

	it('wraps network failures and keeps their cause', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeSegmentRequest(TOKEN, {
				method: 'GET',
				path: '/sources',
			}),
		);
		expect(error.message).toBe('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makeSegmentRequest(TOKEN, {
				method: 'POST',
				path: '/sources',
				body: {},
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.method).toBe('POST');
	});
});

describe('pathSegment', () => {
	it('encodes a value for one path segment', () => {
		expect(pathSegment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(pathSegment(12)).toBe('12');
	});
});

describe('paginationQuery', () => {
	it('always sends a count, defaulting to the documented page size', () => {
		expect(paginationQuery()).toEqual({ 'pagination.count': 200 });
		expect(paginationQuery(undefined, 'Mg==')).toEqual({
			'pagination.count': 200,
			'pagination.cursor': 'Mg==',
		});
		expect(paginationQuery(1000, undefined)).toEqual({
			'pagination.count': 1000,
		});
	});
});
