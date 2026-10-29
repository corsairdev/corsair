import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type { CollegeFootballDataDrive } from './types';

/** Gets drive-level data (yards, results, scoring, elapsed time). */
export const list: CollegeFootballDataEndpoints['drivesList'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataDrive[]>(
		ctx,
		'/drives',
		{
			query: compactQuery({
				year: input.year,
				week: input.week,
				seasonType: input.seasonType,
				team: input.team,
				offense: input.offense,
				defense: input.defense,
				conference: input.conference,
				offenseConference: input.offenseConference,
				defenseConference: input.defenseConference,
				classification: input.classification,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.drives.list',
		auditPayload(input, ['year', 'week', 'team']),
		'completed',
	);
	return result ?? [];
};
