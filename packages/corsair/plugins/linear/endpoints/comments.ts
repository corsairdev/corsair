import type { LinearEndpoints } from '..';
import { makeLinearRequest } from '../client';
import type {
	CommentCreateResponse,
	CommentDeleteResponse,
	CommentsListResponse,
	CommentUpdateResponse,
	CreateCommentInput,
	UpdateCommentInput,
} from '../types';
import { logEvent, updateEventStatus } from '../../utils/events';

const COMMENTS_LIST_QUERY = `
  query Comments($issueId: String!, $first: Int!, $after: String) {
    issue(id: $issueId) {
      comments(first: $first, after: $after) {
        nodes {
          id
          body
          issue {
            id
          }
          user {
            id
            name
            displayName
          }
          parent {
            id
          }
          editedAt
          createdAt
          updatedAt
          archivedAt
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

const COMMENT_CREATE_MUTATION = `
  mutation CreateComment($input: CommentCreateInput!) {
    commentCreate(input: $input) {
      success
      comment {
        id
        body
        issue {
          id
        }
        user {
          id
          name
          displayName
        }
        parent {
          id
        }
        createdAt
        updatedAt
        archivedAt
      }
    }
  }
`;

const COMMENT_UPDATE_MUTATION = `
  mutation UpdateComment($id: String!, $input: CommentUpdateInput!) {
    commentUpdate(id: $id, input: $input) {
      success
      comment {
        id
        body
        issue {
          id
        }
        user {
          id
          name
          displayName
        }
        parent {
          id
        }
        editedAt
        createdAt
        updatedAt
        archivedAt
      }
    }
  }
`;

const COMMENT_DELETE_MUTATION = `
  mutation DeleteComment($id: String!) {
    commentDelete(id: $id) {
      success
    }
  }
`;

export const list: LinearEndpoints['commentsList'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'linear.comments.list', {
		issueId: input.issueId,
		first: input.first,
		after: input.after,
	});

	try {
		const apiKey = ctx.options.apiKey;

		const response = await makeLinearRequest<CommentsListResponse>(
			COMMENTS_LIST_QUERY,
			apiKey,
			{
				issueId: input.issueId,
				first: input.first || 50,
				after: input.after,
			},
		);

		const result = response.issue.comments;

		if (result.nodes && ctx.db.comments) {
			try {
				for (const comment of result.nodes) {
					await ctx.db.comments.upsert(comment.id, {
						id: comment.id,
						body: comment.body,
						issueId: comment.issue.id,
						userId: comment.user.id,
						parentId: comment.parent?.id,
						editedAt: comment.editedAt,
						createdAt: new Date(comment.createdAt),
						updatedAt: new Date(comment.updatedAt),
						archivedAt: comment.archivedAt,
					});
				}
			} catch (error) {
				console.warn('Failed to save comments to database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const create: LinearEndpoints['commentsCreate'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'linear.comments.create', {
		body: input.body,
		issueId: input.issueId,
		parentId: input.parentId,
	});

	try {
		const apiKey = ctx.options.apiKey;

		const response = await makeLinearRequest<CommentCreateResponse>(
			COMMENT_CREATE_MUTATION,
			apiKey,
			{
				input: input as CreateCommentInput,
			},
		);

		const result = response.commentCreate.comment;

		if (result && ctx.db.comments) {
			try {
				await ctx.db.comments.upsert(result.id, {
					id: result.id,
					body: result.body,
					issueId: result.issue.id,
					userId: result.user.id,
					parentId: result.parent?.id,
					createdAt: new Date(result.createdAt),
					updatedAt: new Date(result.updatedAt),
					archivedAt: result.archivedAt,
				});
			} catch (error) {
				console.warn('Failed to save comment to database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const update: LinearEndpoints['commentsUpdate'] = async (ctx, input) => {
	const eventId = await logEvent(ctx.database, 'linear.comments.update', {
		id: input.id,
		input: input.input,
	});

	try {
		const apiKey = ctx.options.apiKey;

		const response = await makeLinearRequest<CommentUpdateResponse>(
			COMMENT_UPDATE_MUTATION,
			apiKey,
			{
				id: input.id,
				input: input.input as UpdateCommentInput,
			},
		);

		const result = response.commentUpdate.comment;

		if (result && ctx.db.comments) {
			try {
				const existing = await ctx.db.comments.findByResourceId(result.id);
				await ctx.db.comments.upsert(result.id, {
					id: result.id,
					body: result.body,
					issueId: result.issue.id,
					userId: result.user.id,
					parentId: result.parent?.id,
					editedAt: result.editedAt,
					createdAt: existing?.data?.createdAt || new Date(result.createdAt),
					updatedAt: new Date(result.updatedAt),
					archivedAt: result.archivedAt,
				});
			} catch (error) {
				console.warn('Failed to update comment in database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return result;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};

export const deleteComment: LinearEndpoints['commentsDelete'] = async (
	ctx,
	input,
) => {
	const eventId = await logEvent(ctx.database, 'linear.comments.delete', {
		id: input.id,
	});

	try {
		const apiKey = ctx.options.apiKey;

		const response = await makeLinearRequest<CommentDeleteResponse>(
			COMMENT_DELETE_MUTATION,
			apiKey,
			{
				id: input.id,
			},
		);

		const success = response.commentDelete.success;

		if (success && ctx.db.comments) {
			try {
				await ctx.db.comments.deleteByResourceId(input.id);
			} catch (error) {
				console.warn('Failed to delete comment from database:', error);
			}
		}

		await updateEventStatus(ctx.database, eventId, 'completed');
		return success;
	} catch (error) {
		await updateEventStatus(ctx.database, eventId, 'failed');
		throw error;
	}
};
