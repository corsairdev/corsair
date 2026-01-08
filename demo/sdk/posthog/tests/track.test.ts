import { PostHog } from '../api';
import { TrackService } from '../services';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
} from './setup';

describe('PostHog.Track - Track API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have track methods defined', () => {
			expect(typeof TrackService.trackPage).toBe('function');
			expect(typeof TrackService.trackScreen).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose track methods through facade', () => {
			expect(typeof PostHog.Track.trackPage).toBe('function');
			expect(typeof PostHog.Track.trackScreen).toBe('function');
		});
	});

	describe('Integration tests', () => {
		it('should track a page view', async () => {
			if (requireToken()) return;

			try {
				const distinctId = `user-${generateTestId()}`;
				
				const response = await PostHog.Track.trackPage({
					distinct_id: distinctId,
					url: 'https://example.com/test-page',
					properties: {
						title: 'Test Page',
						referrer: 'https://google.com',
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

		it('should track a screen view', async () => {
			if (requireToken()) return;

			try {
				const distinctId = `user-${generateTestId()}`;
				
				const response = await PostHog.Track.trackScreen({
					distinct_id: distinctId,
					screen_name: 'HomeScreen',
					properties: {
						app_version: '1.0.0',
						platform: 'ios',
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

