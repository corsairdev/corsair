import {
	describeRollbarError,
	makeRollbarRequest,
	ROLLBAR_API_BASE,
	RollbarAPIError,
} from './client';
import {
	BODY_REJECTED,
	NOT_FOUND,
	RATE_LIMITED,
	TOKEN_REQUIRED,
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
	it('sends the token in X-Rollbar-Access-Token, not Authorization', async () => {
		respond(fetchMock, { err: 0, result: {} });

		await makeRollbarRequest('secret-token', {
			method: 'GET',
			path: '/projects',
			replayable: true,
			checkErr: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://api.rollbar.com');
		expect(request.path).toBe('/api/1/projects');
		expect(request.headers.get('x-rollbar-access-token')).toBe('secret-token');
		expect(request.headers.get('authorization')).toBeNull();
		// The token never rides in the query string.
		expect(Object.values(request.query)).not.toContain('secret-token');
		expect(ROLLBAR_API_BASE).toBe('https://api.rollbar.com/api/1');
	});

	it('sends a JSON body for a write', async () => {
		respond(fetchMock, { err: 0, result: {} });

		await makeRollbarRequest('key', {
			method: 'PATCH',
			path: '/item/1',
			body: { status: 'resolved' },
			replayable: false,
			checkErr: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.json()).toEqual({ status: 'resolved' });
	});
});

describe('the err discriminator', () => {
	it('reads the live 401 body', async () => {
		respond(fetchMock, TOKEN_REQUIRED, 401);

		const error = (await captureError(
			makeRollbarRequest('bad', {
				method: 'GET',
				path: '/projects',
				replayable: true,
				checkErr: true,
			}),
		)) as RollbarAPIError;

		expect(error).toBeInstanceOf(RollbarAPIError);
		expect(error.status).toBe(401);
		expect(error.err).toBe(1);
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe('Rollbar 401 err 1: access token required');
	});

	it('treats a non-zero err on a 200 as a failure', async () => {
		respond(fetchMock, BODY_REJECTED, 200);

		const error = (await captureError(
			makeRollbarRequest('key', {
				method: 'PATCH',
				path: '/item/1',
				body: { status: 'nope' },
				replayable: false,
				checkErr: true,
			}),
		)) as RollbarAPIError;

		// The status was 200; only the body proved the failure.
		expect(error.status).toBeUndefined();
		expect(error.err).toBe(1);
		expect(error.message).toBe('Rollbar err 1: invalid status');
	});

	it('lets a zero err through', async () => {
		respond(fetchMock, { err: 0, result: { ok: true } });

		const raw = await makeRollbarRequest('key', {
			method: 'GET',
			path: '/projects',
			replayable: true,
			checkErr: true,
		});

		expect(raw).toEqual({ err: 0, result: { ok: true } });
	});

	it('reads a 404 and a 429 body', async () => {
		respond(fetchMock, NOT_FOUND, 404);
		const notFound = (await captureError(
			makeRollbarRequest('key', {
				method: 'GET',
				path: '/item/1',
				replayable: true,
				checkErr: true,
			}),
		)) as RollbarAPIError;
		expect(notFound.isNotFound).toBe(true);

		respond(fetchMock, RATE_LIMITED, 429);
		const limited = (await captureError(
			makeRollbarRequest('key', {
				method: 'GET',
				path: '/items',
				replayable: true,
				checkErr: true,
			}),
		)) as RollbarAPIError;
		expect(limited.isRateLimit).toBe(true);
		expect(limited.message).toContain('retry after 60 seconds');
	});

	it('describes a body with no message from the fallback', () => {
		expect(describeRollbarError(500, {}, 'Request failed')).toBe(
			'Rollbar 500: Request failed',
		);
	});
});

describe('key hygiene', () => {
	it('does not leak the token through the error', async () => {
		respond(fetchMock, TOKEN_REQUIRED, 401);

		const error = (await captureError(
			makeRollbarRequest('super-secret-token', {
				method: 'GET',
				path: '/projects',
				replayable: true,
				checkErr: true,
			}),
		)) as RollbarAPIError;

		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-token');
	});

	it('keeps the cause for a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRollbarRequest('key', {
				method: 'GET',
				path: '/projects',
				replayable: true,
				checkErr: true,
			}),
		)) as RollbarAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
	});
});
