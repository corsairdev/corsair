import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['packMakersList'] = async (ctx, input) => {
	const { packId } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['packMakersList']>(
		`packs/${encodeURIComponent(packId)}/makers`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'coda.packMakers.list',
		{ ...input },
		'completed',
	);
	return response;
};

const add: CodaEndpoints['packMakersAdd'] = async (ctx, input) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<CodaEndpointOutputs['packMakersAdd']>(
		`packs/${encodeURIComponent(packId)}/maker`,
		ctx.key,
		{ method: 'POST', body },
	);
	await logEventFromContext(
		ctx,
		'coda.packMakers.add',
		{ ...input },
		'completed',
	);
	return response;
};

const deleteOne: CodaEndpoints['packMakersDelete'] = async (ctx, input) => {
	const { packId, loginId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packMakersDelete']
	>(
		`packs/${encodeURIComponent(packId)}/maker/${encodeURIComponent(loginId)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'coda.packMakers.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const PackMakers = {
	list,
	add,
	delete: deleteOne,
};
