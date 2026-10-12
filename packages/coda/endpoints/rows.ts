import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['rowsList'] = async (ctx, input) => {
	const { docId, tableIdOrName, ...query } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['rowsList']>(
		`docs/${encodeURIComponent(docId)}/tables/${encodeURIComponent(tableIdOrName)}/rows`,
		ctx.key,
		{ method: 'GET', query },
	);
	await logEventFromContext(ctx, 'coda.rows.list', { ...input }, 'completed');
	return response;
};

const get: CodaEndpoints['rowsGet'] = async (ctx, input) => {
	const { docId, tableIdOrName, rowIdOrName, ...query } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['rowsGet']>(
		`docs/${encodeURIComponent(docId)}/tables/${encodeURIComponent(tableIdOrName)}/rows/${encodeURIComponent(rowIdOrName)}`,
		ctx.key,
		{ method: 'GET', query },
	);
	await logEventFromContext(ctx, 'coda.rows.get', { ...input }, 'completed');
	return response;
};

const upsert: CodaEndpoints['rowsUpsert'] = async (ctx, input) => {
	const { docId, tableIdOrName, disableParsing, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['rowsUpsert']>(
		`docs/${encodeURIComponent(docId)}/tables/${encodeURIComponent(tableIdOrName)}/rows`,
		ctx.key,
		{ method: 'POST', body, query: { disableParsing } },
	);
	await logEventFromContext(ctx, 'coda.rows.upsert', { ...input }, 'completed');
	return response;
};

const update: CodaEndpoints['rowsUpdate'] = async (ctx, input) => {
	const { docId, tableIdOrName, rowIdOrName, disableParsing, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['rowsUpdate']>(
		`docs/${encodeURIComponent(docId)}/tables/${encodeURIComponent(tableIdOrName)}/rows/${encodeURIComponent(rowIdOrName)}`,
		ctx.key,
		{ method: 'PUT', body, query: { disableParsing } },
	);
	await logEventFromContext(ctx, 'coda.rows.update', { ...input }, 'completed');
	return response;
};

const deleteOne: CodaEndpoints['rowsDelete'] = async (ctx, input) => {
	const { docId, tableIdOrName, rowIdOrName } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['rowsDelete']>(
		`docs/${encodeURIComponent(docId)}/tables/${encodeURIComponent(tableIdOrName)}/rows/${encodeURIComponent(rowIdOrName)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'coda.rows.delete', { ...input }, 'completed');
	return response;
};

const deleteMany: CodaEndpoints['rowsDeleteMany'] = async (ctx, input) => {
	const { docId, tableIdOrName, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['rowsDeleteMany']>(
		`docs/${encodeURIComponent(docId)}/tables/${encodeURIComponent(tableIdOrName)}/rows`,
		ctx.key,
		{ method: 'DELETE', body },
	);
	await logEventFromContext(
		ctx,
		'coda.rows.deleteMany',
		{ ...input },
		'completed',
	);
	return response;
};

const pushButton: CodaEndpoints['rowsPushButton'] = async (ctx, input) => {
	const { docId, tableIdOrName, rowIdOrName, columnIdOrName } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['rowsPushButton']>(
		`docs/${encodeURIComponent(docId)}/tables/${encodeURIComponent(tableIdOrName)}/rows/${encodeURIComponent(rowIdOrName)}/buttons/${encodeURIComponent(columnIdOrName)}`,
		ctx.key,
		{ method: 'POST' },
	);
	await logEventFromContext(
		ctx,
		'coda.rows.pushButton',
		{ ...input },
		'completed',
	);
	return response;
};

export const Rows = {
	list,
	get,
	upsert,
	update,
	delete: deleteOne,
	deleteMany,
	pushButton,
};
