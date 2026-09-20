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
	account_id: 13128334,
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
	it('matches a delivery with Spoki signature header', () => {
		expect(
			matchSpokiPluginWebhook({
				headers: {
					'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
				},
				body: RAW_BODY,
			}),
		).toBe(true);
	});

	it('matches a delivery with Spoki account header', () => {
		expect(
			matchSpokiPluginWebhook({
				headers: {
					'x-spoki-account': '13128334',
				},
				body: RAW_BODY,
			}),
		).toBe(true);
	});

	it('ignores foreign webhooks', () => {
		expect(
			matchSpokiPluginWebhook({
				headers: { 'x-github-event': 'push' },
				body: '{}',
			}),
		).toBe(false);
		expect(matchSpokiPluginWebhook({ headers: {}, body: '{}' })).toBe(false);
	});
});

describe('matchSpokiTenantWebhook', () => {
	it('returns null when neither header nor body has an account id', () => {
		expect(
			matchSpokiTenantWebhook({
				headers: {
					'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
				},
				body: { version: 1 },
			}),
		).toBeNull();
	});

	it('matches a delivery using the header account id', () => {
		expect(
			matchSpokiTenantWebhook({
				headers: {
					'x-spoki-account': '13128334',
					'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
				},
				body: RAW_BODY,
			}),
		).toEqual({ linkType: 'account_id', externalId: '13128334' });
	});

	it('matches a delivery using the body account id', () => {
		expect(
			matchSpokiTenantWebhook({
				headers: {
					'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
				},
				body: RAW_BODY,
			}),
		).toEqual({ linkType: 'account_id', externalId: '13128334' });
	});

	it('rejects when body and header account ids differ', () => {
		expect(
			matchSpokiTenantWebhook({
				headers: {
					'x-spoki-account': '999',
					'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
				},
				body: RAW_BODY,
			}),
		).toBeNull();
	});

	it('matches parsed JSON bodies', () => {
		expect(
			matchSpokiTenantWebhook({
				headers: {
					'x-spoki-signature': sign(RAW_BODY, Math.floor(Date.now() / 1000)),
				},
				body: JSON.parse(RAW_BODY),
			}),
		).toEqual({ linkType: 'account_id', externalId: '13128334' });
	});

	it('matches a Buffer body', () => {
		expect(
			matchSpokiTenantWebhook({
				headers: {
					'x-spoki-account': '13128334',
				},
				body: Buffer.from(RAW_BODY, 'utf8'),
			}),
		).toEqual({ linkType: 'account_id', externalId: '13128334' });
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

	it('rejects an invalid signature', () => {
		expect(
			verifySpokiWebhookRequest(
				{
					payload: JSON.parse(RAW_BODY),
					headers: { 'x-spoki-signature': 't=123,v2=deadbeef' },
					rawBody: RAW_BODY,
				},
				SECRET,
			),
		).toEqual({ valid: false, error: 'Invalid signature' });
	});

	it('rejects when secret is missing', () => {
		expect(
			verifySpokiWebhookRequest(
				{
					payload: JSON.parse(RAW_BODY),
					headers: { 'x-spoki-signature': 't=123,v2=deadbeef' },
					rawBody: RAW_BODY,
				},
				undefined,
			),
		).toEqual({ valid: false, error: 'Missing webhook secret' });
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
