import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const ipReputationLookup: WhoisfreaksEndpoints['ipReputationLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['ipReputationLookup']
		>('/v1.0/security', ctx.key, {
			method: 'GET',
			query: {
				ip: input.ip,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.ip_reputation.lookup',
			{
				ip: input.ip,
			},
			'completed',
		);

		return response;
	};

export const bulkIpReputationLookup: WhoisfreaksEndpoints['bulkIpReputationLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['bulkIpReputationLookup']
		>('/v1.0/security', ctx.key, {
			method: 'POST',
			body: {
				ips: input.ips,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.ip_reputation.bulk_lookup',
			{
				ipCount: input.ips.length,
			},
			'completed',
		);

		return response;
	};

export const domainReputationLookup: WhoisfreaksEndpoints['domainReputationLookup'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['domainReputationLookup']
		>('/v1/domain/security', ctx.key, {
			method: 'GET',
			query: {
				domainName: input.domainName,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.domain_reputation.lookup',
			{
				domainName: input.domainName,
			},
			'completed',
		);

		return response;
	};

export const IpReputation = {
	lookup: ipReputationLookup,
	bulkLookup: bulkIpReputationLookup,
};

export const DomainReputation = {
	lookup: domainReputationLookup,
};
