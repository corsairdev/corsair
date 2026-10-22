import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List network LAN IPs - GET /v1/networks/{id}/lan_ips
export const networkLanIpsList: DnsfilterEndpoints['networkLanIpsList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networkLanIpsList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkLanIpsList']
		>('/v1/networks/{id}/lan_ips', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
			query: {
				page: values.page,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networkLanIpsList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkLanIps.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a network LAN IP - GET /v1/networks/{id}/lan_ips/{lan_ip_id}
export const networkLanIpsGet: DnsfilterEndpoints['networkLanIpsGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.networkLanIpsGet.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['networkLanIpsGet']
	>('/v1/networks/{id}/lan_ips/{lan_ip_id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
			lan_ip_id: values.lan_ip_id,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.networkLanIpsGet.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.networkLanIps.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a network LAN IP - PATCH /v1/networks/{id}/lan_ips/{lan_ip_id}
export const networkLanIpsUpdate: DnsfilterEndpoints['networkLanIpsUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.networkLanIpsUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['networkLanIpsUpdate']
		>('/v1/networks/{id}/lan_ips/{lan_ip_id}', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
				lan_ip_id: values.lan_ip_id,
			},
			body: {
				network_lan_ip: values.network_lan_ip,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.networkLanIpsUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.networkLanIps.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
