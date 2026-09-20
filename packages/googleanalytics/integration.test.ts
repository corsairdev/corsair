import { createCorsair } from 'corsair/core';
import { request } from 'corsair/http';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { googleanalytics } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('Google Analytics plugin integration', () => {
	let testDb: ReturnType<typeof createTestDatabase>;
	let corsair: ReturnType<typeof createCorsair>;

	beforeEach(async () => {
		mockRequest.mockReset();
		testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'googleanalytics');
		corsair = createCorsair({
			plugins: [googleanalytics({ key: 'test-token' })],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});
	});

	afterEach(() => {
		testDb?.cleanup();
	});

	it('logs events and caches accounts without stamping createdAt as now', async () => {
		mockRequest.mockResolvedValue({
			name: 'accounts/123',
			displayName: 'Demo Account',
			createTime: '2021-01-01T00:00:00Z',
		});

		await corsair.googleanalytics.api.accounts.get({
			name: 'accounts/123',
		});

		const account =
			await corsair.googleanalytics.db.accounts.findByEntityId('accounts/123');
		expect(account?.data.name).toBe('accounts/123');
		expect(account?.data.displayName).toBe('Demo Account');
		expect(account?.data.createTime).toBe('2021-01-01T00:00:00Z');
		expect(account?.data.createdAt).toBeUndefined();

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'googleanalytics.accounts.get' },
		});
		expect(events.length).toBeGreaterThan(0);
	});
});
