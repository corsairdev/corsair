import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { auditPayload } from './logging';
import { circleCICall, compact } from './shared';
import type { CircleCIEndpointOutputs } from './types';

/**
 * Lists the workflows belonging to a pipeline.
 *
 * Wrapped in `{items: [...], next_page_token}` per the spec, returned to the
 * caller as that same envelope rather than unwrapped to a bare array, so
 * `next_page_token` is not silently discarded. Pass it back as this
 * operation's `pageToken` input to fetch the next page.
 */
export const listByPipelineId: CircleCIEndpoints['workflowsListByPipelineId'] =
	async (ctx, input) => {
		const result = await circleCICall<
			CircleCIEndpointOutputs['workflowsListByPipelineId']
		>(ctx, `pipeline/${input.pipelineId}/workflow`, {
			query: compact({ 'page-token': input.pageToken }),
		});

		await logEventFromContext(
			ctx,
			'circleci.workflows.listByPipelineId',
			{ ...auditPayload(input, ['pipelineId']), returned: result.items.length },
			'completed',
		);
		return result;
	};

/** Gets metrics and trends for one named workflow of a project. */
export const getSummary: CircleCIEndpoints['workflowsGetSummary'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['workflowsGetSummary']
	>(
		ctx,
		`insights/${input.projectSlug}/workflows/${input.workflowName}/summary`,
		{
			query: compact({
				branch: input.branch,
				'all-branches': input.allBranches,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'circleci.workflows.getSummary',
		auditPayload(input, ['projectSlug', 'workflowName']),
		'completed',
	);
	return result;
};

/** Gets summary metrics for a workflow's jobs. */
export const listJobs: CircleCIEndpoints['workflowsListJobs'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['workflowsListJobs']
	>(ctx, `insights/${input.projectSlug}/workflows/${input.workflowName}/jobs`, {
		query: compact({
			'reporting-window': input.reportingWindow,
			branch: input.branch,
			'all-branches': input.allBranches,
			'job-name': input.jobName,
			'page-token': input.pageToken,
		}),
	});

	await logEventFromContext(
		ctx,
		'circleci.workflows.listJobs',
		auditPayload(input, ['projectSlug', 'workflowName']),
		'completed',
	);
	return result;
};

/** Gets test metrics for a workflow - flakiness, slowest tests. */
export const listTestMetrics: CircleCIEndpoints['workflowsListTestMetrics'] =
	async (ctx, input) => {
		const result = await circleCICall<
			CircleCIEndpointOutputs['workflowsListTestMetrics']
		>(
			ctx,
			`insights/${input.projectSlug}/workflows/${input.workflowName}/test-metrics`,
			{
				query: compact({
					branch: input.branch,
					'all-branches': input.allBranches,
				}),
			},
		);

		await logEventFromContext(
			ctx,
			'circleci.workflows.listTestMetrics',
			auditPayload(input, ['projectSlug', 'workflowName']),
			'completed',
		);
		return result;
	};
