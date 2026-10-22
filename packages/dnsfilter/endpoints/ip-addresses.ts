import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistIpAddresses } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// List IP addresses - GET /v1/ip_addresses
export const ipAddressesList: DnsfilterEndpoints['ipAddressesList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['ipAddressesList']
	>('/v1/ip_addresses', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
			search: input.search,
		},
	});
	await persistIpAddresses(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.ipAddresses.list',
		input ?? {},
		'completed',
	);
	return response;
};

// Create an IP address - POST /v1/ip_addresses
export const ipAddressesCreate: DnsfilterEndpoints['ipAddressesCreate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['ipAddressesCreate']
		>('/v1/ip_addresses', ctx.key, {
			method: 'POST',
			body: {
				ip_address: input.ip_address,
			},
		});
		await persistIpAddresses(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.ipAddresses.create',
			input ?? {},
			'completed',
		);
		return response;
	};

// List all IP addresses - GET /v1/ip_addresses/all
export const ipAddressesListAll: DnsfilterEndpoints['ipAddressesListAll'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['ipAddressesListAll']
		>('/v1/ip_addresses/all', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
			},
		});
		await persistIpAddresses(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.ipAddresses.listAll',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get an IP address - GET /v1/ip_addresses/{id}
export const ipAddressesGet: DnsfilterEndpoints['ipAddressesGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['ipAddressesGet']
	>('/v1/ip_addresses/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
	});
	await persistIpAddresses(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.ipAddresses.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Update an IP address - PATCH /v1/ip_addresses/{id}
export const ipAddressesUpdate: DnsfilterEndpoints['ipAddressesUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['ipAddressesUpdate']
		>('/v1/ip_addresses/{id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
			},
			body: {
				ip_address: input.ip_address,
			},
		});
		await persistIpAddresses(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.ipAddresses.update',
			input ?? {},
			'completed',
		);
		return response;
	};

// Delete an IP address - DELETE /v1/ip_addresses/{id}
export const ipAddressesDelete: DnsfilterEndpoints['ipAddressesDelete'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['ipAddressesDelete']
		>('/v1/ip_addresses/{id}', ctx.key, {
			method: 'DELETE',
			path: {
				id: input.id,
			},
		});
		await persistIpAddresses(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.ipAddresses.delete',
			input ?? {},
			'completed',
		);
		return response;
	};

// Verify for IP addresses - GET /v1/ip_addresses/verify
export const ipAddressesVerify: DnsfilterEndpoints['ipAddressesVerify'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['ipAddressesVerify']
		>('/v1/ip_addresses/verify', ctx.key, {
			method: 'GET',
			body: {
				ip_address: input.ip_address,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.ipAddresses.verify',
			input ?? {},
			'completed',
		);
		return response;
	};

// Myip for IP addresses - GET /v1/ip_addresses/myip
export const ipAddressesMyip: DnsfilterEndpoints['ipAddressesMyip'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['ipAddressesMyip']
	>('/v1/ip_addresses/myip', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.ipAddresses.myip',
		input ?? {},
		'completed',
	);
	return response;
};
