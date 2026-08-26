import { logEventFromContext } from 'corsair/core';
import type { SlackbotContext, SlackbotWebhooks } from '../index';
import type { MessageEvent } from './types';
import {
	matchBotMessage,
	matchDirectMessage,
	matchGroupDirectMessage,
	matchMessage,
	matchPrivateChannelMessage,
	matchThreadReply,
	verifySlackbotWebhookSignature,
} from './types';

/**
 * All six message triggers share the same body: verify, cache, log, return.
 * Only the matcher and the logged event name differ, so the handler is built
 * once and specialised per trigger.
 */
function createMessageHandler(eventName: string) {
	return async (
		ctx: SlackbotContext,
		request: {
			payload: unknown;
			rawBody?: string;
			headers: Record<string, unknown>;
		},
	) => {
		const verification = verifySlackbotWebhookSignature(
			request as Parameters<typeof verifySlackbotWebhookSignature>[0],
			ctx.options?.signingSecret ?? ctx.key,
		);
		if (!verification.valid) {
			return {
				success: false as const,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const envelope = request.payload as { type?: string; event?: MessageEvent };
		const event =
			envelope?.type === 'event_callback' ? envelope.event : undefined;

		if (!event || event.type !== 'message') {
			return { success: true as const, data: undefined };
		}

		let corsairEntityId = '';
		if (ctx.db.messages && event.ts) {
			try {
				const entity = await ctx.db.messages.upsertByEntityId(event.ts, {
					id: event.ts,
					ts: event.ts,
					channel: event.channel,
					channel_type: event.channel_type,
					text: event.text,
					user: event.user,
					bot_id: event.bot_id,
					app_id: event.app_id,
					team: event.team,
					subtype: event.subtype,
					thread_ts: event.thread_ts,
					authorId: event.user,
					// Slack timestamps are epoch seconds with microsecond precision.
					createdAt: new Date(Number.parseFloat(event.ts) * 1000),
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				// A caching failure must not make Slack retry a delivered event.
				console.warn('Failed to cache incoming message:', error);
			}
		}

		await logEventFromContext(ctx, eventName, { ...event }, 'completed');

		return { success: true as const, corsairEntityId, data: event };
	};
}

/** A message in a public channel, from a human, outside any thread. */
export const message: SlackbotWebhooks['message'] = {
	match: matchMessage,
	handler: createMessageHandler('slackbot.webhook.message'),
};

/** A direct message to the bot. */
export const directMessage: SlackbotWebhooks['directMessage'] = {
	match: matchDirectMessage,
	handler: createMessageHandler('slackbot.webhook.directMessage'),
};

/** A message in a multi-person DM. */
export const groupDirectMessage: SlackbotWebhooks['groupDirectMessage'] = {
	match: matchGroupDirectMessage,
	handler: createMessageHandler('slackbot.webhook.groupDirectMessage'),
};

/** A message in a private channel. */
export const privateChannelMessage: SlackbotWebhooks['privateChannelMessage'] =
	{
		match: matchPrivateChannelMessage,
		handler: createMessageHandler('slackbot.webhook.privateChannelMessage'),
	};

/**
 * A message posted by another bot or app. Claimed ahead of the surface-specific
 * triggers so bot chatter cannot re-enter an automation that produced it.
 */
export const botMessage: SlackbotWebhooks['botMessage'] = {
	match: matchBotMessage,
	handler: createMessageHandler('slackbot.webhook.botMessage'),
};

/** A human reply inside a thread, on any surface. */
export const threadReply: SlackbotWebhooks['threadReply'] = {
	match: matchThreadReply,
	handler: createMessageHandler('slackbot.webhook.threadReply'),
};
