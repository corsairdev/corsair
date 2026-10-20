import type { TinyFishEndpoints } from '..';
import { makeTinyFishRequest } from '../client';
import { callTinyFish } from './call';
import {
	TinyFishEndpointInputSchemas,
	TinyFishEndpointOutputSchemas,
} from './types';

export const search: TinyFishEndpoints['search'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.search.search',
		TinyFishEndpointInputSchemas.search,
		TinyFishEndpointOutputSchemas.search,
		input,
		(validated) =>
			makeTinyFishRequest('search', '/', ctx.key, {
				method: 'GET',
				query: {
					query: validated.query,
					purpose: validated.purpose,
					location: validated.location,
					language: validated.language,
					include_domains: validated.include_domains,
					exclude_domains: validated.exclude_domains,
					domain_type: validated.domain_type,
					after_date: validated.after_date,
					before_date: validated.before_date,
					recency_minutes: validated.recency_minutes,
					pub_year_min: validated.pub_year_min,
					pub_year_max: validated.pub_year_max,
					page: validated.page ?? undefined,
					include_thumbnail: validated.include_thumbnail,
					fetch: validated.fetch,
				},
			}),
		(validated, response) => ({
			query: response.query,
			domainType: validated.domain_type ?? 'web',
			page: response.page,
			resultCount: response.results.length,
			totalResults: response.total_results,
		}),
	);
};

export const searchUsage: TinyFishEndpoints['searchUsage'] = async (
	ctx,
	input,
) => {
	return callTinyFish(
		ctx,
		'tinyfish.search.usage',
		TinyFishEndpointInputSchemas.searchUsage,
		TinyFishEndpointOutputSchemas.searchUsage,
		input,
		(validated) =>
			makeTinyFishRequest('search', '/usage', ctx.key, {
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
