import { logEventFromContext } from '../../utils/events';
import type { LinearEndpoints } from '..';
import { makeLinearRequest } from '../client';
import type {
	CommentCreateResponse,
	CommentDeleteResponse,
	CommentsListResponse,
	CommentUpdateResponse,
	CreateCommentInput,
	UpdateCommentInput,
} from './types';

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
	const apiKey = ctx.key;

	const response = await makeLinearRequest<CommentsListResponse>(
		COMMENTS_LIST_QUERY,
		apiKey,
		{
			issueId: input.issueId,
			first: input.first || 50,
			after: input.after,
		},
	);

	const result = response;

	if (result.nodes && ctx.db.comments) {
		try {
			for (const comment of result.nodes) {
				await ctx.db.comments.upsertByEntityId(comment.id, {
					...comment,
					issueId: comment.issue.id,
					userId: comment.user.id,
					parentId: comment.parent?.id,
					createdAt: new Date(comment.createdAt),
					updatedAt: new Date(comment.updatedAt),
				});
			}
		} catch (error) {
			console.warn('Failed to save comments to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'linear.comments.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: LinearEndpoints['commentsCreate'] = async (ctx, input) => {
	const apiKey = ctx.key;

	const response = await makeLinearRequest<CommentCreateResponse>(
		COMMENT_CREATE_MUTATION,
		apiKey,
		{
			input: input as CreateCommentInput,
		},
	);

	const result = response;

	if (result && ctx.db.comments) {
		try {
			await ctx.db.comments.upsertByEntityId(result.id, {
				...result,
				issueId: result.issue.id,
				userId: result.user.id,
				parentId: result.parent?.id,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
			});
		} catch (error) {
			console.warn('Failed to save comment to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'linear.comments.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: LinearEndpoints['commentsUpdate'] = async (ctx, input) => {
	const apiKey = ctx.key;

	const response = await makeLinearRequest<CommentUpdateResponse>(
		COMMENT_UPDATE_MUTATION,
		apiKey,
		{
			id: input.id,
			input: input.input as UpdateCommentInput,
		},
	);

	const result = response;

	if (result && ctx.db.comments) {
		try {
			await ctx.db.comments.upsertByEntityId(result.id, {
				...result,
				issueId: result.issue.id,
				userId: result.user.id,
				parentId: result.parent?.id,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
			});
		} catch (error) {
			console.warn('Failed to update comment in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'linear.comments.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteComment: LinearEndpoints['commentsDelete'] = async (
	ctx,
	input,
) => {
	const apiKey = ctx.key;

	const response = await makeLinearRequest<CommentDeleteResponse>(
		COMMENT_DELETE_MUTATION,
		apiKey,
		{
			id: input.id,
		},
	);

	const success = response;

	if (success && ctx.db.comments) {
		try {
			await ctx.db.comments.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete comment from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'linear.comments.delete',
		{ ...input },
		'completed',
	);
	return success;
};
