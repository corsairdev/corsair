import { HubSpot } from '../hubspot-api';
import { DealsService } from '../../services/hubspot';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
	sleep,
} from './setup';

describe('HubSpot.Deals - Deals API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have all deal methods defined', () => {
			expect(typeof DealsService.getDeal).toBe('function');
			expect(typeof DealsService.getManyDeals).toBe('function');
			expect(typeof DealsService.createDeal).toBe('function');
			expect(typeof DealsService.updateDeal).toBe('function');
			expect(typeof DealsService.deleteDeal).toBe('function');
			expect(typeof DealsService.getRecentlyCreatedDeals).toBe('function');
			expect(typeof DealsService.getRecentlyUpdatedDeals).toBe('function');
			expect(typeof DealsService.searchDeals).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose all deal methods through facade', () => {
			expect(typeof HubSpot.Deals.get).toBe('function');
			expect(typeof HubSpot.Deals.getMany).toBe('function');
			expect(typeof HubSpot.Deals.create).toBe('function');
			expect(typeof HubSpot.Deals.update).toBe('function');
			expect(typeof HubSpot.Deals.delete).toBe('function');
			expect(typeof HubSpot.Deals.getRecentlyCreated).toBe('function');
			expect(typeof HubSpot.Deals.getRecentlyUpdated).toBe('function');
			expect(typeof HubSpot.Deals.search).toBe('function');
		});
	});

	describe('Integration tests', () => {
		let createdDealId: string | undefined;

		afterAll(async () => {
			if (createdDealId && !requireToken()) {
				try {
					await HubSpot.Deals.delete({ dealId: createdDealId });
					console.log(`Cleanup: Deleted deal ${createdDealId}`);
				} catch (e) {
					console.warn(`Cleanup failed for deal ${createdDealId}`);
				}
			}
		});

		it('should get many deals', async () => {
			if (requireToken()) return;

			try {
				const response = await HubSpot.Deals.getMany({ limit: 10 });
				expect(response).toBeDefined();
				expect(Array.isArray(response.results)).toBe(true);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it('should create a deal', async () => {
			if (requireToken()) return;

			try {
				const testName = `Test Deal ${generateTestId()}`;
				const response = await HubSpot.Deals.create({
					properties: {
						dealname: testName,
						dealstage: 'appointmentscheduled',
						pipeline: 'default',
					},
				});
				expect(response).toBeDefined();
				expect(response.id).toBeDefined();
				createdDealId = response.id;
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it('should get a deal by ID', async () => {
			if (requireToken() || !createdDealId) return;

			try {
				await sleep(1000); // Wait for deal to be available
				const response = await HubSpot.Deals.get({
					dealId: createdDealId,
				});
				expect(response).toBeDefined();
				expect(response.id).toBe(createdDealId);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});
	});
});

