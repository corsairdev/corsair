import { logEventFromContext } from 'corsair/core';
import type { BoxWebhooks } from '..';
import { createBoxMatch, verifyBoxWebhookSignature } from './types';

const verifyOrFail = (
	request: Parameters<typeof verifyBoxWebhookSignature>[0],
	key: string,
) => verifyBoxWebhookSignature(request, key);

export const copied: BoxWebhooks['folderCopied'] = {
	match: createBoxMatch('FOLDER.COPIED'),

	handler: async (ctx, request) => {
		const verification = verifyOrFail(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const folderId = typeof source?.id === 'string' ? source.id : undefined;

		if (folderId && ctx.db.folders) {
			try {
				await ctx.db.folders.upsertByEntityId(folderId, {
					id: folderId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to save copied folder to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.folderCopied',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const created: BoxWebhooks['folderCreated'] = {
	match: createBoxMatch('FOLDER.CREATED'),

	handler: async (ctx, request) => {
		const verification = verifyOrFail(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const folderId = typeof source?.id === 'string' ? source.id : undefined;

		if (folderId && ctx.db.folders) {
			try {
				await ctx.db.folders.upsertByEntityId(folderId, {
					id: folderId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to save created folder to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.folderCreated',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const deleted: BoxWebhooks['folderDeleted'] = {
	match: createBoxMatch('FOLDER.DELETED'),

	handler: async (ctx, request) => {
		const verification = verifyOrFail(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const folderId = typeof source?.id === 'string' ? source.id : undefined;

		if (folderId && ctx.db.folders) {
			try {
				await ctx.db.folders.deleteByEntityId(folderId);
			} catch (error) {
				console.warn('Failed to delete folder from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.folderDeleted',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const downloaded: BoxWebhooks['folderDownloaded'] = {
	match: createBoxMatch('FOLDER.DOWNLOADED'),

	handler: async (ctx, request) => {
		const verification = verifyOrFail(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const folderId = typeof source?.id === 'string' ? source.id : undefined;

		if (folderId && ctx.db.folders) {
			try {
				await ctx.db.folders.upsertByEntityId(folderId, {
					id: folderId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update downloaded folder in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.folderDownloaded',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const moved: BoxWebhooks['folderMoved'] = {
	match: createBoxMatch('FOLDER.MOVED'),

	handler: async (ctx, request) => {
		const verification = verifyOrFail(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const folderId = typeof source?.id === 'string' ? source.id : undefined;

		if (folderId && ctx.db.folders) {
			try {
				await ctx.db.folders.upsertByEntityId(folderId, {
					id: folderId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update moved folder in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.folderMoved',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const renamed: BoxWebhooks['folderRenamed'] = {
	match: createBoxMatch('FOLDER.RENAMED'),

	handler: async (ctx, request) => {
		const verification = verifyOrFail(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const folderId = typeof source?.id === 'string' ? source.id : undefined;

		if (folderId && ctx.db.folders) {
			try {
				await ctx.db.folders.upsertByEntityId(folderId, {
					id: folderId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update renamed folder in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.folderRenamed',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const restored: BoxWebhooks['folderRestored'] = {
	match: createBoxMatch('FOLDER.RESTORED'),

	handler: async (ctx, request) => {
		const verification = verifyOrFail(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const folderId = typeof source?.id === 'string' ? source.id : undefined;

		if (folderId && ctx.db.folders) {
			try {
				await ctx.db.folders.upsertByEntityId(folderId, {
					id: folderId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to restore folder in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.folderRestored',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const trashed: BoxWebhooks['folderTrashed'] = {
	match: createBoxMatch('FOLDER.TRASHED'),

	handler: async (ctx, request) => {
		const verification = verifyOrFail(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const source = event.source;
		const folderId = typeof source?.id === 'string' ? source.id : undefined;

		if (folderId && ctx.db.folders) {
			try {
				await ctx.db.folders.upsertByEntityId(folderId, {
					id: folderId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update trashed folder in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.folderTrashed',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};
