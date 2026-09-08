import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeGiphyRequest } from '../client';
import type { GiphyEndpoints } from '../index';
import type { GiphyEndpointOutputs } from './types';
import { GiphyCategoriesResponseSchema } from './types';

export const list: GiphyEndpoints['categoriesList'] = async (ctx) => {
	const apiKey = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('giphy', 'api_key');
	}

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['categoriesList']
	>('/gifs/categories', apiKey);

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
			} catch (err) {
				// Ignore individual db write failure
			}
		}
	}

	await logEventFromContext(ctx, 'giphy.categories.list', {}, 'completed');

	return response;
};

export const Categories = {
	list,
};
