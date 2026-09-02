import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const getAccountInfo: BannerbearEndpoints['getAccountInfo'] = async (
	ctx,
	_input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getAccountInfo']
	>('/v5/account', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'bannerbear.account.get', {}, 'completed');
	return response;
};

export const getAuth: BannerbearEndpoints['getAuth'] = async (ctx, _input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getAuth']
	>('/v5/account', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'bannerbear.auth.get', {}, 'completed');
	return response;
};
