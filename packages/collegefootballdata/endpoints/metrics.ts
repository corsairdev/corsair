import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataFieldGoalEP,
	CollegeFootballDataPregameWinProbability,
	CollegeFootballDataWinProbability,
} from './types';

/** Gets static field goal expected-points model data by distance. */
export const getFieldGoalExpectedPoints: CollegeFootballDataEndpoints['metricsGetFieldGoalExpectedPoints'] =
	async (ctx) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataFieldGoalEP[]
		>(ctx, '/metrics/fg/ep');

		await logEventFromContext(
			ctx,
			'collegefootballdata.metrics.getFieldGoalExpectedPoints',
			{},
			'completed',
		);
		return result ?? [];
	};

/**
 * Gets play-by-play win probabilities for a game. Confirmed live: the
 * query param is `gameId`, not `id` like `games.getAdvancedBoxScore`.
 */
export const getWinProbability: CollegeFootballDataEndpoints['metricsGetWinProbability'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataWinProbability[]
		>(ctx, '/metrics/wp', { query: { gameId: input.gameId } });

		await logEventFromContext(
			ctx,
			'collegefootballdata.metrics.getWinProbability',
			auditPayload(input, ['gameId']),
			'completed',
		);
		return result ?? [];
	};

/** Gets pregame win probabilities for games. */
export const getPregameWinProbabilities: CollegeFootballDataEndpoints['metricsGetPregameWinProbabilities'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataPregameWinProbability[]
		>(ctx, '/metrics/wp/pregame', {
			query: compactQuery({
				year: input.year,
				week: input.week,
				team: input.team,
				seasonType: input.seasonType,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.metrics.getPregameWinProbabilities',
			auditPayload(input, ['year', 'week', 'team', 'seasonType']),
			'completed',
		);
		return result ?? [];
	};
