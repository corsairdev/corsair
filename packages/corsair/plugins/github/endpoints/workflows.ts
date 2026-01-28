import { logEventFromContext } from '../../utils/events';
import type { GithubEndpoints } from '..';
import { makeGithubRequest } from '../client';
import type {
	WorkflowGetResponse,
	WorkflowsListResponse,
	WorkflowRunsListResponse,
} from './types';

export const list: GithubEndpoints['workflowsList'] = async (ctx, input) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/actions/workflows`;
	const result = await makeGithubRequest<WorkflowsListResponse>(
		endpoint,
		ctx.options.token,
		{ query: queryParams },
	);

	if (result.workflows && ctx.db.workflows) {
		try {
			for (const workflow of result.workflows) {
				await ctx.db.workflows.upsert(workflow.id.toString(), {
					id: workflow.id,
					nodeId: workflow.nodeId,
					name: workflow.name,
					path: workflow.path,
					state: workflow.state,
					url: workflow.url,
					htmlUrl: workflow.htmlUrl,
					badgeUrl: workflow.badgeUrl,
					createdAt: new Date(workflow.createdAt),
					updatedAt: new Date(workflow.updatedAt),
					deletedAt: workflow.deletedAt ? new Date(workflow.deletedAt) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save workflows to database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.workflows.list', { ...input }, 'completed');
	return result;
};

export const get: GithubEndpoints['workflowsGet'] = async (ctx, input) => {
	const { owner, repo, workflowId } = input;
	const endpoint = `/repos/${owner}/${repo}/actions/workflows/${workflowId}`;
	const result = await makeGithubRequest<WorkflowGetResponse>(
		endpoint,
		ctx.options.token,
	);

	if (result && ctx.db.workflows) {
		try {
			await ctx.db.workflows.upsert(result.id.toString(), {
				id: result.id,
				nodeId: result.nodeId,
				name: result.name,
				path: result.path,
				state: result.state,
				url: result.url,
				htmlUrl: result.htmlUrl,
				badgeUrl: result.badgeUrl,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				deletedAt: result.deletedAt ? new Date(result.deletedAt) : null,
			});
		} catch (error) {
			console.warn('Failed to save workflow to database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.workflows.get', { ...input }, 'completed');
	return result;
};

export const listRuns: GithubEndpoints['workflowsListRuns'] = async (ctx, input) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/actions/runs`;
	const result = await makeGithubRequest<WorkflowRunsListResponse>(
		endpoint,
		ctx.options.token,
		{ query: queryParams },
	);

	await logEventFromContext(
		ctx,
		'github.workflows.listRuns',
		{ ...input },
		'completed',
	);
	return result;
};
