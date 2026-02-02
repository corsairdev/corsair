import { logEventFromContext } from '../../utils/events';
import type { LinearWebhooks } from '..';
import { createLinearMatch } from './types';

export const issueCreate: LinearWebhooks['issueCreate'] = {
	match: createLinearMatch('Issue', 'create'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Issue' || event.action !== 'create') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📋 Linear Issue Created Event:', {
			id: event.data.id,
			identifier: event.data.identifier,
			title: event.data.title,
		});

		if (ctx.db.issues && event.data.id) {
			try {
				const data = event.data;
				await ctx.db.issues.upsert(data.id, {
					...data,
					priority: data.priority as 0 | 1 | 2 | 3 | 4,
					number: parseInt(data.identifier.split('-')[1] || '0', 10),
					url: event.url,
					stateId: (data as { stateId?: string }).stateId || '',
					teamId: (data as { teamId?: string }).teamId || '',
					creatorId: (data as { creatorId?: string }).creatorId || '',
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});
			} catch (error) {
				console.warn('Failed to save issue to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.issueCreate',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const issueUpdate: LinearWebhooks['issueUpdate'] = {
	match: createLinearMatch('Issue', 'update'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Issue' || event.action !== 'update') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📝 Linear Issue Updated Event:', {
			id: event.data.id,
			identifier: event.data.identifier,
			title: event.data.title,
			updatedFields: event.updatedFrom
				? Object.keys(event.updatedFrom)
				: [],
		});

		if (ctx.db.issues && event.data.id) {
			try {
				const data = event.data;
				await ctx.db.issues.upsert(data.id, {
					...data,
					priority: data.priority,
					number: parseInt(data.identifier.split('-')[1] || '0', 10),
					url: event.url,
					stateId: (data as { stateId?: string }).stateId || '',
					teamId: (data as { teamId?: string }).teamId || '',
					creatorId: (data as { creatorId?: string }).creatorId || '',
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});
			} catch (error) {
				console.warn('Failed to update issue in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.issueUpdate',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const issueRemove: LinearWebhooks['issueRemove'] = {
	match: createLinearMatch('Issue', 'remove'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Issue' || event.action !== 'remove') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('🗑️ Linear Issue Deleted Event:', {
			id: event.data.id,
			identifier: event.data.identifier,
		});

		if (ctx.db.issues && event.data.id) {
			try {
				await ctx.db.issues.deleteByEntityId(event.data.id);
			} catch (error) {
				console.warn('Failed to delete issue from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.issueRemove',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
