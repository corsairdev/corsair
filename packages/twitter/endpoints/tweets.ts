import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeXRequest } from '../client';
import type { TwitterContext } from '../index';
import { timeoutFor } from './operations';

/**
 * `tweets.create` and `tweets.createReply`: the plugin's first two endpoints,
 * kept with their camelCase inputs so existing callers keep working. Both post
 * through POST /2/tweets, as posts.create does with X's own field names.
 */

// ── Input Schemas ─────────────────────────────────────────────────────────────

export const TweetsCreateInputSchema = z.object({
	text: z.string().describe('Post text (up to 280 weighted characters)'),
	quoteTweetId: z
		.string()
		.optional()
		.describe(
			'ID of the post to quote. X removed quote posts from the self-serve tiers on 2026-04-20, so this may answer 403.',
		),
	mediaIds: z
		.array(z.string())
		.optional()
		.describe('Up to 4 media IDs to attach (from media.upload.*)'),
	replySettings: z
		.enum(['following', 'mentionedUsers', 'subscribers'])
		.optional()
		.describe('Restricts who can reply to this post'),
});

export const TweetsCreateReplyInputSchema = z.object({
	text: z.string().describe('Reply text (up to 280 weighted characters)'),
	inReplyToTweetId: z.string().describe('ID of the post to reply to'),
	excludeReplyUserIds: z
		.array(z.string())
		.optional()
		.describe("User IDs to leave out of the reply's @mentions"),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const TweetDataSchema = z
	.object({
		id: z.string(),
		text: z.string(),
	})
	.passthrough();

export const TweetsCreateResponseSchema = z
	.object({
		data: TweetDataSchema.optional(),
	})
	.passthrough();

export const TweetsCreateReplyResponseSchema = TweetsCreateResponseSchema;

export type TweetsCreateInput = z.infer<typeof TweetsCreateInputSchema>;
export type TweetsCreateResponse = z.infer<typeof TweetsCreateResponseSchema>;
export type TweetsCreateReplyInput = z.infer<
	typeof TweetsCreateReplyInputSchema
>;
export type TweetsCreateReplyResponse = z.infer<
	typeof TweetsCreateReplyResponseSchema
>;

// `unknown` because the body is X's JSON until the response schema parses it.
async function postTweet(ctx: TwitterContext, body: Record<string, unknown>) {
	if (ctx.options?.authType === 'api_key') {
		throw new Error(
			"X needs a user's OAuth 2.0 token to post; the app's Bearer token can't act as a user. Connect with authType 'oauth_2'.",
		);
	}
	const raw = await makeXRequest({
		key: ctx.key,
		method: 'POST',
		path: '/2/tweets',
		body,
		timeoutMs: timeoutFor('posts.create'),
	});
	const parsed = TweetsCreateResponseSchema.safeParse(raw);
	if (!parsed.success) {
		throw new Error(
			'X tweets.create response did not match its documented schema',
		);
	}
	return parsed.data;
}

async function savePost(
	ctx: TwitterContext,
	response: TweetsCreateResponse,
	referencedTweets?: { type: 'replied_to'; id: string }[],
) {
	if (!response.data?.id || !ctx.db?.tweets) return;
	try {
		await ctx.db.tweets.upsertByEntityId(response.data.id, {
			id: response.data.id,
			text: response.data.text,
			...(referencedTweets ? { referencedTweets } : {}),
		});
	} catch {
		// The post is live either way; a failed local copy isn't the caller's error.
		console.warn('[twitter] could not save the post to the database');
	}
}

export async function create(
	ctx: TwitterContext,
	input: TweetsCreateInput,
): Promise<TweetsCreateResponse> {
	const { text, quoteTweetId, mediaIds, replySettings } =
		TweetsCreateInputSchema.parse(input);
	const response = await postTweet(ctx, {
		text,
		...(quoteTweetId ? { quote_tweet_id: quoteTweetId } : {}),
		...(mediaIds ? { media: { media_ids: mediaIds } } : {}),
		...(replySettings ? { reply_settings: replySettings } : {}),
	});
	await savePost(ctx, response);
	// Post text stays out of the event log.
	await logEventFromContext(ctx, 'twitter.tweets.create', {}, 'completed');
	return response;
}

export async function createReply(
	ctx: TwitterContext,
	input: TweetsCreateReplyInput,
): Promise<TweetsCreateReplyResponse> {
	const { text, inReplyToTweetId, excludeReplyUserIds } =
		TweetsCreateReplyInputSchema.parse(input);
	const response = await postTweet(ctx, {
		text,
		reply: {
			in_reply_to_tweet_id: inReplyToTweetId,
			...(excludeReplyUserIds
				? { exclude_reply_user_ids: excludeReplyUserIds }
				: {}),
		},
	});
	await savePost(ctx, response, [{ type: 'replied_to', id: inReplyToTweetId }]);
	await logEventFromContext(
		ctx,
		'twitter.tweets.createReply',
		{ inReplyToTweetId },
		'completed',
	);
	return response;
}
