import { logEventFromContext } from 'corsair/core';
import type { TinyurlEndpoints } from '..';
import { makeTinyurlRequest } from '../client';
import type { ListUrlsResponse } from './types';
import { ListUrlsInputSchema, ListUrlsResponseSchema } from './types';

export const list: TinyurlEndpoints['listUrls'] = async (ctx, rawInput) => {
	const input = ListUrlsInputSchema.parse(rawInput);

	const rawResponse = await makeTinyurlRequest<ListUrlsResponse>(
		`/urls/${input.type}`,
		ctx.key,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
				from: input.from,
				to: input.to,
				alias: input.alias,
				tag: input.tag,
			},
		},
	);

	const response = ListUrlsResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'tinyurl.urls.list',
		{ type: input.type, count: response.data.length },
		'completed',
	);

	return response;
};
