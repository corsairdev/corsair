import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistMacAddresses } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// List MAC addresses - GET /v1/mac_addresses
export const macAddressesList: DnsfilterEndpoints['macAddressesList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['macAddressesList']
	>('/v1/mac_addresses', ctx.key, {
		method: 'GET',
		query: {
			organization_ids: input.organization_ids,
			page: input.page,
		},
	});
	await persistMacAddresses(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.macAddresses.list',
		input ?? {},
		'completed',
	);
	return response;
};

// Create a MAC address - POST /v1/mac_addresses
export const macAddressesCreate: DnsfilterEndpoints['macAddressesCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['macAddressesCreate']
		>('/v1/mac_addresses', ctx.key, {
			method: 'POST',
			body: {
				mac_address: input.mac_address,
			},
		});
		await persistMacAddresses(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.macAddresses.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// List all MAC addresses - GET /v1/mac_addresses/all
export const macAddressesListAll: DnsfilterEndpoints['macAddressesListAll'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['macAddressesListAll']
		>('/v1/mac_addresses/all', ctx.key, {
			method: 'GET',
			query: {
				organization_ids: input.organization_ids,
				page: input.page,
			},
		});
		await persistMacAddresses(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.macAddresses.listAll',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a MAC address - GET /v1/mac_addresses/{id}
export const macAddressesGet: DnsfilterEndpoints['macAddressesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['macAddressesGet']
	>('/v1/mac_addresses/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
	});
	await persistMacAddresses(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.macAddresses.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Update a MAC address - PATCH /v1/mac_addresses/{id}
export const macAddressesUpdate: DnsfilterEndpoints['macAddressesUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['macAddressesUpdate']
		>('/v1/mac_addresses/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
			},
			body: {
				mac_address: input.mac_address,
			},
		});
		await persistMacAddresses(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.macAddresses.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete a MAC address - DELETE /v1/mac_addresses/{id}
export const macAddressesDelete: DnsfilterEndpoints['macAddressesDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['macAddressesDelete']
		>('/v1/mac_addresses/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
			},
		});
		await persistMacAddresses(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.macAddresses.delete',
			input ?? {},
			'completed',
		);
		return response;
	};
