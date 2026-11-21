import type { GoogleSearchConsoleEndpoints } from '..';
import { feedSegment, siteSegment } from '../client';
import { call, rowCount } from './call';
import {
	GoogleSearchConsoleEndpointInputSchemas as Inputs,
	GoogleSearchConsoleEndpointOutputSchemas as Outputs,
} from './types';

export const list: GoogleSearchConsoleEndpoints['sitemapsList'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'sitemaps.list',
			input: Inputs.sitemapsList,
			output: Outputs.sitemapsList,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/webmasters/v3/sites/${siteSegment(input.siteUrl)}/sitemaps`,
			...(input.sitemapIndex
				? { query: { sitemapIndex: input.sitemapIndex } }
				: {}),
		}),
		(result) => rowCount(result.sitemap),
	);

export const get: GoogleSearchConsoleEndpoints['sitemapsGet'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'sitemaps.get',
			input: Inputs.sitemapsGet,
			output: Outputs.sitemapsGet,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/webmasters/v3/sites/${siteSegment(input.siteUrl)}/sitemaps/${feedSegment(input.feedpath)}`,
		}),
	);

/**
 * sitemaps.submit is a PUT with no body: the sitemap's URL in the path is the
 * whole request, and Google fetches it. Submitting one that is already there
 * refreshes its status.
 */
export const submit: GoogleSearchConsoleEndpoints['sitemapsSubmit'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'sitemaps.submit',
			input: Inputs.sitemapsSubmit,
			output: Outputs.sitemapsSubmit,
		},
		rawInput,
		(input) => ({
			method: 'PUT',
			path: `/webmasters/v3/sites/${siteSegment(input.siteUrl)}/sitemaps/${feedSegment(input.feedpath)}`,
		}),
	);

export const remove: GoogleSearchConsoleEndpoints['sitemapsDelete'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'sitemaps.delete',
			input: Inputs.sitemapsDelete,
			output: Outputs.sitemapsDelete,
		},
		rawInput,
		(input) => ({
			method: 'DELETE',
			path: `/webmasters/v3/sites/${siteSegment(input.siteUrl)}/sitemaps/${feedSegment(input.feedpath)}`,
		}),
	);
