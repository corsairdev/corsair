import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataRecruit,
	CollegeFootballDataRecruitingGroup,
	CollegeFootballDataTeamRecruitingRanking,
	CollegeFootballDataTeamTalent,
} from './types';

/** Gets recruit rankings. At least one of `year` or `team` is required. */
export const listRecruits: CollegeFootballDataEndpoints['recruitingListRecruits'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<CollegeFootballDataRecruit[]>(
			ctx,
			'/recruiting/players',
			{
				query: compactQuery({
					year: input.year,
					team: input.team,
					classification: input.classification,
					position: input.position,
					state: input.state,
				}),
			},
		);

		await logEventFromContext(
			ctx,
			'collegefootballdata.recruiting.listRecruits',
			auditPayload(input, ['year', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets team recruiting class rankings. */
export const getTeamRankings: CollegeFootballDataEndpoints['recruitingGetTeamRankings'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataTeamRecruitingRanking[]
		>(ctx, '/recruiting/teams', {
			query: compactQuery({ year: input.year, team: input.team }),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.recruiting.getTeamRankings',
			auditPayload(input, ['year', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets recruiting data grouped by position group. */
export const getGroupRatings: CollegeFootballDataEndpoints['recruitingGetGroupRatings'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataRecruitingGroup[]
		>(ctx, '/recruiting/groups', {
			query: compactQuery({
				team: input.team,
				conference: input.conference,
				recruitType: input.recruitType,
				startYear: input.startYear,
				endYear: input.endYear,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.recruiting.getGroupRatings',
			auditPayload(input, ['team', 'conference']),
			'completed',
		);
		return result ?? [];
	};

/** Gets 247Sports composite team talent rankings for a season. */
export const getTeamTalent: CollegeFootballDataEndpoints['recruitingGetTeamTalent'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataTeamTalent[]
		>(ctx, '/talent', { query: compactQuery({ year: input.year }) });

		await logEventFromContext(
			ctx,
			'collegefootballdata.recruiting.getTeamTalent',
			auditPayload(input, ['year']),
			'completed',
		);
		return result ?? [];
	};
