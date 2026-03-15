import type { TwitterApiIOEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeTwitterApiIORequest } from '../client';
import type { TwitterApiIOEndpointOutputs } from './types';

export const get: TwitterApiIOEndpoints['trendsGet'] = async (ctx, input) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['trendsGet']
	>('/twitter/trends', ctx.key, {
		method: 'GET',
		query: { woeid: input.woeid ?? 1 },
	});

	if (response.trends && ctx.db.trends) {
		try {
			for (const trend of response.trends) {
				await ctx.db.trends.upsertByEntityId(trend.name, trend);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save trends to database:', error);
		}
	}

	await logEventFromContext(ctx, 'twitterapiio.trends.get', { ...input }, 'completed');
	return response;
};
