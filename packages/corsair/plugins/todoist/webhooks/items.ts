import type { TodoistWebhooks } from '..';
import { logEventFromContext } from '../../utils/events';
import { createTodoistMatch, verifyTodoistWebhookSignature } from './types';

export const added: TodoistWebhooks['itemAdded'] = {
	match: createTodoistMatch('item:added'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
        const verification = verifyTodoistWebhookSignature(request, webhookSecret);
        console.log(verification, 'verification');
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

		if (ctx.db.tasks && data && data.id) {
			try {
				const entity = await ctx.db.tasks.upsertByEntityId(data.id, {
					...data,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save task to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.itemAdded',
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

export const updated: TodoistWebhooks['itemUpdated'] = {
	match: createTodoistMatch('item:updated'),

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

		if (ctx.db.tasks && data && data.id) {
			try {
				const entity = await ctx.db.tasks.upsertByEntityId(data.id, {
					...data,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update task in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.itemUpdated',
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

export const deleted: TodoistWebhooks['itemDeleted'] = {
	match: createTodoistMatch('item:deleted'),

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

		if (ctx.db.tasks && data && data.id) {
			try {
				await ctx.db.tasks.deleteByEntityId(data.id);
			} catch (error) {
				console.warn('Failed to delete task from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.itemDeleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const completed: TodoistWebhooks['itemCompleted'] = {
	match: createTodoistMatch('item:completed'),

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

		if (ctx.db.tasks && data && data.id) {
			try {
				const existing = await ctx.db.tasks.findByEntityId(data.id);
				const entity = await ctx.db.tasks.upsertByEntityId(data.id, {
					...(existing?.data || {}),
					...data,
					content: data.content || existing?.data?.content || '',
					is_completed: true,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update task completion in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.itemCompleted',
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

export const uncompleted: TodoistWebhooks['itemUncompleted'] = {
	match: createTodoistMatch('item:uncompleted'),

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

		if (ctx.db.tasks && data && data.id) {
			try {
				const existing = await ctx.db.tasks.findByEntityId(data.id);
				const entity = await ctx.db.tasks.upsertByEntityId(data.id, {
					...(existing?.data || {}),
					...data,
					content: data.content || existing?.data?.content || '',
					is_completed: false,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update task completion in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.itemUncompleted',
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
