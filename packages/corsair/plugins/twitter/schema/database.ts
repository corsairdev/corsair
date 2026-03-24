import { z } from 'zod';

export const TwitterTweet = z.object({
	id: z.string(),
	text: z.string(),
	authorId: z.string().optional(),
	createdAt: z.string().optional(),
	conversationId: z.string().optional(),
	inReplyToUserId: z.string().nullable().optional(),
	referencedTweets: z
		.array(
			z.object({
				type: z.enum(['retweeted', 'quoted', 'replied_to']),
				id: z.string(),
			}),
		)
		.optional(),
});

export type TwitterTweet = z.infer<typeof TwitterTweet>;
