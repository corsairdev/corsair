import { logEventFromContext } from '../../utils/events';
import type { LinearWebhooks } from '..';
import { createLinearMatch, verifyLinearWebhookSignature } from './types';

export const issueCreate: LinearWebhooks['issueCreate'] = {
	match: createLinearMatch('Issue', 'create'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyLinearWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload ;

		if (event.type !== 'Issue' || event.action !== 'create') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📋 Linear Issue Created Event:', {
			id: event.data.id,
			identifier: event.data.identifier,
			title: event.data.title,
		});

		let corsairEntityId = '';

		if (ctx.db.issues && event.data.id) {
			try {
				const data = event.data;
				const entity = await ctx.db.issues.upsertByEntityId(data.id, {
					...data,
					number: parseInt(data.identifier.split('-')[1] || '0', 10),
					url: event.url,
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save issue to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.issueCreate',
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

export const issueUpdate: LinearWebhooks['issueUpdate'] = {
	match: createLinearMatch('Issue', 'update'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyLinearWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'Issue' || event.action !== 'update') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📝 Linear Issue Updated Event:', {
			id: event.data.id,
			identifier: event.data.identifier,
			title: event.data.title,
			updatedFields: event.updatedFrom ? Object.keys(event.updatedFrom) : [],
		});

		let corsairEntityId = '';

		if (ctx.db.issues && event.data.id) {
			try {
				const data = event.data;
				const entity = await ctx.db.issues.upsertByEntityId(data.id, {
					...data,
					number: parseInt(data.identifier.split('-')[1] || '0', 10),
					url: event.url,
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update issue in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.issueUpdate',
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

export const issueRemove: LinearWebhooks['issueRemove'] = {
	match: createLinearMatch('Issue', 'remove'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyLinearWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'Issue' || event.action !== 'remove') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('🗑️ Linear Issue Deleted Event:', {
			id: event.data.id,
			identifier: event.data.identifier,
		});

		let corsairEntityId = '';

		if (ctx.db.issues && event.data.id) {
			try {
				const entity = await ctx.db.issues.findByEntityId(event.data.id);
				if (entity) {
					corsairEntityId = entity.id;
				}
				await ctx.db.issues.deleteByEntityId(event.data.id);
			} catch (error) {
				console.warn('Failed to delete issue from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'linear.webhook.issueRemove',
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
