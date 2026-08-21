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

	it('extracts user_id for tenant matching', () => {
		const match = matchUnioneTenantWebhook({ headers: {}, body: payload });
		expect(match).toEqual({ linkType: 'user_id', externalId: '11344' });
	});

	it('parses the documented webhook payload shape', () => {
		expect(UnioneWebhookPayloadSchema.parse(payload).auth).toBe('secret');
	});
});
