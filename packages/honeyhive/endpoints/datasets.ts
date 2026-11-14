import { logEventFromContext } from 'corsair/core';
import type { HoneyHiveContext } from '..';
import { makeHoneyHiveRequest } from '../client';
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

export async function listDatasets(
	ctx: HoneyHiveContext,
	input: DatasetsListInput,
): Promise<DatasetsListResponse> {
	const query: Record<string, string | undefined> = {};
	if (input.dataset_id) query.dataset_id = input.dataset_id;
	if (input.name) query.name = input.name;

	const response = await makeHoneyHiveRequest<DatasetsListResponse>(
		`/v1/projects/${encodeURIComponent(input.project_id)}/datasets`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.list',
		{ project_id: input.project_id, count: response.datasets?.length },
		'completed',
	);

	return response;
}

export async function createDataset(
	ctx: HoneyHiveContext,
	input: DatasetsCreateInput,
): Promise<DatasetsCreateResponse> {
	const { project_id, ...body } = input;
	const response = await makeHoneyHiveRequest<DatasetsCreateResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/datasets`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.create',
		{ project_id, name: input.name },
		'completed',
	);

	return response;
}

export async function updateDataset(
	ctx: HoneyHiveContext,
	input: DatasetsUpdateInput,
): Promise<DatasetsUpdateResponse> {
	const { project_id, dataset_id, ...body } = input;
	const response = await makeHoneyHiveRequest<DatasetsUpdateResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/datasets/${encodeURIComponent(dataset_id)}`,
		ctx.key,
		{ method: 'PATCH', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.update',
		{ project_id, dataset_id },
		'completed',
	);

	return response;
}

export async function deleteDataset(
	ctx: HoneyHiveContext,
	input: DatasetsDeleteInput,
): Promise<DatasetsDeleteResponse> {
	const response = await makeHoneyHiveRequest<DatasetsDeleteResponse>(
		`/v1/projects/${encodeURIComponent(input.project_id)}/datasets/${encodeURIComponent(input.dataset_id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.delete',
		{ project_id: input.project_id, dataset_id: input.dataset_id },
		'completed',
	);

	return response;
}

export async function addDatapoints(
	ctx: HoneyHiveContext,
	input: DatasetsAddDatapointsInput,
): Promise<DatasetsAddDatapointsResponse> {
	const { project_id, dataset_id, ...body } = input;
	const response = await makeHoneyHiveRequest<DatasetsAddDatapointsResponse>(
		`/v1/projects/${encodeURIComponent(project_id)}/datasets/${encodeURIComponent(dataset_id)}/datapoints`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.addDatapoints',
		{ project_id, dataset_id, count: input.data.length },
		'completed',
	);

	return response;
}

export async function removeDatapoint(
	ctx: HoneyHiveContext,
	input: DatasetsRemoveDatapointInput,
): Promise<DatasetsRemoveDatapointResponse> {
	const response = await makeHoneyHiveRequest<DatasetsRemoveDatapointResponse>(
		`/v1/projects/${encodeURIComponent(input.project_id)}/datasets/${encodeURIComponent(input.dataset_id)}/datapoints/${encodeURIComponent(input.datapoint_id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.removeDatapoint',
		{
			project_id: input.project_id,
			dataset_id: input.dataset_id,
			datapoint_id: input.datapoint_id,
		},
		'completed',
	);

	return response;
}

export async function listDatasetsLegacy(
	ctx: HoneyHiveContext,
	input: DatasetsListLegacyInput,
): Promise<DatasetsListResponse> {
	const query: Record<string, string | undefined> = {};
	if (input.dataset_id) query.dataset_id = input.dataset_id;
	if (input.name) query.name = input.name;

	const response = await makeHoneyHiveRequest<DatasetsListResponse>(
		'/v1/datasets',
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.listLegacy',
		{ count: response.datasets?.length },
		'completed',
	);

	return response;
}

export async function createDatasetLegacy(
	ctx: HoneyHiveContext,
	input: DatasetsCreateLegacyInput,
): Promise<DatasetsCreateResponse> {
	const response = await makeHoneyHiveRequest<DatasetsCreateResponse>(
		'/v1/datasets',
		ctx.key,
		{ method: 'POST', body: input },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.createLegacy',
		{ name: input.name },
		'completed',
	);

	return response;
}

export async function updateDatasetLegacy(
	ctx: HoneyHiveContext,
	input: DatasetsUpdateLegacyInput,
): Promise<DatasetsUpdateResponse> {
	const { dataset_id, ...body } = input;
	const response = await makeHoneyHiveRequest<DatasetsUpdateResponse>(
		`/v1/datasets/${encodeURIComponent(dataset_id)}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.updateLegacy',
		{ dataset_id },
		'completed',
	);

	return response;
}

export async function deleteDatasetLegacy(
	ctx: HoneyHiveContext,
	input: DatasetsDeleteLegacyInput,
): Promise<DatasetsDeleteResponse> {
	const response = await makeHoneyHiveRequest<DatasetsDeleteResponse>(
		`/v1/datasets/${encodeURIComponent(input.dataset_id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'honeyhive.datasets.deleteLegacy',
		{ dataset_id: input.dataset_id },
		'completed',
	);

	return response;
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
