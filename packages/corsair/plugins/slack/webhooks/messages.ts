import { logEventFromContext } from '../../utils/events';
import type { SlackWebhooks } from '..';
import { createSlackEventMatch, verifySlackWebhookSignature } from './types';

export const message: SlackWebhooks['message'] = {
	match: createSlackEventMatch('message'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifySlackWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event =
			request.payload.type === 'event_callback' ? request.payload.event : null;

		if (!event || event?.type !== 'message') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.messages) {
			try {
				if ('subtype' in event && event.subtype === 'message_changed' && 'message' in event) {
					// For message_changed events, event.ts is the change-event timestamp (always new).
					// The original message lives at event.message, with event.message.ts as the stable ID.
					const updated = event.message;
					const messageTs = 'ts' in updated ? updated.ts : undefined;
					if (messageTs) {
						const entity = await ctx.db.messages.upsertByEntityId(messageTs, {
							...updated,
							id: messageTs,
							authorId: 'user' in updated ? updated.user : undefined,
							createdAt: new Date(parseFloat(messageTs) * 1000),
						});
						corsairEntityId = entity?.id || '';
					}
				} else if (!('subtype' in event) || event.subtype !== 'message_deleted') {
					// Skip message_deleted events — the message no longer exists and we don't
					// want to create a spurious record keyed on the deletion-event timestamp.
					if (event.ts) {
						const entity = await ctx.db.messages.upsertByEntityId(event.ts, {
							...event,
							id: event.ts,
							authorId: 'user' in event ? event.user : undefined,
							createdAt: new Date(parseFloat(event.ts) * 1000),
						});
						corsairEntityId = entity?.id || '';
					}
				}
			} catch (error) {
				console.warn('Failed to save message to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slack.webhook.message',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
