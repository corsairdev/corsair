import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import type { DnsfilterEndpointOutputs } from './types';

// List network LAN IPs - GET /v1/networks/{id}/lan_ips
export const networkLanIpsList: DnsfilterEndpoints['networkLanIpsList'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkLanIpsList']
		>('/v1/networks/{id}/lan_ips', ctx.key, {
			method: 'GET',
			path: {
				id: input.id,
			},
			query: {
				page: input.page,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.networkLanIps.list',
			input ?? {},
			'completed',
		);
		return response;
	};

// Get a network LAN IP - GET /v1/networks/{id}/lan_ips/{lan_ip_id}
export const networkLanIpsGet: DnsfilterEndpoints['networkLanIpsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networkLanIpsGet']
	>('/v1/networks/{id}/lan_ips/{lan_ip_id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
			lan_ip_id: input.lan_ip_id,
		},
	});
	await logEventFromContext(
		ctx,
		'dnsfilter.networkLanIps.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Update a network LAN IP - PATCH /v1/networks/{id}/lan_ips/{lan_ip_id}
export const networkLanIpsUpdate: DnsfilterEndpoints['networkLanIpsUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkLanIpsUpdate']
		>('/v1/networks/{id}/lan_ips/{lan_ip_id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: input.id,
				lan_ip_id: input.lan_ip_id,
			},
			body: {
				network_lan_ip: input.network_lan_ip,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.networkLanIps.update',
			input ?? {},
			'completed',
		);
		return response;
	};
