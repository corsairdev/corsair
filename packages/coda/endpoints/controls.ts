import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import { saveControls } from './persist';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['controlsList'] = async (ctx, input) => {
	const { docId, ...query } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['controlsList']>(
		`docs/${encodeURIComponent(docId)}/controls`,
		ctx.key,
		{ method: 'GET', query },
	);
	await saveControls(ctx, response.items);
	await logEventFromContext(
		ctx,
		'coda.controls.list',
		{ ...input },
		'completed',
	);
	return response;
};

const get: CodaEndpoints['controlsGet'] = async (ctx, input) => {
	const { docId, controlIdOrName } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['controlsGet']>(
		`docs/${encodeURIComponent(docId)}/controls/${encodeURIComponent(controlIdOrName)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await saveControls(ctx, [response]);
	await logEventFromContext(
		ctx,
		'coda.controls.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const Controls = {
	list,
	get,
};
