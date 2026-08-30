import { logEventFromContext } from 'corsair/core';
import type { ResendWebhooks } from '../index';
import { createResendMatch, verifyResendWebhookSignature } from './types';

export const domainCreated: ResendWebhooks['domainCreated'] = {
	match: createResendMatch('domain.created'),

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

		if (event.type !== 'domain.created') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('🌐 Resend Domain Created Event:', {
			domain_id: event.data.domain_id,
			name: event.data.name,
			status: event.data.status,
		});

		let corsairEntityId = '';

		if (ctx.db.domains && event.data.domain_id) {
			try {
				const entity = await ctx.db.domains.upsertByEntityId(
					event.data.domain_id,
					{
						id: event.data.domain_id,
						name: event.data.name,
						status: event.data.status as
							| 'not_started'
							| 'validation'
							| 'scheduled'
							| 'ready'
							| 'error'
							| 'verified'
							| 'pending'
							| 'failed'
							| 'partially_verified'
							| 'partially_failed',
						created_at: new Date(event.data.created_at ?? ''),
					},
				);

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save domain to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.domainCreated',
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

export const domainUpdated: ResendWebhooks['domainUpdated'] = {
	match: createResendMatch('domain.updated'),

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

		if (event.type !== 'domain.updated') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('🔄 Resend Domain Updated Event:', {
			domain_id: event.data.domain_id,
			name: event.data.name,
			status: event.data.status,
		});

		let corsairEntityId = '';

		if (ctx.db.domains && event.data.domain_id) {
			try {
				const entity = await ctx.db.domains.upsertByEntityId(
					event.data.domain_id,
					{
						id: event.data.domain_id,
						name: event.data.name,
						status: event.data.status as
							| 'not_started'
							| 'validation'
							| 'scheduled'
							| 'ready'
							| 'error'
							| 'verified'
							| 'pending'
							| 'failed'
							| 'partially_verified'
							| 'partially_failed',
						created_at: new Date(event.data.created_at ?? ''),
					},
				);

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update domain to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.domainUpdated',
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

export const domainDeleted: ResendWebhooks['domainDeleted'] = {
	match: createResendMatch('domain.deleted'),

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

		if (event.type !== 'domain.deleted') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('🗑️ Resend Domain Deleted Event:', {
			id: event.data.id,
		});

		if (ctx.db.domains && event.data.id) {
			try {
				await ctx.db.domains.deleteByEntityId(event.data.id);
			} catch (error) {
				console.warn('Failed to delete domain from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.domainDeleted',
			{ id: event.data.id },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
