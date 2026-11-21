import type { PexelsEndpoints } from '..';
import { call, segment } from './call';
import {
	PexelsEndpointInputSchemas as Inputs,
	PexelsEndpointOutputSchemas as Outputs,
} from './types';

export const list: PexelsEndpoints['collectionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.list',
			input: Inputs.collectionsList,
			output: Outputs.collectionsList,
		},
		input,
		(paging) => ({ method: 'GET', path: '/v1/collections', query: paging }),
		{ log: (_, page) => ({ count: page.collections.length }) },
	);

export const listFeatured: PexelsEndpoints['collectionsListFeatured'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'collections.listFeatured',
			input: Inputs.collectionsListFeatured,
			output: Outputs.collectionsListFeatured,
		},
		input,
		(paging) => ({
			method: 'GET',
			path: '/v1/collections/featured',
			query: paging,
		}),
		{ log: (_, page) => ({ count: page.collections.length }) },
	);

export const listMedia: PexelsEndpoints['collectionsListMedia'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'collections.listMedia',
			input: Inputs.collectionsListMedia,
			output: Outputs.collectionsListMedia,
		},
		input,
		({ collectionId, ...paging }) => ({
			method: 'GET',
			path: `/v1/collections/${segment(collectionId)}`,
			query: paging,
		}),
		{ log: (_, page) => ({ count: page.media.length }) },
	);
