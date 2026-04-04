import { logEventFromContext } from 'corsair/core';
import type { FigmaWebhooks } from '..';
import { createFigmaEventMatch, verifyFigmaWebhookPasscode } from './types';

export const fileUpdate: FigmaWebhooks['fileUpdate'] = {
	match: createFigmaEventMatch('FILE_UPDATE'),

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

		if (event.event_type !== 'FILE_UPDATE') {
			return {
				success: true,
				data: undefined,
			};
		}

		if (ctx.db.fileMetadata) {
			try {
				await ctx.db.fileMetadata.upsertByEntityId(event.file_key, {
					id: event.file_key,
					name: event.file_name,
					last_modified: event.timestamp,
				});
			} catch (error) {
				console.warn('Failed to save file update event to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'figma.webhook.fileUpdate',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
