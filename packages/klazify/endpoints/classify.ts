import type { KlazifyContext } from '..';
import { callKlazify, targetBody } from './call';
import type { KlazifyEndpointInputs, KlazifyEndpointOutputs } from './types';
import {
	KlazifyCategorizeInputSchema,
	KlazifyCategorizeResponseSchema,
	KlazifyCompanyInputSchema,
	KlazifyCompanyResponseSchema,
	KlazifyDomainInputSchema,
	KlazifyDomainResponseSchema,
	KlazifyIabInputSchema,
	KlazifyIabResponseSchema,
	KlazifyLogoInputSchema,
	KlazifyLogoResponseSchema,
	KlazifyRealtimeInputSchema,
	KlazifyRealtimeResponseSchema,
	KlazifySimilarDomainsInputSchema,
	KlazifySimilarDomainsResponseSchema,
	KlazifyTechInputSchema,
	KlazifyTechResponseSchema,
	KlazifyTrafficInputSchema,
	KlazifyTrafficResponseSchema,
} from './types';

/**
 * Everything in one answer: categories, logo, social profiles, company data and
 * the tech stack. The widest call, and the one to reach for when several of the
 * narrower endpoints would otherwise be called for the same domain.
 */
export const all = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['categorizeAll'],
): Promise<KlazifyEndpointOutputs['categorizeAll']> =>
	callKlazify(
		ctx,
		{
			event: 'categorize.all',
			input: KlazifyCategorizeInputSchema,
			output: KlazifyCategorizeResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/categorize',
			body: targetBody(parsed),
		}),
		{
			log: (parsed, result) => ({
				...targetLog(parsed),
				categories: result.domain.categories?.length ?? 0,
			}),
		},
	);

/**
 * Classification only, re-crawled. Cheaper than `categorize.all` when the caller
 * needs just the category and not the logo, social or company blocks.
 */
export const realtime = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['categorizeRealtime'],
): Promise<KlazifyEndpointOutputs['categorizeRealtime']> =>
	callKlazify(
		ctx,
		{
			event: 'categorize.realtime',
			input: KlazifyRealtimeInputSchema,
			output: KlazifyRealtimeResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/real_time_categorization',
			body: targetBody(parsed),
		}),
		{
			log: (parsed, result) => ({
				...targetLog(parsed),
				categories: result.domain.categories?.length ?? 0,
			}),
		},
	);

export const iab = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['categoriesIab'],
): Promise<KlazifyEndpointOutputs['categoriesIab']> =>
	callKlazify(
		ctx,
		{
			event: 'categories.iab',
			input: KlazifyIabInputSchema,
			output: KlazifyIabResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/domain_iab_categories',
			body: targetBody(parsed),
		}),
		{
			log: (parsed, result) => ({
				...targetLog(parsed),
				categories: result.domain.categories?.length ?? 0,
			}),
		},
	);

export const get = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['companyGet'],
): Promise<KlazifyEndpointOutputs['companyGet']> =>
	callKlazify(
		ctx,
		{
			event: 'company.get',
			input: KlazifyCompanyInputSchema,
			output: KlazifyCompanyResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/domain_company',
			body: targetBody(parsed),
		}),
		{
			log: (parsed) => targetLog(parsed),
		},
	);

export const tech = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['techGet'],
): Promise<KlazifyEndpointOutputs['techGet']> =>
	callKlazify(
		ctx,
		{
			event: 'tech.get',
			input: KlazifyTechInputSchema,
			output: KlazifyTechResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/domain_tech',
			body: targetBody(parsed),
		}),
		{
			log: (parsed, result) => ({
				...targetLog(parsed),
				technologies: result.objects.company.tech?.length ?? 0,
			}),
		},
	);

export const logo = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['logoGet'],
): Promise<KlazifyEndpointOutputs['logoGet']> =>
	callKlazify(
		ctx,
		{
			event: 'logo.get',
			input: KlazifyLogoInputSchema,
			output: KlazifyLogoResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/domain_logo',
			body: targetBody(parsed),
		}),
		{
			// A missing logo is a normal answer, so the flag is what is logged
			// rather than the URL.
			log: (parsed, result) => ({
				...targetLog(parsed),
				found: Boolean(result.domain.logo_url),
			}),
		},
	);

export const domain = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['domainGet'],
): Promise<KlazifyEndpointOutputs['domainGet']> =>
	callKlazify(
		ctx,
		{
			event: 'domain.get',
			input: KlazifyDomainInputSchema,
			output: KlazifyDomainResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/domain_expiration',
			body: targetBody(parsed),
		}),
		{
			log: (parsed) => targetLog(parsed),
		},
	);

export const similar = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['similarDomainsGet'],
): Promise<KlazifyEndpointOutputs['similarDomainsGet']> =>
	callKlazify(
		ctx,
		{
			event: 'similarDomains.get',
			input: KlazifySimilarDomainsInputSchema,
			output: KlazifySimilarDomainsResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/similar_domain',
			body: targetBody(parsed),
		}),
		{
			log: (parsed, result) => ({
				...targetLog(parsed),
				similar: result.domain.similar_domains?.length ?? 0,
			}),
		},
	);

export const traffic = (
	ctx: KlazifyContext,
	input: KlazifyEndpointInputs['trafficGet'],
): Promise<KlazifyEndpointOutputs['trafficGet']> =>
	callKlazify(
		ctx,
		{
			event: 'traffic.get',
			input: KlazifyTrafficInputSchema,
			output: KlazifyTrafficResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/domain_traffic_intelligence',
			body: targetBody(parsed),
		}),
		{
			log: (parsed) => targetLog(parsed),
		},
	);

/**
 * The target is not logged verbatim: an email is a person's address, and an
 * event log outlives the call. Which kind of target was sent is enough.
 */
function targetLog(parsed: {
	url?: string;
	email?: string;
	refresh?: boolean;
}) {
	return {
		target: parsed.url !== undefined ? 'url' : 'email',
		refresh: parsed.refresh ?? false,
	};
}
