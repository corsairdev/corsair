import type { WebhookRequest } from 'corsair/core';
import type { SharepointContext } from '../index';
import { listChanged } from './list-changes';
import type {
	SharepointListChangedPayload,
	SharepointWebhookNotification,
} from './types';
import { verifySharepointWebhookSignature } from './types';

const CLIENT_STATE = 'sharepoint-client-state';

function notification(
	overrides: Partial<SharepointWebhookNotification> = {},
): SharepointWebhookNotification {
	return {
		subscriptionId: 'sub-1',
		clientState: CLIENT_STATE,
		resource: 'sites/contoso/lists/tasks',
		tenantId: 'tenant-1',
		siteUrl: 'https://contoso.sharepoint.com/sites/team',
		webId: 'web-1',
		...overrides,
	};
}

function makeRequest(
	notifications: SharepointWebhookNotification[],
	headers: Record<string, string> = {},
): WebhookRequest<SharepointListChangedPayload> {
	return {
		payload: { value: notifications },
		rawBody: JSON.stringify({ value: notifications }),
		headers,
	} as unknown as WebhookRequest<SharepointListChangedPayload>;
}

function makeCtx(key: string): SharepointContext {
	return { key, db: {} } as unknown as SharepointContext;
}

describe('verifySharepointWebhookSignature', () => {
	it('should fail closed when the client state is missing', () => {
		// The regression: an unset clientState returned { valid: true }, so a
		// Hub-managed subscription accepted forged Graph notifications outright.
		const result = verifySharepointWebhookSignature(
			makeRequest([notification()]),
			'',
		);
		expect(result).toEqual({ valid: false, error: 'Missing client state' });
	});

	it('should reject a payload with no notifications', () => {
		const result = verifySharepointWebhookSignature(
			makeRequest([]),
			CLIENT_STATE,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid payload: missing value array',
		});
	});

	it('should reject when the client state does not match', () => {
		const result = verifySharepointWebhookSignature(
			makeRequest([notification({ clientState: 'wrong' })]),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('should reject a batch where a later notification is forged', () => {
		// Graph batches notifications into one request. Checking only value[0]
		// let a forged entry ride along behind a valid one.
		const result = verifySharepointWebhookSignature(
			makeRequest([notification(), notification({ clientState: 'forged' })]),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('should reject a batch where a later notification has no client state', () => {
		const result = verifySharepointWebhookSignature(
			makeRequest([notification(), notification({ clientState: null })]),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: false, error: 'Client state mismatch' });
	});

	it('should accept when every notification carries the expected client state', () => {
		const result = verifySharepointWebhookSignature(
			makeRequest([notification(), notification({ subscriptionId: 'sub-2' })]),
			CLIENT_STATE,
		);
		expect(result).toEqual({ valid: true });
	});
});

describe('listChanged handler', () => {
	it('rejects a notification with 401 when no client state is configured', async () => {
		const result = await listChanged.handler(
			makeCtx(''),
			makeRequest([notification()]) as never,
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.statusCode).toBe(401);
		}
	});

	it('rejects a forged client state with 401', async () => {
		const result = await listChanged.handler(
			makeCtx(CLIENT_STATE),
			makeRequest([notification({ clientState: 'forged' })]) as never,
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.statusCode).toBe(401);
		}
	});

	it('still answers the Graph validation handshake when no key is stored yet', async () => {
		// The handshake arrives during subscription creation, before
		// set_webhook_signature has run — so it must survive an empty ctx.key.
		const result = await listChanged.handler(
			makeCtx(''),
			makeRequest([], { validationtoken: 'graph-validation-token' }) as never,
		);

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.returnToSender).toEqual({
				validationToken: 'graph-validation-token',
			});
		}
	});

	it('accepts a correctly signed notification', async () => {
		const result = await listChanged.handler(
			makeCtx(CLIENT_STATE),
			makeRequest([notification()]) as never,
		);

		expect(result.success).toBe(true);
	});
});
