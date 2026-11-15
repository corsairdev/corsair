import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import { saveFormulas } from './persist';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['formulasList'] = async (ctx, input) => {
	const { docId, ...query } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['formulasList']>(
		`docs/${encodeURIComponent(docId)}/formulas`,
		ctx.key,
		{ method: 'GET', query },
	);
	await saveFormulas(ctx, response.items, true);
	await logEventFromContext(
		ctx,
		'coda.formulas.list',
		{ ...input },
		'completed',
	);
	return response;
};

const get: CodaEndpoints['formulasGet'] = async (ctx, input) => {
	const { docId, formulaIdOrName } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['formulasGet']>(
		`docs/${encodeURIComponent(docId)}/formulas/${encodeURIComponent(formulaIdOrName)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await saveFormulas(ctx, [response]);
	await logEventFromContext(
		ctx,
		'coda.formulas.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const Formulas = {
	list,
	get,
};
