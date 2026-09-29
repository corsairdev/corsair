import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const domainAvailabilityCheck: WhoisfreaksEndpoints['domainAvailabilityCheck'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['domainAvailabilityCheck']
		>('/v2.0/domain/availability', ctx.key, {
			method: 'GET',
			query: {
				domain: input.domain,
				sug: input.sug,
				count: input.count,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.availability.check',
			{
				domain: input.domain,
				sug: input.sug,
				count: input.count,
			},
			'completed',
		);

		return response;
	};

export const bulkDomainAvailabilityCheck: WhoisfreaksEndpoints['bulkDomainAvailabilityCheck'] =
	async (ctx, input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['bulkDomainAvailabilityCheck']
		>('/v2.0/domain/availability', ctx.key, {
			method: 'POST',
			body: {
				domainNames: input.domainNames,
				tld: input.tld,
			},
			query: {
				domain: input.domain,
			},
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.availability.bulk_check',
			{
				domain: input.domain,
				domainCount: input.domainNames?.length ?? 0,
				tldCount: input.tld?.length ?? 0,
			},
			'completed',
		);

		return response;
	};

export const Availability = {
	check: domainAvailabilityCheck,
	bulkCheck: bulkDomainAvailabilityCheck,
};
