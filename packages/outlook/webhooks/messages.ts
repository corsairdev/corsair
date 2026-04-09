import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type {
	OutlookBoundEndpoints,
	OutlookContext,
	OutlookWebhooks,
} from '..';
import type {
	MessageReceivedEvent,
	MessageSentEvent,
	OutlookWebhookPayload,
} from './types';
import { createOutlookMatch, verifyOutlookWebhookSignature } from './types';

const MESSAGE_RESOURCE_PATTERN = /[Mm]essages\//;

const SENT_ITEMS_RESOURCE_PATTERN =
	/[Mm]ailFolders\/[Ss]entItems\/[Mm]essages\//;

// ── Shared verification helper ────────────────────────────────────────────────

function verifyAndExtract(
	ctx: OutlookContext,
	request: WebhookRequest<OutlookWebhookPayload>,
) {
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
		return {
			ok: false as const,
			result: { success: true as const, data: undefined },
		};
	}

	return {
		ok: true as const,
		notification,
		entityId: notification.resourceData?.id ?? '',
	};
}

// ── Webhook handlers ──────────────────────────────────────────────────────────

export const newMessage: OutlookWebhooks['messageReceived'] = {
	match: createOutlookMatch(MESSAGE_RESOURCE_PATTERN, ['created'], {
		excludeResourcePatterns: [SENT_ITEMS_RESOURCE_PATTERN],
	}),

	handler: async (ctx, request) => {
		const extracted = verifyAndExtract(ctx, request);
		if (!extracted.ok) return extracted.result;

		const { notification, entityId } = extracted;

		if (entityId) {
			try {
				const endpoints = ctx.endpoints as OutlookBoundEndpoints;
				await endpoints.messages.get({ message_id: entityId });
			} catch (error) {
				console.warn('Failed to fetch received message details:', error);
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

		if (entityId) {
			try {
				const endpoints = ctx.endpoints as OutlookBoundEndpoints;
				await endpoints.messages.get({ message_id: entityId });
			} catch (error) {
				console.warn('Failed to fetch sent message details:', error);
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
