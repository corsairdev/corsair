import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mocean } from './index';
import { balance, throttledBody } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mocean', 'default');
	const corsair = createCorsair({
		plugins: [mocean({ key: 'mocean-test-token' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown, // unknown: response bodies are arbitrary JSON.
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
	it('retries a throttled read and returns the good answer', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(throttledBody);
			respond(balance);

			const result = await corsair.mocean.api.account.balance({});

			expect(result.value).toBe(100);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows the throttle', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(throttledBody);
			}

			await expect(
				corsair.mocean.api.account.balance({}),
			).rejects.toMatchObject({ bodyStatus: 32 });
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a maintenance answer even though the last call was a send', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: 40, err_msg: 'System down for maintenance' });
			respond(
				{ messages: [{ status: 0, receiver: '60123456789', msgid: 'm1' }] },
				202,
			);

			const result = await corsair.mocean.api.sms.send({
				mocean_from: 'MOC',
				mocean_to: '60123456789',
				mocean_text: 'Hello',
			});

			expect(result.messages).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 5xx on a send, which may have been charged', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'upstream' }, 503);

			await expect(
				corsair.mocean.api.sms.send({
					mocean_from: 'MOC',
					mocean_to: '60123456789',
					mocean_text: 'Hello',
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a body auth failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: 1, err_msg: 'Authorization failed' });

			await expect(
				corsair.mocean.api.account.balance({}),
			).rejects.toMatchObject({ bodyStatus: 1 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
