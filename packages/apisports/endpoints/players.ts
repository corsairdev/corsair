import { logEventFromContext } from 'corsair/core';
import type { ApiSportsEndpoints } from '../index';
import { API_SPORTS_ROUTES } from './routes';
import { executeApiSportsRequest } from './shared';
import type { ApiSportsEndpointOutputs } from './types';

/** Get Players */
export const getPlayers: ApiSportsEndpoints['getPlayers'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getPlayers;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getPlayers']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.players.getPlayers',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Players Profiles */
export const getPlayersProfiles: ApiSportsEndpoints['getPlayersProfiles'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getPlayersProfiles;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getPlayersProfiles']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.players.getPlayersProfiles',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Players Seasons */
export const getPlayersSeasons: ApiSportsEndpoints['getPlayersSeasons'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getPlayersSeasons;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getPlayersSeasons']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.players.getPlayersSeasons',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Players Squads */
export const getPlayersSquads: ApiSportsEndpoints['getPlayersSquads'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getPlayersSquads;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getPlayersSquads']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.players.getPlayersSquads',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Players Teams */
export const getPlayersTeams: ApiSportsEndpoints['getPlayersTeams'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getPlayersTeams;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getPlayersTeams']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.players.getPlayersTeams',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Players Top Scorers */
export const getPlayersTopScorers: ApiSportsEndpoints['getPlayersTopScorers'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getPlayersTopScorers;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getPlayersTopScorers']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.players.getPlayersTopScorers',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Players Top Assists */
export const getPlayersTopAssists: ApiSportsEndpoints['getPlayersTopAssists'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getPlayersTopAssists;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getPlayersTopAssists']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.players.getPlayersTopAssists',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Players Top Yellow Cards */
export const getPlayersTopYellowCards: ApiSportsEndpoints['getPlayersTopYellowCards'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getPlayersTopYellowCards;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getPlayersTopYellowCards']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.players.getPlayersTopYellowCards',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Players Top Red Cards */
export const getPlayersTopRedCards: ApiSportsEndpoints['getPlayersTopRedCards'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getPlayersTopRedCards;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getPlayersTopRedCards']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.players.getPlayersTopRedCards',
			input ?? {},
			'completed',
		);
		return response;
	};
