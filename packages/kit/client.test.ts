import { ApiError } from 'corsair/http';
import { describeKitError, makeKitRequest, readErrors } from './client';

const API_KEY = 'kit-test-key';

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
	// jest types mock.calls as any[]; every call here is fetch(url, init) from
	// corsair/http, so the last one is that pair.
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		query: parsed.searchParams.toString(),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('readErrors', () => {
	it('reads an errors array of strings', () => {
		expect(readErrors({ errors: ['one', 'two'] })).toEqual(['one', 'two']);
	});

	it('drops a non-string entry rather than printing an object', () => {
		expect(readErrors({ errors: ['one', { code: 'x' }, '', 3] })).toEqual([
			'one',
		]);
	});

	it('falls back to a message field', () => {
		expect(readErrors({ message: 'Something failed' })).toEqual([
			'Something failed',
		]);
	});

	it('falls back to an error field', () => {
		expect(readErrors({ error: 'Nope' })).toEqual(['Nope']);
	});

	it.each([[undefined], [null], [{}], [[]], ['text']])(
		'returns nothing for %j',
		(body) => {
			expect(readErrors(body)).toEqual([]);
		},
	);
});

describe('describeKitError', () => {
	it('puts the status in front of the first message', () => {
		expect(
			describeKitError(401, { errors: ['The API key is invalid'] }, 'x'),
		).toBe('Kit 401: The API key is invalid');
	});

	it('joins more than one message', () => {
		expect(describeKitError(422, { errors: ['First', 'Second'] }, 'x')).toBe(
			'Kit 422: First; Second',
		);
	});

	it('uses the fallback when the body has no message', () => {
		expect(describeKitError(503, undefined, 'Service Unavailable')).toBe(
			'Kit 503: Service Unavailable',
		);
	});
});

describe('makeKitRequest', () => {
	it('sends the key in X-Kit-Api-Key and no Authorization header', async () => {
		respond({ account: {} });

		await makeKitRequest(API_KEY, { method: 'GET', path: '/v4/account' });

		const sent = lastRequest();
		expect(sent.headers.get('x-kit-api-key')).toBe(API_KEY);
		expect(sent.headers.get('authorization')).toBeNull();
	});

	it('addresses the v4 API', async () => {
		respond({ account: {} });

		await makeKitRequest(API_KEY, { method: 'GET', path: '/v4/account' });

		expect(lastRequest().path).toBe('/v4/account');
	});

	it('sends a body as JSON and sets the content type', async () => {
		respond({ tag: {} });

		await makeKitRequest(API_KEY, {
			method: 'POST',
			path: '/v4/tags',
			body: { name: 'customer' },
		});

		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toBe('{"name":"customer"}');
	});

	it('sends no body and no content type for a request with none', async () => {
		respond({ account: {} });

		await makeKitRequest(API_KEY, { method: 'GET', path: '/v4/account' });

		const sent = lastRequest();
		expect(sent.body).toBeUndefined();
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('returns undefined for a 204', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		await expect(
			makeKitRequest(API_KEY, {
				method: 'DELETE',
				path: '/v4/tags/31/subscribers',
			}),
		).resolves.toBeUndefined();
	});

	it('turns an error body into one error with every reason', async () => {
		respond(
			{ errors: ['Email address is invalid', 'Custom field missing'] },
			422,
		);

		await expect(
			makeKitRequest(API_KEY, { method: 'POST', path: '/v4/subscribers' }),
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 422,
			body: { errors: ['Email address is invalid', 'Custom field missing'] },
			message: 'Kit 422: Email address is invalid; Custom field missing',
			request: { method: 'POST' },
		});
	});

	it('keeps a Retry-After header as milliseconds', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ errors: ['Rate limited'] }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '6' },
			}),
		);

		await expect(
			makeKitRequest(API_KEY, { method: 'GET', path: '/v4/account' }),
		).rejects.toMatchObject({ retryAfter: 6000, status: 429 });
	});

	it('passes an HTTP failure on as core ApiError', async () => {
		respond({ errors: ['Not found'] }, 404);

		await expect(
			makeKitRequest(API_KEY, { method: 'GET', path: '/v4/subscribers/9' }),
		).rejects.toBeInstanceOf(ApiError);
	});

	it('keeps no subscriber address anywhere on the error', async () => {
		respond(
			{
				errors: ['a@b.example is invalid'],
				subscriber: { email_address: 'a@b.example' },
			},
			422,
		);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKitRequest(API_KEY, {
			method: 'POST',
			path: '/v4/subscribers',
			body: { email_address: 'a@b.example' },
		}).catch((caught: unknown) => caught)) as ApiError;

		expect(error.message).toBe('Kit 422: [email] is invalid');
		expect(error.body).toEqual({ errors: ['[email] is invalid'] });
		expect(error.cause).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('a@b.example');
		expect(JSON.stringify(error.request)).not.toContain('a@b.example');
	});

	it('keeps the address in an untag query off the error', async () => {
		respond({ errors: ['Not found'] }, 404);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKitRequest(API_KEY, {
			method: 'DELETE',
			path: '/v4/tags/31/subscribers',
			query: { email_address: 'a@b.example' },
		}).catch((caught: unknown) => caught)) as ApiError;

		expect(JSON.stringify(error)).not.toContain('a@b.example');
		expect(error.url).not.toContain('a%40b.example');
		expect(JSON.stringify(error.request)).not.toContain('a@b.example');
	});

	it('marks a transport failure and keeps its cause, which never held a body', async () => {
		const dropped = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(dropped);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKitRequest(API_KEY, {
			method: 'GET',
			path: '/v4/account',
		}).catch((caught: unknown) => caught)) as Error;

		expect(error).toMatchObject({
			transport: true,
			message: 'fetch failed',
			method: 'GET',
		});
		expect(error.cause).toBe(dropped);
	});

	it('separates a timeout from a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		await expect(
			makeKitRequest(API_KEY, { method: 'GET', path: '/v4/account' }),
		).rejects.toMatchObject({ timedOut: true, transport: true });
	});
});
