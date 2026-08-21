import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataPlay,
	CollegeFootballDataPlayStat,
	CollegeFootballDataPlayType,
} from './types';

/** Gets play-by-play data for games. */
export const list: CollegeFootballDataEndpoints['playsList'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataPlay[]>(
		ctx,
		'/plays',
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
				playType: input.playType,
				classification: input.classification,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.plays.list',
		auditPayload(input, ['year', 'week', 'team']),
		'completed',
	);
	return result ?? [];
};

/**
 * Gets player-level statistics tied to individual plays. Confirmed live:
 * `gameId`/`statTypeId` are the real filters - `playType` is not a
 * documented parameter for this route and is silently ignored by the API.
 */
export const listStats: CollegeFootballDataEndpoints['playsListStats'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataPlayStat[]>(
		ctx,
		'/plays/stats',
		{
			query: compactQuery({
				year: input.year,
				week: input.week,
				team: input.team,
				conference: input.conference,
				seasonType: input.seasonType,
				gameId: input.gameId,
				statTypeId: input.statTypeId,
				athleteId: input.athleteId,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.plays.listStats',
		auditPayload(input, ['year', 'week', 'team']),
		'completed',
	);
	return result ?? [];
};

/** Gets the catalog of play-level stat type definitions. */
export const listStatTypes: CollegeFootballDataEndpoints['playsListStatTypes'] =
	async (ctx) => {
		const result = await collegeFootballDataCall<CollegeFootballDataPlayType[]>(
			ctx,
			'/plays/stats/types',
		);

		await logEventFromContext(
			ctx,
			'collegefootballdata.plays.listStatTypes',
			{},
			'completed',
		);
		return result ?? [];
	};

/** Gets the catalog of available play types. */
export const listTypes: CollegeFootballDataEndpoints['playsListTypes'] = async (
	ctx,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataPlayType[]>(
		ctx,
		'/plays/types',
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.plays.listTypes',
		{},
		'completed',
	);
	return result ?? [];
};
