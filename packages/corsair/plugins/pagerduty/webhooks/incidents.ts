import { logEventFromContext } from '../../utils/events';
import type { PagerdutyWebhooks } from '..';
import type {
	IncidentAcknowledgedEvent,
	IncidentAssignedEvent,
	IncidentResolvedEvent,
	IncidentTriggeredEvent,
} from './types';
import {
	createPagerdutyMatch,
	verifyPagerdutyWebhookSignature,
} from './types';

export const triggered: PagerdutyWebhooks['incidentTriggered'] = {
	match: createPagerdutyMatch('incident.triggered'),

	handler: async (ctx, request) => {
		const verification = verifyPagerdutyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const message = request.payload.messages.find(
			(m) => m.event.event_type === 'incident.triggered',
		);

		if (!message) {
			return { success: true, data: undefined };
		}

		// narrowed by createPagerdutyMatch — safe to cast
		const event = message.event as IncidentTriggeredEvent;

		console.log('PagerDuty Incident Triggered:', {
			id: event.data.id,
			title: event.data.title,
		});

		let corsairEntityId = '';

		if (ctx.db.incidents && event.data.id) {
			try {
				const entity = await ctx.db.incidents.upsertByEntityId(event.data.id, {
					id: event.data.id,
					title: event.data.title,
					status: event.data.status,
					urgency: event.data.urgency,
					created_at: event.occurred_at ? new Date(event.occurred_at) : new Date(),
					updated_at: new Date(),
				});

				corsairEntityId = entity?.id ?? '';
			} catch (error) {
				console.warn('Failed to save incident to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'pagerduty.webhook.incidentTriggered',
			{ id: event.data.id, title: event.data.title },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const acknowledged: PagerdutyWebhooks['incidentAcknowledged'] = {
	match: createPagerdutyMatch('incident.acknowledged'),

	handler: async (ctx, request) => {
		const verification = verifyPagerdutyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const message = request.payload.messages.find(
			(m) => m.event.event_type === 'incident.acknowledged',
		);

		if (!message) {
			return { success: true, data: undefined };
		}

		// narrowed by createPagerdutyMatch — safe to cast
		const event = message.event as IncidentAcknowledgedEvent;

		console.log('PagerDuty Incident Acknowledged:', {
			id: event.data.id,
			title: event.data.title,
		});

		if (ctx.db.incidents && event.data.id) {
			try {
				await ctx.db.incidents.upsertByEntityId(event.data.id, {
					id: event.data.id,
					title: event.data.title,
					status: 'acknowledged',
					updated_at: new Date(),
				});
			} catch (error) {
				console.warn('Failed to update incident in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'pagerduty.webhook.incidentAcknowledged',
			{ id: event.data.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: event.data.id,
			data: event,
		};
	},
};

export const resolved: PagerdutyWebhooks['incidentResolved'] = {
	match: createPagerdutyMatch('incident.resolved'),

	handler: async (ctx, request) => {
		const verification = verifyPagerdutyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const message = request.payload.messages.find(
			(m) => m.event.event_type === 'incident.resolved',
		);

		if (!message) {
			return { success: true, data: undefined };
		}

		// narrowed by createPagerdutyMatch — safe to cast
		const event = message.event as IncidentResolvedEvent;

		console.log('PagerDuty Incident Resolved:', {
			id: event.data.id,
			title: event.data.title,
		});

		if (ctx.db.incidents && event.data.id) {
			try {
				await ctx.db.incidents.upsertByEntityId(event.data.id, {
					id: event.data.id,
					title: event.data.title,
					status: 'resolved',
					updated_at: new Date(),
					resolved_at: event.data.resolved_at
						? new Date(event.data.resolved_at)
						: new Date(),
				});
			} catch (error) {
				console.warn('Failed to update incident in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'pagerduty.webhook.incidentResolved',
			{ id: event.data.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: event.data.id,
			data: event,
		};
	},
};

export const assigned: PagerdutyWebhooks['incidentAssigned'] = {
	match: createPagerdutyMatch('incident.assigned'),

	handler: async (ctx, request) => {
		const verification = verifyPagerdutyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const message = request.payload.messages.find(
			(m) => m.event.event_type === 'incident.assigned',
		);

		if (!message) {
			return { success: true, data: undefined };
		}

		// narrowed by createPagerdutyMatch — safe to cast
		const event = message.event as IncidentAssignedEvent;

		console.log('PagerDuty Incident Assigned:', {
			id: event.data.id,
			title: event.data.title,
		});

		if (ctx.db.incidents && event.data.id) {
			try {
				await ctx.db.incidents.upsertByEntityId(event.data.id, {
					id: event.data.id,
					title: event.data.title,
					updated_at: new Date(),
				});
			} catch (error) {
				console.warn('Failed to update incident in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'pagerduty.webhook.incidentAssigned',
			{ id: event.data.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: event.data.id,
			data: event,
		};
	},
};
