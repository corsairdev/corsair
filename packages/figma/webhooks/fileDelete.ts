import { logEventFromContext } from 'corsair/core';
import type { FigmaWebhooks } from '..';
import { createFigmaEventMatch, verifyFigmaWebhookPasscode } from './types';

export const fileDelete: FigmaWebhooks['fileDelete'] = {
	match: createFigmaEventMatch('FILE_DELETE'),

	handler: async (ctx, request) => {
		const passcode = ctx.key;
		const verification = verifyFigmaWebhookPasscode(request, passcode);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Passcode verification failed',
			};
		}

		const event = request.payload;

		if (event.event_type !== 'FILE_DELETE') {
			return {
				success: true,
				data: undefined,
			};
		}

		if (ctx.db.fileMetadata) {
			try {
				const existing = await ctx.db.fileMetadata.findByEntityId(
					event.file_key,
				);
				await ctx.db.fileMetadata.upsertByEntityId(event.file_key, {
					...(existing?.data ?? {}),
					id: event.file_key,
					name: event.file_name,
				});
			} catch (error) {
				console.warn('Failed to record file deletion in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'figma.webhook.fileDelete',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
