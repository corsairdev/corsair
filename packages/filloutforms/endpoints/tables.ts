import { logEventFromContext } from 'corsair/core';
import { makeFilloutRequest, ZITE_API_BASE } from '../client';
import type { FilloutFormsEndpoints } from '../index';
import type { FilloutFormsEndpointOutputs } from './types';

export const createTable: FilloutFormsEndpoints['createTable'] = async (
	ctx,
	input,
) => {
	const { databaseId, name, fields } = input;
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['createTable']
	>(`bases/${encodeURIComponent(databaseId)}/tables`, ctx.key, {
		method: 'POST',
		baseUrl: ZITE_API_BASE,
		body: { name, fields },
	});
	await logEventFromContext(
		ctx,
		'filloutforms.tables.create',
		{ databaseId, name },
		'completed',
	);
	return response;
};

export const updateTable: FilloutFormsEndpoints['updateTable'] = async (
	ctx,
	input,
) => {
	const { databaseId, tableId, name } = input;
	const body: Record<string, unknown> = {};
	if (name !== undefined) body.name = name;
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['updateTable']
	>(
		`bases/${encodeURIComponent(databaseId)}/tables/${encodeURIComponent(tableId)}`,
		ctx.key,
		{ method: 'PATCH', baseUrl: ZITE_API_BASE, body },
	);
	await logEventFromContext(
		ctx,
		'filloutforms.tables.update',
		{ databaseId, tableId },
		'completed',
	);
	return response;
};

export const deleteTable: FilloutFormsEndpoints['deleteTable'] = async (
	ctx,
	input,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['deleteTable']
	>(
		`bases/${encodeURIComponent(input.databaseId)}/tables/${encodeURIComponent(input.tableId)}`,
		ctx.key,
		{ method: 'DELETE', baseUrl: ZITE_API_BASE },
	);
	await logEventFromContext(
		ctx,
		'filloutforms.tables.delete',
		{ databaseId: input.databaseId, tableId: input.tableId },
		'completed',
	);
	return response ?? {};
};
