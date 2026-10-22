import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistSubnets } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// List all network subnets - GET /v1/networks/subnets
export const networkSubnetsListAll: DnsfilterEndpoints['networkSubnetsListAll'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsListAll']
		>('/v1/networks/subnets', ctx.key, {
			method: 'GET',
			query: {
				organization_id: input.organization_id,
			},
		});
		await persistSubnets(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.listAll',
			input ?? {},
			'completed',
		);
		return response;
	};

// List network subnets - GET /v1/networks/{id}/subnets
export const networkSubnetsList: DnsfilterEndpoints['networkSubnetsList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsList']
		>('/v1/networks/{id}/subnets', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
			query: {
				page: input.page,
			},
		});
		await persistSubnets(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Create a network subnet - POST /v1/networks/{id}/subnets
export const networkSubnetsCreate: DnsfilterEndpoints['networkSubnetsCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsCreate']
		>('/v1/networks/{id}/subnets', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
			body: {
				network_subnet: input.network_subnet,
			},
		});
		await persistSubnets(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a network subnet - GET /v1/networks/{id}/subnets/{subnet_id}
export const networkSubnetsGet: DnsfilterEndpoints['networkSubnetsGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsGet']
		>('/v1/networks/{id}/subnets/{subnet_id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
				subnet_id: input.subnet_id,
			},
		});
		await persistSubnets(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update a network subnet - PATCH /v1/networks/{id}/subnets/{subnet_id}
export const networkSubnetsUpdate: DnsfilterEndpoints['networkSubnetsUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsUpdate']
		>('/v1/networks/{id}/subnets/{subnet_id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
				subnet_id: input.subnet_id,
			},
			body: {
				network_subnet: input.network_subnet,
			},
		});
		await persistSubnets(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete a network subnet - DELETE /v1/networks/{id}/subnets/{subnet_id}
export const networkSubnetsDelete: DnsfilterEndpoints['networkSubnetsDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkSubnetsDelete']
		>('/v1/networks/{id}/subnets/{subnet_id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
				subnet_id: input.subnet_id,
			},
		});
		await persistSubnets(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkSubnets.delete',
			input ?? {},
			'completed',
		);
		return response;
	};
