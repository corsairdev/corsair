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
import {
	GetRunBillingInputSchema,
	GetRunBillingOutputSchema,
	GetRunInputDataInputSchema,
	GetRunInputDataOutputSchema,
	GetRunReceiptsInputSchema,
	GetRunReceiptsOutputSchema,
	GetRunStatusInputSchema,
	GetRunStatusOutputSchema,
	ListRunsInputSchema,
	ListRunsOutputSchema,
	RECEIPT_BATCH_SIZE,
	RerunInputSchema,
	RerunOutputSchema,
	ResumeRunInputSchema,
	ResumeRunOutputSchema,
	SearchRunEventsInputSchema,
	SearchRunEventsOutputSchema,
	StopAllRunsInputSchema,
	StopAllRunsOutputSchema,
	StopRunInputSchema,
	StopRunOutputSchema,
} from './types-runs';
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

export const list = defineEndpoint({
	event: 'deepline.runs.list',
	input: ListRunsInputSchema,
	output: ListRunsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/runs`, ctx.key, {
			method: 'GET',
			query: {
				play: input.play,
				status: input.status,
				runId: input.runId,
				node: input.node,
				limit: input.limit,
				offset: input.offset,
				compact: true,
			},
		}),
});
export const status = defineEndpoint({
	event: 'deepline.runs.status',
	input: GetRunStatusInputSchema,
	output: GetRunStatusOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/runs/${segment(input.runId)}/status`,
			ctx.key,
			{
				method: 'GET',
			},
		),
});
export const input = defineEndpoint({
	event: 'deepline.runs.input',
	input: GetRunInputDataInputSchema,
	output: GetRunInputDataOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/runs/${segment(input.runId)}/input`, ctx.key, {
			method: 'GET',
		}),
});
export const receipts = defineEndpoint({
	event: 'deepline.runs.receipts',
	input: GetRunReceiptsInputSchema,
	output: GetRunReceiptsOutputSchema,
	run: async (ctx, input) => {
		// The API answers at most 100 keys per request; keep the caller's order and
		// refuse a page that does not answer exactly the keys it was asked for.
		const collected: unknown[] = [];
		for (let i = 0; i < input.keys.length; i += RECEIPT_BATCH_SIZE) {
			const keys = input.keys.slice(i, i + RECEIPT_BATCH_SIZE);
			const page = GetRunReceiptsOutputSchema.parse(
				await makeDeeplineRequest(
					`/api/v2/runs/${segment(input.runId)}/receipts/results`,
					ctx.key,
					{ method: 'POST', body: { keys } },
				),
			);
			if (
				page.runId !== input.runId ||
				page.receipts.length !== keys.length ||
				page.receipts.some((r, index) => r.receiptKey !== keys[index])
			) {
				throw new Error(
					'Deepline receipt response does not match the requested run and keys',
				);
			}
			collected.push(...page.receipts);
		}
		return { runId: input.runId, receipts: collected };
	},
});
export const events = defineEndpoint({
	event: 'deepline.runs.events',
	input: SearchRunEventsInputSchema,
	output: SearchRunEventsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/runs/events`, ctx.key, {
			method: 'GET',
			query: {
				since: input.since,
				until: input.until,
				runId: input.runId,
				playName: input.playName,
				kind: input.kind,
				jsonpath: input.jsonpath,
				payloads: input.includePayloads ? true : undefined,
				limit: input.limit,
				cursor: input.cursor,
			},
		}),
});
export const billing = defineEndpoint({
	event: 'deepline.runs.billing',
	input: GetRunBillingInputSchema,
	output: GetRunBillingOutputSchema,
	run: (ctx, input) => {
		// The API takes one repeated runId parameter per run.
		const params = new URLSearchParams();
		for (const runId of input.runIds) params.append('runId', runId);
		return makeDeeplineRequest(`/api/v2/runs/billing?${params}`, ctx.key, {
			method: 'GET',
		});
	},
});
export const stop = defineEndpoint({
	event: 'deepline.runs.stop',
	input: StopRunInputSchema,
	output: StopRunOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/runs/${segment(input.runId)}/stop`, ctx.key, {
			method: 'POST',
			body: input.reason ? { reason: input.reason } : {},
		}),
});
export const stopAll = defineEndpoint({
	event: 'deepline.runs.stopAll',
	input: StopAllRunsInputSchema,
	output: StopAllRunsOutputSchema,
	run: async (ctx, input) => {
		const dryRun = input.dryRun === true;
		const result = await makeDeeplineRequest(`/api/v2/runs/stop-all`, ctx.key, {
			method: 'POST',
			body: {
				...(input.reason ? { reason: input.reason } : {}),
				...(dryRun ? { dryRun: true } : {}),
			},
		});
		const isDryRun =
			typeof result === 'object' &&
			result !== null &&
			(result as { dryRun?: unknown }).dryRun === true;
		if (dryRun && !isDryRun) {
			// An older server ignores dryRun and stops the runs for real. That cannot
			// be undone, so report exactly what happened instead of a preview.
			throw new Error(
				'Deepline ignored dryRun and performed a real stop-all; active runs were stopped',
			);
		}
		return result;
	},
});
export const rerun = defineEndpoint({
	event: 'deepline.runs.rerun',
	input: RerunInputSchema,
	output: RerunOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/runs/${segment(input.runId)}/rerun`, ctx.key, {
			method: 'POST',
			body: input.inputOverrides
				? { inputOverrides: input.inputOverrides }
				: {},
			// Caller-owned key: core's 429 retries and the caller's own retry after
			// a lost response resolve to the same rerun.
			headers: { 'Idempotency-Key': input.idempotencyKey },
		}),
});
export const resume = defineEndpoint({
	event: 'deepline.runs.resume',
	input: ResumeRunInputSchema,
	output: ResumeRunOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/runs/${segment(input.runId)}/resume`,
			ctx.key,
			{
				method: 'POST',
				body: {},
			},
		),
});
