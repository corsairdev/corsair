import type { TombaEndpoints } from '..';
import { call } from './call';
import { TombaEndpointInputSchemas, TombaEndpointOutputSchemas } from './types';

/**
 * A finder result is a success even when no address was found: Tomba answers
 * 200 with `data.email: null`. Nothing here throws on a miss, because a miss is
 * a legitimate answer that the caller checks.
 */
export const domainSearch: TombaEndpoints['finderDomainSearch'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'finder.domainSearch',
			input: TombaEndpointInputSchemas.domainSearch,
			output: TombaEndpointOutputSchemas.domainSearch,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'domain-search',
			query: {
				domain: parsed.domain,
				page: parsed.page,
				limit: parsed.limit,
				department: parsed.department,
				country: parsed.country,
				enrich_mobile: parsed.enrich_mobile,
				webhook_url: parsed.webhook_url,
			},
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain,
				page: parsed.page ?? 1,
				emails: result.data.emails.length,
			}),
		},
	);

export const emailFinder: TombaEndpoints['finderEmail'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'finder.email',
			input: TombaEndpointInputSchemas.emailFinder,
			output: TombaEndpointOutputSchemas.emailFinder,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'email-finder',
			query: {
				domain: parsed.domain,
				company: parsed.company,
				first_name: parsed.first_name,
				last_name: parsed.last_name,
				full_name: parsed.full_name,
				enrich_mobile: parsed.enrich_mobile,
				webhook_url: parsed.webhook_url,
			},
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain ?? parsed.company,
				// A miss is still a successful call; log whether one was found.
				found: result.data.email !== null && result.data.email !== undefined,
			}),
		},
	);

export const linkedinFinder: TombaEndpoints['finderLinkedin'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'finder.linkedin',
			input: TombaEndpointInputSchemas.linkedinFinder,
			output: TombaEndpointOutputSchemas.linkedinFinder,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'linkedin',
			query: {
				url: parsed.url,
				enrich_mobile: parsed.enrich_mobile,
				full: parsed.full,
				webhook_url: parsed.webhook_url,
			},
		}),
		{
			log: (_parsed, result) => ({
				found: Array.isArray(result.data)
					? result.data.some((entry) => Boolean(entry.email))
					: Boolean(result.data.email),
			}),
		},
	);

export const authorFinder: TombaEndpoints['finderAuthor'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'finder.author',
			input: TombaEndpointInputSchemas.authorFinder,
			output: TombaEndpointOutputSchemas.authorFinder,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'author-finder',
			query: { url: parsed.url, webhook_url: parsed.webhook_url },
		}),
		{
			log: (_parsed, result) => ({
				found: result.data.email !== null && result.data.email !== undefined,
			}),
		},
	);

export const emailEnrichment: TombaEndpoints['finderEnrich'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'finder.enrich',
			input: TombaEndpointInputSchemas.emailEnrichment,
			output: TombaEndpointOutputSchemas.emailEnrichment,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'enrich',
			query: {
				email: parsed.email,
				enrich_mobile: parsed.enrich_mobile,
				webhook_url: parsed.webhook_url,
			},
		}),
		{ log: (parsed) => ({ has_email: parsed.email.length > 0 }) },
	);

export const phoneFinder: TombaEndpoints['finderPhone'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'finder.phone',
			input: TombaEndpointInputSchemas.phoneFinder,
			output: TombaEndpointOutputSchemas.phoneFinder,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'phone-finder',
			query: {
				email: parsed.email,
				domain: parsed.domain,
				linkedin: parsed.linkedin,
				full: parsed.full,
				webhook_url: parsed.webhook_url,
			},
		}),
		{ log: (parsed) => ({ domain: parsed.domain }) },
	);
