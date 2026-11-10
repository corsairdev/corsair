import {
	basicAuthHeader,
	describeReferralrockError,
	makeReferralrockRequest,
	REFERRALROCK_API_BASE,
	ReferralrockAPIError,
} from './client';
import { BAD_AUTH_HTML, NO_AUTH, NOT_FOUND } from './test-fixtures';
import {
	captureError,
	lastRequest,
	respond,
	respondRaw,
	spyOnFetch,
} from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('basic auth', () => {
	it('encodes the key as the username with an empty password', () => {
		// `corsair/http` only sends Basic when BOTH fields are non-empty, so the
		// header is built here rather than through USERNAME/PASSWORD.
		const expected = Buffer.from('rr-key:').toString('base64');
		expect(basicAuthHeader('rr-key')).toBe(`Basic ${expected}`);
	});

	it('sends the header on a request', async () => {
		respond(fetchMock, { offset: 0, total: 0, programs: [] });

		await makeReferralrockRequest('rr-key', {
			method: 'GET',
			path: '/api/programs',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe(REFERRALROCK_API_BASE);
		expect(request.path).toBe('/api/programs');
		expect(request.headers.get('authorization')).toBe(
			basicAuthHeader('rr-key'),
		);
		expect(request.headers.get('authorization')).toMatch(/^Basic /);
		// The key is in the header, never the URL.
		expect(Object.values(request.query)).not.toContain('rr-key');
	});

	it('sends a JSON body for a write', async () => {
		respond(fetchMock, { member: { id: 'm' } });

		await makeReferralrockRequest('key', {
			method: 'POST',
			path: '/api/members',
			body: { email: 'a@b.c' },
			replayable: false,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.contentType).toContain('application/json');
		expect(request.json()).toEqual({ email: 'a@b.c' });
	});
});

describe('the two error shapes', () => {
	it('reads the wrapped 401 body', async () => {
		respond(fetchMock, NO_AUTH, 401);

		const error = (await captureError(
			makeReferralrockRequest('missing', {
				method: 'GET',
				path: '/api/programs',
				replayable: true,
			}),
		)) as ReferralrockAPIError;

		expect(error).toBeInstanceOf(ReferralrockAPIError);
		expect(error.status).toBe(401);
		expect(error.bodyStatus).toBe(401);
		expect(error.isAuthError).toBe(true);
		// The wrapper's `status_message` and its `body` are both kept.
		expect(error.message).toBe(
			'Referral Rock 401: Unauthorized: Authorization has been denied for this request.',
		);
	});

	it('reads the HTML 401 a rejected credential produces', async () => {
		respondRaw(fetchMock, BAD_AUTH_HTML, 401);

		const error = (await captureError(
			makeReferralrockRequest('bad', {
				method: 'GET',
				path: '/api/programs',
				replayable: true,
			}),
		)) as ReferralrockAPIError;

		// The host refuses before routing, so the body is text rather than JSON.
		expect(error.status).toBe(401);
		expect(error.isAuthError).toBe(true);
		expect(error.message).toContain('You do not have permission');
	});

	it('reads a 404 the router raised under a Message key', async () => {
		respond(fetchMock, NOT_FOUND, 404);

		const error = (await captureError(
			makeReferralrockRequest('key', {
				method: 'GET',
				path: '/api/memberstats/getsingle',
				replayable: true,
			}),
		)) as ReferralrockAPIError;

		expect(error.status).toBe(404);
		expect(error.isNotFound).toBe(true);
		expect(error.message).toContain('No HTTP resource was found');
	});

	it('describes a body with neither shape from the fallback', () => {
		expect(describeReferralrockError(500, {}, 'Request failed')).toBe(
			'Referral Rock 500: Request failed',
		);
	});
});

describe('key hygiene', () => {
	it('does not leak the credential through the error', async () => {
		respond(fetchMock, NO_AUTH, 401);

		const error = (await captureError(
			makeReferralrockRequest('super-secret-key', {
				method: 'GET',
				path: '/api/programs',
				replayable: true,
			}),
		)) as ReferralrockAPIError;

		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-key');
		// The Basic header is base64 of the key, so the raw key must be absent too.
		expect(JSON.stringify(error)).not.toContain(
			Buffer.from('super-secret-key:').toString('base64'),
		);
	});

	it('keeps the cause for a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeReferralrockRequest('key', {
				method: 'GET',
				path: '/api/programs',
				replayable: true,
			}),
		)) as ReferralrockAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
	});
});
