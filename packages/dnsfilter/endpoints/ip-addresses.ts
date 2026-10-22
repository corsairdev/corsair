import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistIpAddresses } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List IP addresses - GET /v1/ip_addresses
export const ipAddressesList: DnsfilterEndpoints['ipAddressesList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.ipAddressesList.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['ipAddressesList']
	>('/v1/ip_addresses', ctx.key, {
		method: 'GET',
		query: {
			page: values.page,
			search: values.search,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.ipAddressesList.parse(response);
	await persistIpAddresses(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.ipAddresses.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Create an IP address - POST /v1/ip_addresses
export const ipAddressesCreate: DnsfilterEndpoints['ipAddressesCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.ipAddressesCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['ipAddressesCreate']
		>('/v1/ip_addresses', ctx.key, {
			method: 'POST',
			body: {
				ip_address: values.ip_address,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.ipAddressesCreate.parse(response);
		await persistIpAddresses(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.ipAddresses.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// List all IP addresses - GET /v1/ip_addresses/all
export const ipAddressesListAll: DnsfilterEndpoints['ipAddressesListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.ipAddressesListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['ipAddressesListAll']
		>('/v1/ip_addresses/all', ctx.key, {
			method: 'GET',
			query: {
				page: values.page,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.ipAddressesListAll.parse(response);
		await persistIpAddresses(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.ipAddresses.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get an IP address - GET /v1/ip_addresses/{id}
export const ipAddressesGet: DnsfilterEndpoints['ipAddressesGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.ipAddressesGet.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['ipAddressesGet']
	>('/v1/ip_addresses/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.ipAddressesGet.parse(response);
	await persistIpAddresses(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.ipAddresses.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update an IP address - PATCH /v1/ip_addresses/{id}
export const ipAddressesUpdate: DnsfilterEndpoints['ipAddressesUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.ipAddressesUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['ipAddressesUpdate']
		>('/v1/ip_addresses/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
			body: {
				ip_address: values.ip_address,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.ipAddressesUpdate.parse(response);
		await persistIpAddresses(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.ipAddresses.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Delete an IP address - DELETE /v1/ip_addresses/{id}
export const ipAddressesDelete: DnsfilterEndpoints['ipAddressesDelete'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.ipAddressesDelete.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['ipAddressesDelete']
		>('/v1/ip_addresses/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.ipAddressesDelete.parse(response);
		try {
			await ctx.db.ipAddresses.deleteByEntityId(String(values.id));
		} catch (error) {
			console.warn('Failed to evict DNSFilter ipAddresses row:', error);
		}
		await logEventFromContext(
			ctx,
			'dnsfilter.ipAddresses.delete',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Verify for IP addresses - GET /v1/ip_addresses/verify
export const ipAddressesVerify: DnsfilterEndpoints['ipAddressesVerify'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.ipAddressesVerify.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['ipAddressesVerify']
		>('/v1/ip_addresses/verify', ctx.key, {
			method: 'GET',
			query: {
				ip_address: values.ip_address,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.ipAddressesVerify.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.ipAddresses.verify',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// My IP for IP addresses - GET /v1/ip_addresses/myip
export const ipAddressesMyip: DnsfilterEndpoints['ipAddressesMyip'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.ipAddressesMyip.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['ipAddressesMyip']
	>('/v1/ip_addresses/myip', ctx.key, {
		method: 'GET',
	});
	const result = DnsfilterEndpointOutputSchemas.ipAddressesMyip.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.ipAddresses.myip',
		redactSensitive(values),
		'completed',
	);
	return result;
};
