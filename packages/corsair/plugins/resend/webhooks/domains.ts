import { logEventFromContext } from '../../utils/events';
import type { ResendWebhooks } from '..';
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
						...event.data,
						id: event.data.domain_id,
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
						...event.data,
						id: event.data.domain_id,
					},
				);

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update domain in database:', error);
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
