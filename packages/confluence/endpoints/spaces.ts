import { logEventFromContext } from 'corsair/core';
import { makeConfluenceRequest } from '../client';
import type { ConfluenceEndpoints } from '../index';
import type { ConfluenceEndpointOutputs } from './types';

export const list: ConfluenceEndpoints['spacesList'] = async (ctx, input) => {
	const cloudUrl =
		ctx.options.cloudUrl ?? (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeConfluenceRequest<
		ConfluenceEndpointOutputs['spacesList']
	>('space', ctx.key, cloudUrl, {
		method: 'GET',
		query: {
			...(input.key && { key: input.key }),
			...(input.type && { type: input.type }),
			...(input.status && { status: input.status }),
			...(input.label && { label: input.label }),
			...(input.start !== undefined && { start: input.start }),
			...(input.limit !== undefined && { limit: input.limit }),
			...(input.expand && { expand: input.expand }),
		},
	});

	await logEventFromContext(
		ctx,
		'confluence.spaces.list',
		{ ...input },
		'completed',
	);

	return result;
};
