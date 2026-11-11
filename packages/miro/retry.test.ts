import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { miro } from './index';
import { board, boardsListResponse, rateLimited } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'miro', 'default');
	const corsair = createCorsair({
		plugins: [miro({ key: 'miro-test-token' })],
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
	it('retries a 429 on a read and returns the boards', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 429, { 'Retry-After': '1' });
			respond(boardsListResponse);

			const result = await corsair.miro.api.boards.list({});

			expect(result.boards).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(rateLimited, 429, { 'Retry-After': '1' });
			}

			await expect(corsair.miro.api.boards.list({})).rejects.toMatchObject({
				status: 429,
			});
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx on a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: 502, code: 'internal', message: 'boom' }, 502);
			respond(boardsListResponse);

			const result = await corsair.miro.api.boards.list({});

			expect(result.boards).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a create after a 5xx, which may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: 502, code: 'internal', message: 'boom' }, 502);
			// Queued so a replay, if one happened, would be counted rather than
			// reach the network.
			respond(board, 201);

			await expect(
				corsair.miro.api.boards.create({ name: 'Roadmap' }),
			).rejects.toMatchObject({ status: 502, method: 'POST' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a dropped create, which may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.miro.api.boards.create({ name: 'Roadmap' }),
			).rejects.toMatchObject({ method: 'POST' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 400', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{ status: 400, code: 'invalidArgument', message: 'bad body' },
				400,
			);

			await expect(
				corsair.miro.api.boards.create({ name: 'x' }),
			).rejects.toMatchObject({ status: 400 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
