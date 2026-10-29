import { logEventFromContext } from 'corsair/core';
import { makeFilloutRequest, ZITE_API_BASE } from '../client';
import type { FilloutFormsEndpoints } from '../index';
import type { FilloutFormsEndpointOutputs } from './types';

function recordsPath(databaseId: string, tableId: string, recordId?: string) {
	const base = `bases/${encodeURIComponent(databaseId)}/tables/${encodeURIComponent(tableId)}/records`;
	return recordId ? `${base}/${encodeURIComponent(recordId)}` : base;
}

export const listRecords: FilloutFormsEndpoints['listRecords'] = async (
	ctx,
	input,
) => {
	const { databaseId, tableId, filter, sort, limit, offset } = input;
	const body: Record<string, unknown> = {};
	if (filter !== undefined) body.filter = filter;
	if (sort !== undefined) body.sort = sort;
	if (limit !== undefined) body.limit = limit;
	if (offset !== undefined) body.offset = offset;
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['listRecords']
	>(`${recordsPath(databaseId, tableId)}/list`, ctx.key, {
		method: 'POST',
		baseUrl: ZITE_API_BASE,
		body,
	});
	await logEventFromContext(
		ctx,
		'filloutforms.records.list',
		{ databaseId, tableId, limit, offset },
		'completed',
	);
	return response;
};

export const getRecordById: FilloutFormsEndpoints['getRecordById'] = async (
	ctx,
	input,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['getRecordById']
	>(recordsPath(input.databaseId, input.tableId, input.recordId), ctx.key, {
		method: 'GET',
		baseUrl: ZITE_API_BASE,
	});
	await logEventFromContext(
		ctx,
		'filloutforms.records.getById',
		{
			databaseId: input.databaseId,
			tableId: input.tableId,
			recordId: input.recordId,
		},
		'completed',
	);
	return response;
};

export const createRecord: FilloutFormsEndpoints['createRecord'] = async (
	ctx,
	input,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['createRecord']
	>(recordsPath(input.databaseId, input.tableId), ctx.key, {
		method: 'POST',
		baseUrl: ZITE_API_BASE,
		body: { record: input.record },
	});
	await logEventFromContext(
		ctx,
		'filloutforms.records.create',
		{ databaseId: input.databaseId, tableId: input.tableId },
		'completed',
	);
	return response;
};

export const updateRecord: FilloutFormsEndpoints['updateRecord'] = async (
	ctx,
	input,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['updateRecord']
	>(recordsPath(input.databaseId, input.tableId, input.recordId), ctx.key, {
		method: 'PATCH',
		baseUrl: ZITE_API_BASE,
		body: { record: input.record },
	});
	await logEventFromContext(
		ctx,
		'filloutforms.records.update',
		{
			databaseId: input.databaseId,
			tableId: input.tableId,
			recordId: input.recordId,
		},
		'completed',
	);
	return response;
};

export const deleteRecord: FilloutFormsEndpoints['deleteRecord'] = async (
	ctx,
	input,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['deleteRecord']
	>(recordsPath(input.databaseId, input.tableId, input.recordId), ctx.key, {
		method: 'DELETE',
		baseUrl: ZITE_API_BASE,
	});
	await logEventFromContext(
		ctx,
		'filloutforms.records.delete',
		{
			databaseId: input.databaseId,
			tableId: input.tableId,
			recordId: input.recordId,
		},
		'completed',
	);
	return response ?? {};
};
