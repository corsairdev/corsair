import { logEventFromContext } from 'corsair/core';
import type { ContentfulEndpoints } from '..';
import { makeContentfulRequest } from '../client';
import type { ContentfulEndpointOutputs } from './types';

/** Retrieves a specific asset from the Contentful Management API. */
export const get: ContentfulEndpoints['assetsGet'] = async (ctx, input) => {
	const response = await makeContentfulRequest<
		ContentfulEndpointOutputs['assetsGet']
	>(
		`/spaces/${input.spaceId}/environments/${input.environmentId}/assets/${input.assetId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'contentful.assets.get',
		{ ...input },
		'completed',
	);
	return response;
};

/** Retrieves a list of assets from the Contentful Management API. */
export const list: ContentfulEndpoints['assetsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {
		skip: input.skip,
		limit: input.limit,
		...input.query,
	};

	const response = await makeContentfulRequest<
		ContentfulEndpointOutputs['assetsList']
	>(
		`/spaces/${input.spaceId}/environments/${input.environmentId}/assets`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'contentful.assets.list',
		{ ...input },
		'completed',
	);
	return response;
};
