import { logEventFromContext } from 'corsair/core';
import type { ApiSportsEndpoints } from '../index';
import { API_SPORTS_ROUTES } from './routes';
import { executeApiSportsRequest } from './shared';
import type { ApiSportsEndpointOutputs } from './types';

/** Get Baseball Games Head-to-Head */
export const getBaseballGamesHeadToHead: ApiSportsEndpoints['getBaseballGamesHeadToHead'] =
	async (ctx, input) => {
		const route = API_SPORTS_ROUTES.getBaseballGamesHeadToHead;
		const response = await executeApiSportsRequest<
			ApiSportsEndpointOutputs['getBaseballGamesHeadToHead']
		>(ctx, route.sport, route.path, { apiKey: ctx.key, query: input });
		await logEventFromContext(
			ctx,
			'apisports.baseball.getBaseballGamesHeadToHead',
			input ?? {},
			'completed',
		);
		return response;
	};
