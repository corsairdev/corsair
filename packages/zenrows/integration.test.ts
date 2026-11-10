import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { zenrows } from './index';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'zenrows', 'default');
	const corsair = createCorsair({
		plugins: [zenrows()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.zenrows.keys.issue_new_dek();
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary provider JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					status >= 400 ? 'application/problem+json' : 'application/json',
				...headers,
			},
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

describe('Zenrows through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(corsair.zenrows.api.crawl.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('runs a crawl and reads it back through the bound client', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.zenrows.keys.set_api_key('stored-key');
			respond(
				{
					crawl_id: 'c_01M72F709NDF8XFBYKBXRZ3QFA',
					status: 'running',
					url: 'https://example.com',
					results: [],
				},
				202,
			);
			respond({
				crawl_id: 'c_01M72F709NDF8XFBYKBXRZ3QFA',
				status: 'completed',
				results: [],
				next_cursor: null,
			});

			const started = await corsair.zenrows.api.crawl.start({
				url: 'https://example.com',
				maxPages: 1,
			});
			const read = await corsair.zenrows.api.crawl.get({
				crawlId: started.crawl_id,
			});

			expect(started.status).toBe('running');
			expect(read.status).toBe('completed');
			const [url] = fetchMock.mock.calls[1] as [string];
			expect(new URL(url).pathname).toBe(
				'/v1/crawls/c_01M72F709NDF8XFBYKBXRZ3QFA',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
