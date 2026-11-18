import type { SimilarwebEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SimilarwebEndpointInputSchemas as Inputs,
	SimilarwebEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Every website route lives under `/v1/website/{domain}`, and the domain is
 * lower-cased because Similarweb answers 401 "invalid API key" for `CNN.COM`
 * rather than a validation error, which reads as an auth problem.
 */
function websitePath(domain: string, suffix: string): string {
	return `/v1/website/${segment(domain.trim().toLowerCase())}${suffix}`;
}

function dateQuery(parsed: {
	start_date?: string;
	end_date?: string;
	main_domain_only?: boolean;
}) {
	return {
		start_date: parsed.start_date,
		end_date: parsed.end_date,
		main_domain_only: parsed.main_domain_only,
	};
}

export const globalRank: SimilarwebEndpoints['websitesGlobalRank'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'websites.globalRank',
			input: Inputs.websitesGlobalRank,
			output: Outputs.websitesGlobalRank,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: websitePath(parsed.domain, '/global-rank/global-rank'),
			query: dateQuery(parsed),
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain,
				startDate: parsed.start_date,
				endDate: parsed.end_date,
				points: result.global_rank.length,
			}),
		},
	);

export const countryRank: SimilarwebEndpoints['websitesCountryRank'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'websites.countryRank',
			input: Inputs.websitesCountryRank,
			output: Outputs.websitesCountryRank,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: websitePath(parsed.domain, '/country-rank/country-rank'),
			query: { ...dateQuery(parsed), country: parsed.country.toLowerCase() },
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain,
				country: parsed.country,
				points: result.country_rank.length,
			}),
		},
	);

export const industryRank: SimilarwebEndpoints['websitesIndustryRank'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'websites.industryRank',
			input: Inputs.websitesIndustryRank,
			output: Outputs.websitesIndustryRank,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: websitePath(parsed.domain, '/category-rank/category-rank'),
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain,
				category: result.category ?? undefined,
				rank: result.rank ?? undefined,
			}),
		},
	);

export const topSites: SimilarwebEndpoints['websitesTopSites'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'websites.topSites',
			input: Inputs.websitesTopSites,
			output: Outputs.websitesTopSites,
		},
		input,
		(parsed) => ({
			method: 'GET',
			// A different base from the per-domain routes: this is the only
			// similar-rank route Similarweb documents.
			path: '/v1/similar-rank/top-sites',
			query: { limit: parsed.limit },
		}),
		{
			log: (_, result) => ({ count: result.top_sites.length }),
		},
	);
