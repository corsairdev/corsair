import { logEventFromContext } from 'corsair/core';
import type { AbyssaleWebhooks } from '../index';
import {
	createAbyssaleMatch,
	TemplateStatusEventSchema,
	verifyAbyssaleWebhookSignature,
} from './types';

export const statusChanged: AbyssaleWebhooks['templateStatus'] = {
	match: createAbyssaleMatch('TEMPLATE_STATUS'),

	handler: async (ctx, request) => {
		const verification = verifyAbyssaleWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const parsed = TemplateStatusEventSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid TEMPLATE_STATUS payload',
			};
		}

		const event = parsed.data;

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
