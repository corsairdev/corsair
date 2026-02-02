import type { LinearWebhooks } from '..';
import type {
	IssueCreatedEvent,
	IssueDeletedEvent,
	IssueUpdatedEvent,
} from './types';
import { createLinearMatch } from './types';

export const issueCreate: LinearWebhooks['issueCreate'] = {
	match: createLinearMatch('Issue', 'create'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Issue' || event.action !== 'create') {
			return {
				success: true,
				data: {},
			};
		}

		const issueEvent = event as IssueCreatedEvent;

		console.log('📋 Linear Issue Created Event:', {
			id: issueEvent.data.id,
			identifier: issueEvent.data.identifier,
			title: issueEvent.data.title,
		});

		if (ctx.db.issues && issueEvent.data.id) {
			try {
				const data = issueEvent.data;
				await ctx.db.issues.upsert(data.id, {
					...data,
					priority: data.priority as 0 | 1 | 2 | 3 | 4,
					number: parseInt(data.identifier.split('-')[1] || '0', 10),
					url: issueEvent.url,
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

		return {
			success: true,
			data: {},
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
				data: {},
			};
		}

		const issueEvent = event as IssueUpdatedEvent;

		console.log('📝 Linear Issue Updated Event:', {
			id: issueEvent.data.id,
			identifier: issueEvent.data.identifier,
			title: issueEvent.data.title,
			updatedFields: issueEvent.updatedFrom
				? Object.keys(issueEvent.updatedFrom)
				: [],
		});

		if (ctx.db.issues && issueEvent.data.id) {
			try {
				const data = issueEvent.data;
				await ctx.db.issues.upsert(data.id, {
					...data,
					priority: data.priority,
					number: parseInt(data.identifier.split('-')[1] || '0', 10),
					url: issueEvent.url,
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

		return {
			success: true,
			data: {},
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
				data: {},
			};
		}

		const issueEvent = event as IssueDeletedEvent;

		console.log('🗑️ Linear Issue Deleted Event:', {
			id: issueEvent.data.id,
			identifier: issueEvent.data.identifier,
		});

		if (ctx.db.issues && issueEvent.data.id) {
			try {
				await ctx.db.issues.deleteByEntityId(issueEvent.data.id);
			} catch (error) {
				console.warn('Failed to delete issue from database:', error);
			}
		}

		return {
			success: true,
			data: {},
		};
	},
};
