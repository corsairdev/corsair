import { logEventFromContext } from 'corsair/core';
import { makeCloudflareRequest } from '../client';
import type { CloudflareEndpoints } from '../index';
import type { CloudflareEndpointOutputs } from './types';

export const list: CloudflareEndpoints['zonesList'] = async (ctx, input) => {
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['zonesList']
	>('/zones', ctx.key, { method: 'GET', query: { ...input } });
	await logEventFromContext(
		ctx,
		'cloudflare.zones.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: CloudflareEndpoints['zonesGet'] = async (ctx, input) => {
	const { zone_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['zonesGet']
	>(`/zones/${zone_id}`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'cloudflare.zones.get',
		{ zone_id },
		'completed',
	);
	return result;
};

export const create: CloudflareEndpoints['zonesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['zonesCreate']
	>('/zones', ctx.key, { method: 'POST', body: { ...input } });
	await logEventFromContext(
		ctx,
		'cloudflare.zones.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const edit: CloudflareEndpoints['zonesEdit'] = async (ctx, input) => {
	const { zone_id, ...body } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['zonesEdit']
	>(`/zones/${zone_id}`, ctx.key, { method: 'PATCH', body });
	await logEventFromContext(
		ctx,
		'cloudflare.zones.edit',
		{ zone_id },
		'completed',
	);
	return result;
};

export const deleteZone: CloudflareEndpoints['zonesDelete'] = async (
	ctx,
	input,
) => {
	const { zone_id } = input;
	const result = await makeCloudflareRequest<
		CloudflareEndpointOutputs['zonesDelete']
	>(`/zones/${zone_id}`, ctx.key, { method: 'DELETE' });
	await logEventFromContext(
		ctx,
		'cloudflare.zones.delete',
		{ zone_id },
		'completed',
	);
	return result;
};
