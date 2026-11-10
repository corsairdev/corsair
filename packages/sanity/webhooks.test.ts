import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import {
	DELIVERY_BODY,
	deliveryHeaders,
	PROJECT_ID,
	REAL_DELIVERY,
	sign,
	WEBHOOK_SECRET,
} from './test-fixtures';
import {
	deliveryFields,
	isSanityWebhook,
	matchSanityTenantWebhook,
	SANITY_WEBHOOK_TOLERANCE_SECONDS,
	verifySanityWebhookSignature,
} from './webhooks';

// unknown: the verifier reads only headers and rawBody.
function request(
	headers: Record<string, string>,
	rawBody: string | undefined,
): WebhookRequest<unknown> {
	return {
		headers,
		rawBody,
		payload: rawBody ? JSON.parse(rawBody) : undefined,
	} as WebhookRequest<unknown>;
}

describe('verifySanityWebhookSignature', () => {
	it('verifies a real delivery Sanity signed', () => {
		const result = verifySanityWebhookSignature(
			request({ ...REAL_DELIVERY.headers }, REAL_DELIVERY.rawBody),
			REAL_DELIVERY.secret,
			{ now: REAL_DELIVERY.signedAt + 1000 },
		);
		expect(result).toEqual({ valid: true });
	});

	it('refuses the real delivery with one byte of the body changed', () => {
		const result = verifySanityWebhookSignature(
			request(
				{ ...REAL_DELIVERY.headers },
				REAL_DELIVERY.rawBody.replace('Delivery test', 'Delivery tesT'),
			),
			REAL_DELIVERY.secret,
			{ now: REAL_DELIVERY.signedAt },
		);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/does not match/);
	});

	it('refuses the real delivery once it is older than the window', () => {
		const result = verifySanityWebhookSignature(
			request({ ...REAL_DELIVERY.headers }, REAL_DELIVERY.rawBody),
			REAL_DELIVERY.secret,
			{
				now:
					REAL_DELIVERY.signedAt + SANITY_WEBHOOK_TOLERANCE_SECONDS * 1000 + 1,
			},
		);
		expect(result).toEqual({
			valid: false,
			error: 'The webhook timestamp is out of range',
		});
	});

	it('accepts a delivery at the edge of the window and refuses one from the future', () => {
		const now = Date.now();
		const atEdge = now - SANITY_WEBHOOK_TOLERANCE_SECONDS * 1000;
		expect(
			verifySanityWebhookSignature(
				request(
					deliveryHeaders(DELIVERY_BODY, { timestamp: atEdge }),
					DELIVERY_BODY,
				),
				WEBHOOK_SECRET,
				{ now },
			).valid,
		).toBe(true);
		const future = now + SANITY_WEBHOOK_TOLERANCE_SECONDS * 1000 + 1;
		expect(
			verifySanityWebhookSignature(
				request(
					deliveryHeaders(DELIVERY_BODY, { timestamp: future }),
					DELIVERY_BODY,
				),
				WEBHOOK_SECRET,
				{ now },
			).valid,
		).toBe(false);
	});

	it('refuses another secret', () => {
		const result = verifySanityWebhookSignature(
			request(deliveryHeaders(DELIVERY_BODY), DELIVERY_BODY),
			'another-secret',
		);
		expect(result.valid).toBe(false);
	});

	it('refuses without a secret, a raw body or a signature', () => {
		const headers = deliveryHeaders(DELIVERY_BODY);
		expect(
			verifySanityWebhookSignature(request(headers, DELIVERY_BODY), ''),
		).toEqual({ valid: false, error: 'Missing webhook secret' });
		expect(
			verifySanityWebhookSignature(request(headers, undefined), WEBHOOK_SECRET),
		).toEqual({ valid: false, error: 'Missing raw body' });
		const { 'sanity-webhook-signature': _, ...unsigned } = headers;
		expect(
			verifySanityWebhookSignature(
				request(unsigned, DELIVERY_BODY),
				WEBHOOK_SECRET,
			),
		).toEqual({ valid: false, error: 'The delivery is not signed' });
	});

	it.each([
		'v1=abc',
		't=123,v1=abc',
		't=1794333969323',
		't=1794333969323,v1=has+plus/slash',
		't=1794333969323,v0=abc',
	])('refuses the malformed signature header %s', (header) => {
		const result = verifySanityWebhookSignature(
			request({ 'sanity-webhook-signature': header }, DELIVERY_BODY),
			WEBHOOK_SECRET,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Malformed sanity-webhook-signature',
		});
	});

	it('refuses a signature of the wrong length without throwing', () => {
		const header = `t=${Date.now()},v1=c2hvcnQ`;
		const result = verifySanityWebhookSignature(
			request({ 'sanity-webhook-signature': header }, DELIVERY_BODY),
			WEBHOOK_SECRET,
		);
		expect(result.valid).toBe(false);
	});

	it('reads headers in any case', () => {
		const headers = Object.fromEntries(
			Object.entries(deliveryHeaders(DELIVERY_BODY)).map(([name, value]) => [
				name.toUpperCase(),
				value,
			]),
		);
		expect(
			verifySanityWebhookSignature(
				request(headers, DELIVERY_BODY),
				WEBHOOK_SECRET,
			).valid,
		).toBe(true);
	});

	it('verifies a vector computed outside this code (Python hmac)', () => {
		// base64url(HMAC-SHA256(key 'secret', '1700000000000.{"a":1}')), no padding.
		const header =
			't=1700000000000,v1=TvJzKw1jKmiXrzptAqbeKH9g1sXxXavbDOsEWjTjxac';
		expect(sign('{"a":1}', 'secret', 1_700_000_000_000)).toBe(header);
		expect(
			verifySanityWebhookSignature(
				request({ 'sanity-webhook-signature': header }, '{"a":1}'),
				'secret',
				{ now: 1_700_000_000_000 },
			),
		).toEqual({ valid: true });
	});
});

describe('deliveryFields', () => {
	it('reads every sanity-* header and drops the quotes around the idempotency key', () => {
		expect(
			deliveryFields(
				request({ ...REAL_DELIVERY.headers }, REAL_DELIVERY.rawBody),
			),
		).toEqual({
			operation: 'create',
			documentId: 'corsair-live-40ebcfbe',
			projectId: 'mlz37d9m',
			dataset: 'corsair-plugin-test',
			webhookId: 'v6YLvHAsMjKJDxgN',
			transactionId: '5X82i8ToXfK0Fz5m5f8ns3',
			transactionTime: '2026-11-10T18:06:08Z',
			idempotencyKey: 'Ijl6wS57jhw9+6Jmk6KXSg',
		});
	});
});

describe('isSanityWebhook', () => {
	const raw = (headers: Record<string, string>): RawWebhookRequest =>
		({ headers, body: DELIVERY_BODY }) as RawWebhookRequest;

	it('matches a signed delivery', () => {
		expect(isSanityWebhook(raw(deliveryHeaders(DELIVERY_BODY)))).toBe(true);
	});

	it('matches an unsigned delivery by its project and webhook headers, so the handler can refuse it', () => {
		expect(
			isSanityWebhook(
				raw({ 'sanity-project-id': PROJECT_ID, 'sanity-webhook-id': 'hook-1' }),
			),
		).toBe(true);
	});

	it("leaves other providers' deliveries alone", () => {
		expect(isSanityWebhook(raw({ 'webhook-signature': 'v1,abc' }))).toBe(false);
		expect(isSanityWebhook(raw({ 'sanity-project-id': PROJECT_ID }))).toBe(
			false,
		);
		expect(isSanityWebhook(raw({}))).toBe(false);
	});
});

describe('matchSanityTenantWebhook', () => {
	it('routes by the sanity-project-id header', () => {
		expect(
			matchSanityTenantWebhook({
				headers: { 'sanity-project-id': PROJECT_ID },
				body: DELIVERY_BODY,
			} as RawWebhookRequest),
		).toEqual({ linkType: 'project_id', externalId: PROJECT_ID });
	});

	it('returns null without a usable project id', () => {
		for (const headers of [{}, { 'sanity-project-id': 'Not A Project!' }]) {
			expect(
				matchSanityTenantWebhook({ headers, body: '' } as RawWebhookRequest),
			).toBeNull();
		}
	});
});
