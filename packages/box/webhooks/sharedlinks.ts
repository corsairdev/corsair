import { logEventFromContext } from 'corsair/core';
import type { BoxWebhooks } from '..';
import { createBoxMatch, verifyBoxWebhookSignature } from './types';

export const created: BoxWebhooks['sharedLinkCreated'] = {
	match: createBoxMatch('SHARED_LINK.CREATED'),

	handler: async (ctx, request) => {
		const verification = verifyBoxWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const itemId = typeof source?.id === 'string' ? source.id : undefined;
		const itemType = typeof source?.type === 'string' ? source.type : undefined;

		if (itemId && itemType === 'file' && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(itemId, {
					id: itemId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update file shared link in database:', error);
			}
		} else if (itemId && itemType === 'folder' && ctx.db.folders) {
			try {
				await ctx.db.folders.upsertByEntityId(itemId, {
					id: itemId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update folder shared link in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.sharedLinkCreated',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const deleted: BoxWebhooks['sharedLinkDeleted'] = {
	match: createBoxMatch('SHARED_LINK.DELETED'),

	handler: async (ctx, request) => {
		const verification = verifyBoxWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const itemId = typeof source?.id === 'string' ? source.id : undefined;
		const itemType = typeof source?.type === 'string' ? source.type : undefined;

		if (itemId && itemType === 'file' && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(itemId, {
					id: itemId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn(
					'Failed to update file after shared link deletion in database:',
					error,
				);
			}
		} else if (itemId && itemType === 'folder' && ctx.db.folders) {
			try {
				await ctx.db.folders.upsertByEntityId(itemId, {
					id: itemId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn(
					'Failed to update folder after shared link deletion in database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.sharedLinkDeleted',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const updated: BoxWebhooks['sharedLinkUpdated'] = {
	match: createBoxMatch('SHARED_LINK.UPDATED'),

	handler: async (ctx, request) => {
		const verification = verifyBoxWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const itemId = typeof source?.id === 'string' ? source.id : undefined;
		const itemType = typeof source?.type === 'string' ? source.type : undefined;

		if (itemId && itemType === 'file' && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(itemId, {
					id: itemId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update file shared link in database:', error);
			}
		} else if (itemId && itemType === 'folder' && ctx.db.folders) {
			try {
				await ctx.db.folders.upsertByEntityId(itemId, {
					id: itemId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update folder shared link in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.sharedLinkUpdated',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};
