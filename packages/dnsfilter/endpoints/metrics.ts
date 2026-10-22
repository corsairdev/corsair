import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Organization usage for metrics - GET /v1/metrics/organization_usage/{id}
export const metricsOrganizationUsage: DnsfilterEndpoints['metricsOrganizationUsage'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['metricsOrganizationUsage']
		>('/v1/metrics/organization_usage/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
			query: {
				from: input.from,
				to: input.to,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.metrics.organizationUsage',
			input ?? {},
			'completed',
		);
		return response;
	};

// Organization usage detailed for metrics - GET /v1/metrics/organization_usage_detailed/{id}
export const metricsOrganizationUsageDetailed: DnsfilterEndpoints['metricsOrganizationUsageDetailed'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['metricsOrganizationUsageDetailed']
		>('/v1/metrics/organization_usage_detailed/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
			query: {
				from: input.from,
				to: input.to,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.metrics.organizationUsageDetailed',
			input ?? {},
			'completed',
		);
		return response;
	};
