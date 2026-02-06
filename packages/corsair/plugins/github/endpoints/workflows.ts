import { logEventFromContext } from '../../utils/events';
import type { GithubEndpoints } from '..';
import { makeGithubRequest } from '../client';
import type {
	WorkflowGetResponse,
	WorkflowRunsListResponse,
	WorkflowsListResponse,
} from './types';

export const list: GithubEndpoints['workflowsList'] = async (ctx, input) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/actions/workflows`;
	const result = await makeGithubRequest<WorkflowsListResponse>(
		endpoint,
		ctx.key,
		{ query: queryParams },
	);

	if (result && ctx.db.workflows) {
		try {
			const workflows = result.workflows || [];
			if (Array.isArray(workflows)) {
				for (const workflow of workflows) {
					await ctx.db.workflows.upsertByEntityId(workflow.id.toString(), workflow);
				}
			}
		} catch (error) {
			console.warn('Failed to save workflows to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.workflows.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GithubEndpoints['workflowsGet'] = async (ctx, input) => {
	const { owner, repo, workflowId } = input;
	const endpoint = `/repos/${owner}/${repo}/actions/workflows/${workflowId}`;
	const result = await makeGithubRequest<WorkflowGetResponse>(endpoint, ctx.key);

	if (result && ctx.db.workflows) {
		try {
			await ctx.db.workflows.upsertByEntityId(result.id.toString(), result);
		} catch (error) {
			console.warn('Failed to save workflow to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.workflows.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const listRuns: GithubEndpoints['workflowsListRuns'] = async (
	ctx,
	input,
) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/actions/runs`;
	const result = await makeGithubRequest<WorkflowRunsListResponse>(
		endpoint,
		ctx.key,
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
