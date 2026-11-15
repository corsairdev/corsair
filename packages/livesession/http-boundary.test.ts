import { AuthMissingError, createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { makeLiveSessionRequest } from './client';
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

	it('rejects a token with inner whitespace without echoing it', async () => {
		// Core's `new Headers()` would throw a TypeError quoting the whole header value.
		const error = await makeLiveSessionRequest(
			'/sessions',
			'abc\nsecret-part',
		).catch((e: Error) => e);
		expect(error).toBeInstanceOf(Error);
		expect((error as Error).message).toBe(
			'LiveSession API token contains whitespace or control characters',
		);
		// `unknown` because Error.cause can hold any thrown value; it is only stringified here.
		const seen = `${(error as Error).message} ${(error as Error).stack} ${String((error as Error & { cause?: unknown }).cause)}`;
		expect(seen).not.toContain('secret-part');
		expect(fetchMock).not.toHaveBeenCalled();
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

	it('throws an auth-missing error when there is neither a token nor a key store', async () => {
		// No database, so core gives the keyBuilder no key store (ctx.keys is unset).
		const corsair = createCorsair({ plugins: [livesession()] });
		await expect(
			corsair.livesession.api.sessions.list({}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
