import type { WebhookRequest } from 'corsair/core';
import type { OutlookWebhookPayload } from './types';
import { verifyOutlookWebhookSignature } from './types';

// Regression for #683: verifyOutlookWebhookSignature compared clientState with
// `===`, which is not constant-time. The comparison now uses timingSafeEqual
// after a length check, while preserving the valid/invalid outcomes.

function requestWith(
	...clientStates: (string | undefined)[]
): WebhookRequest<OutlookWebhookPayload> {
	return {
		payload: { value: clientStates.map((clientState) => ({ clientState })) },
		headers: {},
	};
}

describe('verifyOutlookWebhookSignature', () => {
	it('accepts a matching clientState', () => {
		const result = verifyOutlookWebhookSignature(
			requestWith('secret-state'),
			'secret-state',
		);
		expect(result).toEqual({ valid: true });
	});

	it('accepts when every notification matches', () => {
		const result = verifyOutlookWebhookSignature(
			requestWith('secret-state', 'secret-state'),
			'secret-state',
		);
		expect(result).toEqual({ valid: true });
	});

	it('rejects a mismatched clientState of equal length', () => {
		const result = verifyOutlookWebhookSignature(
			requestWith('wrong-secret1'),
			'secret-state1',
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('rejects a clientState of a different length', () => {
		const result = verifyOutlookWebhookSignature(
			requestWith('short'),
			'secret-state',
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('rejects when any notification does not match', () => {
		const result = verifyOutlookWebhookSignature(
			requestWith('secret-state', 'other-state1'),
			'secret-state',
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('rejects a missing clientState', () => {
		const result = verifyOutlookWebhookSignature(
			requestWith(undefined),
			'secret-state',
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('errors when the expected clientState is empty', () => {
		const result = verifyOutlookWebhookSignature(requestWith('anything'), '');
		expect(result).toEqual({ valid: false, error: 'Missing client state' });
	});
});
