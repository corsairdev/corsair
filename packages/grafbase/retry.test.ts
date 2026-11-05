import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { grafbase } from './index';
import { envelope, graph, graphQLErrorEnvelope } from './test-fixtures';

// Endpoint tests call the HTTP client, which has maxRetries: 0. Only the bound
// client retries through error-handlers.ts, so the 429 path runs here, in a
// file CI does not skip.
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'grafbase', 'default');
	const corsair = createCorsair({
		plugins: [grafbase({ key: 'gf-test-key' })],
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

describe('grafbase retry path through createCorsair', () => {
	it('retries a rate-limited query and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(graphQLErrorEnvelope('rate limited'), 429, {
				'Retry-After': '1',
			});
			respond(envelope({ graphByAccountSlug: graph }));

			const result = await corsair.grafbase.api.graphs.get({
				accountSlug: 'fieldkit',
				graphSlug: 'analytics-api',
			});

			expect(result.graph?.id).toBe(graph.id);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a publish that got a 500, which may have executed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Internal Server Error' }, 500);

			await expect(
				corsair.grafbase.api.subgraphs.publish({
					accountSlug: 'fieldkit',
					graphSlug: 'analytics-api',
					subgraph: 'products',
					schema: 'type Product { id: ID! name: String }',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a GraphQL-level failure, which is not a rate limit', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(graphQLErrorEnvelope('Cannot query field "viewerX"'));

			await expect(corsair.grafbase.api.viewer.get({})).rejects.toMatchObject({
				errors: [{ message: 'Cannot query field "viewerX"' }],
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
