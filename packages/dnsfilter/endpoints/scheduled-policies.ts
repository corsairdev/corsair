import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List scheduled policies - GET /v1/scheduled_policies
export const scheduledPoliciesList: DnsfilterEndpoints['scheduledPoliciesList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledPoliciesList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesList']
		>('/v1/scheduled_policies', ctx.key, {
			method: 'GET',
			query: {
				page: values.page,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledPoliciesList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create a scheduled policy - POST /v1/scheduled_policies
export const scheduledPoliciesCreate: DnsfilterEndpoints['scheduledPoliciesCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledPoliciesCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesCreate']
		>('/v1/scheduled_policies', ctx.key, {
			method: 'POST',
			body: {
				name: values.name,
				organization_id: values.organization_id,
				policy_ids: values.policy_ids,
				timezone: values.timezone,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledPoliciesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// List all scheduled policies - GET /v1/scheduled_policies/all
export const scheduledPoliciesListAll: DnsfilterEndpoints['scheduledPoliciesListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledPoliciesListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesListAll']
		>('/v1/scheduled_policies/all', ctx.key, {
			method: 'GET',
			query: {
				page: values.page,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledPoliciesListAll.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a scheduled policy - GET /v1/scheduled_policies/{id}
export const scheduledPoliciesGet: DnsfilterEndpoints['scheduledPoliciesGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledPoliciesGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesGet']
		>('/v1/scheduled_policies/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledPoliciesGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update a scheduled policy - PATCH /v1/scheduled_policies/{id}
export const scheduledPoliciesUpdate: DnsfilterEndpoints['scheduledPoliciesUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledPoliciesUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesUpdate']
		>('/v1/scheduled_policies/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
			body: {
				name: values.name,
				organization_id: values.organization_id,
				policy_ids: values.policy_ids,
				timezone: values.timezone,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledPoliciesUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete a scheduled policy - DELETE /v1/scheduled_policies/{id}
export const scheduledPoliciesDelete: DnsfilterEndpoints['scheduledPoliciesDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.scheduledPoliciesDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['scheduledPoliciesDelete']
		>('/v1/scheduled_policies/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.scheduledPoliciesDelete.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.scheduledPolicies.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
