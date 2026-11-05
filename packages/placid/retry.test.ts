import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { placid } from './index';
import { templateList } from './test-fixtures';

/**
 * Endpoint tests call the HTTP client directly, which is configured with
 * `maxRetries: 0`. Only the client bound by `createCorsair` retries, so a 429
 * has to be exercised from here. This file is separate from
 * `integration.test.ts` because CI skips that name.
 */
async function createClient(key = 'placid-test-key') {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'placid', 'default');
	const corsair = createCorsair({
		plugins: [placid({ key })],
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

describe('retries through the bound client', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too Many Attempts.' }, 429, { 'Retry-After': '1' });
			respond(templateList);

			const result = await corsair.placid.api.templates.list({});

			expect(result.data).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 20_000);

	it('retries a 429 on a create, which never started rendering', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too Many Attempts.' }, 429, { 'Retry-After': '1' });
			respond({ id: 1, status: 'queued', image_url: null, polling_url: null });

			const result = await corsair.placid.api.images.create({
				template_uuid: 'ospo24ysn',
			});

			expect(result.status).toBe('queued');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	}, 20_000);

	it('gives up after three retries on a persistent 429', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt++) {
				respond({ message: 'Too Many Attempts.' }, 429, { 'Retry-After': '0' });
			}

			await expect(corsair.placid.api.templates.list({})).rejects.toMatchObject(
				{
					status: 429,
				},
			);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 20_000);

	it('does not replay a 5xx on a create', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Server Error' }, 500);

			await expect(
				corsair.placid.api.images.create({ template_uuid: 'ospo24ysn' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
