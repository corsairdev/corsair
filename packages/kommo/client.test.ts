import { ApiError } from 'corsair/http';
import {
	decodeHalBody,
	describeKommoError,
	makeKommoRequest,
	readProblem,
} from './client';

const API_KEY = 'kommo-test-token';
const SUBDOMAIN = 'acme';

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
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		host: parsed.host,
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

describe('readProblem', () => {
	it('reads a problem+json document', () => {
		expect(
			readProblem({
				title: 'Unauthorized',
				status: 401,
				detail: 'The access token is invalid',
			}),
		).toEqual({
			title: 'Unauthorized',
			status: 401,
			detail: 'The access token is invalid',
		});
	});

	it('leaves detail undefined when only a title is present', () => {
		expect(readProblem({ title: 'Forbidden', status: 403 })).toMatchObject({
			detail: undefined,
		});
	});

	it.each([[undefined], [null], [{}], [[]], ['text']])(
		'returns empty fields for %j',
		(body) => {
			expect(readProblem(body)).toEqual({
				title: undefined,
				detail: undefined,
				status: undefined,
			});
		},
	);
});

describe('describeKommoError', () => {
	it('prefers the detail over the title', () => {
		expect(
			describeKommoError(
				400,
				{ title: 'Bad Request', detail: 'Custom field 1 is not available' },
				'x',
			),
		).toBe('Kommo 400: Custom field 1 is not available');
	});

	it('falls back to the title', () => {
		expect(describeKommoError(403, { title: 'Forbidden' }, 'x')).toBe(
			'Kommo 403: Forbidden',
		);
	});

	it('uses the fallback when the body has neither', () => {
		expect(describeKommoError(503, undefined, 'Service Unavailable')).toBe(
			'Kommo 503: Service Unavailable',
		);
	});
});

describe('makeKommoRequest', () => {
	it('sends the token as a bearer token', async () => {
		respond({ id: 1 });

		await makeKommoRequest(API_KEY, SUBDOMAIN, {
			method: 'GET',
			path: '/account',
		});

		expect(lastRequest().headers.get('authorization')).toBe(
			`Bearer ${API_KEY}`,
		);
	});

	it('addresses the account subdomain under /api/v4', async () => {
		respond({ id: 1 });

		await makeKommoRequest(API_KEY, SUBDOMAIN, {
			method: 'GET',
			path: '/leads',
		});

		expect(lastRequest().host).toBe('acme.kommo.com');
		expect(lastRequest().path).toBe('/api/v4/leads');
	});

	it('sends a body as JSON and sets the content type', async () => {
		respond({});

		await makeKommoRequest(API_KEY, SUBDOMAIN, {
			method: 'POST',
			path: '/leads',
			body: [{ name: 'Acme renewal' }],
		});

		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toBe('[{"name":"Acme renewal"}]');
	});

	it('sends no body and no content type for a request with none', async () => {
		respond({});

		await makeKommoRequest(API_KEY, SUBDOMAIN, {
			method: 'GET',
			path: '/leads',
		});

		const sent = lastRequest();
		expect(sent.body).toBeUndefined();
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('refuses a request with no subdomain before it is sent', async () => {
		await expect(
			makeKommoRequest(API_KEY, '', { method: 'GET', path: '/leads' }),
		).rejects.toMatchObject({
			name: 'KommoAPIError',
			message: expect.stringContaining('subdomain'),
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a subdomain that would move the request to another host', async () => {
		for (const subdomain of [
			'attacker.example/',
			'x@attacker.example',
			'acme.evil',
			'-acme',
		]) {
			await expect(
				makeKommoRequest(API_KEY, subdomain, { method: 'GET', path: '/leads' }),
			).rejects.toMatchObject({
				name: 'KommoAPIError',
				message: expect.stringContaining('one label'),
			});
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('decodes a success answered as application/hal+json', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ id: 7, subdomain: 'acme' }), {
				status: 200,
				headers: { 'Content-Type': 'application/hal+json' },
			}),
		);

		await expect(
			makeKommoRequest(API_KEY, SUBDOMAIN, { method: 'GET', path: '/account' }),
		).resolves.toEqual({ id: 7, subdomain: 'acme' });
	});

	it('passes an HTTP failure through as core ApiError with its status', async () => {
		respond(
			{
				title: 'Bad Request',
				status: 400,
				detail: 'Request validation failed',
			},
			400,
		);

		// unknown: a promise can reject with any value; the assertions below narrow it.
		const error = await makeKommoRequest(API_KEY, SUBDOMAIN, {
			method: 'POST',
			path: '/leads',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			status: 400,
			message: 'Kommo 400: Request validation failed',
		});
	});

	it('clears both bodies, so a submitted contact cannot follow the error into a log', async () => {
		respond({ title: 'Bad Request', detail: 'Request validation failed' }, 400);

		// unknown: a promise can reject with any value; the assertions below narrow it.
		const error = (await makeKommoRequest(API_KEY, SUBDOMAIN, {
			method: 'POST',
			path: '/contacts',
			body: [{ name: 'Jordan Lee', email: 'jordan@example.com' }],
		}).catch((caught: unknown) => caught)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.body).toBeUndefined();
		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error.request)).not.toContain('jordan@example.com');
	});

	// Core quotes the whole body in the message for a status it has no name for.
	it('keeps an error body without a reason out of the message', async () => {
		respond(
			{
				'validation-errors': [
					{
						request_id: '0',
						errors: [{ path: 'email', value: 'jordan@example.com' }],
					},
				],
			},
			422,
		);

		// unknown: a promise can reject with any value; the assertions below narrow it.
		const error = (await makeKommoRequest(API_KEY, SUBDOMAIN, {
			method: 'POST',
			path: '/contacts',
			body: [{ name: 'Jordan Lee', email: 'jordan@example.com' }],
		}).catch((caught: unknown) => caught)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(422);
		expect(error.message).toMatch(/^Kommo 422: /);
		expect(JSON.stringify({ ...error, message: error.message })).not.toContain(
			'jordan@example.com',
		);
	});

	it('keeps a Retry-After header as milliseconds', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({ title: 'Too Many Requests', status: 429 }),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '2' },
				},
			),
		);

		await expect(
			makeKommoRequest(API_KEY, SUBDOMAIN, { method: 'GET', path: '/leads' }),
		).rejects.toMatchObject({ status: 429, retryAfter: 2000 });
	});

	it('marks a transport failure and keeps its cause, which never held a body', async () => {
		const dropped = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(dropped);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKommoRequest(API_KEY, SUBDOMAIN, {
			method: 'GET',
			path: '/leads',
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
			makeKommoRequest(API_KEY, SUBDOMAIN, { method: 'GET', path: '/leads' }),
		).rejects.toMatchObject({ timedOut: true, transport: true });
	});
});

describe('decodeHalBody', () => {
	it('parses JSON text and leaves objects and empty answers alone', () => {
		expect(decodeHalBody('{"a":1}')).toEqual({ a: 1 });
		expect(decodeHalBody({ a: 1 })).toEqual({ a: 1 });
		expect(decodeHalBody(undefined)).toBeUndefined();
		expect(decodeHalBody('')).toBeUndefined();
	});
});
