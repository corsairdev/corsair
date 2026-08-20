import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { auditPayload } from './logging';
import { collegeFootballDataCall, compactQuery } from './shared';
import type {
	CollegeFootballDataPlayerSearchResult,
	CollegeFootballDataPlayerUsage,
	CollegeFootballDataReturningProduction,
	CollegeFootballDataTransferPortalEntry,
} from './types';

/**
 * Searches for players by name. Returns up to 100 results.
 *
 * `searchTerm` is never logged raw - it is free text a caller typed, not a
 * structural identifier.
 */
export const search: CollegeFootballDataEndpoints['playersSearch'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<
		CollegeFootballDataPlayerSearchResult[]
	>(ctx, '/player/search', {
		query: compactQuery({
			searchTerm: input.searchTerm,
			position: input.position,
			team: input.team,
			year: input.year,
		}),
	});

	await logEventFromContext(
		ctx,
		'collegefootballdata.players.search',
		auditPayload(input, ['team', 'year']),
		'completed',
	);
	return result ?? [];
};

/** Gets player usage rates for a season. */
export const getUsage: CollegeFootballDataEndpoints['playersGetUsage'] = async (
	ctx,
	input,
) => {
	const result = await collegeFootballDataCall<
		CollegeFootballDataPlayerUsage[]
	>(ctx, '/player/usage', {
		query: compactQuery({
			year: input.year,
			conference: input.conference,
			position: input.position,
			team: input.team,
			playerId: input.playerId,
			excludeGarbageTime: input.excludeGarbageTime,
		}),
	});

	await logEventFromContext(
		ctx,
		'collegefootballdata.players.getUsage',
		auditPayload(input, ['year', 'team']),
		'completed',
	);
	return result ?? [];
};

/** Gets Bill Connelly-style returning production splits by team. */
export const getReturningProduction: CollegeFootballDataEndpoints['playersGetReturningProduction'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataReturningProduction[]
		>(ctx, '/player/returning', {
			query: compactQuery({
				year: input.year,
				team: input.team,
				conference: input.conference,
			}),
		});

		await logEventFromContext(
			ctx,
			'collegefootballdata.players.getReturningProduction',
			auditPayload(input, ['year', 'team']),
			'completed',
		);
		return result ?? [];
	};

/** Gets transfer portal entries for a season. Data available from 2021 onwards. */
export const listTransferPortal: CollegeFootballDataEndpoints['playersListTransferPortal'] =
	async (ctx, input) => {
		const result = await collegeFootballDataCall<
			CollegeFootballDataTransferPortalEntry[]
		>(ctx, '/player/portal', { query: { year: input.year } });

		await logEventFromContext(
			ctx,
			'collegefootballdata.players.listTransferPortal',
			auditPayload(input, ['year']),
			'completed',
		);
		return result ?? [];
	};
