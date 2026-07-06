import { logEventFromContext } from 'corsair/core';
import { executeApiSportsRequest } from './shared';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get Fixtures */
export const getFixtures: ApiSportsEndpoints['getFixtures'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFixtures;
	const response = await executeApiSportsRequest<ApiSportsEndpointOutputs['getFixtures']>(
		ctx,
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.fixtures.getFixtures', input ?? {}, 'completed');
	return response;
};

/** Get Fixtures Rounds */
export const getFixturesRounds: ApiSportsEndpoints['getFixturesRounds'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFixturesRounds;
	const response = await executeApiSportsRequest<ApiSportsEndpointOutputs['getFixturesRounds']>(
		ctx,
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.fixtures.getFixturesRounds', input ?? {}, 'completed');
	return response;
};

/** Get Head-to-Head Fixtures */
export const getHeadToHeadFixtures: ApiSportsEndpoints['getHeadToHeadFixtures'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getHeadToHeadFixtures;
	const response = await executeApiSportsRequest<ApiSportsEndpointOutputs['getHeadToHeadFixtures']>(
		ctx,
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.fixtures.getHeadToHeadFixtures', input ?? {}, 'completed');
	return response;
};

/** Get Fixture Lineups */
export const getFixtureLineups: ApiSportsEndpoints['getFixtureLineups'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFixtureLineups;
	const response = await executeApiSportsRequest<ApiSportsEndpointOutputs['getFixtureLineups']>(
		ctx,
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.fixtures.getFixtureLineups', input ?? {}, 'completed');
	return response;
};

/** Get Fixture Statistics */
export const getFixtureStatistics: ApiSportsEndpoints['getFixtureStatistics'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFixtureStatistics;
	const response = await executeApiSportsRequest<ApiSportsEndpointOutputs['getFixtureStatistics']>(
		ctx,
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.fixtures.getFixtureStatistics', input ?? {}, 'completed');
	return response;
};

/** Get Fixtures Events */
export const getFixturesEvents: ApiSportsEndpoints['getFixturesEvents'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFixturesEvents;
	const response = await executeApiSportsRequest<ApiSportsEndpointOutputs['getFixturesEvents']>(
		ctx,
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.fixtures.getFixturesEvents', input ?? {}, 'completed');
	return response;
};

/** Get Fixtures Players */
export const getFixturesPlayers: ApiSportsEndpoints['getFixturesPlayers'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFixturesPlayers;
	const response = await executeApiSportsRequest<ApiSportsEndpointOutputs['getFixturesPlayers']>(
		ctx,
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.fixtures.getFixturesPlayers', input ?? {}, 'completed');
	return response;
};
