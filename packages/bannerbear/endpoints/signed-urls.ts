import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const list: BannerbearEndpoints['listInstantUrls'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listInstantUrls']
	>('/v5/instant_urls', ctx.key, {
		method: 'GET',
		query: { page: input.page },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.instant_urls.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: BannerbearEndpoints['createInstantUrl'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['createInstantUrl']
	>('/v5/instant_urls', ctx.key, {
		method: 'POST',
		body: { ...input },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.instant_urls.create',
		{ ...input },
		'completed',
	);
	return response;
};
