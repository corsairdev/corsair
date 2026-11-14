import { logEventFromContext } from 'corsair/core';
import type { HyperbrowserEndpoints } from '..';
import { makeHyperbrowserRequest } from '../client';
import type { FetchPageOutput, SearchWebOutput } from './types';
import {
	FetchPageInputSchema,
	FetchPageOutputSchema,
	SearchWebInputSchema,
	SearchWebOutputSchema,
} from './types';

export const Web = {
	fetch: (async (ctx, input) => {
		const parsedInput = FetchPageInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<FetchPageOutput>(
			'/api/web/fetch',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed = FetchPageOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.web.fetch',
			{ jobId: parsed.jobId, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['web.fetch'],

	search: (async (ctx, input) => {
		const parsedInput = SearchWebInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<SearchWebOutput>(
			'/api/web/search',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed = SearchWebOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.web.search',
			{
				jobId: parsed.jobId,
				status: parsed.status,
				resultCount: parsed.data?.results.length ?? 0,
			},
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['web.search'],
};
