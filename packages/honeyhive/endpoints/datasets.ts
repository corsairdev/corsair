import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import {
	classicKey,
	makeHoneyHiveRequest,
	resolveDataPlaneKey,
	resolveDataPlaneUrl,
} from '../client';
import type {
	DatasetsAddDatapointsInput,
	DatasetsAddDatapointsResponse,
	DatasetsCreateInput,
	DatasetsCreateLegacyInput,
	DatasetsCreateResponse,
	DatasetsDeleteInput,
	DatasetsDeleteLegacyInput,
	DatasetsDeleteResponse,
	DatasetsListInput,
	DatasetsListLegacyInput,
	DatasetsListResponse,
	DatasetsRemoveDatapointInput,
	DatasetsRemoveDatapointResponse,
	DatasetsUpdateInput,
	DatasetsUpdateLegacyInput,
	DatasetsUpdateResponse,
} from './types';
import {
	HoneyHiveEndpointInputSchemas,
	HoneyHiveEndpointOutputSchemas,
} from './types';

export async function listDatasets(
	ctx: HoneyHiveContext,
	input: DatasetsListInput,
): Promise<DatasetsListResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.datasetsList.parse(input);
	const query: Record<string, string | undefined> = {};
	if (parsedInput.dataset_id) query.dataset_id = parsedInput.dataset_id;
	if (parsedInput.name) query.name = parsedInput.name;

	const response = await makeHoneyHiveRequest<DatasetsListResponse>(
		`/v1/projects/${encodeURIComponent(parsedInput.project_id)}/datasets`,
		await resolveDataPlaneKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx), query },
	);
	const parsed = HoneyHiveEndpointOutputSchemas.datasetsList.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.list',
		{ project_id: parsedInput.project_id, count: parsed.datasets?.length },
		'completed',
	);

	return parsed;
}

export async function createDataset(
	ctx: HoneyHiveContext,
	input: DatasetsCreateInput,
): Promise<DatasetsCreateResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.datasetsCreate.parse(input);
	const { project_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<DatasetsCreateResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/datasets`,
		await resolveDataPlaneKey(ctx),
		{ method: 'POST', baseUrl: await resolveDataPlaneUrl(ctx), body },
	);
	const parsed = HoneyHiveEndpointOutputSchemas.datasetsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.create',
		{ project_id, success: true },
		'completed',
	);

	return parsed;
}

export async function updateDataset(
	ctx: HoneyHiveContext,
	input: DatasetsUpdateInput,
): Promise<DatasetsUpdateResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.datasetsUpdate.parse(input);
	const { project_id, dataset_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<DatasetsUpdateResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/datasets/${encodeURIComponent(dataset_id)}`,
		await resolveDataPlaneKey(ctx),
		{ method: 'PATCH', baseUrl: await resolveDataPlaneUrl(ctx), body },
	);
	const parsed = HoneyHiveEndpointOutputSchemas.datasetsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.update',
		{ project_id, dataset_id },
		'completed',
	);

	return parsed;
}

export async function deleteDataset(
	ctx: HoneyHiveContext,
	input: DatasetsDeleteInput,
): Promise<DatasetsDeleteResponse> {
	const parsedInput = HoneyHiveEndpointInputSchemas.datasetsDelete.parse(input);
	const response = await makeHoneyHiveRequest<DatasetsDeleteResponse>(
		`/v1/projects/${encodeURIComponent(parsedInput.project_id)}/datasets/${encodeURIComponent(parsedInput.dataset_id)}`,
		await resolveDataPlaneKey(ctx),
		{ method: 'DELETE', baseUrl: await resolveDataPlaneUrl(ctx) },
	);
	const parsed = HoneyHiveEndpointOutputSchemas.datasetsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.delete',
		{ project_id: parsedInput.project_id, dataset_id: parsedInput.dataset_id },
		'completed',
	);

	return parsed;
}

export async function addDatapoints(
	ctx: HoneyHiveContext,
	input: DatasetsAddDatapointsInput,
): Promise<DatasetsAddDatapointsResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.datasetsAddDatapoints.parse(input);
	const { project_id, dataset_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<DatasetsAddDatapointsResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/datasets/${encodeURIComponent(dataset_id)}/datapoints`,
		await resolveDataPlaneKey(ctx),
		{ method: 'POST', baseUrl: await resolveDataPlaneUrl(ctx), body },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.datasetsAddDatapoints.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.addDatapoints',
		{ project_id, dataset_id, count: parsedInput.data.length },
		'completed',
	);

	return parsed;
}

export async function removeDatapoint(
	ctx: HoneyHiveContext,
	input: DatasetsRemoveDatapointInput,
): Promise<DatasetsRemoveDatapointResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.datasetsRemoveDatapoint.parse(input);
	const response = await makeHoneyHiveRequest<DatasetsRemoveDatapointResponse>(
		`/v1/projects/${encodeURIComponent(parsedInput.project_id)}/datasets/${encodeURIComponent(parsedInput.dataset_id)}/datapoints/${encodeURIComponent(parsedInput.datapoint_id)}`,
		await resolveDataPlaneKey(ctx),
		{ method: 'DELETE', baseUrl: await resolveDataPlaneUrl(ctx) },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.datasetsRemoveDatapoint.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.removeDatapoint',
		{
			project_id: parsedInput.project_id,
			dataset_id: parsedInput.dataset_id,
			datapoint_id: parsedInput.datapoint_id,
		},
		'completed',
	);

	return parsed;
}

export async function listDatasetsLegacy(
	ctx: HoneyHiveContext,
	input: DatasetsListLegacyInput,
): Promise<DatasetsListResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.datasetsListLegacy.parse(input);
	const query: Record<string, string | undefined> = {};
	if (parsedInput.dataset_id) query.dataset_id = parsedInput.dataset_id;
	if (parsedInput.name) query.name = parsedInput.name;

	const response = await makeHoneyHiveRequest<DatasetsListResponse>(
		'/v1/datasets',
		classicKey(ctx),
		{ method: 'GET', baseUrl: await resolveDataPlaneUrl(ctx), query },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.datasetsListLegacy.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.listLegacy',
		{ count: parsed.datasets?.length },
		'completed',
	);

	return parsed;
}

export async function createDatasetLegacy(
	ctx: HoneyHiveContext,
	input: DatasetsCreateLegacyInput,
): Promise<DatasetsCreateResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.datasetsCreateLegacy.parse(input);
	const response = await makeHoneyHiveRequest<DatasetsCreateResponse>(
		'/v1/datasets',
		classicKey(ctx),
		{
			method: 'POST',
			baseUrl: await resolveDataPlaneUrl(ctx),
			body: parsedInput,
		},
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.datasetsCreateLegacy.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.createLegacy',
		{ success: true },
		'completed',
	);

	return parsed;
}

export async function updateDatasetLegacy(
	ctx: HoneyHiveContext,
	input: DatasetsUpdateLegacyInput,
): Promise<DatasetsUpdateResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.datasetsUpdateLegacy.parse(input);
	const { dataset_id, ...body } = parsedInput;
	const response = await makeHoneyHiveRequest<DatasetsUpdateResponse>(
		`/v1/datasets/${encodeURIComponent(dataset_id)}`,
		classicKey(ctx),
		{ method: 'PUT', baseUrl: await resolveDataPlaneUrl(ctx), body },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.datasetsUpdateLegacy.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.updateLegacy',
		{ dataset_id },
		'completed',
	);

	return parsed;
}

export async function deleteDatasetLegacy(
	ctx: HoneyHiveContext,
	input: DatasetsDeleteLegacyInput,
): Promise<DatasetsDeleteResponse> {
	const parsedInput =
		HoneyHiveEndpointInputSchemas.datasetsDeleteLegacy.parse(input);
	const response = await makeHoneyHiveRequest<DatasetsDeleteResponse>(
		`/v1/datasets/${encodeURIComponent(parsedInput.dataset_id)}`,
		classicKey(ctx),
		{ method: 'DELETE', baseUrl: await resolveDataPlaneUrl(ctx) },
	);
	const parsed =
		HoneyHiveEndpointOutputSchemas.datasetsDeleteLegacy.parse(response);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.deleteLegacy',
		{ dataset_id: parsedInput.dataset_id },
		'completed',
	);

	return parsed;
}

export const Datasets = {
	list: listDatasets,
	create: createDataset,
	update: updateDataset,
	delete: deleteDataset,
	addDatapoints,
	removeDatapoint,
	listLegacy: listDatasetsLegacy,
	createLegacy: createDatasetLegacy,
	updateLegacy: updateDatasetLegacy,
	deleteLegacy: deleteDatasetLegacy,
};
