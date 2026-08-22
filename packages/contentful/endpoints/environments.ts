import { logEventFromContext } from 'corsair/core';
import type { ContentfulEndpoints } from '..';
import { makeContentfulRequest } from '../client';
import type { ContentfulEndpointOutputs } from './types';

export const get: ContentfulEndpoints['environmentsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeContentfulRequest<
		ContentfulEndpointOutputs['environmentsGet']
	>(`/spaces/${input.spaceId}/environments/${input.environmentId}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'contentful.environments.get',
		{ ...input },
		'completed',
	);
	return response;
};
