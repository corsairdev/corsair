import { logEventFromContext } from 'corsair/core';
import type { GigasheetEndpoints } from '..';
import { makeGigasheetRequest } from '../client';
import {
	GigasheetEndpointInputSchemas,
	GigasheetEndpointOutputSchemas,
} from './types';
import type {
	DatasetsDeleteResponse,
	DatasetsGetColumnsResponse,
	DatasetsGetOperationStatusResponse,
	DatasetsGetResponse,
	DatasetsListResponse,
} from './types';

export const get: GigasheetEndpoints['datasets.get'] = async (ctx, input) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['datasets.get'].parse(input);
	const response = await makeGigasheetRequest<DatasetsGetResponse>(
		`/dataset/${encodeURIComponent(parsedInput.handle)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed = GigasheetEndpointOutputSchemas['datasets.get'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.datasets.get',
		{ handle: parsedInput.handle, status: parsed.Status },
		'completed',
	);

	return parsed;
};

export const datasetsDelete: GigasheetEndpoints['datasets.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['datasets.delete'].parse(input);
	const response = await makeGigasheetRequest<DatasetsDeleteResponse>(
		`/delete/${encodeURIComponent(parsedInput.handle)}`,
		ctx.key,
		{
			method: 'DELETE',
			query:
				parsedInput.recursive !== undefined
					? { recursive: parsedInput.recursive }
					: undefined,
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['datasets.delete'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.datasets.delete',
		{ handle: parsedInput.handle, success: parsed.Success },
		'completed',
	);

	return parsed;
};

export const getColumns: GigasheetEndpoints['datasets.getColumns'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['datasets.getColumns'].parse(input);
	const response = await makeGigasheetRequest<DatasetsGetColumnsResponse>(
		`/dataset/${encodeURIComponent(parsedInput.handle)}/columns`,
		ctx.key,
		{
			method: 'GET',
			query: {
				showHidden: parsedInput.showHidden,
				type: parsedInput.type,
			},
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['datasets.getColumns'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.datasets.getColumns',
		{ handle: parsedInput.handle, columnCount: parsed.length },
		'completed',
	);

	return parsed;
};

export const list: GigasheetEndpoints['datasets.list'] = async (ctx, input) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['datasets.list'].parse(input);
	const path = parsedInput.handle
		? `/library/${encodeURIComponent(parsedInput.handle)}`
		: '/library/';
	const response = await makeGigasheetRequest<DatasetsListResponse>(
		path,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['datasets.list'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.datasets.list',
		{ count: parsed.length },
		'completed',
	);

	return parsed;
};

export const getOperationStatus: GigasheetEndpoints['datasets.getOperationStatus'] =
	async (ctx, input) => {
		const parsedInput =
			GigasheetEndpointInputSchemas['datasets.getOperationStatus'].parse(input);
		const response =
			await makeGigasheetRequest<DatasetsGetOperationStatusResponse>(
				`/dataset/${encodeURIComponent(parsedInput.handle)}/operation-status`,
				ctx.key,
				{
					method: 'GET',
				},
			);

		const parsed =
			GigasheetEndpointOutputSchemas['datasets.getOperationStatus'].parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'gigasheet.datasets.getOperationStatus',
			{ handle: parsedInput.handle, status: parsed.Status },
			'completed',
		);

		return parsed;
	};

export const Datasets = {
	get,
	delete: datasetsDelete,
	getColumns,
	list,
	getOperationStatus,
};
