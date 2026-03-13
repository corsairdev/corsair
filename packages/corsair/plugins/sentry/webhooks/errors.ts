import { logEventFromContext } from '../../utils/events';
import type { SentryWebhooks } from '..';
import { createSentryMatch, verifySentryWebhookSignature } from './types';

export const errorCreated: SentryWebhooks['errorCreated'] = {
	match: createSentryMatch('error', 'created'),

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
		const error = event.data.error;

		let corsairEntityId = '';

		if (ctx.db.events && error.event_id) {
			try {
				const entity = await ctx.db.events.upsertByEntityId(error.event_id, {
					eventID: error.event_id,
					title: error.title ?? null,
					message: error.message ?? null,
					platform: error.platform ?? null,
					type: error.level ?? null,
					dateCreated: null,
					dateReceived: null,
					groupID: null,
				});

				corsairEntityId = entity?.id || '';
			} catch (err) {
				console.warn('Failed to save error event to database:', err);
			}
		}

		await logEventFromContext(
			ctx,
			'sentry.webhook.errorCreated',
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
