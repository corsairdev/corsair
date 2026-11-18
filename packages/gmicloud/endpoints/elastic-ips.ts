import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import { forgetRecord, saveRecords } from './persistence';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['elasticIpsList'] = async (ctx, input) => {
	GmicloudEndpointInputSchemas.elasticIpsList.parse(input);
	const result = GmicloudEndpointOutputSchemas.elasticIpsList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/elastic-ips',
		}),
	);
	await saveRecords(ctx.db.elasticIps, result);
	await logEventFromContext(
		ctx,
		'gmicloud.elasticIps.list',
		{ count: result.length },
		'completed',
	);
	return result;
};

export const allocate: GmicloudEndpoints['elasticIpsAllocate'] = async (
	ctx,
	input,
) => {
	const body = GmicloudEndpointInputSchemas.elasticIpsAllocate.parse(input);
	const result = GmicloudEndpointOutputSchemas.elasticIpsAllocate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/elastic-ips',
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.elasticIps.allocate',
		{},
		'completed',
	);
	return result;
};

export const get: GmicloudEndpoints['elasticIpsGet'] = async (ctx, input) => {
	const { id } = GmicloudEndpointInputSchemas.elasticIpsGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.elasticIpsGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/elastic-ips/{id}',
			path: { id },
		}),
	);
	await saveRecords(ctx.db.elasticIps, [result]);
	await logEventFromContext(
		ctx,
		'gmicloud.elasticIps.get',
		{ id },
		'completed',
	);
	return result;
};

export const release: GmicloudEndpoints['elasticIpsRelease'] = async (
	ctx,
	input,
) => {
	const { id } = GmicloudEndpointInputSchemas.elasticIpsRelease.parse(input);
	const result = GmicloudEndpointOutputSchemas.elasticIpsRelease.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'DELETE',
			url: 'v1/elastic-ips/{id}',
			path: { id },
		}),
	);
	await forgetRecord(ctx.db.elasticIps, id);
	await logEventFromContext(
		ctx,
		'gmicloud.elasticIps.release',
		{ id },
		'completed',
	);
	return result;
};

export const associate: GmicloudEndpoints['elasticIpsAssociate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } =
		GmicloudEndpointInputSchemas.elasticIpsAssociate.parse(input);
	const result = GmicloudEndpointOutputSchemas.elasticIpsAssociate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/elastic-ips/{id}/associate',
			path: { id },
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.elasticIps.associate',
		{ id },
		'completed',
	);
	return result;
};

export const disassociate: GmicloudEndpoints['elasticIpsDisassociate'] = async (
	ctx,
	input,
) => {
	const { id } =
		GmicloudEndpointInputSchemas.elasticIpsDisassociate.parse(input);
	const result = GmicloudEndpointOutputSchemas.elasticIpsDisassociate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/elastic-ips/{id}/disassociate',
			path: { id },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.elasticIps.disassociate',
		{ id },
		'completed',
	);
	return result;
};

export const listProducts: GmicloudEndpoints['elasticIpsListProducts'] = async (
	ctx,
	input,
) => {
	const { idc } =
		GmicloudEndpointInputSchemas.elasticIpsListProducts.parse(input);
	const result = GmicloudEndpointOutputSchemas.elasticIpsListProducts.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/elastic-ips/products',
			query: { idc },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.elasticIps.listProducts',
		{},
		'completed',
	);
	return result;
};
