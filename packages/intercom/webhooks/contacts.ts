import { logEventFromContext } from 'corsair/core';
import type { IntercomWebhooks } from '..';
import { createIntercomMatch, verifyIntercomWebhookSignature } from './types';
import { toUnixTimestamp } from './utils';

export const created: IntercomWebhooks['contactCreated'] = {
	match: createIntercomMatch('contact.user.created'),

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

		if (event.topic !== 'contact.user.created') {
			return { success: true, data: undefined };
		}

		const item = event.data.item;

		let corsairEntityId = '';

		if (ctx.db.contacts && item.id) {
			try {
				const createdAtNum = toUnixTimestamp(item.created_at);
				const entity = await ctx.db.contacts.upsertByEntityId(item.id, {
					id: item.id,
					email: item.email,
					name: item.name,
					role: item.role,
					created_at: createdAtNum,
					createdAt: createdAtNum ? new Date(createdAtNum * 1000) : new Date(),
				});
				corsairEntityId = entity?.id ?? '';
			} catch (error) {
				console.warn('Failed to save contact to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'intercom.webhook.contactCreated',
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

export const deleted: IntercomWebhooks['contactDeleted'] = {
	match: createIntercomMatch('contact.user.deleted'),

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

		if (event.topic !== 'contact.user.deleted') {
			return { success: true, data: undefined };
		}

		const item = event.data.item;

		await logEventFromContext(
			ctx,
			'intercom.webhook.contactDeleted',
			{ id: item.id },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const tagCreated: IntercomWebhooks['contactTagCreated'] = {
	match: createIntercomMatch('contact.user.tag.created'),

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

		if (event.topic !== 'contact.user.tag.created') {
			return { success: true, data: undefined };
		}

		const item = event.data.item;

		await logEventFromContext(
			ctx,
			'intercom.webhook.contactTagCreated',
			{ id: item.id, tag_id: item.tag_id, contact_id: item.contact_id },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
