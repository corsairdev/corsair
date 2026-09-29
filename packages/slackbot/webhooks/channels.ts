import { logEventFromContext } from 'corsair/core';
import type { SlackbotWebhooks } from '../index';
import type { ChannelCreatedEvent } from './types';
import {
	createSlackbotEventMatch,
	verifySlackbotWebhookSignature,
} from './types';

/** A new channel created in the workspace. */
export const channelCreated: SlackbotWebhooks['channelCreated'] = {
	match: createSlackbotEventMatch('channel_created'),

	handler: async (ctx, request) => {
		const verification = verifySlackbotWebhookSignature(
			request,
			ctx.options?.signingSecret ?? ctx.key,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const envelope = request.payload as {
			type?: string;
			event?: ChannelCreatedEvent;
		};
		const event =
			envelope?.type === 'event_callback' ? envelope.event : undefined;

		if (!event || event.type !== 'channel_created') {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';
		if (ctx.db.channels && event.channel?.id) {
			try {
				const entity = await ctx.db.channels.upsertByEntityId(
					event.channel.id,
					{
						id: event.channel.id,
						name: event.channel.name,
						created: event.channel.created,
						creator: event.channel.creator,
						is_private: event.channel.is_private,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to cache created channel:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'slackbot.webhook.channelCreated',
			{ ...event },
			'completed',
		);

		return { success: true, corsairEntityId, data: event };
	},
};
