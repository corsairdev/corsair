import { PostHog } from '../api';
import { IdentityService } from '../services';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
} from './setup';

describe('PostHog.Identity - Identity API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have identity methods defined', () => {
			expect(typeof IdentityService.createIdentity).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose identity methods through facade', () => {
			expect(typeof PostHog.Identity.create).toBe('function');
		});
	});

	describe('Integration tests', () => {
		it('should create an identity', async () => {
			if (requireToken()) return;

			try {
				const distinctId = `user-${generateTestId()}`;
				
				const response = await PostHog.Identity.create({
					distinct_id: distinctId,
					properties: {
						email: `test-${generateTestId()}@example.com`,
						name: 'Test User',
						plan: 'premium',
					},
				});
				
				expect(response).toBeDefined();
				// PostHog typically returns 1 (number) on success, or an object with status
				if (typeof response === 'number') {
					expect([0, 1]).toContain(response);
				} else if (response && typeof response === 'object' && 'status' in response) {
					// Status can be a number (0 or 1) or a string like "Ok"
					const status = (response as any).status;
					if (typeof status === 'number') {
						expect([0, 1]).toContain(status);
					} else if (typeof status === 'string') {
						// Accept string statuses like "Ok", "ok", etc.
						expect(status.toLowerCase()).toMatch(/ok|success|1/);
					}
				}
			} catch (error) {
				await handleRateLimit(error);
				throw error;
			}
		});
	});
});

