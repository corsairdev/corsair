import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataDraftPick,
	CollegeFootballDataDraftPosition,
	CollegeFootballDataDraftTeam,
} from './types';

/** Lists NFL draft picks. */
export const listPicks: CollegeFootballDataEndpoints['draftListPicks'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataDraftPick[]>(
		ctx,
		'/draft/picks',
		{
			query: compactQuery({
				year: input.year,
				team: input.team,
				school: input.school,
				conference: input.conference,
				position: input.position,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.draft.listPicks',
		auditPayload(input, ['year', 'school']),
		'completed',
	);
	return result ?? [];
};

/** Gets the standardized list of NFL draft positions. */
export const listPositions: CollegeFootballDataEndpoints['draftListPositions'] =
	async (ctx) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataDraftPosition[]
		>(ctx, '/draft/positions');

		await logEventFromContext(
			ctx,
			'collegefootballdata.draft.listPositions',
			{},
			'completed',
		);
		return result ?? [];
	};

/** Lists NFL teams used in draft endpoints. */
export const listTeams: CollegeFootballDataEndpoints['draftListTeams'] = async (
	ctx,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataDraftTeam[]>(
		ctx,
		'/draft/teams',
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.draft.listTeams',
		{},
		'completed',
	);
	return result ?? [];
};
