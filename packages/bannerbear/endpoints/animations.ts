import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { encodeBannerbearUid, makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const list: BannerbearEndpoints['listAnimations'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listAnimations']
	>('/v5/animations', ctx.key, {
		method: 'GET',
		query: { page: input.page },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.animations.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BannerbearEndpoints['getAnimation'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getAnimation']
	>(`/v5/animations/${encodeBannerbearUid(input.uid)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'bannerbear.animations.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: BannerbearEndpoints['createAnimation'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['createAnimation']
	>('/v5/animations', ctx.key, {
		method: 'POST',
		body: {
			template: input.template,
			modifications: input.modifications,
			formats: input.formats,
			metadata: input.metadata,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.animations.create',
		{ ...input },
		'completed',
	);
	return response;
};
