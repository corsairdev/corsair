import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataAdvancedBoxScore,
	CollegeFootballDataGame,
	CollegeFootballDataGameMedia,
	CollegeFootballDataGameTeamStats,
} from './types';

/**
 * Gets games/results for a season, week or specific game. `year` is
 * required unless `id` is specified (confirmed from the spec's own
 * parameter description). NCAA only - NFL and other sports return no data.
 */
export const getGamesAndResults: CollegeFootballDataEndpoints['gamesGetGamesAndResults'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<CollegeFootballDataGame[]>(
			ctx,
			'/games',
			{
				query: compactQuery({
					year: input.year,
					week: input.week,
					seasonType: input.seasonType,
					classification: input.classification,
					team: input.team,
					home: input.home,
					away: input.away,
					conference: input.conference,
					id: input.id,
				}),
			},
		);

		await logEventFromContext(
			ctx,
			'collegefootballdata.games.getGamesAndResults',
			auditPayload(input, ['year', 'week', 'team', 'id']),
			'completed',
		);
		return result ?? [];
	};

/** Gets broadcast/media information for games. */
export const getMedia: CollegeFootballDataEndpoints['gamesGetMedia'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<CollegeFootballDataGameMedia[]>(
		ctx,
		'/games/media',
		{
			query: compactQuery({
				year: input.year,
				week: input.week,
				seasonType: input.seasonType,
				team: input.team,
				conference: input.conference,
				classification: input.classification,
				mediaType: input.mediaType,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'collegefootballdata.games.getMedia',
		auditPayload(input, ['year', 'week', 'team']),
		'completed',
	);
	return result ?? [];
};

/** Gets team-level box score stats for games. */
export const getTeamStats: CollegeFootballDataEndpoints['gamesGetTeamStats'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataGameTeamStats[]
		>(ctx, '/games/teams', {
			query: compactQuery({
				year: input.year,
				week: input.week,
				team: input.team,
				conference: input.conference,
				classification: input.classification,
				seasonType: input.seasonType,
				id: input.id,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.games.getTeamStats',
			auditPayload(input, ['year', 'week', 'team', 'id']),
			'completed',
		);
		return result ?? [];
	};

/**
 * Gets player-level stats for games. `year` plus at least one of `week`,
 * `team` or `conference` is required (confirmed from the spec's own
 * parameter descriptions).
 */
export const getPlayerStats: CollegeFootballDataEndpoints['gamesGetPlayerStats'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataGameTeamStats[]
		>(ctx, '/games/players', {
			query: compactQuery({
				year: input.year,
				week: input.week,
				team: input.team,
				conference: input.conference,
				classification: input.classification,
				seasonType: input.seasonType,
				category: input.category,
				id: input.id,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.games.getPlayerStats',
			auditPayload(input, ['year', 'week', 'team', 'id']),
			'completed',
		);
		return result ?? [];
	};

/**
 * Gets advanced analytics for a single game (PPA, success rates, havoc,
 * win probabilities, quarter-by-quarter breakdown). Confirmed live: the
 * query param is `id`, not `gameId` like `metrics.getWinProbability` -
 * these two "get by game" operations use different parameter names on the
 * same provider.
 */
export const getAdvancedBoxScore: CollegeFootballDataEndpoints['gamesGetAdvancedBoxScore'] =
	async (ctx, input) => {
		const result =
			await collegeFootballDataCall<CollegeFootballDataAdvancedBoxScore>(
				ctx,
				'/game/box/advanced',
				{ query: { id: input.id } },
			);

		await logEventFromContext(
			ctx,
			'collegefootballdata.games.getAdvancedBoxScore',
			auditPayload(input, ['id']),
			'completed',
		);
		return result;
	};
