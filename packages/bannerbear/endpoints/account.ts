import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const getAccountInfo: BannerbearEndpoints['getAccountInfo'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getAccountInfo']
	>('/v5/account', ctx.key, {
		method: 'GET',
		query: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.account.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const getAuth: BannerbearEndpoints['getAuth'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getAuth']
	>('/v5/account', ctx.key, {
		method: 'GET',
		query: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.auth.get',
		{ ...input },
		'completed',
	);
	return response;
};
