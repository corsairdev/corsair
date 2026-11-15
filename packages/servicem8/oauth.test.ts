import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { servicem8 } from './index';

const kek = '0123456789abcdef0123456789abcdef';

async function client(key?: string, includeClientSecret = true) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'servicem8', 'default');
	const corsair = createCorsair({
		plugins: [servicem8({ authType: 'oauth_2', key })],
		database: testDb.db,
		kek,
	});
	await corsair.keys.servicem8.issue_new_dek();
	await corsair.keys.servicem8.set_client_id('client-id');
	if (includeClientSecret)
		await corsair.keys.servicem8.set_client_secret('client-secret');
	await corsair.servicem8.keys.issue_new_dek();
	await corsair.servicem8.keys.set_access_token('expired');
	await corsair.servicem8.keys.set_refresh_token('old-refresh');
	await corsair.servicem8.keys.set_expires_at('1');
	return { corsair, testDb };
}

describe('ServiceM8 stored OAuth', () => {
	afterEach(() => jest.restoreAllMocks());

	it('refreshes an expired token, persists rotation, and sends the new token', async () => {
		const { corsair, testDb } = await client();
		try {
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockResolvedValueOnce(
					new Response(
						JSON.stringify({
							access_token: 'new-access',
							refresh_token: 'new-refresh',
							expires_in: 3600,
						}),
						{ status: 200 },
					),
				)
				.mockResolvedValueOnce(new Response('[]', { status: 200 }));
			await expect(corsair.servicem8.api.jobs.list({})).resolves.toEqual({
				data: [],
				nextCursor: undefined,
			});
			expect(fetchMock.mock.calls[0]?.[0]).toBe(
				'https://go.servicem8.com/oauth/access_token',
			);
			expect(String(fetchMock.mock.calls[0]?.[1]?.body)).toContain(
				'refresh_token=old-refresh',
			);
			expect(fetchMock.mock.calls[1]?.[1]?.headers).toMatchObject({
				Authorization: 'Bearer new-access',
			});
			expect(await corsair.servicem8.keys.get_access_token()).toBe(
				'new-access',
			);
			expect(await corsair.servicem8.keys.get_refresh_token()).toBe(
				'new-refresh',
			);
			expect(
				Number(await corsair.servicem8.keys.get_expires_at()),
			).toBeGreaterThan(Date.now() / 1000);
		} finally {
			testDb.cleanup();
		}
	});

	it('honors an explicit key instead of refreshing stored credentials', async () => {
		const { corsair, testDb } = await client('override');
		try {
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockResolvedValue(new Response('[]', { status: 200 }));
			await corsair.servicem8.api.jobs.list({});
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
				Authorization: 'Bearer override',
			});
			expect(await corsair.servicem8.keys.get_refresh_token()).toBe(
				'old-refresh',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('uses an unexpired stored token without a refresh request', async () => {
		const { corsair, testDb } = await client();
		try {
			await corsair.servicem8.keys.set_expires_at(
				String(Math.floor(Date.now() / 1000) + 3600),
			);
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockResolvedValue(new Response('[]', { status: 200 }));
			await corsair.servicem8.api.jobs.list({});
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
				Authorization: 'Bearer expired',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects expired connections without a refresh token before HTTP', async () => {
		const { corsair, testDb } = await client();
		try {
			await corsair.servicem8.keys.set_refresh_token('');
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockRejectedValue(new Error('Unexpected HTTP request'));
			await expect(corsair.servicem8.api.jobs.list({})).rejects.toMatchObject({
				name: 'AuthMissingError',
			});
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects stored connections without client credentials before HTTP', async () => {
		const { corsair, testDb } = await client(undefined, false);
		try {
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockRejectedValue(new Error('Unexpected HTTP request'));
			await expect(corsair.servicem8.api.jobs.list({})).rejects.toMatchObject({
				name: 'AuthMissingError',
			});
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});
