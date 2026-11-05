import { logEventFromContext } from 'corsair/core';
import type { AbyssaleWebhooks } from '../index';
import {
	createAbyssaleMatch,
	NewExportEventSchema,
	verifyAndParseEvent,
} from './types';

export const completed: AbyssaleWebhooks['newExport'] = {
	match: createAbyssaleMatch('NEW_EXPORT'),

	handler: async (ctx, request) => {
		const guard = verifyAndParseEvent(
			request,
			ctx.key,
			NewExportEventSchema,
			'NEW_EXPORT',
		);
		if (!guard.ok) {
			return {
				success: false,
				statusCode: guard.statusCode,
				error: guard.error,
			};
		}

		const event = guard.event;

		await logEventFromContext(
			ctx,
			'abyssale.webhook.newExport',
			{
				export_id: event.export_id,
				archive_url: event.archive_url,
			},
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
