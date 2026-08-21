import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataAdvancedStats,
	CollegeFootballDataGameHavocStats,
	CollegeFootballDataPlayerSeasonStat,
	CollegeFootballDataTeamSeasonStat,
} from './types';

/** Gets the catalog of valid team statistical category names. */
export const listCategories: CollegeFootballDataEndpoints['statsListCategories'] =
	async (ctx) => {
		const result = await collegeFootballDataCall<string[]>(
			ctx,
			'/stats/categories',
		);

		await logEventFromContext(
			ctx,
			'collegefootballdata.stats.listCategories',
			{},
			'completed',
		);
		return result ?? [];
	};

/** Gets advanced team metrics at the game level (success rates, explosiveness, havoc). */
export const getAdvancedGameStats: CollegeFootballDataEndpoints['statsGetAdvancedGameStats'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataAdvancedStats[]
		>(ctx, '/stats/game/advanced', {
			query: compactQuery({
				year: input.year,
				week: input.week,
				team: input.team,
				opponent: input.opponent,
				seasonType: input.seasonType,
				excludeGarbageTime: input.excludeGarbageTime,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.stats.getAdvancedGameStats',
			auditPayload(input, ['year', 'week', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets havoc statistics aggregated by game. */
export const getGameHavocStats: CollegeFootballDataEndpoints['statsGetGameHavocStats'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataGameHavocStats[]
		>(ctx, '/stats/game/havoc', {
			query: compactQuery({
				year: input.year,
				week: input.week,
				team: input.team,
				opponent: input.opponent,
				seasonType: input.seasonType,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.stats.getGameHavocStats',
			auditPayload(input, ['year', 'week', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets aggregated season statistics for players. */
export const getPlayerSeasonStats: CollegeFootballDataEndpoints['statsGetPlayerSeasonStats'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataPlayerSeasonStat[]
		>(ctx, '/stats/player/season', {
			query: compactQuery({
				year: input.year,
				conference: input.conference,
				team: input.team,
				category: input.category,
				seasonType: input.seasonType,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.stats.getPlayerSeasonStats',
			auditPayload(input, ['year', 'team', 'category']),
			'completed',
		);
		return result ?? [];
	};

/** Gets basic season stats aggregated by team. At least one of `year` or `team` is required. */
export const getTeamSeasonStats: CollegeFootballDataEndpoints['statsGetTeamSeasonStats'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataTeamSeasonStat[]
		>(ctx, '/stats/season', {
			query: compactQuery({
				year: input.year,
				team: input.team,
				conference: input.conference,
				startWeek: input.startWeek,
				endWeek: input.endWeek,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.stats.getTeamSeasonStats',
			auditPayload(input, ['year', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets advanced season-level team statistics. At least one of `year` or `team` is required. */
export const getAdvancedSeasonStats: CollegeFootballDataEndpoints['statsGetAdvancedSeasonStats'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataAdvancedStats[]
		>(ctx, '/stats/season/advanced', {
			query: compactQuery({
				year: input.year,
				team: input.team,
				excludeGarbageTime: input.excludeGarbageTime,
				startWeek: input.startWeek,
				endWeek: input.endWeek,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.stats.getAdvancedSeasonStats',
			auditPayload(input, ['year', 'team']),
			'completed',
		);
		return result ?? [];
	};
