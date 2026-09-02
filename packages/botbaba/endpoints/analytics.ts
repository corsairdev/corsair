import { logEventFromContext } from 'corsair/core';
import type { BotbabaEndpoints } from '../index';
import { auditPayload } from './logging';
import { botbabaCall, compactQuery } from './shared';
import type { BotbabaAnalyticsSummary } from './types';

/** Fetches analytics summary for a bot. */
export const getSummary: BotbabaEndpoints['analyticsGetSummary'] = async (
	ctx,
	input,
) => {
	const result = await botbabaCall<{ summary: BotbabaAnalyticsSummary }>(
		ctx,
		`/v1/bots/${encodeURIComponent(input.botId)}/analytics`,
		{
			query: compactQuery({
				period: input.period,
				startDate: input.startDate,
				endDate: input.endDate,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'botbaba.analytics.getSummary',
		auditPayload(input, ['botId']),
		'completed',
	);
	return result.summary;
};
