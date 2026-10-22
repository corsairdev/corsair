import { logEventFromContext } from 'corsair/core';
import { makeDocsumoRequest } from '../client';
import type { DocsumoEndpoints } from '../index';
import {
	DocsumoEndpointInputSchemas,
	DocsumoEndpointOutputSchemas,
} from './types';

export const addRow: DocsumoEndpoints['tablesAddRow'] = async (ctx, input) => {
	const { ddid } = DocsumoEndpointInputSchemas.tablesAddRow.parse(input);

	const response = DocsumoEndpointOutputSchemas.tablesAddRow.parse(
		await makeDocsumoRequest(
			`/api/v1/raichu/drop_down/db/addrow/${encodeURIComponent(ddid)}/`,
			ctx.key,
			{ method: 'POST' },
		),
	);

	await logEventFromContext(
		ctx,
		'docsumo.tables.addRow',
		{ ddid },
		'completed',
	);

	return response;
};

export const deleteTable: DocsumoEndpoints['tablesDelete'] = async (
	ctx,
	input,
) => {
	const { dd_ids } = DocsumoEndpointInputSchemas.tablesDelete.parse(input);

	const response = DocsumoEndpointOutputSchemas.tablesDelete.parse(
		await makeDocsumoRequest('/api/v1/raichu/drop_down/db/delete/', ctx.key, {
			method: 'DELETE',
			body: { dd_ids },
		}),
	);

	await logEventFromContext(
		ctx,
		'docsumo.tables.delete',
		{ count: dd_ids.length },
		'completed',
	);

	return response;
};

export const getData: DocsumoEndpoints['tablesGetData'] = async (
	ctx,
	input,
) => {
	const { ddid } = DocsumoEndpointInputSchemas.tablesGetData.parse(input);

	const response = DocsumoEndpointOutputSchemas.tablesGetData.parse(
		await makeDocsumoRequest(
			`/api/v1/raichu/drop_down/db/get/${encodeURIComponent(ddid)}`,
			ctx.key,
			{ method: 'GET' },
		),
	);

	await logEventFromContext(
		ctx,
		'docsumo.tables.getData',
		{ ddid },
		'completed',
	);

	return response;
};
