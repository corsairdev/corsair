import {
	createDocupostMatch,
	verifyDocupostWebhookSignature,
} from './webhooks/types';

describe('Docupost webhooks', () => {
	describe('createDocupostMatch', () => {
		it('matches an event with the expected type', () => {
			const matcher = createDocupostMatch('example');

			const request = {
				body: JSON.stringify({
					type: 'example',
					created_at: '2026-01-01T00:00:00Z',
					data: {
						id: 'event-123',
					},
				}),
			} as any;

			expect(matcher(request)).toBe(true);
		});

		it('rejects an event with a different type', () => {
			const matcher = createDocupostMatch('example');

			const request = {
				body: JSON.stringify({
					type: 'different',
					created_at: '2026-01-01T00:00:00Z',
					data: {
						id: 'event-123',
					},
				}),
			} as any;

			expect(matcher(request)).toBe(false);
		});

		it('rejects invalid JSON', () => {
			const matcher = createDocupostMatch('example');

			const request = {
				body: 'not-valid-json',
			} as any;

			expect(matcher(request)).toBe(false);
		});
	});

	describe('verifyDocupostWebhookSignature', () => {
		it('currently accepts a webhook request', () => {
			const request = {
				body: {
					type: 'example',
					created_at: '2026-01-01T00:00:00Z',
					data: {
						id: 'event-123',
					},
				},
			} as any;

			const result = verifyDocupostWebhookSignature(request, 'test-secret');

			expect(result.valid).toBe(true);
		});
	});
});
