import { logEventFromContext } from 'corsair/core';
import type { ApiSportsEndpoints } from '../index';
import { API_SPORTS_ROUTES } from './routes';
import { executeApiSportsRequest } from './shared';
import type { ApiSportsEndpointOutputs } from './types';

/** Get Formula 1 Circuits */
export const getFormula1Circuits: ApiSportsEndpoints['getFormula1Circuits'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getFormula1Circuits;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getFormula1Circuits']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.formula1.getFormula1Circuits',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Formula 1 Competitions */
export const getFormula1Competitions: ApiSportsEndpoints['getFormula1Competitions'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getFormula1Competitions;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getFormula1Competitions']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.formula1.getFormula1Competitions',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Formula 1 Races */
export const getFormula1Races: ApiSportsEndpoints['getFormula1Races'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getFormula1Races;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getFormula1Races']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.formula1.getFormula1Races',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Formula 1 Driver Rankings */
export const getFormula1DriverRankings: ApiSportsEndpoints['getFormula1DriverRankings'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getFormula1DriverRankings;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getFormula1DriverRankings']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.formula1.getFormula1DriverRankings',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Formula 1 Team Rankings */
export const getFormula1TeamRankings: ApiSportsEndpoints['getFormula1TeamRankings'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getFormula1TeamRankings;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getFormula1TeamRankings']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.formula1.getFormula1TeamRankings',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Formula 1 Starting Grid */
export const getFormula1StartingGrid: ApiSportsEndpoints['getFormula1StartingGrid'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getFormula1StartingGrid;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getFormula1StartingGrid']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.formula1.getFormula1StartingGrid',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Fastest Laps Rankings */
export const getFastestLapsRankings: ApiSportsEndpoints['getFastestLapsRankings'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getFastestLapsRankings;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getFastestLapsRankings']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.formula1.getFastestLapsRankings',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Race Rankings */
export const getRaceRankings: ApiSportsEndpoints['getRaceRankings'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getRaceRankings;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getRaceRankings']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.formula1.getRaceRankings',
		input ?? {},
		'completed',
	);
	return response;
};
