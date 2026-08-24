import type { WebhookRequest } from 'corsair/core';
import { createHmac } from 'crypto';
import { matchPDFMonkeyTenantWebhook } from './tenant-matcher';
import {
	createPDFMonkeyMatch,
	matchPDFMonkeyPluginWebhook,
	verifyPDFMonkeyWebhookSignature,
} from './types';

const SECRET_BYTES = Buffer.from('pdfmonkey-test-secret', 'utf8');
const SECRET = `whsec_${SECRET_BYTES.toString('base64')}`;
const SVIX_ID = 'msg_test_1';

const successPayload = {
	document: {
		id: 'doc-1',
		app_id: 'app-1',
		status: 'success',
		download_url: 'https://files.example.com/doc.pdf',
		preview_url: null,
		public_share_link: null,
		created_at: '2026-01-01T00:00:00Z',
		updated_at: '2026-01-01T00:00:00Z',
	},
};

const rawBody = JSON.stringify(successPayload);

function sign(id: string, timestamp: string, body: string, secret = SECRET) {
	const key = Buffer.from(secret.slice('whsec_'.length), 'base64');
	const digest = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${body}`)
		.digest('base64');
	return `v1,${digest}`;
}

function requestWith(
	headers: Record<string, string | string[] | undefined>,
	body: string | null = rawBody,
): WebhookRequest<unknown> {
	return {
		payload: successPayload,
		headers,
		rawBody: body === null ? undefined : body,
	};
}

describe('verifyPDFMonkeyWebhookSignature', () => {
	const timestamp = String(Math.floor(Date.now() / 1000));

	it('rejects a missing secret', () => {
		expect(
			verifyPDFMonkeyWebhookSignature(
				requestWith({
					'svix-id': SVIX_ID,
					'svix-timestamp': timestamp,
					'svix-signature': sign(SVIX_ID, timestamp, rawBody),
				}),
				undefined,
			),
		).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('rejects a missing raw body', () => {
		expect(
			verifyPDFMonkeyWebhookSignature(
				requestWith(
					{
						'svix-id': SVIX_ID,
						'svix-timestamp': timestamp,
						'svix-signature': sign(SVIX_ID, timestamp, rawBody),
					},
					null,
				),
				SECRET,
			),
		).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('rejects missing Svix headers', () => {
		expect(verifyPDFMonkeyWebhookSignature(requestWith({}), SECRET)).toEqual({
			valid: false,
			error: 'Missing svix-id header',
		});
	});

	it('rejects a malformed webhook secret that would decode to an empty key', () => {
		expect(
			verifyPDFMonkeyWebhookSignature(
				requestWith({
					'svix-id': SVIX_ID,
					'svix-timestamp': timestamp,
					'svix-signature': sign(SVIX_ID, timestamp, rawBody),
				}),
				'whsec_!!!!',
			),
		).toEqual({ valid: false, error: 'Malformed webhook secret' });
	});

	it('rejects a stale timestamp', () => {
		const stale = String(Math.floor(Date.now() / 1000) - 10 * 60);
		expect(
			verifyPDFMonkeyWebhookSignature(
				requestWith({
					'svix-id': SVIX_ID,
					'svix-timestamp': stale,
					'svix-signature': sign(SVIX_ID, stale, rawBody),
				}),
				SECRET,
			),
		).toEqual({
			valid: false,
			error: 'Webhook timestamp is too old or invalid',
		});
	});

	it('accepts a correctly signed Svix request', () => {
		expect(
			verifyPDFMonkeyWebhookSignature(
				requestWith({
					'svix-id': SVIX_ID,
					'svix-timestamp': timestamp,
					'svix-signature': sign(SVIX_ID, timestamp, rawBody),
				}),
				SECRET,
			),
		).toEqual({ valid: true });
	});

	it('rejects a signature over the wrong content', () => {
		expect(
			verifyPDFMonkeyWebhookSignature(
				requestWith({
					'svix-id': SVIX_ID,
					'svix-timestamp': timestamp,
					'svix-signature': sign(SVIX_ID, timestamp, '{"tampered":true}'),
				}),
				SECRET,
			),
		).toEqual({ valid: false, error: 'Invalid signature' });
	});
});

describe('PDFMonkey webhook matchers', () => {
	it('plugin matcher accepts Svix document payloads and rejects Resend events', () => {
		expect(
			matchPDFMonkeyPluginWebhook({
				headers: {
					'svix-id': SVIX_ID,
					'svix-timestamp': '1',
					'svix-signature': 'v1,abc',
				},
				body: successPayload,
			}),
		).toBe(true);
		expect(
			matchPDFMonkeyPluginWebhook({
				headers: { 'x-pdfmonkey-signature': 'nope' },
				body: successPayload,
			}),
		).toBe(false);
		expect(
			matchPDFMonkeyPluginWebhook({
				headers: {
					'svix-id': SVIX_ID,
					'svix-timestamp': '1',
					'svix-signature': 'v1,abc',
				},
				body: { type: 'email.sent', data: {} },
			}),
		).toBe(false);
	});

	it('event matcher uses document.status', () => {
		const success = createPDFMonkeyMatch('success');
		const failure = createPDFMonkeyMatch('failure');
		const headers = { 'svix-signature': 'v1,abc' };
		expect(success({ headers, body: successPayload })).toBe(true);
		expect(failure({ headers, body: successPayload })).toBe(false);
		expect(
			failure({
				headers,
				body: {
					document: { ...successPayload.document, status: 'failure' },
				},
			}),
		).toBe(true);
	});

	it('tenant matcher reads document.app_id', () => {
		expect(
			matchPDFMonkeyTenantWebhook({
				headers: {},
				body: successPayload,
			}),
		).toEqual({ linkType: 'tenant_external_id', externalId: 'app-1' });
	});
});
