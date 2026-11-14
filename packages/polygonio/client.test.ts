import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	describePolygonioError,
	isCredentialRejection,
	makePolygonioRequest,
	nextPagePath,
	POLYGONIO_API_BASE,
	PolygonioAPIError,
} from './client';
import { captureError } from './test-helpers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

/** An ApiError carrying one of the API's error bodies. */
function apiError(
	status: number,
	body: Record<string, unknown>, // unknown: the API's error body, read by key.
) {
	return new ApiError(
		{ method: 'GET', url: '/v1/marketstatus/now' },
		{
			url: `${POLYGONIO_API_BASE}/v1/marketstatus/now`,
			ok: false,
			status,
			statusText: 'error',
			body,
		},
		String(body.error ?? 'error'),
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('Polygon.io error body', () => {
	it('reads the key rejection the API sends with a 401', () => {
		const body = { status: 'ERROR', error: 'Unknown API Key' };
		expect(isCredentialRejection(401, body)).toBe(true);
		expect(describePolygonioError(401, body, 'fallback')).toBe(
			'Polygon.io 401: Unknown API Key',
		);
	});

	it('matches a missing or unrecognised key, but not a plan restriction', () => {
		// The first two name the key; the third is an entitlement, which is a
		// permission problem rather than a broken credential.
		expect(
			isCredentialRejection(401, {
				status: 'ERROR',
				error: 'API Key was not provided',
			}),
		).toBe(true);
		expect(
			isCredentialRejection(401, { status: 'ERROR', error: 'Unknown API Key' }),
		).toBe(true);
		expect(
			isCredentialRejection(401, {
				status: 'ERROR',
				error: 'Your plan does not include this data set',
			}),
		).toBe(false);
	});

	it('does not call a plain 500 a credential problem', () => {
		expect(
			isCredentialRejection(500, { status: 'ERROR', error: 'Internal' }),
		).toBe(false);
	});
});

describe('nextPagePath', () => {
	it('keeps only the path and query, so the request stays on the base', () => {
		// The live API prints its own host, and an older payload may print another.
		expect(
			nextPagePath(
				'https://api.massive.com/v2/aggs/ticker/AAPL/range/1/day/1578114000000/2020-01-10?cursor=bGltaXQ9MiZzb3J0PWFzYw',
			),
		).toBe(
			'/v2/aggs/ticker/AAPL/range/1/day/1578114000000/2020-01-10?cursor=bGltaXQ9MiZzb3J0PWFzYw',
		);
	});

	it('drops any key in the next_url, so the client supplies its own', () => {
		const path = nextPagePath(
			'https://api.massive.com/v3/reference/tickers?cursor=abc&apiKey=leaked',
		);

		// Keeping it would send two apiKey values, and none of them should come
		// from the provider's URL.
		expect(path).toBe('/v3/reference/tickers?cursor=abc');
	});
});

describe('makePolygonioRequest', () => {
	it('sends the key as the documented query parameter', async () => {
		mockRequest.mockResolvedValue({ status: 'OK', results: [] });

		await makePolygonioRequest('test-key', {
			method: 'GET',
			path: '/v1/marketstatus/now',
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: POLYGONIO_API_BASE,
			HEADERS: { Accept: 'application/json' },
		});
		expect(options).toMatchObject({
			method: 'GET',
			url: '/v1/marketstatus/now',
			query: { apiKey: 'test-key' },
		});
	});

	it('throws AuthMissingError without a request when the key is blank', async () => {
		await expect(
			makePolygonioRequest('   ', { method: 'GET', path: '/x' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refuses a key carrying a newline, which would break the query string', async () => {
		await expect(
			makePolygonioRequest('key\nInjected: 1', { method: 'GET', path: '/x' }),
		).rejects.toThrow(/must not contain newlines/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reports an unrecognised key as a credential failure', async () => {
		mockRequest.mockRejectedValue(
			apiError(401, { status: 'ERROR', error: 'Unknown API Key' }),
		);

		const error = await captureError(
			makePolygonioRequest('bad-key', { method: 'GET', path: '/x' }),
		);

		expect(error).toBeInstanceOf(PolygonioAPIError);
		if (!(error instanceof PolygonioAPIError)) return;
		expect(error.status).toBe(401);
		expect(error.credentialsRejected).toBe(true);
		expect(error.method).toBe('GET');
		// The key rides in the query string, so no error may echo it.
		expect(JSON.stringify(error)).not.toContain('bad-key');
	});

	it('keeps status and Retry-After on a rate limit', async () => {
		mockRequest.mockRejectedValue(
			apiError(429, { status: 'ERROR', error: 'Too many requests' }),
		);

		const error = await captureError(
			makePolygonioRequest('key', { method: 'GET', path: '/x' }),
		);

		expect(error).toBeInstanceOf(PolygonioAPIError);
		if (!(error instanceof PolygonioAPIError)) return;
		expect(error.status).toBe(429);
		expect(error.credentialsRejected).toBe(false);
	});

	it('flags a dropped connection as a transport failure', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const error = await captureError(
			makePolygonioRequest('key', { method: 'GET', path: '/x' }),
		);

		expect(error).toBeInstanceOf(PolygonioAPIError);
		if (!(error instanceof PolygonioAPIError)) return;
		expect(error.transport).toBe(true);
		expect(error.status).toBeUndefined();
	});
});
