import type { WebhookRequest } from 'corsair/core';
import type {
	SharepointListChangedPayload,
	SharepointWebhookNotification,
} from './types';
import { verifySharepointWebhookSignature } from './types';

// Regression for #706: verifySharepointWebhookSignature compared clientState with
// `===`, which is not constant-time. The comparison now uses timingSafeEqual
// after a byte-length check, while preserving the valid/invalid outcomes.

const CLIENT_STATE = 'secret-state';

function notification(
	clientState?: string | null,
): SharepointWebhookNotification {
	return {
		subscriptionId: 'subscription-1',
		clientState,
		resource: 'sites/contoso/lists/tasks',
		tenantId: 'tenant-1',
		siteUrl: 'https://contoso.sharepoint.com/sites/team',
		webId: 'web-1',
	};
}

function requestWith(
	...notifications: SharepointWebhookNotification[]
): WebhookRequest<SharepointListChangedPayload> {
	return {
		payload: { value: notifications },
		headers: {},
	};
}

describe('verifySharepointWebhookSignature', () => {
	it('accepts a matching clientState', () => {
		const result = verifySharepointWebhookSignature(
			requestWith(notification(CLIENT_STATE)),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: true });
	});

	it('accepts when every notification matches', () => {
		const result = verifySharepointWebhookSignature(
			requestWith(notification(CLIENT_STATE), notification(CLIENT_STATE)),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: true });
	});

	it('rejects a mismatched clientState of equal length', () => {
		const result = verifySharepointWebhookSignature(
			requestWith(notification('wrong-secret1')),
			'secret-state1',
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('rejects a clientState of a different length', () => {
		const result = verifySharepointWebhookSignature(
			requestWith(notification('short')),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('rejects a clientState that matches in UTF-16 length but differs in UTF-8 bytes', () => {
		// 'é' is one UTF-16 code unit but two UTF-8 bytes. A UTF-16 length check
		// would let this reach timingSafeEqual with unequal buffers and throw
		// ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH; the byte-length check rejects it.
		const result = verifySharepointWebhookSignature(
			requestWith(notification('café')),
			'cafe',
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('rejects when any notification does not match', () => {
		const result = verifySharepointWebhookSignature(
			requestWith(notification(CLIENT_STATE), notification('other-state1')),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('rejects a missing clientState', () => {
		const result = verifySharepointWebhookSignature(
			requestWith(notification()),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('errors when the expected clientState is empty', () => {
		const result = verifySharepointWebhookSignature(
			requestWith(notification(CLIENT_STATE)),
			'',
		);
		expect(result).toEqual({ valid: false, error: 'Missing client state' });
	});

	it('errors when the expected clientState is whitespace-only', () => {
		const result = verifySharepointWebhookSignature(
			requestWith(notification(CLIENT_STATE)),
			'   ',
		);
		expect(result).toEqual({ valid: false, error: 'Missing client state' });
	});
});
