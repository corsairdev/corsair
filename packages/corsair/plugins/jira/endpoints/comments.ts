import { logEventFromContext } from '../../utils/events';
import type { JiraEndpoints } from '..';
import { makeJiraRequest } from '../client';
import type { JiraEndpointOutputs } from './types';

export const add: JiraEndpoints['commentsAdd'] = async (ctx, input) => {
	// Build ADF body for the comment text
	const body: Record<string, unknown> = {
		body: {
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: input.comment }],
				},
			],
		},
	};

	if (input.visibility_type && input.visibility_value) {
		body.visibility = {
			type: input.visibility_type,
			value: input.visibility_value,
		};
	}

	const result = await makeJiraRequest<JiraEndpointOutputs['commentsAdd']>(
		`issue/${input.issue_id_or_key}/comment`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'POST',
			body,
		},
	);

	if (result.id && ctx.db.comments) {
		try {
			await ctx.db.comments.upsertByEntityId(result.id, {
				id: result.id,
				issueKey: input.issue_id_or_key,
				body: input.comment,
				authorAccountId: result.author?.accountId,
				authorDisplayName: result.author?.displayName,
				created: result.created,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save comment to database:', error);
		}
	}

	await logEventFromContext(ctx, 'jira.comments.add', { ...input }, 'completed');
	return result;
};

export const get: JiraEndpoints['commentsGet'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['commentsGet']>(
		`issue/${input.issue_id_or_key}/comment/${input.comment_id}`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{ method: 'GET' },
	);

	if (result.id && ctx.db.comments) {
		try {
			await ctx.db.comments.upsertByEntityId(result.id, {
				id: result.id,
				issueKey: input.issue_id_or_key,
				authorAccountId: result.author?.accountId,
				authorDisplayName: result.author?.displayName,
				created: result.created,
				updated: result.updated,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save comment to database:', error);
		}
	}

	await logEventFromContext(ctx, 'jira.comments.get', { ...input }, 'completed');
	return result;
};

export const list: JiraEndpoints['commentsList'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['commentsList']>(
		`issue/${input.issue_id_or_key}/comment`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'GET',
			query: {
				startAt: input.start_at,
				maxResults: input.max_results,
				orderBy: input.order_by,
			},
		},
	);

	if (result.comments && ctx.db.comments) {
		for (const comment of result.comments) {
			if (!comment.id) continue;
			try {
				await ctx.db.comments.upsertByEntityId(comment.id, {
					id: comment.id,
					issueKey: input.issue_id_or_key,
					authorAccountId: comment.author?.accountId,
					authorDisplayName: comment.author?.displayName,
					created: comment.created,
					updated: comment.updated,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save comment to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'jira.comments.list', { ...input }, 'completed');
	return result;
};

export const update: JiraEndpoints['commentsUpdate'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['commentsUpdate']>(
		`issue/${input.issue_id_or_key}/comment/${input.comment_id}`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'PUT',
			body: {
				body: {
					version: 1,
					type: 'doc',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: input.comment }],
						},
					],
				},
			},
		},
	);

	if (result.id && ctx.db.comments) {
		try {
			await ctx.db.comments.upsertByEntityId(result.id, {
				id: result.id,
				issueKey: input.issue_id_or_key,
				body: input.comment,
				updated: result.updated,
			});
		} catch (error) {
			console.warn('Failed to update comment in database:', error);
		}
	}

	await logEventFromContext(ctx, 'jira.comments.update', { ...input }, 'completed');
	return result;
};

export const deleteComment: JiraEndpoints['commentsDelete'] = async (ctx, input) => {
	await makeJiraRequest<void>(
		`issue/${input.issue_id_or_key}/comment/${input.comment_id}`,
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'jira.comments.delete', { ...input }, 'completed');
	return { success: true };
};
