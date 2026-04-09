import { logEventFromContext } from 'corsair/core';
import type { MondayWebhooks } from '..';
import { createMondayMatch } from './types';

export const columnValueChanged: MondayWebhooks['columnValueChanged'] = {
	match: createMondayMatch('change_column_value'),

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

		if (!event || event.type !== 'change_column_value') {
			return {
				success: true,
				data: undefined,
			};
		}

		await logEventFromContext(
			ctx,
			'monday.webhook.column_value_changed',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: request.payload,
		};
	},
};
