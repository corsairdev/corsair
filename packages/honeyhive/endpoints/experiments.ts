import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import { makeHoneyHiveRequest } from '../client';
import type {
	ExperimentsCompareEventsInput,
	ExperimentsCompareEventsResponse,
	ExperimentsCompareInput,
	ExperimentsCompareResponse,
	ExperimentsCreateRunInput,
	ExperimentsCreateRunLegacyInput,
	ExperimentsCreateRunResponse,
	ExperimentsDeleteRunInput,
	ExperimentsDeleteRunResponse,
	ExperimentsGetMetricsInput,
	ExperimentsGetMetricsResponse,
	ExperimentsGetRunInput,
	ExperimentsGetRunLegacyInput,
	ExperimentsGetRunResponse,
	ExperimentsGetRunSchemaInput,
	ExperimentsGetRunSchemaResponse,
	ExperimentsGetRunsSchemaInput,
	ExperimentsGetRunsSchemaResponse,
	ExperimentsGetSummaryInput,
	ExperimentsGetSummaryResponse,
	ExperimentsListRunsInput,
	ExperimentsListRunsLegacyInput,
	ExperimentsListRunsResponse,
	ExperimentsUpdateRunInput,
	ExperimentsUpdateRunResponse,
} from './types';

export async function listRuns(
	ctx: HoneyHiveContext,
	input: ExperimentsListRunsInput,
): Promise<ExperimentsListRunsResponse> {
	const { project_id, ...query } = input;
	const response = await makeHoneyHiveRequest<ExperimentsListRunsResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.listRuns',
		{ project_id, count: response.evaluations?.length },
		'completed',
	);

	return response;
}

export async function createRun(
	ctx: HoneyHiveContext,
	input: ExperimentsCreateRunInput,
): Promise<ExperimentsCreateRunResponse> {
	const { project_id, ...body } = input;
	const response = await makeHoneyHiveRequest<ExperimentsCreateRunResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.createRun',
		{ project_id, run_id: response.run_id },
		'completed',
	);

	return response;
}

export async function getRun(
	ctx: HoneyHiveContext,
	input: ExperimentsGetRunInput,
): Promise<ExperimentsGetRunResponse> {
	const response = await makeHoneyHiveRequest<ExperimentsGetRunResponse>(
		`/v1/projects/${encodeURIComponent(input.project_id)}/runs/${encodeURIComponent(input.run_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getRun',
		{ project_id: input.project_id, run_id: input.run_id },
		'completed',
	);

	return response;
}

export async function updateRun(
	ctx: HoneyHiveContext,
	input: ExperimentsUpdateRunInput,
): Promise<ExperimentsUpdateRunResponse> {
	const { project_id, run_id, ...body } = input;
	const response = await makeHoneyHiveRequest<ExperimentsUpdateRunResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(run_id)}`,
		ctx.key,
		{ method: 'PATCH', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.updateRun',
		{ project_id, run_id },
		'completed',
	);

	return response;
}

export async function deleteRun(
	ctx: HoneyHiveContext,
	input: ExperimentsDeleteRunInput,
): Promise<ExperimentsDeleteRunResponse> {
	const response = await makeHoneyHiveRequest<ExperimentsDeleteRunResponse>(
		`/v1/projects/${encodeURIComponent(input.project_id)}/runs/${encodeURIComponent(input.run_id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.deleteRun',
		{ project_id: input.project_id, run_id: input.run_id },
		'completed',
	);

	return response;
}

export async function getSummary(
	ctx: HoneyHiveContext,
	input: ExperimentsGetSummaryInput,
): Promise<ExperimentsGetSummaryResponse> {
	const { project_id, run_id, ...query } = input;
	const response = await makeHoneyHiveRequest<ExperimentsGetSummaryResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(run_id)}/summary`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getSummary',
		{ project_id, run_id, status: response.status },
		'completed',
	);

	return response;
}

export async function getMetrics(
	ctx: HoneyHiveContext,
	input: ExperimentsGetMetricsInput,
): Promise<ExperimentsGetMetricsResponse> {
	const { project_id, run_id, ...query } = input;
	const response = await makeHoneyHiveRequest<ExperimentsGetMetricsResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(run_id)}/metrics`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getMetrics',
		{ project_id, run_id, count: response.events?.length },
		'completed',
	);

	return response;
}

export async function getRunSchema(
	ctx: HoneyHiveContext,
	input: ExperimentsGetRunSchemaInput,
): Promise<ExperimentsGetRunSchemaResponse> {
	const { project_id, run_id, ...query } = input;
	const response = await makeHoneyHiveRequest<ExperimentsGetRunSchemaResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(run_id)}/schema`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getRunSchema',
		{ project_id, run_id },
		'completed',
	);

	return response;
}

export async function getRunsSchema(
	ctx: HoneyHiveContext,
	input: ExperimentsGetRunsSchemaInput,
): Promise<ExperimentsGetRunsSchemaResponse> {
	const { project_id, ...query } = input;
	const response = await makeHoneyHiveRequest<ExperimentsGetRunsSchemaResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/schema`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getRunsSchema',
		{ project_id },
		'completed',
	);

	return response;
}

export async function compare(
	ctx: HoneyHiveContext,
	input: ExperimentsCompareInput,
): Promise<ExperimentsCompareResponse> {
	const { project_id, new_run_id, old_run_id, ...query } = input;
	const response = await makeHoneyHiveRequest<ExperimentsCompareResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(new_run_id)}/compare/${encodeURIComponent(old_run_id)}`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.compare',
		{ project_id, new_run_id, old_run_id },
		'completed',
	);

	return response;
}

export async function compareEvents(
	ctx: HoneyHiveContext,
	input: ExperimentsCompareEventsInput,
): Promise<ExperimentsCompareEventsResponse> {
	const { project_id, new_run_id, old_run_id, ...query } = input;
	const response = await makeHoneyHiveRequest<ExperimentsCompareEventsResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(new_run_id)}/compare/${encodeURIComponent(old_run_id)}/events`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.compareEvents',
		{ project_id, new_run_id, old_run_id },
		'completed',
	);

	return response;
}

export async function listRunsLegacy(
	ctx: HoneyHiveContext,
	input: ExperimentsListRunsLegacyInput,
): Promise<ExperimentsListRunsResponse> {
	const response = await makeHoneyHiveRequest<ExperimentsListRunsResponse>(
		'/v1/runs',
		ctx.key,
		{ method: 'GET', query: input },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.listRunsLegacy',
		{ count: response.evaluations?.length },
		'completed',
	);

	return response;
}

export async function createRunLegacy(
	ctx: HoneyHiveContext,
	input: ExperimentsCreateRunLegacyInput,
): Promise<ExperimentsCreateRunResponse> {
	const response = await makeHoneyHiveRequest<ExperimentsCreateRunResponse>(
		'/v1/runs',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.createRunLegacy',
		{ run_id: response.run_id },
		'completed',
	);

	return response;
}

export async function getRunLegacy(
	ctx: HoneyHiveContext,
	input: ExperimentsGetRunLegacyInput,
): Promise<ExperimentsGetRunResponse> {
	const response = await makeHoneyHiveRequest<ExperimentsGetRunResponse>(
		`/v1/runs/${encodeURIComponent(input.run_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getRunLegacy',
		{ run_id: input.run_id },
		'completed',
	);

	return response;
}

export const Experiments = {
	listRuns,
	createRun,
	getRun,
	updateRun,
	deleteRun,
	getSummary,
	getMetrics,
	getRunSchema,
	getRunsSchema,
	compare,
	compareEvents,
	listRunsLegacy,
	createRunLegacy,
	getRunLegacy,
};
