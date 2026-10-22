import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List enterprise connections - GET /v1/enterprise_connections
export const enterpriseConnectionsList: DnsfilterEndpoints['enterpriseConnectionsList'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.enterpriseConnectionsList.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['enterpriseConnectionsList']
		>('/v1/enterprise_connections', ctx.key, {
			method: 'GET',
			query: {
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.enterpriseConnectionsList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.enterpriseConnections.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create an enterprise connection - POST /v1/enterprise_connections
export const enterpriseConnectionsCreate: DnsfilterEndpoints['enterpriseConnectionsCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.enterpriseConnectionsCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['enterpriseConnectionsCreate']
		>('/v1/enterprise_connections', ctx.key, {
			method: 'POST',
			body: {
				organization_id: values.organization_id,
				default_organization_id: values.default_organization_id,
				strategy: values.strategy,
				display_name: values.display_name,
				role_default: values.role_default,
				role_map: values.role_map,
				options: values.options,
				idp: values.idp,
				authorized_domains: values.authorized_domains,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.enterpriseConnectionsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.enterpriseConnections.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get an enterprise connection - GET /v1/enterprise_connections/{id}
export const enterpriseConnectionsGet: DnsfilterEndpoints['enterpriseConnectionsGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.enterpriseConnectionsGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['enterpriseConnectionsGet']
		>('/v1/enterprise_connections/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.enterpriseConnectionsGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.enterpriseConnections.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update an enterprise connection - PATCH /v1/enterprise_connections/{id}
export const enterpriseConnectionsUpdate: DnsfilterEndpoints['enterpriseConnectionsUpdate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.enterpriseConnectionsUpdate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['enterpriseConnectionsUpdate']
		>('/v1/enterprise_connections/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
			body: {
				organization_id: values.organization_id,
				default_organization_id: values.default_organization_id,
				display_name: values.display_name,
				role_default: values.role_default,
				role_map: values.role_map,
				options: values.options,
				idp: values.idp,
				authorized_domains: values.authorized_domains,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.enterpriseConnectionsUpdate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.enterpriseConnections.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete an enterprise connection - DELETE /v1/enterprise_connections/{id}
export const enterpriseConnectionsDelete: DnsfilterEndpoints['enterpriseConnectionsDelete'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.enterpriseConnectionsDelete.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['enterpriseConnectionsDelete']
		>('/v1/enterprise_connections/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.enterpriseConnectionsDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.enterpriseConnections.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
