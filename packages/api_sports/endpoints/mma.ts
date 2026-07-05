import { logEventFromContext } from 'corsair/core';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get MMA Categories */
export const getMmaCategories: ApiSportsEndpoints['getMmaCategories'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getMmaCategories;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getMmaCategories']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.mma.getMmaCategories', input ?? {}, 'completed');
	return response;
};

/** Get MMA Fighters */
export const getMmaFighters: ApiSportsEndpoints['getMmaFighters'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getMmaFighters;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getMmaFighters']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.mma.getMmaFighters', input ?? {}, 'completed');
	return response;
};

/** Get MMA Fights */
export const getMmaFights: ApiSportsEndpoints['getMmaFights'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getMmaFights;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getMmaFights']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.mma.getMmaFights', input ?? {}, 'completed');
	return response;
};

/** Get MMA Fight Results */
export const getMmaFightResults: ApiSportsEndpoints['getMmaFightResults'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getMmaFightResults;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getMmaFightResults']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.mma.getMmaFightResults', input ?? {}, 'completed');
	return response;
};

/** Get MMA Fighter Statistics */
export const getMmaFighterStatistics: ApiSportsEndpoints['getMmaFighterStatistics'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getMmaFighterStatistics;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getMmaFighterStatistics']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.mma.getMmaFighterStatistics', input ?? {}, 'completed');
	return response;
};

/** Get Fighters Records */
export const getFightersRecords: ApiSportsEndpoints['getFightersRecords'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFightersRecords;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFightersRecords']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.mma.getFightersRecords', input ?? {}, 'completed');
	return response;
};
