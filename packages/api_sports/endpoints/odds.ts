import { logEventFromContext } from 'corsair/core';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get Odds */
export const getOdds: ApiSportsEndpoints['getOdds'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getOdds;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getOdds']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.odds.getOdds', input ?? {}, 'completed');
	return response;
};

/** Get Odds Bets */
export const getOddsBets: ApiSportsEndpoints['getOddsBets'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getOddsBets;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getOddsBets']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.odds.getOddsBets', input ?? {}, 'completed');
	return response;
};

/** Get Odds Bookmakers */
export const getOddsBookmakers: ApiSportsEndpoints['getOddsBookmakers'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getOddsBookmakers;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getOddsBookmakers']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.odds.getOddsBookmakers', input ?? {}, 'completed');
	return response;
};

/** Get Odds Mapping */
export const getOddsMapping: ApiSportsEndpoints['getOddsMapping'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getOddsMapping;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getOddsMapping']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.odds.getOddsMapping', input ?? {}, 'completed');
	return response;
};

/** Get In-Play Odds */
export const getInPlayOdds: ApiSportsEndpoints['getInPlayOdds'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getInPlayOdds;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getInPlayOdds']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.odds.getInPlayOdds', input ?? {}, 'completed');
	return response;
};

/** Get Live Odds Bets */
export const getLiveOddsBets: ApiSportsEndpoints['getLiveOddsBets'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getLiveOddsBets;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getLiveOddsBets']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.odds.getLiveOddsBets', input ?? {}, 'completed');
	return response;
};
