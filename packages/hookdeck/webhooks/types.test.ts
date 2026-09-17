import type { WebhookRequest } from 'corsair/core';
import type { HookdeckWebhookPayload } from './types';
import { verifyHookdeckWebhookSignature } from './types';

describe('verifyHookdeckWebhookSignature', () => {
	const secret = 'hookdeck-secret';
	const rawBody =
		'{"type":"example","created_at":"2026-01-01T00:00:00.000Z","data":{"id":"evt_1"}}';
	const validSignature = '0Z9gr7R90KjNqsh1CDqVmAEbNp+Cm6dofEcaVrJ+UXE=';
	const validSignature2 = '0Z9gr7R90KjNqsh1CDqVmAEbNp+Cm6dofEcaVrJ+UXE=';

	function makeRequest(
		overrides: Partial<WebhookRequest<HookdeckWebhookPayload>> = {},
	): WebhookRequest<HookdeckWebhookPayload> {
		return {
			payload: {
				type: 'example',
				created_at: '2026-01-01T00:00:00.000Z',
				data: { id: 'evt_1' },
			},
			headers: {
				'x-hookdeck-signature': validSignature,
			},
			rawBody,
			...overrides,
		};
	}

	it('accepts valid primary signature', () => {
		const result = verifyHookdeckWebhookSignature(makeRequest(), secret);
		expect(result).toEqual({ valid: true });
	});

	it('accepts valid fallback signature when primary is invalid', () => {
		const result = verifyHookdeckWebhookSignature(
			makeRequest({
				headers: {
					'x-hookdeck-signature': 'invalid',
					'x-hookdeck-signature-2': validSignature2,
				},
			}),
			secret,
		);
		expect(result).toEqual({ valid: true });
	});

	it('returns invalid when both signatures are missing', () => {
		const result = verifyHookdeckWebhookSignature(
			makeRequest({ headers: {} }),
			secret,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-hookdeck-signature or x-hookdeck-signature-2 header',
		});
	});

	it('returns invalid when signature does not match', () => {
		const result = verifyHookdeckWebhookSignature(
			makeRequest({
				headers: {
					'x-hookdeck-signature': 'invalid',
				},
			}),
			secret,
		);
		expect(result).toEqual({ valid: false, error: 'Invalid signature' });
	});

	it('returns invalid without secret unless already hub verified', () => {
		const result = verifyHookdeckWebhookSignature(makeRequest(), '');
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('accepts hub-verified requests without plugin verification', () => {
		const result = verifyHookdeckWebhookSignature(
			makeRequest({ hubVerified: true, headers: {} }),
			'',
		);
		expect(result).toEqual({ valid: true });
	});
});
