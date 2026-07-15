import { logEventFromContext } from 'corsair/core';
import { makeConfluenceRequest } from '../client';
import type { ConfluenceEndpoints } from '../index';
import type { ConfluenceEndpointOutputs } from './types';

export const get: ConfluenceEndpoints['pagesGet'] = async (ctx, input) => {
	const cloudUrl =
		ctx.options.cloudUrl ?? (await ctx.keys.get_cloud_url()) ?? '';

	const result = await makeConfluenceRequest<
		ConfluenceEndpointOutputs['pagesGet']
	>('../../api/v2/pages', ctx.key, cloudUrl, {
		method: 'GET',
		authType: ctx.options.authType,
		query: {
			...(input.space_id && { 'space-id': input.space_id }),
			...(input.title && { title: input.title }),
			...(input.status && { status: input.status }),
			...(input.cursor && { cursor: input.cursor }),
			...(input.limit !== undefined && { limit: input.limit }),
		},
	});

	await logEventFromContext(
		ctx,
		'confluence.pages.get',
		{ ...input },
		'completed',
	);

	return result;
};
