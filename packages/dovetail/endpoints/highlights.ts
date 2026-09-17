import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const list: DovetailEndpoints['highlightsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page?.limit !== undefined) query['page[limit]'] = input.page.limit;
	if (input.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = input.page.start_cursor;
	if (input.filter?.project_id !== undefined)
		query['filter[project_id]'] = input.filter.project_id;
	if (input.filter?.tag_id !== undefined)
		query['filter[tag_id]'] = input.filter.tag_id;
	if (input.filter?.highlight_id !== undefined)
		query['filter[highlight_id]'] = input.filter.highlight_id;
	if (input.filter?.created_at?.gt !== undefined)
		query['filter[created_at][gt]'] = input.filter.created_at.gt;
	if (input.filter?.created_at?.gte !== undefined)
		query['filter[created_at][gte]'] = input.filter.created_at.gte;
	if (input.filter?.created_at?.lt !== undefined)
		query['filter[created_at][lt]'] = input.filter.created_at.lt;
	if (input.filter?.created_at?.lte !== undefined)
		query['filter[created_at][lte]'] = input.filter.created_at.lte;
	if (input.filter?.updated_at?.gt !== undefined)
		query['filter[updated_at][gt]'] = input.filter.updated_at.gt;
	if (input.filter?.updated_at?.gte !== undefined)
		query['filter[updated_at][gte]'] = input.filter.updated_at.gte;
	if (input.filter?.updated_at?.lt !== undefined)
		query['filter[updated_at][lt]'] = input.filter.updated_at.lt;
	if (input.filter?.updated_at?.lte !== undefined)
		query['filter[updated_at][lte]'] = input.filter.updated_at.lte;
	if (input.sort !== undefined) query.sort = input.sort;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['highlightsList']
	>('/v1/highlights', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'dovetail.highlights.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};
