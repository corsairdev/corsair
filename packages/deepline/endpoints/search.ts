import { makeDeeplineRequest } from '../client';
import { defineEndpoint } from './common';
import { SearchInputSchema, SearchOutputSchema } from './types';
export const query = defineEndpoint({
	event: 'deepline.search.query',
	input: SearchInputSchema,
	output: SearchOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/search`, ctx.key, {
			method: 'GET',
			query: {
				q: input.q,
				types: input.types,
				exclude: input.exclude,
				categories: input.categories,
				search_terms: input.search_terms,
				limit: input.limit,
				offset: input.offset,
				task: input.task,
			},
		}),
});
