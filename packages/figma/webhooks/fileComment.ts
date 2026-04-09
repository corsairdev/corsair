import { logEventFromContext } from 'corsair/core';
import type { FigmaWebhooks } from '..';
import { createFigmaEventMatch, verifyFigmaWebhookPasscode } from './types';

export const fileComment: FigmaWebhooks['fileComment'] = {
	match: createFigmaEventMatch('FILE_COMMENT'),

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

		if (event.event_type !== 'FILE_COMMENT') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.comments && event.comment?.id) {
			try {
				const { user, ...commentData } = event.comment;
				const entity = await ctx.db.comments.upsertByEntityId(
					event.comment.id,
					{
						...commentData,
						file_key: event.file_key,
						user_id: user?.id,
						user_handle: user?.handle,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save comment from webhook to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'figma.webhook.fileComment',
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
