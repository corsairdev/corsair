import { logEventFromContext } from '../../utils/events';
import type { OnedriveBoundEndpoints, OnedriveWebhooks } from '..';
import { createOnedriveMatch } from './types';

export const driveNotification: OnedriveWebhooks['driveNotification'] = {
	match: createOnedriveMatch(),
	handler: async (ctx, request) => {
		const payload = request.payload;
		if (!payload?.value?.length) {
			return { success: true, data: { value: [] } };
		}

		if (ctx.db.driveItems) {
			// Type assertion so that the endpoints are the correct type
			const endpoints = ctx.endpoints as OnedriveBoundEndpoints;
			for (const notification of payload.value) {
				if (
					notification.resourceData?.id &&
					(notification.changeType === 'updated' || notification.changeType === 'created')
				) {
					try {
						// any/unknown for resourceData.id since Microsoft Graph notification resourceData is untyped
						const itemId = notification.resourceData.id as string;
						await endpoints.items.get({ item_id: itemId });
					} catch (error) {
						console.warn('onedrive webhook: failed to fetch drive item', error);
					}
				}
			}
		}

		await logEventFromContext(
			ctx,
			'onedrive.webhook.driveNotification',
			{ notification_count: payload.value.length },
			'completed',
		);

		return { success: true, data: payload };
	},
};
