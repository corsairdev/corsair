import { logEventFromContext } from '../../utils/events';
import type { NotionWebhooks } from '..';
import {
	createNotionMatch,
	verifyNotionWebhookSignature,
} from './types';

export const pageAddedToDatabase: NotionWebhooks['pageAddedToDatabase'] = {
	match: createNotionMatch('page.added_to_database'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyNotionWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload

		if (event.type !== 'page.added_to_database') {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid event type',
			};
		}

		await logEventFromContext(
			ctx,
			'notion.webhook.pageAddedToDatabase',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const pageUpdatedInDatabase: NotionWebhooks['pageUpdatedInDatabase'] = {
	match: createNotionMatch('page.updated_in_database'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyNotionWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload

		if (event.type !== 'page.updated_in_database') {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid event type',
			};
		}

		await logEventFromContext(
			ctx,
			'notion.webhook.pageUpdatedInDatabase',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
