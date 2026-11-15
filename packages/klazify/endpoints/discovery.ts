import type { KlazifyContext } from '..';
import { callKlazify } from './call';
import type { KlazifyEndpointInputs, KlazifyEndpointOutputs } from './types';
import {
	KlazifyCategoryListInputSchema,
	KlazifyCategoryListResponseSchema,
	KlazifyDiscoveryInputSchema,
	KlazifyDiscoveryResponseSchema,
} from './types';

/**
 * Reference endpoints that return Klazify's own taxonomy. Both count as an API
 * call, so they are wrapped rather than treated as free lookups.
 */
export const listV1 = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['categoriesListV1'],
): Promise<KlazifyEndpointOutputs['categoriesListV1']> =>
	callKlazify(
		ctx,
		{
			event: 'categories.listV1',
			input: KlazifyCategoryListInputSchema,
			output: KlazifyCategoryListResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/api/list-category/v1' }),
		{
			log: (_parsed, result) => ({
				version: result.version,
				categories: result.count,
			}),
		},
	);

export const listV2 = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['categoriesListV2'],
): Promise<KlazifyEndpointOutputs['categoriesListV2']> =>
	callKlazify(
		ctx,
		{
			event: 'categories.listV2',
			input: KlazifyCategoryListInputSchema,
			output: KlazifyCategoryListResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/api/list-category/v2' }),
		{
			log: (_parsed, result) => ({
				version: result.version,
				categories: result.count,
			}),
		},
	);

/**
 * The one endpoint that searches Klazify's whole database instead of a single
 * URL. Bodies stay in the request body rather than the query string, which is
 * what the documented example does.
 */
export const search = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['discoverySearch'],
): Promise<KlazifyEndpointOutputs['discoverySearch']> =>
	callKlazify(
		ctx,
		{
			event: 'discovery.search',
			input: KlazifyDiscoveryInputSchema,
			output: KlazifyDiscoveryResponseSchema,
		},
		input,
		(parsed) => {
			// The body mirrors the input, minus the keys the caller left unset, so
			// Klazify's own defaults apply rather than an explicit undefined.
			const body: Record<string, string | number | boolean | object> = {};
			if (parsed.top_n !== undefined) body.top_n = parsed.top_n;
			if (parsed.filters !== undefined) body.filters = parsed.filters;
			if (parsed.q !== undefined) body.q = parsed.q;
			if (parsed.sort !== undefined) body.sort = parsed.sort;
			if (parsed.sort_dir !== undefined) body.sort_dir = parsed.sort_dir;
			if (parsed.page !== undefined) body.page = parsed.page;
			return { method: 'POST', path: '/api/discovery', body };
		},
		{
			// The search text is the caller's own query, so only the shape of the
			// answer is logged. `page` is the requested page, which is what a
			// debugging session needs alongside the page count.
			log: (parsed, result) => ({
				results: result.results.length,
				total: result.total,
				page: parsed.page ?? 1,
				total_pages: result.total_pages,
			}),
		},
	);
