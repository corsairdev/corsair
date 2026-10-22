import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List user agent releases - GET /v1/user_agent_releases
export const userAgentReleasesList: DnsfilterEndpoints['userAgentReleasesList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentReleasesList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentReleasesList']
		>('/v1/user_agent_releases', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentReleasesList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentReleases.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Relay for user agent releases - GET /v1/user_agent_releases/relay
export const userAgentReleasesRelay: DnsfilterEndpoints['userAgentReleasesRelay'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentReleasesRelay.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentReleasesRelay']
		>('/v1/user_agent_releases/relay', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentReleasesRelay.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentReleases.relay',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
