import type { WebhookRequest } from 'corsair/core';
import type { InboxkitContext, InboxkitWebhooks } from '..';
import { safeLog } from '../endpoints/call';
import { saveDomains, saveMailboxes } from '../endpoints/store';
import {
	ClientIdRequestStatusChangedEventSchema,
	ConsentRequestStatusChangedEventSchema,
	DomainStatusChangedEventSchema,
	INBOXKIT_EVENTS,
	MailboxStatusChangedEventSchema,
	matchEvent,
	removeCredentials,
	verifyInboxkitSignature,
} from './types';

/**
 * Every refusal here throws. processWebhook acknowledges a returned refusal as
 * success, which would lose the delivery; a throw makes it report a failure, so
 * the HTTP handler can answer 500 and InboxKit tries again. (InboxKit gives up at
 * once on a 401, so don't answer one: a key being rotated would lose deliveries.)
 */
function assertVerified(
	ctx: InboxkitContext,
	request: Pick<WebhookRequest, 'headers' | 'hubVerified'>,
): void {
	if (request.hubVerified === true) return;
	const verification = verifyInboxkitSignature(request.headers, ctx.key ?? '');
	if (!verification.valid) {
		throw new Error(`InboxKit webhook refused: ${verification.error}`);
	}
}

/**
 * Runs first in every handler, before verifying: a delivery refused because the
 * key was just rotated is still a real one, and processWebhook hands its body back
 * either way.
 */
function scrub(request: WebhookRequest): void {
	removeCredentials(request.payload);
	if (request.rawBody !== undefined) {
		request.rawBody = JSON.stringify(request.payload);
	}
}

function refuseShape(): never {
	throw new Error(
		'InboxKit webhook refused: the delivery does not match the webhook envelope',
	);
}

export const domainStatusChanged: InboxkitWebhooks['domainStatusChanged'] = {
	match: matchEvent(INBOXKIT_EVENTS.domain),
	handler: async (ctx, request) => {
		scrub(request);
		assertVerified(ctx, request);
		const parsed = DomainStatusChangedEventSchema.safeParse(request.payload);
		if (!parsed.success) refuseShape();
		const event = parsed.data;
		await saveDomains(
			ctx,
			[event.data.domain],
			event.data.metadata?.workspace_uid,
		);
		await safeLog(ctx, 'inboxkit.webhook.domains.statusChanged', {
			uid: event.data.domain.uid,
			status: event.data.domain.status ?? undefined,
		});
		return { success: true, data: event };
	},
};

export const mailboxStatusChanged: InboxkitWebhooks['mailboxStatusChanged'] = {
	match: matchEvent(INBOXKIT_EVENTS.mailbox),
	handler: async (ctx, request) => {
		scrub(request);
		assertVerified(ctx, request);
		const parsed = MailboxStatusChangedEventSchema.safeParse(request.payload);
		if (!parsed.success) refuseShape();
		const event = parsed.data;
		await saveMailboxes(
			ctx,
			[
				{
					...event.data.mailbox,
					domain_name: event.data.metadata?.domain_name ?? undefined,
				},
			],
			event.data.metadata?.workspace_uid,
		);
		await safeLog(ctx, 'inboxkit.webhook.mailboxes.statusChanged', {
			uid: event.data.mailbox.uid,
			status: event.data.mailbox.status ?? undefined,
		});
		return { success: true, data: event };
	},
};

export const consentRequestStatusChanged: InboxkitWebhooks['consentRequestStatusChanged'] =
	{
		match: matchEvent(INBOXKIT_EVENTS.consentRequest),
		handler: async (ctx, request) => {
			scrub(request);
			assertVerified(ctx, request);
			const parsed = ConsentRequestStatusChangedEventSchema.safeParse(
				request.payload,
			);
			if (!parsed.success) refuseShape();
			const event = parsed.data;
			await safeLog(ctx, 'inboxkit.webhook.consentRequests.statusChanged', {
				uid: event.data.consent_request.uid,
				status: event.data.consent_request.status ?? undefined,
			});
			return { success: true, data: event };
		},
	};

export const clientIdRequestStatusChanged: InboxkitWebhooks['clientIdRequestStatusChanged'] =
	{
		match: matchEvent(INBOXKIT_EVENTS.clientIdRequest),
		handler: async (ctx, request) => {
			scrub(request);
			assertVerified(ctx, request);
			const parsed = ClientIdRequestStatusChangedEventSchema.safeParse(
				request.payload,
			);
			if (!parsed.success) refuseShape();
			const event = parsed.data;
			await safeLog(ctx, 'inboxkit.webhook.clientIdRequests.statusChanged', {
				uid: event.data.client_id_request.uid,
				status: event.data.client_id_request.status ?? undefined,
			});
			return { success: true, data: event };
		},
	};

export const StatusWebhooks = {
	domainStatusChanged,
	mailboxStatusChanged,
	consentRequestStatusChanged,
	clientIdRequestStatusChanged,
};
