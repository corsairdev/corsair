import { ApiError } from 'corsair/http';
import {
	describeStorerocketError,
	makeStorerocketRequest,
	STOREROCKET_API_BASE,
	StorerocketAPIError,
} from './client';
import { unauthenticated, validationError } from './test-fixtures';

const TOKEN = 'sr-secret-test-token';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
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

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<ApiError> {
	const error = await promise.catch((caught: unknown) => caught);
	// Core's management API maps only errors named ApiError to the provider's
	// status; anything else becomes a generic 500.
	expect(error).toBeInstanceOf(ApiError);
	expect(error).not.toBeInstanceOf(StorerocketAPIError);
	if (!(error instanceof ApiError)) throw error;
	expect(error.name).toBe('ApiError');
	return error;
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeStorerocketRequest', () => {
	it('authenticates with the Bearer scheme at the v2 base', async () => {
		respond({ data: [] }, 200);

		const result = await makeStorerocketRequest(TOKEN, {
			method: 'GET',
			path: '/projects',
		});

		expect(result).toEqual({ data: [] });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${STOREROCKET_API_BASE}/projects`);
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
		expect(headers.get('accept')).toBe('application/json');
	});

	it('sends a JSON body with the content type on POST', async () => {
		respond({ data: {} }, 200);

		await makeStorerocketRequest(TOKEN, {
			method: 'POST',
			path: '/projects/PROJECT_ID/locations',
			body: { name: 'Downtown Store', city: 'Seattle' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('POST');
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(String(init.body)).toBe(
			'{"name":"Downtown Store","city":"Seattle"}',
		);
	});

	it('sends the idempotency key as a header when set', async () => {
		respond({ data: {} }, 201);

		await makeStorerocketRequest(TOKEN, {
			method: 'POST',
			path: '/projects/PROJECT_ID/special-hours',
			body: { name: 'Thanksgiving' },
			idempotencyKey: 'thanksgiving-2026-us',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('idempotency-key')).toBe(
			'thanksgiving-2026-us',
		);
	});

	it('sends no body on DELETE', async () => {
		respond({ success: true }, 200);

		await makeStorerocketRequest(TOKEN, {
			method: 'DELETE',
			path: '/projects/PROJECT_ID/locations/LOCATION_ID',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(init.method).toBe('DELETE');
	});

	it('extracts the 401 message envelope', async () => {
		respond(unauthenticated, 401);

		const error = await failure(
			makeStorerocketRequest(TOKEN, { method: 'GET', path: '/user' }),
		);
		expect(error.message).toBe('Storerocket 401: Unauthenticated.');
		expect(error.status).toBe(401);
		expect(error.request.method).toBe('GET');
	});

	it('includes the field errors of a 422 in the message', async () => {
		respond(validationError, 422);

		const error = await failure(
			makeStorerocketRequest(TOKEN, {
				method: 'POST',
				path: '/projects/PROJECT_ID/locations',
				body: {},
			}),
		);
		expect(error.message).toBe(
			'Storerocket 422: The city field is required. (city: The city field is required.)',
		);
		expect(error.body).toEqual(validationError);
		expect(error.request.method).toBe('POST');
	});

	it('keeps the sent location out of the error', async () => {
		respond(validationError, 422);

		const error = await failure(
			makeStorerocketRequest(TOKEN, {
				method: 'POST',
				path: '/projects/PROJECT_ID/locations',
				body: { name: 'Downtown Store', email: 'owner@example.com' },
			}),
		);
		expect(error.request.body).toBe('[REDACTED]');
		expect(JSON.stringify(error)).not.toContain('owner@example.com');
	});

	it('keeps a non-JSON body readable', async () => {
		respond('reduce query parameter nesting', 400);

		const error = await failure(
			makeStorerocketRequest(TOKEN, { method: 'GET', path: '/projects' }),
		);
		expect(error.message).toBe(
			'Storerocket 400: reduce query parameter nesting',
		);
	});

	it('copies retryAfter from Retry-After onto the error', async () => {
		respond({ message: 'Too many requests' }, 429, { 'Retry-After': '3' });

		const error = await failure(
			makeStorerocketRequest(TOKEN, { method: 'GET', path: '/projects' }),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);
	});
});

describe('describeStorerocketError', () => {
	it('prefers the message and skips empty ones', () => {
		expect(describeStorerocketError(unauthenticated, 'fallback')).toBe(
			'Unauthenticated.',
		);
		// A missing route answers {"message":""} live; the fallback is used.
		expect(describeStorerocketError({ message: '' }, 'fallback')).toBe(
			'fallback',
		);
		expect(describeStorerocketError(null, 'fallback')).toBe('fallback');
	});
});
