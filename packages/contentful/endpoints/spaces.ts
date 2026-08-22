import { logEventFromContext } from 'corsair/core';
import type { ContentfulEndpoints } from '..';
import { makeContentfulRequest } from '../client';
import type { ContentfulEndpointOutputs } from './types';

export const get: ContentfulEndpoints['spacesGet'] = async (ctx, input) => {
	const response = await makeContentfulRequest<
		ContentfulEndpointOutputs['spacesGet']
	>(`/spaces/${input.spaceId}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'contentful.spaces.get',
		{ ...input },
		'completed',
	);
	return response;
};
