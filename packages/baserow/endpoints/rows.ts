import { logEventFromContext } from 'corsair/core';
import type { BaserowEndpoints } from '..';
import { makeBaserowRequest } from '../client';
import type { BaserowEndpointOutputs } from './types';

export const list: BaserowEndpoints['listRows'] = async (ctx, input) => {
	const response = await makeBaserowRequest<BaserowEndpointOutputs['listRows']>(
		`api/database/rows/table/${input.tableId}/`,
		ctx.key,
		{
			method: 'GET',
			query: {
				page: input.page,
				size: input.size,
				search: input.search,
				order_by: input.orderBy,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'baserow.rows.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const get: BaserowEndpoints['getRow'] = async (ctx, input) => {
	const response = await makeBaserowRequest<BaserowEndpointOutputs['getRow']>(
		`api/database/rows/table/${input.tableId}/${input.rowId}/`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'baserow.rows.get', { ...input }, 'completed');

	return response;
};

export const create: BaserowEndpoints['createRow'] = async (ctx, input) => {
	const response = await makeBaserowRequest<
		BaserowEndpointOutputs['createRow']
	>(`api/database/rows/table/${input.tableId}/`, ctx.key, {
		method: 'POST',
		body: input.data,
	});

	await logEventFromContext(
		ctx,
		'baserow.rows.create',
		{ ...input },
		'completed',
	);

	return response;
};

export const update: BaserowEndpoints['updateRow'] = async (ctx, input) => {
	const response = await makeBaserowRequest<
		BaserowEndpointOutputs['updateRow']
	>(`api/database/rows/table/${input.tableId}/${input.rowId}/`, ctx.key, {
		method: 'PATCH',
		body: input.data,
	});

	await logEventFromContext(
		ctx,
		'baserow.rows.update',
		{ ...input },
		'completed',
	);

	return response;
};

export const remove: BaserowEndpoints['deleteRow'] = async (ctx, input) => {
	await makeBaserowRequest<void>(
		`api/database/rows/table/${input.tableId}/${input.rowId}/`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'baserow.rows.delete',
		{ ...input },
		'completed',
	);

	return {
		success: true,
	};
};
