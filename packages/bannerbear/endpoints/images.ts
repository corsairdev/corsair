import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { encodeBannerbearUid, makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const list: BannerbearEndpoints['listImages'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listImages']
	>('/v5/images', ctx.key, {
		method: 'GET',
		query: { page: input.page },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.images.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BannerbearEndpoints['getImage'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getImage']
	>(`/v5/images/${encodeBannerbearUid(input.uid)}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'bannerbear.images.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: BannerbearEndpoints['createImage'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['createImage']
	>('/v5/images', ctx.key, {
		method: 'POST',
		body: {
			template: input.template,
			modifications: input.modifications,
			metadata: input.metadata,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.images.create',
		{ ...input },
		'completed',
	);
	return response;
};
