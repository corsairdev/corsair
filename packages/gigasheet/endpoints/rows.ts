import { logEventFromContext } from 'corsair/core';
import type { GigasheetEndpoints } from '..';
import { makeGigasheetRequest } from '../client';
import {
	GigasheetEndpointInputSchemas,
	GigasheetEndpointOutputSchemas,
	type RowsAppendByNameResponse,
	type RowsDeleteRowsResponse,
	type RowsInsertBlankRowResponse,
} from './types';

export const appendByName: GigasheetEndpoints['rows.appendByName'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['rows.appendByName'].parse(input);
	const response = await makeGigasheetRequest<RowsAppendByNameResponse>(
		`/dataset/${encodeURIComponent(parsedInput.handle)}/append/by-name`,
		ctx.key,
		{
			method: 'POST',
			// `unknown` because records contain spreadsheet cell values of unknown primitive types.
			body: { records: parsedInput.records as Record<string, unknown>[] },
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['rows.appendByName'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.rows.appendByName',
		{ handle: parsedInput.handle, recordCount: parsedInput.records.length },
		'completed',
	);

	return parsed;
};

export const insertBlankRow: GigasheetEndpoints['rows.insertBlankRow'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['rows.insertBlankRow'].parse(input);
	const response = await makeGigasheetRequest<RowsInsertBlankRowResponse>(
		`/datasets/${encodeURIComponent(parsedInput.handle)}/insert-blank-row`,
		ctx.key,
		{
			method: 'POST',
			body: {
				index: parsedInput.index,
				num_rows: parsedInput.num_rows ?? 1,
			},
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['rows.insertBlankRow'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.rows.insertBlankRow',
		{
			handle: parsedInput.handle,
			index: parsedInput.index,
			numRows: parsedInput.num_rows ?? 1,
		},
		'completed',
	);

	return parsed;
};

export const deleteRows: GigasheetEndpoints['rows.deleteRows'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['rows.deleteRows'].parse(input);
	const response = await makeGigasheetRequest<RowsDeleteRowsResponse>(
		`/dataset/${encodeURIComponent(parsedInput.handle)}/delete-rows`,
		ctx.key,
		{
			method: 'DELETE',
			body: {
				Rows: parsedInput.rows,
			},
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['rows.deleteRows'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.rows.deleteRows',
		{ handle: parsedInput.handle, rowCount: parsedInput.rows.length },
		'completed',
	);

	return parsed;
};

export const Rows = {
	appendByName,
	insertBlankRow,
	deleteRows,
};
