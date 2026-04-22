import { logEventFromContext } from 'corsair/core';
import type { AmplitudeWebhooks } from '../index';
import { createAmplitudeMatch, verifyAmplitudeWebhookSignature } from './types';

export const computed: AmplitudeWebhooks['cohortsComputed'] = {
	match: createAmplitudeMatch('cohort.computed'),

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

		if (ctx.db.cohorts) {
			try {
				const entity = await ctx.db.cohorts.upsertByEntityId(event.cohort_id, {
					...event,
					name: event.cohort_name,
					id: event.cohort_id,
					last_computed: event.computed_at
						? new Date(event.computed_at).getTime()
						: undefined,
					createdAt: new Date(event.computed_at),
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save cohort to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'amplitude.webhook.cohorts.computed',
			{ ...event },
			'completed',
		);

		return { success: true, corsairEntityId, data: event };
	},
};
