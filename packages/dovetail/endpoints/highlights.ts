import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const list: DovetailEndpoints['highlightsList'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.highlightsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.page?.limit !== undefined)
		query['page[limit]'] = parsed.page.limit;
	if (parsed.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = parsed.page.start_cursor;
	if (parsed.filter?.project_id !== undefined)
		query['filter[project_id]'] = parsed.filter.project_id;
	if (parsed.filter?.tag_id !== undefined)
		query['filter[tag_id]'] = parsed.filter.tag_id;
	if (parsed.filter?.highlight_id !== undefined)
		query['filter[highlight_id]'] = parsed.filter.highlight_id;
	if (parsed.filter?.created_at?.gt !== undefined)
		query['filter[created_at][gt]'] = parsed.filter.created_at.gt;
	if (parsed.filter?.created_at?.gte !== undefined)
		query['filter[created_at][gte]'] = parsed.filter.created_at.gte;
	if (parsed.filter?.created_at?.lt !== undefined)
		query['filter[created_at][lt]'] = parsed.filter.created_at.lt;
	if (parsed.filter?.created_at?.lte !== undefined)
		query['filter[created_at][lte]'] = parsed.filter.created_at.lte;
	if (parsed.filter?.updated_at?.gt !== undefined)
		query['filter[updated_at][gt]'] = parsed.filter.updated_at.gt;
	if (parsed.filter?.updated_at?.gte !== undefined)
		query['filter[updated_at][gte]'] = parsed.filter.updated_at.gte;
	if (parsed.filter?.updated_at?.lt !== undefined)
		query['filter[updated_at][lt]'] = parsed.filter.updated_at.lt;
	if (parsed.filter?.updated_at?.lte !== undefined)
		query['filter[updated_at][lte]'] = parsed.filter.updated_at.lte;
	if (parsed.sort !== undefined) query.sort = parsed.sort;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['highlightsList']
	>('/v1/highlights', ctx.key, {
		method: 'GET',
		query,
	});
	const validated =
		DovetailEndpointOutputSchemas.highlightsList.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.highlights.list',
		{ count: validated.data.length },
		'completed',
	);
	return validated;
};
