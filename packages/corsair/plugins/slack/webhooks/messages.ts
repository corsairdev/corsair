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
				if ('subtype' in event && event.subtype === 'message_changed') {
					// MessageChangedEvent — event.message is SlackMessageObject (no channel/event_ts)
					const updated = event.message;
					const entity = await ctx.db.messages.upsertByEntityId(updated.ts, {
						id: updated.ts,
						ts: updated.ts,
						type: updated.type,
						text: updated.text,
						user: updated.user,
						bot_id: updated.bot_id,
						team: updated.team,
						channel: event.channel,
						thread_ts: updated.thread_ts,
						reply_count: updated.reply_count,
						is_locked: updated.is_locked,
						subscribed: updated.subscribed,
						authorId: updated.user,
						createdAt: new Date(parseFloat(updated.ts) * 1000),
					});
					corsairEntityId = entity?.id || '';
				} else if (
					!('subtype' in event) ||
					event.subtype !== 'message_deleted'
				) {
					// GenericMessageEvent, BotMessageEvent, FileShareMessageEvent, etc.
					// Skip message_deleted — the message no longer exists and we don't
					// want to create a spurious record keyed on the deletion-event timestamp.
					if (event.ts) {
						const entity = await ctx.db.messages.upsertByEntityId(event.ts, {
							id: event.ts,
							ts: event.ts,
							type: event.type,
							subtype: 'subtype' in event ? event.subtype : undefined,
							text: 'text' in event ? event.text : undefined,
							user: 'user' in event ? event.user : undefined,
							bot_id: 'bot_id' in event ? event.bot_id : undefined,
							team: 'team' in event ? event.team : undefined,
							username: 'username' in event ? event.username : undefined,
							channel: event.channel,
							thread_ts: 'thread_ts' in event ? event.thread_ts : undefined,
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
