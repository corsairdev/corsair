import { logEventFromContext } from 'corsair/core';
import { makeApiSportsRequest } from '../client';
import type { ApiSportsEndpoints } from '../index';
import type { ApiSportsEndpointOutputs } from './types';
import { API_SPORTS_ROUTES } from './routes';

/** Get Baseball Games Head-to-Head */
export const getBaseballGamesHeadToHead: ApiSportsEndpoints['getBaseballGamesHeadToHead'] = async (ctx, input) => {
	const route = API_SPORTS_ROUTES.getBaseballGamesHeadToHead;
	const response = await makeApiSportsRequest<ApiSportsEndpointOutputs['getBaseballGamesHeadToHead']>(
		route.sport,
		route.path,
		{ apiKey: ctx.key, query: input },
	);
	await logEventFromContext(ctx, 'api_sports.baseball.getBaseballGamesHeadToHead', input ?? {}, 'completed');
	return response;
};
