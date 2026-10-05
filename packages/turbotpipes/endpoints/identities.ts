import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';

export const getIdentity: TurbotPipesEndpoints['getIdentity'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getIdentity']
	>(`identity/${input.identity_handle}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'turbotpipes.identities.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const getIdentityAvatar: TurbotPipesEndpoints['getIdentityAvatar'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getIdentityAvatar']
		>(`identity/${input.identity_handle}/avatar`, ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'turbotpipes.identities.get_avatar',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listIdentities: TurbotPipesEndpoints['listIdentities'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['listIdentities']
	>('identity', ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'turbotpipes.identities.list',
		{ ...input },
		'completed',
	);
	return response;
};
