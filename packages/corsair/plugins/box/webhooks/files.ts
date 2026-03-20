import { logEventFromContext } from '../../utils/events';
import type { BoxWebhooks } from '..';
import { createBoxMatch, verifyBoxWebhookSignature } from './types';

const verifyOrFail = (
	request: Parameters<typeof verifyBoxWebhookSignature>[0],
	key: string,
) => {
	const verification = verifyBoxWebhookSignature(request, key);
	return verification;
};

export const copied: BoxWebhooks['fileCopied'] = {
	match: createBoxMatch('FILE.COPIED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(fileId, {
					id: fileId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to save copied file to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.fileCopied',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const deleted: BoxWebhooks['fileDeleted'] = {
	match: createBoxMatch('FILE.DELETED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.deleteByEntityId(fileId);
			} catch (error) {
				console.warn('Failed to delete file from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.fileDeleted',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const downloaded: BoxWebhooks['fileDownloaded'] = {
	match: createBoxMatch('FILE.DOWNLOADED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(fileId, {
					id: fileId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update downloaded file in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.fileDownloaded',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const locked: BoxWebhooks['fileLocked'] = {
	match: createBoxMatch('FILE.LOCKED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(fileId, {
					id: fileId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update locked file in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.fileLocked',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const moved: BoxWebhooks['fileMoved'] = {
	match: createBoxMatch('FILE.MOVED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(fileId, {
					id: fileId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update moved file in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.fileMoved',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const previewed: BoxWebhooks['filePreviewed'] = {
	match: createBoxMatch('FILE.PREVIEWED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(fileId, {
					id: fileId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update previewed file in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.filePreviewed',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const renamed: BoxWebhooks['fileRenamed'] = {
	match: createBoxMatch('FILE.RENAMED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(fileId, {
					id: fileId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update renamed file in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.fileRenamed',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const restored: BoxWebhooks['fileRestored'] = {
	match: createBoxMatch('FILE.RESTORED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(fileId, {
					id: fileId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to restore file in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.fileRestored',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const trashed: BoxWebhooks['fileTrashed'] = {
	match: createBoxMatch('FILE.TRASHED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(fileId, {
					id: fileId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update trashed file in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.fileTrashed',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const unlocked: BoxWebhooks['fileUnlocked'] = {
	match: createBoxMatch('FILE.UNLOCKED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(fileId, {
					id: fileId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to update unlocked file in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.fileUnlocked',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const uploaded: BoxWebhooks['fileUploaded'] = {
	match: createBoxMatch('FILE.UPLOADED'),

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
		const fileId = typeof source?.id === 'string' ? source.id : undefined;

		if (fileId && ctx.db.files) {
			try {
				await ctx.db.files.upsertByEntityId(fileId, {
					id: fileId,
					// any: source is a passthrough record from Box webhook payload
					...source,
				});
			} catch (error) {
				console.warn('Failed to save uploaded file to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'box.webhook.fileUploaded',
			{ id: event.id, trigger: event.trigger },
			'completed',
		);

		return { success: true, data: event };
	},
};
