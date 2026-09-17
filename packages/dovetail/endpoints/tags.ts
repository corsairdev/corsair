import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const list: DovetailEndpoints['tagsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page?.limit !== undefined) query['page[limit]'] = input.page.limit;
	if (input.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = input.page.start_cursor;
	if (input.filter?.project_id !== undefined)
		query['filter[project_id]'] = input.filter.project_id;
	if (input.filter?.tag_board_id !== undefined)
		query['filter[tag_board_id]'] = input.filter.tag_board_id;
	if (input.sort !== undefined) query.sort = input.sort;

	const result = await makeDovetailRequest<DovetailEndpointOutputs['tagsList']>(
		'/v1/tags',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'dovetail.tags.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};
