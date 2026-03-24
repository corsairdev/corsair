import { logEventFromContext } from '../../utils/events';
import type { FigmaWebhooks } from '..';
import { createFigmaEventMatch, verifyFigmaWebhookPasscode } from './types';

export const fileVersionUpdate: FigmaWebhooks['fileVersionUpdate'] = {
	match: createFigmaEventMatch('FILE_VERSION_UPDATE'),

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

		if (event.event_type !== 'FILE_VERSION_UPDATE') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.versions && event.version_id) {
			try {
				const entity = await ctx.db.versions.upsertByEntityId(event.version_id, {
					id: event.version_id,
					file_key: event.file_key,
					label: event.label,
					description: event.description,
					created_at: event.timestamp,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save version from webhook to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'figma.webhook.fileVersionUpdate',
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
