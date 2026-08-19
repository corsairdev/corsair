import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type { CollegeFootballDataRankingWeek } from './types';

/** Gets poll rankings (AP Top 25, Coaches Poll, Playoff Committee, and more) by season. */
export const list: CollegeFootballDataEndpoints['rankingsList'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<
		CollegeFootballDataRankingWeek[]
	>(ctx, '/rankings', {
		query: compactQuery({
			year: input.year,
			seasonType: input.seasonType,
			week: input.week,
		}),
	});

	await logEventFromContext(
		ctx,
		'collegefootballdata.rankings.list',
		auditPayload(input, ['year', 'week']),
		'completed',
	);
	return result ?? [];
};
