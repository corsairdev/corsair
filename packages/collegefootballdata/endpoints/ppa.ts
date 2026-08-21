import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataPlayerGamePPA,
	CollegeFootballDataPlayerSeasonPPA,
	CollegeFootballDataPredictedPoints,
	CollegeFootballDataTeamGamePPA,
	CollegeFootballDataTeamPPA,
} from './types';

/** Gets team PPA (Predicted Points Added) aggregated by season. */
export const getByTeamSeason: CollegeFootballDataEndpoints['ppaGetByTeamSeason'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<CollegeFootballDataTeamPPA[]>(
			ctx,
			'/ppa/teams',
			{
				query: compactQuery({
					year: input.year,
					team: input.team,
					conference: input.conference,
					excludeGarbageTime: input.excludeGarbageTime,
				}),
			},
		);

		await logEventFromContext(
			ctx,
			'collegefootballdata.ppa.getByTeamSeason',
			auditPayload(input, ['year', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets team PPA by game. `year` is required. */
export const getByTeamGame: CollegeFootballDataEndpoints['ppaGetByTeamGame'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataTeamGamePPA[]
		>(ctx, '/ppa/games', {
			query: compactQuery({
				year: input.year,
				week: input.week,
				team: input.team,
				conference: input.conference,
				seasonType: input.seasonType,
				excludeGarbageTime: input.excludeGarbageTime,
				classification: input.classification,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.ppa.getByTeamGame',
			auditPayload(input, ['year', 'week', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets player PPA aggregated by season. `year` required unless `playerId` is specified. */
export const getByPlayerSeason: CollegeFootballDataEndpoints['ppaGetByPlayerSeason'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataPlayerSeasonPPA[]
		>(ctx, '/ppa/players/season', {
			query: compactQuery({
				year: input.year,
				conference: input.conference,
				team: input.team,
				position: input.position,
				playerId: input.playerId,
				threshold: input.threshold,
				excludeGarbageTime: input.excludeGarbageTime,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.ppa.getByPlayerSeason',
			auditPayload(input, ['year', 'team', 'playerId']),
			'completed',
		);
		return result ?? [];
	};

/** Gets player PPA by game. Either `week` or `team` must be specified. */
export const getByPlayerGame: CollegeFootballDataEndpoints['ppaGetByPlayerGame'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataPlayerGamePPA[]
		>(ctx, '/ppa/players/games', {
			query: compactQuery({
				year: input.year,
				week: input.week,
				seasonType: input.seasonType,
				team: input.team,
				position: input.position,
				playerId: input.playerId,
				threshold: input.threshold,
				excludeGarbageTime: input.excludeGarbageTime,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.ppa.getByPlayerGame',
			auditPayload(input, ['year', 'week', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets static expected-points model data for a down/distance across all field positions. */
export const getPredictedPoints: CollegeFootballDataEndpoints['ppaGetPredictedPoints'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataPredictedPoints[]
		>(ctx, '/ppa/predicted', {
			query: { down: input.down, distance: input.distance },
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.ppa.getPredictedPoints',
			auditPayload(input, ['down', 'distance']),
			'completed',
		);
		return result ?? [];
	};
