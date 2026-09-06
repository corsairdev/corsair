import { logEventFromContext } from 'corsair/core';
import type { CannyWebhooks } from '../index';
import {
	CannyCommentCreatedEventSchema,
	createCannyMatch,
	verifyCannyWebhookSignature,
} from './types';

export const created: CannyWebhooks['commentCreated'] = {
	match: createCannyMatch('comment.created'),

	handler: async (ctx, request) => {
		const verification = verifyCannyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const parsed = CannyCommentCreatedEventSchema.safeParse(request.payload);
		if (!parsed.success) {
			if ((request.payload as { type?: string })?.type !== 'comment.created') {
				return { success: true, data: undefined };
			}
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid payload format',
			};
		}

		const event = parsed.data;
		const comment = event.object;
		if (ctx.db.comments && comment.id) {
			try {
				await ctx.db.comments.upsertByEntityId(comment.id, {
					id: comment.id,
					value: comment.value,
					created: new Date(comment.created),
					postID: comment.post?.id,
					authorID: comment.author?.id,
					parentID: comment.parentID,
					internal: comment.internal,
					likeCount: comment.likeCount,
					imageURLs: comment.imageURLs,
				});
			} catch (error) {
				console.warn('Failed to save comment to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'canny.webhook.comment.created',
			{ id: comment.id, postID: comment.post?.id },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const CommentWebhooks = {
	created,
};
