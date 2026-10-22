import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistNetworks } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// List networks - GET /v1/networks
export const networksList: DnsfilterEndpoints['networksList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksList']
	>('/v1/networks', ctx.key, {
		method: 'GET',
		query: {
			basic_info: input.basic_info,
			count_network_ips: input.count_network_ips,
			force_truncate_ips: input.force_truncate_ips,
			page: input.page,
			protected: input.protected,
			search: input.search,
			unprotected: input.unprotected,
		},
	});
	await persistNetworks(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.list',
		input ?? {},
		'completed',
	);
	return response;
};

// Create a network - POST /v1/networks
export const networksCreate: DnsfilterEndpoints['networksCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksCreate']
	>('/v1/networks', ctx.key, {
		method: 'POST',
		body: {
			network: input.network,
		},
	});
	await persistNetworks(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.create',
		input ?? {},
		'completed',
	);
	return response;
};

// List all networks - GET /v1/networks/all
export const networksListAll: DnsfilterEndpoints['networksListAll'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksListAll']
	>('/v1/networks/all', ctx.key, {
		method: 'GET',
		query: {
			basic_info: input.basic_info,
			count_network_ips: input.count_network_ips,
			force_truncate_ips: input.force_truncate_ips,
			page: input.page,
			protected: input.protected,
			search: input.search,
			unprotected: input.unprotected,
		},
	});
	await persistNetworks(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.listAll',
		input ?? {},
		'completed',
	);
	return response;
};

// Counts for networks - GET /v1/networks/counts
export const networksCounts: DnsfilterEndpoints['networksCounts'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksCounts']
	>('/v1/networks/counts', ctx.key, {
		method: 'GET',
		query: {
			msp_id: input.msp_id,
			organization_ids: input.organization_ids,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.counts',
		input ?? {},
		'completed',
	);
	return response;
};

// List MSP networks - GET /v1/networks/msp
export const networksMsp: DnsfilterEndpoints['networksMsp'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksMsp']
	>('/v1/networks/msp', ctx.key, {
		method: 'GET',
		query: {
			basic_info: input.basic_info,
			count_network_ips: input.count_network_ips,
			force_truncate_ips: input.force_truncate_ips,
			organization_id: input.organization_id,
			page: input.page,
			protected: input.protected,
			unprotected: input.unprotected,
		},
	});
	await persistNetworks(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.msp',
		input ?? {},
		'completed',
	);
	return response;
};

// List all MSP networks - GET /v1/networks/msp/all
export const networksMspAll: DnsfilterEndpoints['networksMspAll'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksMspAll']
	>('/v1/networks/msp/all', ctx.key, {
		method: 'GET',
		query: {
			count_network_ips: input.count_network_ips,
			force_truncate_ips: input.force_truncate_ips,
			organization_id: input.organization_id,
			page: input.page,
			protected: input.protected,
			unprotected: input.unprotected,
		},
	});
	await persistNetworks(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.mspAll',
		input ?? {},
		'completed',
	);
	return response;
};

// Geo for networks - GET /v1/networks/geo
export const networksGeo: DnsfilterEndpoints['networksGeo'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksGeo']
	>('/v1/networks/geo', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.geo',
		input ?? {},
		'completed',
	);
	return response;
};

// Lookup for networks - GET /v1/networks/lookup
export const networksLookup: DnsfilterEndpoints['networksLookup'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksLookup']
	>('/v1/networks/lookup', ctx.key, {
		method: 'GET',
		query: {
			requesting_ip_address: input.requesting_ip_address,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.lookup',
		input ?? {},
		'completed',
	);
	return response;
};

// Get a network - GET /v1/networks/{id}
export const networksGet: DnsfilterEndpoints['networksGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksGet']
	>('/v1/networks/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
		query: {
			count_network_ips: input.count_network_ips,
		},
	});
	await persistNetworks(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Update a network - PATCH /v1/networks/{id}
export const networksUpdate: DnsfilterEndpoints['networksUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksUpdate']
	>('/v1/networks/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: input.id,
		},
		body: {
			network: input.network,
		},
	});
	await persistNetworks(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.update',
		input ?? {},
		'completed',
	);
	return response;
};

// Delete a network - DELETE /v1/networks/{id}
export const networksDelete: DnsfilterEndpoints['networksDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksDelete']
	>('/v1/networks/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: input.id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.delete',
		input ?? {},
		'completed',
	);
	return response;
};

// Bulk create for networks - POST /v1/networks/bulk_create
export const networksBulkCreate: DnsfilterEndpoints['networksBulkCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkCreate']
		>('/v1/networks/bulk_create', ctx.key, {
			method: 'POST',
			query: {
				Network: input.Network,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkCreate',
			input ?? {},
			'completed',
		);
		return response;
	};

// Bulk create status for networks - GET /v1/networks/bulk_create/{id}
export const networksBulkCreateStatus: DnsfilterEndpoints['networksBulkCreateStatus'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkCreateStatus']
		>('/v1/networks/bulk_create/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkCreateStatus',
			input ?? {},
			'completed',
		);
		return response;
	};

// Bulk update for networks - POST /v1/networks/bulk_update
export const networksBulkUpdate: DnsfilterEndpoints['networksBulkUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkUpdate']
		>('/v1/networks/bulk_update', ctx.key, {
			method: 'POST',
			body: {
				ids: input.ids,
				organization_id: input.organization_id,
				policy_id: input.policy_id,
				scheduled_policy_id: input.scheduled_policy_id,
				block_page_id: input.block_page_id,
				is_legacy_vpn_active: input.is_legacy_vpn_active,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkUpdate',
			input ?? {},
			'completed',
		);
		return response;
	};

// Bulk update status for networks - GET /v1/networks/bulk_update/{id}
export const networksBulkUpdateStatus: DnsfilterEndpoints['networksBulkUpdateStatus'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkUpdateStatus']
		>('/v1/networks/bulk_update/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkUpdateStatus',
			input ?? {},
			'completed',
		);
		return response;
	};

// Bulk destroy for networks - DELETE /v1/networks/bulk_destroy
export const networksBulkDestroy: DnsfilterEndpoints['networksBulkDestroy'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkDestroy']
		>('/v1/networks/bulk_destroy', ctx.key, {
			method: 'DELETE',
			body: {
				ids: input.ids,
				organization_id: input.organization_id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkDestroy',
			input ?? {},
			'completed',
		);
		return response;
	};

// Bulk destroy status for networks - GET /v1/networks/bulk_destroy/{id}
export const networksBulkDestroyStatus: DnsfilterEndpoints['networksBulkDestroyStatus'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkDestroyStatus']
		>('/v1/networks/bulk_destroy/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkDestroyStatus',
			input ?? {},
			'completed',
		);
		return response;
	};

// Generate secret key for networks - POST /v1/networks/{id}/secret_key
export const networksGenerateSecretKey: DnsfilterEndpoints['networksGenerateSecretKey'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksGenerateSecretKey']
		>('/v1/networks/{id}/secret_key', ctx.key, {
			method: 'POST',
			path: {
				id: input.id,
			},
		});
		await persistNetworks(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.generateSecretKey',
			input ?? {},
			'completed',
		);
		return response;
	};

// Revoke secret key for networks - DELETE /v1/networks/{id}/secret_key
export const networksRevokeSecretKey: DnsfilterEndpoints['networksRevokeSecretKey'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksRevokeSecretKey']
		>('/v1/networks/{id}/secret_key', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
			},
		});
		await persistNetworks(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.revokeSecretKey',
			input ?? {},
			'completed',
		);
		return response;
	};

// Rotate secret key for networks - PATCH /v1/networks/{id}/secret_key
export const networksRotateSecretKey: DnsfilterEndpoints['networksRotateSecretKey'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksRotateSecretKey']
		>('/v1/networks/{id}/secret_key', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
			},
		});
		await persistNetworks(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.rotateSecretKey',
			input ?? {},
			'completed',
		);
		return response;
	};
