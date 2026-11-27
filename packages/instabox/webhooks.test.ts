import { createHmac } from 'node:crypto';
import type { InstaboxContext } from './index';
import type { InstaboxEvent } from './webhooks';
import {
	instaboxEventTypeOf,
	instaboxWebhooksNested,
	isInstaboxDelivery,
	verifyInstaboxWebhook,
} from './webhooks';

const RAW_KEY = Buffer.from('0123456789abcdef0123456789abcdef');
const SECRET = `whsec_${RAW_KEY.toString('base64')}`;

function delivery(
	body: InstaboxEvent,
	at = Math.floor(Date.now() / 1000),
	key = RAW_KEY,
	id = 'evt_1',
) {
	const raw = JSON.stringify(body);
	const signature = createHmac('sha256', key)
		.update(`${id}.${at}.${raw}`)
		.digest('base64');
	return {
		payload: body,
		rawBody: raw,
		headers: {
			'webhook-id': id,
			'webhook-timestamp': String(at),
			'webhook-signature': `v1,${signature}`,
		},
	};
}

function ctx(key = SECRET): InstaboxContext {
	return {
		key,
		$getAccountId: () => Promise.resolve('acct'),
		db: {},
		options: {},
		// `unknown` because a test context fills only the fields the handlers read.
	} as unknown as InstaboxContext;
}

const SUSPENDED: InstaboxEvent = {
	id: 'evt_1',
	type: 'sandbox.suspended',
	createdAt: '2026-11-27T04:00:00Z',
	orgId: 'org_1',
	data: {
		sandbox: { id: 'm_1', name: 'worker-1', metadata: {} },
		previousState: 'suspending',
		state: 'suspended',
		reason: 'idle',
		operationId: 'op_1',
	},
};

describe('signatures', () => {
	it('checks a Standard Webhooks signature keyed with the decoded secret', () => {
		expect(verifyInstaboxWebhook(delivery(SUSPENDED), SECRET)).toEqual({
			valid: true,
		});
		expect(
			verifyInstaboxWebhook(
				delivery(SUSPENDED, undefined, Buffer.from('other')),
				SECRET,
			).valid,
		).toBe(false);
	});

	it('accepts either signature after a rotation', () => {
		const request = delivery(SUSPENDED);
		request.headers['webhook-signature'] =
			`v1,b2xkc2lnbmF0dXJl ${request.headers['webhook-signature']}`;
		expect(verifyInstaboxWebhook(request, SECRET).valid).toBe(true);
	});

	it('refuses an old timestamp, missing headers and a missing secret', () => {
		const old = Math.floor(Date.now() / 1000) - 600;
		expect(verifyInstaboxWebhook(delivery(SUSPENDED, old), SECRET)).toEqual({
			valid: false,
			error: 'webhook-timestamp is too old',
		});
		const request = delivery(SUSPENDED);
		expect(
			verifyInstaboxWebhook({ ...request, headers: {} }, SECRET).valid,
		).toBe(false);
		expect(verifyInstaboxWebhook(request, '').valid).toBe(false);
		// A secret that decodes to no bytes would sign with an empty key.
		const forged = delivery(SUSPENDED, undefined, Buffer.alloc(0));
		expect(verifyInstaboxWebhook(forged, 'whsec_')).toEqual({
			valid: false,
			error: 'The InstaBox webhook secret is empty',
		});
		expect(
			verifyInstaboxWebhook({ ...request, rawBody: undefined }, SECRET).valid,
		).toBe(false);
	});

	it('trusts a delivery the Hub already verified', () => {
		expect(
			verifyInstaboxWebhook(
				{ payload: {}, headers: {}, hubVerified: true },
				'',
			),
		).toEqual({ valid: true });
	});
});

describe('matching', () => {
	const headers = { 'webhook-id': 'evt_1', 'webhook-signature': 'v1,x' };

	it('routes by the body type, raw or parsed', () => {
		expect(instaboxEventTypeOf({ headers, body: SUSPENDED })).toBe(
			'sandbox.suspended',
		);
		expect(
			instaboxEventTypeOf({ headers, body: JSON.stringify(SUSPENDED) }),
		).toBe('sandbox.suspended');
		expect(
			instaboxWebhooksNested.sandbox.suspended.match({
				headers,
				body: SUSPENDED,
			}),
		).toBe(true);
		expect(
			instaboxWebhooksNested.sandbox.started.match({
				headers,
				body: SUSPENDED,
			}),
		).toBe(false);
	});

	it('ignores other Standard Webhooks senders and unsigned bodies', () => {
		expect(
			isInstaboxDelivery({ headers, body: { ...SUSPENDED, orgId: undefined } }),
		).toBe(false);
		expect(isInstaboxDelivery({ headers: {}, body: SUSPENDED })).toBe(false);
		expect(
			isInstaboxDelivery({
				headers,
				body: { ...SUSPENDED, type: 'agent.error' },
			}),
		).toBe(false);
	});
});

describe('handlers', () => {
	it('returns a verified event', async () => {
		const out = await instaboxWebhooksNested.sandbox.suspended.handler(
			ctx(),
			delivery(SUSPENDED),
		);
		expect(out).toEqual({ success: true, data: SUSPENDED });
	});

	it('refuses a bad signature with 401 and a malformed payload with 400', async () => {
		expect(
			await instaboxWebhooksNested.sandbox.suspended.handler(
				ctx(`whsec_${Buffer.from('wrong').toString('base64')}`),
				delivery(SUSPENDED),
			),
		).toEqual(expect.objectContaining({ success: false, statusCode: 401 }));
		// `unknown` cast: the case sends a payload of the wrong shape on purpose.
		const bad = { ...SUSPENDED, id: 7 } as unknown as InstaboxEvent;
		expect(
			await instaboxWebhooksNested.sandbox.suspended.handler(
				ctx(),
				delivery(bad),
			),
		).toEqual(expect.objectContaining({ success: false, statusCode: 400 }));
	});
});
