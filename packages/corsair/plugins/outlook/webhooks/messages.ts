import { logEventFromContext } from '../../utils/events';
import type { OutlookWebhooks } from '..';
import type { MessageReceivedEvent, MessageSentEvent, OutlookWebhookPayload } from './types';
import { createOutlookMatch, verifyOutlookWebhookSignature } from './types';
import type { WebhookRequest } from '../../../core';
import type { OutlookContext } from '..';

// Matches inbox/message resources: Users/{id}/Messages/{id} or me/Messages/{id}
const MESSAGE_RESOURCE_PATTERN = /[Mm]essages\//;

// Matches sentItems resources
const SENT_ITEMS_RESOURCE_PATTERN = /[Mm]ailFolders\/[Ss]entItems\/[Mm]essages\//;

// ── Shared verification helper ────────────────────────────────────────────────

function verifyAndExtract(ctx: OutlookContext, request: WebhookRequest<OutlookWebhookPayload>) {
	const verification = verifyOutlookWebhookSignature(request, ctx.key);
	if (!verification.valid) {
		return {
			ok: false as const,
			result: {
				success: false as const,
				statusCode: 401,
				error: verification.error ?? 'Client state verification failed',
			},
		};
	}

	const notification = request.payload.value?.[0];
	if (!notification) {
		return { ok: false as const, result: { success: true as const, data: undefined } };
	}

	return { ok: true as const, notification, entityId: notification.resourceData?.id ?? '' };
}

// ── Webhook handlers ──────────────────────────────────────────────────────────

export const newMessage: OutlookWebhooks['messageReceived'] = {
	match: createOutlookMatch(MESSAGE_RESOURCE_PATTERN, ['created']),

	handler: async (ctx, request) => {
		const extracted = verifyAndExtract(ctx, request);
		if (!extracted.ok) return extracted.result;

		const { notification, entityId } = extracted;

		if (entityId && ctx.db.messages) {
			try {
				await ctx.db.messages.upsertByEntityId(entityId, { id: entityId });
			} catch (error) {
				console.warn('Failed to save received message to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'outlook.webhook.messageReceived',
			{ resource: notification.resource, changeType: notification.changeType },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: entityId,
			// changeType is 'created' — enforced by createOutlookMatch; cast narrows the union
			data: notification as MessageReceivedEvent,
		};
	},
};

export const sentMessage: OutlookWebhooks['messageSent'] = {
	match: createOutlookMatch(SENT_ITEMS_RESOURCE_PATTERN, ['created']),

	handler: async (ctx, request) => {
		const extracted = verifyAndExtract(ctx, request);
		if (!extracted.ok) return extracted.result;

		const { notification, entityId } = extracted;

		if (entityId && ctx.db.messages) {
			try {
				await ctx.db.messages.upsertByEntityId(entityId, {
					id: entityId,
					isDraft: false,
				});
			} catch (error) {
				console.warn('Failed to save sent message to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'outlook.webhook.messageSent',
			{ resource: notification.resource, changeType: notification.changeType },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: entityId,
			// changeType is 'created' — enforced by createOutlookMatch; cast narrows the union
			data: notification as MessageSentEvent,
		};
	},
};
