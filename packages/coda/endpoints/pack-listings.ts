import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['packListingsList'] = async (ctx, input) => {
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packListingsList']
	>('packs/listings', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'coda.packListings.list',
		{ ...input },
		'completed',
	);
	return response;
};

const get: CodaEndpoints['packListingsGet'] = async (ctx, input) => {
	const { packId, ...query } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packListingsGet']
	>(`packs/${encodeURIComponent(packId)}/listing`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'coda.packListings.get',
		{ ...input },
		'completed',
	);
	return response;
};

const deleteDraft: CodaEndpoints['packListingsDeleteDraft'] = async (
	ctx,
	input,
) => {
	const { packId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packListingsDeleteDraft']
	>(`packs/${encodeURIComponent(packId)}/listingDraft`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'coda.packListings.deleteDraft',
		{ ...input },
		'completed',
	);
	return response;
};

export const PackListings = {
	list,
	get,
	deleteDraft,
};
