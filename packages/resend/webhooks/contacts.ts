import { logEventFromContext } from 'corsair/core';
import type { ResendWebhooks } from '../index';
import { createResendMatch, verifyResendWebhookSignature } from './types';

export const contactCreated: ResendWebhooks['contactCreated'] = {
	match: createResendMatch('contact.created'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyResendWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'contact.created') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('👤 Resend Contact Created Event:', {
			id: event.data.id,
		});

		let corsairEntityId = '';

		if (ctx.db.contacts && event.data.id) {
			try {
				const entity = await ctx.db.contacts.upsertByEntityId(event.data.id, {
					id: event.data.id,
					email: event.data.email ?? '',
					first_name: event.data.first_name ?? null,
					last_name: event.data.last_name ?? null,
					unsubscribed: event.data.unsubscribed,
					created_at:
						event.data.created_at != null
							? new Date(event.data.created_at)
							: null,
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save contact to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.contactCreated',
			{ id: event.data.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const contactUpdated: ResendWebhooks['contactUpdated'] = {
	match: createResendMatch('contact.updated'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyResendWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'contact.updated') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('🔄 Resend Contact Updated Event:', {
			id: event.data.id,
		});

		let corsairEntityId = '';

		if (ctx.db.contacts && event.data.id) {
			try {
				const entity = await ctx.db.contacts.upsertByEntityId(event.data.id, {
					id: event.data.id,
					email: event.data.email ?? '',
					first_name: event.data.first_name ?? null,
					last_name: event.data.last_name ?? null,
					unsubscribed: event.data.unsubscribed,
					created_at:
						event.data.created_at != null
							? new Date(event.data.created_at)
							: null,
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update contact in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.contactUpdated',
			{ id: event.data.id },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const contactDeleted: ResendWebhooks['contactDeleted'] = {
	match: createResendMatch('contact.deleted'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyResendWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'contact.deleted') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('🗑️ Resend Contact Deleted Event:', {
			id: event.data.id,
		});

		if (ctx.db.contacts && event.data.id) {
			try {
				await ctx.db.contacts.deleteByEntityId(event.data.id);
			} catch (error) {
				console.warn('Failed to delete contact from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.contactDeleted',
			{ id: event.data.id },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
