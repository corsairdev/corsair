import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

export const whoami: CodaEndpoints['whoami'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['whoami']>(
		'whoami',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'coda.whoami', { ...input }, 'completed');
	return response;
};

export const listDocs: CodaEndpoints['listDocs'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['listDocs']>(
		'docs',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input?.limit,
				pageToken: input?.pageToken,
			},
		},
	);

	await logEventFromContext(ctx, 'coda.docs.list', { ...input }, 'completed');
	return response;
};

export const listTables: CodaEndpoints['listTables'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['listTables']>(
		`docs/${encodeURIComponent(input.docId)}/tables`,
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input?.limit,
				pageToken: input?.pageToken,
			},
		},
	);

	await logEventFromContext(ctx, 'coda.tables.list', { ...input }, 'completed');
	return response;
};

export const insertRows: CodaEndpoints['insertRows'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['insertRows']>(
		`docs/${encodeURIComponent(input.docId)}/tables/${encodeURIComponent(input.tableId)}/rows`,
		ctx.key,
		{
			method: 'POST',
			body: { rows: input.rows },
		},
	);

	await logEventFromContext(ctx, 'coda.rows.insert', { ...input }, 'completed');
	return response;
};
