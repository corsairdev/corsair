import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const query: SharepointEndpoints['searchQuery'] = async (ctx, input) => {
	const request: Record<string, unknown> = {
		entityTypes: ['listItem', 'driveItem'],
		query: { queryString: input.query_text },
	};
	if (input.row_limit !== undefined) request.size = input.row_limit;
	if (input.start_row !== undefined) request.from = input.start_row;
	if (input.select_properties?.length) request.fields = input.select_properties;

	const result = await makeGraphRequest<
		SharepointEndpointOutputs['searchQuery']
	>('/search/query', ctx.key, {
		method: 'POST',
		body: { requests: [request] },
	});

	await logEventFromContext(
		ctx,
		'sharepoint.search.query',
		{ ...input },
		'completed',
	);
	return result;
};

export const suggest: SharepointEndpoints['searchSuggest'] = async (
	ctx,
	input,
) => {
	// Microsoft Graph does not have a direct equivalent to SharePoint search suggestions
	// Return an empty stub for backwards compatibility
	await logEventFromContext(
		ctx,
		'sharepoint.search.suggest',
		{ ...input },
		'completed',
	);
	return { value: [] };
};
