import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheCoach } from './persist';
import { collegeFootballDataCall, compactQuery } from './shared';
import type { CollegeFootballDataCoach } from './types';

/** Lists coaching records, season by season, per the spec: "historical head coach records". */
export const list: CollegeFootballDataEndpoints['coachesList'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataCoach[]>(
		ctx,
		'/coaches',
		{
			query: compactQuery({
				firstName: input.firstName,
				lastName: input.lastName,
				team: input.team,
				year: input.year,
				minYear: input.minYear,
				maxYear: input.maxYear,
			}),
		},
	);

	await Promise.all(
		(result ?? []).map((coach) => cacheCoach(ctx.db?.coaches, coach)),
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.coaches.list',
		auditPayload(input, ['team', 'year']),
		'completed',
	);
	return result ?? [];
};
