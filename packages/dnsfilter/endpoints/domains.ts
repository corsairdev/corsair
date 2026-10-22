import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// User lookup for domains - GET /v1/domains/user_lookup
export const domainsUserLookup: DnsfilterEndpoints['domainsUserLookup'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainsUserLookup']
		>('/v1/domains/user_lookup', ctx.key, {
			method: 'GET',
			query: {
				fqdn: input.fqdn,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.domains.userLookup',
			input ?? {},
			'completed',
		);
		return response;
	};

// Bulk lookup for domains - GET /v1/domains/bulk_lookup
export const domainsBulkLookup: DnsfilterEndpoints['domainsBulkLookup'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainsBulkLookup']
		>('/v1/domains/bulk_lookup', ctx.key, {
			method: 'GET',
			query: {
				fqdns: input.fqdns,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.domains.bulkLookup',
			input ?? {},
			'completed',
		);
		return response;
	};

// Suggest threat for domains - POST /v1/domains/suggest_threat
export const domainsSuggestThreat: DnsfilterEndpoints['domainsSuggestThreat'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainsSuggestThreat']
		>('/v1/domains/suggest_threat', ctx.key, {
			method: 'POST',
			query: {
				categories: input.categories,
				fqdn: input.fqdn,
				notes: input.notes,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.domains.suggestThreat',
			input ?? {},
			'completed',
		);
		return response;
	};
