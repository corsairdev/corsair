import {
	isSmtp2goDelivery,
	parseSmtp2goPayload,
	smtp2goWebhooksNested,
	verifySmtp2goWebhook,
} from './webhooks';

const TOKEN = 'smtp2go-webhook-test-token';

// Shaped like SMTP2GO's documented email webhook parameters, made-up values.
const delivered = {
	event: 'delivered',
	email_id: '1abcde-ABCDE1-23',
	'message-id': '<abc@example.com>',
	time: '2026-11-28T10:00:00Z',
	sendtime: '2026-11-28T09:59:58Z',
	sender: 'sender@example.com',
	rcpt: 'rcpt@example.com',
	subject: 'Corsair test',
	host: 'mx.example.com',
	custom_header: 'kept',
};

function delivery(body: object | string, authorization?: string) {
	const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
	return {
		payload: typeof body === 'string' ? body : body,
		rawBody,
		headers: authorization === undefined ? {} : { authorization },
	};
}

const ctx = { key: TOKEN } as never;

describe('verifySmtp2goWebhook', () => {
	it('accepts the configured value as a Bearer or Basic credential', () => {
		expect(
			verifySmtp2goWebhook(delivery(delivered, `Bearer ${TOKEN}`), TOKEN),
		).toEqual({ valid: true });
		expect(
			verifySmtp2goWebhook(delivery(delivered, `Basic ${TOKEN}`), TOKEN),
		).toEqual({ valid: true });
	});

	it('rejects another value, a missing header and a missing secret', () => {
		expect(
			verifySmtp2goWebhook(delivery(delivered, 'Bearer nope'), TOKEN).valid,
		).toBe(false);
		expect(verifySmtp2goWebhook(delivery(delivered), TOKEN).valid).toBe(false);
		expect(
			verifySmtp2goWebhook(delivery(delivered, `Bearer ${TOKEN}`), undefined)
				.valid,
		).toBe(false);
	});

	it('trusts a delivery the Hub already verified', () => {
		expect(
			verifySmtp2goWebhook(
				{ payload: delivered, headers: {}, hubVerified: true },
				undefined,
			),
		).toEqual({ valid: true });
	});
});

describe('payloads and matching', () => {
	it('reads JSON and form-encoded deliveries', () => {
		expect(parseSmtp2goPayload(JSON.stringify(delivered))?.event).toBe(
			'delivered',
		);
		expect(
			parseSmtp2goPayload('event=bounce&rcpt=a%40example.com&bounce=hard'),
		).toEqual({ event: 'bounce', rcpt: 'a@example.com', bounce: 'hard' });
		expect(parseSmtp2goPayload(42)).toBeUndefined();
	});

	it('routes email and SMS events to their webhook', () => {
		const email = { headers: {}, body: delivered };
		const sms = { headers: {}, body: { event: 'sms_delivered' } };
		expect(smtp2goWebhooksNested.email.event.match(email)).toBe(true);
		expect(smtp2goWebhooksNested.sms.event.match(email)).toBe(false);
		expect(smtp2goWebhooksNested.sms.event.match(sms)).toBe(true);
		expect(isSmtp2goDelivery({ headers: {}, body: { event: 'push' } })).toBe(
			false,
		);
	});
});

describe('handler', () => {
	beforeEach(() => {
		jest.spyOn(console, 'log').mockImplementation(() => undefined);
	});
	afterEach(() => jest.restoreAllMocks());

	it('returns the parsed event and keeps custom headers', async () => {
		const result = await smtp2goWebhooksNested.email.event.handler(
			ctx,
			delivery(delivered, `Bearer ${TOKEN}`) as never,
		);
		expect(result.success).toBe(true);
		if (!result.success) throw new Error(result.error);
		expect(result.data?.event).toBe('delivered');
		expect((result.data as Record<string, unknown>).custom_header).toBe('kept');
	});

	it('parses a form-encoded delivery', async () => {
		const result = await smtp2goWebhooksNested.email.event.handler(
			ctx,
			delivery(
				'event=open&rcpt=a%40example.com&read-secs=10',
				`Bearer ${TOKEN}`,
			) as never,
		);
		expect(result.success).toBe(true);
		if (!result.success) throw new Error(result.error);
		expect(result.data?.event).toBe('open');
	});

	it('answers 401 without the right Authorization header', async () => {
		const result = await smtp2goWebhooksNested.email.event.handler(
			ctx,
			delivery(delivered, 'Bearer wrong') as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});
});
