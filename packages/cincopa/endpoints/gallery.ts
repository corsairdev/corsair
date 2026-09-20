import { logEventFromContext } from 'corsair/core';
import { makeCincopaRequest } from '../client';
import type { CincopaContext } from '../index';
import {
	CincopaEndpointInputSchemas,
	CincopaEndpointOutputSchemas,
} from './types';

export const get = async (
	ctx: CincopaContext & { key: string },
	input: unknown,
) => {
	const parsedInput = CincopaEndpointInputSchemas.galleryList.parse(
		input ?? {},
	);

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
