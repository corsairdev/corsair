import { logEventFromContext } from 'corsair/core';
import type { AbyssaleWebhooks } from '../index';
import {
	createAbyssaleMatch,
	NewExportEventSchema,
	verifyAbyssaleWebhookSignature,
} from './types';

export const completed: AbyssaleWebhooks['newExport'] = {
	match: createAbyssaleMatch('NEW_EXPORT'),

	handler: async (ctx, request) => {
		const verification = verifyAbyssaleWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const parsed = NewExportEventSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid NEW_EXPORT payload',
			};
		}

		const event = parsed.data;

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
