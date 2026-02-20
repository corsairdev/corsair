import { logEventFromContext } from '../../utils/events';
import type { TelegramWebhooks } from '..';
import { createTelegramMatch, verifyTelegramWebhookSignature } from './types';
import type { PollEvent, TelegramUpdate } from './types';

export const poll: TelegramWebhooks['poll'] = {
	match: createTelegramMatch('poll'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyTelegramWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const update = request.payload as TelegramUpdate;

		if (!update || !update.poll) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event: PollEvent = {
			update_id: update.update_id,
			poll: update.poll,
		};

		if (ctx.db.polls && event.poll.id) {
			try {
				await ctx.db.polls.upsertByEntityId(event.poll.id, {
					...event.poll,
					poll_id: event.poll.id,
				});
			} catch (error) {
				console.warn('Failed to save poll to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'telegram.webhook.poll',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
