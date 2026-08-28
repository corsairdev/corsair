import type { CorsairEndpoint } from 'corsair/core';
import type { SourcegraphContext } from '../index';
import type { SearchInput, SearchResponse } from './types';

export const search: CorsairEndpoint<
	SourcegraphContext,
	SearchInput,
	SearchResponse
> = async (ctx, input) => {
	const response = await ctx.http.post('/.api/search/stream', input);

	return response.data as SearchResponse;
};
