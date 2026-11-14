import { asRecord } from 'corsair/core';
import type { KadoaEndpoints } from '..';
import { KADOA_STREAM_TIMEOUT_MS, messageResult, segment } from '../client';
import { call, definedQuery } from './call';
import {
	KadoaEndpointInputSchemas as Inputs,
	KADOA_DEFAULT_DATA_LIMIT,
	KADOA_DEFAULT_HISTORY_LIMIT,
	KADOA_DEFAULT_WORKFLOW_LIMIT,
	KadoaEndpointOutputSchemas as Outputs,
} from './types';

/** How many workflows one page holds when the caller names no limit. */
function pageLimit(limit: number | undefined): number {
	return limit ?? KADOA_DEFAULT_WORKFLOW_LIMIT;
}

// Kadoa answers `{ workflows, pagination }` and pages by offset, not by cursor.
// `nextSkip` is derived here rather than through a transform, because the docs
// generator reads a transform's input side and would never show the field.
// A missing or unreadable body, or one without a `workflows` array, is left as
// it is, so the output schema rejects it rather than reporting an empty page.
// unknown: the raw body is an untyped JSON envelope until the output schema runs.
function listShape(
	raw: unknown,
	parsed: { skip?: number | undefined; limit?: number | undefined },
) {
	const record = asRecord(raw);
	if (!record) return raw;
	const workflows = record.workflows;
	const full =
		Array.isArray(workflows) && workflows.length >= pageLimit(parsed.limit);
	return {
		...record,
		workflows,
		nextSkip: full
			? (parsed.skip ?? 0) + (Array.isArray(workflows) ? workflows.length : 0)
			: null,
	};
}

export const list: KadoaEndpoints['workflowsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.list',
			input: Inputs.workflowsList,
			output: Outputs.workflowsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v4/workflows',
			query: definedQuery({
				search: parsed.search,
				skip: parsed.skip,
				limit: parsed.limit,
				state: parsed.state,
				runState: parsed.runState,
				displayState:
					parsed.displayState && parsed.displayState.length > 0
						? parsed.displayState.join(',')
						: undefined,
				tags: parsed.tags && parsed.tags.length > 0 ? parsed.tags : undefined,
				statusFilters:
					parsed.statusFilters && parsed.statusFilters.length > 0
						? parsed.statusFilters
						: undefined,
				monitoring: parsed.monitoring,
				updateInterval: parsed.updateInterval,
				scheduleType: parsed.scheduleType,
				templateId:
					parsed.templateId && parsed.templateId.length > 0
						? parsed.templateId
						: undefined,
				includeDeleted: parsed.includeDeleted,
			}),
		}),
		{
			shape: listShape,
			log: (_, result) => ({
				count: result.workflows.length,
				total: result.pagination?.totalCount ?? undefined,
			}),
		},
	);

export const get: KadoaEndpoints['workflowsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.get',
			input: Inputs.workflowsGet,
			output: Outputs.workflowsGet,
		},
		input,
		({ workflowId }) => ({
			method: 'GET',
			path: `/v4/workflows/${segment(workflowId)}`,
		}),
		{
			log: (_, result) => ({
				workflowId: result.id,
				state: result.state ?? undefined,
			}),
		},
	);

// The create body has four documented variants and Kadoa picks one by the
// fields present, so the request is the parsed input itself with undefined
// keys dropped. A `null` limit is meaningful here and is kept.
export const create: KadoaEndpoints['workflowsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.create',
			input: Inputs.workflowsCreate,
			output: Outputs.workflowsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v4/workflows',
			body: Object.fromEntries(
				Object.entries(parsed).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: (_, result) => ({ workflowId: result.workflowId }) },
	);

export const updateMetadata: KadoaEndpoints['workflowsUpdateMetadata'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'workflows.updateMetadata',
			input: Inputs.workflowsUpdateMetadata,
			output: Outputs.workflowsUpdateMetadata,
		},
		input,
		({ workflowId, ...changes }) => ({
			method: 'PUT',
			path: `/v4/workflows/${segment(workflowId)}/metadata`,
			body: Object.fromEntries(
				Object.entries(changes).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: ({ workflowId }) => ({ workflowId }) },
	);

export const remove: KadoaEndpoints['workflowsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.delete',
			input: Inputs.workflowsRemove,
			output: Outputs.workflowsRemove,
		},
		input,
		({ workflowId }) => ({
			method: 'DELETE',
			path: `/v4/workflows/${segment(workflowId)}`,
		}),
		{
			shape: (raw) => messageResult(raw, 'workflows.delete'),
			log: ({ workflowId }) => ({ workflowId }),
		},
	);

// A run is accepted immediately: `jobId` is the handle for `workflows.jobStatus`,
// which needs the workflow ID as well, so this operation declares no job for the
// agent's get_job to follow with one id. The description says where to poll.
export const run: KadoaEndpoints['workflowsRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.run',
			input: Inputs.workflowsRun,
			output: Outputs.workflowsRun,
		},
		input,
		({ workflowId, ...body }) => ({
			method: 'PUT',
			path: `/v4/workflows/${segment(workflowId)}/run`,
			body: Object.fromEntries(
				Object.entries(body).filter(([, value]) => value !== undefined),
			),
		}),
		{
			log: ({ workflowId }, result) => ({
				workflowId,
				jobId: result.jobId ?? undefined,
			}),
		},
	);

// pause answers text/plain, so the body is a message rather than JSON.
export const pause: KadoaEndpoints['workflowsPause'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.pause',
			input: Inputs.workflowsPause,
			output: Outputs.workflowsPause,
		},
		input,
		({ workflowId }) => ({
			method: 'PUT',
			path: `/v4/workflows/${segment(workflowId)}/pause`,
		}),
		{
			shape: (raw) => messageResult(raw, 'workflows.pause'),
			log: ({ workflowId }) => ({ workflowId }),
		},
	);

// resume answers JSON, and a 202 carries the id of the preview run it started.
export const resume: KadoaEndpoints['workflowsResume'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.resume',
			input: Inputs.workflowsResume,
			output: Outputs.workflowsResume,
		},
		input,
		({ workflowId }) => ({
			method: 'PUT',
			path: `/v4/workflows/${segment(workflowId)}/resume`,
		}),
		{
			log: ({ workflowId }) => ({ workflowId }),
		},
	);

export const stop: KadoaEndpoints['workflowsStop'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.stop',
			input: Inputs.workflowsStop,
			output: Outputs.workflowsStop,
		},
		input,
		({ workflowId }) => ({
			method: 'PUT',
			path: `/v4/workflows/${segment(workflowId)}/stop`,
		}),
		{ log: ({ workflowId }) => ({ workflowId }) },
	);

export const schedule: KadoaEndpoints['workflowsSchedule'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.schedule',
			input: Inputs.workflowsSchedule,
			output: Outputs.workflowsSchedule,
		},
		input,
		({ workflowId, date }) => ({
			method: 'PUT',
			path: `/v4/workflows/${segment(workflowId)}/schedule`,
			body: { date },
		}),
		{
			shape: (raw) => messageResult(raw, 'workflows.schedule'),
			log: ({ workflowId }) => ({ workflowId }),
		},
	);

/** The next page while this one is full, or null on the last page. */
// unknown: the raw body is an untyped envelope until the output schema runs.
function nextPageFrom(
	raw: unknown,
	page: number,
	returned: number,
	limit: number,
): number | null {
	const pagination = asRecord(asRecord(raw)?.pagination);
	const totalPages = pagination?.totalPages;
	if (typeof totalPages === 'number') {
		return page < totalPages ? page + 1 : null;
	}
	return returned >= limit ? page + 1 : null;
}

export const history: KadoaEndpoints['workflowsHistory'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.history',
			input: Inputs.workflowsHistory,
			output: Outputs.workflowsHistory,
		},
		input,
		({ workflowId, ...query }) => ({
			method: 'GET',
			path: `/v4/workflows/${segment(workflowId)}/history`,
			query: definedQuery({ ...query }),
		}),
		{
			// A body without a `workflowRuns` array is passed on unchanged, so the
			// output schema rejects it instead of reporting no runs.
			shape: (raw, parsed) => {
				const record = asRecord(raw);
				const runs = record?.workflowRuns;
				if (!record || !Array.isArray(runs)) return raw;
				const page = parsed.page ?? 1;
				const limit = parsed.limit ?? KADOA_DEFAULT_HISTORY_LIMIT;
				return {
					...record,
					nextPage: nextPageFrom(raw, page, runs.length, limit),
				};
			},
			log: ({ workflowId }, result) => ({
				workflowId,
				count: result.workflowRuns.length,
			}),
		},
	);

// `limit: 0` streams the whole result set, so no further page exists then.
// Otherwise the page is full when it holds as many rows as were asked for, and
// the docs' default of 25 applies when the caller named no limit.
// A body without a `data` array is passed on unchanged, so the output schema
// rejects it instead of reporting no rows.
// unknown: the raw body is an untyped envelope until the output schema runs.
function dataShape(
	raw: unknown,
	parsed: { page?: number | undefined; limit?: number | undefined },
) {
	const record = asRecord(raw);
	const rows = record?.data;
	if (!record || !Array.isArray(rows)) return raw;
	const limit = parsed.limit;
	const page = parsed.page ?? 1;
	const totalPages = asRecord(record?.pagination)?.totalPages;

	if (limit === 0) {
		return { ...record, data: rows, nextPage: null };
	}
	if (typeof totalPages === 'number') {
		return {
			...record,
			data: rows,
			nextPage: page < totalPages ? page + 1 : null,
		};
	}
	const pageSize = limit ?? KADOA_DEFAULT_DATA_LIMIT;
	return {
		...record,
		data: rows,
		nextPage: rows.length >= pageSize ? page + 1 : null,
	};
}

export const data: KadoaEndpoints['workflowsData'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.data',
			input: Inputs.workflowsData,
			output: Outputs.workflowsData,
		},
		input,
		({ workflowId, filters, rowIds, ...query }) => ({
			method: 'GET',
			path: `/v4/workflows/${segment(workflowId)}/data`,
			query: definedQuery({
				...query,
				filters:
					filters && filters.length > 0 ? JSON.stringify(filters) : undefined,
				rowIds: rowIds && rowIds.length > 0 ? rowIds.join(',') : undefined,
			}),
			// `limit: 0` streams every row inline, which Kadoa allows five minutes.
			timeoutMs: query.limit === 0 ? KADOA_STREAM_TIMEOUT_MS : undefined,
		}),
		{
			shape: dataShape,
			log: ({ workflowId }, result) => ({
				workflowId,
				rows: result.data.length,
				total: result.pagination?.totalCount ?? undefined,
			}),
		},
	);

export const jobStatus: KadoaEndpoints['workflowsJobStatus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.jobStatus',
			input: Inputs.workflowsJobStatus,
			output: Outputs.workflowsJobStatus,
		},
		input,
		({ workflowId, jobId }) => ({
			method: 'GET',
			path: `/v4/workflows/${segment(workflowId)}/jobs/${segment(jobId)}`,
		}),
		{
			log: ({ workflowId, jobId }, result) => ({
				workflowId,
				jobId,
				state: result.state,
			}),
		},
	);

export const connectors: KadoaEndpoints['workflowsConnectors'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workflows.connectors',
			input: Inputs.workflowsConnectors,
			output: Outputs.workflowsConnectors,
		},
		input,
		({ workflowId }) => ({
			method: 'GET',
			path: `/v4/workflows/${segment(workflowId)}/connectors`,
		}),
		{
			log: ({ workflowId }, result) => ({
				workflowId,
				count: result.connectors.length,
			}),
		},
	);
