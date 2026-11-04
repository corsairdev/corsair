import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import { saveTables } from './persist';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['tablesList'] = async (ctx, input) => {
	const { docId, ...query } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['tablesList']>(
		`docs/${encodeURIComponent(docId)}/tables`,
		ctx.key,
		{ method: 'GET', query },
	);
	await saveTables(ctx, response.items, true);
	await logEventFromContext(ctx, 'coda.tables.list', { ...input }, 'completed');
	return response;
};

const get: CodaEndpoints['tablesGet'] = async (ctx, input) => {
	const { docId, tableIdOrName, ...query } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['tablesGet']>(
		`docs/${encodeURIComponent(docId)}/tables/${encodeURIComponent(tableIdOrName)}`,
		ctx.key,
		{ method: 'GET', query },
	);
	await saveTables(ctx, [response]);
	await logEventFromContext(ctx, 'coda.tables.get', { ...input }, 'completed');
	return response;
};

export const Tables = {
	list,
	get,
};
