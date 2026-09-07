import { logEventFromContext } from 'corsair/core';
import type { ZenserpEndpoints } from '..';
import { makeZenserpRequest } from '../client';
import { TrendsInputSchema, TrendsResponseSchema } from './types';

export const get: ZenserpEndpoints['trendsGet'] = async (ctx, rawInput) => {
	const input = TrendsInputSchema.parse(rawInput);
	const response = TrendsResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v1/trends', ctx.key, {
			'keyword[]': input.keywords,
			location: input.location,
			timeframe: input.timeframe,
		}),
	);
	await logEventFromContext(
		ctx,
		'zenserp.trends.get',
		{ keywords: input.keywords },
		'completed',
	);
	return response;
};
