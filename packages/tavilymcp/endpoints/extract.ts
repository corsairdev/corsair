import { logEventFromContext } from 'corsair/core';
import { makeTavilyMcpRequest } from '../client';
import type { TavilyMcpEndpoints } from '../index';
import type { TavilyExtractResponse } from './types';
import {
	TavilyExtractRequestSchema,
	TavilyExtractResponseSchema,
} from './types';

export const extract: TavilyMcpEndpoints['extract'] = async (ctx, input) => {
	const query = TavilyExtractRequestSchema.parse(input);

	const response = TavilyExtractResponseSchema.parse(
		await makeTavilyMcpRequest<TavilyExtractResponse>('extract', ctx.key, {
			method: 'POST',
			body: query,
		}),
	);

	for (const result of response.results) {
		try {
			await ctx.db.extractResults.upsertByEntityId(result.url, {
				...result,
				extractedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[tavilymcp] Failed to save extract result ${result.url}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'tavilymcp.tavily.extract',
		{
			urlCount: response.results.length,
			failedCount: response.failed_results.length,
		},
		'completed',
	);

	return response;
};
