import { logEventFromContext } from 'corsair/core';
import type { SlackbotWebhooks } from '../index';
import type { ReactionAddedEvent, ReactionRemovedEvent } from './types';
import {
	createSlackbotEventMatch,
	verifySlackbotWebhookSignature,
} from './types';

/** An emoji reaction added to a message or file. */
export const reactionAdded: SlackbotWebhooks['reactionAdded'] = {
	match: createSlackbotEventMatch('reaction_added'),

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
			event?: ReactionAddedEvent;
		};
		const event =
			envelope?.type === 'event_callback' ? envelope.event : undefined;

		if (!event || event.type !== 'reaction_added') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'slackbot.webhook.reactionAdded',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};

/** An emoji reaction removed from a message or file. */
export const reactionRemoved: SlackbotWebhooks['reactionRemoved'] = {
	match: createSlackbotEventMatch('reaction_removed'),

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
			event?: ReactionRemovedEvent;
		};
		const event =
			envelope?.type === 'event_callback' ? envelope.event : undefined;

		if (!event || event.type !== 'reaction_removed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'slackbot.webhook.reactionRemoved',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
