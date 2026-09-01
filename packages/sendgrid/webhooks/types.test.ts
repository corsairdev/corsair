import crypto from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { matchSendGridTenantWebhook } from './tenant-matcher';
import { createSendGridMatch, verifySendGridWebhookSignature } from './types';

describe('SendGrid Webhooks', () => {
	it('matches any valid SendGrid email event payload array', () => {
		const matcher = createSendGridMatch();
		const request: RawWebhookRequest = {
			body: JSON.stringify([
				{ email: 'test@example.com', event: 'bounce', timestamp: 123456789 },
			]),
			headers: {},
		};
		expect(matcher(request)).toBe(true);
	});

	it('extracts tenant_external_id from SendGrid array body in tenant matcher', () => {
		const request: RawWebhookRequest = {
			body: JSON.stringify([
				{
					email: 'test@example.com',
					event: 'delivered',
					tenant_external_id: 'tenant-123',
				},
			]),
			headers: {},
		};
		const match = matchSendGridTenantWebhook(request);
		expect(match).not.toBeNull();
		expect(match?.externalId).toBe('tenant-123');
	});

	it('returns null when tenant_external_id is not present', () => {
		const request: RawWebhookRequest = {
			body: JSON.stringify([{ email: 'test@example.com', event: 'delivered' }]),
			headers: {},
		};
		const match = matchSendGridTenantWebhook(request);
		expect(match).toBeNull();
	});

	it('verifies signature when secret is provided', () => {
		const keyPair = crypto.generateKeyPairSync('ec', {
			namedCurve: 'prime256v1',
			publicKeyEncoding: { type: 'spki', format: 'pem' },
			privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
		});

		const timestamp = '1600000000';
		const payload = [
			{ email: 'test@example.com', event: 'delivered', timestamp: 1600000000 },
		];
		const rawBody = JSON.stringify(payload);
		const payloadToSign = timestamp + rawBody;

		const signer = crypto.createSign('SHA256');
		signer.update(payloadToSign);
		const signature = signer.sign(keyPair.privateKey, 'base64');

		const webhookReq: WebhookRequest<any> = {
			headers: {
				'x-twilio-email-event-webhook-signature': signature,
				'x-twilio-email-event-webhook-timestamp': timestamp,
			},
			payload,
			rawBody,
		};

		const result = verifySendGridWebhookSignature(
			webhookReq,
			keyPair.publicKey,
		);
		expect(result.valid).toBe(true);
	});

	it('rejects invalid signature when secret is provided', () => {
		const webhookReq: WebhookRequest<any> = {
			headers: {
				'x-twilio-email-event-webhook-signature': 'invalid_sig',
				'x-twilio-email-event-webhook-timestamp': '1600000000',
			},
			payload: [],
			rawBody: '[]',
		};

		const result = verifySendGridWebhookSignature(webhookReq, 'some_key');
		expect(result.valid).toBe(false);
	});
});
