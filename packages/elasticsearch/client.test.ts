import { AuthMissingError } from 'corsair/core';
import {
	buildAuthorizationHeader,
	ElasticsearchAPIError,
	encodeIndexTarget,
	makeElasticsearchBinaryRequest,
	makeElasticsearchRequest,
	resolveBaseUrl,
} from './client';
import { clusterHealth, esErrorBody } from './test-fixtures';

const BASE = 'http://es.local:9200';

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

// unknown: callers pass any endpoint's promise, and a rejection can be any
// value until the instanceof check below narrows it.
async function failure(
	promise: Promise<unknown>,
): Promise<ElasticsearchAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(ElasticsearchAPIError);
	return error as ElasticsearchAPIError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('buildAuthorizationHeader', () => {
	it('treats an opaque value as the encoded API key', () => {
		expect(buildAuthorizationHeader('VnVhQ2ZHY0JDZGJrUW0tZTVhT3g6dWky')).toBe(
			'ApiKey VnVhQ2ZHY0JDZGJrUW0tZTVhT3g6dWky',
		);
	});

	it('base64s a raw id:api_key pair (base64 cannot contain a colon)', () => {
		const expected = Buffer.from('id-123:secret-ĉdef', 'utf8').toString(
			'base64',
		);
		expect(buildAuthorizationHeader('id-123:secret-ĉdef')).toBe(
			`ApiKey ${expected}`,
		);
	});

	it.each([
		['ApiKey abc', 'ApiKey abc'],
		['apikey abc', 'ApiKey abc'],
		['basic dXNlcjpwYXNz', 'Basic dXNlcjpwYXNz'],
		['Bearer token123', 'Bearer token123'],
	])('passes %s through as %s', (input, expected) => {
		expect(buildAuthorizationHeader(input)).toBe(expected);
	});
});

describe('resolveBaseUrl', () => {
	it('prefers the plugin option and strips trailing slashes', async () => {
		await expect(
			resolveBaseUrl({ options: { baseUrl: 'https://solo.example:9200/' } }),
		).resolves.toBe('https://solo.example:9200');
	});

	it('reads the per-account cluster URL', async () => {
		await expect(
			resolveBaseUrl({
				keys: {
					get_baseUrl: jest.fn().mockResolvedValue('http://tenant-es:9200'),
				},
			}),
		).resolves.toBe('http://tenant-es:9200');
	});

	it('names the missing field in an AuthMissingError', async () => {
		await expect(resolveBaseUrl({})).rejects.toThrow(
			new AuthMissingError('elasticsearch', 'baseUrl'),
		);
	});
});

describe('encodeIndexTarget', () => {
	it('keeps multi-target commas, wildcards and exclusions literal', () => {
		expect(encodeIndexTarget('logs-*,-logs-dev')).toBe('logs-*,-logs-dev');
	});

	it('encodes spaces and blocks path smuggling', () => {
		expect(encodeIndexTarget('my index')).toBe('my%20index');
		expect(encodeIndexTarget('logs/_search')).toBe('logs%2F_search');
	});
});

describe('makeElasticsearchRequest', () => {
	it('sends an authenticated GET to the cluster endpoint', async () => {
		const body = clusterHealth;
		respond(body, 200);

		const result = await makeElasticsearchRequest(BASE, 'ApiKey encoded-key', {
			method: 'GET',
			path: '/_cluster/health',
		});

		expect(result).toEqual(body);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${BASE}/_cluster/health`);
		expect(init.method).toBe('GET');
		expect(new Headers(init.headers).get('authorization')).toBe(
			'ApiKey encoded-key',
		);
	});

	it('sends a JSON body on POST', async () => {
		respond({ took: 1 }, 200);

		await makeElasticsearchRequest(BASE, 'ApiKey k', {
			method: 'POST',
			path: '/logs/_search',
			body: { size: 5, query: { match_all: {} } },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('POST');
		expect(init.body).toBe(
			JSON.stringify({ size: 5, query: { match_all: {} } }),
		);
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
	});

	it('sends PUT and DELETE with JSON bodies', async () => {
		respond({ acknowledged: true }, 200);
		respond({ acknowledged: true }, 200);

		await makeElasticsearchRequest(BASE, 'ApiKey k', {
			method: 'PUT',
			path: '/logs-2026-11',
			body: { settings: { number_of_shards: 1 } },
		});
		await makeElasticsearchRequest(BASE, 'ApiKey k', {
			method: 'DELETE',
			path: '/logs-2026-11/_doc/1',
		});

		const [putUrl, putInit] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(putUrl).toBe(`${BASE}/logs-2026-11`);
		expect(putInit.method).toBe('PUT');
		expect(putInit.body).toBe(
			JSON.stringify({ settings: { number_of_shards: 1 } }),
		);
		const [deleteUrl, deleteInit] = fetchMock.mock.calls[1] as [
			string,
			RequestInit,
		];
		expect(deleteUrl).toBe(`${BASE}/logs-2026-11/_doc/1`);
		expect(deleteInit.method).toBe('DELETE');
		expect(deleteInit.body).toBeUndefined();
	});

	it('sends a raw NDJSON string body verbatim with the x-ndjson content type', async () => {
		respond({ errors: false, items: [] }, 200);

		const ndjson = '{"index":{"_id":"1"}}\n{"level":"error"}\n';
		await makeElasticsearchRequest(BASE, 'ApiKey k', {
			method: 'PUT',
			path: '/logs/_bulk',
			body: ndjson,
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('PUT');
		expect(init.body).toBe(ndjson);
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/x-ndjson',
		);
	});

	it('never attaches a body to a HEAD request', async () => {
		// A HEAD response has no body; no content-type keeps the shared
		// client from trying to JSON-parse an empty payload.
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		const result = await makeElasticsearchRequest(BASE, 'ApiKey k', {
			method: 'HEAD',
			path: '/logs-2026-11/_doc/1',
		});

		expect(result).toBeUndefined();
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${BASE}/logs-2026-11/_doc/1`);
		expect(init.method).toBe('HEAD');
		expect(init.body).toBeUndefined();
	});

	it('carries the request method on the wrapped error', async () => {
		respond(esErrorBody(503, 'internal', 'boom'), 503);

		const error = await failure(
			makeElasticsearchRequest(BASE, 'ApiKey k', {
				method: 'POST',
				path: '/logs/_doc/1',
				body: { a: 1 },
			}),
		);

		expect(error.status).toBe(503);
		expect(error.method).toBe('POST');
	});

	it('maps an error envelope to ElasticsearchAPIError with type and reason', async () => {
		respond(
			esErrorBody(
				404,
				'index_not_found_exception',
				'no such index [missing-index]',
			),
			404,
		);

		const error = await failure(
			makeElasticsearchRequest(BASE, 'ApiKey k', {
				path: '/missing-index',
			}),
		);

		expect(error.status).toBe(404);
		expect(error.errorType).toBe('index_not_found_exception');
		expect(error.reason).toBe('no such index [missing-index]');
		expect(error.message).toBe(
			'Elasticsearch 404: no such index [missing-index]',
		);
	});

	it('maps a text 429 body without losing the status', async () => {
		respond('too many requests', 429);

		const error = await failure(
			makeElasticsearchRequest(BASE, 'ApiKey k', { path: '/_search' }),
		);

		expect(error.status).toBe(429);
		expect(error.message).toContain('429');
	});

	it('makes exactly one fetch attempt on a 429 and reads Retry-After', async () => {
		respond(
			esErrorBody(429, 'es_rejected_execution_exception', 'rejected'),
			429,
			{
				'Retry-After': '2',
			},
		);

		const error = await failure(
			makeElasticsearchRequest(BASE, 'ApiKey k', { path: '/_search' }),
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.retryAfter).toBe(2000);
	});
});

describe('makeElasticsearchBinaryRequest', () => {
	it('returns base64 bytes with the content type, auth and query intact', async () => {
		const bytes = new Uint8Array([0x1a, 0x00, 0xff]);
		fetchMock.mockResolvedValueOnce(
			new Response(bytes, {
				status: 200,
				headers: { 'Content-Type': 'application/x-protobuf' },
			}),
		);

		const result = await makeElasticsearchBinaryRequest(BASE, 'ApiKey k', {
			path: '/logs/_mvt/message/3/4/5',
			query: { extent: 4096 },
		});

		expect(result).toEqual({
			contentType: 'application/x-protobuf',
			base64: Buffer.from(bytes).toString('base64'),
		});
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${BASE}/logs/_mvt/message/3/4/5?extent=4096`);
		expect(new Headers(init.headers).get('authorization')).toBe('ApiKey k');
	});

	it('maps a JSON error envelope with status and method', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify(
					esErrorBody(404, 'index_not_found_exception', 'no such index [x]'),
				),
				{ status: 404, headers: { 'Content-Type': 'application/json' } },
			),
		);

		const error = await failure(
			makeElasticsearchBinaryRequest(BASE, 'ApiKey k', {
				path: '/missing/_mvt/geo/3/4/5',
			}),
		);

		expect(error.status).toBe(404);
		expect(error.method).toBe('GET');
		expect(error.errorType).toBe('index_not_found_exception');
	});
});
