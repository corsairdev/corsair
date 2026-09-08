import { logEventFromContext } from 'corsair/core';
import { makeFilloutRequest, ZITE_API_BASE } from '../client';
import type { FilloutFormsEndpoints } from '../index';
import type { FilloutFormsEndpointOutputs } from './types';

export const getDatabases: FilloutFormsEndpoints['getDatabases'] = async (
	ctx,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['getDatabases']
	>('bases', ctx.key, { method: 'GET', baseUrl: ZITE_API_BASE });
	await logEventFromContext(ctx, 'filloutforms.databases.get', {}, 'completed');
	return response;
};

export const getDatabaseById: FilloutFormsEndpoints['getDatabaseById'] = async (
	ctx,
	input,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['getDatabaseById']
	>(`bases/${encodeURIComponent(input.databaseId)}`, ctx.key, {
		method: 'GET',
		baseUrl: ZITE_API_BASE,
	});
	await logEventFromContext(
		ctx,
		'filloutforms.databases.getById',
		{ databaseId: input.databaseId },
		'completed',
	);
	return response;
};

export const createDatabase: FilloutFormsEndpoints['createDatabase'] = async (
	ctx,
	input,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['createDatabase']
	>('bases', ctx.key, {
		method: 'POST',
		baseUrl: ZITE_API_BASE,
		body: { name: input.name, tables: input.tables },
	});
	await logEventFromContext(
		ctx,
		'filloutforms.databases.create',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const deleteDatabase: FilloutFormsEndpoints['deleteDatabase'] = async (
	ctx,
	input,
) => {
	const response = await makeFilloutRequest<
		FilloutFormsEndpointOutputs['deleteDatabase']
	>(`bases/${encodeURIComponent(input.databaseId)}`, ctx.key, {
		method: 'DELETE',
		baseUrl: ZITE_API_BASE,
	});
	await logEventFromContext(
		ctx,
		'filloutforms.databases.delete',
		{ databaseId: input.databaseId },
		'completed',
	);
	return response ?? {};
};
