import type { WebscraperioEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	WebscraperioEndpointInputSchemas as Inputs,
	WebscraperioEndpointOutputSchemas as Outputs,
} from './types';

export const list: WebscraperioEndpoints['sitemapsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sitemaps.list',
			input: Inputs.sitemapsList,
			output: Outputs.sitemapsList,
		},
		input,
		({ page, tag }) => ({
			method: 'GET',
			path: '/sitemaps',
			query: { page, tag },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				page: result.current_page ?? undefined,
				lastPage: result.last_page ?? undefined,
			}),
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
			log: (_, result) => ({ id: result.data?.id ?? undefined }),
		},
	);

/** The user behind the token and the page credits left on the account. */
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
			// The email and name stay out of the event log.
			log: (_, result) => ({
				pageCredits: result.data?.page_credits ?? undefined,
			}),
		},
	);
