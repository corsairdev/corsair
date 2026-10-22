import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistMacAddresses } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List MAC addresses - GET /v1/mac_addresses
export const macAddressesList: DnsfilterEndpoints['macAddressesList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.macAddressesList.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['macAddressesList']
	>('/v1/mac_addresses', ctx.key, {
		method: 'GET',
		query: {
			organization_ids: values.organization_ids,
			page: values.page,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.macAddressesList.parse(response);
	await persistMacAddresses(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.macAddresses.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Create a MAC address - POST /v1/mac_addresses
export const macAddressesCreate: DnsfilterEndpoints['macAddressesCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.macAddressesCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['macAddressesCreate']
		>('/v1/mac_addresses', ctx.key, {
			method: 'POST',
			body: {
				mac_address: values.mac_address,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.macAddressesCreate.parse(response);
		await persistMacAddresses(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.macAddresses.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// List all MAC addresses - GET /v1/mac_addresses/all
export const macAddressesListAll: DnsfilterEndpoints['macAddressesListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.macAddressesListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['macAddressesListAll']
		>('/v1/mac_addresses/all', ctx.key, {
			method: 'GET',
			query: {
				organization_ids: values.organization_ids,
				page: values.page,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.macAddressesListAll.parse(response);
		await persistMacAddresses(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.macAddresses.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a MAC address - GET /v1/mac_addresses/{id}
export const macAddressesGet: DnsfilterEndpoints['macAddressesGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.macAddressesGet.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['macAddressesGet']
	>('/v1/mac_addresses/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.macAddressesGet.parse(response);
	await persistMacAddresses(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.macAddresses.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a MAC address - PATCH /v1/mac_addresses/{id}
export const macAddressesUpdate: DnsfilterEndpoints['macAddressesUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.macAddressesUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['macAddressesUpdate']
		>('/v1/mac_addresses/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
			body: {
				mac_address: values.mac_address,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.macAddressesUpdate.parse(response);
		await persistMacAddresses(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.macAddresses.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete a MAC address - DELETE /v1/mac_addresses/{id}
export const macAddressesDelete: DnsfilterEndpoints['macAddressesDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.macAddressesDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['macAddressesDelete']
		>('/v1/mac_addresses/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.macAddressesDelete.parse(response);
		try {
			await ctx.db.macAddresses.deleteByEntityId(String(values.id));
		} catch (error) {
			console.warn('Failed to evict DNSFilter macAddresses row:', error);
		}
		await logEventFromContext(
			ctx,
			'dnsfilter.macAddresses.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
