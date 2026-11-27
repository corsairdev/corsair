import { createHmac } from 'node:crypto';
import type { MaritimeContext } from './index';
import type { MaritimeAccountEvent, MaritimeSandboxEvent } from './webhooks';
import {
	isMaritimeDelivery,
	maritimeEventTypeOf,
	maritimeWebhooksNested,
	verifyMaritimeWebhook,
} from './webhooks';

const SECRET = 'whsec_test';

function accountDelivery(
	event: string,
	body: MaritimeAccountEvent,
	secret = SECRET,
) {
	const raw = JSON.stringify(body);
	return {
		payload: body,
		rawBody: raw,
		headers: {
			'x-maritime-event': event,
			'x-maritime-delivery': 'dlv_1',
			'x-maritime-signature': `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`,
		},
	};
}

function sandboxDelivery(
	body: MaritimeSandboxEvent,
	at = Math.floor(Date.now() / 1000),
	secret = SECRET,
) {
	const raw = JSON.stringify(body);
	const v1 = createHmac('sha256', secret).update(`${at}.${raw}`).digest('hex');
	return {
		payload: body,
		rawBody: raw,
		headers: { 'maritime-signature': `t=${at},v1=${v1}` },
	};
}

function ctx(key = SECRET): MaritimeContext {
	return {
		key,
		$getAccountId: () => Promise.resolve('acct'),
		db: {},
		options: {},
		// `unknown` because a test context fills only the fields the handlers read.
	} as unknown as MaritimeContext;
}

const AGENT_ERROR = {
	event: 'agent.error',
	agent_id: 'ag_1',
	external_id: 'customer-481',
	end_user: null,
	timestamp: '2026-11-27T04:00:00Z',
	data: { failure_kind: 'build' },
};

const SANDBOX_ENDED = {
	id: 'evt_1',
	type: 'sandbox.ended',
	createdAt: '2026-11-27T04:00:00Z',
	sandboxId: 'sbx-1',
	endUser: null,
	data: { reason: 'idle' },
};

describe('signatures', () => {
	it('checks an account event signature (sha256=<hex> of the raw body)', () => {
		expect(
			verifyMaritimeWebhook(
				accountDelivery('agent.error', AGENT_ERROR),
				SECRET,
			),
		).toEqual({ valid: true });
		expect(
			verifyMaritimeWebhook(
				accountDelivery('agent.error', AGENT_ERROR, 'other'),
				SECRET,
			).valid,
		).toBe(false);
	});

	it('checks a virtual machine event signature and its timestamp', () => {
		expect(
			verifyMaritimeWebhook(sandboxDelivery(SANDBOX_ENDED), SECRET),
		).toEqual({ valid: true });
		const old = Math.floor(Date.now() / 1000) - 600;
		expect(
			verifyMaritimeWebhook(sandboxDelivery(SANDBOX_ENDED, old), SECRET),
		).toEqual({
			valid: false,
			error: 'Maritime-Signature timestamp is too old',
		});
		expect(
			verifyMaritimeWebhook(
				sandboxDelivery(SANDBOX_ENDED, undefined, 'other'),
				SECRET,
			).valid,
		).toBe(false);
	});

	it('fails closed without a secret, a body or a signature', () => {
		const delivery = accountDelivery('agent.error', AGENT_ERROR);
		expect(verifyMaritimeWebhook(delivery, '').valid).toBe(false);
		expect(
			verifyMaritimeWebhook({ ...delivery, rawBody: undefined }, SECRET).valid,
		).toBe(false);
		expect(
			verifyMaritimeWebhook({ ...delivery, headers: {} }, SECRET).valid,
		).toBe(false);
		expect(
			verifyMaritimeWebhook(
				{ ...delivery, headers: { 'x-maritime-signature': 'md5=abc' } },
				SECRET,
			).valid,
		).toBe(false);
	});

	it('trusts a delivery the Hub already verified', () => {
		expect(
			verifyMaritimeWebhook(
				{ payload: {}, headers: {}, hubVerified: true },
				'',
			),
		).toEqual({ valid: true });
	});
});

describe('matching', () => {
	it('routes an account event by X-Maritime-Event', () => {
		const request = {
			headers: { 'x-maritime-event': 'exec.finished' },
			body: {},
		};
		expect(maritimeEventTypeOf(request)).toBe('exec.finished');
		expect(maritimeWebhooksNested.exec.finished.match(request)).toBe(true);
		expect(maritimeWebhooksNested.agent.error.match(request)).toBe(false);
	});

	it('routes a virtual machine event by its body type, raw or parsed', () => {
		const signed = { headers: { 'maritime-signature': 't=1,v1=x' } };
		expect(
			maritimeEventTypeOf({ ...signed, body: JSON.stringify(SANDBOX_ENDED) }),
		).toBe('sandbox.ended');
		expect(maritimeEventTypeOf({ ...signed, body: SANDBOX_ENDED })).toBe(
			'sandbox.ended',
		);
	});

	it('ignores deliveries that are not Maritime events', () => {
		expect(isMaritimeDelivery({ headers: {}, body: SANDBOX_ENDED })).toBe(
			false,
		);
		expect(
			isMaritimeDelivery({
				headers: { 'x-maritime-event': 'sandbox.ended' },
				body: {},
			}),
		).toBe(false);
		expect(
			isMaritimeDelivery({ headers: { 'x-github-event': 'push' }, body: {} }),
		).toBe(false);
	});
});

describe('handlers', () => {
	it('returns a verified account event', async () => {
		const out = await maritimeWebhooksNested.agent.error.handler(
			ctx(),
			accountDelivery('agent.error', AGENT_ERROR),
		);
		expect(out).toEqual({ success: true, data: AGENT_ERROR });
	});

	it('returns a verified virtual machine event', async () => {
		const out = await maritimeWebhooksNested.sandbox.ended.handler(
			ctx(),
			sandboxDelivery(SANDBOX_ENDED),
		);
		expect(out).toEqual({ success: true, data: SANDBOX_ENDED });
	});

	it('refuses a delivery whose header names another event than its signed body', async () => {
		const out = await maritimeWebhooksNested.agent.deployed.handler(
			ctx(),
			accountDelivery('agent.deployed', AGENT_ERROR),
		);
		expect(out).toEqual(
			expect.objectContaining({ success: false, statusCode: 400 }),
		);
	});

	it('refuses a bad signature with 401 and a malformed payload with 400', async () => {
		expect(
			await maritimeWebhooksNested.agent.error.handler(
				ctx('wrong'),
				accountDelivery('agent.error', AGENT_ERROR),
			),
		).toEqual(expect.objectContaining({ success: false, statusCode: 401 }));
		// `unknown` cast: the case sends a payload of the wrong shape on purpose.
		const bad = { ...SANDBOX_ENDED, id: 7 } as unknown as MaritimeSandboxEvent;
		expect(
			await maritimeWebhooksNested.sandbox.ended.handler(
				ctx(),
				sandboxDelivery(bad),
			),
		).toEqual(expect.objectContaining({ success: false, statusCode: 400 }));
	});
});
