import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List user agent releases - GET /v1/user_agent_releases
export const userAgentReleasesList: DnsfilterEndpoints['userAgentReleasesList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentReleasesList']
		>('/v1/user_agent_releases', ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentReleases.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Relay for user agent releases - GET /v1/user_agent_releases/relay
export const userAgentReleasesRelay: DnsfilterEndpoints['userAgentReleasesRelay'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentReleasesRelay']
		>('/v1/user_agent_releases/relay', ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentReleases.relay',
			input ?? {},
			'completed',
		);
		return response;
	};
