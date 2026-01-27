import type { ResendWebhooks } from '..';
import type { DomainCreatedEvent, DomainUpdatedEvent } from './types';
import { createResendMatch } from './types';

export const domainCreated: ResendWebhooks['domainCreated'] = {
	match: createResendMatch('domain.created'),

	handler: async (ctx, request) => {
		const event = request.payload as DomainCreatedEvent;

		console.log('🌐 Resend Domain Created Event:', {
			domain_id: event.data.domain_id,
			name: event.data.name,
			status: event.data.status,
		});

		if (ctx.db.domains && event.data.domain_id) {
			try {
				await ctx.db.domains.upsert(event.data.domain_id, {
					id: event.data.domain_id,
					name: event.data.name,
					status: event.data.status as
						| 'not_started'
						| 'validation'
						| 'scheduled'
						| 'ready'
						| 'error',
					created_at: event.data.created_at,
				});
			} catch (error) {
				console.warn('Failed to save domain to database:', error);
			}
		}

		return {
			success: true,
			data: {},
		};
	},
};

export const domainUpdated: ResendWebhooks['domainUpdated'] = {
	match: createResendMatch('domain.updated'),

	handler: async (ctx, request) => {
		const event = request.payload as DomainUpdatedEvent;

		console.log('🔄 Resend Domain Updated Event:', {
			domain_id: event.data.domain_id,
			name: event.data.name,
			status: event.data.status,
		});

		if (ctx.db.domains && event.data.domain_id) {
			try {
				await ctx.db.domains.upsert(event.data.domain_id, {
					id: event.data.domain_id,
					name: event.data.name,
					status: event.data.status as
						| 'not_started'
						| 'validation'
						| 'scheduled'
						| 'ready'
						| 'error',
					created_at: event.data.created_at,
				});
			} catch (error) {
				console.warn('Failed to update domain in database:', error);
			}
		}

		return {
			success: true,
			data: {},
		};
	},
};
