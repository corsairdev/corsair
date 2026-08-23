import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const list: BannerbearEndpoints['listAnimatedGifs'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listAnimatedGifs']
	>('/v5/animated_gifs', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
			project_id: input.project_id,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.animated_gifs.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BannerbearEndpoints['getAnimatedGif'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getAnimatedGif']
	>(`/v5/animated_gifs/${input.uid}`, ctx.key, {
		method: 'GET',
		query: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.animated_gifs.get',
		{ ...input },
		'completed',
	);
	return response;
};
