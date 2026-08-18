import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheTeam } from './persist';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataRosterPlayer,
	CollegeFootballDataTeam,
	CollegeFootballDataTeamATSRecord,
	CollegeFootballDataTeamMatchup,
	CollegeFootballDataTeamRecord,
} from './types';

/** Lists teams, optionally filtered by conference/season. */
export const list: CollegeFootballDataEndpoints['teamsList'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataTeam[]>(
		ctx,
		'/teams',
		{ query: compactQuery({ conference: input.conference, year: input.year }) },
	);

	await Promise.all(
		(result ?? []).map((team) => cacheTeam(ctx.db?.teams, team)),
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.teams.list',
		auditPayload(input, ['conference', 'year']),
		'completed',
	);
	return result ?? [];
};

/** Lists FBS teams for a season. */
export const listFBS: CollegeFootballDataEndpoints['teamsListFBS'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataTeam[]>(
		ctx,
		'/teams/fbs',
		{ query: compactQuery({ year: input.year }) },
	);

	await Promise.all(
		(result ?? []).map((team) => cacheTeam(ctx.db?.teams, team)),
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.teams.listFBS',
		auditPayload(input, ['year']),
		'completed',
	);
	return result ?? [];
};

/**
 * Lists FCS teams for a season/conference.
 *
 * There is no `/teams/fcs` route. OpenAPI 5.24.0 `GET /teams` only
 * documents `conference` and `year`; a live `classification=fcs` query is
 * ignored. Filter to `classification === 'fcs'` after the call.
 */
export const listFCS: CollegeFootballDataEndpoints['teamsListFCS'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataTeam[]>(
		ctx,
		'/teams',
		{ query: compactQuery({ conference: input.conference, year: input.year }) },
	);

	const fcsTeams = (result ?? []).filter(
		(team) => team.classification === 'fcs',
	);
	await Promise.all(fcsTeams.map((team) => cacheTeam(ctx.db?.teams, team)));

	await logEventFromContext(
		ctx,
		'collegefootballdata.teams.listFCS',
		auditPayload(input, ['conference', 'year']),
		'completed',
	);
	return fcsTeams;
};

/** Gets against-the-spread (ATS) summary by team. */
export const getATSRecords: CollegeFootballDataEndpoints['teamsGetATSRecords'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataTeamATSRecord[]
		>(ctx, '/teams/ats', {
			query: compactQuery({
				year: input.year,
				team: input.team,
				conference: input.conference,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.teams.getATSRecords',
			auditPayload(input, ['year', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets head-to-head matchup history between two teams. */
export const getMatchup: CollegeFootballDataEndpoints['teamsGetMatchup'] =
	async (ctx, input) => {
		const result =
			await collegeFootballDataCall<CollegeFootballDataTeamMatchup>(
				ctx,
				'/teams/matchup',
				{
					query: compactQuery({
						team1: input.team1,
						team2: input.team2,
						minYear: input.minYear,
						maxYear: input.maxYear,
					}),
				},
			);

		await logEventFromContext(
			ctx,
			'collegefootballdata.teams.getMatchup',
			auditPayload(input, ['team1', 'team2']),
			'completed',
		);
		return result;
	};

/** Gets team win-loss records for a season. */
export const getRecords: CollegeFootballDataEndpoints['teamsGetRecords'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataTeamRecord[]
		>(ctx, '/records', {
			query: compactQuery({
				year: input.year,
				team: input.team,
				conference: input.conference,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.teams.getRecords',
			auditPayload(input, ['year', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets a team's roster for a season. */
export const getRoster: CollegeFootballDataEndpoints['teamsGetRoster'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<
		CollegeFootballDataRosterPlayer[]
	>(ctx, '/roster', {
		query: compactQuery({
			team: input.team,
			year: input.year,
			classification: input.classification,
		}),
	});

	await logEventFromContext(
		ctx,
		'collegefootballdata.teams.getRoster',
		auditPayload(input, ['team', 'year']),
		'completed',
	);
	return result ?? [];
};
