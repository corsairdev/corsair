import { logEventFromContext } from '../../utils/events';
import type { LinearWebhooks } from '..';
import { createLinearMatch } from './types';

export const projectCreate: LinearWebhooks['projectCreate'] = {
	match: createLinearMatch('Project', 'create'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Project' || event.action !== 'create') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📊 Linear Project Created Event:', {
			id: event.data.id,
			name: event.data.name,
			state: event.data.state,
		});

		let corsairEntityId = '';

		if (ctx.db.projects && event.data.id) {
			try {
				const data = event.data;
				const entity = await ctx.db.projects.upsertByEntityId(data.id, {
					...data,
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save project to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.projectCreate',
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

export const projectUpdate: LinearWebhooks['projectUpdate'] = {
	match: createLinearMatch('Project', 'update'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Project' || event.action !== 'update') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📝 Linear Project Updated Event:', {
			id: event.data.id,
			name: event.data.name,
			updatedFields: event.updatedFrom ? Object.keys(event.updatedFrom) : [],
		});

		let corsairEntityId = '';

		if (ctx.db.projects && event.data.id) {
			try {
				const data = event.data;
				const entity = await ctx.db.projects.upsertByEntityId(data.id, {
					...data,
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update project in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.projectUpdate',
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

export const projectRemove: LinearWebhooks['projectRemove'] = {
	match: createLinearMatch('Project', 'remove'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'Project' || event.action !== 'remove') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('🗑️ Linear Project Deleted Event:', {
			id: event.data.id,
			name: event.data.name,
		});

		let corsairEntityId = '';

		if (ctx.db.projects && event.data.id) {
			try {
				const entity = await ctx.db.projects.findByEntityId(event.data.id);
				if (entity) {
					corsairEntityId = entity.id;
				}
				await ctx.db.projects.deleteByEntityId(event.data.id);
			} catch (error) {
				console.warn('Failed to delete project from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.projectRemove',
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
