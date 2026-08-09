import type { WebhookRequest } from 'corsair/core';
import type { OutlookChangeNotification, OutlookWebhookPayload } from './types';
import { verifyOutlookWebhookSignature } from './types';

const CLIENT_STATE = 'outlook-client-state';

function notification(
	overrides: Partial<OutlookChangeNotification> = {},
): OutlookChangeNotification {
	return {
		clientState: CLIENT_STATE,
		changeType: 'created',
		resource: "users('u1')/messages('m1')",
		resourceData: { id: 'm1' },
		...overrides,
	} as OutlookChangeNotification;
}

function makeRequest(payload: unknown): WebhookRequest<OutlookWebhookPayload> {
	return {
		payload,
		rawBody: JSON.stringify(payload),
		headers: {},
	} as unknown as WebhookRequest<OutlookWebhookPayload>;
}

describe('verifyOutlookWebhookSignature', () => {
	it('should fail closed when the client state is missing', () => {
		const result = verifyOutlookWebhookSignature(
			makeRequest({ value: [notification()] }),
			'',
		);
		expect(result).toEqual({ valid: false, error: 'Missing client state' });
	});

	it('should reject an empty value array', () => {
		// The regression: [].every(...) is true, so a request carrying no
		// notification -- and therefore no clientState at all -- was reported as
		// verified.
		const result = verifyOutlookWebhookSignature(
			makeRequest({ value: [] }),
			CLIENT_STATE,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid payload: missing value array',
		});
	});

	it('should reject a payload with no value key', () => {
		const result = verifyOutlookWebhookSignature(makeRequest({}), CLIENT_STATE);
		expect(result.valid).toBe(false);
	});

	it('should reject when the client state does not match', () => {
		const result = verifyOutlookWebhookSignature(
			makeRequest({ value: [notification({ clientState: 'wrong' })] }),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('should reject a batch where a later notification is forged', () => {
		const result = verifyOutlookWebhookSignature(
			makeRequest({
				value: [notification(), notification({ clientState: 'forged' })],
			}),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('should reject a notification with no client state of its own', () => {
		const result = verifyOutlookWebhookSignature(
			makeRequest({ value: [notification({ clientState: undefined })] }),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('should accept when every notification carries the expected client state', () => {
		const result = verifyOutlookWebhookSignature(
			makeRequest({
				value: [notification(), notification({ resourceData: { id: 'm2' } })],
			}),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: true });
	});
});
