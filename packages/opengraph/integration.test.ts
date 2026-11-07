import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { OpengraphAPIError } from './client';
import { opengraph } from './index';
import { extractResponse, flatError, siteResponse } from './test-fixtures';

const describeIfKey = process.env.OPENGRAPH_API_KEY ? describe : describe.skip;

async function createClient(options: Parameters<typeof opengraph>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'opengraph', 'default');
	const corsair = createCorsair({
		plugins: [opengraph(options)],
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

describe('OpenGraph.io plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.opengraph.keys.issue_new_dek();
			await expect(
				corsair.opengraph.api.site.get({ url: 'https://github.com' }),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored App ID as a query parameter', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.opengraph.keys.issue_new_dek();
			await corsair.opengraph.keys.set_api_key('og-stored-id');
			respond(siteResponse);

			await corsair.opengraph.api.site.get({ url: 'https://github.com' });

			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				'https://opengraph.io/api/3.0/site/https%3A%2F%2Fgithub.com?app_id=og-stored-id',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads site metadata with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'og-test-id' });
		try {
			respond(siteResponse);

			const result = await corsair.opengraph.api.site.get({
				url: 'https://github.com',
			});

			expect(result.hybridGraph?.site_name).toBe('GitHub');
		} finally {
			testDb.cleanup();
		}
	});

	it('runs an extract with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'og-test-id' });
		try {
			respond(extractResponse);

			const result = await corsair.opengraph.api.extract.run({
				site: 'https://example.com',
				selectors: { heading: { selector: 'h1' } },
			});

			expect(result.data).toEqual({
				heading: 'Example Domain',
				allLinks: ['https://www.iana.org/domains/example'],
			});
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				'https://opengraph.io/api/3.0/extract?app_id=og-test-id',
			);
			expect(init.method).toBe('POST');
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad App ID', async () => {
		const { corsair, testDb } = await createClient({ key: 'og-bad-id' });
		try {
			respond(flatError, 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.opengraph.api.site
				.get({ url: 'https://github.com' })
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(OpengraphAPIError);
			expect(error).toMatchObject({ status: 401, code: 'INVALID_APP_ID' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

// Live read-only smoke tests; CI skips this file, so these run only with a
// local OPENGRAPH_API_KEY.
describeIfKey('OpenGraph.io live smoke', () => {
	it('unfurls a real page', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.opengraph.keys.issue_new_dek();
			await corsair.opengraph.keys.set_api_key(
				process.env.OPENGRAPH_API_KEY as string,
			);

			const result = await corsair.opengraph.api.site.get({
				url: 'https://github.com',
			});

			expect(result.hybridGraph?.url).toContain('github.com');
		} finally {
			testDb.cleanup();
		}
	});

	it('analyzes a real brand', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.opengraph.keys.issue_new_dek();
			await corsair.opengraph.keys.set_api_key(
				process.env.OPENGRAPH_API_KEY as string,
			);

			const result = await corsair.opengraph.api.brand.analyze({
				url: 'https://asana.com',
				sections: { visual: false },
			});

			expect(result.brand?.domain).toBe('asana.com');
		} finally {
			testDb.cleanup();
		}
	});
});
