import { HubSpot } from '../hubspot-api';
import { EngagementsService } from '../../services/hubspot';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
	sleep,
} from './setup';

describe('HubSpot.Engagements - Engagements API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have all engagement methods defined', () => {
			expect(typeof EngagementsService.getEngagement).toBe('function');
			expect(typeof EngagementsService.getManyEngagements).toBe('function');
			expect(typeof EngagementsService.createEngagement).toBe('function');
			expect(typeof EngagementsService.deleteEngagement).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose all engagement methods through facade', () => {
			expect(typeof HubSpot.Engagements.get).toBe('function');
			expect(typeof HubSpot.Engagements.getMany).toBe('function');
			expect(typeof HubSpot.Engagements.create).toBe('function');
			expect(typeof HubSpot.Engagements.delete).toBe('function');
		});
	});

	describe('Integration tests', () => {
		let createdEngagementId: string | undefined;

		afterAll(async () => {
			if (createdEngagementId && !requireToken()) {
				try {
					await HubSpot.Engagements.delete({
						engagementId: createdEngagementId,
					});
					console.log(`Cleanup: Deleted engagement ${createdEngagementId}`);
				} catch (e) {
					console.warn(
						`Cleanup failed for engagement ${createdEngagementId}`,
					);
				}
			}
		});

		it('should get many engagements', async () => {
			if (requireToken()) return;

			try {
				const response = await HubSpot.Engagements.getMany({ limit: 10 });
				expect(response).toBeDefined();
				expect(Array.isArray(response.results)).toBe(true);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it('should create an engagement', async () => {
			if (requireToken()) return;

			try {
				const response = await HubSpot.Engagements.create({
					engagement: {
						type: 'NOTE',
						timestamp: Date.now(),
					},
					metadata: {
						body: `Test engagement ${generateTestId()}`,
					},
				});
				expect(response).toBeDefined();
				expect(response.id).toBeDefined();
				createdEngagementId = response.id;
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});

		it('should get an engagement by ID', async () => {
			if (requireToken() || !createdEngagementId) return;

			try {
				await sleep(1000); // Wait for engagement to be available
				const response = await HubSpot.Engagements.get({
					engagementId: createdEngagementId,
				});
				expect(response).toBeDefined();
				expect(response.id).toBe(createdEngagementId);
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});
	});
});

