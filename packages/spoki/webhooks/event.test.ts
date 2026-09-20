import { describe, expect, it } from '@jest/globals';
import crypto from 'crypto';
import { spokiEvent } from './event';

const SECRET = 'whsec_test_secret';
const RAW_BODY = JSON.stringify({
	version: 1,
	event: 'message.inbound',
	account_id: 13128334,
	data: { text: 'Thanks' },
});

function sign(rawBody: string, timestamp: number): string {
	const signature = crypto
		.createHmac('sha256', SECRET)
		.update(`${timestamp}.${rawBody}`)
		.digest('hex');
	return `t=${timestamp},v2=${signature}`;
}

describe('spokiEvent match', () => {
	it('routes deliveries carrying the Spoki signature header', () => {
		expect(
			spokiEvent.match({
				headers: { 'x-spoki-signature': 't=1,v2=abc' },
				body: {},
			}),
		).toBe(true);
	});

	it('ignores foreign webhooks', () => {
		expect(
			spokiEvent.match({ headers: { 'x-github-event': 'push' }, body: {} }),
		).toBe(false);
	});
});

describe('spokiEvent handler', () => {
	it('accepts a valid signed delivery with rawBody', async () => {
		const header = sign(RAW_BODY, Math.floor(Date.now() / 1000));
		const res = await spokiEvent.handler({ key: SECRET } as never, {
			payload: JSON.parse(RAW_BODY),
			headers: { 'x-spoki-signature': header },
			rawBody: RAW_BODY,
		});
		expect(res.success).toBe(true);
	});

	it('rejects a forged signature with 401', async () => {
		const res = await spokiEvent.handler({ key: SECRET } as never, {
			payload: { version: 1 },
			headers: { 'x-spoki-signature': 't=9999999999,v2=fake' },
			rawBody: RAW_BODY,
		});
		expect(res.success).toBe(false);
		expect(res.statusCode).toBe(401);
	});

	it('accepts a re-serializable payload when rawBody is missing', async () => {
		const header = sign(RAW_BODY, Math.floor(Date.now() / 1000));
		const res = await spokiEvent.handler({ key: SECRET } as never, {
			payload: JSON.parse(RAW_BODY),
			headers: { 'x-spoki-signature': header },
		});
		expect(res.success).toBe(true);
	});

	it('accepts a pretty-printed original via rawBody', async () => {
		const pretty = JSON.stringify(JSON.parse(RAW_BODY), null, 2);
		const header = sign(pretty, Math.floor(Date.now() / 1000));
		const res = await spokiEvent.handler({ key: SECRET } as never, {
			payload: JSON.parse(RAW_BODY),
			headers: { 'x-spoki-signature': header },
			rawBody: pretty,
		});
		expect(res.success).toBe(true);
	});

	it('accepts a tab-indented original via rawBody', async () => {
		const tabbed = JSON.stringify(JSON.parse(RAW_BODY), null, '\t');
		const header = sign(tabbed, Math.floor(Date.now() / 1000));
		const res = await spokiEvent.handler({ key: SECRET } as never, {
			payload: JSON.parse(RAW_BODY),
			headers: { 'x-spoki-signature': header },
			rawBody: tabbed,
		});
		expect(res.success).toBe(true);
	});
});
