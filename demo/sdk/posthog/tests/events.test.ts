import { PostHog } from '../api';
import { EventService } from '../services';
import {
	generateTestId,
	handleRateLimit,
	requireToken,
} from './setup';

describe('PostHog.Events - Events API', () => {
	beforeAll(() => {
		if (requireToken()) {
			return;
		}
	});

	describe('Service class methods', () => {
		it('should have event methods defined', () => {
			expect(typeof EventService.createEvent).toBe('function');
		});
	});

	describe('API facade methods', () => {
		it('should expose event methods through facade', () => {
			expect(typeof PostHog.Events.create).toBe('function');
		});
	});

	describe('Integration tests', () => {
		it('should create an event', async () => {
			if (requireToken()) return;

			try {
				const distinctId = `user-${generateTestId()}`;
				
				const response = await PostHog.Events.create({
					distinct_id: distinctId,
					event: 'test_event',
					properties: {
						test_property: 'test_value',
						test_number: 123,
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

		it('should create an event with timestamp', async () => {
			if (requireToken()) return;

			try {
				const distinctId = `user-${generateTestId()}`;
				const timestamp = new Date().toISOString();
				
				const response = await PostHog.Events.create({
					distinct_id: distinctId,
					event: 'test_event_with_timestamp',
					properties: {
						test_property: 'test_value',
					},
					timestamp: timestamp,
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

