import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { BonsaiEndpoints } from '..';
import { makeBonsaiRequest } from '../client';
import {
	BonsaiEndpointInputSchemas,
	BonsaiEndpointOutputSchemas,
} from './types';

export const list: BonsaiEndpoints['spacesList'] = async (ctx, input) => {
	const parsed = BonsaiEndpointInputSchemas.spacesList.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('bonsai', 'api_key');
	}
	const response = await makeBonsaiRequest('/spaces', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'bonsai.spaces.list',
		{ ...parsed },
		'completed',
	);
	return BonsaiEndpointOutputSchemas.spacesList.parse(response);
};

export const get: BonsaiEndpoints['spacesGet'] = async (ctx, input) => {
	const parsed = BonsaiEndpointInputSchemas.spacesGet.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('bonsai', 'api_key');
	}
	const response = await makeBonsaiRequest(`/spaces/${parsed.path}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'bonsai.spaces.get',
		{ path: parsed.path },
		'completed',
	);
	return BonsaiEndpointOutputSchemas.spacesGet.parse(response);
};

export const Spaces = {
	list,
	get,
} as const;
