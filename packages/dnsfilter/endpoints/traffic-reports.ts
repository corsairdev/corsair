import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Total requests for traffic reports - GET /v1/traffic_reports/total_requests
export const trafficReportsTotalRequests: DnsfilterEndpoints['trafficReportsTotalRequests'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalRequests.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequests']
		>('/v1/traffic_reports/total_requests', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_networks: values.show_individual_networks,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalRequests.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequests',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total requests geo for traffic reports - GET /v1/traffic_reports/total_requests_geo
export const trafficReportsTotalRequestsGeo: DnsfilterEndpoints['trafficReportsTotalRequestsGeo'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalRequestsGeo.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequestsGeo']
		>('/v1/traffic_reports/total_requests_geo', ctx.key, {
			method: 'GET',
			query: {
				from: values.from,
				limit: values.limit,
				msp_id: values.msp_id,
				organization_ids: values.organization_ids,
				to: values.to,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalRequestsGeo.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequestsGeo',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total requests organizations for traffic reports - GET /v1/traffic_reports/total_requests_organizations
export const trafficReportsTotalRequestsOrganizations: DnsfilterEndpoints['trafficReportsTotalRequestsOrganizations'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalRequestsOrganizations.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequestsOrganizations']
		>('/v1/traffic_reports/total_requests_organizations', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_organizations: values.show_individual_organizations,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalRequestsOrganizations.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequestsOrganizations',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total requests agents for traffic reports - GET /v1/traffic_reports/total_requests_agents
export const trafficReportsTotalRequestsAgents: DnsfilterEndpoints['trafficReportsTotalRequestsAgents'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalRequestsAgents.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequestsAgents']
		>('/v1/traffic_reports/total_requests_agents', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_agents: values.show_individual_agents,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalRequestsAgents.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequestsAgents',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total requests users for traffic reports - GET /v1/traffic_reports/total_requests_users
export const trafficReportsTotalRequestsUsers: DnsfilterEndpoints['trafficReportsTotalRequestsUsers'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalRequestsUsers.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequestsUsers']
		>('/v1/traffic_reports/total_requests_users', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_users: values.show_individual_users,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalRequestsUsers.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequestsUsers',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total requests collections for traffic reports - GET /v1/traffic_reports/total_requests_collections
export const trafficReportsTotalRequestsCollections: DnsfilterEndpoints['trafficReportsTotalRequestsCollections'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalRequestsCollections.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequestsCollections']
		>('/v1/traffic_reports/total_requests_collections', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_collections: values.show_individual_collections,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalRequestsCollections.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequestsCollections',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total threats for traffic reports - GET /v1/traffic_reports/total_threats
export const trafficReportsTotalThreats: DnsfilterEndpoints['trafficReportsTotalThreats'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalThreats.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalThreats']
		>('/v1/traffic_reports/total_threats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				show_individual_networks: values.show_individual_networks,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalThreats.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalThreats',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total threats organizations for traffic reports - GET /v1/traffic_reports/total_threats_organizations
export const trafficReportsTotalThreatsOrganizations: DnsfilterEndpoints['trafficReportsTotalThreatsOrganizations'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalThreatsOrganizations.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalThreatsOrganizations']
		>('/v1/traffic_reports/total_threats_organizations', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				show_individual_organizations: values.show_individual_organizations,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalThreatsOrganizations.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalThreatsOrganizations',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total threats users for traffic reports - GET /v1/traffic_reports/total_threats_users
export const trafficReportsTotalThreatsUsers: DnsfilterEndpoints['trafficReportsTotalThreatsUsers'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalThreatsUsers.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalThreatsUsers']
		>('/v1/traffic_reports/total_threats_users', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				show_individual_users: values.show_individual_users,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalThreatsUsers.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalThreatsUsers',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total categories for traffic reports - GET /v1/traffic_reports/total_categories
export const trafficReportsTotalCategories: DnsfilterEndpoints['trafficReportsTotalCategories'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalCategories.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalCategories']
		>('/v1/traffic_reports/total_categories', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_networks: values.show_individual_networks,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalCategories.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalCategories',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total categories organizations for traffic reports - GET /v1/traffic_reports/total_categories_organizations
export const trafficReportsTotalCategoriesOrganizations: DnsfilterEndpoints['trafficReportsTotalCategoriesOrganizations'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalCategoriesOrganizations.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalCategoriesOrganizations']
		>('/v1/traffic_reports/total_categories_organizations', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_organizations: values.show_individual_organizations,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalCategoriesOrganizations.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalCategoriesOrganizations',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total domains for traffic reports - GET /v1/traffic_reports/total_domains
export const trafficReportsTotalDomains: DnsfilterEndpoints['trafficReportsTotalDomains'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalDomains.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalDomains']
		>('/v1/traffic_reports/total_domains', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				category_ids: values.category_ids,
				collection_ids: values.collection_ids,
				domain: values.domain,
				from: values.from,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_networks: values.show_individual_networks,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalDomains.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalDomains',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total domains organizations for traffic reports - GET /v1/traffic_reports/total_domains_organizations
export const trafficReportsTotalDomainsOrganizations: DnsfilterEndpoints['trafficReportsTotalDomainsOrganizations'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalDomainsOrganizations.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalDomainsOrganizations']
		>('/v1/traffic_reports/total_domains_organizations', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				category_ids: values.category_ids,
				collection_ids: values.collection_ids,
				domain: values.domain,
				from: values.from,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_organizations: values.show_individual_organizations,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalDomainsOrganizations.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalDomainsOrganizations',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total domains users for traffic reports - GET /v1/traffic_reports/total_domains_users
export const trafficReportsTotalDomainsUsers: DnsfilterEndpoints['trafficReportsTotalDomainsUsers'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalDomainsUsers.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalDomainsUsers']
		>('/v1/traffic_reports/total_domains_users', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				category_ids: values.category_ids,
				collection_ids: values.collection_ids,
				domain: values.domain,
				from: values.from,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_users: values.show_individual_users,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalDomainsUsers.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalDomainsUsers',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// QPS for traffic reports - GET /v1/traffic_reports/qps
export const trafficReportsQps: DnsfilterEndpoints['trafficReportsQps'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.trafficReportsQps.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsQps']
		>('/v1/traffic_reports/qps', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				show_individual_networks: values.show_individual_networks,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsQps.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.qps',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// QPS active organizations for traffic reports - GET /v1/traffic_reports/qps_active_organizations
export const trafficReportsQpsActiveOrganizations: DnsfilterEndpoints['trafficReportsQpsActiveOrganizations'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsQpsActiveOrganizations.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsQpsActiveOrganizations']
		>('/v1/traffic_reports/qps_active_organizations', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsQpsActiveOrganizations.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.qpsActiveOrganizations',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// QPS active agents for traffic reports - GET /v1/traffic_reports/qps_active_agents
export const trafficReportsQpsActiveAgents: DnsfilterEndpoints['trafficReportsQpsActiveAgents'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsQpsActiveAgents.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsQpsActiveAgents']
		>('/v1/traffic_reports/qps_active_agents', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsQpsActiveAgents.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.qpsActiveAgents',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Top domains for traffic reports - GET /v1/traffic_reports/top_domains
export const trafficReportsTopDomains: DnsfilterEndpoints['trafficReportsTopDomains'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.trafficReportsTopDomains.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopDomains']
		>('/v1/traffic_reports/top_domains', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				category_ids: values.category_ids,
				collection_ids: values.collection_ids,
				domain: values.domain,
				fqdn: values.fqdn,
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				page: values.page,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTopDomains.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topDomains',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Top categories for traffic reports - GET /v1/traffic_reports/top_categories
export const trafficReportsTopCategories: DnsfilterEndpoints['trafficReportsTopCategories'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTopCategories.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopCategories']
		>('/v1/traffic_reports/top_categories', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				page: values.page,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTopCategories.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topCategories',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Top application categories for traffic reports - GET /v1/traffic_reports/top_application_categories
export const trafficReportsTopApplicationCategories: DnsfilterEndpoints['trafficReportsTopApplicationCategories'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTopApplicationCategories.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopApplicationCategories']
		>('/v1/traffic_reports/top_application_categories', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				page: values.page,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTopApplicationCategories.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topApplicationCategories',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Top networks for traffic reports - GET /v1/traffic_reports/top_networks
export const trafficReportsTopNetworks: DnsfilterEndpoints['trafficReportsTopNetworks'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTopNetworks.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopNetworks']
		>('/v1/traffic_reports/top_networks', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				page: values.page,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTopNetworks.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topNetworks',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Top agents for traffic reports - GET /v1/traffic_reports/top_agents
export const trafficReportsTopAgents: DnsfilterEndpoints['trafficReportsTopAgents'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.trafficReportsTopAgents.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopAgents']
		>('/v1/traffic_reports/top_agents', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				page: values.page,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTopAgents.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topAgents',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Top users for traffic reports - GET /v1/traffic_reports/top_users
export const trafficReportsTopUsers: DnsfilterEndpoints['trafficReportsTopUsers'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.trafficReportsTopUsers.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopUsers']
		>('/v1/traffic_reports/top_users', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				page: values.page,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTopUsers.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topUsers',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Top collections for traffic reports - GET /v1/traffic_reports/top_collections
export const trafficReportsTopCollections: DnsfilterEndpoints['trafficReportsTopCollections'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTopCollections.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopCollections']
		>('/v1/traffic_reports/top_collections', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				page: values.page,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTopCollections.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topCollections',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Query logs for traffic reports - GET /v1/traffic_reports/query_logs
export const trafficReportsQueryLogs: DnsfilterEndpoints['trafficReportsQueryLogs'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.trafficReportsQueryLogs.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsQueryLogs']
		>('/v1/traffic_reports/query_logs', ctx.key, {
			method: 'GET',
			query: {
				agent_id: values.agent_id,
				agent_ids: values.agent_ids,
				application_category_ids: values.application_category_ids,
				application_ids: values.application_ids,
				category_ids: values.category_ids,
				collection_id: values.collection_id,
				collection_ids: values.collection_ids,
				domain: values.domain,
				exclude_category_ids: values.exclude_category_ids,
				exclude_domain: values.exclude_domain,
				fqdn: values.fqdn,
				from: values.from,
				mac_addresses: values.mac_addresses,
				nat_ips: values.nat_ips,
				network_id: values.network_id,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				page: values.page,
				policy_ids: values.policy_ids,
				private_ip: values.private_ip,
				private_ip_from: values.private_ip_from,
				private_ip_to: values.private_ip_to,
				question_type: values.question_type,
				result: values.result,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				user_id: values.user_id,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsQueryLogs.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.queryLogs',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total organizations stats for traffic reports - GET /v1/traffic_reports/total_organizations_stats
export const trafficReportsTotalOrganizationsStats: DnsfilterEndpoints['trafficReportsTotalOrganizationsStats'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalOrganizationsStats.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalOrganizationsStats']
		>('/v1/traffic_reports/total_organizations_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_category_ids: values.application_category_ids,
				bucket_size: values.bucket_size,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				name: values.name,
				organization_id: values.organization_id,
				security_report: values.security_report,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalOrganizationsStats.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalOrganizationsStats',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total domain stats for traffic reports - GET /v1/traffic_reports/total_domain_stats
export const trafficReportsTotalDomainStats: DnsfilterEndpoints['trafficReportsTotalDomainStats'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalDomainStats.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalDomainStats']
		>('/v1/traffic_reports/total_domain_stats', ctx.key, {
			method: 'GET',
			query: {
				domain: values.domain,
				fqdn: values.fqdn,
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				to: values.to,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalDomainStats.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalDomainStats',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total category stats for traffic reports - GET /v1/traffic_reports/total_category_stats
export const trafficReportsTotalCategoryStats: DnsfilterEndpoints['trafficReportsTotalCategoryStats'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalCategoryStats.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalCategoryStats']
		>('/v1/traffic_reports/total_category_stats', ctx.key, {
			method: 'GET',
			query: {
				category_ids: values.category_ids,
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				to: values.to,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalCategoryStats.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalCategoryStats',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total organizations requests for traffic reports - GET /v1/traffic_reports/total_organizations_requests
export const trafficReportsTotalOrganizationsRequests: DnsfilterEndpoints['trafficReportsTotalOrganizationsRequests'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalOrganizationsRequests.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalOrganizationsRequests']
		>('/v1/traffic_reports/total_organizations_requests', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_ids: values.application_ids,
				bucket_size: values.bucket_size,
				category_ids: values.category_ids,
				collection_ids: values.collection_ids,
				domain: values.domain,
				fqdn: values.fqdn,
				from: values.from,
				msp_id: values.msp_id,
				name: values.name,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalOrganizationsRequests.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalOrganizationsRequests',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Top organizations requests for traffic reports - GET /v1/traffic_reports/top_organizations_requests
export const trafficReportsTopOrganizationsRequests: DnsfilterEndpoints['trafficReportsTopOrganizationsRequests'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTopOrganizationsRequests.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopOrganizationsRequests']
		>('/v1/traffic_reports/top_organizations_requests', ctx.key, {
			method: 'GET',
			query: {
				bucket_size: values.bucket_size,
				from: values.from,
				msp_id: values.msp_id,
				organization_id: values.organization_id,
				page: values.page,
				to: values.to,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTopOrganizationsRequests.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topOrganizationsRequests',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total client stats for traffic reports - GET /v1/traffic_reports/total_client_stats
export const trafficReportsTotalClientStats: DnsfilterEndpoints['trafficReportsTotalClientStats'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalClientStats.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalClientStats']
		>('/v1/traffic_reports/total_client_stats', ctx.key, {
			method: 'GET',
			query: {
				from: values.from,
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				to: values.to,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalClientStats.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalClientStats',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total deployments for traffic reports - GET /v1/traffic_reports/total_deployments
export const trafficReportsTotalDeployments: DnsfilterEndpoints['trafficReportsTotalDeployments'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalDeployments.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalDeployments']
		>('/v1/traffic_reports/total_deployments', ctx.key, {
			method: 'GET',
			query: {
				msp_id: values.msp_id,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalDeployments.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalDeployments',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total roaming clients for traffic reports - GET /v1/traffic_reports/total_roaming_clients
export const trafficReportsTotalRoamingClients: DnsfilterEndpoints['trafficReportsTotalRoamingClients'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalRoamingClients.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRoamingClients']
		>('/v1/traffic_reports/total_roaming_clients', ctx.key, {
			method: 'GET',
			query: {
				msp_id: values.msp_id,
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalRoamingClients.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRoamingClients',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total applications stats for traffic reports - GET /v1/traffic_reports/total_applications_stats
export const trafficReportsTotalApplicationsStats: DnsfilterEndpoints['trafficReportsTotalApplicationsStats'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalApplicationsStats.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalApplicationsStats']
		>('/v1/traffic_reports/total_applications_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_category_ids: values.application_category_ids,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				msp_id: values.msp_id,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalApplicationsStats.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalApplicationsStats',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total applications networks stats for traffic reports - GET /v1/traffic_reports/total_applications_networks_stats
export const trafficReportsTotalApplicationsNetworksStats: DnsfilterEndpoints['trafficReportsTotalApplicationsNetworksStats'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalApplicationsNetworksStats.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalApplicationsNetworksStats']
		>('/v1/traffic_reports/total_applications_networks_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_category_ids: values.application_category_ids,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalApplicationsNetworksStats.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalApplicationsNetworksStats',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total applications agents stats for traffic reports - GET /v1/traffic_reports/total_applications_agents_stats
export const trafficReportsTotalApplicationsAgentsStats: DnsfilterEndpoints['trafficReportsTotalApplicationsAgentsStats'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalApplicationsAgentsStats.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalApplicationsAgentsStats']
		>('/v1/traffic_reports/total_applications_agents_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_category_ids: values.application_category_ids,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalApplicationsAgentsStats.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalApplicationsAgentsStats',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total applications users stats for traffic reports - GET /v1/traffic_reports/total_applications_users_stats
export const trafficReportsTotalApplicationsUsersStats: DnsfilterEndpoints['trafficReportsTotalApplicationsUsersStats'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalApplicationsUsersStats.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalApplicationsUsersStats']
		>('/v1/traffic_reports/total_applications_users_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_category_ids: values.application_category_ids,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalApplicationsUsersStats.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalApplicationsUsersStats',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Total applications collections stats for traffic reports - GET /v1/traffic_reports/total_applications_collections_stats
export const trafficReportsTotalApplicationsCollectionsStats: DnsfilterEndpoints['trafficReportsTotalApplicationsCollectionsStats'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.trafficReportsTotalApplicationsCollectionsStats.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalApplicationsCollectionsStats']
		>('/v1/traffic_reports/total_applications_collections_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: values.agent_ids,
				agent_types: values.agent_types,
				application_category_ids: values.application_category_ids,
				application_ids: values.application_ids,
				collection_ids: values.collection_ids,
				from: values.from,
				name: values.name,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				security_report: values.security_report,
				source: values.source,
				to: values.to,
				type: values.type,
				user_ids: values.user_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.trafficReportsTotalApplicationsCollectionsStats.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalApplicationsCollectionsStats',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
