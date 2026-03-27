import { logEventFromContext } from '../../utils/events';
import type { OutlookBoundEndpoints, OutlookWebhooks } from '..';
import type { EventCreatedEvent, EventChangedEvent, OutlookWebhookPayload } from './types';
import { createOutlookMatch, verifyOutlookWebhookSignature } from './types';
import type { WebhookRequest } from '../../../core';
import type { OutlookContext } from '..';

// Matches calendar event resources: Users/{id}/Events/{id} or Calendars/{id}/Events/{id}
const EVENT_RESOURCE_PATTERN = /[Ee]vents\//;

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

export const newEvent: OutlookWebhooks['eventCreated'] = {
	match: createOutlookMatch(EVENT_RESOURCE_PATTERN, ['created']),

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
				await endpoints.events.list({ top: 1, filter: `id eq '${escapedEntityId}'` });
			} catch (error) {
				console.warn('Failed to fetch new event details:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'outlook.webhook.eventCreated',
			{ resource: notification.resource, changeType: notification.changeType },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: entityId,
			// changeType checked to be 'created' above; cast narrows from the broader union
			data: notification as EventCreatedEvent,
		};
	},
};

export const eventChange: OutlookWebhooks['eventChanged'] = {
	match: createOutlookMatch(EVENT_RESOURCE_PATTERN, ['created', 'updated', 'deleted']),

	handler: async (ctx, request) => {
		const extracted = verifyAndExtract(ctx, request);
		if (!extracted.ok) return extracted.result;

		const { notification, entityId } = extracted;

		if (entityId) {
			try {
				if (notification.changeType === 'deleted') {
					await ctx.db.events.deleteByEntityId(entityId);
				} else {
					const endpoints = ctx.endpoints as OutlookBoundEndpoints;
					const escapedEntityId = entityId.replace(/'/g, "''");
					await endpoints.events.list({ top: 1, filter: `id eq '${escapedEntityId}'` });
				}
			} catch (error) {
				console.warn('Failed to update event in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'outlook.webhook.eventChanged',
			{ resource: notification.resource, changeType: notification.changeType },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: entityId,
			// changeType is 'created' | 'updated' | 'deleted' — enforced by createOutlookMatch; cast is safe
			data: notification as EventChangedEvent,
		};
	},
};
