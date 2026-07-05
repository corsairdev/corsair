import { logEventFromContext } from 'corsair/core';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get Basketball Statistics */
export const getBasketballStatistics: ApiSportsEndpoints['getBasketballStatistics'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getBasketballStatistics;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getBasketballStatistics']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.basketball.getBasketballStatistics', input ?? {}, 'completed');
	return response;
};

/** Get Basketball Bets */
export const getBasketballBets: ApiSportsEndpoints['getBasketballBets'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getBasketballBets;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getBasketballBets']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.basketball.getBasketballBets', input ?? {}, 'completed');
	return response;
};

/** Get Basketball Bookmakers */
export const getBasketballBookmakers: ApiSportsEndpoints['getBasketballBookmakers'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getBasketballBookmakers;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getBasketballBookmakers']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.basketball.getBasketballBookmakers', input ?? {}, 'completed');
	return response;
};

/** Get NBA Game Statistics */
export const getNbaGameStatistics: ApiSportsEndpoints['getNbaGameStatistics'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getNbaGameStatistics;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getNbaGameStatistics']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.basketball.getNbaGameStatistics', input ?? {}, 'completed');
	return response;
};

/** Get Player Statistics */
export const getPlayerStatistics: ApiSportsEndpoints['getPlayerStatistics'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPlayerStatistics;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPlayerStatistics']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.basketball.getPlayerStatistics', input ?? {}, 'completed');
	return response;
};

/** Get Game Statistics by Teams */
export const getGameStatisticsByTeams: ApiSportsEndpoints['getGameStatisticsByTeams'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getGameStatisticsByTeams;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getGameStatisticsByTeams']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.basketball.getGameStatisticsByTeams', input ?? {}, 'completed');
	return response;
};

/** Get Games Events */
export const getGamesEvents: ApiSportsEndpoints['getGamesEvents'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getGamesEvents;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getGamesEvents']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.basketball.getGamesEvents', input ?? {}, 'completed');
	return response;
};
