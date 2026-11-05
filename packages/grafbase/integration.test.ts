import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { GrafbaseAPIError } from './client';
import { grafbase } from './index';
import {
	compositionError,
	envelope,
	graphQLErrorEnvelope,
	graphWithBranch,
	publishSuccess,
	viewer,
} from './test-fixtures';

async function createClient(options: Parameters<typeof grafbase>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'grafbase', 'default');
	const corsair = createCorsair({
		plugins: [grafbase(options)],
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

describe('Grafbase plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.grafbase.keys.issue_new_dek();
			await expect(corsair.grafbase.api.viewer.get({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account as Bearer', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.grafbase.keys.issue_new_dek();
			await corsair.grafbase.keys.set_api_key('gf-stored-key');
			respond(envelope({ viewer }));

			await corsair.grafbase.api.viewer.get({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('authorization')).toBe('Bearer gf-stored-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('reads a graph with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'gf-test-key' });
		try {
			respond(envelope({ graphByAccountSlug: graphWithBranch }));

			const result = await corsair.grafbase.api.graphs.get({
				accountSlug: 'fieldkit',
				graphSlug: 'analytics-api',
			});

			expect(result.graph?.productionBranch?.name).toBe('main');
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.grafbase.com/graphql');
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a publish composition failure as an outcome, not a throw', async () => {
		const { corsair, testDb } = await createClient({ key: 'gf-test-key' });
		try {
			respond(envelope({ publish: compositionError }));

			const result = await corsair.grafbase.api.subgraphs.publish({
				accountSlug: 'fieldkit',
				graphSlug: 'analytics-api',
				subgraph: 'products',
				schema: 'type Product { id: ID! name: String }',
			});

			expect(result.__typename).toBe('FederatedGraphCompositionError');
			expect(result.messages).toEqual(compositionError.messages);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a successful publish outcome', async () => {
		const { corsair, testDb } = await createClient({ key: 'gf-test-key' });
		try {
			respond(envelope({ publish: publishSuccess }));

			const result = await corsair.grafbase.api.subgraphs.publish({
				accountSlug: 'fieldkit',
				graphSlug: 'analytics-api',
				subgraph: 'products',
				schema: 'type Product { id: ID! name: String }',
			});

			expect(result).toEqual(publishSuccess);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'gf-bad-key' });
		try {
			respond(graphQLErrorEnvelope('Unauthorized'), 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.grafbase.api.viewer
				.get({})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(GrafbaseAPIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

const describeIfKey = process.env.GRAFBASE_API_KEY ? describe : describe.skip;

describeIfKey('Grafbase live smoke (read-only)', () => {
	it('reads the viewer with a real token', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.GRAFBASE_API_KEY,
		});
		try {
			const result = await corsair.grafbase.api.viewer.get({});
			expect(result.viewer?.id).toBeDefined();
		} finally {
			testDb.cleanup();
		}
	});
});
