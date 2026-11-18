import { logEventFromContext } from 'corsair/core';
import { getInsights } from '../client';
import type { MicrosoftClarityEndpoints } from '../index';
import { InsightsGetInputSchema, InsightsGetResponseSchema } from './types';

export const getLiveInsights: MicrosoftClarityEndpoints['insightsGet'] = async (
	ctx,
	input,
) => {
	const parsed = InsightsGetInputSchema.parse(input);
	const response = InsightsGetResponseSchema.parse(
		await getInsights(ctx.key, parsed),
	);
	await logEventFromContext(
		ctx,
		'microsoftclarity.insights.get',
		{},
		'completed',
	);
	return response;
};
export * from './types';
