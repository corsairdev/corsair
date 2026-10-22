import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistSubnets } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List all network subnets - GET /v1/networks/subnets
export const networkSubnetsListAll: DnsfilterEndpoints['networkSubnetsListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networkSubnetsListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsListAll']
		>('/v1/networks/subnets', ctx.key, {
			method: 'GET',
			query: {
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networkSubnetsListAll.parse(response);
		await persistSubnets(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// List network subnets - GET /v1/networks/{id}/subnets
export const networkSubnetsList: DnsfilterEndpoints['networkSubnetsList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networkSubnetsList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsList']
		>('/v1/networks/{id}/subnets', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
			query: {
				page: values.page,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networkSubnetsList.parse(response);
		await persistSubnets(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create a network subnet - POST /v1/networks/{id}/subnets
export const networkSubnetsCreate: DnsfilterEndpoints['networkSubnetsCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networkSubnetsCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsCreate']
		>('/v1/networks/{id}/subnets', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
			body: {
				network_subnet: values.network_subnet,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networkSubnetsCreate.parse(response);
		await persistSubnets(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a network subnet - GET /v1/networks/{id}/subnets/{subnet_id}
export const networkSubnetsGet: DnsfilterEndpoints['networkSubnetsGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networkSubnetsGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsGet']
		>('/v1/networks/{id}/subnets/{subnet_id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
				subnet_id: values.subnet_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networkSubnetsGet.parse(response);
		await persistSubnets(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update a network subnet - PATCH /v1/networks/{id}/subnets/{subnet_id}
export const networkSubnetsUpdate: DnsfilterEndpoints['networkSubnetsUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networkSubnetsUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsUpdate']
		>('/v1/networks/{id}/subnets/{subnet_id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
				subnet_id: values.subnet_id,
			},
			body: {
				network_subnet: values.network_subnet,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networkSubnetsUpdate.parse(response);
		await persistSubnets(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete a network subnet - DELETE /v1/networks/{id}/subnets/{subnet_id}
export const networkSubnetsDelete: DnsfilterEndpoints['networkSubnetsDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networkSubnetsDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsDelete']
		>('/v1/networks/{id}/subnets/{subnet_id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
				subnet_id: values.subnet_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networkSubnetsDelete.parse(response);
		try {
			await ctx.db.subnets.deleteByEntityId(String(values.subnet_id));
		} catch (error) {
			console.warn('Failed to evict DNSFilter subnets row:', error);
		}
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
