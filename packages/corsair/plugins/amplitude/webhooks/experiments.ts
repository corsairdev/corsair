import { logEventFromContext } from '../../utils/events';
import type { AmplitudeWebhooks } from '..';
import { createAmplitudeMatch, verifyAmplitudeWebhookSignature } from './types';

export const exposure: AmplitudeWebhooks['experimentsExposure'] = {
	match: createAmplitudeMatch('experiment.exposure'),

	handler: async (ctx, request) => {
		const verification = verifyAmplitudeWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload.data;

		if (!event) {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';

		if (ctx.db.events) {
			try {
				const entityId = [
					event.flag_key,
					event.variant,
					String(event.time),
				].join(':');
				const entity = await ctx.db.events.upsertByEntityId(entityId, {
					...event,
					id: entityId,
					event_type: 'experiment.exposure',
					event_properties: {
						flag_key: event.flag_key,
						variant: event.variant,
						experiment_key: event.experiment_key,
						...event.metadata,
					},
					createdAt: new Date(event.time),
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn(
					'Failed to save experiment exposure event to database:',
					error,
				);
			}
		}

		if (ctx.db.users) {
			try {
				const userId = event.user.user_id ?? event.user.device_id;
				if (userId) {
					await ctx.db.users.upsertByEntityId(userId, {
						...event.user,
						id: userId,
						createdAt: new Date(event.time),
					});
				}
			} catch (error) {
				console.warn(
					'Failed to save user from experiment exposure to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'amplitude.webhook.experiments.exposure',
			{ ...event },
			'completed',
		);

		return { success: true, corsairEntityId, data: event };
	},
};
