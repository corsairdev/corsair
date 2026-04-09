import { logEventFromContext } from 'corsair/core';
import type { MondayWebhooks } from '..';
import { createMondayMatch } from './types';

export const itemCreated: MondayWebhooks['itemCreated'] = {
	match: createMondayMatch('create_pulse'),

	handler: async (ctx, request) => {
		// const verification = verifyMondayWebhookSignature(request, ctx.key);
		// if (!verification.valid) {
		// 	return {
		// 		success: false,
		// 		statusCode: 401,
		// 		error: verification.error || 'Signature verification failed',
		// 	};
		// }

		const event = request.payload.event;

		if (!event || event.type !== 'create_pulse') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.items) {
			try {
				const entity = await ctx.db.items.upsertByEntityId(
					String(event.pulseId),
					{
						id: String(event.pulseId),
						name: event.pulseName ?? '',
						board_id: String(event.boardId),
						group_id: event.groupId,
						created_at: event.triggerTime,
						creator_id: String(event.userId),
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save item to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'monday.webhook.item_created',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: request.payload,
		};
	},
};
