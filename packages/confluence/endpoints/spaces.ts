import { logEventFromContext } from 'corsair/core';
import { makeConfluenceRequest } from '../client';
import type { ConfluenceEndpoints } from '../index';
import { SpacesListInputSchema, SpacesListResponseSchema } from './types';

export const list: ConfluenceEndpoints['spacesList'] = async (ctx, input) => {
	const validated = SpacesListInputSchema.parse(input);

	const cloudUrl =
		ctx.options.cloudUrl ?? (await ctx.keys.get_cloud_url()) ?? '';
	const cloudId =
		ctx.options.authType === 'oauth_2'
			? ((await ctx.keys.get_cloud_id()) ?? undefined)
			: undefined;

	const result = await makeConfluenceRequest('spaces', ctx.key, cloudUrl, {
		method: 'GET',
		base: '/wiki/api/v2',
		authType: ctx.options.authType,
		cloudId,
		query: {
			...(validated.key && { keys: validated.key }),
			...(validated.type && { type: validated.type }),
			...(validated.status && { status: validated.status }),
			...(validated.label && { labels: validated.label }),
			...(validated.cursor && { cursor: validated.cursor }),
			...(validated.limit !== undefined && { limit: validated.limit }),
		},
	});

	await logEventFromContext(
		ctx,
		'confluence.spaces.list',
		{ ...validated },
		'completed',
	);

	return SpacesListResponseSchema.parse(result);
};
