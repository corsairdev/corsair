import type { TodoistWebhooks } from '..';
import { logEventFromContext } from '../../utils/events';
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

		if (event.type !== 'note:added') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.comments && event.data.id) {
			try {
				const entity = await ctx.db.comments.upsertByEntityId(event.data.id, {
					...event.data,
					content: event.data.content || '',
					task_id: event.data.item_id,
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

		if (event.type !== 'note:updated') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.comments && event.data.id) {
			try {
				const existing = await ctx.db.comments.findByEntityId(event.data.id);
				const entity = await ctx.db.comments.upsertByEntityId(event.data.id, {
					...(existing?.data || {}),
					...event.data,
					content: event.data.content || existing?.data?.content || '',
					task_id: event.data.item_id,
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

		if (event.type !== 'note:deleted') {
			return {
				success: true,
				data: undefined,
			};
		}

		if (ctx.db.comments && event.data.id) {
			try {
				await ctx.db.comments.deleteByEntityId(event.data.id);
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
