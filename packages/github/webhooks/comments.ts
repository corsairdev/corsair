import type { GithubWebhooks } from '../index';
import type { Comment } from './types';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

async function upsertComment(
	ctx: Parameters<GithubWebhooks['commentCreated']['handler']>[0],
	comment: Comment,
	deletedAt?: Date | null,
) {
	if (!ctx.db.comments) return;
	await ctx.db.comments.upsertByEntityId(comment.id.toString(), {
		id: comment.id,
		nodeId: comment.node_id,
		url: comment.url,
		htmlUrl: comment.html_url,
		issueUrl: comment.issue_url,
		body: comment.body,
		authorAssociation: comment.author_association,
		createdAt: comment.created_at ? new Date(comment.created_at) : null,
		updatedAt: comment.updated_at ? new Date(comment.updated_at) : null,
		deletedAt: deletedAt ?? null,
	});
}

export const commentCreated: GithubWebhooks['commentCreated'] = {
	match: createGithubEventMatch('issue_comment', 'created'),
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
		console.log('GitHub Comment Created:', {
			issue: event.issue.number,
			commenter: event.comment.user.login,
			repository: event.repository.full_name,
		});
		try {
			await upsertComment(ctx, event.comment);
		} catch (error) {
			console.warn('Failed to save comment to database:', error);
		}
		return { success: true, data: event };
	},
};

export const commentEdited: GithubWebhooks['commentEdited'] = {
	match: createGithubEventMatch('issue_comment', 'edited'),
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
		console.log('GitHub Comment Edited:', {
			issue: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertComment(ctx, event.comment);
		} catch (error) {
			console.warn('Failed to update comment in database:', error);
		}
		return { success: true, data: event };
	},
};

export const commentDeleted: GithubWebhooks['commentDeleted'] = {
	match: createGithubEventMatch('issue_comment', 'deleted'),
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
		console.log('GitHub Comment Deleted:', {
			issue: event.issue.number,
			repository: event.repository.full_name,
		});
		try {
			await upsertComment(ctx, event.comment, new Date());
		} catch (error) {
			console.warn('Failed to update comment in database:', error);
		}
		return { success: true, data: event };
	},
};
