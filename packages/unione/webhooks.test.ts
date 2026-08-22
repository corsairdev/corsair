import { matchUnioneWebhook } from './index';
import { matchUnioneTenantWebhook } from './webhooks/tenant-matcher';
import {
	createUnioneMatch,
	UnioneWebhookPayloadSchema,
	verifyUnioneWebhookAuth,
} from './webhooks/types';

const payload = {
	auth: 'secret',
	events_by_user: [
		{
			user_id: 11344,
			events: [
				{
					event_name: 'transactional_email_status',
					event_data: { job_id: 'job-1', status: 'delivered' },
				},
			],
		},
	],
};

describe('Unione webhooks', () => {
	it('matches transactional email status events', () => {
		const match = createUnioneMatch('transactional_email_status');
		expect(match({ headers: {}, body: payload })).toBe(true);
		expect(
			match({
				headers: {},
				body: { events_by_user: [{ events: [{ event_name: 'other' }] }] },
			}),
		).toBe(false);
	});

	it('verifies payload auth when a secret is provided', () => {
		expect(
			verifyUnioneWebhookAuth({ payload, headers: {} }, 'secret').valid,
		).toBe(true);
		expect(
			verifyUnioneWebhookAuth({ payload, headers: {} }, 'wrong').valid,
		).toBe(false);
	});

	it('fails closed when no webhook secret is configured', () => {
		// An empty secret is what the key builder yields when none is stored.
		// Accepting the payload there would let a forged event write job status.
		const result = verifyUnioneWebhookAuth({ payload, headers: {} }, '');
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/no unione webhook secret/i);
	});

	it('rejects a payload with no auth field when a secret is configured', () => {
		const { auth: _auth, ...unsigned } = payload;
		expect(
			verifyUnioneWebhookAuth(
				{ payload: unsigned as typeof payload, headers: {} },
				'secret',
			).valid,
		).toBe(false);
	});

	it('extracts user_id for tenant matching', () => {
		const match = matchUnioneTenantWebhook({ headers: {}, body: payload });
		expect(match).toEqual({ linkType: 'user_id', externalId: '11344' });
	});

	it('parses the documented webhook payload shape', () => {
		expect(UnioneWebhookPayloadSchema.parse(payload).auth).toBe('secret');
	});

	it('claims only UniOne-shaped payloads, not any body with an auth field', () => {
		expect(matchUnioneWebhook({ headers: {}, body: payload })).toBe(true);
		expect(
			matchUnioneWebhook({ headers: {}, body: JSON.stringify(payload) }),
		).toBe(true);
		// Another provider's signed webhook must fall through to its own plugin.
		expect(
			matchUnioneWebhook({ headers: {}, body: { auth: 'x', id: 'evt_1' } }),
		).toBe(false);
		expect(
			matchUnioneWebhook({
				headers: {},
				body: { events_by_user: [{ events: [{ event_name: 'other' }] }] },
			}),
		).toBe(false);
		expect(matchUnioneWebhook({ headers: {}, body: 'not json' })).toBe(false);
		// The header alone is trivially spoofable and must not claim a request.
		expect(
			matchUnioneWebhook({
				headers: { 'x-unione-auth': 'anything' },
				body: { id: 'evt_1', type: 'charge.succeeded' },
			}),
		).toBe(false);
	});
});
