import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { ElasticsearchAPIError } from './client';
import { elasticsearch } from './index';
import {
	catIndices,
	clusterHealth,
	documentFound,
	documentMissing,
	esErrorBody,
	indexInfo,
	searchResponse,
	writeResponse,
} from './test-fixtures';

async function createClient(options: Parameters<typeof elasticsearch>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'elasticsearch', 'default');
	const corsair = createCorsair({
		plugins: [elasticsearch(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('elasticsearch plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.elasticsearch.keys.issue_new_dek();
			await expect(
				corsair.elasticsearch.api.cluster.getHealth({}),
			).rejects.toThrow(/auth-missing:elasticsearch:api_key/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('names the missing cluster URL when a key is stored but baseUrl is not', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.elasticsearch.keys.issue_new_dek();
			await corsair.elasticsearch.keys.set_api_key('encoded-key');
			await expect(
				corsair.elasticsearch.api.cluster.getHealth({}),
			).rejects.toThrow(/auth-missing:elasticsearch:baseUrl/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored ApiKey to the per-account cluster URL', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.elasticsearch.keys.issue_new_dek();
			await corsair.elasticsearch.keys.set_api_key('encoded-key');
			await corsair.elasticsearch.keys.set_baseUrl('http://tenant-es:9200/');
			respond(clusterHealth);

			const result = await corsair.elasticsearch.api.cluster.getHealth({});

			expect(result.status).toBe('green');
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('http://tenant-es:9200/_cluster/health');
			expect(new Headers(init.headers).get('authorization')).toBe(
				'ApiKey encoded-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('uses the option key and baseUrl in solo mode, encoding id:api_key', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://solo-es:9200/',
			key: 'my-id:my-secret',
		});
		try {
			respond(clusterHealth);

			await corsair.elasticsearch.api.cluster.getHealth({});

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('http://solo-es:9200/_cluster/health');
			expect(new Headers(init.headers).get('authorization')).toBe(
				`ApiKey ${Buffer.from('my-id:my-secret').toString('base64')}`,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('runs a search as POST with the typed query as the JSON body', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			respond(searchResponse());

			const result = await corsair.elasticsearch.api.search.run({
				index: 'logs-*',
				size: 5,
				query: { bool: { filter: [{ term: { level: 'error' } }] } },
			});

			expect(result.hits.hits).toHaveLength(1);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('http://es:9200/logs-*/_search');
			expect(init.method).toBe('POST');
			expect(JSON.parse(String(init.body))).toEqual({
				from: 0,
				size: 5,
				query: { bool: { filter: [{ term: { level: 'error' } }] } },
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('lists indices through the cat endpoint with format=json', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			respond(catIndices());

			const result = await corsair.elasticsearch.api.indices.list({
				index: 'logs-*',
			});

			expect(result[0]?.index).toBe('logs-2026-11');
			const [url] = fetchMock.mock.calls[0] as [string];
			expect(url).toBe('http://es:9200/_cat/indices/logs-*?format=json');
		} finally {
			testDb.cleanup();
		}
	});

	it('gets index info from the index-name-keyed map', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			respond(indexInfo);

			const result = await corsair.elasticsearch.api.indices.get({
				index: 'logs-2026-11',
			});

			expect(result['logs-2026-11']?.settings).toBeDefined();
		} finally {
			testDb.cleanup();
		}
	});

	it('surfaces an index_not_found 404 from indices.get as an error', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			respond(
				esErrorBody(404, 'index_not_found_exception', 'no such index [nope]'),
				404,
			);

			const error = await corsair.elasticsearch.api.indices
				.get({ index: 'nope' })
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ElasticsearchAPIError);
			expect(error).toMatchObject({
				status: 404,
				errorType: 'index_not_found_exception',
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns found: false for the documented documents.get 404 body', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			respond(documentMissing, 404);

			const result = await corsair.elasticsearch.api.documents.get({
				index: 'logs-2026-11',
				id: 'does-not-exist',
			});

			expect(result.found).toBe(false);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a found document by index and id', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			respond(documentFound);

			const result = await corsair.elasticsearch.api.documents.get({
				index: 'logs-2026-11',
				id: 'tZ0GinMB6Y5qFuDylF8J',
			});

			expect(result.found).toBe(true);
			expect(result._source).toEqual(documentFound._source);
			const [url] = fetchMock.mock.calls[0] as [string];
			expect(url).toBe('http://es:9200/logs-2026-11/_doc/tZ0GinMB6Y5qFuDylF8J');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 once more and returns the next response (2 attempts)', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			respond(
				esErrorBody(429, 'es_rejected_execution_exception', 'busy'),
				429,
				{
					'Retry-After': '0',
				},
			);
			respond(clusterHealth);

			const result = await corsair.elasticsearch.api.cluster.getHealth({});

			expect(result.status).toBe('green');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('indexes a document with a JSON body and query params through the bind layer', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			respond(writeResponse);

			const result = await corsair.elasticsearch.api.documents.index({
				index: 'logs-2026-11',
				id: '1',
				document: { level: 'error', message: 'disk on node 2 above 90%' },
				refresh: 'wait_for',
			});

			expect(result.result).toBe('created');
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('http://es:9200/logs-2026-11/_doc/1?refresh=wait_for');
			expect(init.method).toBe('POST');
			expect(JSON.parse(String(init.body))).toEqual({
				level: 'error',
				message: 'disk on node 2 above 90%',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('resolves a HEAD exists 404 to { exists: false } through the bind layer', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));

			const result = await corsair.elasticsearch.api.documents.exists({
				index: 'logs-2026-11',
				id: 'missing',
			});

			expect(result).toEqual({ exists: false });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a write that fails 5xx (exactly one fetch)', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			respond(esErrorBody(503, 'internal', 'boom'), 503);

			await expect(
				corsair.elasticsearch.api.documents.index({
					index: 'logs-2026-11',
					id: '1',
					document: { level: 'error' },
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401', async () => {
		const { corsair, testDb } = await createClient({
			baseUrl: 'http://es:9200',
			key: 'encoded-key',
		});
		try {
			respond(
				esErrorBody(401, 'security_exception', 'unable to authenticate'),
				401,
			);

			await expect(
				corsair.elasticsearch.api.cluster.getHealth({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
