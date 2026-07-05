import { logEventFromContext } from 'corsair/core';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get Fixtures */
export const getFixtures: ApiSportsEndpoints['getFixtures'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getFixtures;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFixtures']>(
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
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFixturesRounds']>(
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
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getHeadToHeadFixtures']>(
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
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFixtureLineups']>(
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
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFixtureStatistics']>(
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
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFixturesEvents']>(
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
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getFixturesPlayers']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.fixtures.getFixturesPlayers', input ?? {}, 'completed');
	return response;
};
