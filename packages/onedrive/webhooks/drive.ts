import { logEventFromContext } from 'corsair/core';
import type { OnedriveBoundEndpoints, OnedriveWebhooks } from '..';
import { createOnedriveMatch, verifyOnedriveClientState } from './types';

export const driveNotification: OnedriveWebhooks['driveNotification'] = {
	match: createOnedriveMatch(),
	handler: async (ctx, request) => {
		const payload = request.payload;
		if (!payload?.value?.length) {
			return { success: true, data: { value: [] } };
		}
		for (const notification of payload.value) {
			const verification = verifyOnedriveClientState(notification, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error:
						verification.error || 'OneDrive clientState verification failed',
				};
			}
		}

		if (ctx.db.driveItems) {
			// Type assertion so that the endpoints are the correct type
			const endpoints = ctx.endpoints as OnedriveBoundEndpoints;
			let shouldRunDeltaSync = false;
			for (const notification of payload.value) {
				if (
					notification.resourceData?.id &&
					(notification.changeType === 'updated' ||
						notification.changeType === 'created')
				) {
					try {
						// any/unknown for resourceData.id since Microsoft Graph notification resourceData is untyped
						const itemId = notification.resourceData.id as string;
						await endpoints.items.get({ item_id: itemId });
					} catch (error) {
						console.warn('onedrive webhook: failed to fetch drive item', error);
					}
				} else if (
					notification.changeType === 'updated' ||
					notification.changeType === 'created'
				) {
					shouldRunDeltaSync = true;
				}
			}
			if (shouldRunDeltaSync) {
				try {
					const changes = await endpoints.drive.listChanges({ top: 200 });
					for (const item of changes.value || []) {
						const driveItem = item as Record<string, unknown>;
						const itemId = driveItem.id;
						if (!itemId || typeof itemId !== 'string') {
							continue;
						}
						if (driveItem.deleted) {
							continue;
						}
						await ctx.db.driveItems.upsertByEntityId(
							itemId,
							// DB schema requires name:string but delta item has name as optional; cast after spread to satisfy types while capturing passthrough fields
							{ ...driveItem } as Parameters<
								typeof ctx.db.driveItems.upsertByEntityId
							>[1],
						);
					}
				} catch (error) {
					console.warn('onedrive webhook: delta sync failed', error);
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
