import { logEventFromContext } from '../../utils/events';
import type { DropboxBoundEndpoints, DropboxWebhooks } from '..';
import {
	createDropboxEventMatch,
	verifyDropboxWebhookSignature,
} from './types';

export const folderCreated: DropboxWebhooks['folderCreated'] = {
	match: createDropboxEventMatch('create_folder'),

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

		// Fetch the current folder tree and store new entries in the DB.
		// Dropbox webhooks only carry account IDs; we must call list_folder to
		// get the real folder metadata.
		try {
			// any cast needed because ctx.endpoints is untyped in webhook context
			const endpoints = ctx.endpoints as DropboxBoundEndpoints;
			await endpoints.folders.list({ path: '' });
		} catch (error) {
			console.warn('Failed to sync folders after folderCreated webhook:', error);
		}

		await logEventFromContext(
			ctx,
			'dropbox.webhook.folders.created',
			{ accounts },
			'completed',
		);

		return { success: true, data: notification };
	},
};

export const folderDeleted: DropboxWebhooks['folderDeleted'] = {
	match: createDropboxEventMatch('folder_delete'),

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

		// Resync so the DB reflects the post-deletion state of the folder tree.
		try {
			// any cast needed because ctx.endpoints is untyped in webhook context
			const endpoints = ctx.endpoints as DropboxBoundEndpoints;
			await endpoints.folders.list({ path: '' });
		} catch (error) {
			console.warn('Failed to sync folders after folderDeleted webhook:', error);
		}

		await logEventFromContext(
			ctx,
			'dropbox.webhook.folders.deleted',
			{ accounts },
			'completed',
		);

		return { success: true, data: notification };
	},
};
