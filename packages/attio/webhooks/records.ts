import { logEventFromContext } from 'corsair/core';
import type { AttioWebhooks } from '../index';
import { createAttioMatch, verifyAttioWebhookSignature } from './types';

export const created: AttioWebhooks['recordCreated'] = {
	match: createAttioMatch('record.created'),

	handler: async (ctx, request) => {
		const verification = verifyAttioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const record = event.data;
		const entityId =
			typeof record.id === 'string' ? record.id : record.id.record_id;

		if (ctx.db.records) {
			try {
				await ctx.db.records.upsertByEntityId(entityId, record);
			} catch (error) {
				console.warn('Failed to save record (created) to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'attio.webhook.record.created',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: entityId,
			data: event,
		};
	},
};

export const updated: AttioWebhooks['recordUpdated'] = {
	match: createAttioMatch('record.updated'),

	handler: async (ctx, request) => {
		const verification = verifyAttioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const record = event.data;
		const entityId =
			typeof record.id === 'string' ? record.id : record.id.record_id;

		if (ctx.db.records) {
			try {
				await ctx.db.records.upsertByEntityId(entityId, record);
			} catch (error) {
				console.warn('Failed to save record (updated) to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'attio.webhook.record.updated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: entityId,
			data: event,
		};
	},
};

export const deleted: AttioWebhooks['recordDeleted'] = {
	match: createAttioMatch('record.deleted'),

	handler: async (ctx, request) => {
		const verification = verifyAttioWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const record = event.data;
		const entityId =
			typeof record.id === 'string' ? record.id : record.id.record_id;

		if (ctx.db.records) {
			try {
				await ctx.db.records.deleteByEntityId(entityId);
			} catch (error) {
				console.warn('Failed to delete record from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'attio.webhook.record.deleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: entityId,
			data: event,
		};
	},
};
