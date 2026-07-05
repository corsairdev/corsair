import { logEventFromContext } from 'corsair/core';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get Standings Stages */
export const getStandingsStages: ApiSportsEndpoints['getStandingsStages'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getStandingsStages;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getStandingsStages']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.standings.getStandingsStages', input ?? {}, 'completed');
	return response;
};

/** Get Standings Groups */
export const getStandingsGroups: ApiSportsEndpoints['getStandingsGroups'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getStandingsGroups;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getStandingsGroups']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.standings.getStandingsGroups', input ?? {}, 'completed');
	return response;
};

/** Get Standings Divisions */
export const getStandingsDivisions: ApiSportsEndpoints['getStandingsDivisions'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getStandingsDivisions;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getStandingsDivisions']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.standings.getStandingsDivisions', input ?? {}, 'completed');
	return response;
};

/** Get NFL Standings Conferences */
export const getNflStandingsConferences: ApiSportsEndpoints['getNflStandingsConferences'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getNflStandingsConferences;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getNflStandingsConferences']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.standings.getNflStandingsConferences', input ?? {}, 'completed');
	return response;
};
