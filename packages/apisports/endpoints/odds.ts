import { logEventFromContext } from 'corsair/core';
import type { ApiSportsEndpoints } from '../index';
import { API_SPORTS_ROUTES } from './routes';
import { executeApiSportsRequest } from './shared';
import type { ApiSportsEndpointOutputs } from './types';

/** Get Odds */
export const getOdds: ApiSportsEndpoints['getOdds'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getOdds;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getOdds']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.odds.getOdds',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Odds Bets */
export const getOddsBets: ApiSportsEndpoints['getOddsBets'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getOddsBets;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getOddsBets']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.odds.getOddsBets',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Odds Bookmakers */
export const getOddsBookmakers: ApiSportsEndpoints['getOddsBookmakers'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getOddsBookmakers;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getOddsBookmakers']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.odds.getOddsBookmakers',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Odds Mapping */
export const getOddsMapping: ApiSportsEndpoints['getOddsMapping'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getOddsMapping;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getOddsMapping']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.odds.getOddsMapping',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get In-Play Odds */
export const getInPlayOdds: ApiSportsEndpoints['getInPlayOdds'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getInPlayOdds;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getInPlayOdds']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.odds.getInPlayOdds',
		input ?? {},
		'completed',
	);
	return response;
};

/** Get Live Odds Bets */
export const getLiveOddsBets: ApiSportsEndpoints['getLiveOddsBets'] = async (
	ctx,
	input,
) => {
	const route = API_SPORTS_ROUTES.getLiveOddsBets;
	const response = await executeApiSportsRequest<
		ApiSportsEndpointOutputs['getLiveOddsBets']
	>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
	await logEventFromContext(
		ctx,
		'apisports.odds.getLiveOddsBets',
		input ?? {},
		'completed',
	);
	return response;
};
