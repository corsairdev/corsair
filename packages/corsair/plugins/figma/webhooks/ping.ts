import { logEventFromContext } from '../../utils/events';
import type { FigmaWebhooks } from '..';
import { createFigmaEventMatch, verifyFigmaWebhookPasscode } from './types';

export const ping: FigmaWebhooks['ping'] = {
	match: createFigmaEventMatch('PING'),

	handler: async (ctx, request) => {
		const passcode = ctx.key;
		const verification = verifyFigmaWebhookPasscode(request, passcode);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Passcode verification failed',
			};
		}

		const event = request.payload;

		if (event.event_type !== 'PING') {
			return {
				success: true,
				data: undefined,
			};
		}

		await logEventFromContext(
			ctx,
			'figma.webhook.ping',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
