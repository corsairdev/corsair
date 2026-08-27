import { logEventFromContext } from 'corsair/core';
import type { EmeliaWebhooks } from '..';
import { createEmeliaMatch } from './types';

export const statusUpdated: EmeliaWebhooks['campaignStatusUpdated'] = {
	match: createEmeliaMatch('campaign.status_updated'),
	handler: async (ctx, request) => {
		const event = request.payload;
		await logEventFromContext(
			ctx,
			'emelia.webhook.campaign.status_updated',
			{ event },
			'completed',
		);
		return {
			success: true,
			data: event,
		};
	},
};
