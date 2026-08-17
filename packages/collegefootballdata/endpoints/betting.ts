import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type { CollegeFootballDataBettingLineGame } from './types';

/** Gets betting lines and totals by game and provider. */
export const getLines: CollegeFootballDataEndpoints['bettingGetLines'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<
		CollegeFootballDataBettingLineGame[]
	>(ctx, '/lines', {
		query: compactQuery({
			year: input.year,
			seasonType: input.seasonType,
			week: input.week,
			team: input.team,
			conference: input.conference,
			classification: input.classification,
			provider: input.provider,
		}),
	});

	await logEventFromContext(
		ctx,
		'collegefootballdata.betting.getLines',
		auditPayload(input, ['year', 'week', 'team']),
		'completed',
	);
	return result ?? [];
};
