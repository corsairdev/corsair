import { logEventFromContext } from 'corsair/core';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get Formula 1 Circuits */
export const getFormula1Circuits: ApiSportsEndpoints['getFormula1Circuits'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFormula1Circuits;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFormula1Circuits']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.formula1.getFormula1Circuits', input ?? {}, 'completed');
	return response;
};

/** Get Formula 1 Competitions */
export const getFormula1Competitions: ApiSportsEndpoints['getFormula1Competitions'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFormula1Competitions;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFormula1Competitions']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.formula1.getFormula1Competitions', input ?? {}, 'completed');
	return response;
};

/** Get Formula 1 Races */
export const getFormula1Races: ApiSportsEndpoints['getFormula1Races'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFormula1Races;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFormula1Races']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.formula1.getFormula1Races', input ?? {}, 'completed');
	return response;
};

/** Get Formula 1 Driver Rankings */
export const getFormula1DriverRankings: ApiSportsEndpoints['getFormula1DriverRankings'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFormula1DriverRankings;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFormula1DriverRankings']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.formula1.getFormula1DriverRankings', input ?? {}, 'completed');
	return response;
};

/** Get Formula 1 Team Rankings */
export const getFormula1TeamRankings: ApiSportsEndpoints['getFormula1TeamRankings'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFormula1TeamRankings;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFormula1TeamRankings']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.formula1.getFormula1TeamRankings', input ?? {}, 'completed');
	return response;
};

/** Get Formula 1 Starting Grid */
export const getFormula1StartingGrid: ApiSportsEndpoints['getFormula1StartingGrid'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFormula1StartingGrid;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFormula1StartingGrid']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.formula1.getFormula1StartingGrid', input ?? {}, 'completed');
	return response;
};

/** Get Fastest Laps Rankings */
export const getFastestLapsRankings: ApiSportsEndpoints['getFastestLapsRankings'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFastestLapsRankings;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFastestLapsRankings']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.formula1.getFastestLapsRankings', input ?? {}, 'completed');
	return response;
};

/** Get Race Rankings */
export const getRaceRankings: ApiSportsEndpoints['getRaceRankings'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getRaceRankings;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getRaceRankings']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.formula1.getRaceRankings', input ?? {}, 'completed');
	return response;
};
