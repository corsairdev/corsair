import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/**
 * Reads a page of the user's composed feed (GET /user/feed): their own item
 * lane merged with blog posts, job of the day and broadcasts, newest first.
 * Pass the previous page's nextCursor back in to page forward.
 */
export const list: RemoetEndpoints['feedList'] = async (ctx, input) => {
	const parsed = RemoetEndpointInputSchemas.feedList.parse(input);
	const response = await makeRemoetRequest('/user/feed', ctx.key, {
		method: 'GET',
		query: { pageSize: parsed.pageSize, cursor: parsed.cursor },
	});
	const validated = RemoetEndpointOutputSchemas.feedList.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.feed.list',
		{
			resultCount: validated.entries.length,
			hasNextPage: validated.hasNextPage,
		},
		'completed',
	);
	return validated;
};
