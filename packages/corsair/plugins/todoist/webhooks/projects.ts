import { logEventFromContext } from '../../utils/events';
import type { TodoistWebhooks } from '..';
import { createTodoistMatch, verifyTodoistWebhookSignature } from './types';

export const added: TodoistWebhooks['projectAdded'] = {
	match: createTodoistMatch('project:added'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyTodoistWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const data = event.event_data ?? event.data;

		let corsairEntityId = '';

		if (ctx.db.projects && data && data.id) {
			try {
				const entity = await ctx.db.projects.upsertByEntityId(data.id, {
					...data,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save project to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.projectAdded',
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

export const updated: TodoistWebhooks['projectUpdated'] = {
	match: createTodoistMatch('project:updated'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyTodoistWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const data = event.event_data ?? event.data;

		let corsairEntityId = '';

		if (ctx.db.projects && data && data.id) {
			try {
				const entity = await ctx.db.projects.upsertByEntityId(data.id, {
					...data,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update project in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.projectUpdated',
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

export const deleted: TodoistWebhooks['projectDeleted'] = {
	match: createTodoistMatch('project:deleted'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyTodoistWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const data = event.event_data ?? event.data;

		if (ctx.db.projects && data && data.id) {
			try {
				await ctx.db.projects.deleteByEntityId(data.id);
			} catch (error) {
				console.warn('Failed to delete project from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.projectDeleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const archived: TodoistWebhooks['projectArchived'] = {
	match: createTodoistMatch('project:archived'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyTodoistWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const data = event.event_data ?? event.data;

		let corsairEntityId = '';

		if (ctx.db.projects && data && data.id) {
			try {
				const existing = await ctx.db.projects.findByEntityId(data.id);
				if (existing) {
					const entity = await ctx.db.projects.upsertByEntityId(data.id, {
						...existing.data,
						...data,
						is_archived: true,
					});
					corsairEntityId = entity?.id || '';
				}
			} catch (error) {
				console.warn('Failed to archive project in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.projectArchived',
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

export const unarchived: TodoistWebhooks['projectUnarchived'] = {
	match: createTodoistMatch('project:unarchived'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyTodoistWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const data = event.event_data ?? event.data;

		let corsairEntityId = '';

		if (ctx.db.projects && data && data.id) {
			try {
				const existing = await ctx.db.projects.findByEntityId(data.id);
				if (existing) {
					const entity = await ctx.db.projects.upsertByEntityId(data.id, {
						...existing.data,
						...data,
						is_archived: false,
					});
					corsairEntityId = entity?.id || '';
				}
			} catch (error) {
				console.warn('Failed to unarchive project in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.projectUnarchived',
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
