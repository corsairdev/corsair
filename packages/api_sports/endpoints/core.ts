import { logEventFromContext } from 'corsair/core';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get Countries */
export const getCountries: ApiSportsEndpoints['getCountries'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getCountries;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getCountries']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getCountries', input ?? {}, 'completed');
	return response;
};

/** Get Timezone */
export const getTimezone: ApiSportsEndpoints['getTimezone'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getTimezone;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getTimezone']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getTimezone', input ?? {}, 'completed');
	return response;
};

/** Get Leagues */
export const getLeagues: ApiSportsEndpoints['getLeagues'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getLeagues;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getLeagues']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getLeagues', input ?? {}, 'completed');
	return response;
};

/** Get League Seasons */
export const getLeagueSeasons: ApiSportsEndpoints['getLeagueSeasons'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getLeagueSeasons;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getLeagueSeasons']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getLeagueSeasons', input ?? {}, 'completed');
	return response;
};

/** Get Teams */
export const getTeams: ApiSportsEndpoints['getTeams'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getTeams;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getTeams']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getTeams', input ?? {}, 'completed');
	return response;
};

/** Get Team Seasons */
export const getTeamSeasons: ApiSportsEndpoints['getTeamSeasons'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getTeamSeasons;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getTeamSeasons']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getTeamSeasons', input ?? {}, 'completed');
	return response;
};

/** Get Team Statistics */
export const getTeamStatistics: ApiSportsEndpoints['getTeamStatistics'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getTeamStatistics;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getTeamStatistics']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getTeamStatistics', input ?? {}, 'completed');
	return response;
};

/** Get Venues */
export const getVenues: ApiSportsEndpoints['getVenues'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getVenues;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getVenues']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getVenues', input ?? {}, 'completed');
	return response;
};

/** Get Coaches */
export const getCoaches: ApiSportsEndpoints['getCoaches'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getCoaches;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getCoaches']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getCoaches', input ?? {}, 'completed');
	return response;
};

/** Get Injuries */
export const getInjuries: ApiSportsEndpoints['getInjuries'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getInjuries;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getInjuries']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getInjuries', input ?? {}, 'completed');
	return response;
};

/** Get Sidelined */
export const getSidelined: ApiSportsEndpoints['getSidelined'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getSidelined;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getSidelined']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getSidelined', input ?? {}, 'completed');
	return response;
};

/** Get Transfers */
export const getTransfers: ApiSportsEndpoints['getTransfers'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getTransfers;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getTransfers']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getTransfers', input ?? {}, 'completed');
	return response;
};

/** Get Trophies */
export const getTrophies: ApiSportsEndpoints['getTrophies'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getTrophies;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getTrophies']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getTrophies', input ?? {}, 'completed');
	return response;
};

/** Get Predictions */
export const getPredictions: ApiSportsEndpoints['getPredictions'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPredictions;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPredictions']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.core.getPredictions', input ?? {}, 'completed');
	return response;
};
