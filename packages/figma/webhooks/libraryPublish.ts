import { logEventFromContext } from 'corsair/core';
import type { FigmaWebhooks } from '..';
import { createFigmaEventMatch, verifyFigmaWebhookPasscode } from './types';

export const libraryPublish: FigmaWebhooks['libraryPublish'] = {
	match: createFigmaEventMatch('LIBRARY_PUBLISH'),

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

		if (event.event_type !== 'LIBRARY_PUBLISH') {
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
				console.warn(
					'Failed to save library publish event to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'figma.webhook.libraryPublish',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
