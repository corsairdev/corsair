import { logEventFromContext } from 'corsair/core';
import type { DropboxBoundEndpoints, DropboxWebhooks } from '..';
import {
	createDropboxEventMatch,
	verifyDropboxWebhookSignature,
} from './types';

export const fileSystemChanged: DropboxWebhooks['fileSystemChanged'] = {
	match: createDropboxEventMatch('file_system_change'),

	handler: async (ctx, request) => {
		const verification = verifyDropboxWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const notification = request.payload;
		const accounts = notification.list_folder?.accounts ?? [];

		// Sync the full file system state after a change notification.
		// recursive: true returns all nested entries so renamed/updated files
		// inside subfolders are captured, not just the parent folder.
		// include_deleted: true ensures deletions are reflected in the DB.
		// Pagination: list_folder may return has_more=true; drain all pages
		// via list_folder/continue so no changes are missed.
		try {
			// any cast needed because ctx.endpoints is untyped in webhook context
			const endpoints = ctx.endpoints as DropboxBoundEndpoints;
			const first = await endpoints.folders.list({
				path: '',
				recursive: true,
				include_deleted: true,
			});
			let cursor = first.cursor;
			let hasMore = first.has_more;
			while (hasMore && cursor) {
				const page = await endpoints.folders.listContinue({ cursor });
				cursor = page.cursor;
				hasMore = page.has_more;
			}
		} catch (error) {
			console.warn('Failed to sync file system after webhook:', error);
		}

		await logEventFromContext(
			ctx,
			'dropbox.webhook.filesystem.changed',
			{ accounts },
			'completed',
		);

		return { success: true, data: notification };
	},
};
