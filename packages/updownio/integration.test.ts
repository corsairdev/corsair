import { AuthMissingError, createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { updownio } from './index';

describe('updownio with no key connected', () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');

	async function setup(key?: string) {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'updownio', 'default');
		const corsair = createCorsair({
			plugins: [updownio({ key })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { corsair, testDb };
	}

	it('serves the public node routes and rejects checks.list as auth-missing', async () => {
		const { corsair, testDb } = await setup();
		try {
			fetchMock.mockResolvedValue(
				new Response(
					JSON.stringify({
						tok: { ip: '45.76.104.117', city: 'Tokyo', country_code: 'jp' },
					}),
					{ status: 200, headers: { 'Content-Type': 'application/json' } },
				),
			);
			const nodes = await corsair.updownio.api.nodes.list({});
			expect(nodes.tok?.city).toBe('Tokyo');
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await expect(corsair.updownio.api.checks.list({})).rejects.toBeInstanceOf(
				AuthMissingError,
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			fetchMock.mockReset();
			await testDb.cleanup();
		}
	});

	it('falls back to the saved key when the key option is empty', async () => {
		const { corsair, testDb } = await setup('');
		try {
			await corsair.updownio.keys.issue_new_dek();
			await corsair.updownio.keys.set_api_key('saved-key');
			fetchMock.mockResolvedValue(
				new Response('[]', {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
			await corsair.updownio.api.checks.list({});
			const [url, init] = fetchMock.mock.calls[0] ?? [];
			const headers = new Headers(init?.headers);
			const sentKey =
				headers.get('X-API-KEY') ??
				new URL(String(url)).searchParams.get('api-key');
			expect(sentKey).toBe('saved-key');
		} finally {
			fetchMock.mockReset();
			await testDb.cleanup();
		}
	});
});
