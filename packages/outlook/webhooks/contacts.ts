import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type {
	OutlookBoundEndpoints,
	OutlookContext,
	OutlookWebhooks,
} from '..';
import type { ContactCreatedEvent, OutlookWebhookPayload } from './types';
import { createOutlookMatch, verifyOutlookWebhookSignature } from './types';

// Matches contact resources: Users/{id}/Contacts/{id}
const CONTACT_RESOURCE_PATTERN = /[Cc]ontacts\//;

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

export const newContact: OutlookWebhooks['contactCreated'] = {
	match: createOutlookMatch(CONTACT_RESOURCE_PATTERN, ['created']),

	handler: async (ctx, request) => {
		const extracted = verifyAndExtract(ctx, request);
		if (!extracted.ok) return extracted.result;

		const { notification, entityId } = extracted;

		if (notification.changeType !== 'created') {
			return { success: true, data: undefined };
		}

		if (entityId) {
			try {
				const endpoints = ctx.endpoints as OutlookBoundEndpoints;
				const escapedEntityId = entityId.replace(/'/g, "''");
				await endpoints.contacts.list({
					top: 1,
					filter: `id eq '${escapedEntityId}'`,
				});
			} catch (error) {
				console.warn('Failed to fetch new contact details:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'outlook.webhook.contactCreated',
			{ resource: notification.resource, changeType: notification.changeType },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: entityId,
			// changeType checked to be 'created' above; cast narrows from the broader union
			data: notification as ContactCreatedEvent,
		};
	},
};
