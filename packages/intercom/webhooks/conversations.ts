import { logEventFromContext } from 'corsair/core';
import type { IntercomWebhooks } from '..';
import { createIntercomMatch, verifyIntercomWebhookSignature } from './types';
import { toUnixTimestamp } from './utils';

export const conversationCreated: IntercomWebhooks['conversationCreated'] = {
	match: createIntercomMatch('conversation.admin.created'),

	handler: async (ctx, request) => {
		const verification = verifyIntercomWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.topic !== 'conversation.admin.created') {
			return { success: true, data: undefined };
		}

		const item = event.data.item;

		let corsairEntityId = '';

		if (ctx.db.conversations && item.id) {
			try {
				const createdAtNum = toUnixTimestamp(item.created_at);
				const entity = await ctx.db.conversations.upsertByEntityId(item.id, {
					id: item.id,
					created_at: createdAtNum,
					state: item.state,
					createdAt: createdAtNum ? new Date(createdAtNum * 1000) : new Date(),
				});
				corsairEntityId = entity?.id ?? '';
			} catch (error) {
				console.warn('Failed to save conversation to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'intercom.webhook.conversationAdminCreated',
			{ id: item.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const conversationAssigned: IntercomWebhooks['conversationAssigned'] = {
	match: createIntercomMatch('conversation.admin.assigned'),

	handler: async (ctx, request) => {
		const verification = verifyIntercomWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.topic !== 'conversation.admin.assigned') {
			return { success: true, data: undefined };
		}

		const item = event.data.item;

		let corsairEntityId = '';

		if (ctx.db.conversations && item.id) {
			try {
				const entity = await ctx.db.conversations.upsertByEntityId(item.id, {
					id: item.id,
					admin_assignee_id: item.assignee?.id ?? null,
				});
				corsairEntityId = entity?.id ?? '';
			} catch (error) {
				console.warn('Failed to update conversation in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'intercom.webhook.conversationAssigned',
			{ id: item.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const conversationClosed: IntercomWebhooks['conversationClosed'] = {
	match: createIntercomMatch('conversation.admin.closed'),

	handler: async (ctx, request) => {
		const verification = verifyIntercomWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.topic !== 'conversation.admin.closed') {
			return { success: true, data: undefined };
		}

		const item = event.data.item;

		let corsairEntityId = '';

		if (ctx.db.conversations && item.id) {
			try {
				const entity = await ctx.db.conversations.upsertByEntityId(item.id, {
					id: item.id,
					state: 'closed',
				});
				corsairEntityId = entity?.id ?? '';
			} catch (error) {
				console.warn('Failed to update conversation in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'intercom.webhook.conversationClosed',
			{ id: item.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
