import { logEventFromContext } from 'corsair/core';
import type { ComposioEndpoints } from '..';
import { makeComposioRequest, omitUndefined } from '../client';
import type { ComposioEndpointOutputs } from './types';

export const list: ComposioEndpoints['appsList'] = async (ctx, input) => {
	const response = await makeComposioRequest<
		ComposioEndpointOutputs['appsList']
	>('/v3/toolkits', ctx.key, {
		method: 'GET',
		// apps.list → GET /v3/toolkits (old /v1/apps is gone)
		query: omitUndefined({
			category: input.category,
			managed_by: input.managed_by,
			type: input.type,
			sort_by: input.sort_by,
			search: input.search,
			include_deprecated: input.include_deprecated,
			limit: input.limit,
			cursor: input.cursor,
		}),
	});

	await logEventFromContext(
		ctx,
		'composio.apps.list',
		{ ...input },
		'completed',
	);
	return response;
};
