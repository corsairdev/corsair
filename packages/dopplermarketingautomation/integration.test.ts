import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { dopplermarketingautomation } from './index';

describe('Doppler through Corsair', () => {
	it('uses bound credentials and does not retry a rate-limited write', async () => {
		const testDb = createTestDatabase();
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{"message":"slow down"}', {
				status: 429,
				headers: { 'Retry-After': '1' },
			}),
		);
		try {
			await createIntegrationAndAccount(
				testDb.db,
				'dopplermarketingautomation',
				'default',
			);
			const corsair = createCorsair({
				plugins: [dopplermarketingautomation({ key: 'test-key' })],
				database: testDb.db,
				kek: '0123456789abcdef0123456789abcdef',
			});
			await expect(
				corsair.dopplermarketingautomation.api.lists.create({
					accountName: 'team',
					list: { name: 'Members' },
				}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(
				new Headers(fetchMock.mock.calls[0]![1]?.headers).get('Authorization'),
			).toBe('token test-key');
		} finally {
			fetchMock.mockRestore();
			testDb.cleanup();
		}
	});
});
