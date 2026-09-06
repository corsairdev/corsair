import { logEventFromContext } from 'corsair/core';
import type { CannyWebhooks } from '../index';
import {
	CannyVoteCreatedEventSchema,
	createCannyMatch,
	verifyCannyWebhookSignature,
} from './types';

export const created: CannyWebhooks['voteCreated'] = {
	match: createCannyMatch('vote.created'),

	handler: async (ctx, request) => {
		const verification = verifyCannyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const parsed = CannyVoteCreatedEventSchema.safeParse(request.payload);
		if (!parsed.success) {
			if ((request.payload as { type?: string })?.type !== 'vote.created') {
				return { success: true, data: undefined };
			}
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid payload format',
			};
		}

		const event = parsed.data;
		const vote = event.object;
		if (ctx.db.votes && vote.id) {
			try {
				await ctx.db.votes.upsertByEntityId(vote.id, {
					id: vote.id,
					created: new Date(vote.created),
					postID: vote.post?.id,
					voterID: vote.voter?.id,
					boardID: vote.board?.id,
				});
			} catch (error) {
				console.warn('Failed to save vote to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'canny.webhook.vote.created',
			{ id: vote.id, postID: vote.post?.id, voterID: vote.voter?.id },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const VoteWebhooks = {
	created,
};
