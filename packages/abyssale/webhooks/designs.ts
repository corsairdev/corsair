import { logEventFromContext } from 'corsair/core';
import type { AbyssaleWebhooks } from '../index';
import {
	createAbyssaleMatch,
	TemplateStatusEventSchema,
	verifyAndParseEvent,
} from './types';

export const statusChanged: AbyssaleWebhooks['templateStatus'] = {
	match: createAbyssaleMatch('TEMPLATE_STATUS'),

	handler: async (ctx, request) => {
		const guard = verifyAndParseEvent(
			request,
			ctx.key,
			TemplateStatusEventSchema,
			'TEMPLATE_STATUS',
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
			'abyssale.webhook.templateStatus',
			{
				design_id: event.id,
				status: event.status,
			},
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
