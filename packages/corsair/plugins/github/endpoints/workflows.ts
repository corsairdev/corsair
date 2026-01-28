import { logEventFromContext } from '../../utils/events';
import type { GithubBoundEndpoints, GithubEndpoints } from '..';
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
			await ctx.db.workflows.upsert(result.id.toString(), result);
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
