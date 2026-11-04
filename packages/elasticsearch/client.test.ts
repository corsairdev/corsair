import { AuthMissingError } from 'corsair/core';
import {
	buildAuthorizationHeader,
	ElasticsearchAPIError,
	encodeIndexTarget,
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
