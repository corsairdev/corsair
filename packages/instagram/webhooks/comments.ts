import { logEventFromContext } from 'corsair/core';
import type { InstagramWebhooks } from '../index';
import {
	createInstagramWebhookMatcher,
	InstagramCommentEventSchema,
	verifyInstagramWebhookSignature,
} from './types';

export const comments: InstagramWebhooks['comments'] = {
	match: createInstagramWebhookMatcher('comments'),
	handler: async (ctx, request) => {
		const credentials = await ctx.keys.get_integration_credentials();
		const appSecret = credentials.client_secret;

		const verification = verifyInstagramWebhookSignature(request, appSecret);

		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const body = request.payload;
		const change = body.entry[0]?.changes[0];

		if (!body || !change || !body.entry[0]) {
			return {
				success: false,
				data: undefined,
			};
		}

		const event = InstagramCommentEventSchema.parse({
			type: 'comments',
			id: change.value.comment_id ?? change.value.media.id,
			text: change.value.text,
			timestamp: new Date(body.entry[0].time * 1000).toISOString(),
			username: change.value.from.username,
		});

		try {
			await ctx.db.comments.upsertByEntityId(event.id!, {
				id: event.id,
				text: event.text,
				timestamp: event.timestamp,
				username: event.username,
			});
		} catch (error) {
			console.warn('failed to save comments event into database', error);
		}

		await logEventFromContext(
			ctx,
			'instagram.webhook.comments',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
