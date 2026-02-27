import type { TodoistWebhooks } from '..';
import { logEventFromContext } from '../../utils/events';
import { createTodoistMatch, verifyTodoistWebhookSignature } from './types';

export const example: TodoistWebhooks['example'] = {
	match: createTodoistMatch('example'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyTodoistWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'example') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('📦 Todoist Example Event:', {
			id: event.data.id,
		});

		await logEventFromContext(
			ctx,
			'todoist.webhook.example',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
