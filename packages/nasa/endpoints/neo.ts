import type { NasaEndpoints } from '..';
import { call } from './call';
import {
	NasaEndpointInputSchemas as Inputs,
	NasaEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Close approaches grouped by date. NASA accepts at most seven days per
 * request and answers 400 for a wider window; `links.previous`/`links.next`
 * are full URLs for the adjacent windows.
 */
export const feed: NasaEndpoints['neoFeed'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'neo.feed',
			input: Inputs.neoFeed,
			output: Outputs.neoFeed,
		},
		input,
		({ start_date, end_date, detailed }) => ({
			method: 'GET',
			host: 'api',
			path: '/neo/rest/v1/feed',
			query: { start_date, end_date, detailed },
		}),
		{ log: (_, result) => ({ count: result.element_count }) },
	);

export const lookup: NasaEndpoints['neoLookup'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'neo.lookup',
			input: Inputs.neoLookup,
			output: Outputs.neoLookup,
		},
		input,
		({ asteroid_id }) => ({
			method: 'GET',
			host: 'api',
			path: `/neo/rest/v1/neo/${encodeURIComponent(String(asteroid_id))}`,
		}),
		{
			log: ({ asteroid_id }, result) => ({
				asteroidId: String(asteroid_id),
				name: result.name ?? undefined,
			}),
		},
	);

/**
 * Pages by number and size. The response repeats a `page` block with
 * `total_elements` and `total_pages`, so a caller can walk the whole set
 * without guessing when it ends.
 */
export const browse: NasaEndpoints['neoBrowse'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'neo.browse',
			input: Inputs.neoBrowse,
			output: Outputs.neoBrowse,
		},
		input,
		({ page, size }) => ({
			method: 'GET',
			host: 'api',
			path: '/neo/rest/v1/neo/browse',
			query: { page, size },
		}),
		{
			log: (_, result) => ({
				count: result.near_earth_objects.length,
				page: result.page.number ?? undefined,
				totalPages: result.page.total_pages ?? undefined,
			}),
		},
	);
