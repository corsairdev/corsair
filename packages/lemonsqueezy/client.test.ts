import {
	describeLemonSqueezyError,
	LEMONSQUEEZY_API_BASE,
	LEMONSQUEEZY_MEDIA_TYPE,
	LemonSqueezyAPIError,
	makeLemonSqueezyRequest,
	readErrors,
	segment,
} from './client';
import { captureError } from './test-errors';
import {
	bareNotFound,
	customer,
	invalidPageSize,
	unauthorized,
	unknownRoute,
	webhookMissingSecret,
} from './test-fixtures';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

/**
 * Lemon Squeezy answers `application/vnd.api+json`, so a mock has to send that
 * media type for corsair/http to hand the body back as text, which is what the
 * client then parses.
 */
// unknown: response bodies are arbitrary provider JSON; each test picks the shape.
function respond(
	body: unknown,
	status = 200,
	contentType = LEMONSQUEEZY_MEDIA_TYPE,
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': contentType },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialised.
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

const KEY = 'ls-test-key';

describe('auth transport', () => {
	it('sends the key as a Bearer token and asks for JSON:API', async () => {
		respond(customer);

		await makeLemonSqueezyRequest(KEY, {
			method: 'GET',
			path: '/v1/customers',
		});

		const sent = lastRequest();
		expect(sent.origin).toBe(LEMONSQUEEZY_API_BASE);
		expect(sent.headers.get('authorization')).toBe(`Bearer ${KEY}`);
		expect(sent.headers.get('accept')).toBe(LEMONSQUEEZY_MEDIA_TYPE);
	});
});

describe('request building', () => {
	it('sends a JSON:API body with its media type', async () => {
		respond(customer, 201);

		await makeLemonSqueezyRequest(KEY, {
			method: 'POST',
			path: '/v1/customers',
			body: {
				data: {
					type: 'customers',
					attributes: { name: 'x', email: 'x@example.com' },
				},
			},
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe(LEMONSQUEEZY_MEDIA_TYPE);
		expect(sent.body).toEqual({
			data: {
				type: 'customers',
				attributes: { name: 'x', email: 'x@example.com' },
			},
		});
	});

	it('keeps bracket query keys as the API expects them', async () => {
		respond({ data: [], meta: { page: {} } });

		await makeLemonSqueezyRequest(KEY, {
			method: 'GET',
			path: '/v1/customers',
			query: { 'page[size]': 50, 'filter[store_id]': 520119 },
		});

		const sent = lastRequest();
		expect(sent.query).toEqual({
			'page[size]': '50',
			'filter[store_id]': '520119',
		});
	});

	it('sends no body on a DELETE', async () => {
		respond(undefined, 204);

		await makeLemonSqueezyRequest(KEY, {
			method: 'DELETE',
			path: '/v1/webhooks/150379',
		});

		expect(lastRequest().body).toBeUndefined();
	});
});

describe('response reading', () => {
	it('parses a vendor media type body instead of returning text', async () => {
		respond(customer);

		const result = await makeLemonSqueezyRequest<typeof customer>(KEY, {
			method: 'GET',
			path: '/v1/customers/10361540',
		});

		expect(result.data.id).toBe('10361540');
		expect(result.data.attributes.email).toBe('probe@example.com');
	});

	it('throws rather than returning a body it cannot parse', async () => {
		// A proxy answering HTML for a route is the case this guards.
		respond('<html>gateway</html>', 200, LEMONSQUEEZY_MEDIA_TYPE);

		const error = await captureError(
			makeLemonSqueezyRequest(KEY, {
				method: 'GET',
				path: '/v1/customers',
			}),
		);

		expect(error).toBeInstanceOf(LemonSqueezyAPIError);
		expect((error as LemonSqueezyAPIError).message).toContain('not JSON');
	});
});

describe('error translation', () => {
	it('keeps the status and reads every errors[] entry', async () => {
		respond(webhookMissingSecret, 422);

		const error = (await captureError(
			makeLemonSqueezyRequest(KEY, {
				method: 'POST',
				path: '/v1/webhooks',
				body: { data: { type: 'webhooks' } },
			}),
		)) as LemonSqueezyAPIError;

		expect(error.status).toBe(422);
		expect(error.errors).toHaveLength(1);
		expect(error.errors?.[0]?.detail).toBe('The secret field is required.');
		expect(error.errors?.[0]?.source?.pointer).toBe('/data/attributes/secret');
		// The field-level message reaches the caller's error.
		expect(error.message).toContain('The secret field is required.');
	});

	it('names the offending parameter on a bad page size', async () => {
		respond(invalidPageSize, 400);

		const error = (await captureError(
			makeLemonSqueezyRequest(KEY, {
				method: 'GET',
				path: '/v1/customers',
			}),
		)) as LemonSqueezyAPIError;

		expect(error.message).toContain('page.size');
		expect(error.message).toContain('between 1 and 100');
	});

	it('falls back to the status line for a 404 that carries no detail', async () => {
		respond(bareNotFound, 404);

		const error = (await captureError(
			makeLemonSqueezyRequest(KEY, {
				method: 'GET',
				path: '/v1/customers/1',
			}),
		)) as LemonSqueezyAPIError;

		expect(error.status).toBe(404);
		expect(error.message).toContain('404');
		// Title survives even with no detail.
		expect(error.message).toContain('Not Found');
	});

	it('records the method so a write is never replayed on a 5xx', async () => {
		respond({ errors: [{ status: '500', title: 'Server Error' }] }, 500);

		const error = (await captureError(
			makeLemonSqueezyRequest(KEY, {
				method: 'POST',
				path: '/v1/orders/1/refund',
				body: { data: {} },
			}),
		)) as LemonSqueezyAPIError;

		expect(error.method).toBe('POST');
		expect(error.status).toBe(500);
	});

	it('never puts the key in the message or the inspected error', async () => {
		respond(unauthorized, 401);

		const error = (await captureError(
			makeLemonSqueezyRequest(KEY, {
				method: 'GET',
				path: '/v1/customers',
			}),
		)) as LemonSqueezyAPIError;

		expect(error.message).not.toContain(KEY);
		expect(JSON.stringify(error)).not.toContain(KEY);
		expect(require('node:util').inspect(error)).not.toContain(KEY);
	});
});

describe('problem body helpers', () => {
	it('reads the errors array from an object or a JSON string', () => {
		expect(readErrors(unknownRoute)).toHaveLength(1);
		expect(readErrors(JSON.stringify(bareNotFound))).toHaveLength(1);
		expect(readErrors({ errors: 'not-an-array' })).toEqual([]);
		expect(readErrors(null)).toEqual([]);
	});

	it('describes a body, joining multiple entries', () => {
		expect(
			describeLemonSqueezyError(422, 'Unprocessable Entity', {
				errors: [
					{
						status: '422',
						detail: 'The name field is required.',
						source: { pointer: '/data/attributes/name' },
					},
					{
						status: '422',
						detail: 'The email field is required.',
						source: { pointer: '/data/attributes/email' },
					},
				],
			}),
		).toBe(
			'Lemon Squeezy 422: /data/attributes/name: The name field is required.; /data/attributes/email: The email field is required.',
		);

		// No errors array at all: the status line is all there is.
		expect(describeLemonSqueezyError(502, 'Bad Gateway', null)).toBe(
			'Lemon Squeezy request failed (Bad Gateway)',
		);
	});

	it('encodes path segments', () => {
		expect(segment('10361540')).toBe('10361540');
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});
