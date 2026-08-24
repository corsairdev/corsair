import { logEventFromContext } from 'corsair/core';
import type { ApiSportsEndpoints } from '../index';
import { API_SPORTS_ROUTES } from './routes';
import { executeApiSportsRequest } from './shared';
import type { ApiSportsEndpointOutputs } from './types';

/** Get Basketball Statistics */
export const getBasketballStatistics: ApiSportsEndpoints['getBasketballStatistics'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getBasketballStatistics;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getBasketballStatistics']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.basketball.getBasketballStatistics',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Basketball Bets */
export const getBasketballBets: ApiSportsEndpoints['getBasketballBets'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getBasketballBets;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getBasketballBets']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.basketball.getBasketballBets',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Basketball Bookmakers */
export const getBasketballBookmakers: ApiSportsEndpoints['getBasketballBookmakers'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getBasketballBookmakers;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getBasketballBookmakers']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.basketball.getBasketballBookmakers',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get NBA Game Statistics */
export const getNbaGameStatistics: ApiSportsEndpoints['getNbaGameStatistics'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getNbaGameStatistics;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getNbaGameStatistics']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.basketball.getNbaGameStatistics',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Player Statistics */
export const getPlayerStatistics: ApiSportsEndpoints['getPlayerStatistics'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getPlayerStatistics;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getPlayerStatistics']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.basketball.getPlayerStatistics',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Game Statistics by Teams */
export const getGameStatisticsByTeams: ApiSportsEndpoints['getGameStatisticsByTeams'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getGameStatisticsByTeams;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getGameStatisticsByTeams']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.basketball.getGameStatisticsByTeams',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Games Events */
export const getGamesEvents: ApiSportsEndpoints['getGamesEvents'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getGamesEvents;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getGamesEvents']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.basketball.getGamesEvents',
		input ?? {},
		'completed',
	);
	return response;
};
