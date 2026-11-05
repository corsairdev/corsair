import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const whoisLiveLookupV2: WhoisfreaksEndpoints['whoisLiveLookupV2'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['whoisLiveLookupV2']
		>('/v2.0/whois/live', ctx.key, {
			method: 'GET',
			query: {
				whois: 'live',
				domainName: input.domainName,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.whois.live_lookup_v2',
			{
				domainName: input.domainName,
			},
			'completed',
		);

		return response;
	};

export const whoisHistoryLookup: WhoisfreaksEndpoints['whoisHistoryLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['whoisHistoryLookup']
		>('/v2.0/whois/history', ctx.key, {
			method: 'GET',
			query: {
				domainName: input.domainName,
				page: input.page,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.whois.history_lookup',
			{
				domainName: input.domainName,
				page: input.page,
			},
			'completed',
		);

		return response;
	};

export const whoisReverseLookup: WhoisfreaksEndpoints['whoisReverseLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['whoisReverseLookup']
		>('/v2.0/whois/reverse', ctx.key, {
			method: 'GET',
			query: {
				keyword: input.keyword,
				page: input.page,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.whois.reverse_lookup',
			{
				keyword: input.keyword,
				page: input.page,
			},
			'completed',
		);

		return response;
	};

export const bulkWhoisLookup: WhoisfreaksEndpoints['bulkWhoisLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeWhoisfreaksRequest<
		WhoisfreaksEndpointOutputs['bulkWhoisLookup']
	>('/v2.0/bulkwhois/live', ctx.key, {
		method: 'POST',
		body: {
			domainNames: input.domainNames,
		},
	});

	await logEventFromContext(
		ctx,
		'whoisfreaks.whois.bulk_lookup',
		{
			domainCount: input.domainNames.length,
		},
		'completed',
	);

	return response;
};

export const WhoisLive = {
	lookupV2: whoisLiveLookupV2,
};

export const WhoisHistory = {
	lookup: whoisHistoryLookup,
};

export const WhoisReverse = {
	lookup: whoisReverseLookup,
};

export const BulkWhois = {
	lookup: bulkWhoisLookup,
};
