import { logEventFromContext } from 'corsair/core';
import { makeConfluenceRequest } from '../client';
import type { ConfluenceEndpoints } from '../index';
import { PagesGetInputSchema, PagesGetResponseSchema } from './types';

export const get: ConfluenceEndpoints['pagesGet'] = async (ctx, input) => {
	const validated = PagesGetInputSchema.parse(input);

	const cloudUrl =
		ctx.options.cloudUrl ?? (await ctx.keys.get_cloud_url()) ?? '';
	const cloudId =
		ctx.options.authType === 'oauth_2'
			? ((await ctx.keys.get_cloud_id()) ?? undefined)
			: undefined;

	const result = await makeConfluenceRequest('pages', ctx.key, cloudUrl, {
		method: 'GET',
		base: '/wiki/api/v2',
		authType: ctx.options.authType,
		cloudId,
		query: {
			...(validated.space_id && { 'space-id': validated.space_id }),
			...(validated.title && { title: validated.title }),
			...(validated.status && { status: validated.status }),
			...(validated.cursor && { cursor: validated.cursor }),
			...(validated.limit !== undefined && { limit: validated.limit }),
		},
	});

	await logEventFromContext(
		ctx,
		'confluence.pages.get',
		{ ...validated },
		'completed',
	);

	return PagesGetResponseSchema.parse(result);
};
