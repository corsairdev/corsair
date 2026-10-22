import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// User lookup for domains - GET /v1/domains/user_lookup
export const domainsUserLookup: DnsfilterEndpoints['domainsUserLookup'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.domainsUserLookup.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainsUserLookup']
		>('/v1/domains/user_lookup', ctx.key, {
			method: 'GET',
			query: {
				fqdn: values.fqdn,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.domainsUserLookup.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.domains.userLookup',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk lookup for domains - GET /v1/domains/bulk_lookup
export const domainsBulkLookup: DnsfilterEndpoints['domainsBulkLookup'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.domainsBulkLookup.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainsBulkLookup']
		>('/v1/domains/bulk_lookup', ctx.key, {
			method: 'GET',
			query: {
				fqdns: values.fqdns,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.domainsBulkLookup.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.domains.bulkLookup',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Suggest threat for domains - POST /v1/domains/suggest_threat
export const domainsSuggestThreat: DnsfilterEndpoints['domainsSuggestThreat'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.domainsSuggestThreat.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['domainsSuggestThreat']
		>('/v1/domains/suggest_threat', ctx.key, {
			method: 'POST',
			query: {
				categories: values.categories,
				fqdn: values.fqdn,
				notes: values.notes,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.domainsSuggestThreat.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.domains.suggestThreat',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
