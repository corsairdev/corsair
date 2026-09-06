import { logEventFromContext } from 'corsair/core';
import type { CannyWebhooks } from '../index';
import { createCannyMatch, verifyCannyWebhookSignature } from './types';

export const created: CannyWebhooks['postCreated'] = {
	match: createCannyMatch('post.created'),

	handler: async (ctx, request) => {
		const verification = verifyCannyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'post.created') {
			return { success: true, data: undefined };
		}

		const post = event.object;
		if (ctx.db.posts && post.id) {
			try {
				await ctx.db.posts.upsertByEntityId(post.id, {
					id: post.id,
					title: post.title,
					details: post.details,
					score: post.score,
					status: post.status,
					created: new Date(post.created),
					url: post.url,
					commentCount: post.commentCount,
					eta: post.eta,
					imageURLs: post.imageURLs,
					boardID: post.board?.id,
					authorID: post.author?.id,
				});
			} catch (error) {
				console.warn('Failed to save post to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'canny.webhook.post.created',
			{ id: post.id, title: post.title },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const statusChanged: CannyWebhooks['postStatusChanged'] = {
	match: createCannyMatch('post.status_changed'),

	handler: async (ctx, request) => {
		const verification = verifyCannyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'post.status_changed') {
			return { success: true, data: undefined };
		}

		const post = event.object;
		if (ctx.db.posts && post.id) {
			try {
				await ctx.db.posts.upsertByEntityId(post.id, {
					id: post.id,
					title: post.title,
					details: post.details,
					score: post.score,
					status: post.status,
					created: new Date(post.created),
					url: post.url,
					commentCount: post.commentCount,
					eta: post.eta,
					imageURLs: post.imageURLs,
					boardID: post.board?.id,
					authorID: post.author?.id,
				});
			} catch (error) {
				console.warn('Failed to update post in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'canny.webhook.post.status_changed',
			{ id: post.id, status: post.status },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const PostWebhooks = {
	created,
	statusChanged,
};
