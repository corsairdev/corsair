import { logEventFromContext } from '../../utils/events';
import type { AmplitudeWebhooks } from '..';
import { createAmplitudeMatch, verifyAmplitudeWebhookSignature } from './types';

export const alert: AmplitudeWebhooks['monitorsAlert'] = {
	match: createAmplitudeMatch('monitor.alert'),

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

		await logEventFromContext(
			ctx,
			'amplitude.webhook.monitors.alert',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
