import { logEventFromContext } from 'corsair/core';
import {
	commission,
	donation,
	formBody,
	shopOrder,
	subscriptionPayment,
	TOKEN,
	wrongToken,
} from '../test-fixtures';
import { PaymentWebhooks } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

// The handler only reads ctx.key for the token and passes ctx to the logger.
function context(token: string = TOKEN) {
	return { key: token } as never;
}

// unknown: a webhook payload is untyped until the handler's own schema runs.
function request(payload: unknown) {
	return { payload, headers: {} } as never;
}

beforeEach(() => {
	mockLog.mockClear();
});

describe('payment handlers', () => {
	it('handles a donation and logs the amount, never the supporter', async () => {
		const result = await PaymentWebhooks.donation.handler(
			context(),
			request(formBody(donation)),
		);

		expect(result.success).toBe(true);
		expect(result.data).toMatchObject({
			type: 'Donation',
			amount: '5.00',
			currency: 'USD',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'kofi.webhook.Donation',
			{
				type: 'Donation',
				messageId: donation.message_id,
				amount: '5.00',
				currency: 'USD',
				isSubscriptionPayment: false,
			},
		);
	});

	it('handles a subscription payment with its tier', async () => {
		const result = await PaymentWebhooks.subscription.handler(
			context(),
			request(formBody(subscriptionPayment)),
		);

		expect(result.data).toMatchObject({
			type: 'Subscription',
			tier_name: 'Gold Tier',
			is_first_subscription_payment: true,
		});
	});

	it('handles a shop order with its items and shipping', async () => {
		const result = await PaymentWebhooks.shopOrder.handler(
			context(),
			request(formBody(shopOrder)),
		);

		expect(result.data).toMatchObject({
			type: 'Shop Order',
			shop_items: [{ direct_link_code: 'b1e2c3d4e5', quantity: 1 }],
			shipping: { city: 'Anytown', country_code: 'US' },
		});
	});

	it('handles a commission', async () => {
		const result = await PaymentWebhooks.commission.handler(
			context(),
			request(formBody(commission)),
		);

		expect(result.data).toMatchObject({ type: 'Commission', amount: '120.00' });
	});

	it('never logs the supporter’s name, email, address or message', async () => {
		await PaymentWebhooks.shopOrder.handler(
			context(),
			request(formBody(shopOrder)),
		);

		const logged = JSON.stringify(mockLog.mock.calls);
		expect(logged).not.toContain('Pat Buyer');
		expect(logged).not.toContain('pat@example.com');
		expect(logged).not.toContain('123 Example St');
	});

	it('refuses a wrong token with a 401 and logs nothing', async () => {
		const result = await PaymentWebhooks.donation.handler(
			context(),
			request(formBody(wrongToken)),
		);

		expect(result).toMatchObject({
			success: false,
			statusCode: 401,
			error: 'Ko-fi verification_token does not match',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('refuses with a 401 when no token is configured, rather than accepting anything', async () => {
		const result = await PaymentWebhooks.donation.handler(
			context(''),
			request(formBody(donation)),
		);

		expect(result).toMatchObject({ success: false, statusCode: 401 });
		expect(result.error).toContain('cannot be trusted');
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('refuses a body that is not a payment with a 400', async () => {
		const result = await PaymentWebhooks.donation.handler(
			context(),
			request('not-a-body'),
		);

		expect(result).toMatchObject({ success: false, statusCode: 400 });
		expect(result.error).toContain('form-encoded');
	});

	it('refuses a payment with no amount, which the schema requires', async () => {
		const { amount: _amount, ...withoutAmount } = donation;

		const result = await PaymentWebhooks.donation.handler(
			context(),
			request(formBody(withoutAmount)),
		);

		expect(result).toMatchObject({
			success: false,
			statusCode: 400,
			error: 'Invalid Ko-fi Donation payload',
		});
	});

	it('accepts a Hub-verified delivery, for which no key is supplied', async () => {
		const result = await PaymentWebhooks.donation.handler(
			{ key: undefined } as never,
			{ payload: donation, headers: {}, hubVerified: true } as never,
		);

		expect(result.success).toBe(true);
	});

	it('still refuses a Hub-verified body that is not a payment', async () => {
		const result = await PaymentWebhooks.donation.handler(
			{ key: undefined } as never,
			{ payload: 'not-a-body', headers: {}, hubVerified: true } as never,
		);

		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('accepts a delivery whose data field was already parsed out', async () => {
		const result = await PaymentWebhooks.donation.handler(
			context(),
			request({ data: JSON.stringify(donation) }),
		);

		expect(result.success).toBe(true);
	});

	it('keeps a null message and a null tier as null rather than dropping them', async () => {
		const result = await PaymentWebhooks.donation.handler(
			context(),
			request(formBody({ ...donation, tier_name: null, message: null })),
		);

		expect(result.data).toMatchObject({ tier_name: null, message: null });
	});
});

describe('payment matchers', () => {
	it.each([
		['donation', donation],
		['subscription', subscriptionPayment],
		['shopOrder', shopOrder],
		['commission', commission],
	] as const)('matches only the %s type', (key, payment) => {
		const handler = PaymentWebhooks[key];

		expect(handler.match({ headers: {}, body: formBody(payment) })).toBe(true);
		// A different type must not be claimed by this path.
		const other = key === 'donation' ? commission : donation;
		expect(handler.match({ headers: {}, body: formBody(other) })).toBe(false);
	});

	it('matches a parsed body as well as a raw one', () => {
		expect(
			PaymentWebhooks.donation.match({ headers: {}, body: donation }),
		).toBe(true);
	});

	it('does not match another provider’s body', () => {
		expect(
			PaymentWebhooks.donation.match({
				headers: {},
				body: { event: 'message.sent', team_id: 'T1' },
			}),
		).toBe(false);
	});
});
