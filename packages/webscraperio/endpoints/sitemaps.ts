import type { WebscraperioEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	WebscraperioEndpointInputSchemas as Inputs,
	WebscraperioEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Counts the sitemaps in whichever of the two documented list shapes came back:
 * a bare `data` array, or a paginated object that nests another `data`.
 */
type SitemapListBody = {
	data?: unknown[] | { data?: unknown[] } | null;
};

function countOf(body: SitemapListBody): number {
	const data = body.data;
	if (Array.isArray(data)) return data.length;
	if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
		return Array.isArray(data.data) ? data.data.length : 0;
	}
	return 0;
}

export const list: WebscraperioEndpoints['sitemapsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sitemaps.list',
			input: Inputs.sitemapsList,
			output: Outputs.sitemapsList,
		},
		input,
		({ page }) => ({
			method: 'GET',
			path: '/sitemaps',
			query: { page },
		}),
		{
			// unknown: the count is read off the raw body, since the list shape
			// has two documented forms and the result is already validated.
			shape: (raw) => raw,
			log: (_, result) => ({ count: countOf(result as SitemapListBody) }),
		},
	);

export const get: WebscraperioEndpoints['sitemapsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sitemaps.get',
			input: Inputs.sitemapsGet,
			output: Outputs.sitemapsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/sitemap/${segment(id)}` }),
		{
			log: (_, result) => ({
				id: result.data?.id ?? undefined,
				name: result.data?.name ?? undefined,
				status: result.data?.status ?? undefined,
			}),
		},
	);

/**
 * Creates a sitemap from the definition the Web Scraper app exports. The body
 * is passed through unchanged: its shape belongs to the builder, and the API
 * accepts it as given.
 */
export const create: WebscraperioEndpoints['sitemapsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sitemaps.create',
			input: Inputs.sitemapsCreate,
			output: Outputs.sitemapsCreate,
		},
		input,
		({ sitemap }) => ({ method: 'POST', path: '/sitemap', body: sitemap }),
		{
			log: (_, result) => ({
				id: result.data?.id ?? undefined,
				name: result.data?.name ?? undefined,
			}),
		},
	);

/** The account behind the token, with its plan and page allowance. */
export const account: WebscraperioEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({ method: 'GET', path: '/account' }),
		{
			log: (_, result) => ({
				plan: result.data?.plan ?? undefined,
				pagesUsed: result.data?.pages_used ?? undefined,
				pagesAllowed: result.data?.pages_allowed ?? undefined,
			}),
		},
	);
