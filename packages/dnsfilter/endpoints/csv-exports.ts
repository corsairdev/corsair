import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Download user agents CSV - GET /v1/user_agents/csv
export const csvExportsUserAgentsCsv: DnsfilterEndpoints['csvExportsUserAgentsCsv'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.csvExportsUserAgentsCsv.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsUserAgentsCsv']
		>('/v1/user_agents/csv', ctx.key, {
			method: 'GET',
			query: {
				organization_id: values.organization_id,
				include_suborgs: values.include_suborgs,
				timezone: values.timezone,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsUserAgentsCsv.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.userAgentsCsv',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create user agent CSV export - POST /v1/user_agent_csv_exports
export const csvExportsUserAgentCreate: DnsfilterEndpoints['csvExportsUserAgentCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.csvExportsUserAgentCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsUserAgentCreate']
		>('/v1/user_agent_csv_exports', ctx.key, {
			method: 'POST',
			body: values,
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsUserAgentCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.userAgentCreate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Show user agent CSV export - GET /v1/user_agent_csv_exports/{id}
export const csvExportsUserAgentGet: DnsfilterEndpoints['csvExportsUserAgentGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.csvExportsUserAgentGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsUserAgentGet']
		>('/v1/user_agent_csv_exports/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsUserAgentGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.userAgentGet',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create agent local users CSV export - POST /v2/agent_local_users_csv_export
export const csvExportsAgentLocalUsersCreate: DnsfilterEndpoints['csvExportsAgentLocalUsersCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.csvExportsAgentLocalUsersCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsAgentLocalUsersCreate']
		>('/v2/agent_local_users_csv_export', ctx.key, {
			method: 'POST',
			body: values,
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsAgentLocalUsersCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.agentLocalUsersCreate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Show agent local users CSV export -
// GET /v2/agent_local_users_csv_export/{id}
export const csvExportsAgentLocalUsersGet: DnsfilterEndpoints['csvExportsAgentLocalUsersGet'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.csvExportsAgentLocalUsersGet.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsAgentLocalUsersGet']
		>('/v2/agent_local_users_csv_export/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsAgentLocalUsersGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.agentLocalUsersGet',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create CyberSight CSV export - POST /v2/cyber_sight/csv_exports/create
export const csvExportsCyberSightCreate: DnsfilterEndpoints['csvExportsCyberSightCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.csvExportsCyberSightCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsCyberSightCreate']
		>('/v2/cyber_sight/csv_exports/create', ctx.key, {
			method: 'POST',
			query: {
				ai_tool: values.ai_tool,
				end_at: values.end_at,
				included_columns: values.included_columns,
				report_type: values.report_type,
				start_at: values.start_at,
			},
			body: {
				...values,
				// Documented as a query parameter; the body nests it instead.
				included_columns: undefined,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsCyberSightCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.cyberSightCreate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Show CyberSight CSV export - GET /v2/cyber_sight/csv_exports/{id}
export const csvExportsCyberSightGet: DnsfilterEndpoints['csvExportsCyberSightGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.csvExportsCyberSightGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsCyberSightGet']
		>('/v2/cyber_sight/csv_exports/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsCyberSightGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.cyberSightGet',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create networks CSV export - POST /v2/networks_csv_export
export const csvExportsNetworksCreate: DnsfilterEndpoints['csvExportsNetworksCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.csvExportsNetworksCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsNetworksCreate']
		>('/v2/networks_csv_export', ctx.key, {
			method: 'POST',
			query: {
				ip_search: values.ip_search,
				protected: values.protected,
				search: values.search,
				state: values.state,
				unprotected: values.unprotected,
			},
			body: {
				networks_csv_export: values.networks_csv_export,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsNetworksCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.networksCreate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Show networks CSV export - GET /v2/networks_csv_export/{id}
export const csvExportsNetworksGet: DnsfilterEndpoints['csvExportsNetworksGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.csvExportsNetworksGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsNetworksGet']
		>('/v2/networks_csv_export/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsNetworksGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.networksGet',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Create unblock requests CSV export - POST /v2/unblock_requests_csv_export
export const csvExportsUnblockRequestsCreate: DnsfilterEndpoints['csvExportsUnblockRequestsCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.csvExportsUnblockRequestsCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsUnblockRequestsCreate']
		>('/v2/unblock_requests_csv_export', ctx.key, {
			method: 'POST',
			query: {
				msp_id: values.msp_id,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
				search: values.search,
				sort: values.sort,
				tab: values.tab,
			},
			body: {
				unblock_requests_csv_export: values.unblock_requests_csv_export,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsUnblockRequestsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.unblockRequestsCreate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Show unblock requests CSV export -
// GET /v2/unblock_requests_csv_export/{id}
export const csvExportsUnblockRequestsGet: DnsfilterEndpoints['csvExportsUnblockRequestsGet'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.csvExportsUnblockRequestsGet.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['csvExportsUnblockRequestsGet']
		>('/v2/unblock_requests_csv_export/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.csvExportsUnblockRequestsGet.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.csvExports.unblockRequestsGet',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
