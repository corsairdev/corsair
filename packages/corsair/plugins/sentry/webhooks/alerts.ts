import { logEventFromContext } from '../../utils/events';
import type { SentryWebhooks } from '..';
import { createSentryMatch, verifySentryWebhookSignature } from './types';

export const eventAlert: SentryWebhooks['eventAlert'] = {
	match: createSentryMatch('event_alert', 'triggered'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const alertEvent = event.data.event;

		let corsairEntityId = '';

		if (ctx.db.events && alertEvent.event_id) {
			try {
				const entity = await ctx.db.events.upsertByEntityId(
					alertEvent.event_id,
					{
						eventID: alertEvent.event_id,
						title: alertEvent.title ?? null,
						message: alertEvent.message ?? null,
						platform: alertEvent.platform ?? null,
						type: alertEvent.level ?? null,
						dateCreated: null,
						dateReceived: null,
						groupID: null,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save event alert to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sentry.webhook.eventAlert',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const metricAlert: SentryWebhooks['metricAlert'] = {
	match: createSentryMatch('metric_alert', 'triggered'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const metricAlertData = event.data.metric_alert;

		let corsairEntityId = '';

		if (ctx.db.issues && metricAlertData.id) {
			try {
				const entity = await ctx.db.issues.upsertByEntityId(
					metricAlertData.id,
					{
						id: metricAlertData.id,
						shortId: metricAlertData.id,
						title:
							metricAlertData.alert_rule?.name ??
							event.data.description_title ??
							'Metric Alert',
						status: metricAlertData.status ?? 'triggered',
						level: null,
						culprit: null,
						permalink: null,
						platform: null,
						type: 'metric_alert',
						count: null,
						userCount: null,
						firstSeen: null,
						lastSeen: metricAlertData.date_triggered
							? new Date(metricAlertData.date_triggered)
							: null,
						isPublic: null,
						isBookmarked: null,
						hasSeen: null,
						isSubscribed: null,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save metric alert to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sentry.webhook.metricAlert',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
