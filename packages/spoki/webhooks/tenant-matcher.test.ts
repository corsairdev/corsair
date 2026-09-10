import { describe, expect, it } from '@jest/globals';
import crypto from 'crypto';
import {
	matchSpokiPluginWebhook,
	matchSpokiTenantWebhook,
	verifySpokiWebhookRequest,
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

	it('routes parsed bodies on header presence; the handler verifies', () => {
		expect(
			matchSpokiPluginWebhook(
				{
					headers: {
						'x-spoki-account': '13128334',
						'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
					},
					body: JSON.parse(RAW_BODY),
				},
				SECRET,
			),
		).toBe(true);
	});

	it('routes on header presence even with a bad signature; the handler 401s', () => {
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
		).toBe(true);
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
	// The account header travels outside Spoki's signature envelope, so no
	// tenant read from a delivery can be authenticated. The matcher claims
	// nothing; authenticity is enforced by the webhook handler instead.
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

	it('claims no tenant even for a fully valid signed delivery', () => {
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
		).toBeNull();
	});

	it('ignores a replayed delivery with a swapped account header', () => {
		expect(
			matchSpokiTenantWebhook(
				{
					headers: {
						'x-spoki-account': '999',
						'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
					},
					body: RAW_BODY,
				},
				SECRET,
			),
		).toBeNull();
	});

	it('claims no tenant for parsed bodies either', () => {
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

	it('rejects forged parsed-body deliveries with a fake signature', () => {
		expect(
			matchSpokiTenantWebhook(
				{
					headers: {
						'x-spoki-account': '999',
						'x-spoki-signature': 't=9999999999,v2=fake',
					},
					body: { version: 1 },
				},
				SECRET,
			),
		).toBeNull();
	});

	it('claims no tenant over a Buffer body either', () => {
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
		).toBeNull();
	});
});

describe('verifySpokiWebhookRequest', () => {
	it('accepts a valid V2 signature with rawBody', () => {
		const header = sign(RAW_BODY, Math.floor(Date.now() / 1000));
		expect(
			verifySpokiWebhookRequest(
				{
					payload: JSON.parse(RAW_BODY),
					headers: { 'x-spoki-signature': header },
					rawBody: RAW_BODY,
				},
				SECRET,
			),
		).toEqual({ valid: true });
	});

	it('rejects a tampered rawBody', () => {
		const header = sign(RAW_BODY, Math.floor(Date.now() / 1000));
		expect(
			verifySpokiWebhookRequest(
				{
					payload: { version: 1, event: 'spoofed' },
					headers: { 'x-spoki-signature': header },
					rawBody: JSON.stringify({ version: 1, event: 'spoofed' }),
				},
				SECRET,
			).valid,
		).toBe(false);
	});

	it('verifies over the re-serialized payload when rawBody is missing', () => {
		const header = sign(RAW_BODY, Math.floor(Date.now() / 1000));
		expect(
			verifySpokiWebhookRequest(
				{
					payload: JSON.parse(RAW_BODY),
					headers: { 'x-spoki-signature': header },
				},
				SECRET,
			),
		).toEqual({ valid: true });
	});

	it('verifies a trailing-newline body via the payload fallback', () => {
		const withNewline = `${RAW_BODY}\n`;
		const header = sign(withNewline, Math.floor(Date.now() / 1000));
		expect(
			verifySpokiWebhookRequest(
				{
					payload: JSON.parse(RAW_BODY),
					headers: { 'x-spoki-signature': header },
				},
				SECRET,
			),
		).toEqual({ valid: true });
	});

	it('still rejects when the original bytes cannot be reconstructed', () => {
		const pretty = JSON.stringify(JSON.parse(RAW_BODY), null, 2);
		const header = sign(pretty, Math.floor(Date.now() / 1000));
		expect(
			verifySpokiWebhookRequest(
				{
					payload: JSON.parse(RAW_BODY),
					headers: { 'x-spoki-signature': header },
				},
				SECRET,
			).valid,
		).toBe(false);
	});

	it('accepts hubVerified deliveries without re-verifying', () => {
		expect(
			verifySpokiWebhookRequest(
				{
					payload: {},
					headers: {},
					hubVerified: true,
				},
				undefined,
			),
		).toEqual({ valid: true });
	});
});
