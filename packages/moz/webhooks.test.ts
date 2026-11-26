import { createHmac } from 'node:crypto';
import { isMozDelivery, LocationWebhooks, verifyMozWebhook } from './webhooks';

const SECRET = `whsec_${Buffer.from('moz-test-secret-0123456789').toString('base64')}`;
const NOW = 1_792_677_603;

function signed(body: string, id = 'msg_1', timestamp = String(NOW)) {
	const key = Buffer.from(SECRET.slice(6), 'base64');
	const sig = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${body}`)
		.digest('base64');
	return {
		headers: {
			'content-type': 'application/json',
			'webhook-id': id,
			'webhook-timestamp': timestamp,
			'webhook-signature': `v1,${sig}`,
		},
		rawBody: body,
		payload: JSON.parse(body),
		body: JSON.parse(body),
	};
}

// Moz's documented example body (moz.com/api/docs/guides/webhooks).
const BODY =
	'{"type":"local.location.updated","timestamp":"2026-10-22T14:00:00.000Z","data":{"location_id":12345}}';

describe('Moz webhooks', () => {
	it('accepts a correctly signed delivery', () => {
		expect(verifyMozWebhook(signed(BODY), SECRET, NOW)).toEqual({
			valid: true,
		});
	});

	it('refuses a changed body, a wrong secret and a stale timestamp', () => {
		const request = signed(BODY);
		expect(
			verifyMozWebhook(
				{ ...request, rawBody: BODY.replace('12345', '99999') },
				SECRET,
				NOW,
			).valid,
		).toBe(false);
		expect(
			verifyMozWebhook(
				request,
				`whsec_${Buffer.from('other').toString('base64')}`,
				NOW,
			).valid,
		).toBe(false);
		expect(verifyMozWebhook(request, SECRET, NOW + 3600).valid).toBe(false);
		expect(verifyMozWebhook(request, undefined, NOW).valid).toBe(false);
	});

	it('matches only Moz Local location events, each on its own webhook', () => {
		const request = signed(BODY);
		expect(isMozDelivery(request as never)).toBe(true);
		expect(LocationWebhooks.updated.match(request as never)).toBe(true);
		expect(LocationWebhooks.created.match(request as never)).toBe(false);
		const other = signed('{"type":"invoice.paid","data":{"id":1}}');
		expect(isMozDelivery(other as never)).toBe(false);
	});

	it('answers 401 to an unsigned delivery', async () => {
		const request = {
			...signed(BODY),
			headers: { 'content-type': 'application/json' },
		};
		const result = await LocationWebhooks.updated.handler(
			{ key: SECRET } as never,
			request as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});
});
