import { createCorsair } from 'corsair/core';
import { request } from 'corsair/http';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { webflow } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('Webflow plugin integration', () => {
	let testDb: ReturnType<typeof createTestDatabase>;
	let corsair: ReturnType<typeof createCorsair>;

	beforeEach(async () => {
		mockRequest.mockReset();
		testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'webflow');
		corsair = createCorsair({
			plugins: [webflow({ key: 'test-token' })],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});
	});

	afterEach(() => {
		testDb?.cleanup();
	});

	it('logs events and caches site entities', async () => {
		mockRequest.mockResolvedValue({
			sites: [
				{
					id: '580e63e98c9a982ac9b8b741',
					displayName: 'Demo Site',
					shortName: 'demo-site',
					timeZone: 'America/New_York',
				},
			],
		});

		await corsair.webflow.api.sites.listSites({});

		const site = await corsair.webflow.db.sites.findByEntityId(
			'580e63e98c9a982ac9b8b741',
		);
		expect(site?.data.displayName).toBe('Demo Site');

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'webflow.sites.listSites' },
		});
		expect(events.length).toBeGreaterThan(0);
	});

	it('caches pages whose slug is null', async () => {
		mockRequest.mockResolvedValue({
			pages: [
				{
					id: '6596da6045e56dee495bcbba',
					title: 'Home',
					slug: null,
				},
			],
		});

		await corsair.webflow.api.pages.listPages({
			site_id: '580e63e98c9a982ac9b8b741',
		});

		const page = await corsair.webflow.db.pages.findByEntityId(
			'6596da6045e56dee495bcbba',
		);
		expect(page?.data.slug).toBeNull();
	});
});
