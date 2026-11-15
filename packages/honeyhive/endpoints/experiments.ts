import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import {
	classicKey,
	makeHoneyHiveRequest,
	resolveDataPlaneKey,
	resolveDataPlaneUrl,
} from '../client';
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
import {
	HoneyHiveEndpointInputSchemas,
	HoneyHiveEndpointOutputSchemas,
} from './types';

export async function listRuns(
	ctx: HoneyHiveContext,
	input: ExperimentsListRunsInput,
): Promise<ExperimentsListRunsResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsListRuns.parse(input);
	const { project_id, ...query } = parsedInput;
	const response = await makeHoneyHiveRequest<ExperimentsListRunsResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs`,
		await resolveDataPlaneKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx), query },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsListRuns.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.listRuns',
		{ project_id, count: parsed.evaluations?.length },
		'completed',
	);

	return parsed;
}

export async function createRun(
	ctx: HoneyHiveContext,
	input: ExperimentsCreateRunInput,
): Promise<ExperimentsCreateRunResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsCreateRun.parse(input);
	const { project_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<ExperimentsCreateRunResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs`,
		await resolveDataPlaneKey(ctx),
		{ method: 'POST', baseUrl: await resolveDataPlaneUrl(ctx), body },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsCreateRun.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.createRun',
		{ project_id, run_id: parsed.run_id },
		'completed',
	);

	return parsed;
}

export async function getRun(
	ctx: HoneyHiveContext,
	input: ExperimentsGetRunInput,
): Promise<ExperimentsGetRunResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsGetRun.parse(input);
	const response = await makeHoneyHiveRequest<ExperimentsGetRunResponse>(
		`/v1/projects/${encodeURIComponent(parsedInput.project_id)}/runs/${encodeURIComponent(parsedInput.run_id)}`,
		await resolveDataPlaneKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx) },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsGetRun.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getRun',
		{ project_id: parsedInput.project_id, run_id: parsedInput.run_id },
		'completed',
	);

	return parsed;
}

export async function updateRun(
	ctx: HoneyHiveContext,
	input: ExperimentsUpdateRunInput,
): Promise<ExperimentsUpdateRunResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsUpdateRun.parse(input);
	const { project_id, run_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<ExperimentsUpdateRunResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(run_id)}`,
		await resolveDataPlaneKey(ctx),
		{ method: 'PATCH', baseUrl: await resolveDataPlaneUrl(ctx), body },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsUpdateRun.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.updateRun',
		{ project_id, run_id },
		'completed',
	);

	return parsed;
}

export async function deleteRun(
	ctx: HoneyHiveContext,
	input: ExperimentsDeleteRunInput,
): Promise<ExperimentsDeleteRunResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsDeleteRun.parse(input);
	const response = await makeHoneyHiveRequest<ExperimentsDeleteRunResponse>(
		`/v1/projects/${encodeURIComponent(parsedInput.project_id)}/runs/${encodeURIComponent(parsedInput.run_id)}`,
		await resolveDataPlaneKey(ctx),
		{ method: 'DELETE', baseUrl: await resolveDataPlaneUrl(ctx) },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsDeleteRun.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.deleteRun',
		{ project_id: parsedInput.project_id, run_id: parsedInput.run_id },
		'completed',
	);

	return parsed;
}

export async function getSummary(
	ctx: HoneyHiveContext,
	input: ExperimentsGetSummaryInput,
): Promise<ExperimentsGetSummaryResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsGetSummary.parse(input);
	const { project_id, run_id, ...query } = parsedInput;
	const response = await makeHoneyHiveRequest<ExperimentsGetSummaryResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(run_id)}/summary`,
		await resolveDataPlaneKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx), query },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsGetSummary.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getSummary',
		{ project_id, run_id, status: parsed.status },
		'completed',
	);

	return parsed;
}

export async function getMetrics(
	ctx: HoneyHiveContext,
	input: ExperimentsGetMetricsInput,
): Promise<ExperimentsGetMetricsResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsGetMetrics.parse(input);
	const { project_id, run_id, ...query } = parsedInput;
	const response = await makeHoneyHiveRequest<ExperimentsGetMetricsResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(run_id)}/metrics`,
		await resolveDataPlaneKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx), query },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsGetMetrics.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getMetrics',
		{ project_id, run_id, count: parsed.events?.length },
		'completed',
	);

	return parsed;
}

export async function getRunSchema(
	ctx: HoneyHiveContext,
	input: ExperimentsGetRunSchemaInput,
): Promise<ExperimentsGetRunSchemaResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsGetRunSchema.parse(input);
	const { project_id, run_id, ...query } = parsedInput;
	const response = await makeHoneyHiveRequest<ExperimentsGetRunSchemaResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(run_id)}/schema`,
		await resolveDataPlaneKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx), query },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsGetRunSchema.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getRunSchema',
		{ project_id, run_id },
		'completed',
	);

	return parsed;
}

export async function getRunsSchema(
	ctx: HoneyHiveContext,
	input: ExperimentsGetRunsSchemaInput,
): Promise<ExperimentsGetRunsSchemaResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsGetRunsSchema.parse(input);
	const { project_id, ...query } = parsedInput;
	const response = await makeHoneyHiveRequest<ExperimentsGetRunsSchemaResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/schema`,
		await resolveDataPlaneKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx), query },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsGetRunsSchema.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getRunsSchema',
		{ project_id },
		'completed',
	);

	return parsed;
}

export async function compare(
	ctx: HoneyHiveContext,
	input: ExperimentsCompareInput,
): Promise<ExperimentsCompareResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsCompare.parse(input);
	const { project_id, new_run_id, old_run_id, ...query } = parsedInput;
	const response = await makeHoneyHiveRequest<ExperimentsCompareResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(new_run_id)}/compare/${encodeURIComponent(old_run_id)}`,
		await resolveDataPlaneKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx), query },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsCompare.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.compare',
		{ project_id, new_run_id, old_run_id },
		'completed',
	);

	return parsed;
}

export async function compareEvents(
	ctx: HoneyHiveContext,
	input: ExperimentsCompareEventsInput,
): Promise<ExperimentsCompareEventsResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsCompareEvents.parse(input);
	const { project_id, new_run_id, old_run_id, ...query } = parsedInput;
	const response = await makeHoneyHiveRequest<ExperimentsCompareEventsResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/runs/${encodeURIComponent(new_run_id)}/compare/${encodeURIComponent(old_run_id)}/events`,
		await resolveDataPlaneKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx), query },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsCompareEvents.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.compareEvents',
		{ project_id, new_run_id, old_run_id },
		'completed',
	);

	return parsed;
}

export async function listRunsLegacy(
	ctx: HoneyHiveContext,
	input: ExperimentsListRunsLegacyInput,
): Promise<ExperimentsListRunsResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsListRunsLegacy.parse(input);
	const response = await makeHoneyHiveRequest<ExperimentsListRunsResponse>(
		'/v1/runs',
		classicKey(ctx),
		{
			method: 'GET',
			baseUrl: await resolveDataPlaneUrl(ctx),
			query: parsedInput,
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsListRunsLegacy.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.listRunsLegacy',
		{ count: parsed.evaluations?.length },
		'completed',
	);

	return parsed;
}

export async function createRunLegacy(
	ctx: HoneyHiveContext,
	input: ExperimentsCreateRunLegacyInput,
): Promise<ExperimentsCreateRunResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsCreateRunLegacy.parse(input);
	const response = await makeHoneyHiveRequest<ExperimentsCreateRunResponse>(
		'/v1/runs',
		classicKey(ctx),
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body: parsedInput,
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsCreateRunLegacy.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.createRunLegacy',
		{ run_id: parsed.run_id },
		'completed',
	);

	return parsed;
}

export async function getRunLegacy(
	ctx: HoneyHiveContext,
	input: ExperimentsGetRunLegacyInput,
): Promise<ExperimentsGetRunResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.experimentsGetRunLegacy.parse(input);
	const response = await makeHoneyHiveRequest<ExperimentsGetRunResponse>(
		`/v1/runs/${encodeURIComponent(parsedInput.run_id)}`,
		classicKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx) },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.experimentsGetRunLegacy.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.experiments.getRunLegacy',
		{ run_id: parsedInput.run_id },
		'completed',
	);

	return parsed;
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
