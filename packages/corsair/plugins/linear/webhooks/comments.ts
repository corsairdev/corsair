import { logEventFromContext } from '../../utils/events';
import type { LinearWebhooks } from '..';
import { createLinearMatch } from './types';

export const commentCreate: LinearWebhooks['commentCreate'] = {
	match: createLinearMatch('Comment', 'create'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Comment' || event.action !== 'create') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('💬 Linear Comment Created Event:', {
			id: event.data.id,
			body: event.data.body?.substring(0, 100),
		});

		let corsairEntityId = '';

		if (ctx.db.comments && event.data.id) {
			try {
				const data = event.data;
				const entity = await ctx.db.comments.upsertByEntityId(data.id, {
					...data,
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save comment to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.commentCreate',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			tenantId: ctx.tenantId,
			data: event,
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
				data: undefined,
			};
		}

		console.log('✏️ Linear Comment Updated Event:', {
			id: event.data.id,
			updatedFields: event.updatedFrom ? Object.keys(event.updatedFrom) : [],
		});

		let corsairEntityId = '';

		if (ctx.db.comments && event.data.id) {
			try {
				const data = event.data;
				const entity = await ctx.db.comments.upsertByEntityId(data.id, {
					...data,
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update comment in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.commentUpdate',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			tenantId: ctx.tenantId,
			data: event,
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
				data: undefined,
			};
		}

		console.log('🗑️ Linear Comment Deleted Event:', {
			id: event.data.id,
		});

		let corsairEntityId = '';

		if (ctx.db.comments && event.data.id) {
			try {
				const entity = await ctx.db.comments.findByEntityId(event.data.id);
				if (entity) {
					corsairEntityId = entity.id;
				}
				await ctx.db.comments.deleteByEntityId(event.data.id);
			} catch (error) {
				console.warn('Failed to delete comment from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.commentRemove',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			tenantId: ctx.tenantId,
			data: event,
		};
	},
};
