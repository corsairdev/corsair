import { makeDeeplineRequest, segment } from '../client';
import { defineEndpoint } from './common';
import {
	MonitorBatchGetInputSchema,
	MonitorBatchOperationSchema,
	MonitorCheckInputSchema,
	MonitorCheckOutputSchema,
	MonitorDeleteOutputSchema,
	MonitorDependentsOutputSchema,
	MonitorDeployInputSchema,
	MonitorDeployOutputSchema,
	MonitorDetailOutputSchema,
	MonitorDryRunKeyInputSchema,
	MonitorFleetsListInputSchema,
	MonitorFleetsListOutputSchema,
	MonitorJobIdInputSchema,
	MonitorJobLogsInputSchema,
	MonitorJobResultSchema,
	MonitorKeyInputSchema,
	MonitorLifecycleInputSchema,
	MonitorLifecycleOutputSchema,
	MonitorPreviewInputSchema,
	MonitorPreviewOutputSchema,
	MonitorReactivateOutputSchema,
	MonitorsAccessInputSchema,
	MonitorsAccessOutputSchema,
	MonitorsAvailableInputSchema,
	MonitorsAvailableOutputSchema,
	MonitorsHealthInputSchema,
	MonitorsHealthOutputSchema,
	MonitorsLedgerFindingsInputSchema,
	MonitorsLedgerFindingsOutputSchema,
	MonitorsLedgerGetOutputSchema,
	MonitorsLedgerListInputSchema,
	MonitorsLedgerListOutputSchema,
	MonitorsListInputSchema,
	MonitorsListOutputSchema,
	MonitorTestInputSchema,
	MonitorTestOutputSchema,
	MonitorUpdateInputSchema,
	MonitorUpdateOutputSchema,
} from './types-monitors';

const MONITORS = '/api/v2/monitors';
const deployed = (key: string) => `${MONITORS}/deployed/${segment(key)}`;

type QueryValue = string | number | boolean | undefined;
// Some monitor filters repeat a query key (state=a&state=b). The shared
// DeeplineQuery type is scalar-only, so these paths carry their own query.
function withQuery(
	path: string,
	entries: Array<[string, QueryValue | readonly string[]]>,
): string {
	const params = new URLSearchParams();
	for (const [name, value] of entries) {
		if (value === undefined) continue;
		if (Array.isArray(value)) for (const v of value) params.append(name, v);
		else params.set(name, String(value));
	}
	const query = params.toString();
	return query ? `${path}?${query}` : path;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function newIdempotencyKey(prefix: string): string {
	return `${prefix}-${globalThis.crypto.randomUUID()}`;
}

export const access = defineEndpoint({
	event: 'deepline.monitors.access',
	input: MonitorsAccessInputSchema,
	output: MonitorsAccessOutputSchema,
	run: (ctx) =>
		makeDeeplineRequest(`${MONITORS}/access`, ctx.key, { method: 'GET' }),
});

export const available = defineEndpoint({
	event: 'deepline.monitors.available',
	input: MonitorsAvailableInputSchema,
	output: MonitorsAvailableOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${MONITORS}/tools`, ctx.key, {
			method: 'GET',
			query: {
				provider: input.provider,
				tool: input.tool,
				search: input.search,
				limit: input.limit,
				// List mode is compact unless full is asked for; describing one
				// tool always returns its whole contract.
				compact: !input.tool && input.full !== true ? 'true' : undefined,
			},
		}),
});

export const list = defineEndpoint({
	event: 'deepline.monitors.list',
	input: MonitorsListInputSchema,
	output: MonitorsListOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${MONITORS}/deployed`, ctx.key, {
			method: 'GET',
			query: {
				state: input.state,
				limit: input.limit,
				cursor: input.cursor,
				include_consumers: input.includeConsumers ? 'true' : undefined,
			},
		}),
});

export const get = defineEndpoint({
	event: 'deepline.monitors.get',
	input: MonitorKeyInputSchema,
	output: MonitorDetailOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(deployed(input.key), ctx.key, { method: 'GET' }),
});

export const dependents = defineEndpoint({
	event: 'deepline.monitors.dependents',
	input: MonitorKeyInputSchema,
	output: MonitorDependentsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${deployed(input.key)}/dependents`, ctx.key, {
			method: 'GET',
		}),
});

export const check = defineEndpoint({
	event: 'deepline.monitors.check',
	input: MonitorCheckInputSchema,
	output: MonitorCheckOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${MONITORS}/check`, ctx.key, {
			method: 'POST',
			body: input,
		}),
});

export const preview = defineEndpoint({
	event: 'deepline.monitors.preview',
	input: MonitorPreviewInputSchema,
	output: MonitorPreviewOutputSchema,
	run: async (ctx, { idempotencyKey, ...body }) => {
		// The caller owns the key, so a lost response can be recovered with the
		// same key instead of paying for a second preview.
		const key = idempotencyKey;
		const result = await makeDeeplineRequest(`${MONITORS}/preview`, ctx.key, {
			method: 'POST',
			body,
			headers: { 'Idempotency-Key': key },
		});
		// A non-object reply is passed through so the output schema rejects it.
		return isRecord(result) ? { ...result, idempotency_key: key } : result;
	},
});

export const deploy = defineEndpoint({
	event: 'deepline.monitors.deploy',
	input: MonitorDeployInputSchema,
	output: MonitorDeployOutputSchema,
	run: async (ctx, { dryRun, ...definition }) => {
		// The deploy plan is served by the free check endpoint; a dry run never
		// calls deploy.
		if (dryRun)
			return makeDeeplineRequest(`${MONITORS}/check`, ctx.key, {
				method: 'POST',
				body: definition,
			});
		const result = await makeDeeplineRequest(`${MONITORS}/deploy`, ctx.key, {
			method: 'POST',
			body: definition,
		});
		if (definition.tool !== 'deepline.analytics' || !isRecord(result))
			return result;
		// As in the official SDK: an analytics monitor's deploy also creates or
		// reuses its tracker, which the caller needs to install it.
		const setup = await makeDeeplineRequest(
			`${MONITORS}/setup/${segment(definition.tool)}`,
			ctx.key,
			{
				method: 'POST',
				body: { ...definition.payload, monitor_key: definition.key },
			},
		);
		// The deploy already happened; still refuse to report success without
		// the tracker the caller needs to install it.
		if (!isRecord(setup))
			throw new Error(
				'Deepline returned a malformed analytics setup response after deploy',
			);
		const tracker = setup;
		return {
			...result,
			monitor: {
				...(isRecord(result.monitor) ? result.monitor : {}),
				tracking: tracker.tracking ?? null,
				ip2company: tracker.ip2company ?? null,
			},
		};
	},
});

export const update = defineEndpoint({
	event: 'deepline.monitors.update',
	input: MonitorUpdateInputSchema,
	output: MonitorUpdateOutputSchema,
	run: (ctx, { key, ...patch }) =>
		makeDeeplineRequest(deployed(key), ctx.key, {
			method: 'PATCH',
			body: patch,
		}),
});

const removeMonitor = defineEndpoint({
	event: 'deepline.monitors.delete',
	input: MonitorDryRunKeyInputSchema,
	output: MonitorDeleteOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(deployed(input.key), ctx.key, {
			method: 'DELETE',
			query: { dry_run: input.dryRun ? 'true' : undefined },
		}),
});
export { removeMonitor as delete };

export const reactivate = defineEndpoint({
	event: 'deepline.monitors.reactivate',
	input: MonitorDryRunKeyInputSchema,
	output: MonitorReactivateOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${deployed(input.key)}/reactivate`, ctx.key, {
			method: 'POST',
			query: { dry_run: input.dryRun ? 'true' : undefined },
			body: {},
		}),
});

function lifecycle(action: 'start' | 'stop') {
	return defineEndpoint({
		event: `deepline.monitors.${action}`,
		input: MonitorLifecycleInputSchema,
		output: MonitorLifecycleOutputSchema,
		run: (ctx, input) => {
			const idempotencyKey =
				input.idempotencyKey ?? newIdempotencyKey(`monitor-job-${action}`);
			const headers = { 'Idempotency-Key': idempotencyKey };
			// A dry run is a durable batch plan, as in the SDK: nothing reaches the
			// provider, and monitors.batch.get reads the plan.
			if (input.dryRun)
				return makeDeeplineRequest(`${MONITORS}/batch`, ctx.key, {
					method: 'POST',
					headers,
					body: {
						kind: action === 'start' ? 'reactivate' : 'deactivate',
						scope: { kind: 'keys', monitor_keys: [input.key] },
						dry_run: true,
						idempotency_key: idempotencyKey,
					},
				});
			return makeDeeplineRequest(`${deployed(input.key)}/${action}`, ctx.key, {
				method: 'POST',
				headers,
				body: {},
			});
		},
	});
}
export const start = lifecycle('start');
export const stop = lifecycle('stop');

export const test = defineEndpoint({
	event: 'deepline.monitors.test',
	input: MonitorTestInputSchema,
	output: MonitorTestOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${deployed(input.key)}/test`, ctx.key, {
			method: 'POST',
			// Validation only: the server never persists, charges or dispatches.
			body: { payload: input.payload, mode: 'validation_only' },
		}),
});

export const health = defineEndpoint({
	event: 'deepline.monitors.health',
	input: MonitorsHealthInputSchema,
	output: MonitorsHealthOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${MONITORS}/health`, ctx.key, {
			method: 'GET',
			query: { fleet_id: input.fleetId },
		}),
});

const ledgerList = defineEndpoint({
	event: 'deepline.monitors.ledger.list',
	input: MonitorsLedgerListInputSchema,
	output: MonitorsLedgerListOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			withQuery(`${MONITORS}/ledger`, [
				['q', input.search],
				['state', input.states],
				['signal', input.signals],
				['play', input.play],
				['fleet', input.fleet],
				['sort', input.sort],
				['window', input.window],
				['limit', input.limit],
				['cursor', input.cursor],
			]),
			ctx.key,
			{ method: 'GET' },
		),
});
const ledgerGet = defineEndpoint({
	event: 'deepline.monitors.ledger.get',
	input: MonitorKeyInputSchema,
	output: MonitorsLedgerGetOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${MONITORS}/ledger/${segment(input.key)}`, ctx.key, {
			method: 'GET',
		}),
});
const ledgerFindings = defineEndpoint({
	event: 'deepline.monitors.ledger.findings',
	input: MonitorsLedgerFindingsInputSchema,
	output: MonitorsLedgerFindingsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`${MONITORS}/ledger/${segment(input.key)}/findings`,
			ctx.key,
			{ method: 'GET', query: { cursor: input.cursor } },
		),
});
export const ledger = {
	list: ledgerList,
	get: ledgerGet,
	findings: ledgerFindings,
};

const jobsGet = defineEndpoint({
	event: 'deepline.monitors.jobs.get',
	input: MonitorJobIdInputSchema,
	output: MonitorJobResultSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${MONITORS}/jobs/${segment(input.jobId)}`, ctx.key, {
			method: 'GET',
		}),
});
const jobsLogs = defineEndpoint({
	event: 'deepline.monitors.jobs.logs',
	input: MonitorJobLogsInputSchema,
	output: MonitorJobResultSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`${MONITORS}/jobs/${segment(input.jobId)}/logs`,
			ctx.key,
			{ method: 'GET', query: { limit: input.limit } },
		),
});
const jobsCancel = defineEndpoint({
	event: 'deepline.monitors.jobs.cancel',
	input: MonitorJobIdInputSchema,
	output: MonitorJobResultSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`${MONITORS}/jobs/${segment(input.jobId)}/cancel`,
			ctx.key,
			{ method: 'POST', body: {} },
		),
});
export const jobs = { get: jobsGet, logs: jobsLogs, cancel: jobsCancel };

const batchGet = defineEndpoint({
	event: 'deepline.monitors.batch.get',
	input: MonitorBatchGetInputSchema,
	output: MonitorBatchOperationSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${MONITORS}/batch/${segment(input.runId)}`, ctx.key, {
			method: 'GET',
			query: { cursor: input.cursor },
		}),
});
export const batch = { get: batchGet };

const fleetsList = defineEndpoint({
	event: 'deepline.monitors.fleets.list',
	input: MonitorFleetsListInputSchema,
	output: MonitorFleetsListOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			withQuery(
				`${MONITORS}/fleets`,
				input.overview
					? [
							['view', 'overview'],
							['q', input.q],
							['state', input.states],
							['sort', input.sort],
							['window', input.window],
						]
					: [],
			),
			ctx.key,
			{ method: 'GET' },
		),
});
export const fleets = { list: fleetsList };
