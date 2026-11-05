import { logEventFromContext } from 'corsair/core';
import type { ApiSportsEndpoints } from '../index';
import { API_SPORTS_ROUTES } from './routes';
import { executeApiSportsRequest } from './shared';
import type { ApiSportsEndpointOutputs } from './types';

/** Get MMA Categories */
export const getMmaCategories: ApiSportsEndpoints['getMmaCategories'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getMmaCategories;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getMmaCategories']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.mma.getMmaCategories',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get MMA Fighters */
export const getMmaFighters: ApiSportsEndpoints['getMmaFighters'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getMmaFighters;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getMmaFighters']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.mma.getMmaFighters',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get MMA Fights */
export const getMmaFights: ApiSportsEndpoints['getMmaFights'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getMmaFights;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getMmaFights']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.mma.getMmaFights',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get MMA Fight Results */
export const getMmaFightResults: ApiSportsEndpoints['getMmaFightResults'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getMmaFightResults;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getMmaFightResults']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.mma.getMmaFightResults',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get MMA Fighter Statistics */
export const getMmaFighterStatistics: ApiSportsEndpoints['getMmaFighterStatistics'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getMmaFighterStatistics;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getMmaFighterStatistics']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.mma.getMmaFighterStatistics',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Fighters Records */
export const getFightersRecords: ApiSportsEndpoints['getFightersRecords'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getFightersRecords;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getFightersRecords']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.mma.getFightersRecords',
			input ?? {},
			'completed',
		);
		return response;
	};
