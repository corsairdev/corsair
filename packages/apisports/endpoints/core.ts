import { logEventFromContext } from 'corsair/core';
import type { ApiSportsEndpoints } from '../index';
import { API_SPORTS_ROUTES } from './routes';
import { executeApiSportsRequest } from './shared';
import type { ApiSportsEndpointOutputs } from './types';

/** Get Countries */
export const getCountries: ApiSportsEndpoints['getCountries'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getCountries;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getCountries']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getCountries',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Timezone */
export const getTimezone: ApiSportsEndpoints['getTimezone'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getTimezone;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getTimezone']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getTimezone',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Leagues */
export const getLeagues: ApiSportsEndpoints['getLeagues'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getLeagues;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getLeagues']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getLeagues',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get League Seasons */
export const getLeagueSeasons: ApiSportsEndpoints['getLeagueSeasons'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getLeagueSeasons;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getLeagueSeasons']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getLeagueSeasons',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Teams */
export const getTeams: ApiSportsEndpoints['getTeams'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getTeams;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getTeams']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getTeams',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Team Seasons */
export const getTeamSeasons: ApiSportsEndpoints['getTeamSeasons'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getTeamSeasons;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getTeamSeasons']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getTeamSeasons',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Team Statistics */
export const getTeamStatistics: ApiSportsEndpoints['getTeamStatistics'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getTeamStatistics;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getTeamStatistics']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.core.getTeamStatistics',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Venues */
export const getVenues: ApiSportsEndpoints['getVenues'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getVenues;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getVenues']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getVenues',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Coaches */
export const getCoaches: ApiSportsEndpoints['getCoaches'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getCoaches;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getCoaches']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getCoaches',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Injuries */
export const getInjuries: ApiSportsEndpoints['getInjuries'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getInjuries;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getInjuries']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getInjuries',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Sidelined */
export const getSidelined: ApiSportsEndpoints['getSidelined'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getSidelined;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getSidelined']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getSidelined',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Transfers */
export const getTransfers: ApiSportsEndpoints['getTransfers'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getTransfers;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getTransfers']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getTransfers',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Trophies */
export const getTrophies: ApiSportsEndpoints['getTrophies'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getTrophies;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getTrophies']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getTrophies',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Predictions */
export const getPredictions: ApiSportsEndpoints['getPredictions'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getPredictions;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getPredictions']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.core.getPredictions',
		input ?? {},
		'completed',
	);
	return response;
};
