import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List enterprise connections - GET /v1/enterprise_connections
export const enterpriseConnectionsList: DnsfilterEndpoints['enterpriseConnectionsList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['enterpriseConnectionsList']
		>('/v1/enterprise_connections', ctx.key, {
			method: 'GET',
			query: {
				organization_id: input.organization_id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.enterpriseConnections.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Create an enterprise connection - POST /v1/enterprise_connections
export const enterpriseConnectionsCreate: DnsfilterEndpoints['enterpriseConnectionsCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['enterpriseConnectionsCreate']
		>('/v1/enterprise_connections', ctx.key, {
			method: 'POST',
			body: {
				organization_id: input.organization_id,
				default_organization_id: input.default_organization_id,
				strategy: input.strategy,
				display_name: input.display_name,
				role_default: input.role_default,
				role_map: input.role_map,
				options: input.options,
				idp: input.idp,
				authorized_domains: input.authorized_domains,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.enterpriseConnections.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get an enterprise connection - GET /v1/enterprise_connections/{id}
export const enterpriseConnectionsGet: DnsfilterEndpoints['enterpriseConnectionsGet'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['enterpriseConnectionsGet']
		>('/v1/enterprise_connections/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.enterpriseConnections.get',
			input ?? {},
			'completed',
		);
		return response;
	};

// Update an enterprise connection - PATCH /v1/enterprise_connections/{id}
export const enterpriseConnectionsUpdate: DnsfilterEndpoints['enterpriseConnectionsUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['enterpriseConnectionsUpdate']
		>('/v1/enterprise_connections/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
			},
			body: {
				organization_id: input.organization_id,
				default_organization_id: input.default_organization_id,
				display_name: input.display_name,
				role_default: input.role_default,
				role_map: input.role_map,
				options: input.options,
				idp: input.idp,
				authorized_domains: input.authorized_domains,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.enterpriseConnections.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete an enterprise connection - DELETE /v1/enterprise_connections/{id}
export const enterpriseConnectionsDelete: DnsfilterEndpoints['enterpriseConnectionsDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['enterpriseConnectionsDelete']
		>('/v1/enterprise_connections/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.enterpriseConnections.delete',
			input ?? {},
			'completed',
		);
		return response;
	};
