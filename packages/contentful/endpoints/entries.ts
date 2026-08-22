import { logEventFromContext } from 'corsair/core';
import type { ContentfulEndpoints } from '..';
import { makeContentfulRequest } from '../client';
import type { ContentfulEndpointOutputs } from './types';

/** Retrieves a specific entry from the Contentful Management API. */
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

/** Retrieves a list of entries from the Contentful Management API. */
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

/** Creates a new entry in the Contentful Management API. */
export const create: ContentfulEndpoints['entriesCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeContentfulRequest<
		ContentfulEndpointOutputs['entriesCreate']
	>(
		`/spaces/${input.spaceId}/environments/${input.environmentId}/entries`,
		ctx.key,
		{
			method: 'POST',
			headers: { 'X-Contentful-Content-Type': input.contentTypeId },
			body: { fields: input.fields },
		},
	);

	await logEventFromContext(
		ctx,
		'contentful.entries.create',
		{ ...input },
		'completed',
	);
	return response;
};

/** Updates an existing entry in the Contentful Management API. */
export const update: ContentfulEndpoints['entriesUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeContentfulRequest<
		ContentfulEndpointOutputs['entriesUpdate']
	>(
		`/spaces/${input.spaceId}/environments/${input.environmentId}/entries/${input.entryId}`,
		ctx.key,
		{
			method: 'PUT',
			headers: { 'X-Contentful-Version': input.version.toString() },
			body: { fields: input.fields },
		},
	);

	await logEventFromContext(
		ctx,
		'contentful.entries.update',
		{ ...input },
		'completed',
	);
	return response;
};
