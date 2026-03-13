import { logEventFromContext } from '../../utils/events';
import type { SentryWebhooks } from '..';
import { createSentryMatch, verifySentryWebhookSignature } from './types';

export const commentCreated: SentryWebhooks['commentCreated'] = {
	match: createSentryMatch('comment', 'created'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const comment = event.data;

		let corsairEntityId = '';

		if (ctx.db.comments && comment.comment_id) {
			try {
				const entity = await ctx.db.comments.upsertByEntityId(
					comment.comment_id,
					{
						comment_id: comment.comment_id,
						issue_id: comment.issue_id,
						project_slug: comment.project_slug,
						comment: comment.comment,
						timestamp: comment.timestamp ? new Date(comment.timestamp) : null,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save comment to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sentry.webhook.commentCreated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const commentUpdated: SentryWebhooks['commentUpdated'] = {
	match: createSentryMatch('comment', 'updated'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const comment = event.data;

		let corsairEntityId = '';

		if (ctx.db.comments && comment.comment_id) {
			try {
				const entity = await ctx.db.comments.upsertByEntityId(
					comment.comment_id,
					{
						comment_id: comment.comment_id,
						issue_id: comment.issue_id,
						project_slug: comment.project_slug,
						comment: comment.comment,
						timestamp: comment.timestamp ? new Date(comment.timestamp) : null,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update comment in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sentry.webhook.commentUpdated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const commentDeleted: SentryWebhooks['commentDeleted'] = {
	match: createSentryMatch('comment', 'deleted'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const comment = event.data;

		if (ctx.db.comments && comment.comment_id) {
			try {
				await ctx.db.comments.deleteByEntityId(comment.comment_id);
			} catch (error) {
				console.warn('Failed to delete comment from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sentry.webhook.commentDeleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
