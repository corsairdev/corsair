import { logEventFromContext } from 'corsair/core';
import type { FigmaWebhooks } from '..';
import { createFigmaEventMatch, verifyFigmaWebhookPasscode } from './types';

// This file is kept for backwards compatibility with the template structure.
// Real webhook handlers are implemented in their respective files (fileComment.ts, etc.)

export const example: FigmaWebhooks['ping'] = {
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

		await logEventFromContext(
			ctx,
			'figma.webhook.example',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
