import { logEventFromContext } from 'corsair/core';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get AFL Seasons */
export const getAflSeasons: ApiSportsEndpoints['getAflSeasons'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getAflSeasons;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getAflSeasons']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.afl.getAflSeasons', input ?? {}, 'completed');
	return response;
};

/** Get AFL Games */
export const getAflGames: ApiSportsEndpoints['getAflGames'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getAflGames;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getAflGames']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.afl.getAflGames', input ?? {}, 'completed');
	return response;
};

/** Get AFL Games Quarters */
export const getAflGamesQuarters: ApiSportsEndpoints['getAflGamesQuarters'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getAflGamesQuarters;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getAflGamesQuarters']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.afl.getAflGamesQuarters', input ?? {}, 'completed');
	return response;
};

/** Get AFL Game Player Statistics */
export const getAflGamePlayerStatistics: ApiSportsEndpoints['getAflGamePlayerStatistics'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getAflGamePlayerStatistics;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getAflGamePlayerStatistics']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.afl.getAflGamePlayerStatistics', input ?? {}, 'completed');
	return response;
};

/** Get AFL Standings */
export const getAflStandings: ApiSportsEndpoints['getAflStandings'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getAflStandings;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getAflStandings']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.afl.getAflStandings', input ?? {}, 'completed');
	return response;
};
