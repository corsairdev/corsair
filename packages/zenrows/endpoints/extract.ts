import type { ZenRowsEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ZenRowsEndpointInputSchemas as Inputs,
	ZenRowsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Extract's own routes, all under `/v1/extract`. The extraction itself is a
 * Fetch call with `extract=auto` (see `fetch.extract`); these prepare a domain
 * for it and report the monthly preparation allowance.
 */

export const domains: ZenRowsEndpoints['extractDomains'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'extract.domains',
			input: Inputs.extractDomains,
			output: Outputs.extractDomains,
		},
		input,
		() => ({ method: 'GET', path: '/v1/extract/domains' }),
		{
			shape: (raw) => raw.json,
			log: (_parsed, result) => ({ domains: result.domains.length }),
		},
	);

export const prepareDomain: ZenRowsEndpoints['extractPrepareDomain'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'extract.prepareDomain',
			input: Inputs.extractPrepareDomain,
			output: Outputs.extractPrepareDomain,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1/extract/prepared-domains',
			body: {
				domain: parsed.domain,
				example_urls: parsed.exampleUrls,
			},
			headers:
				parsed.idempotencyKey === undefined
					? undefined
					: { 'Idempotency-Key': parsed.idempotencyKey },
		}),
		{
			shape: (raw) => raw.json,
			log: (parsed, result) => ({
				domain: result.domain,
				status: result.status,
				state: result.state ?? undefined,
				exampleUrls: parsed.exampleUrls?.length,
			}),
		},
	);

export const getDomainStatus: ZenRowsEndpoints['extractGetDomainStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'extract.getDomainStatus',
			input: Inputs.extractGetDomainStatus,
			output: Outputs.extractGetDomainStatus,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/extract/prepared-domains/${segment(parsed.domain)}`,
		}),
		{
			shape: (raw) => raw.json,
			log: (parsed, result) => ({
				domain: parsed.domain,
				status: result.status,
				state: result.state ?? undefined,
			}),
		},
	);

export const listPreparedDomains: ZenRowsEndpoints['extractListPreparedDomains'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'extract.listPreparedDomains',
				input: Inputs.extractListPreparedDomains,
				output: Outputs.extractListPreparedDomains,
			},
			input,
			() => ({ method: 'GET', path: '/v1/extract/prepared-domains' }),
			{
				shape: (raw) => raw.json,
				log: (_parsed, result) => ({
					domains: result.domains.length,
					remaining: result.allowance?.remaining ?? undefined,
				}),
			},
		);

export const allowance: ZenRowsEndpoints['extractAllowance'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'extract.allowance',
			input: Inputs.extractAllowance,
			output: Outputs.extractAllowance,
		},
		input,
		() => ({ method: 'GET', path: '/v1/extract/prepared-domains/allowance' }),
		{
			shape: (raw) => raw.json,
			log: (_parsed, result) => ({
				used: result.used ?? undefined,
				limit: result.limit ?? undefined,
				month: result.month ?? undefined,
			}),
		},
	);

/**
 * The plan behind the calling key: it is a GET that returns no credential, and
 * Zenrows documents it as free of the concurrency limit, so it stays a read.
 */
export const subscription: ZenRowsEndpoints['accountSubscription'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.subscription',
			input: Inputs.accountSubscription,
			output: Outputs.accountSubscription,
		},
		input,
		() => ({ method: 'GET', path: '/v1/subscriptions/self/details' }),
		{
			shape: (raw) => raw.json,
			log: (_parsed, result) => ({
				status: result.status ?? undefined,
				usageCredits: result.usage_credits ?? undefined,
				creditLimit: result.credit_limit ?? undefined,
			}),
		},
	);
