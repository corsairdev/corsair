import { EventbriteAPIError, makeEventbriteRequest, segment } from './client';
import { errorEnvelope, rateLimitEnvelope, springError } from './test-fixtures';
import { createHarness } from './test-helpers';

const h = createHarness();

beforeEach(() => {
	h.mockFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('makeEventbriteRequest', () => {
	it('sends the token as a Bearer header and never as a query parameter', async () => {
		h.respond({ id: '1' });

		await makeEventbriteRequest('private-token-123', {
			method: 'GET',
			path: '/users/me/',
		});

		const sent = h.lastRequest();
		expect(sent.origin).toBe('https://www.eventbriteapi.com');
		expect(sent.path).toBe('/v3/users/me/');
		expect(sent.headers.get('authorization')).toBe('Bearer private-token-123');
		expect(sent.query).toEqual({});
		expect(sent.headers.get('accept')).toBe('application/json');
	});

	it('serializes a JSON body with the matching media type', async () => {
		h.respond({ id: '1' });

		await makeEventbriteRequest('key', {
			method: 'POST',
			path: '/events/1/publish/',
			body: { event: { name: { html: 'Launch' } } },
		});

		const sent = h.lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toEqual({ event: { name: { html: 'Launch' } } });
	});

	it('sends no body and no content type on a GET', async () => {
		h.respond({ events: [] });

		await makeEventbriteRequest('key', {
			method: 'GET',
			path: '/organizations/1/events/',
			query: { status: 'live', page_size: 50 },
		});

		const sent = h.lastRequest();
		expect(sent.body).toBeUndefined();
		expect(sent.headers.get('content-type')).toBeNull();
		expect(sent.query).toEqual({ status: 'live', page_size: '50' });
	});

	it('omits undefined query values instead of sending "undefined"', async () => {
		h.respond({ events: [] });

		await makeEventbriteRequest('key', {
			method: 'GET',
			path: '/organizations/1/events/',
			query: { status: undefined, name_filter: 'Launch' },
		});

		expect(h.lastRequest().query).toEqual({ name_filter: 'Launch' });
	});

	it('turns a 404 envelope into an EventbriteAPIError carrying the code', async () => {
		h.respond(errorEnvelope, 404);

		const error = await h.failure<EventbriteAPIError>(
			makeEventbriteRequest('key', {
				method: 'GET',
				path: '/events/1/',
			}),
		);

		expect(error).toBeInstanceOf(EventbriteAPIError);
		expect(error.status).toBe(404);
		expect(error.code).toBe('NOT_FOUND');
		expect(error.message).toBe(
			'Eventbrite 404 NOT_FOUND: The event you requested does not exist.',
		);
		expect(error.method).toBe('GET');
	});

	it('reads the Spring error envelope the orders routes answer with', async () => {
		h.respond(springError, 401);

		const caught = await h.failure<EventbriteAPIError>(
			makeEventbriteRequest('key', {
				method: 'GET',
				path: '/events/1/orders/',
			}),
		);

		// The `error` field here is a phrase, not a code, so it is not used as one.
		expect(caught.status).toBe(401);
		expect(caught.code).toBe('Unauthorized');
		expect(caught.message).toContain('Unauthorized');
	});

	it('keeps ARGUMENTS_ERROR details on the error', async () => {
		h.respond(
			{
				error: 'ARGUMENTS_ERROR',
				error_description:
					'There are errors with your arguments: event.name.html - This field is required.',
				status_code: 400,
				error_detail: {
					ARGUMENTS_ERROR: { 'event.name.html': ['This field is required.'] },
				},
			},
			400,
		);

		const caught = await h.failure<EventbriteAPIError>(
			makeEventbriteRequest('key', {
				method: 'POST',
				path: '/organizations/1/events/',
				body: { event: {} },
			}),
		);

		expect(caught.code).toBe('ARGUMENTS_ERROR');
		expect(caught.detail).toEqual({
			ARGUMENTS_ERROR: { 'event.name.html': ['This field is required.'] },
		});
	});

	it('flags a 429 as a rate limit so error-handlers can retry it', async () => {
		h.respond(rateLimitEnvelope, 429);

		const caught = await h.failure<EventbriteAPIError>(
			makeEventbriteRequest('key', {
				method: 'GET',
				path: '/events/1/',
			}),
		);

		expect(caught.isRateLimit).toBe(true);
		expect(caught.status).toBe(429);
	});

	it('never puts the token in the error message or an inspect dump', async () => {
		h.respond(errorEnvelope, 404);

		const caught = await h.failure<EventbriteAPIError>(
			makeEventbriteRequest('super-secret-token', {
				method: 'GET',
				path: '/events/1/',
			}),
		);

		expect(caught.message).not.toContain('super-secret-token');
		expect(JSON.stringify(caught)).not.toContain('super-secret-token');
		expect(require('node:util').inspect(caught)).not.toContain(
			'super-secret-token',
		);
	});

	it('wraps a transport failure in its own error and keeps the method', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockRejectedValueOnce(new TypeError('fetch failed'));

		const caught = await h.failure<EventbriteAPIError>(
			makeEventbriteRequest('key', {
				method: 'POST',
				path: '/events/1/publish/',
			}),
		);

		expect(caught).toBeInstanceOf(EventbriteAPIError);
		expect(caught.status).toBeUndefined();
		expect(caught.method).toBe('POST');
		expect(caught.message).toBe('fetch failed');
	});
});

describe('segment', () => {
	it('encodes a path segment so an id cannot change the route', () => {
		expect(segment('123/../users/me')).toBe('123%2F..%2Fusers%2Fme');
		expect(segment(12345)).toBe('12345');
	});
});
