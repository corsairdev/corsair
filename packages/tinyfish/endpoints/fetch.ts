import type { TinyFishEndpoints } from '..';
import { makeTinyFishRequest } from '../client';
import { callTinyFish } from './call';
import {
	TinyFishEndpointInputSchemas,
	TinyFishEndpointOutputSchemas,
} from './types';

export const fetch: TinyFishEndpoints['fetch'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.fetch.fetch',
		TinyFishEndpointInputSchemas.fetch,
		TinyFishEndpointOutputSchemas.fetch,
		input,
		(validated) =>
			makeTinyFishRequest('fetch', '/', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			urlCount: validated.urls.length,
			format: validated.format ?? 'markdown',
			resultCount: response.results.length,
			errorCount: response.errors.length,
		}),
	);
};

export const usage: TinyFishEndpoints['fetchUsage'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.fetch.usage',
		TinyFishEndpointInputSchemas.fetchUsage,
		TinyFishEndpointOutputSchemas.fetchUsage,
		input,
		(validated) =>
			makeTinyFishRequest('fetch', '/usage', ctx.key, {
				method: 'GET',
				query: {
					start_after: validated.start_after,
					end_before: validated.end_before,
					status: validated.status,
					limit: validated.limit,
					page: validated.page,
				},
			}),
		(_validated, response) => ({
			itemCount: response.items.length,
			total: response.total,
			page: response.page,
		}),
	);
};
