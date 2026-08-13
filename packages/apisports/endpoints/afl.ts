import { logEventFromContext } from 'corsair/core';
import type { ApiSportsEndpoints } from '../index';
import { API_SPORTS_ROUTES } from './routes';
import { executeApiSportsRequest } from './shared';
import type { ApiSportsEndpointOutputs } from './types';

/** Get AFL Seasons */
export const getAflSeasons: ApiSportsEndpoints['getAflSeasons'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getAflSeasons;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getAflSeasons']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.afl.getAflSeasons',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get AFL Games */
export const getAflGames: ApiSportsEndpoints['getAflGames'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getAflGames;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getAflGames']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.afl.getAflGames',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get AFL Games Quarters */
export const getAflGamesQuarters: ApiSportsEndpoints['getAflGamesQuarters'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getAflGamesQuarters;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getAflGamesQuarters']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.afl.getAflGamesQuarters',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get AFL Game Player Statistics */
export const getAflGamePlayerStatistics: ApiSportsEndpoints['getAflGamePlayerStatistics'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getAflGamePlayerStatistics;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getAflGamePlayerStatistics']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.afl.getAflGamePlayerStatistics',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get AFL Standings */
export const getAflStandings: ApiSportsEndpoints['getAflStandings'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getAflStandings;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getAflStandings']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.afl.getAflStandings',
		input ?? {},
		'completed',
	);
	return response;
};
