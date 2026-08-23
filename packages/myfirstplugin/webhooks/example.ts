import { logEventFromContext } from 'corsair/core';
import type { MyFirstPluginWebhooks } from '..';
import {
	createMyFirstPluginMatch,
	verifyMyFirstPluginWebhookSignature,
} from './types';

export const example: MyFirstPluginWebhooks['example'] = {
	match: createMyFirstPluginMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyMyFirstPluginWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'example') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'myfirstplugin.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
