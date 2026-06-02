import { logEventFromContext } from 'corsair/core';
import { makeTavilyRequest } from '../client';
import type { TavilyEndpoints } from '../index';
import type { TavilyExtractResponse } from './types';

export const extract: TavilyEndpoints['extract'] = async (ctx, input) => {
	const response = await makeTavilyRequest<TavilyExtractResponse>(
		'extract',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	for (const result of response.results) {
		try {
			await ctx.db.extractResults.upsertByEntityId(result.url, {
				...result,
				extractedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[tavily] Failed to save extract result ${result.url}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'tavily.extract.extract',
		{ urlCount: response.results.length },
		'completed',
	);

	return response;
};
