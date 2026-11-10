jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import type { WebhookRequest } from 'corsair/core';
import {
	collectPluginWebhookMatchers,
	logEventFromContext,
	matchWebhookPluginAndTenant,
} from 'corsair/core';
import { tldv } from './index';
import {
	liveMeetingDetail,
	liveNotesResponse,
	liveTranscriptResponse,
} from './live-fixtures';
import {
	meetingReadyEvent,
	meetingReadyNullTranscript,
	meetingReadyWithoutTranscript,
	transcriptReadyEvent,
} from './test-fixtures';
import { matchTldvTenantWebhook } from './webhooks/tenant-matcher';
import type { TldvWebhookOutputs } from './webhooks/types';
import {
	MeetingReadyEventSchema,
	matchTldvEvent,
	TLDV_WEBHOOK_SECRET_HEADER,
	TranscriptReadyEventSchema,
	verifyTldvWebhook,
} from './webhooks/types';

const SECRET = 'tldv-webhook-test-secret';

// unknown: the helper signs whatever body a test passes, including deliberately
// malformed payloads no schema would accept, so the payload stays untyped.
function request(
	payload: unknown,
	secret: string | null = SECRET,
): WebhookRequest<unknown> {
	return {
		payload,
		rawBody: JSON.stringify(payload),
		// null means "send no header"; undefined would trigger the default above.
		headers: secret === null ? {} : { [TLDV_WEBHOOK_SECRET_HEADER]: secret },
	};
}

describe('tl;dv webhook verification', () => {
	it('accepts a delivery carrying the configured secret', () => {
		expect(verifyTldvWebhook(request(meetingReadyEvent), SECRET)).toEqual({
			valid: true,
		});
	});

	it('rejects a delivery with the wrong secret', () => {
		const result = verifyTldvWebhook(
			request(meetingReadyEvent, 'wrong'),
			SECRET,
		);

		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook secret');
	});

	it('rejects a delivery with no header', () => {
		const result = verifyTldvWebhook(request(meetingReadyEvent, null), SECRET);

		expect(result.valid).toBe(false);
		expect(result.error).toContain(TLDV_WEBHOOK_SECRET_HEADER);
	});

	it('rejects everything when no secret is configured', () => {
		// Fail closed: tl;dv does not sign deliveries, so a delivery that arrives
		// without a secret cannot be authenticated at all.
		const result = verifyTldvWebhook(request(meetingReadyEvent), undefined);

		expect(result.valid).toBe(false);
		expect(result.error).toContain('No tl;dv webhook secret is set');
	});

	it('trusts a hub-verified delivery without the header', () => {
		const result = verifyTldvWebhook(
			{ ...request(meetingReadyEvent, null), hubVerified: true },
			undefined,
		);

		expect(result).toEqual({ valid: true });
	});

	it('compares in constant time across different lengths', () => {
		// timingSafeEqual throws on unequal buffers; the guard keeps that a
		// plain false instead of an exception escaping.
		const result = verifyTldvWebhook(request(meetingReadyEvent, 'x'), SECRET);
		expect(result.valid).toBe(false);
	});
});

describe('tl;dv webhook matching', () => {
	it('matches MeetingReady by its event field', () => {
		expect(
			matchTldvEvent('MeetingReady')({ headers: {}, body: meetingReadyEvent }),
		).toBe(true);
		expect(
			matchTldvEvent('MeetingReady')({
				headers: {},
				body: transcriptReadyEvent,
			}),
		).toBe(false);
	});

	it('matches TranscriptReady by its event field', () => {
		expect(
			matchTldvEvent('TranscriptReady')({
				headers: {},
				body: transcriptReadyEvent,
			}),
		).toBe(true);
	});

	it('does not match a body with no event field', () => {
		expect(matchTldvEvent('MeetingReady')({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('matches a raw string body', () => {
		// Tenant discovery hands matchers the body before it is parsed.
		expect(
			matchTldvEvent('MeetingReady')({
				headers: {},
				body: JSON.stringify(meetingReadyEvent),
			}),
		).toBe(true);
		expect(
			matchTldvEvent('MeetingReady')({ headers: {}, body: '{not json' }),
		).toBe(false);
	});
});

describe('tl;dv plugin discovery', () => {
	// A neighbour plugin that recognises its own deliveries by a header, the way
	// signed providers do. It is listed after tl;dv on purpose.
	const neighbour = {
		id: 'neighbour',
		pluginWebhookMatcher: (request: { headers: Record<string, unknown> }) =>
			'x-neighbour-signature' in request.headers,
		pluginTenantWebhookMatcher: () => ({
			linkType: 'tenant_external_id',
			externalId: 'neighbour-account',
		}),
	};
	const matchers = collectPluginWebhookMatchers([tldv(), neighbour] as never);

	it('claims both tl;dv triggers', () => {
		const matcher = tldv().pluginWebhookMatcher;

		expect(matcher?.({ headers: {}, body: meetingReadyEvent })).toBe(true);
		expect(matcher?.({ headers: {}, body: transcriptReadyEvent })).toBe(true);
		expect(
			matcher?.({ headers: {}, body: JSON.stringify(meetingReadyEvent) }),
		).toBe(true);
	});

	it("leaves another provider's delivery alone", () => {
		const matcher = tldv().pluginWebhookMatcher;

		expect(matcher?.({ headers: {}, body: {} })).toBe(false);
		expect(matcher?.({ headers: {}, body: { event: 'invitee.created' } })).toBe(
			false,
		);
		expect(
			matcher?.({ headers: {}, body: { event: { type: 'message' } } }),
		).toBe(false);
	});

	it('does not take a delivery from a plugin listed after it', () => {
		// Discovery stops at the first plugin whose matcher says yes. A matcher
		// that always says yes sends this delivery to tl;dv, whose tenant matcher
		// finds no organizer and answers null, so the tenant is never resolved.
		const match = matchWebhookPluginAndTenant(matchers, {
			headers: { 'x-neighbour-signature': 'sig' },
			body: { type: 'neighbour.event' },
		});

		expect(match).toEqual({
			plugin: 'neighbour',
			tenantMatch: {
				linkType: 'tenant_external_id',
				externalId: 'neighbour-account',
			},
		});
	});

	it('still resolves its own delivery', () => {
		expect(
			matchWebhookPluginAndTenant(matchers, {
				headers: {},
				body: meetingReadyEvent,
			}),
		).toEqual({
			plugin: 'tldv',
			tenantMatch: {
				linkType: 'tenant_external_id',
				externalId: 'jordan@example.org',
			},
		});
	});
});

describe('tl;dv webhook payloads', () => {
	it('parses a MeetingReady delivery with a transcript', () => {
		const parsed = MeetingReadyEventSchema.safeParse(meetingReadyEvent);

		expect(parsed.success).toBe(true);
		expect(parsed.data?.data.transcript?.data).toHaveLength(2);
	});

	it('parses a MeetingReady delivery with no transcript key', () => {
		// The key is absent unless the subscription asked for `include.transcript`.
		const parsed = MeetingReadyEventSchema.safeParse(
			meetingReadyWithoutTranscript,
		);

		expect(parsed.success).toBe(true);
		expect(parsed.data?.data.transcript).toBeUndefined();
	});

	it('parses a MeetingReady delivery whose transcript is null', () => {
		// Null means the subscription asked but the meeting has no transcript yet.
		const parsed = MeetingReadyEventSchema.safeParse(
			meetingReadyNullTranscript,
		);

		expect(parsed.success).toBe(true);
		expect(parsed.data?.data.transcript).toBeNull();
	});

	it('parses a TranscriptReady delivery', () => {
		const parsed = TranscriptReadyEventSchema.safeParse(transcriptReadyEvent);

		expect(parsed.success).toBe(true);
		expect(parsed.data?.data.meetingId).toBe('meeting-123');
	});

	it('parses notes that carry only the fields the spec requires', () => {
		// MeetingWebhookNote requires `timestamp` alone and MeetingWebhookTopic
		// requires `id`, `order` and `title`. Demanding the rest would reject the
		// delivery, and tl;dv would retry an event the plugin can never accept.
		const sparse = {
			...meetingReadyWithoutTranscript,
			data: {
				...meetingReadyWithoutTranscript.data,
				notes: {
					structuredNotes: [{ timestamp: 12 }],
					topics: [{ id: 'topic-1', order: 0, title: 'Progress update' }],
				},
			},
		};

		const parsed = MeetingReadyEventSchema.safeParse(sparse);

		expect(parsed.success).toBe(true);
		expect(parsed.data?.data.notes?.structuredNotes).toEqual([
			{ timestamp: 12 },
		]);
		expect(parsed.data?.data.notes?.topics?.[0]?.summary).toBeUndefined();
	});

	it('still rejects a note with no timestamp', () => {
		const parsed = MeetingReadyEventSchema.safeParse({
			...meetingReadyWithoutTranscript,
			data: {
				...meetingReadyWithoutTranscript.data,
				notes: { structuredNotes: [{ text: 'no time' }], topics: [] },
			},
		});

		expect(parsed.success).toBe(false);
	});

	it('parses a delivery with no executedAt', () => {
		// The spec's schema lists `executedAt` as required, but both of its own
		// example deliveries leave it out. Nothing reads the field, so its absence
		// must not cost the delivery.
		const { executedAt: _m, ...meetingReady } = meetingReadyEvent;
		const { executedAt: _t, ...transcriptReady } = transcriptReadyEvent;

		expect(MeetingReadyEventSchema.safeParse(meetingReady).success).toBe(true);
		expect(TranscriptReadyEventSchema.safeParse(transcriptReady).success).toBe(
			true,
		);
	});

	it('rejects a MeetingReady body whose event is wrong', () => {
		const parsed = MeetingReadyEventSchema.safeParse({
			...meetingReadyEvent,
			event: 'TranscriptReady',
		});

		expect(parsed.success).toBe(false);
	});
});

// tl;dv's help center says deliveries "use the same data structure as the
// tl;dv API", in an { id, event, executedAt, data } envelope. No delivery was
// captured, so these wrap the live API responses in that envelope.
describe('tl;dv webhook payloads built from live responses', () => {
	it('parses a MeetingReady delivery around a live meeting and notes', () => {
		const parsed = MeetingReadyEventSchema.safeParse({
			id: 'webhook-job-id',
			event: 'MeetingReady',
			executedAt: '2026-11-10T19:08:00.000Z',
			data: {
				...liveMeetingDetail,
				notes: liveNotesResponse,
				transcript: liveTranscriptResponse,
			},
		});

		expect(parsed.success).toBe(true);
	});

	it('parses a TranscriptReady delivery around a live transcript', () => {
		const parsed = TranscriptReadyEventSchema.safeParse({
			event: 'TranscriptReady',
			data: liveTranscriptResponse,
			id: 'webhook-job-id',
			executedAt: '2026-11-10T19:08:00.000Z',
		});

		expect(parsed.success).toBe(true);
	});
});

describe('tl;dv webhook handlers', () => {
	const plugin = tldv({ key: 'api', webhookSecret: SECRET });

	it('returns the event when the secret verifies', async () => {
		const result = await plugin.webhooks!.meetings.meetingReady.handler(
			{ key: SECRET } as never,
			request(meetingReadyEvent) as never,
		);

		expect(result.success).toBe(true);
		expect((result.data as TldvWebhookOutputs['meetingReady']).data.id).toBe(
			'meeting-123',
		);
	});

	it('throws on a wrong secret so the route can answer non-2xx', async () => {
		// processWebhook answers { success: true } for a returned failure and keeps
		// only a thrown error, so a throw is the only path that reports a failure.
		await expect(
			plugin.webhooks!.meetings.meetingReady.handler(
				{ key: 'wrong' } as never,
				request(meetingReadyEvent) as never,
			),
		).rejects.toThrow('Invalid webhook secret');
	});

	it('throws on a payload that does not parse', async () => {
		await expect(
			plugin.webhooks!.transcripts.transcriptReady.handler(
				{ key: SECRET } as never,
				request({ id: 'x', event: 'TranscriptReady' }) as never,
			),
		).rejects.toThrow(/Invalid tl;dv TranscriptReady payload/);
	});

	it('logs no transcript when the key is absent', async () => {
		// `include.transcript` off leaves the key out entirely, and an absent key
		// must not read as a present transcript.
		const logSpy = jest.mocked(logEventFromContext);
		logSpy.mockClear();

		await plugin.webhooks!.meetings.meetingReady.handler(
			{ key: SECRET } as never,
			request(meetingReadyWithoutTranscript) as never,
		);

		const fields = logSpy.mock.calls[0]?.[2];
		expect(fields).toMatchObject({ hasTranscript: false });
	});

	it('logs no transcript when the key is explicitly null', async () => {
		const logSpy = jest.mocked(logEventFromContext);
		logSpy.mockClear();

		await plugin.webhooks!.meetings.meetingReady.handler(
			{ key: SECRET } as never,
			request(meetingReadyNullTranscript) as never,
		);

		expect(logSpy.mock.calls[0]?.[2]).toMatchObject({ hasTranscript: false });
	});

	it('logs a present transcript when the key carries sentences', async () => {
		const logSpy = jest.mocked(logEventFromContext);
		logSpy.mockClear();

		await plugin.webhooks!.meetings.meetingReady.handler(
			{ key: SECRET } as never,
			request(meetingReadyEvent) as never,
		);

		expect(logSpy.mock.calls[0]?.[2]).toMatchObject({ hasTranscript: true });
	});
});

describe('tl;dv tenant routing', () => {
	it('routes by the organizer email', () => {
		expect(
			matchTldvTenantWebhook({ headers: {}, body: meetingReadyEvent }),
		).toEqual({
			linkType: 'tenant_external_id',
			externalId: 'jordan@example.org',
		});
	});

	it('parses a raw string body', () => {
		expect(
			matchTldvTenantWebhook({
				headers: {},
				body: JSON.stringify(meetingReadyEvent),
			}),
		).toEqual({
			linkType: 'tenant_external_id',
			externalId: 'jordan@example.org',
		});
	});

	it('returns null when there is no organizer email', () => {
		expect(
			matchTldvTenantWebhook({
				headers: {},
				body: { event: 'TranscriptReady', data: {} },
			}),
		).toBeNull();
	});
});
