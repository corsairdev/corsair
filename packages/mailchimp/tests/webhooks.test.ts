import type { RawWebhookRequest } from 'corsair/core';

import { mailchimp } from '../index';
import {
	createMailchimpMatch,
	MailchimpTriggerEventSchema,
	parseMailchimpWebhookBody,
	SubscribeEventSchema,
	verifyMailchimpWebhookSecret,
} from '../webhooks/types';
import { mockWebhookRequest } from './utils';

// A representative Mailchimp "subscribe" webhook body — form-encoded, not JSON,
// with bracketed nested keys.
const SUBSCRIBE_BODY =
	'type=subscribe&fired_at=2026-07-05+21%3A35%3A57' +
	'&data%5Bid%5D=8a25ff1d98&data%5Blist_id%5D=a6b5da1054' +
	'&data%5Bemail%5D=api%40mailchimp.com&data%5Bmerges%5D%5BFNAME%5D=Mailchimp';

describe('parseMailchimpWebhookBody', () => {
	it('W-1: parses a form-encoded body (not JSON)', () => {
		const parsed = parseMailchimpWebhookBody(SUBSCRIBE_BODY);
		expect(parsed).not.toBeNull();
		expect(parsed?.type).toBe('subscribe');
		expect(parsed?.fired_at).toBe('2026-07-05 21:35:57');
	});

	it('W-3: decodes bracketed nested data[...] keys into a nested object', () => {
		const parsed = parseMailchimpWebhookBody(SUBSCRIBE_BODY);
		const data = parsed?.data as Record<string, unknown>;
		expect(data.id).toBe('8a25ff1d98');
		expect(data.list_id).toBe('a6b5da1054');
		expect(data.email).toBe('api@mailchimp.com');
		expect((data.merges as Record<string, unknown>).FNAME).toBe('Mailchimp');
	});

	it('accepts an already-parsed object', () => {
		const parsed = parseMailchimpWebhookBody({ type: 'profile', data: {} });
		expect(parsed?.type).toBe('profile');
	});

	it('accepts a defensive JSON string', () => {
		const parsed = parseMailchimpWebhookBody('{"type":"campaign","data":{}}');
		expect(parsed?.type).toBe('campaign');
	});

	it('W-7: returns null for a malformed/empty body', () => {
		expect(parseMailchimpWebhookBody('')).toBeNull();
		expect(parseMailchimpWebhookBody('   ')).toBeNull();
		expect(parseMailchimpWebhookBody(null)).toBeNull();
		expect(parseMailchimpWebhookBody(42)).toBeNull();
		expect(parseMailchimpWebhookBody([1, 2])).toBeNull();
	});
});

describe('createMailchimpMatch', () => {
	const raw = (body: string): RawWebhookRequest => ({
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body,
	});

	it('W-2: routes to the handler whose type matches', () => {
		expect(createMailchimpMatch('subscribe')(raw(SUBSCRIBE_BODY))).toBe(true);
		expect(createMailchimpMatch('unsubscribe')(raw(SUBSCRIBE_BODY))).toBe(
			false,
		);
	});

	it('W-5: an unknown/other type simply does not match (no throw)', () => {
		const body = 'type=cleaned&data%5Bemail%5D=x%40y.com';
		expect(createMailchimpMatch('subscribe')(body ? raw(body) : raw(''))).toBe(
			false,
		);
		expect(createMailchimpMatch('cleaned')(raw(body))).toBe(true);
	});

	it('W-7: returns false for an unparseable body', () => {
		expect(createMailchimpMatch('subscribe')(raw(''))).toBe(false);
	});
});

describe('pluginWebhookMatcher', () => {
	const matcher = mailchimp().pluginWebhookMatcher!;

	it('requires the Mailchimp secret routing parameter', () => {
		const request: RawWebhookRequest = {
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: SUBSCRIBE_BODY,
		};

		expect(matcher(request)).toBe(false);
		expect(matcher({ ...request, query: { secret: 's3cr3t' } })).toBe(true);
	});

	it('still rejects unsupported event types with a secret present', () => {
		expect(
			matcher({
				headers: { 'content-type': 'application/x-www-form-urlencoded' },
				body: 'type=other&data%5Blist_id%5D=a6b5da1054',
				query: { secret: 's3cr3t' },
			}),
		).toBe(false);
	});
});

describe('verifyMailchimpWebhookSecret (W-4)', () => {
	it('accepts a request whose secret query param matches', () => {
		const req = mockWebhookRequest({ type: 'subscribe' }, { secret: 's3cr3t' });
		expect(verifyMailchimpWebhookSecret(req, 's3cr3t')).toEqual({
			valid: true,
		});
	});

	it('rejects a mismatched secret', () => {
		const req = mockWebhookRequest({ type: 'subscribe' }, { secret: 'wrong' });
		const res = verifyMailchimpWebhookSecret(req, 's3cr3t');
		expect(res.valid).toBe(false);
		expect(res.error).toMatch(/invalid/i);
	});

	it('rejects when the request carries no secret param', () => {
		const req = mockWebhookRequest({ type: 'subscribe' });
		const res = verifyMailchimpWebhookSecret(req, 's3cr3t');
		expect(res.valid).toBe(false);
		expect(res.error).toMatch(/query parameter/i);
	});

	it('rejects when no secret is configured', () => {
		const req = mockWebhookRequest({ type: 'subscribe' }, { secret: 'x' });
		const res = verifyMailchimpWebhookSecret(req, undefined);
		expect(res.valid).toBe(false);
		expect(res.error).toMatch(/missing webhook secret/i);
	});
});

describe('trigger event schemas', () => {
	it('W-6: parses a subscribe event and exposes list_id/email', () => {
		const parsed = SubscribeEventSchema.parse(
			parseMailchimpWebhookBody(SUBSCRIBE_BODY),
		);
		expect(parsed.type).toBe('subscribe');
		expect(parsed.data.list_id).toBe('a6b5da1054');
		expect(parsed.data.email).toBe('api@mailchimp.com');
	});

	it('discriminates the four trigger types by "type"', () => {
		for (const type of ['subscribe', 'unsubscribe', 'profile', 'campaign']) {
			const event = MailchimpTriggerEventSchema.parse({
				type,
				fired_at: '2026-07-05 21:35:57',
				data: { list_id: 'a6b5da1054' },
			});
			expect(event.type).toBe(type);
		}
	});

	it('rejects an unsupported trigger type', () => {
		expect(() =>
			MailchimpTriggerEventSchema.parse({ type: 'nope', data: {} }),
		).toThrow();
	});
});

describe('matchMailchimpTenantWebhook', () => {
	// Lazy import so the test file can keep its existing top-level structure.
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { matchMailchimpTenantWebhook } = require('../webhooks/tenant-matcher');

	function buildRequest(body: string, query?: Record<string, string>) {
		const request: RawWebhookRequest = {
			headers: {},
			body,
			query,
		};
		return request;
	}

	it('routes by URL-embedded aid query param first (OAuth routing key)', () => {
		const req = buildRequest(SUBSCRIBE_BODY, { aid: 'acc-123' });
		const match = matchMailchimpTenantWebhook(req);
		expect(match).toEqual({
			linkType: 'tenant_external_id',
			externalId: 'acc-123',
		});
	});

	it('falls back to data.list_id when no aid is present', () => {
		const req = buildRequest(SUBSCRIBE_BODY);
		const match = matchMailchimpTenantWebhook(req);
		expect(match).toEqual({
			linkType: 'tenant_external_id',
			externalId: 'a6b5da1054',
		});
	});

	it('returns null when no routing signal is available', () => {
		const req = buildRequest('type=subscribe&fired_at=2026-07-05+21%3A35%3A57');
		expect(matchMailchimpTenantWebhook(req)).toBeNull();
	});
});
