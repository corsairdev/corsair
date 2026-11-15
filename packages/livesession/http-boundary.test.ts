import { AuthMissingError, createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { livesession } from './index';

describe('livesession against the shared HTTP boundary', () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');

	async function setup(key?: string) {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'livesession', 'default');
		const corsair = createCorsair({
			plugins: [livesession({ key })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { corsair, testDb };
	}

	afterEach(() => {
		fetchMock.mockReset();
	});

	it('sends the bearer token and forwards the requested page', async () => {
		const { corsair, testDb } = await setup('live-token');
		try {
			fetchMock.mockResolvedValue(
				new Response(
					JSON.stringify({
						total: 1,
						page: { num: 1, size: 25 },
						sessions: [{ id: 'session-1', website_id: 'website-1' }],
					}),
					{ status: 200, headers: { 'Content-Type': 'application/json' } },
				),
			);

			const result = await corsair.livesession.api.sessions.list({
				page: 1,
				size: 25,
			});

			expect(result.sessions).toHaveLength(1);
			const [url, init] = fetchMock.mock.calls[0] ?? [];
			expect(String(url)).toBe(
				'https://api.livesession.io/v1/sessions?page=1&size=25',
			);
			expect(new Headers(init?.headers).get('authorization')).toBe(
				'Bearer live-token',
			);
		} finally {
			await testDb.cleanup();
		}
	});

	it('fails closed with an auth-missing error when no token is configured', async () => {
		const { corsair, testDb } = await setup();
		try {
			await expect(
				corsair.livesession.api.sessions.list({}),
			).rejects.toBeInstanceOf(AuthMissingError);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			await testDb.cleanup();
		}
	});
});
