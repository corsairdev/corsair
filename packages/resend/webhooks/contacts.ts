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
			contact_id: event.data.contact_id,
			email: event.data.email,
		});

		let corsairEntityId = '';

		if (ctx.db.contacts && event.data.contact_id) {
			try {
				const entity = await ctx.db.contacts.upsertByEntityId(
					event.data.contact_id,
					{
						...event.data,
						id: event.data.contact_id,
						created_at: new Date(event.data.created_at ?? ''),
					},
				);

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save contact to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.contactCreated',
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
			contact_id: event.data.contact_id,
			email: event.data.email,
		});

		let corsairEntityId = '';

		if (ctx.db.contacts && event.data.contact_id) {
			try {
				const entity = await ctx.db.contacts.upsertByEntityId(
					event.data.contact_id,
					{
						...event.data,
						id: event.data.contact_id,
						created_at: new Date(event.data.created_at ?? ''),
					},
				);

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update contact in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.contactUpdated',
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
			contact_id: event.data.contact_id,
			email: event.data.email,
		});

		if (ctx.db.contacts && event.data.contact_id) {
			try {
				await ctx.db.contacts.deleteByEntityId(event.data.contact_id);
			} catch (error) {
				console.warn('Failed to delete contact from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.contactDeleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
