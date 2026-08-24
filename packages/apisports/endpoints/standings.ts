import { logEventFromContext } from 'corsair/core';
import type { ApiSportsEndpoints } from '../index';
import { API_SPORTS_ROUTES } from './routes';
import { executeApiSportsRequest } from './shared';
import type { ApiSportsEndpointOutputs } from './types';

/** Get Standings Stages */
export const getStandingsStages: ApiSportsEndpoints['getStandingsStages'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getStandingsStages;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getStandingsStages']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.standings.getStandingsStages',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Standings Groups */
export const getStandingsGroups: ApiSportsEndpoints['getStandingsGroups'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getStandingsGroups;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getStandingsGroups']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.standings.getStandingsGroups',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get Standings Divisions */
export const getStandingsDivisions: ApiSportsEndpoints['getStandingsDivisions'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getStandingsDivisions;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getStandingsDivisions']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.standings.getStandingsDivisions',
			input ?? {},
			'completed',
		);
		return response;
	};

/** Get NFL Standings Conferences */
export const getNflStandingsConferences: ApiSportsEndpoints['getNflStandingsConferences'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getNflStandingsConferences;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getNflStandingsConferences']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.standings.getNflStandingsConferences',
			input ?? {},
			'completed',
		);
		return response;
	};
