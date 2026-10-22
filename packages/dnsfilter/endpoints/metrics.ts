import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Organization usage for metrics - GET /v1/metrics/organization_usage/{id}
export const metricsOrganizationUsage: DnsfilterEndpoints['metricsOrganizationUsage'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.metricsOrganizationUsage.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['metricsOrganizationUsage']
		>('/v1/metrics/organization_usage/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
			query: {
				from: values.from,
				to: values.to,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.metricsOrganizationUsage.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.metrics.organizationUsage',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Organization usage detailed for metrics - GET /v1/metrics/organization_usage_detailed/{id}
export const metricsOrganizationUsageDetailed: DnsfilterEndpoints['metricsOrganizationUsageDetailed'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.metricsOrganizationUsageDetailed.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['metricsOrganizationUsageDetailed']
		>('/v1/metrics/organization_usage_detailed/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
			query: {
				from: values.from,
				to: values.to,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.metricsOrganizationUsageDetailed.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.metrics.organizationUsageDetailed',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
