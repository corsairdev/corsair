import { logEventFromContext } from 'corsair/core';
import type { BonsaiEndpoints } from '..';
import { makeBonsaiRequest } from '../client';
import type { BonsaiEndpointOutputs } from './types';

export const list: BonsaiEndpoints['spacesList'] = async (ctx, input) => {
	const response = await makeBonsaiRequest<BonsaiEndpointOutputs['spacesList']>(
		'/spaces',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'bonsai.spaces.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BonsaiEndpoints['spacesGet'] = async (ctx, input) => {
	const response = await makeBonsaiRequest<BonsaiEndpointOutputs['spacesGet']>(
		`/spaces/${input.path}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'bonsai.spaces.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const Spaces = {
	list,
	get,
} as const;
