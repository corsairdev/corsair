import { logEventFromContext } from 'corsair/core';
import { makeCloudflareRequest } from '../client';
import type { CloudflareEndpoints } from '../index';
import { deleteDnsRecord, persistDnsRecord } from '../persist';
import type { CloudflareEndpointOutputs } from './types';

export const list: CloudflareEndpoints['dnsList'] = async (ctx, input) => {
	const { zone_id, ...query } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['dnsList']
	>(`/zones/${zone_id}/dns_records`, ctx.key, { method: 'GET', query });

	if (ctx.db.dnsRecords) {
		for (const record of result) {
			await persistDnsRecord(record, zone_id, ctx.db);
		}
	}

	await logEventFromContext(
		ctx,
		'cloudflare.dns.list',
		{ zone_id, ...query },
		'completed',
	);
	return result;
};

export const get: CloudflareEndpoints['dnsGet'] = async (ctx, input) => {
	const { zone_id, dns_record_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['dnsGet']
	>(`/zones/${zone_id}/dns_records/${dns_record_id}`, ctx.key, {
		method: 'GET',
	});

	await persistDnsRecord(result, zone_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.dns.get',
		{ zone_id, dns_record_id },
		'completed',
	);
	return result;
};

export const create: CloudflareEndpoints['dnsCreate'] = async (ctx, input) => {
	const { zone_id, ...body } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['dnsCreate']
	>(`/zones/${zone_id}/dns_records`, ctx.key, { method: 'POST', body });

	await persistDnsRecord(result, zone_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.dns.create',
		{ zone_id },
		'completed',
	);
	return result;
};

export const edit: CloudflareEndpoints['dnsEdit'] = async (ctx, input) => {
	const { zone_id, dns_record_id, ...body } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['dnsEdit']
	>(`/zones/${zone_id}/dns_records/${dns_record_id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await persistDnsRecord(result, zone_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.dns.edit',
		{ zone_id, dns_record_id },
		'completed',
	);
	return result;
};

export const deleteDns: CloudflareEndpoints['dnsDelete'] = async (
	ctx,
	input,
) => {
	const { zone_id, dns_record_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['dnsDelete']
	>(`/zones/${zone_id}/dns_records/${dns_record_id}`, ctx.key, {
		method: 'DELETE',
	});

	await deleteDnsRecord(dns_record_id, ctx.db);

	await logEventFromContext(
		ctx,
		'cloudflare.dns.delete',
		{ zone_id, dns_record_id },
		'completed',
	);
	return result;
};
