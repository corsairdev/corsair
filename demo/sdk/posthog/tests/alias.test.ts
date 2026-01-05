import { PostHog } from '../api';
import { AliasService } from '../services';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
} from './setup';

describe('PostHog.Alias - Alias API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have alias methods defined', () => {
			expect(typeof AliasService.createAlias).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose alias methods through facade', () => {
			expect(typeof PostHog.Alias.create).toBe('function');
		});
	});

	describe('Integration tests', () => {
		it('should create an alias', async () => {
			if (requireToken()) return;

			try {
				const distinctId = `user-${generateTestId()}`;
				const alias = `alias-${generateTestId()}`;
				
				const response = await PostHog.Alias.create({
					distinct_id: distinctId,
					alias: alias,
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

