import { inspect } from 'node:util';
import {
	buildMeloQuery,
	describeMeloError,
	MELO_API_BASE,
	MeloAPIError,
	makeMeloRequest,
	parseMeloBody,
	segment,
} from './client';
import {
	API_KEY,
	captureError,
	lastCall,
	respondEmpty,
	respondLd,
	respondText,
} from './test-helpers';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

// unknown: the promise resolves to whatever the endpoint returned; only its
// rejection is read.
async function failure(promise: Promise<unknown>): Promise<MeloAPIError> {
	const error = await captureError(promise);
	expect(error).toBeInstanceOf(MeloAPIError);
	if (!(error instanceof MeloAPIError)) throw error;
	return error;
}

describe('makeMeloRequest', () => {
	it('uses the Stream Estate base URL', () => {
		expect(MELO_API_BASE).toBe('https://api.stream.estate');
	});

	it('sends the key in the X-API-KEY header and nowhere else', async () => {
		respondLd(fetchMock, { 'hydra:member': [] });

		await makeMeloRequest(API_KEY, { method: 'GET', path: '/cities' });

		const call = lastCall(fetchMock);
		expect(call.parsed.origin).toBe('https://api.stream.estate');
		expect(call.headers.get('x-api-key')).toBe(API_KEY);
		expect(call.headers.get('authorization')).toBeNull();
		expect(call.parsed.search).toBe('');
		expect(call.body).toBeUndefined();
	});

	it('asks for application/ld+json, because application/json returns a bare array', async () => {
		respondLd(fetchMock, { 'hydra:member': [] });

		await makeMeloRequest(API_KEY, { method: 'GET', path: '/cities' });

		expect(lastCall(fetchMock).headers.get('accept')).toBe(
			'application/ld+json',
		);
	});

	it('decodes an application/ld+json body, which corsair/http hands back as text', async () => {
		respondLd(fetchMock, { 'hydra:member': [{ name: 'Paris' }] });

		const body = await makeMeloRequest(API_KEY, {
			method: 'GET',
			path: '/cities',
		});

		expect(body).toEqual({ 'hydra:member': [{ name: 'Paris' }] });
	});

	it('also decodes a plain application/json body', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify([{ id: 1 }]), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		const body = await makeMeloRequest(API_KEY, {
			method: 'GET',
			path: '/cities',
		});

		expect(body).toEqual([{ id: 1 }]);
	});

	it('sends a JSON body with a JSON content type on POST and PUT', async () => {
		respondLd(fetchMock, { title: 'a' }, 201);
		await makeMeloRequest(API_KEY, {
			method: 'POST',
			path: '/searches',
			body: { title: 'a', propertyTypes: [0] },
		});
		let call = lastCall(fetchMock);
		expect(call.method).toBe('POST');
		expect(call.headers.get('content-type')).toBe('application/json');
		expect(call.body).toEqual({ title: 'a', propertyTypes: [0] });

		respondLd(fetchMock, { title: 'b' });
		await makeMeloRequest(API_KEY, {
			method: 'PUT',
			path: '/searches/x',
			body: { title: 'b' },
		});
		call = lastCall(fetchMock);
		expect(call.method).toBe('PUT');
		expect(call.body).toEqual({ title: 'b' });
	});

	it('returns undefined for a 204 and for a bodyless request, whatever the body says', async () => {
		respondEmpty(fetchMock, 204);
		expect(
			await makeMeloRequest(API_KEY, { method: 'DELETE', path: '/searches/x' }),
		).toBeUndefined();

		respondText(fetchMock, 'ok', 200, 'text/plain');
		expect(
			await makeMeloRequest(API_KEY, {
				method: 'GET',
				path: '/webhook-tester',
				bodyless: true,
			}),
		).toBeUndefined();
	});

	it('throws on a 2xx whose body is not JSON when a body is expected', async () => {
		respondText(fetchMock, '<html>maintenance</html>', 200);

		const error = await failure(
			makeMeloRequest(API_KEY, { method: 'GET', path: '/cities' }),
		);

		expect(error.message).toContain('not JSON');
	});

	it('maps a wrong key, answered as plain text, to a 401 with that text', async () => {
		respondText(fetchMock, 'Authentication failed', 401);

		const error = await failure(
			makeMeloRequest(API_KEY, { method: 'GET', path: '/searches' }),
		);

		expect(error.status).toBe(401);
		expect(error.message).toBe('Melo 401: Authentication failed');
		expect(error.body).toBe('Authentication failed');
	});

	it('reads a JSON error envelope, as a missing key produces', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({ code: 401, message: 'JWT Token not found' }),
				{
					status: 401,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);

		const error = await failure(
			makeMeloRequest(API_KEY, { method: 'GET', path: '/searches' }),
		);

		expect(error.message).toBe('Melo 401: JWT Token not found');
		expect(error.body).toEqual({ code: 401, message: 'JWT Token not found' });
	});

	it('reads a Hydra error sent as ld+json text', async () => {
		respondLd(
			fetchMock,
			{
				'@type': 'hydra:Error',
				'hydra:title': 'An error occurred',
				'hydra:description': 'propertyTypes: This value should not be blank.',
			},
			400,
		);

		const error = await failure(
			makeMeloRequest(API_KEY, { method: 'POST', path: '/searches', body: {} }),
		);

		expect(error.status).toBe(400);
		expect(error.message).toBe(
			'Melo 400: propertyTypes: This value should not be blank.',
		);
	});

	it('does not put a Symfony HTML error page into the message', async () => {
		respondText(
			fetchMock,
			'<!DOCTYPE html><html><head><title>An Error Occurred: Not Found</title></head></html>',
			404,
		);

		const error = await failure(
			makeMeloRequest(API_KEY, { method: 'GET', path: '/searches/x' }),
		);

		expect(error.status).toBe(404);
		expect(error.message).toBe('Melo 404: Not Found');
		expect(error.message).not.toContain('<');
	});

	it('maps 403, 405 and 500 to their status', async () => {
		for (const status of [403, 405, 500]) {
			respondText(fetchMock, 'nope', status);
			const error = await failure(
				makeMeloRequest(API_KEY, { method: 'GET', path: '/cities' }),
			);
			expect(error.status).toBe(status);
		}
	});

	it('reads Retry-After from a 429 into milliseconds', async () => {
		respondText(fetchMock, 'Too many requests', 429, 'text/plain', {
			'Retry-After': '7',
		});

		const error = await failure(
			makeMeloRequest(API_KEY, { method: 'GET', path: '/cities' }),
		);

		expect(error.status).toBe(429);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(7000);
	});

	it('leaves retryAfter unset when a 429 carries no header', async () => {
		respondText(fetchMock, 'Too many requests', 429, 'text/plain');

		const error = await failure(
			makeMeloRequest(API_KEY, { method: 'GET', path: '/cities' }),
		);

		expect(error.retryAfter).toBeUndefined();
	});

	it('marks a GET as replay safe and a write as not', async () => {
		respondText(fetchMock, 'boom', 500);
		const read = await failure(
			makeMeloRequest(API_KEY, { method: 'GET', path: '/cities' }),
		);
		expect(read.replaySafe).toBe(true);
		expect(read.method).toBe('GET');

		respondText(fetchMock, 'boom', 500);
		const write = await failure(
			makeMeloRequest(API_KEY, { method: 'POST', path: '/searches', body: {} }),
		);
		expect(write.replaySafe).toBe(false);
		expect(write.method).toBe('POST');
	});

	it('lets a GET that acts opt out of replay', async () => {
		respondText(fetchMock, 'boom', 500);

		const error = await failure(
			makeMeloRequest(API_KEY, {
				method: 'GET',
				path: '/webhook-tester',
				replaySafe: false,
			}),
		);

		expect(error.replaySafe).toBe(false);
	});

	it('flags a transport failure and keeps its cause', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeMeloRequest(API_KEY, { method: 'GET', path: '/cities' }),
		);

		expect(error.transport).toBe(true);
		expect(error.replaySafe).toBe(true);
		expect(error.status).toBeUndefined();
		expect(error.message).toBe('fetch failed');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('does not replay a transport failure on a write', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeMeloRequest(API_KEY, { method: 'DELETE', path: '/searches/x' }),
		);

		expect(error.transport).toBe(true);
		expect(error.replaySafe).toBe(false);
	});

	it('flags a request that was aborted by a timeout as transport', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException(
				'The operation was aborted due to timeout',
				'TimeoutError',
			),
		);

		const error = await failure(
			makeMeloRequest(API_KEY, { method: 'GET', path: '/cities' }),
		);

		expect(error.transport).toBe(true);
	});

	it('keeps the API key out of every error message, property and inspection', async () => {
		respondText(fetchMock, 'Authentication failed', 401);
		const apiError = await failure(
			makeMeloRequest(API_KEY, {
				method: 'GET',
				path: '/documents/properties',
				query: { budgetMax: 100 },
			}),
		);
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const transportError = await failure(
			makeMeloRequest(API_KEY, { method: 'GET', path: '/cities' }),
		);

		for (const error of [apiError, transportError]) {
			expect(error.message).not.toContain(API_KEY);
			expect(JSON.stringify(error)).not.toContain(API_KEY);
			expect(inspect(error, { depth: 6 })).not.toContain(API_KEY);
			expect(String(error.stack)).not.toContain(API_KEY);
		}
	});
});

describe('buildMeloQuery', () => {
	it('returns undefined for no query and for an all-empty one', () => {
		expect(buildMeloQuery(undefined)).toBeUndefined();
		expect(buildMeloQuery({})).toBeUndefined();
		expect(buildMeloQuery({ a: undefined, b: [] })).toBeUndefined();
	});

	it('sends scalars as strings, booleans and zero included', () => {
		expect(
			buildMeloQuery({ a: 'x', b: 12.5, c: true, d: false, e: 0, f: '' }),
		).toEqual({ a: 'x', b: '12.5', c: 'true', d: 'false', e: '0', f: '' });
	});

	it('sends a top-level array of scalars as key[]', () => {
		expect(
			buildMeloQuery({ energyCategories: ['A', 'B'], types: [0, 1] }),
		).toEqual({ 'energyCategories[]': ['A', 'B'], 'types[]': ['0', '1'] });
	});

	it('sends null as an empty value and drops undefined', () => {
		expect(buildMeloQuery({ a: null, b: undefined })).toEqual({ a: '' });
	});

	it('indexes nested arrays and keys nested objects', () => {
		expect(
			buildMeloQuery({
				order: { createdAt: 'asc', price: undefined },
				geoShapes: [
					[
						[1, 2],
						[3, 4],
					],
				],
				expressions: [[{ word: 'a', options: { includes: true } }]],
				polygon: [{ lat: 1, lon: 2 }],
			}),
		).toEqual({
			'order[createdAt]': 'asc',
			'geoShapes[0][0][0]': '1',
			'geoShapes[0][0][1]': '2',
			'geoShapes[0][1][0]': '3',
			'geoShapes[0][1][1]': '4',
			'expressions[0][0][word]': 'a',
			'expressions[0][0][options][includes]': 'true',
			'polygon[0][lat]': '1',
			'polygon[0][lon]': '2',
		});
	});

	it('encodes values with reserved characters when the request is sent', async () => {
		respondLd(fetchMock, { 'hydra:member': [] });

		await makeMeloRequest(API_KEY, {
			method: 'GET',
			path: '/cities',
			query: { name: 'a&b=c d#e', 'x[]': undefined, list: ['é', '/cities/1'] },
		});

		const call = lastCall(fetchMock);
		expect(call.query).toEqual({
			name: ['a&b=c d#e'],
			'list[]': ['é', '/cities/1'],
		});
		expect(call.parsed.hash).toBe('');
	});
});

describe('describeMeloError', () => {
	it('prefers hydra:description, then message, detail and title', () => {
		expect(
			describeMeloError(400, { 'hydra:description': 'd', message: 'm' }, 'f'),
		).toBe('Melo 400: d');
		expect(describeMeloError(400, { message: 'm', detail: 'x' }, 'f')).toBe(
			'Melo 400: m',
		);
		expect(describeMeloError(400, { detail: 'x' }, 'f')).toBe('Melo 400: x');
		expect(describeMeloError(400, { 'hydra:title': 't' }, 'f')).toBe(
			'Melo 400: t',
		);
		expect(describeMeloError(400, { title: 't' }, 'f')).toBe('Melo 400: t');
	});

	it('reads JSON text and falls back to the status text', () => {
		expect(describeMeloError(401, '{"message":"bad"}', 'f')).toBe(
			'Melo 401: bad',
		);
		expect(describeMeloError(500, undefined, 'Internal Server Error')).toBe(
			'Melo 500: Internal Server Error',
		);
		expect(describeMeloError(undefined, undefined, 'boom')).toBe('boom');
	});

	it('truncates a long plain-text body', () => {
		const message = describeMeloError(500, 'x'.repeat(1000), 'f');
		expect(message.length).toBeLessThan(320);
	});
});

describe('parseMeloBody', () => {
	it('parses JSON text, passes values through and treats an empty string as no body', () => {
		expect(parseMeloBody('{"a":1}')).toEqual({ a: 1 });
		expect(parseMeloBody([1])).toEqual([1]);
		expect(parseMeloBody('  ')).toBeUndefined();
		expect(parseMeloBody(undefined)).toBeUndefined();
	});

	it('throws a MeloAPIError carrying the method for text that is not JSON', () => {
		expect(() => parseMeloBody('nope', 'GET')).toThrow(MeloAPIError);
	});
});

describe('segment', () => {
	it('encodes a path segment so an id cannot change the route', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment(42)).toBe('42');
	});
});
