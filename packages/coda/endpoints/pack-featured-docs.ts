import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['packFeaturedDocsList'] = async (ctx, input) => {
	const { packId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packFeaturedDocsList']
	>(`packs/${encodeURIComponent(packId)}/featuredDocs`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'coda.packFeaturedDocs.list',
		{ ...input },
		'completed',
	);
	return response;
};

const update: CodaEndpoints['packFeaturedDocsUpdate'] = async (ctx, input) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packFeaturedDocsUpdate']
	>(`packs/${encodeURIComponent(packId)}/featuredDocs`, ctx.key, {
		method: 'PUT',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.packFeaturedDocs.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const PackFeaturedDocs = {
	list,
	update,
};
