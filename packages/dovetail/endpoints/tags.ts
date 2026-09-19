import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const list: DovetailEndpoints['tagsList'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.tagsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.page?.limit !== undefined)
		query['page[limit]'] = parsed.page.limit;
	if (parsed.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = parsed.page.start_cursor;
	if (parsed.filter?.project_id !== undefined)
		query['filter[project_id]'] = parsed.filter.project_id;
	if (parsed.filter?.tag_board_id !== undefined)
		query['filter[tag_board_id]'] = parsed.filter.tag_board_id;
	if (parsed.sort !== undefined) query.sort = parsed.sort;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['tagsList']
	>('/v1/tags', ctx.key, {
		method: 'GET',
		query,
	});
	const validated = DovetailEndpointOutputSchemas.tagsList.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.tags.list',
		{ count: validated.data.length },
		'completed',
	);
	return validated;
};
