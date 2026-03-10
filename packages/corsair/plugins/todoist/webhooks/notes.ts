import { logEventFromContext } from '../../utils/events';
import type { TodoistWebhooks } from '..';
import { createTodoistMatch, verifyTodoistWebhookSignature } from './types';

export const added: TodoistWebhooks['noteAdded'] = {
	match: createTodoistMatch('note:added'),

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

		if (ctx.db.comments && data && data.id) {
			try {
				const entity = await ctx.db.comments.upsertByEntityId(data.id, {
					...data,
					content: data.content || '',
					task_id: data.item_id,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save comment to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.noteAdded',
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

export const updated: TodoistWebhooks['noteUpdated'] = {
	match: createTodoistMatch('note:updated'),

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

		if (ctx.db.comments && data && data.id) {
			try {
				const existing = await ctx.db.comments.findByEntityId(data.id);
				const entity = await ctx.db.comments.upsertByEntityId(data.id, {
					...(existing?.data || {}),
					...data,
					content: data.content || existing?.data?.content || '',
					task_id: data.item_id,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update comment in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.noteUpdated',
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

export const deleted: TodoistWebhooks['noteDeleted'] = {
	match: createTodoistMatch('note:deleted'),

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

		if (ctx.db.comments && data && data.id) {
			try {
				await ctx.db.comments.deleteByEntityId(data.id);
			} catch (error) {
				console.warn('Failed to delete comment from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'todoist.webhook.noteDeleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
