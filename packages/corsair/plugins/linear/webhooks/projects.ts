import type { LinearWebhooks } from '..';
import type {
	ProjectCreatedEvent,
	ProjectDeletedEvent,
	ProjectUpdatedEvent,
} from './types';
import { createLinearMatch } from './types';

export const projectCreate: LinearWebhooks['projectCreate'] = {
	match: createLinearMatch('Project', 'create'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Project' || event.action !== 'create') {
			return {
				success: true,
				data: event as unknown as ProjectCreatedEvent,
			};
		}

		const projectEvent = event as ProjectCreatedEvent;

		console.log('📊 Linear Project Created Event:', {
			id: projectEvent.data.id,
			name: projectEvent.data.name,
			state: projectEvent.data.state,
		});

		if (ctx.db.projects && projectEvent.data.id) {
			try {
				const data = projectEvent.data;
				await ctx.db.projects.upsert(data.id, {
					...data,
					state: data.state as
						| 'planned'
						| 'started'
						| 'paused'
						| 'completed'
						| 'canceled',
					priority: data.priority,
					sortOrder: data.sortOrder,
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});
			} catch (error) {
				console.warn('Failed to save project to database:', error);
			}
		}

		return {
			success: true,
			data: projectEvent,
		};
	},
};

export const projectUpdate: LinearWebhooks['projectUpdate'] = {
	match: createLinearMatch('Project', 'update'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Project' || event.action !== 'update') {
			return {
				success: true,
				data: event as unknown as ProjectUpdatedEvent,
			};
		}

		const projectEvent = event as ProjectUpdatedEvent;

		console.log('📝 Linear Project Updated Event:', {
			id: projectEvent.data.id,
			name: projectEvent.data.name,
			updatedFields: projectEvent.updatedFrom
				? Object.keys(projectEvent.updatedFrom)
				: [],
		});

		if (ctx.db.projects && projectEvent.data.id) {
			try {
				const data = projectEvent.data;
				await ctx.db.projects.upsert(data.id, {
					...data,
					state: data.state as
						| 'planned'
						| 'started'
						| 'paused'
						| 'completed'
						| 'canceled',
					priority: data.priority,
					sortOrder: data.sortOrder,
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});
			} catch (error) {
				console.warn('Failed to update project in database:', error);
			}
		}

		return {
			success: true,
			data: projectEvent,
		};
	},
};

export const projectRemove: LinearWebhooks['projectRemove'] = {
	match: createLinearMatch('Project', 'remove'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Project' || event.action !== 'remove') {
			return {
				success: true,
				data: event as unknown as ProjectDeletedEvent,
			};
		}

		const projectEvent = event as ProjectDeletedEvent;

		console.log('🗑️ Linear Project Deleted Event:', {
			id: projectEvent.data.id,
			name: projectEvent.data.name,
		});

		if (ctx.db.projects && projectEvent.data.id) {
			try {
				await ctx.db.projects.deleteByEntityId(projectEvent.data.id);
			} catch (error) {
				console.warn('Failed to delete project from database:', error);
			}
		}

		return {
			success: true,
			data: projectEvent,
		};
	},
};
