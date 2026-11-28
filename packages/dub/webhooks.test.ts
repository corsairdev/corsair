import { createHmac } from 'node:crypto';
import { dubWebhooksNested, isDubDelivery, verifyDubWebhook } from './webhooks';
import { DUB_WEBHOOK_EVENTS } from './webhooks/events-generated';

const SECRET = 'whsec_dub_test_secret';

function sign(body: string, secret = SECRET): string {
	return createHmac('sha256', secret).update(body).digest('hex');
}

// Shaped like Dub's LinkClickedEvent schema, personal fields made up.
const clicked = {
	id: 'evt_1',
	event: 'link.clicked',
	createdAt: '2026-11-28T10:00:00.000Z',
	data: {
		click: { id: 'click_1', country: 'US' },
		link: { id: 'link_1', domain: 'dub.sh', key: 'abc' },
		newField: true,
	},
};

function delivery(payload: object, signature?: string | null) {
	const rawBody = JSON.stringify(payload);
	const value = signature === undefined ? sign(rawBody) : signature;
	return {
		payload,
		rawBody,
		headers: value === null ? {} : { 'dub-signature': value },
	};
}

const ctx = { key: SECRET } as never;

describe('verifyDubWebhook', () => {
	it('accepts the hex HMAC-SHA256 of the raw body', () => {
		expect(verifyDubWebhook(delivery(clicked), SECRET)).toEqual({
			valid: true,
		});
	});

	it('rejects another secret, a changed body and a missing header', () => {
		expect(verifyDubWebhook(delivery(clicked, sign('{}')), SECRET).valid).toBe(
			false,
		);
		const changed = { ...delivery(clicked), rawBody: '{"event":"x"}' };
		expect(verifyDubWebhook(changed, SECRET).valid).toBe(false);
		expect(verifyDubWebhook(delivery(clicked, null), SECRET).valid).toBe(false);
		expect(verifyDubWebhook(delivery(clicked), 'whsec_other').valid).toBe(
			false,
		);
	});

	it('needs a secret and the raw body, unless the Hub verified it', () => {
		expect(verifyDubWebhook(delivery(clicked), undefined).valid).toBe(false);
		expect(
			verifyDubWebhook({ payload: clicked, headers: {} }, SECRET).valid,
		).toBe(false);
		expect(
			verifyDubWebhook(
				{ payload: clicked, headers: {}, hubVerified: true },
				undefined,
			),
		).toEqual({ valid: true });
	});
});

describe('matching', () => {
	it('has one webhook per event in the spec', () => {
		const handled = Object.values(dubWebhooksNested).flatMap((group) =>
			Object.values(group),
		);
		expect(handled).toHaveLength(DUB_WEBHOOK_EVENTS.length);
		for (const event of DUB_WEBHOOK_EVENTS) {
			const body = { ...clicked, event };
			expect(
				handled.filter((hook) => hook.match({ headers: {}, body })),
			).toHaveLength(1);
		}
	});

	it('claims a delivery only with Dub-Signature and a known event', () => {
		const headers = { 'dub-signature': 'abc' };
		expect(isDubDelivery({ headers, body: clicked })).toBe(true);
		expect(isDubDelivery({ headers, body: JSON.stringify(clicked) })).toBe(
			true,
		);
		expect(isDubDelivery({ headers: {}, body: clicked })).toBe(false);
		expect(isDubDelivery({ headers, body: { event: 'push' } })).toBe(false);
	});
});

describe('handler', () => {
	beforeEach(() => {
		jest.spyOn(console, 'log').mockImplementation(() => undefined);
	});
	afterEach(() => jest.restoreAllMocks());

	it('returns the parsed delivery and keeps unknown fields', async () => {
		const result = await dubWebhooksNested.link.clicked.handler(
			ctx,
			delivery(clicked) as never,
		);
		expect(result.success).toBe(true);
		if (!result.success) throw new Error(result.error);
		expect(result.data?.id).toBe('evt_1');
		expect((result.data?.data as Record<string, unknown>).newField).toBe(true);
	});

	it('answers 401 for a bad signature', async () => {
		const result = await dubWebhooksNested.link.clicked.handler(
			ctx,
			delivery(clicked, 'deadbeef') as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('answers 400 for a payload without the envelope, naming paths only', async () => {
		const bad = { event: 'link.clicked', data: { email: 'a@example.com' } };
		const result = await dubWebhooksNested.link.clicked.handler(
			ctx,
			delivery(bad) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
		if (result.success) throw new Error('expected failure');
		expect(result.error).toContain('id');
		expect(result.error).not.toContain('a@example.com');
	});
});
