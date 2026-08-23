import { logEventFromContext } from 'corsair/core';
import type { BannerbearEndpoints } from '..';
import { makeBannerbearRequest } from '../client';
import type { BannerbearEndpointOutputs } from './types';

export const list: BannerbearEndpoints['listScreenshots'] = async (
	ctx,
	input,
) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['listScreenshots']
	>('/v5/screenshots', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
			project_id: input.project_id,
		},
	});
	await logEventFromContext(
		ctx,
		'bannerbear.screenshots.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BannerbearEndpoints['getScreenshot'] = async (ctx, input) => {
	const response = await makeBannerbearRequest<
		BannerbearEndpointOutputs['getScreenshot']
	>(`/v5/screenshots/${input.uid}`, ctx.key, {
		method: 'GET',
		query: { project_id: input.project_id },
	});
	await logEventFromContext(
		ctx,
		'bannerbear.screenshots.get',
		{ ...input },
		'completed',
	);
	return response;
};
