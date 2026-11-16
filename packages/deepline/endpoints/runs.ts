import { makeDeeplineRequest, segment } from '../client';
import { defineEndpoint } from './common';
import {
	GetRunInputSchema,
	GetRunOutputSchema,
	GetRunsHistoryInputSchema,
	GetRunsHistoryOutputSchema,
	ListRunChildrenInputSchema,
	ListRunChildrenOutputSchema,
	RunLogsInputSchema,
	RunLogsOutputSchema,
} from './types';
export const history = defineEndpoint({
	event: 'deepline.runs.history',
	input: GetRunsHistoryInputSchema,
	output: GetRunsHistoryOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/dashboard/runs-history`, ctx.key, {
			method: 'GET',
			query: {
				search: input.search,
				cursor: input.cursor,
				type: input.type,
				limit: input.limit,
			},
		}),
});
export const get = defineEndpoint({
	event: 'deepline.runs.get',
	input: GetRunInputSchema,
	output: GetRunOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/runs/${segment(input.runId)}`, ctx.key, {
			method: 'GET',
			query: {
				full: input.full,
				include: input.include,
				billing: input.billing,
				watchSnapshot: input.watchSnapshot,
			},
		}),
});
export const children = defineEndpoint({
	event: 'deepline.runs.children',
	input: ListRunChildrenInputSchema,
	output: ListRunChildrenOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/runs/${segment(input.runId)}/children`,
			ctx.key,
			{
				method: 'GET',
				query: {
					launchKey: input.launchKey,
					cursor: input.cursor,
					limit: input.limit,
				},
			},
		),
});

export const logs = defineEndpoint({
	event: 'deepline.runs.logs',
	input: RunLogsInputSchema,
	output: RunLogsOutputSchema,
	run: (ctx, { runId, ...query }) =>
		makeDeeplineRequest(`/api/v2/runs/${segment(runId)}/logs`, ctx.key, {
			query,
		}),
});
