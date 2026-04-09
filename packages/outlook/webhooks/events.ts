import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type {
	OutlookBoundEndpoints,
	OutlookContext,
	OutlookWebhooks,
} from '..';
import type {
	EventChangedEvent,
	EventCreatedEvent,
	OutlookWebhookPayload,
} from './types';
import { createOutlookMatch, verifyOutlookWebhookSignature } from './types';

// Matches calendar event resources: Users/{id}/Events/{id} or Calendars/{id}/Events/{id}
const EVENT_RESOURCE_PATTERN = /[Ee]vents\//;

function extractEventPathIdentifiers(resource: string | undefined): {
	userId?: string;
	calendarId?: string;
	eventId?: string;
} {
	if (!resource) return {};
	const segments = resource.split('/').filter(Boolean);
	const usersIndex = segments.findIndex(
		(segment) => segment.toLowerCase() === 'users',
	);
	const calendarsIndex = segments.findIndex(
		(segment) => segment.toLowerCase() === 'calendars',
	);
	const eventsIndex = segments.findIndex(
		(segment) => segment.toLowerCase() === 'events',
	);
	return {
		userId: usersIndex >= 0 ? segments[usersIndex + 1] : undefined,
		calendarId: calendarsIndex >= 0 ? segments[calendarsIndex + 1] : undefined,
		eventId: eventsIndex >= 0 ? segments[eventsIndex + 1] : undefined,
	};
}

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

export const newEvent: OutlookWebhooks['eventCreated'] = {
	match: createOutlookMatch(EVENT_RESOURCE_PATTERN, ['created']),

	handler: async (ctx, request) => {
		console.log('newEvent');
		const extracted = verifyAndExtract(ctx, request);
		console.log(extracted);
		if (!extracted.ok) return extracted.result;

		const { notification, entityId } = extracted;

		if (notification.changeType !== 'created') {
			return { success: true, data: undefined };
		}

		if (entityId) {
			try {
				const endpoints = ctx.endpoints as OutlookBoundEndpoints;
				const ids = extractEventPathIdentifiers(notification.resource);
				if (ids.eventId) {
					const input = ids.calendarId
						? {
								event_id: ids.eventId,
								calendar_id: ids.calendarId,
								...(ids.userId ? { user_id: ids.userId } : {}),
							}
						: {
								event_id: ids.eventId,
								...(ids.userId ? { user_id: ids.userId } : {}),
							};
					await endpoints.events.get(input);
				}
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
	match: createOutlookMatch(EVENT_RESOURCE_PATTERN, ['updated', 'deleted']),

	handler: async (ctx, request) => {
		console.log('eventChange');
		const extracted = verifyAndExtract(ctx, request);
		console.log(extracted);
		if (!extracted.ok) return extracted.result;

		const { notification, entityId } = extracted;

		if (entityId) {
			try {
				if (notification.changeType === 'deleted') {
					await ctx.db.events.deleteByEntityId(entityId);
				} else {
					const endpoints = ctx.endpoints as OutlookBoundEndpoints;
					const ids = extractEventPathIdentifiers(notification.resource);
					if (ids.eventId) {
						const input = ids.calendarId
							? {
									event_id: ids.eventId,
									calendar_id: ids.calendarId,
									...(ids.userId ? { user_id: ids.userId } : {}),
								}
							: {
									event_id: ids.eventId,
									...(ids.userId ? { user_id: ids.userId } : {}),
								};
						await endpoints.events.get(input);
					}
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
