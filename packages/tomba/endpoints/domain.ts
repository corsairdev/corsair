import type { TombaEndpoints } from '..';
import { call } from './call';
import { TombaEndpointInputSchemas, TombaEndpointOutputSchemas } from './types';

export const find: TombaEndpoints['companyFind'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'company.find',
			input: TombaEndpointInputSchemas.companyFind,
			output: TombaEndpointOutputSchemas.companyFind,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'companies/find',
			query: { domain: parsed.domain },
		}),
		{ log: (parsed) => ({ domain: parsed.domain }) },
	);

export const personFind: TombaEndpoints['personFind'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'person.find',
			input: TombaEndpointInputSchemas.personFind,
			output: TombaEndpointOutputSchemas.personFind,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'people/find',
			query: { email: parsed.email },
		}),
		{ log: () => ({ scope: 'person' }) },
	);

export const combinedFind: TombaEndpoints['combinedFind'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'combined.find',
			input: TombaEndpointInputSchemas.combinedFind,
			output: TombaEndpointOutputSchemas.combinedFind,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'combined/find',
			query: { email: parsed.email },
		}),
		{ log: () => ({ scope: 'combined' }) },
	);

export const emailCount: TombaEndpoints['domainEmailCount'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domain.emailCount',
			input: TombaEndpointInputSchemas.emailCount,
			output: TombaEndpointOutputSchemas.emailCount,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'email-count',
			query: { domain: parsed.domain, type: parsed.type },
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain,
				total: result.data.total ?? undefined,
			}),
		},
	);

export const emailFormat: TombaEndpoints['domainEmailFormat'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domain.emailFormat',
			input: TombaEndpointInputSchemas.emailFormat,
			output: TombaEndpointOutputSchemas.emailFormat,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'email-format',
			query: { domain: parsed.domain },
		}),
		{ log: (parsed) => ({ domain: parsed.domain }) },
	);

export const location: TombaEndpoints['domainLocation'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'domain.location',
			input: TombaEndpointInputSchemas.location,
			output: TombaEndpointOutputSchemas.location,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'location',
			query: { domain: parsed.domain },
		}),
		{ log: (parsed) => ({ domain: parsed.domain }) },
	);

export const technology: TombaEndpoints['domainTechnology'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domain.technology',
			input: TombaEndpointInputSchemas.technology,
			output: TombaEndpointOutputSchemas.technology,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'technology',
			query: { domain: parsed.domain },
		}),
		{ log: (parsed) => ({ domain: parsed.domain }) },
	);

export const similar: TombaEndpoints['domainSimilar'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'domain.similar',
			input: TombaEndpointInputSchemas.similar,
			output: TombaEndpointOutputSchemas.similar,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'similar',
			query: { domain: parsed.domain },
		}),
		{ log: (parsed) => ({ domain: parsed.domain }) },
	);

export const domainStatus: TombaEndpoints['domainStatus'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domain.status',
			input: TombaEndpointInputSchemas.domainStatus,
			output: TombaEndpointOutputSchemas.domainStatus,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'domain-status',
			query: { domain: parsed.domain },
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain,
				status: result.data.status ?? undefined,
			}),
		},
	);

export const suggestions: TombaEndpoints['domainSuggestions'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domain.suggestions',
			input: TombaEndpointInputSchemas.domainSuggestions,
			output: TombaEndpointOutputSchemas.domainSuggestions,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'domain-suggestions',
			query: { domain: parsed.domain },
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain,
				suggestions: result.data.length,
			}),
		},
	);

export const emailSources: TombaEndpoints['domainEmailSources'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'domain.emailSources',
			input: TombaEndpointInputSchemas.emailSources,
			output: TombaEndpointOutputSchemas.emailSources,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'email-sources',
			query: { domain: parsed.domain },
		}),
		{ log: (parsed) => ({ domain: parsed.domain }) },
	);
