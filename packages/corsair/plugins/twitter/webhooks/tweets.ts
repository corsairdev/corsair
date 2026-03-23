import { logEventFromContext } from '../../utils/events';
import type { TwitterWebhooks } from '..';
import {
	createTwitterMatch,
	verifyTwitterWebhookSignature,
} from './types';

export const tweetCreate: TwitterWebhooks['tweetCreate'] = {
	match: createTwitterMatch('tweet_create_events'),

	handler: async (ctx, request) => {
		const verification = verifyTwitterWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Webhook signature verification failed',
			};
		}

		// payload is typed as unknown by the framework; narrowed after match check
		const event = request.payload as import('./types').TweetCreateEvent;

		if (!event.tweet_create_events?.length) {
			return { success: true, data: undefined };
		}

		console.log('[twitter] Tweet create event:', {
			forUserId: event.for_user_id,
			count: event.tweet_create_events.length,
		});

		let corsairEntityId = '';

		if (ctx.db.tweets) {
			for (const tweet of event.tweet_create_events) {
				try {
					const entity = await ctx.db.tweets.upsertByEntityId(tweet.id_str, {
						id: tweet.id_str,
						text: tweet.text,
						authorId: tweet.user?.id_str,
						createdAt: tweet.created_at,
						inReplyToUserId: tweet.in_reply_to_user_id_str ?? undefined,
						...(tweet.in_reply_to_status_id_str
							? {
									referencedTweets: [
										{
											type: 'replied_to' as const,
											id: tweet.in_reply_to_status_id_str,
										},
									],
								}
							: {}),
					});
					if (!corsairEntityId && entity?.id) {
						corsairEntityId = entity.id;
					}
				} catch (error) {
					console.warn(
						'[twitter] Failed to save tweet to database:',
						error,
					);
				}
			}
		}

		await logEventFromContext(
			ctx,
			'twitter.webhook.tweetCreate',
			{
				forUserId: event.for_user_id,
				tweetIds: event.tweet_create_events.map((t) => t.id_str),
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
