import {
	describeRedcircleError,
	makeRedcircleRequest,
	REDCIRCLE_API_BASE,
	RedcircleAPIError,
} from './client';
import {
	INCIDENT,
	INVALID_KEY,
	INVALID_TYPE,
	QUOTA_EXCEEDED,
} from './test-fixtures';
import { captureError, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('request construction', () => {
	it('sends the key as the api_key query parameter', async () => {
		respond(fetchMock, { request_info: { success: true }, search_results: [] });

		await makeRedcircleRequest('secret-key', {
			method: 'GET',
			path: '/request',
			query: { type: 'search', search_term: 'pens' },
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe(REDCIRCLE_API_BASE);
		expect(request.path).toBe('/request');
		expect(request.query).toEqual({
			type: 'search',
			search_term: 'pens',
			api_key: 'secret-key',
		});
		expect(request.headers.get('authorization')).toBeNull();
	});

	it('sends no body, because every route here is a GET', async () => {
		respond(fetchMock, {});

		await makeRedcircleRequest('key', {
			method: 'GET',
			path: '/account',
			replayable: true,
		});

		expect(lastRequest(fetchMock).method).toBe('GET');
	});
});

describe('the request_info envelope', () => {
	it('reads the live 401 body', async () => {
		respond(fetchMock, INVALID_KEY, 401);

		const error = (await captureError(
			makeRedcircleRequest('bad', {
				method: 'GET',
				path: '/request',
				query: { type: 'search' },
				replayable: true,
			}),
		)) as RedcircleAPIError;

		expect(error).toBeInstanceOf(RedcircleAPIError);
		expect(error.status).toBe(401);
		expect(error.isAuthError).toBe(true);
		expect(error.detail).toBe('Supplied api_key is not valid');
		expect(error.message).toBe('RedCircle 401: Supplied api_key is not valid');
	});

	it('reads the live 400 that names the valid types', async () => {
		respond(fetchMock, INVALID_TYPE, 400);

		const error = (await captureError(
			makeRedcircleRequest('key', {
				method: 'GET',
				path: '/request',
				query: { type: 'nope' },
				replayable: true,
			}),
		)) as RedcircleAPIError;

		expect(error.status).toBe(400);
		expect(error.isValidationError).toBe(true);
		expect(error.message).toContain("valid values are 'reviews', 'product'");
	});

	it('reports a spent balance as a quota error, not a rate limit', async () => {
		respond(fetchMock, QUOTA_EXCEEDED, 402);

		const error = (await captureError(
			makeRedcircleRequest('key', {
				method: 'GET',
				path: '/request',
				query: { type: 'search' },
				replayable: true,
			}),
		)) as RedcircleAPIError;

		expect(error.status).toBe(402);
		expect(error.isQuotaError).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('describes a body with no request_info from the fallback', () => {
		expect(describeRedcircleError(500, {}, 'Request failed')).toBe(
			'RedCircle 500: Request failed',
		);
	});
});

describe('the incident retry_after', () => {
	it('turns the body seconds into milliseconds', async () => {
		respond(fetchMock, INCIDENT, 503);

		const error = (await captureError(
			makeRedcircleRequest('key', {
				method: 'GET',
				path: '/request',
				query: { type: 'search', search_term: 'pens' },
				replayable: true,
			}),
		)) as RedcircleAPIError;

		expect(error.status).toBe(503);
		expect(error.isIncident).toBe(true);
		expect(error.detail).toBe(INCIDENT.message);
		expect(error.message).toContain(INCIDENT.message);
		// The body says 3600 seconds; the plugin stores milliseconds, the unit the
		// retry delay uses.
		expect(error.retryAfter).toBe(3_600_000);
	});

	it('keeps the body delay on a 503, which is where RedCircle documents it', async () => {
		// `corsair/http` only reads a Retry-After header into `retryAfter` on a
		// rate-limit error, so a 503 has no header value to prefer: the body field
		// is the documented channel for this status, and the plugin uses it.
		respond(fetchMock, INCIDENT, 503, { 'Retry-After': '5' });

		const error = (await captureError(
			makeRedcircleRequest('key', {
				method: 'GET',
				path: '/request',
				query: { type: 'search' },
				replayable: true,
			}),
		)) as RedcircleAPIError;

		expect(error.retryAfter).toBe(3_600_000);
	});

	it('reads a Retry-After on a 429, which the header carries', async () => {
		respond(fetchMock, { request_info: { success: false } }, 429, {
			'Retry-After': '5',
		});

		const error = (await captureError(
			makeRedcircleRequest('key', {
				method: 'GET',
				path: '/request',
				query: { type: 'search' },
				replayable: true,
			}),
		)) as RedcircleAPIError;

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(5_000);
	});
});

describe('key hygiene', () => {
	it('does not leak the key through the error', async () => {
		respond(fetchMock, INVALID_KEY, 401);

		const error = (await captureError(
			makeRedcircleRequest('super-secret-key', {
				method: 'GET',
				path: '/request',
				query: { type: 'search' },
				replayable: true,
			}),
		)) as RedcircleAPIError;

		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-key');
		expect(require('node:util').inspect(error)).not.toContain(
			'super-secret-key',
		);
	});

	it('keeps the cause for a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRedcircleRequest('key', {
				method: 'GET',
				path: '/account',
				replayable: true,
			}),
		)) as RedcircleAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
	});
});
