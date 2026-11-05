import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { auditPayload } from './logging';
import { circleCICall, compact } from './shared';
import type { CircleCIEndpointInputs, CircleCIEndpointOutputs } from './types';

/** Gets flaky tests for a project - branch-agnostic, same commit passed and failed. */
export const flakyTests: CircleCIEndpoints['insightsFlakyTests'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['insightsFlakyTests']
	>(ctx, `insights/${input.projectSlug}/flaky-tests`);

	await logEventFromContext(
		ctx,
		'circleci.insights.flakyTests',
		auditPayload(input, ['projectSlug']),
		'completed',
	);
	return result;
};

/** Gets summary metrics for all of a project's workflows. */
export const projectWorkflows: CircleCIEndpoints['insightsProjectWorkflows'] =
	async (ctx, input) => {
		const result = await circleCICall<
			CircleCIEndpointOutputs['insightsProjectWorkflows']
		>(ctx, `insights/${input.projectSlug}/workflows`, {
			query: compact({
				'reporting-window': input.reportingWindow,
				branch: input.branch,
				'all-branches': input.allBranches,
				'page-token': input.pageToken,
			}),
		});

		await logEventFromContext(
			ctx,
			'circleci.insights.projectWorkflows',
			auditPayload(input, ['projectSlug']),
			'completed',
		);
		return result;
	};

/** Gets summary metrics and trends for a project across its workflows and branches. */
export const pagesSummary: CircleCIEndpoints['insightsPagesSummary'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['insightsPagesSummary']
	>(ctx, `insights/pages/${input.projectSlug}/summary`, {
		query: compact({
			'reporting-window': input.reportingWindow,
			branches: input.branches,
			'workflow-names': input.workflowNames,
		}),
	});

	await logEventFromContext(
		ctx,
		'circleci.insights.pagesSummary',
		auditPayload(input, ['projectSlug']),
		'completed',
	);
	return result;
};

/** Lists the branches with workflow runs in a project's Insights data. */
export const branches: CircleCIEndpoints['insightsBranches'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['insightsBranches']
	>(ctx, `insights/${input.projectSlug}/branches`, {
		query: compact({ 'workflow-name': input.workflowName }),
	});

	await logEventFromContext(
		ctx,
		'circleci.insights.branches',
		auditPayload(input, ['projectSlug']),
		'completed',
	);
	return result;
};

/**
 * The org-wide summary route, shared by two catalog ids.
 *
 * Confirmed live: `LIST_INSIGHTS_SUMMARY` and `QUERY_PLAN_METRICS` resolve to
 * the same `GET /insights/{org-slug}/summary` route. Credit usage
 * (`org_data.metrics.total_credits_used`) is one field inside the same
 * summary object the trends and per-project data come from, not a separate
 * concept - so both catalog ids are implemented here, each with its own audit
 * event, the same alias shape as Habitica's `GET_GROUP`/`GET_PARTY`.
 */
async function orgSummary(
	ctx: Parameters<CircleCIEndpoints['insightsOrgSummary']>[0],
	input: CircleCIEndpointInputs['insightsOrgSummary'],
	event: string,
) {
	const result = await circleCICall<
		CircleCIEndpointOutputs['insightsOrgSummary']
	>(ctx, `insights/${input.orgSlug}/summary`, {
		query: compact({
			'reporting-window': input.reportingWindow,
			'project-names': input.projectNames,
		}),
	});

	await logEventFromContext(
		ctx,
		event,
		auditPayload(input, ['orgSlug']),
		'completed',
	);
	return result;
}

export const orgSummaryList: CircleCIEndpoints['insightsOrgSummary'] = async (
	ctx,
	input,
) => await orgSummary(ctx, input, 'circleci.insights.orgSummary');

export const planMetrics: CircleCIEndpoints['insightsPlanMetrics'] = async (
	ctx,
	input,
) => await orgSummary(ctx, input, 'circleci.insights.planMetrics');
