import { logEventFromContext } from 'corsair/core';
import type { IntercomWebhooks } from '..';
import { createIntercomMatch } from './types';

// Handles the ping event Intercom sends when a webhook URL is first registered.
// Signature verification is intentionally skipped — Intercom sends the ping
// before the integration is fully set up, so no secret may be configured yet.
export const ping: IntercomWebhooks['ping'] = {
	match: createIntercomMatch('ping'),

	handler: async (ctx, request) => {
		const event = request.payload;

		await logEventFromContext(
			ctx,
			'intercom.webhook.ping',
			{ app_id: event.app_id },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
