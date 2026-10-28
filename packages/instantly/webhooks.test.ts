import { logEventFromContext } from 'corsair/core';
import { replyPayload, WORKSPACE_ID, webhookPayload } from './test-fixtures';
import * as Events from './webhooks/events';
import { matchInstantlyTenantWebhook } from './webhooks/tenant-matcher';
import {
	createInstantlyMatch,
	INSTANTLY_WEBHOOK_EVENTS,
	INSTANTLY_WEBHOOK_SECRET_HEADER,
	matchCustomLabel,
	matchInstantlyWebhook,
	verifyInstantlyWebhook,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const SECRET = 'instantly-hook-secret';

beforeEach(() => mockLog.mockClear());

function request(
	// unknown: payloads are arbitrary JSON in negative cases.
	payload: unknown,
	headers: Record<string, string> = {
		[INSTANTLY_WEBHOOK_SECRET_HEADER]: SECRET,
	},
	extra: { hubVerified?: boolean } = {},
) {
	return { payload, headers, rawBody: JSON.stringify(payload), ...extra };
}

// The fake context carries what handlers read: the webhook key.
function handle(
	webhook: { handler: (ctx: never, request: never) => Promise<unknown> },
	req: ReturnType<typeof request>,
	key = SECRET,
) {
	return webhook.handler({ key } as never, req as never) as Promise<{
		success: boolean;
		statusCode?: number;
		error?: string;
		// unknown: each event returns its own payload type.
		data?: Record<string, unknown>;
	}>;
}

describe('plugin matcher', () => {
	it('accepts the shape every Instantly delivery shares', () => {
		expect(
			matchInstantlyWebhook({
				headers: {},
				body: webhookPayload('email_sent'),
			}),
		).toBe(true);
		expect(
			matchInstantlyWebhook({
				headers: {},
				body: JSON.stringify(webhookPayload('reply_received')),
			}),
		).toBe(true);
	});

	it.each([
		[
			'an AgentMail event',
			{ type: 'event', event_type: 'message.received', event_id: 'e1' },
		],
		[
			'a Resend event',
			{ type: 'email.sent', created_at: '2026-10-28', data: {} },
		],
		[
			'no workspace',
			{ event_type: 'email_sent', timestamp: '2026-10-28T10:00:00Z' },
		],
		['a non-JSON string', 'not json'],
		['an array', [webhookPayload('email_sent')]],
	])('rejects %s', (_, body) => {
		expect(matchInstantlyWebhook({ headers: {}, body })).toBe(false);
	});
});

describe('event matchers', () => {
	it.each(
		Object.entries(INSTANTLY_WEBHOOK_EVENTS).flatMap(([event, types]) =>
			types.map((type) => [event, type] as const),
		),
	)('%s matches event_type %s and only that event', (event, type) => {
		const body = webhookPayload(type);
		for (const [other, otherTypes] of Object.entries(
			INSTANTLY_WEBHOOK_EVENTS,
		)) {
			expect(createInstantlyMatch(otherTypes)({ headers: {}, body })).toBe(
				other === event,
			);
		}
		expect(matchCustomLabel({ headers: {}, body })).toBe(false);
	});

	it('accepts link_clicked, the name in the payload guide, as a click', () => {
		const match = createInstantlyMatch(
			INSTANTLY_WEBHOOK_EVENTS.emailLinkClicked,
		);
		expect(match({ headers: {}, body: webhookPayload('link_clicked') })).toBe(
			true,
		);
		expect(
			match({ headers: {}, body: webhookPayload('email_link_clicked') }),
		).toBe(true);
	});

	it('routes an unknown event_type (a custom label) to customLabel', () => {
		const body = webhookPayload('Demo requested');
		expect(matchCustomLabel({ headers: {}, body })).toBe(true);
		expect(Events.customLabel.match({ headers: {}, body })).toBe(true);
	});
});

describe('verifyInstantlyWebhook', () => {
	const payload = webhookPayload('email_sent');

	it('accepts the secret header', () => {
		expect(verifyInstantlyWebhook(request(payload), SECRET)).toEqual({
			valid: true,
		});
	});

	it('matches the header name case-insensitively and takes the first value', () => {
		const req = {
			payload,
			headers: { 'X-Corsair-Webhook-Secret': [SECRET, 'other'] },
		};
		expect(verifyInstantlyWebhook(req, SECRET).valid).toBe(true);
	});

	it('accepts Authorization: Bearer <secret>', () => {
		const req = request(payload, { authorization: `Bearer ${SECRET}` });
		expect(verifyInstantlyWebhook(req, SECRET).valid).toBe(true);
	});

	it('rejects a wrong secret, including one of a different length', () => {
		for (const wrong of ['instantly-hook-secreX', 'short', `${SECRET}x`]) {
			expect(
				verifyInstantlyWebhook(
					request(payload, { [INSTANTLY_WEBHOOK_SECRET_HEADER]: wrong }),
					SECRET,
				),
			).toEqual({ valid: false, error: 'Invalid webhook secret' });
		}
	});

	it('rejects a delivery without the header', () => {
		expect(verifyInstantlyWebhook(request(payload, {}), SECRET)).toEqual({
			valid: false,
			error: `Missing ${INSTANTLY_WEBHOOK_SECRET_HEADER} header`,
		});
	});

	it('fails closed when no secret is configured', () => {
		const result = verifyInstantlyWebhook(request(payload), '');
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/No Instantly webhook secret/);
	});

	it('trusts a delivery Hub already verified', () => {
		expect(
			verifyInstantlyWebhook(request(payload, {}, { hubVerified: true }), ''),
		).toEqual({ valid: true });
	});
});

describe('webhook handlers', () => {
	it('returns a verified reply with its text and email_id', async () => {
		const result = await handle(Events.replyReceived, request(replyPayload));

		expect(result.success).toBe(true);
		expect(result.data).toMatchObject({
			event_type: 'reply_received',
			email_id: replyPayload.email_id,
			reply_text: 'Sounds good, send me times.',
			// Lead fields Instantly merges in are kept.
			firstName: 'Jordan',
		});
	});

	it('logs IDs only, never the lead email or reply text', async () => {
		await handle(Events.replyReceived, request(replyPayload));

		const [, event, payload] = mockLog.mock.calls[0] ?? [];
		expect(event).toBe('instantly.webhook.replyReceived');
		expect(payload).toEqual({
			eventType: 'reply_received',
			campaignId: replyPayload.campaign_id,
			step: 1,
			isFirst: true,
			emailId: replyPayload.email_id,
		});
		expect(JSON.stringify(payload)).not.toContain('@');
		expect(JSON.stringify(payload)).not.toContain('send me times');
	});

	it('answers 401 and logs nothing for a bad secret', async () => {
		const result = await handle(
			Events.leadInterested,
			request(webhookPayload('lead_interested'), {
				[INSTANTLY_WEBHOOK_SECRET_HEADER]: 'nope',
			}),
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('answers 400 for a payload missing required fields', async () => {
		const result = await handle(
			Events.emailBounced,
			request({ event_type: 'email_bounced', workspace: WORKSPACE_ID }),
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('accepts a step sent as a string', async () => {
		const result = await handle(
			Events.emailSent,
			request(webhookPayload('email_sent', { step: '2' })),
		);
		expect(result.success).toBe(true);
		expect(result.data?.step).toBe('2');
	});

	it.each([
		['emailOpened', 'email_opened'],
		['leadUnsubscribed', 'lead_unsubscribed'],
		['leadMeetingBooked', 'lead_meeting_booked'],
		['campaignCompleted', 'campaign_completed'],
		['accountError', 'account_error'],
		['customLabel', 'Demo requested'],
	] as const)('%s handles %s', async (name, type) => {
		const result = await handle(Events[name], request(webhookPayload(type)));
		expect(result).toMatchObject({ success: true, data: { event_type: type } });
	});
});

describe('tenant matcher', () => {
	it('routes by the workspace ID', () => {
		expect(
			matchInstantlyTenantWebhook({
				headers: {},
				body: webhookPayload('email_sent'),
			}),
		).toEqual({ linkType: 'tenant_external_id', externalId: WORKSPACE_ID });
	});

	it('returns null without a workspace', () => {
		expect(
			matchInstantlyTenantWebhook({ headers: {}, body: { event_type: 'x' } }),
		).toBeNull();
	});
});
