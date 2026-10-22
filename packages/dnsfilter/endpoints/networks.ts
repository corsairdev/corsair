import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistNetworks } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List networks - GET /v1/networks
export const networksList: DnsfilterEndpoints['networksList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksList.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksList']
	>('/v1/networks', ctx.key, {
		method: 'GET',
		query: {
			basic_info: values.basic_info,
			count_network_ips: values.count_network_ips,
			force_truncate_ips: values.force_truncate_ips,
			page: values.page,
			protected: values.protected,
			search: values.search,
			unprotected: values.unprotected,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.networksList.parse(response);
	await persistNetworks(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Create a network - POST /v1/networks
export const networksCreate: DnsfilterEndpoints['networksCreate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksCreate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksCreate']
	>('/v1/networks', ctx.key, {
		method: 'POST',
		body: {
			network: values.network,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.networksCreate.parse(response);
	await persistNetworks(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.create',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List all networks - GET /v1/networks/all
export const networksListAll: DnsfilterEndpoints['networksListAll'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksListAll.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksListAll']
	>('/v1/networks/all', ctx.key, {
		method: 'GET',
		query: {
			basic_info: values.basic_info,
			count_network_ips: values.count_network_ips,
			force_truncate_ips: values.force_truncate_ips,
			page: values.page,
			protected: values.protected,
			search: values.search,
			unprotected: values.unprotected,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.networksListAll.parse(response);
	await persistNetworks(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.listAll',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Counts for networks - GET /v1/networks/counts
export const networksCounts: DnsfilterEndpoints['networksCounts'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksCounts.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksCounts']
	>('/v1/networks/counts', ctx.key, {
		method: 'GET',
		query: {
			msp_id: values.msp_id,
			organization_ids: values.organization_ids,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.networksCounts.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.counts',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List MSP networks - GET /v1/networks/msp
export const networksMsp: DnsfilterEndpoints['networksMsp'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksMsp.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksMsp']
	>('/v1/networks/msp', ctx.key, {
		method: 'GET',
		query: {
			basic_info: values.basic_info,
			count_network_ips: values.count_network_ips,
			force_truncate_ips: values.force_truncate_ips,
			organization_id: values.organization_id,
			page: values.page,
			protected: values.protected,
			unprotected: values.unprotected,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.networksMsp.parse(response);
	await persistNetworks(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.msp',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List all MSP networks - GET /v1/networks/msp/all
export const networksMspAll: DnsfilterEndpoints['networksMspAll'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksMspAll.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksMspAll']
	>('/v1/networks/msp/all', ctx.key, {
		method: 'GET',
		query: {
			count_network_ips: values.count_network_ips,
			force_truncate_ips: values.force_truncate_ips,
			organization_id: values.organization_id,
			page: values.page,
			protected: values.protected,
			unprotected: values.unprotected,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.networksMspAll.parse(response);
	await persistNetworks(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.mspAll',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Geo for networks - GET /v1/networks/geo
export const networksGeo: DnsfilterEndpoints['networksGeo'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksGeo.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksGeo']
	>('/v1/networks/geo', ctx.key, {
		method: 'GET',
	});
	const result = DnsfilterEndpointOutputSchemas.networksGeo.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.geo',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Lookup for networks - GET /v1/networks/lookup
export const networksLookup: DnsfilterEndpoints['networksLookup'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksLookup.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksLookup']
	>('/v1/networks/lookup', ctx.key, {
		method: 'GET',
		query: {
			requesting_ip_address: values.requesting_ip_address,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.networksLookup.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.lookup',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Get a network - GET /v1/networks/{id}
export const networksGet: DnsfilterEndpoints['networksGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksGet']
	>('/v1/networks/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
		query: {
			count_network_ips: values.count_network_ips,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.networksGet.parse(response);
	await persistNetworks(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a network - PATCH /v1/networks/{id}
export const networksUpdate: DnsfilterEndpoints['networksUpdate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksUpdate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksUpdate']
	>('/v1/networks/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: values.id,
		},
		body: {
			network: values.network,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.networksUpdate.parse(response);
	await persistNetworks(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.update',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Delete a network - DELETE /v1/networks/{id}
export const networksDelete: DnsfilterEndpoints['networksDelete'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networksDelete.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networksDelete']
	>('/v1/networks/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.networksDelete.parse(response);
	try {
		await ctx.db.networks.deleteByEntityId(String(values.id));
	} catch (error) {
		console.warn('Failed to evict DNSFilter networks row:', error);
	}
	await logEventFromContext(
		ctx,
		'dnsfilter.networks.delete',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Bulk create for networks - POST /v1/networks/bulk_create
export const networksBulkCreate: DnsfilterEndpoints['networksBulkCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networksBulkCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkCreate']
		>('/v1/networks/bulk_create', ctx.key, {
			method: 'POST',
			query: {
				Network: values.Network,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networksBulkCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkCreate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk create status for networks - GET /v1/networks/bulk_create/{id}
export const networksBulkCreateStatus: DnsfilterEndpoints['networksBulkCreateStatus'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networksBulkCreateStatus.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkCreateStatus']
		>('/v1/networks/bulk_create/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networksBulkCreateStatus.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkCreateStatus',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk update for networks - POST /v1/networks/bulk_update
export const networksBulkUpdate: DnsfilterEndpoints['networksBulkUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networksBulkUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkUpdate']
		>('/v1/networks/bulk_update', ctx.key, {
			method: 'POST',
			body: {
				ids: values.ids,
				organization_id: values.organization_id,
				policy_id: values.policy_id,
				scheduled_policy_id: values.scheduled_policy_id,
				block_page_id: values.block_page_id,
				is_legacy_vpn_active: values.is_legacy_vpn_active,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networksBulkUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkUpdate',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk update status for networks - GET /v1/networks/bulk_update/{id}
export const networksBulkUpdateStatus: DnsfilterEndpoints['networksBulkUpdateStatus'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networksBulkUpdateStatus.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkUpdateStatus']
		>('/v1/networks/bulk_update/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networksBulkUpdateStatus.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkUpdateStatus',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk destroy for networks - DELETE /v1/networks/bulk_destroy
export const networksBulkDestroy: DnsfilterEndpoints['networksBulkDestroy'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networksBulkDestroy.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkDestroy']
		>('/v1/networks/bulk_destroy', ctx.key, {
			method: 'DELETE',
			body: {
				ids: values.ids,
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networksBulkDestroy.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkDestroy',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk destroy status for networks - GET /v1/networks/bulk_destroy/{id}
export const networksBulkDestroyStatus: DnsfilterEndpoints['networksBulkDestroyStatus'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.networksBulkDestroyStatus.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksBulkDestroyStatus']
		>('/v1/networks/bulk_destroy/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networksBulkDestroyStatus.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.bulkDestroyStatus',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Generate secret key for networks - POST /v1/networks/{id}/secret_key
export const networksGenerateSecretKey: DnsfilterEndpoints['networksGenerateSecretKey'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.networksGenerateSecretKey.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksGenerateSecretKey']
		>('/v1/networks/{id}/secret_key', ctx.key, {
			method: 'POST',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networksGenerateSecretKey.parse(response);
		await persistNetworks(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.generateSecretKey',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Revoke secret key for networks - DELETE /v1/networks/{id}/secret_key
export const networksRevokeSecretKey: DnsfilterEndpoints['networksRevokeSecretKey'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networksRevokeSecretKey.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksRevokeSecretKey']
		>('/v1/networks/{id}/secret_key', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networksRevokeSecretKey.parse(response);
		await persistNetworks(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.revokeSecretKey',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Rotate secret key for networks - PATCH /v1/networks/{id}/secret_key
export const networksRotateSecretKey: DnsfilterEndpoints['networksRotateSecretKey'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networksRotateSecretKey.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networksRotateSecretKey']
		>('/v1/networks/{id}/secret_key', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networksRotateSecretKey.parse(response);
		await persistNetworks(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.networks.rotateSecretKey',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
