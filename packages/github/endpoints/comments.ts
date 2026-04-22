import { logEventFromContext } from 'corsair/core';
import { makeGithubRequest } from '../client';
import type { GithubEndpoints } from '../index';
import type {
	CommentGetResponse,
	CommentsListResponse,
	CommentUpdateResponse,
} from './types';

async function upsertComment(
	db: Parameters<GithubEndpoints['commentsGet']>[0]['db'],
	comment: CommentGetResponse,
) {
	if (!db.comments) return;
	await db.comments.upsertByEntityId(comment.id.toString(), {
		id: comment.id,
		nodeId: comment.nodeId,
		url: comment.url,
		htmlUrl: comment.htmlUrl,
		issueUrl: comment.issueUrl,
		body: comment.body,
		authorAssociation: comment.authorAssociation,
		createdAt: comment.createdAt ? new Date(comment.createdAt) : null,
		updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : null,
	});
}

export const list: GithubEndpoints['commentsList'] = async (ctx, input) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/issues/comments`;
	const result = await makeGithubRequest<CommentsListResponse>(
		endpoint,
		ctx.key,
		{ query: queryParams },
	);

	if (result) {
		try {
			for (const comment of result) {
				await upsertComment(ctx.db, comment);
			}
		} catch (error) {
			console.warn('Failed to save comments to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.comments.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const listForIssue: GithubEndpoints['commentsListForIssue'] = async (
	ctx,
	input,
) => {
	const { owner, repo, issueNumber, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
	const result = await makeGithubRequest<CommentsListResponse>(
		endpoint,
		ctx.key,
		{ query: queryParams },
	);

	if (result) {
		try {
			for (const comment of result) {
				await upsertComment(ctx.db, comment);
			}
		} catch (error) {
			console.warn('Failed to save comments to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.comments.listForIssue',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GithubEndpoints['commentsGet'] = async (ctx, input) => {
	const { owner, repo, commentId } = input;
	const endpoint = `/repos/${owner}/${repo}/issues/comments/${commentId}`;
	const result = await makeGithubRequest<CommentGetResponse>(endpoint, ctx.key);

	if (result) {
		try {
			await upsertComment(ctx.db, result);
		} catch (error) {
			console.warn('Failed to save comment to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.comments.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GithubEndpoints['commentsUpdate'] = async (ctx, input) => {
	const { owner, repo, commentId, body } = input;
	const endpoint = `/repos/${owner}/${repo}/issues/comments/${commentId}`;
	const result = await makeGithubRequest<CommentUpdateResponse>(
		endpoint,
		ctx.key,
		{ method: 'PATCH', body: { body } },
	);

	if (result) {
		try {
			await upsertComment(ctx.db, result);
		} catch (error) {
			console.warn('Failed to update comment in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.comments.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteComment: GithubEndpoints['commentsDelete'] = async (
	ctx,
	input,
) => {
	const { owner, repo, commentId } = input;
	const commentEndpoint = `/repos/${owner}/${repo}/issues/comments/${commentId}`;

	// Fetch before deleting so we can preserve all fields in the soft-delete upsert
	let existing: CommentGetResponse | undefined;
	try {
		existing = await makeGithubRequest<CommentGetResponse>(
			commentEndpoint,
			ctx.key,
		);
	} catch {
		// Comment may already be gone; proceed with deletion regardless
	}

	await makeGithubRequest<void>(commentEndpoint, ctx.key, { method: 'DELETE' });

	if (ctx.db.comments) {
		try {
			await ctx.db.comments.upsertByEntityId(commentId.toString(), {
				id: commentId,
				...(existing && {
					nodeId: existing.nodeId,
					url: existing.url,
					htmlUrl: existing.htmlUrl,
					issueUrl: existing.issueUrl,
					body: existing.body,
					authorAssociation: existing.authorAssociation,
					createdAt: existing.createdAt ? new Date(existing.createdAt) : null,
					updatedAt: existing.updatedAt ? new Date(existing.updatedAt) : null,
				}),
				deletedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to mark comment as deleted in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.comments.delete',
		{ ...input },
		'completed',
	);
};
