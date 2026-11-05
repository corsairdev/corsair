import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const dnsLiveLookup: WhoisfreaksEndpoints['dnsLiveLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeWhoisfreaksRequest<
		WhoisfreaksEndpointOutputs['dnsLiveLookup']
	>('/v2.0/dns/live', ctx.key, {
		method: 'GET',
		query: {
			domainName: input.domainName,
			ipAddress: input.ipAddress,
			type: input.type,
		},
	});

	await logEventFromContext(
		ctx,
		'whoisfreaks.dns.live_lookup',
		{
			domainName: input.domainName,
			ipAddress: input.ipAddress,
			type: input.type,
		},
		'completed',
	);

	return response;
};

export const dnsHistoricalLookup: WhoisfreaksEndpoints['dnsHistoricalLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['dnsHistoricalLookup']
		>('/v2.0/dns/historical', ctx.key, {
			method: 'GET',
			query: {
				domainName: input.domainName,
				type: input.type,
				page: input.page,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.dns.historical_lookup',
			{
				domainName: input.domainName,
				type: input.type,
				page: input.page,
			},
			'completed',
		);

		return response;
	};

export const dnsReverseLookup: WhoisfreaksEndpoints['dnsReverseLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['dnsReverseLookup']
		>('/v2.1/dns/reverse', ctx.key, {
			method: 'GET',
			query: {
				value: input.value,
				type: input.type,
				exact: input.exact,
				page: input.page,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.dns.reverse_lookup',
			{
				value: input.value,
				type: input.type,
				exact: input.exact,
				page: input.page,
			},
			'completed',
		);

		return response;
	};

export const dnsBulkLookup: WhoisfreaksEndpoints['dnsBulkLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeWhoisfreaksRequest<
		WhoisfreaksEndpointOutputs['dnsBulkLookup']
	>('/v2.0/dns/bulk/live', ctx.key, {
		method: 'POST',
		body: {
			domainNames: input.domainNames,
			ipAddresses: input.ipAddresses,
		},
		query: {
			type: input.type,
		},
	});

	await logEventFromContext(
		ctx,
		'whoisfreaks.dns.bulk_lookup',
		{
			domainCount: input.domainNames?.length ?? 0,
			ipCount: input.ipAddresses?.length ?? 0,
			type: input.type,
		},
		'completed',
	);

	return response;
};

export const Dns = {
	live: dnsLiveLookup,
	historical: dnsHistoricalLookup,
	reverse: dnsReverseLookup,
	bulk: dnsBulkLookup,
};
