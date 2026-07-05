import { logEventFromContext } from 'corsair/core';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get Players */
export const getPlayers: ApiSportsEndpoints['getPlayers'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPlayers;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPlayers']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.players.getPlayers', input ?? {}, 'completed');
	return response;
};

/** Get Players Profiles */
export const getPlayersProfiles: ApiSportsEndpoints['getPlayersProfiles'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPlayersProfiles;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPlayersProfiles']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.players.getPlayersProfiles', input ?? {}, 'completed');
	return response;
};

/** Get Players Seasons */
export const getPlayersSeasons: ApiSportsEndpoints['getPlayersSeasons'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPlayersSeasons;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPlayersSeasons']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.players.getPlayersSeasons', input ?? {}, 'completed');
	return response;
};

/** Get Players Squads */
export const getPlayersSquads: ApiSportsEndpoints['getPlayersSquads'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPlayersSquads;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPlayersSquads']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.players.getPlayersSquads', input ?? {}, 'completed');
	return response;
};

/** Get Players Teams */
export const getPlayersTeams: ApiSportsEndpoints['getPlayersTeams'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPlayersTeams;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPlayersTeams']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.players.getPlayersTeams', input ?? {}, 'completed');
	return response;
};

/** Get Players Top Scorers */
export const getPlayersTopScorers: ApiSportsEndpoints['getPlayersTopScorers'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPlayersTopScorers;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPlayersTopScorers']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.players.getPlayersTopScorers', input ?? {}, 'completed');
	return response;
};

/** Get Players Top Assists */
export const getPlayersTopAssists: ApiSportsEndpoints['getPlayersTopAssists'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPlayersTopAssists;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPlayersTopAssists']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.players.getPlayersTopAssists', input ?? {}, 'completed');
	return response;
};

/** Get Players Top Yellow Cards */
export const getPlayersTopYellowCards: ApiSportsEndpoints['getPlayersTopYellowCards'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPlayersTopYellowCards;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPlayersTopYellowCards']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.players.getPlayersTopYellowCards', input ?? {}, 'completed');
	return response;
};

/** Get Players Top Red Cards */
export const getPlayersTopRedCards: ApiSportsEndpoints['getPlayersTopRedCards'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getPlayersTopRedCards;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getPlayersTopRedCards']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.players.getPlayersTopRedCards', input ?? {}, 'completed');
	return response;
};
