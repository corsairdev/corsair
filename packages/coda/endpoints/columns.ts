import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['columnsList'] = async (ctx, input) => {
	const { docId, tableIdOrName, ...query } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['columnsList']>(
		`docs/${encodeURIComponent(docId)}/tables/${encodeURIComponent(tableIdOrName)}/columns`,
		ctx.key,
		{ method: 'GET', query },
	);
	await logEventFromContext(
		ctx,
		'coda.columns.list',
		{ ...input },
		'completed',
	);
	return response;
};

const get: CodaEndpoints['columnsGet'] = async (ctx, input) => {
	const { docId, tableIdOrName, columnIdOrName } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['columnsGet']>(
		`docs/${encodeURIComponent(docId)}/tables/${encodeURIComponent(tableIdOrName)}/columns/${encodeURIComponent(columnIdOrName)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'coda.columns.get', { ...input }, 'completed');
	return response;
};

export const Columns = {
	list,
	get,
};
