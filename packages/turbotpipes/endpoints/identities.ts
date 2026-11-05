import { logEventFromContext } from 'corsair/core';
import {
	getTurbotPipesAvatarUrl,
	makeTurbotPipesRequest,
	pathSegment,
	pickQuery,
} from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import type { TurbotPipesEndpointOutputs } from './types';

export const getIdentity: TurbotPipesEndpoints['getIdentity'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getIdentity']
	>(`identity/${pathSegment(input.identity_handle)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.identities.get',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const getIdentityAvatar: TurbotPipesEndpoints['getIdentityAvatar'] =
	async (ctx, input) => {
		// Returns the resolved image URL instead of downloading bytes: the shared
		// HTTP client parses non-JSON bodies as text and would corrupt the image.
		const response = await getTurbotPipesAvatarUrl(
			`identity/${pathSegment(input.identity_handle)}/avatar`,
			ctx.key,
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.identities.get_avatar',
			eventIdentifiers(input),
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
	>('identity', ctx.key, {
		method: 'GET',
		query: pickQuery(input, ['q', 'limit', 'next_token']),
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.identities.list',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};
