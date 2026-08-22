import { logEventFromContext } from 'corsair/core';
import type { ContentfulEndpoints } from '..';
import { makeContentfulRequest } from '../client';
import type { ContentfulEndpointOutputs } from './types';

/** Retrieves a specific content type from the Contentful Management API. */
export const get: ContentfulEndpoints['contentTypesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeContentfulRequest<
		ContentfulEndpointOutputs['contentTypesGet']
	>(
		`/spaces/${input.spaceId}/environments/${input.environmentId}/content_types/${input.contentTypeId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'contentful.content_types.get',
		{ ...input },
		'completed',
	);
	return response;
};

/** Retrieves a list of content types from the Contentful Management API. */
export const list: ContentfulEndpoints['contentTypesList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		skip: input.skip,
		limit: input.limit,
		...input.query,
	};

	const response = await makeContentfulRequest<
		ContentfulEndpointOutputs['contentTypesList']
	>(
		`/spaces/${input.spaceId}/environments/${input.environmentId}/content_types`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'contentful.content_types.list',
		{ ...input },
		'completed',
	);
	return response;
};
