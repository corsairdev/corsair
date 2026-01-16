import type { LinearWebhooks } from '..';
import type {
	CommentCreatedEvent,
	CommentDeletedEvent,
	CommentUpdatedEvent,
} from './types';
import { createLinearMatch } from './types';

export const commentCreate: LinearWebhooks['commentCreate'] = {
	match: createLinearMatch('Comment', 'create'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Comment' || event.action !== 'create') {
			return {
				success: true,
				data: {},
			};
		}

		const commentEvent = event as CommentCreatedEvent;

		console.log('💬 Linear Comment Created Event:', {
			id: commentEvent.data.id,
			body: commentEvent.data.body?.substring(0, 100),
		});

		if (ctx.db.comments && commentEvent.data.id) {
			try {
				const data = commentEvent.data;
				await ctx.db.comments.upsert(data.id, {
					...data,
					issueId: (data as { issueId?: string }).issueId || '',
					userId: (data as { userId?: string }).userId || '',
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});
			} catch (error) {
				console.warn('Failed to save comment to database:', error);
			}
		}

		return {
			success: true,
			data: {},
		};
	},
};

export const commentUpdate: LinearWebhooks['commentUpdate'] = {
	match: createLinearMatch('Comment', 'update'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Comment' || event.action !== 'update') {
			return {
				success: true,
				data: {},
			};
		}

		const commentEvent = event as CommentUpdatedEvent;

		console.log('✏️ Linear Comment Updated Event:', {
			id: commentEvent.data.id,
			updatedFields: commentEvent.updatedFrom
				? Object.keys(commentEvent.updatedFrom)
				: [],
		});

		if (ctx.db.comments && commentEvent.data.id) {
			try {
				const data = commentEvent.data;
				await ctx.db.comments.upsert(data.id, {
					...data,
					issueId: (data as { issueId?: string }).issueId || '',
					userId: (data as { userId?: string }).userId || '',
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});
			} catch (error) {
				console.warn('Failed to update comment in database:', error);
			}
		}

		return {
			success: true,
			data: {},
		};
	},
};

export const commentRemove: LinearWebhooks['commentRemove'] = {
	match: createLinearMatch('Comment', 'remove'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Comment' || event.action !== 'remove') {
			return {
				success: true,
				data: {},
			};
		}

		const commentEvent = event as CommentDeletedEvent;

		console.log('🗑️ Linear Comment Deleted Event:', {
			id: commentEvent.data.id,
		});

		if (ctx.db.comments && commentEvent.data.id) {
			try {
				await ctx.db.comments.deleteByResourceId(commentEvent.data.id);
			} catch (error) {
				console.warn('Failed to delete comment from database:', error);
			}
		}

		return {
			success: true,
			data: {},
		};
	},
};
