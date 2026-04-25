import type { GithubWebhooks } from '../index';
import type { Discussion } from './types';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

async function upsertDiscussion(
	ctx: Parameters<GithubWebhooks['discussionCreated']['handler']>[0],
	discussion: Discussion,
	deletedAt?: Date | null,
) {
	if (!ctx.db.discussions) return;
	await ctx.db.discussions.upsertByEntityId(discussion.id.toString(), {
		id: discussion.id,
		nodeId: discussion.node_id,
		htmlUrl: discussion.html_url,
		repositoryUrl: discussion.repository_url,
		number: discussion.number,
		title: discussion.title,
		body: discussion.body,
		state: discussion.state,
		locked: discussion.locked,
		comments: discussion.comments,
		authorAssociation: discussion.author_association,
		categoryId: discussion.category.id,
		categoryName: discussion.category.name,
		createdAt: discussion.created_at ? new Date(discussion.created_at) : null,
		updatedAt: discussion.updated_at ? new Date(discussion.updated_at) : null,
		answerChosenAt: discussion.answer_chosen_at
			? new Date(discussion.answer_chosen_at)
			: null,
		deletedAt: deletedAt ?? null,
	});
}

export const discussionCreated: GithubWebhooks['discussionCreated'] = {
	match: createGithubEventMatch('discussion', 'created'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'created') return { success: false, data: undefined };
		console.log('GitHub Discussion Created:', {
			number: event.discussion.number,
			title: event.discussion.title,
			repository: event.repository.full_name,
		});
		try {
			await upsertDiscussion(ctx, event.discussion);
		} catch (error) {
			console.warn('Failed to save discussion to database:', error);
		}
		return { success: true, data: event };
	},
};

export const discussionEdited: GithubWebhooks['discussionEdited'] = {
	match: createGithubEventMatch('discussion', 'edited'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'edited') return { success: false, data: undefined };
		console.log('GitHub Discussion Edited:', {
			number: event.discussion.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertDiscussion(ctx, event.discussion);
		} catch (error) {
			console.warn('Failed to update discussion in database:', error);
		}
		return { success: true, data: event };
	},
};

export const discussionClosed: GithubWebhooks['discussionClosed'] = {
	match: createGithubEventMatch('discussion', 'closed'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'closed') return { success: false, data: undefined };
		console.log('GitHub Discussion Closed:', {
			number: event.discussion.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertDiscussion(ctx, event.discussion);
		} catch (error) {
			console.warn('Failed to update discussion in database:', error);
		}
		return { success: true, data: event };
	},
};

export const discussionReopened: GithubWebhooks['discussionReopened'] = {
	match: createGithubEventMatch('discussion', 'reopened'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'reopened') return { success: false, data: undefined };
		console.log('GitHub Discussion Reopened:', {
			number: event.discussion.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertDiscussion(ctx, event.discussion);
		} catch (error) {
			console.warn('Failed to update discussion in database:', error);
		}
		return { success: true, data: event };
	},
};

export const discussionAnswered: GithubWebhooks['discussionAnswered'] = {
	match: createGithubEventMatch('discussion', 'answered'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'answered') return { success: false, data: undefined };
		console.log('GitHub Discussion Answered:', {
			number: event.discussion.number,
			answerer: event.answer.user.login,
			repository: event.repository.full_name,
		});
		try {
			await upsertDiscussion(ctx, event.discussion);
		} catch (error) {
			console.warn('Failed to update discussion in database:', error);
		}
		return { success: true, data: event };
	},
};

export const discussionDeleted: GithubWebhooks['discussionDeleted'] = {
	match: createGithubEventMatch('discussion', 'deleted'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'deleted') return { success: false, data: undefined };
		console.log('GitHub Discussion Deleted:', {
			number: event.discussion.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertDiscussion(ctx, event.discussion, new Date());
		} catch (error) {
			console.warn('Failed to update discussion in database:', error);
		}
		return { success: true, data: event };
	},
};

export const discussionCommentCreated: GithubWebhooks['discussionCommentCreated'] =
	{
		match: createGithubEventMatch('discussion_comment', 'created'),
		handler: async (ctx, request) => {
			const v = verifyGithubWebhookSignature(request, ctx.key);
			if (!v.valid)
				return {
					success: false,
					statusCode: 401,
					error: v.error || 'Signature verification failed',
				};
			const event = request.payload;
			if (event.action !== 'created')
				return { success: false, data: undefined };
			console.log('GitHub Discussion Comment Created:', {
				discussion: event.discussion.number,
				commenter: event.comment.user.login,
				repository: event.repository.full_name,
			});
			try {
				await upsertDiscussion(ctx, event.discussion);
			} catch (error) {
				console.warn('Failed to update discussion in database:', error);
			}
			return { success: true, data: event };
		},
	};

export const discussionCommentEdited: GithubWebhooks['discussionCommentEdited'] =
	{
		match: createGithubEventMatch('discussion_comment', 'edited'),
		handler: async (ctx, request) => {
			const v = verifyGithubWebhookSignature(request, ctx.key);
			if (!v.valid)
				return {
					success: false,
					statusCode: 401,
					error: v.error || 'Signature verification failed',
				};
			const event = request.payload;
			if (event.action !== 'edited') return { success: false, data: undefined };
			console.log('GitHub Discussion Comment Edited:', {
				discussion: event.discussion.number,
				repository: event.repository.full_name,
			});
			try {
				await upsertDiscussion(ctx, event.discussion);
			} catch (error) {
				console.warn('Failed to update discussion in database:', error);
			}
			return { success: true, data: event };
		},
	};

export const discussionCommentDeleted: GithubWebhooks['discussionCommentDeleted'] =
	{
		match: createGithubEventMatch('discussion_comment', 'deleted'),
		handler: async (ctx, request) => {
			const v = verifyGithubWebhookSignature(request, ctx.key);
			if (!v.valid)
				return {
					success: false,
					statusCode: 401,
					error: v.error || 'Signature verification failed',
				};
			const event = request.payload;
			if (event.action !== 'deleted')
				return { success: false, data: undefined };
			console.log('GitHub Discussion Comment Deleted:', {
				discussion: event.discussion.number,
				repository: event.repository.full_name,
			});
			try {
				await upsertDiscussion(ctx, event.discussion);
			} catch (error) {
				console.warn('Failed to update discussion in database:', error);
			}
			return { success: true, data: event };
		},
	};
