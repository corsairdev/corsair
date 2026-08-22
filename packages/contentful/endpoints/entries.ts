import { logEventFromContext } from 'corsair/core';
import type { ContentfulEndpoints } from '..';
import { makeContentfulRequest } from '../client';
import type { ContentfulEndpointOutputs } from './types';

export const get: ContentfulEndpoints['entriesGet'] = async (ctx, input) => {
	const response = await makeContentfulRequest<
		ContentfulEndpointOutputs['entriesGet']
	>(
		`/spaces/${input.spaceId}/environments/${input.environmentId}/entries/${input.entryId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'contentful.entries.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: ContentfulEndpoints['entriesList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {
		skip: input.skip,
		limit: input.limit,
		...input.query,
	};

	const response = await makeContentfulRequest<
		ContentfulEndpointOutputs['entriesList']
	>(
		`/spaces/${input.spaceId}/environments/${input.environmentId}/entries`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'contentful.entries.list',
		{ ...input },
		'completed',
	);
	return response;
};
