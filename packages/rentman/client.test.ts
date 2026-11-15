import {
	describeRentmanError,
	makeRentmanRequest,
	RENTMAN_API_BASE,
	RentmanAPIError,
	readNextCursor,
	readNextPageUrl,
} from './client';
import {
	GATEWAY_FORBIDDEN,
	GATEWAY_UNAUTHORIZED,
	VALIDATION_ERROR,
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
	it('sends the token as a bearer header and keeps it out of the URL', async () => {
		respond(fetchMock, { data: [], itemCount: 0 });

		await makeRentmanRequest('jwt-secret', {
			method: 'GET',
			path: '/contacts',
			replayable: true,
		});

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe(RENTMAN_API_BASE);
		expect(request.path).toBe('/contacts');
		expect(request.headers.get('authorization')).toBe('Bearer jwt-secret');
		expect(request.headers.get('accept')).toBe('application/json');
		expect(Object.values(request.query)).not.toContain('jwt-secret');
	});

	it('always sends a JSON content type, which Rentman expects', async () => {
		respond(fetchMock, {});

		await makeRentmanRequest('key', {
			method: 'GET',
			path: '/projects',
			replayable: true,
		});

		expect(lastRequest(fetchMock).headers.get('content-type')).toContain(
			'application/json',
		);
	});

	it('sends a JSON body for a write', async () => {
		respond(fetchMock, { data: { id: 1 } });

		await makeRentmanRequest('key', {
			method: 'POST',
			path: '/contacts',
			body: { name: 'Acme Inc' },
			replayable: false,
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.json()).toEqual({ name: 'Acme Inc' });
	});

	it('serialises a bracketed filter key', async () => {
		respond(fetchMock, { data: [], itemCount: 0 });

		await makeRentmanRequest('key', {
			method: 'GET',
			path: '/contacts',
			query: { 'distance[lte]': 300 },
			replayable: true,
		});

		// The bracket is percent-encoded on the wire and the server decodes it.
		expect(lastRequest(fetchMock).query['distance[lte]']).toBe('300');
	});
});

describe('error envelopes', () => {
	it('reads the gateway 401 message', async () => {
		respond(fetchMock, GATEWAY_UNAUTHORIZED, 401);

		const error = (await captureError(
			makeRentmanRequest('bad', {
				method: 'GET',
				path: '/contacts',
				replayable: true,
			}),
		)) as RentmanAPIError;

		expect(error).toBeInstanceOf(RentmanAPIError);
		expect(error.status).toBe(401);
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe('Rentman 401: Unauthorized');
	});

	it('reads the gateway 403 Message key, which is capitalised', async () => {
		respond(fetchMock, GATEWAY_FORBIDDEN, 403);

		const error = (await captureError(
			makeRentmanRequest('superseded', {
				method: 'GET',
				path: '/contacts',
				replayable: true,
			}),
		)) as RentmanAPIError;

		expect(error.status).toBe(403);
		expect(error.isAuthError).toBe(true);
		expect(error.message).toContain('identity-based policy');
	});

	it('flattens the app-layer field validation envelope', async () => {
		respond(fetchMock, VALIDATION_ERROR, 422);

		const error = (await captureError(
			makeRentmanRequest('key', {
				method: 'POST',
				path: '/contacts',
				body: {},
				replayable: false,
			}),
		)) as RentmanAPIError;

		expect(error.status).toBe(422);
		expect(error.isValidationError).toBe(true);
		expect(error.message).toContain('name: The name field is required.');
		expect(error.message).toContain(
			'customer: The selected customer is invalid.',
		);
	});

	it('describes a body with no recognised key from the fallback', () => {
		expect(describeRentmanError(500, {}, 'Request failed')).toBe(
			'Rentman 500: Request failed',
		);
		expect(describeRentmanError(undefined, {}, 'Oops')).toBe('Oops');
	});
});

describe('key hygiene', () => {
	it('does not leak the token through the error', async () => {
		respond(fetchMock, GATEWAY_UNAUTHORIZED, 401);

		const error = (await captureError(
			makeRentmanRequest('super-secret-token', {
				method: 'GET',
				path: '/contacts',
				replayable: true,
			}),
		)) as RentmanAPIError;

		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('super-secret-token');
		expect(require('node:util').inspect(error)).not.toContain(
			'super-secret-token',
		);
	});

	it('keeps the cause for a transport failure, which never carried the token', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeRentmanRequest('key', {
				method: 'GET',
				path: '/contacts',
				replayable: true,
			}),
		)) as RentmanAPIError;

		expect(error.cause).toBeInstanceOf(TypeError);
		expect(error.replayable).toBe(true);
		expect(error.method).toBe('GET');
	});
});

describe('cursor helpers', () => {
	it('reads the cursor out of next_page_url', () => {
		expect(
			readNextCursor({
				next_page_url:
					'https://api.rentman.net/contacts?cursor=eyJhZnRlciI6NDU2fQ',
			}),
		).toBe('eyJhZnRlciI6NDU2fQ');
	});

	it('returns null rather than an empty string on the last page', () => {
		expect(readNextCursor({ next_page_url: null })).toBeNull();
		expect(readNextCursor({})).toBeNull();
		expect(readNextPageUrl({ next_page_url: null })).toBeNull();
	});

	it('returns null when the URL carries no cursor', () => {
		expect(
			readNextCursor({ next_page_url: 'https://api.rentman.net/contacts' }),
		).toBeNull();
	});

	it('decodes a percent-encoded cursor', () => {
		expect(
			readNextCursor({
				next_page_url: 'https://api.rentman.net/contacts?cursor=a%2Bb',
			}),
		).toBe('a+b');
	});

	it('returns the whole next page URL for callers that follow it', () => {
		const url = 'https://api.rentman.net/contacts?cursor=abc';
		expect(readNextPageUrl({ next_page_url: url })).toBe(url);
	});
});

describe('replay safety', () => {
	it('records a write as not replayable', async () => {
		respond(fetchMock, { message: 'boom' }, 500);

		const error = (await captureError(
			makeRentmanRequest('key', {
				method: 'POST',
				path: '/projects',
				body: {},
				replayable: false,
			}),
		)) as RentmanAPIError;

		expect(error.replayable).toBe(false);
	});
});
