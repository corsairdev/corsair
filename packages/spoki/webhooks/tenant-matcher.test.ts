import { describe, expect, it } from '@jest/globals';
import crypto from 'crypto';
import {
	matchSpokiPluginWebhook,
	matchSpokiTenantWebhook,
	verifySpokiWebhookSignature,
} from './tenant-matcher';

const SECRET = 'whsec_test_secret';

function sign(rawBody: string, timestamp: number, secret = SECRET): string {
	const signature = crypto
		.createHmac('sha256', secret)
		.update(`${timestamp}.${rawBody}`)
		.digest('hex');
	return `t=${timestamp},v2=${signature}`;
}

const RAW_BODY = JSON.stringify({
	version: 1,
	event: 'message.inbound',
	data: { text: 'Thanks' },
});

describe('verifySpokiWebhookSignature', () => {
	it('accepts a valid V2 signature', () => {
		const header = sign(RAW_BODY, Math.floor(Date.now() / 1000));
		expect(verifySpokiWebhookSignature(RAW_BODY, header, SECRET)).toBe(true);
	});

	it('rejects a signature computed with a different secret', () => {
		const header = sign(RAW_BODY, Math.floor(Date.now() / 1000), 'whsec_other');
		expect(verifySpokiWebhookSignature(RAW_BODY, header, SECRET)).toBe(false);
	});

	it('rejects a signature over a tampered body', () => {
		const header = sign(RAW_BODY, Math.floor(Date.now() / 1000));
		expect(
			verifySpokiWebhookSignature(
				JSON.stringify({ version: 1, event: 'spoofed' }),
				header,
				SECRET,
			),
		).toBe(false);
	});

	it('rejects signatures outside the tolerance window', () => {
		const stale = Math.floor(Date.now() / 1000) - 3600;
		expect(
			verifySpokiWebhookSignature(RAW_BODY, sign(RAW_BODY, stale), SECRET),
		).toBe(false);
	});

	it('rejects malformed signature headers', () => {
		expect(verifySpokiWebhookSignature(RAW_BODY, 'v2=deadbeef', SECRET)).toBe(
			false,
		);
		expect(verifySpokiWebhookSignature(RAW_BODY, 'garbage', SECRET)).toBe(
			false,
		);
	});
});

describe('matchSpokiPluginWebhook', () => {
	it('returns false when no webhook secret is configured', () => {
		expect(
			matchSpokiPluginWebhook(
				{
					headers: {
						'x-spoki-account': '13128334',
						'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
					},
					body: RAW_BODY,
				},
				undefined,
			),
		).toBe(false);
	});

	it('matches a delivery with a valid V2 signature when a secret is set', () => {
		expect(
			matchSpokiPluginWebhook(
				{
					headers: {
						'x-spoki-account': '13128334',
						'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
					},
					body: RAW_BODY,
				},
				SECRET,
			),
		).toBe(true);
	});

	it('returns false for an invalid signature when a secret is set', () => {
		expect(
			matchSpokiPluginWebhook(
				{
					headers: {
						'x-spoki-account': '13128334',
						'x-spoki-signature': 't=123,v2=deadbeef',
					},
					body: RAW_BODY,
				},
				SECRET,
			),
		).toBe(false);
	});

	it('does not match the deprecated V1 hash header alone', () => {
		expect(
			matchSpokiPluginWebhook(
				{
					headers: { 'X-SPOKI-HASH': 'a1b2c3' },
					body: RAW_BODY,
				},
				SECRET,
			),
		).toBe(false);
	});

	it('ignores foreign webhooks', () => {
		expect(
			matchSpokiPluginWebhook(
				{
					headers: { 'x-github-event': 'push' },
					body: '{}',
				},
				SECRET,
			),
		).toBe(false);
		expect(matchSpokiPluginWebhook({ headers: {}, body: '{}' }, SECRET)).toBe(
			false,
		);
	});
});

describe('matchSpokiTenantWebhook', () => {
	it('returns null when no webhook secret is configured', () => {
		expect(
			matchSpokiTenantWebhook(
				{
					headers: {
						'x-spoki-account': '13128334',
						'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
					},
					body: RAW_BODY,
				},
				undefined,
			),
		).toBeNull();
	});

	it('returns null when the account header is missing', () => {
		expect(
			matchSpokiTenantWebhook({ headers: {}, body: RAW_BODY }, SECRET),
		).toBeNull();
	});

	it('accepts a correctly signed delivery when a webhook secret is set', () => {
		expect(
			matchSpokiTenantWebhook(
				{
					headers: {
						'x-spoki-account': '13128334',
						'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
					},
					body: RAW_BODY,
				},
				SECRET,
			),
		).toEqual({
			linkType: 'spoki_account',
			externalId: '13128334',
		});
	});

	it('rejects a spoofed delivery with an invalid signature', () => {
		expect(
			matchSpokiTenantWebhook(
				{
					headers: {
						'x-spoki-account': '13128334',
						'x-spoki-signature': 't=123,v2=deadbeef',
					},
					body: RAW_BODY,
				},
				SECRET,
			),
		).toBeNull();
	});

	it('rejects unsigned deliveries when a webhook secret is set', () => {
		expect(
			matchSpokiTenantWebhook(
				{
					headers: { 'x-spoki-account': '13128334' },
					body: RAW_BODY,
				},
				SECRET,
			),
		).toBeNull();
	});

	it('rejects deliveries with a parsed body that cannot be signature-verified', () => {
		expect(
			matchSpokiTenantWebhook(
				{
					headers: {
						'x-spoki-account': '13128334',
						'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
					},
					body: JSON.parse(RAW_BODY),
				},
				SECRET,
			),
		).toBeNull();
	});

	it('accepts a valid V2 signature over a Buffer body', () => {
		expect(
			matchSpokiTenantWebhook(
				{
					headers: {
						'x-spoki-account': '13128334',
						'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
					},
					body: Buffer.from(RAW_BODY, 'utf8'),
				},
				SECRET,
			),
		).toEqual({
			linkType: 'spoki_account',
			externalId: '13128334',
		});
	});

	it('rejects a tampered Buffer body', () => {
		expect(
			matchSpokiTenantWebhook(
				{
					headers: {
						'x-spoki-account': '13128334',
						'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
					},
					body: Buffer.from(
						JSON.stringify({ version: 1, event: 'spoofed' }),
						'utf8',
					),
				},
				SECRET,
			),
		).toBeNull();
	});
});
