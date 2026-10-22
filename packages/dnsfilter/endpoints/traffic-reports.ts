import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// Total requests for traffic reports - GET /v1/traffic_reports/total_requests
export const trafficReportsTotalRequests: DnsfilterEndpoints['trafficReportsTotalRequests'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequests']
		>('/v1/traffic_reports/total_requests', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_networks: input.show_individual_networks,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequests',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total requests geo for traffic reports - GET /v1/traffic_reports/total_requests_geo
export const trafficReportsTotalRequestsGeo: DnsfilterEndpoints['trafficReportsTotalRequestsGeo'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequestsGeo']
		>('/v1/traffic_reports/total_requests_geo', ctx.key, {
			method: 'GET',
			query: {
				from: input.from,
				limit: input.limit,
				msp_id: input.msp_id,
				organization_ids: input.organization_ids,
				to: input.to,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequestsGeo',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total requests organizations for traffic reports - GET /v1/traffic_reports/total_requests_organizations
export const trafficReportsTotalRequestsOrganizations: DnsfilterEndpoints['trafficReportsTotalRequestsOrganizations'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequestsOrganizations']
		>('/v1/traffic_reports/total_requests_organizations', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_organizations: input.show_individual_organizations,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequestsOrganizations',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total requests agents for traffic reports - GET /v1/traffic_reports/total_requests_agents
export const trafficReportsTotalRequestsAgents: DnsfilterEndpoints['trafficReportsTotalRequestsAgents'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequestsAgents']
		>('/v1/traffic_reports/total_requests_agents', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_agents: input.show_individual_agents,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequestsAgents',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total requests users for traffic reports - GET /v1/traffic_reports/total_requests_users
export const trafficReportsTotalRequestsUsers: DnsfilterEndpoints['trafficReportsTotalRequestsUsers'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequestsUsers']
		>('/v1/traffic_reports/total_requests_users', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_users: input.show_individual_users,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequestsUsers',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total requests collections for traffic reports - GET /v1/traffic_reports/total_requests_collections
export const trafficReportsTotalRequestsCollections: DnsfilterEndpoints['trafficReportsTotalRequestsCollections'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRequestsCollections']
		>('/v1/traffic_reports/total_requests_collections', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_collections: input.show_individual_collections,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRequestsCollections',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total threats for traffic reports - GET /v1/traffic_reports/total_threats
export const trafficReportsTotalThreats: DnsfilterEndpoints['trafficReportsTotalThreats'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalThreats']
		>('/v1/traffic_reports/total_threats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				show_individual_networks: input.show_individual_networks,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalThreats',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total threats organizations for traffic reports - GET /v1/traffic_reports/total_threats_organizations
export const trafficReportsTotalThreatsOrganizations: DnsfilterEndpoints['trafficReportsTotalThreatsOrganizations'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalThreatsOrganizations']
		>('/v1/traffic_reports/total_threats_organizations', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				show_individual_organizations: input.show_individual_organizations,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalThreatsOrganizations',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total threats users for traffic reports - GET /v1/traffic_reports/total_threats_users
export const trafficReportsTotalThreatsUsers: DnsfilterEndpoints['trafficReportsTotalThreatsUsers'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalThreatsUsers']
		>('/v1/traffic_reports/total_threats_users', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				show_individual_users: input.show_individual_users,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalThreatsUsers',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total categories for traffic reports - GET /v1/traffic_reports/total_categories
export const trafficReportsTotalCategories: DnsfilterEndpoints['trafficReportsTotalCategories'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalCategories']
		>('/v1/traffic_reports/total_categories', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_networks: input.show_individual_networks,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalCategories',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total categories organizations for traffic reports - GET /v1/traffic_reports/total_categories_organizations
export const trafficReportsTotalCategoriesOrganizations: DnsfilterEndpoints['trafficReportsTotalCategoriesOrganizations'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalCategoriesOrganizations']
		>('/v1/traffic_reports/total_categories_organizations', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_organizations: input.show_individual_organizations,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalCategoriesOrganizations',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total domains for traffic reports - GET /v1/traffic_reports/total_domains
export const trafficReportsTotalDomains: DnsfilterEndpoints['trafficReportsTotalDomains'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalDomains']
		>('/v1/traffic_reports/total_domains', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				category_ids: input.category_ids,
				collection_ids: input.collection_ids,
				domain: input.domain,
				from: input.from,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_networks: input.show_individual_networks,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalDomains',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total domains organizations for traffic reports - GET /v1/traffic_reports/total_domains_organizations
export const trafficReportsTotalDomainsOrganizations: DnsfilterEndpoints['trafficReportsTotalDomainsOrganizations'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalDomainsOrganizations']
		>('/v1/traffic_reports/total_domains_organizations', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				category_ids: input.category_ids,
				collection_ids: input.collection_ids,
				domain: input.domain,
				from: input.from,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_organizations: input.show_individual_organizations,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalDomainsOrganizations',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total domains users for traffic reports - GET /v1/traffic_reports/total_domains_users
export const trafficReportsTotalDomainsUsers: DnsfilterEndpoints['trafficReportsTotalDomainsUsers'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalDomainsUsers']
		>('/v1/traffic_reports/total_domains_users', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				category_ids: input.category_ids,
				collection_ids: input.collection_ids,
				domain: input.domain,
				from: input.from,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_users: input.show_individual_users,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalDomainsUsers',
			input ?? {},
			'completed',
		);
		return response;
	};

// QPS for traffic reports - GET /v1/traffic_reports/qps
export const trafficReportsQps: DnsfilterEndpoints['trafficReportsQps'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsQps']
		>('/v1/traffic_reports/qps', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				show_individual_networks: input.show_individual_networks,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.qps',
			input ?? {},
			'completed',
		);
		return response;
	};

// QPS active organizations for traffic reports - GET /v1/traffic_reports/qps_active_organizations
export const trafficReportsQpsActiveOrganizations: DnsfilterEndpoints['trafficReportsQpsActiveOrganizations'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsQpsActiveOrganizations']
		>('/v1/traffic_reports/qps_active_organizations', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.qpsActiveOrganizations',
			input ?? {},
			'completed',
		);
		return response;
	};

// QPS active agents for traffic reports - GET /v1/traffic_reports/qps_active_agents
export const trafficReportsQpsActiveAgents: DnsfilterEndpoints['trafficReportsQpsActiveAgents'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsQpsActiveAgents']
		>('/v1/traffic_reports/qps_active_agents', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.qpsActiveAgents',
			input ?? {},
			'completed',
		);
		return response;
	};

// Top domains for traffic reports - GET /v1/traffic_reports/top_domains
export const trafficReportsTopDomains: DnsfilterEndpoints['trafficReportsTopDomains'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopDomains']
		>('/v1/traffic_reports/top_domains', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				category_ids: input.category_ids,
				collection_ids: input.collection_ids,
				domain: input.domain,
				fqdn: input.fqdn,
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				page: input.page,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topDomains',
			input ?? {},
			'completed',
		);
		return response;
	};

// Top categories for traffic reports - GET /v1/traffic_reports/top_categories
export const trafficReportsTopCategories: DnsfilterEndpoints['trafficReportsTopCategories'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopCategories']
		>('/v1/traffic_reports/top_categories', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				page: input.page,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topCategories',
			input ?? {},
			'completed',
		);
		return response;
	};

// Top application categories for traffic reports - GET /v1/traffic_reports/top_application_categories
export const trafficReportsTopApplicationCategories: DnsfilterEndpoints['trafficReportsTopApplicationCategories'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopApplicationCategories']
		>('/v1/traffic_reports/top_application_categories', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				page: input.page,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topApplicationCategories',
			input ?? {},
			'completed',
		);
		return response;
	};

// Top networks for traffic reports - GET /v1/traffic_reports/top_networks
export const trafficReportsTopNetworks: DnsfilterEndpoints['trafficReportsTopNetworks'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopNetworks']
		>('/v1/traffic_reports/top_networks', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				page: input.page,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topNetworks',
			input ?? {},
			'completed',
		);
		return response;
	};

// Top agents for traffic reports - GET /v1/traffic_reports/top_agents
export const trafficReportsTopAgents: DnsfilterEndpoints['trafficReportsTopAgents'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopAgents']
		>('/v1/traffic_reports/top_agents', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				page: input.page,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topAgents',
			input ?? {},
			'completed',
		);
		return response;
	};

// Top users for traffic reports - GET /v1/traffic_reports/top_users
export const trafficReportsTopUsers: DnsfilterEndpoints['trafficReportsTopUsers'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopUsers']
		>('/v1/traffic_reports/top_users', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				page: input.page,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topUsers',
			input ?? {},
			'completed',
		);
		return response;
	};

// Top collections for traffic reports - GET /v1/traffic_reports/top_collections
export const trafficReportsTopCollections: DnsfilterEndpoints['trafficReportsTopCollections'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopCollections']
		>('/v1/traffic_reports/top_collections', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				page: input.page,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topCollections',
			input ?? {},
			'completed',
		);
		return response;
	};

// Query logs for traffic reports - GET /v1/traffic_reports/query_logs
export const trafficReportsQueryLogs: DnsfilterEndpoints['trafficReportsQueryLogs'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsQueryLogs']
		>('/v1/traffic_reports/query_logs', ctx.key, {
			method: 'GET',
			query: {
				agent_id: input.agent_id,
				agent_ids: input.agent_ids,
				application_category_ids: input.application_category_ids,
				application_ids: input.application_ids,
				category_ids: input.category_ids,
				collection_id: input.collection_id,
				collection_ids: input.collection_ids,
				domain: input.domain,
				exclude_category_ids: input.exclude_category_ids,
				exclude_domain: input.exclude_domain,
				fqdn: input.fqdn,
				from: input.from,
				mac_addresses: input.mac_addresses,
				nat_ips: input.nat_ips,
				network_id: input.network_id,
				network_ids: input.network_ids,
				organization_id: input.organization_id,
				page: input.page,
				policy_ids: input.policy_ids,
				private_ip: input.private_ip,
				private_ip_from: input.private_ip_from,
				private_ip_to: input.private_ip_to,
				question_type: input.question_type,
				result: input.result,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				user_id: input.user_id,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.queryLogs',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total organizations stats for traffic reports - GET /v1/traffic_reports/total_organizations_stats
export const trafficReportsTotalOrganizationsStats: DnsfilterEndpoints['trafficReportsTotalOrganizationsStats'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalOrganizationsStats']
		>('/v1/traffic_reports/total_organizations_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_category_ids: input.application_category_ids,
				bucket_size: input.bucket_size,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				name: input.name,
				organization_id: input.organization_id,
				security_report: input.security_report,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalOrganizationsStats',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total domain stats for traffic reports - GET /v1/traffic_reports/total_domain_stats
export const trafficReportsTotalDomainStats: DnsfilterEndpoints['trafficReportsTotalDomainStats'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalDomainStats']
		>('/v1/traffic_reports/total_domain_stats', ctx.key, {
			method: 'GET',
			query: {
				domain: input.domain,
				fqdn: input.fqdn,
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_id: input.organization_id,
				to: input.to,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalDomainStats',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total category stats for traffic reports - GET /v1/traffic_reports/total_category_stats
export const trafficReportsTotalCategoryStats: DnsfilterEndpoints['trafficReportsTotalCategoryStats'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalCategoryStats']
		>('/v1/traffic_reports/total_category_stats', ctx.key, {
			method: 'GET',
			query: {
				category_ids: input.category_ids,
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_id: input.organization_id,
				to: input.to,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalCategoryStats',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total organizations requests for traffic reports - GET /v1/traffic_reports/total_organizations_requests
export const trafficReportsTotalOrganizationsRequests: DnsfilterEndpoints['trafficReportsTotalOrganizationsRequests'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalOrganizationsRequests']
		>('/v1/traffic_reports/total_organizations_requests', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_ids: input.application_ids,
				bucket_size: input.bucket_size,
				category_ids: input.category_ids,
				collection_ids: input.collection_ids,
				domain: input.domain,
				fqdn: input.fqdn,
				from: input.from,
				msp_id: input.msp_id,
				name: input.name,
				network_ids: input.network_ids,
				organization_id: input.organization_id,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalOrganizationsRequests',
			input ?? {},
			'completed',
		);
		return response;
	};

// Top organizations requests for traffic reports - GET /v1/traffic_reports/top_organizations_requests
export const trafficReportsTopOrganizationsRequests: DnsfilterEndpoints['trafficReportsTopOrganizationsRequests'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTopOrganizationsRequests']
		>('/v1/traffic_reports/top_organizations_requests', ctx.key, {
			method: 'GET',
			query: {
				bucket_size: input.bucket_size,
				from: input.from,
				msp_id: input.msp_id,
				organization_id: input.organization_id,
				page: input.page,
				to: input.to,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.topOrganizationsRequests',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total client stats for traffic reports - GET /v1/traffic_reports/total_client_stats
export const trafficReportsTotalClientStats: DnsfilterEndpoints['trafficReportsTotalClientStats'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalClientStats']
		>('/v1/traffic_reports/total_client_stats', ctx.key, {
			method: 'GET',
			query: {
				from: input.from,
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_id: input.organization_id,
				to: input.to,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalClientStats',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total deployments for traffic reports - GET /v1/traffic_reports/total_deployments
export const trafficReportsTotalDeployments: DnsfilterEndpoints['trafficReportsTotalDeployments'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalDeployments']
		>('/v1/traffic_reports/total_deployments', ctx.key, {
			method: 'GET',
			query: {
				msp_id: input.msp_id,
				network_ids: input.network_ids,
				organization_id: input.organization_id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalDeployments',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total roaming clients for traffic reports - GET /v1/traffic_reports/total_roaming_clients
export const trafficReportsTotalRoamingClients: DnsfilterEndpoints['trafficReportsTotalRoamingClients'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalRoamingClients']
		>('/v1/traffic_reports/total_roaming_clients', ctx.key, {
			method: 'GET',
			query: {
				msp_id: input.msp_id,
				organization_id: input.organization_id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalRoamingClients',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total applications stats for traffic reports - GET /v1/traffic_reports/total_applications_stats
export const trafficReportsTotalApplicationsStats: DnsfilterEndpoints['trafficReportsTotalApplicationsStats'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalApplicationsStats']
		>('/v1/traffic_reports/total_applications_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_category_ids: input.application_category_ids,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				msp_id: input.msp_id,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalApplicationsStats',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total applications networks stats for traffic reports - GET /v1/traffic_reports/total_applications_networks_stats
export const trafficReportsTotalApplicationsNetworksStats: DnsfilterEndpoints['trafficReportsTotalApplicationsNetworksStats'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalApplicationsNetworksStats']
		>('/v1/traffic_reports/total_applications_networks_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_category_ids: input.application_category_ids,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalApplicationsNetworksStats',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total applications agents stats for traffic reports - GET /v1/traffic_reports/total_applications_agents_stats
export const trafficReportsTotalApplicationsAgentsStats: DnsfilterEndpoints['trafficReportsTotalApplicationsAgentsStats'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalApplicationsAgentsStats']
		>('/v1/traffic_reports/total_applications_agents_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_category_ids: input.application_category_ids,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalApplicationsAgentsStats',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total applications users stats for traffic reports - GET /v1/traffic_reports/total_applications_users_stats
export const trafficReportsTotalApplicationsUsersStats: DnsfilterEndpoints['trafficReportsTotalApplicationsUsersStats'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalApplicationsUsersStats']
		>('/v1/traffic_reports/total_applications_users_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_category_ids: input.application_category_ids,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalApplicationsUsersStats',
			input ?? {},
			'completed',
		);
		return response;
	};

// Total applications collections stats for traffic reports - GET /v1/traffic_reports/total_applications_collections_stats
export const trafficReportsTotalApplicationsCollectionsStats: DnsfilterEndpoints['trafficReportsTotalApplicationsCollectionsStats'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['trafficReportsTotalApplicationsCollectionsStats']
		>('/v1/traffic_reports/total_applications_collections_stats', ctx.key, {
			method: 'GET',
			query: {
				agent_ids: input.agent_ids,
				agent_types: input.agent_types,
				application_category_ids: input.application_category_ids,
				application_ids: input.application_ids,
				collection_ids: input.collection_ids,
				from: input.from,
				name: input.name,
				network_ids: input.network_ids,
				organization_ids: input.organization_ids,
				security_report: input.security_report,
				source: input.source,
				to: input.to,
				type: input.type,
				user_ids: input.user_ids,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.trafficReports.totalApplicationsCollectionsStats',
			input ?? {},
			'completed',
		);
		return response;
	};
