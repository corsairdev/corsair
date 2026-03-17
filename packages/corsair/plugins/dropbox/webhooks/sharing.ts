import { logEventFromContext } from '../../utils/events';
import type { DropboxBoundEndpoints, DropboxWebhooks } from '..';
import {
	createDropboxEventMatch,
	verifyDropboxWebhookSignature,
} from './types';

export const shareLinkCreated: DropboxWebhooks['shareLinkCreated'] = {
	match: createDropboxEventMatch('share_link_create'),

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

		// Sync the folder listing so files involved in the new share link are
		// up-to-date in the DB. Dropbox webhooks carry no share link metadata
		// directly; list_folder surfaces the current file state.
		try {
			// any cast needed because ctx.endpoints is untyped in webhook context
			const endpoints = ctx.endpoints as DropboxBoundEndpoints;
			await endpoints.folders.list({ path: '' });
		} catch (error) {
			console.warn('Failed to sync files after shareLinkCreated webhook:', error);
		}

		await logEventFromContext(
			ctx,
			'dropbox.webhook.sharing.linkCreated',
			{ accounts },
			'completed',
		);

		return { success: true, data: notification };
	},
};
