import { logEventFromContext } from 'corsair/core';
import { makeGiphyRequest } from '../client';
import type { GiphyEndpoints } from '../index';
import { resolveApiKey } from './auth';
import type { GiphyEndpointOutputs } from './types';
import {
	GiphyCategoriesResponseSchema,
	GiphyListResponseSchema,
} from './types';

export const list: GiphyEndpoints['categoriesList'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		customer_id: input?.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['categoriesList']
	>('/gifs/categories', apiKey, { query });

	const response = GiphyCategoriesResponseSchema.parse(rawResponse);

	if (ctx.db?.categories && response.data) {
		for (const category of response.data) {
			try {
				await ctx.db.categories.upsertByEntityId(category.name, {
					name: category.name,
					nameEncoded: category.name_encoded,
					subcategories: category.subcategories?.map((s) => s.name) ?? [],
					createdAt: new Date(),
				});
			} catch {
				// Ignore individual db write failure
			}
		}
	}

	await logEventFromContext(ctx, 'giphy.categories.list', {}, 'completed');

	return response;
};

// Get Category by ID — live-verified with a developer key (the public docs
// only table the list endpoint): GET /v1/gifs/categories/<category_id>
// returns the category's subcategories with a representative GIF each.
export const getById: GiphyEndpoints['categoriesGetById'] = async (
	ctx,
	input,
) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		customer_id: input.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['categoriesGetById']
	>(`/gifs/categories/${encodeURIComponent(input.category_id)}`, apiKey, {
		query,
	});

	const response = GiphyCategoriesResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'giphy.categories.getById',
		{ category_id: input.category_id },
		'completed',
	);

	return response;
};

// Category GIFs — live-verified with a developer key (the public docs only
// table the list endpoint): GET /v1/gifs/categories/<category_id>/gifs
// returns a paginated GIF list for the category.
export const gifs: GiphyEndpoints['categoriesGifs'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		limit: input.limit,
		offset: input.offset,
		rating: input.rating,
		customer_id: input.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['categoriesGifs']
	>(`/gifs/categories/${encodeURIComponent(input.category_id)}/gifs`, apiKey, {
		query,
	});

	const response = GiphyListResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'giphy.categories.gifs',
		{ category_id: input.category_id },
		'completed',
	);

	return response;
};

export const Categories = {
	list,
	getById,
	gifs,
};
