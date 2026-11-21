import type { PexelsEndpoints } from '..';
import { call } from './call';
import {
	PexelsEndpointInputSchemas as Inputs,
	PexelsEndpointOutputSchemas as Outputs,
} from './types';

export const search: PexelsEndpoints['photosSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'photos.search',
			input: Inputs.photosSearch,
			output: Outputs.photosSearch,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/v1/search',
			query,
		}),
		{
			log: (_, page) => ({
				count: page.photos.length,
				total: page.total_results ?? undefined,
			}),
		},
	);

export const get: PexelsEndpoints['photosGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'photos.get',
			input: Inputs.photosGet,
			output: Outputs.photosGet,
		},
		input,
		({ photoId }) => ({ method: 'GET', path: `/v1/photos/${photoId}` }),
		{ log: (_, photo) => ({ photoId: photo.id ?? undefined }) },
	);

export const curated: PexelsEndpoints['photosCurated'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'photos.curated',
			input: Inputs.photosCurated,
			output: Outputs.photosCurated,
		},
		input,
		(paging) => ({ method: 'GET', path: '/v1/curated', query: paging }),
		{ log: (_, page) => ({ count: page.photos.length }) },
	);
