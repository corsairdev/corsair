import { logEventFromContext } from 'corsair/core';
import type { CincopaEndpoints } from '..';
import { makeCincopaRequest } from '../client';
import {
	CincopaEndpointInputSchemas,
	CincopaEndpointOutputSchemas,
} from './types';

export const get: CincopaEndpoints['galleryList'] = async (ctx, input) => {
	const parsedInput = CincopaEndpointInputSchemas.galleryList.parse(
		input ?? {},
	);

	// unknown: provider response is parsed immediately by Zod before use.
	const raw = await makeCincopaRequest<unknown>('gallery.list.json', ctx.key, {
		method: 'GET',
		query: {
			search: parsedInput.search,
			page: parsedInput.page,
			items_per_page: parsedInput.itemsPerPage,
			filter_tags: parsedInput.filterTags,
		},
	});

	const response = CincopaEndpointOutputSchemas.galleryList.parse(raw);

	await logEventFromContext(
		ctx,
		'cincopa.gallery.list',
		{ ...parsedInput },
		'completed',
	);

	return response;
};
