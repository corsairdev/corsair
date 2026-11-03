import type { CorsairWebhook, CorsairWebhookMatcher } from 'corsair/core';
import type { z } from 'zod';
import type { InstantlyContext } from '..';
import { safeLog } from '../endpoints/call';
import type { InstantlyWebhookPayload } from './types';
import {
	createInstantlyMatch,
	INSTANTLY_WEBHOOK_EVENTS as EVENTS,
	matchOtherEvent,
	InstantlyWebhookEventSchemas as Schemas,
	verifyInstantlyWebhook,
} from './types';

/**
 * One handler per Corsair webhook path: verify the secret header, parse the
 * payload, log IDs only (payloads carry lead emails and reply text) and
 * return the event. A logging failure does not fail the delivery.
 */
function handlerFor<S extends z.ZodType<InstantlyWebhookPayload>>(
	event: string,
	schema: S,
	match: CorsairWebhookMatcher,
): CorsairWebhook<InstantlyContext, InstantlyWebhookPayload, z.output<S>> {
	return {
		match,
		handler: async (ctx, request) => {
			const verification = verifyInstantlyWebhook(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Webhook verification failed',
				};
			}

			const parsed = schema.safeParse(request.payload);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: `Invalid Instantly ${event} payload`,
				};
			}

			const data = parsed.data;
			await safeLog(ctx, `instantly.webhook.${event}`, () => ({
				eventType: data.event_type,
				campaignId: data.campaign_id,
				step: data.step,
				isFirst: data.is_first,
				emailId: data.email_id,
			}));

			return { success: true, data };
		},
	};
}

function known<S extends z.ZodType<InstantlyWebhookPayload>>(
	event: string,
	schema: S,
	eventTypes: readonly string[],
) {
	return handlerFor(event, schema, createInstantlyMatch(eventTypes));
}

export const emailSent = known(
	'emailSent',
	Schemas.emailSent,
	EVENTS.emailSent,
);
export const emailOpened = known(
	'emailOpened',
	Schemas.emailOpened,
	EVENTS.emailOpened,
);
export const emailLinkClicked = known(
	'emailLinkClicked',
	Schemas.emailLinkClicked,
	EVENTS.emailLinkClicked,
);
export const emailBounced = known(
	'emailBounced',
	Schemas.emailBounced,
	EVENTS.emailBounced,
);
export const replyReceived = known(
	'replyReceived',
	Schemas.replyReceived,
	EVENTS.replyReceived,
);
export const autoReplyReceived = known(
	'autoReplyReceived',
	Schemas.autoReplyReceived,
	EVENTS.autoReplyReceived,
);
export const leadUnsubscribed = known(
	'leadUnsubscribed',
	Schemas.leadUnsubscribed,
	EVENTS.leadUnsubscribed,
);
export const leadInterested = known(
	'leadInterested',
	Schemas.leadInterested,
	EVENTS.leadInterested,
);
export const leadNotInterested = known(
	'leadNotInterested',
	Schemas.leadNotInterested,
	EVENTS.leadNotInterested,
);
export const leadNeutral = known(
	'leadNeutral',
	Schemas.leadNeutral,
	EVENTS.leadNeutral,
);
export const leadMeetingBooked = known(
	'leadMeetingBooked',
	Schemas.leadMeetingBooked,
	EVENTS.leadMeetingBooked,
);
export const leadMeetingCompleted = known(
	'leadMeetingCompleted',
	Schemas.leadMeetingCompleted,
	EVENTS.leadMeetingCompleted,
);
export const leadClosed = known(
	'leadClosed',
	Schemas.leadClosed,
	EVENTS.leadClosed,
);
export const leadOutOfOffice = known(
	'leadOutOfOffice',
	Schemas.leadOutOfOffice,
	EVENTS.leadOutOfOffice,
);
export const leadWrongPerson = known(
	'leadWrongPerson',
	Schemas.leadWrongPerson,
	EVENTS.leadWrongPerson,
);
export const leadNoShow = known(
	'leadNoShow',
	Schemas.leadNoShow,
	EVENTS.leadNoShow,
);
export const campaignCompleted = known(
	'campaignCompleted',
	Schemas.campaignCompleted,
	EVENTS.campaignCompleted,
);
export const accountError = known(
	'accountError',
	Schemas.accountError,
	EVENTS.accountError,
);
// Custom lead labels (event_type is the label's name) and event types this
// plugin does not know yet. Check event_type before acting.
export const otherEvent = handlerFor('other', Schemas.other, matchOtherEvent);
