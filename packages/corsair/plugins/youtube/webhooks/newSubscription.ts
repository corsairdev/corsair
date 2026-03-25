import { logEventFromContext } from '../../utils/events';
import type { YoutubeWebhooks } from '..';
import { NewSubscriptionEventSchema } from './types';

export const newSubscription: YoutubeWebhooks['newSubscription'] = {
	match: (request) => {
		// Matched by checking for the 'subscription' field characteristic of new subscription poll events
		// body is typed as unknown here because it can be raw string or pre-parsed object
		const body = request.body;
		if (typeof body === 'string') {
			try {
				// body arrives as raw string when not pre-parsed by middleware
				const parsed = JSON.parse(body) as Record<string, unknown>;
				return 'subscription' in parsed;
			} catch {
				return false;
			}
		}
		if (body && typeof body === 'object') {
			return 'subscription' in (body as Record<string, unknown>);
		}
		return false;
	},

	handler: async (ctx, request) => {
		const event = request.payload;
		const parsed = NewSubscriptionEventSchema.safeParse(event);

		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid subscription event payload',
			};
		}

		const { subscription } = parsed.data;

		if (subscription.id && ctx.db.subscriptions) {
			try {
				await ctx.db.subscriptions.upsertByEntityId(subscription.id, {
					id: subscription.id,
					channelId: subscription.snippet?.resourceId?.channelId,
					title: subscription.snippet?.title,
					description: subscription.snippet?.description,
					publishedAt: subscription.snippet?.publishedAt,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save subscription to database:', error);
			}
		}

		await logEventFromContext(ctx, 'youtube.webhook.newSubscription', { subscriptionId: subscription.id }, 'completed');

		return {
			success: true,
			data: parsed.data,
		};
	},
};
