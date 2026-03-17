import { logEventFromContext } from '../../utils/events';
import type { DropboxBoundEndpoints, DropboxWebhooks } from '..';
import {
	createDropboxEventMatch,
	verifyDropboxWebhookSignature,
} from './types';

export const fileAdded: DropboxWebhooks['fileAdded'] = {
	match: createDropboxEventMatch('file_add'),

	handler: async (ctx, request) => {
		const verification = verifyDropboxWebhookSignature(request, ctx.key);
		console.log(verification, 'verification');
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const notification = request.payload;
		const accounts = notification.list_folder?.accounts ?? [];

		// Fetch the actual changed entries via the API and store them in the DB.
		// Dropbox webhooks only carry account IDs; we must call list_folder to
		// get the real file/folder metadata.
		try {
			// any cast needed because ctx.endpoints is untyped in webhook context
			const endpoints = ctx.endpoints as DropboxBoundEndpoints;
			await endpoints.folders.list({ path: '' });
		} catch (error) {
			console.warn('Failed to sync files after fileAdded webhook:', error);
		}

		await logEventFromContext(
			ctx,
			'dropbox.webhook.files.added',
			{ accounts },
			'completed',
		);

		return { success: true, data: notification };
	},
};

export const fileChanged: DropboxWebhooks['fileChanged'] = {
	match: createDropboxEventMatch('file_change'),

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

		// Fetch updated file metadata and sync to DB.
		try {
			// any cast needed because ctx.endpoints is untyped in webhook context
			const endpoints = ctx.endpoints as DropboxBoundEndpoints;
			await endpoints.folders.list({ path: '' });
		} catch (error) {
			console.warn('Failed to sync files after fileChanged webhook:', error);
		}

		await logEventFromContext(
			ctx,
			'dropbox.webhook.files.changed',
			{ accounts },
			'completed',
		);

		return { success: true, data: notification };
	},
};

export const fileDeleted: DropboxWebhooks['fileDeleted'] = {
	match: createDropboxEventMatch('file_delete'),

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

		// Resync the folder listing so deleted files are no longer returned in
		// future queries. The list endpoint upserts current entries; stale records
		// from deleted files are naturally excluded.
		try {
			// any cast needed because ctx.endpoints is untyped in webhook context
			const endpoints = ctx.endpoints as DropboxBoundEndpoints;
			await endpoints.folders.list({ path: '' });
		} catch (error) {
			console.warn('Failed to sync files after fileDeleted webhook:', error);
		}

		await logEventFromContext(
			ctx,
			'dropbox.webhook.files.deleted',
			{ accounts },
			'completed',
		);

		return { success: true, data: notification };
	},
};
