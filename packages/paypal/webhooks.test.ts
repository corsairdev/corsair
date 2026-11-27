import { createSign, generateKeyPairSync } from 'node:crypto';
import type { PaypalContext } from './index';
import type { PaypalCert } from './webhooks';
import {
	crc32,
	fetchPaypalCert,
	isPaypalCertUrl,
	paypalCertCacheSize,
	paypalWebhooksNested,
	verifyPaypalWebhook,
	webhookIdFor,
} from './webhooks';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
	modulusLength: 2048,
});
const CERT: PaypalCert = {
	publicKey,
	subject: 'CN=messageverificationcerts.paypal.com',
	validFrom: new Date('2026-01-01'),
	validTo: new Date('2027-01-01'),
};
const NOW = new Date('2026-11-27T10:00:00Z');
const WEBHOOK_ID = '0EH40505U7160970P';
const CERT_URL =
	'https://api.paypal.com/v1/notifications/certs/CERT-360caa42-fca2a594-1d93a270';

function delivery(event: object, webhookId = WEBHOOK_ID) {
	const rawBody = JSON.stringify(event);
	const transmissionId = '69cd13f0-d67a-11e5-baa3-778b53f4ae55';
	const time = '2026-11-27T09:59:00Z';
	const signature = createSign('RSA-SHA256')
		.update(`${transmissionId}|${time}|${webhookId}|${crc32(rawBody)}`)
		.sign(privateKey, 'base64');
	return {
		headers: {
			'paypal-transmission-id': transmissionId,
			'paypal-transmission-time': time,
			'paypal-transmission-sig': signature,
			'paypal-cert-url': CERT_URL,
			'paypal-auth-algo': 'SHA256withRSA',
		},
		rawBody,
		payload: event,
		body: rawBody,
	};
}

const CAPTURE = {
	id: 'WH-58D329510W468432D-8HN650336L201105X',
	event_type: 'PAYMENT.CAPTURE.COMPLETED',
	resource_type: 'capture',
	summary: 'Payment completed for $ 7.47 USD',
	resource: {
		id: '42311647XV020574X',
		status: 'COMPLETED',
		amount: { currency_code: 'USD', value: '7.47' },
	},
};

describe('paypal webhooks', () => {
	it('computes CRC-32 like PayPal (IEEE)', () => {
		expect(crc32('The quick brown fox jumps over the lazy dog')).toBe(
			0x414fa339,
		);
		expect(crc32('')).toBe(0);
	});

	it('accepts a delivery signed for this webhook id', async () => {
		const request = delivery(CAPTURE);
		await expect(
			verifyPaypalWebhook(request as never, WEBHOOK_ID, async () => CERT, NOW),
		).resolves.toEqual({ valid: true });
	});

	it('refuses another webhook id, a changed body, a foreign cert URL and an expired cert', async () => {
		const request = delivery(CAPTURE);
		expect(
			(
				await verifyPaypalWebhook(
					request as never,
					'OTHER',
					async () => CERT,
					NOW,
				)
			).valid,
		).toBe(false);
		const tampered = {
			...request,
			rawBody: request.rawBody.replace('7.47', '9.47'),
		};
		expect(
			(
				await verifyPaypalWebhook(
					tampered as never,
					WEBHOOK_ID,
					async () => CERT,
					NOW,
				)
			).valid,
		).toBe(false);
		const foreign = {
			...request,
			headers: {
				...request.headers,
				'paypal-cert-url': 'https://paypal.com.evil.example/cert',
			},
		};
		expect(
			await verifyPaypalWebhook(
				foreign as never,
				WEBHOOK_ID,
				async () => CERT,
				NOW,
			),
		).toEqual({
			valid: false,
			error: 'PayPal certificate URL is not on paypal.com',
		});
		expect(
			(
				await verifyPaypalWebhook(
					request as never,
					WEBHOOK_ID,
					async () => CERT,
					new Date('2028-01-01'),
				)
			).valid,
		).toBe(false);
		expect(isPaypalCertUrl('http://api.paypal.com/cert')).toBe(false);
		expect(isPaypalCertUrl(CERT_URL)).toBe(true);
	});

	it('routes event types to the webhook with the longest prefix', () => {
		expect(webhookIdFor('PAYMENT.CAPTURE.REFUNDED')).toBe('paymentCapture');
		expect(webhookIdFor('PAYMENT.PAYOUTS-ITEM.SUCCEEDED')).toBe('payout');
		expect(webhookIdFor('BILLING.SUBSCRIPTION.ACTIVATED')).toBe('subscription');
		expect(webhookIdFor('MERCHANT.ONBOARDING.COMPLETED')).toBe('other');
		const request = delivery(CAPTURE);
		expect(paypalWebhooksNested.paymentCapture.match(request as never)).toBe(
			true,
		);
		expect(paypalWebhooksNested.other.match(request as never)).toBe(false);
	});

	it('the handler refuses a delivery when the certificate cannot be fetched', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(new Response('nope', { status: 404 }));
		const ctx = {
			key: WEBHOOK_ID,
			$getAccountId: async () => 'a',
		} as unknown as PaypalContext;
		await expect(
			paypalWebhooksNested.paymentCapture.handler(
				ctx,
				delivery(CAPTURE) as never,
			),
		).resolves.toMatchObject({ success: false, statusCode: 401 });
		jest.restoreAllMocks();
	});
});

describe('certificate cache', () => {
	afterEach(() => jest.restoreAllMocks());

	it('shares one entry across fragments and keeps at most 32', () => {
		// The fetch never settles: only what the cache keeps matters here.
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(() => new Promise<Response>(() => {}));
		const base = 'https://api.paypal.com/v1/notifications/certs/CERT-cache';
		const first = fetchPaypalCert(`${base}#1`);
		expect(fetchPaypalCert(`${base}#2`)).toBe(first);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(base);
		for (let i = 0; i < 40; i++) void fetchPaypalCert(`${base}-${i}`);
		expect(paypalCertCacheSize()).toBe(32);
	});
});
