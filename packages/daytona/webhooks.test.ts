import { createHmac } from 'node:crypto';
import type { DaytonaContext } from './index';
import type { DaytonaEvent } from './webhooks';
import {
	daytonaEventTypeOf,
	daytonaWebhooksNested,
	isDaytonaDelivery,
	verifyDaytonaWebhook,
} from './webhooks';

const RAW_KEY = Buffer.from('0123456789abcdef0123456789abcdef');
const SECRET = `whsec_${RAW_KEY.toString('base64')}`;

function delivery(
	body: DaytonaEvent,
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
			'svix-id': id,
			'svix-timestamp': String(at),
			'svix-signature': `v1,${signature}`,
		} as Record<string, string>,
	};
}

function ctx(key = SECRET): DaytonaContext {
	return {
		key,
		$getAccountId: () => Promise.resolve('acct'),
		db: {},
		options: {},
		// `unknown` because a test context fills only the fields the handlers read.
	} as unknown as DaytonaContext;
}

const SUSPENDED: DaytonaEvent = {
	event: 'sandbox.state.updated',
	timestamp: '2025-12-19T10:30:00.000Z',
	id: 'sandbox123',
	organizationId: 'org123',
	oldState: 'started',
	newState: 'stopped',
	updatedAt: '2025-12-19T10:30:00.000Z',
};

describe('signatures', () => {
	it('checks a Svix signature keyed with the decoded secret', () => {
		expect(verifyDaytonaWebhook(delivery(SUSPENDED), SECRET)).toEqual({
			valid: true,
		});
		expect(
			verifyDaytonaWebhook(
				delivery(SUSPENDED, undefined, Buffer.from('other')),
				SECRET,
			).valid,
		).toBe(false);
	});

	it('accepts either signature after a rotation', () => {
		const request = delivery(SUSPENDED);
		request.headers['svix-signature'] =
			`v1,b2xkc2lnbmF0dXJl ${request.headers['svix-signature']}`;
		expect(verifyDaytonaWebhook(request, SECRET).valid).toBe(true);
	});

	it('refuses an old timestamp, missing headers and a missing secret', () => {
		const old = Math.floor(Date.now() / 1000) - 600;
		expect(verifyDaytonaWebhook(delivery(SUSPENDED, old), SECRET)).toEqual({
			valid: false,
			error: 'svix-timestamp is too old',
		});
		const request = delivery(SUSPENDED);
		expect(
			verifyDaytonaWebhook({ ...request, headers: {} }, SECRET).valid,
		).toBe(false);
		expect(verifyDaytonaWebhook(request, '').valid).toBe(false);
		expect(
			verifyDaytonaWebhook({ ...request, rawBody: undefined }, SECRET).valid,
		).toBe(false);
	});

	it('trusts a delivery the Hub already verified', () => {
		expect(
			verifyDaytonaWebhook({ payload: {}, headers: {}, hubVerified: true }, ''),
		).toEqual({ valid: true });
	});
});

describe('matching', () => {
	const headers = { 'svix-id': 'msg_1', 'svix-signature': 'v1,x' };

	it('routes by the body type, raw or parsed', () => {
		expect(daytonaEventTypeOf({ headers, body: SUSPENDED })).toBe(
			'sandbox.state.updated',
		);
		expect(
			daytonaEventTypeOf({ headers, body: JSON.stringify(SUSPENDED) }),
		).toBe('sandbox.state.updated');
		expect(
			daytonaWebhooksNested.sandbox.stateUpdated.match({
				headers,
				body: SUSPENDED,
			}),
		).toBe(true);
		expect(
			daytonaWebhooksNested.sandbox.created.match({
				headers,
				body: SUSPENDED,
			}),
		).toBe(false);
	});

	it('ignores unsigned bodies and events Daytona does not send', () => {
		expect(
			isDaytonaDelivery({
				headers: { 'webhook-id': 'x', 'webhook-signature': 'v1,x' },
				body: SUSPENDED,
			}),
		).toBe(true);
		expect(isDaytonaDelivery({ headers: {}, body: SUSPENDED })).toBe(false);
		expect(
			isDaytonaDelivery({
				headers,
				body: { ...SUSPENDED, event: 'agent.error' },
			}),
		).toBe(false);
	});
});

describe('handlers', () => {
	it('returns a verified event', async () => {
		const out = await daytonaWebhooksNested.sandbox.stateUpdated.handler(
			ctx(),
			delivery(SUSPENDED),
		);
		expect(out).toEqual({ success: true, data: SUSPENDED });
	});

	it('refuses a bad signature with 401 and a malformed payload with 400', async () => {
		expect(
			await daytonaWebhooksNested.sandbox.stateUpdated.handler(
				ctx(`whsec_${Buffer.from('wrong').toString('base64')}`),
				delivery(SUSPENDED),
			),
		).toEqual(expect.objectContaining({ success: false, statusCode: 401 }));
		// `unknown` cast: the case sends a payload of the wrong shape on purpose.
		const bad = { ...SUSPENDED, event: 7 } as unknown as DaytonaEvent;
		expect(
			await daytonaWebhooksNested.sandbox.stateUpdated.handler(
				ctx(),
				delivery(bad),
			),
		).toEqual(expect.objectContaining({ success: false, statusCode: 400 }));
	});
});
