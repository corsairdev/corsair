import { logEventFromContext } from 'corsair/core';
import type { HexEndpoints } from '..';
import { compactQuery, makeHexRequest } from '../client';
import type { HexEndpointOutputs } from './types';
import { HexEndpointInputSchemas, HexEndpointOutputSchemas } from './types';

/** List cells from the draft version of a project. Returns code, SQL, and markdown cell contents. */
export const cellsList: HexEndpoints['cellsList'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.cellsList.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['cellsList']>(
		`/v1/cells`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				projectId: parsedInput.projectId,
				after: parsedInput.after,
				before: parsedInput.before,
				limit: parsedInput.limit,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.cellsList.parse(response);
	await logEventFromContext(
		ctx,
		'hex.cells.list',
		{ operation: 'cells.list' },
		'completed',
	);
	return parsed;
};

/** Create a new cell in the draft version of a project */
export const cellsCreate: HexEndpoints['cellsCreate'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.cellsCreate.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['cellsCreate']>(
		`/v1/cells`,
		ctx.key,
		{
			method: 'POST',
			body: {
				projectId: parsedInput.projectId,
				cellType: parsedInput.cellType,
				label: parsedInput.label,
				contents: parsedInput.contents,
				location: parsedInput.location,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.cellsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'hex.cells.create',
		{ operation: 'cells.create' },
		'completed',
	);
	return parsed;
};

/** Delete a cell from the draft version of a project by ID */
export const cellsDelete: HexEndpoints['cellsDelete'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.cellsDelete.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['cellsDelete']>(
		`/v1/cells/${encodeURIComponent(String(parsedInput.cellId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const parsed = HexEndpointOutputSchemas.cellsDelete.parse(response);
	await logEventFromContext(
		ctx,
		'hex.cells.delete',
		{ operation: 'cells.delete' },
		'completed',
	);
	return parsed;
};

/** Get a single cell by ID */
export const cellsGet: HexEndpoints['cellsGet'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.cellsGet.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['cellsGet']>(
		`/v1/cells/${encodeURIComponent(String(parsedInput.cellId))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = HexEndpointOutputSchemas.cellsGet.parse(response);
	await logEventFromContext(
		ctx,
		'hex.cells.get',
		{ operation: 'cells.get' },
		'completed',
	);
	return parsed;
};

/** Update a cell's source and/or data connection. For SQL cells, can update the SQL source, output dataframe, and data connection. For code and markdown cells, can update the source. Returns the updated cell. */
export const cellsUpdate: HexEndpoints['cellsUpdate'] = async (ctx, input) => {
	const parsedInput = HexEndpointInputSchemas.cellsUpdate.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['cellsUpdate']>(
		`/v1/cells/${encodeURIComponent(String(parsedInput.cellId))}`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				dataConnectionId: parsedInput.dataConnectionId,
				contents: parsedInput.contents,
			},
		},
	);
	const parsed = HexEndpointOutputSchemas.cellsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'hex.cells.update',
		{ operation: 'cells.update' },
		'completed',
	);
	return parsed;
};

/** Get the rendered PNG image of a chart cell from the project's current notebook (draft) session. */
export const cellsGetChartImage: HexEndpoints['cellsGetChartImage'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.cellsGetChartImage.parse(input);
	const response = await makeHexRequest<
		HexEndpointOutputs['cellsGetChartImage']
	>(
		`/v1/cells/${encodeURIComponent(String(parsedInput.cellId))}/image`,
		ctx.key,
		{
			method: 'GET',
			query: compactQuery({
				width: parsedInput.width,
				height: parsedInput.height,
				includeTitle: parsedInput.includeTitle,
			}),
		},
	);
	const parsed = HexEndpointOutputSchemas.cellsGetChartImage.parse(response);
	await logEventFromContext(
		ctx,
		'hex.cells.getChartImage',
		{ operation: 'cells.getChartImage' },
		'completed',
	);
	return parsed;
};

/** **Unstable**: This endpoint is unstable API. Hex may make breaking changes to this endpoint without notice. */
export const cellsGetOutput: HexEndpoints['cellsGetOutput'] = async (
	ctx,
	input,
) => {
	const parsedInput = HexEndpointInputSchemas.cellsGetOutput.parse(input);
	const response = await makeHexRequest<HexEndpointOutputs['cellsGetOutput']>(
		`/v1/cells/${encodeURIComponent(String(parsedInput.cellId))}/output`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed = HexEndpointOutputSchemas.cellsGetOutput.parse(response);
	await logEventFromContext(
		ctx,
		'hex.cells.getOutput',
		{ operation: 'cells.getOutput' },
		'completed',
	);
	return parsed;
};
