import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Clean up user agent - POST /v1/user_agent_cleanups
export const userAgentCleanupsCreate: DnsfilterEndpoints['userAgentCleanupsCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentCleanupsCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentCleanupsCreate']
		>('/v1/user_agent_cleanups', ctx.key, {
			method: 'POST',
			body: {
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
				inactive_for: values.inactive_for,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentCleanupsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentCleanups.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a user agent cleanup - GET /v1/user_agent_cleanups/{id}
export const userAgentCleanupsGet: DnsfilterEndpoints['userAgentCleanupsGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentCleanupsGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentCleanupsGet']
		>('/v1/user_agent_cleanups/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentCleanupsGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentCleanups.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update a user agent cleanup - PUT /v1/user_agent_cleanups/{id}
export const userAgentCleanupsUpdate: DnsfilterEndpoints['userAgentCleanupsUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentCleanupsUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentCleanupsUpdate']
		>('/v1/user_agent_cleanups/{id}', ctx.key, {
			method: 'PUT',
			path: {
				id: values.id,
			},
			body: {
				start: values.start,
				inactive_for: values.inactive_for,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentCleanupsUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentCleanups.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
