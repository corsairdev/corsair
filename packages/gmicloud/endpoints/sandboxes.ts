import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import { forgetRecord, mergeRecords, saveRecords } from './persistence';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['sandboxesList'] = async (ctx, input) => {
	const { page, page_size, idc_name, state, metadata } =
		GmicloudEndpointInputSchemas.sandboxesList.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxesList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v2/sandboxes',
			query: { page, page_size, idc_name, state, metadata },
		}),
	);
	await mergeRecords(ctx.db.sandboxes, result.items);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxes.list',
		{ count: result.items.length },
		'completed',
	);
	return result;
};

export const create: GmicloudEndpoints['sandboxesCreate'] = async (
	ctx,
	input,
) => {
	const { idempotency_key, ...body } =
		GmicloudEndpointInputSchemas.sandboxesCreate.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxesCreate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v2/sandboxes',
			headers: { 'Idempotency-Key': idempotency_key },
			body,
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.sandboxes.create', {}, 'completed');
	return result;
};

export const get: GmicloudEndpoints['sandboxesGet'] = async (ctx, input) => {
	const { id } = GmicloudEndpointInputSchemas.sandboxesGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxesGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v2/sandboxes/{id}',
			path: { id },
		}),
	);
	await saveRecords(ctx.db.sandboxes, [result.data]);
	await logEventFromContext(ctx, 'gmicloud.sandboxes.get', { id }, 'completed');
	return result;
};

export const updateMetadata: GmicloudEndpoints['sandboxesUpdateMetadata'] =
	async (ctx, input) => {
		const { id, ...body } =
			GmicloudEndpointInputSchemas.sandboxesUpdateMetadata.parse(input);
		const result = GmicloudEndpointOutputSchemas.sandboxesUpdateMetadata.parse(
			await makeGmicloudRequest(ctx, {
				api: 'console',
				method: 'PATCH',
				url: 'v2/sandboxes/{id}',
				path: { id },
				body,
			}),
		);
		await saveRecords(ctx.db.sandboxes, [result.data]);
		await logEventFromContext(
			ctx,
			'gmicloud.sandboxes.updateMetadata',
			{ id },
			'completed',
		);
		return result;
	};

export const remove: GmicloudEndpoints['sandboxesDelete'] = async (
	ctx,
	input,
) => {
	const { id } = GmicloudEndpointInputSchemas.sandboxesDelete.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxesDelete.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'DELETE',
			url: 'v2/sandboxes/{id}',
			path: { id },
		}),
	);
	await forgetRecord(ctx.db.sandboxes, id);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxes.delete',
		{ id },
		'completed',
	);
	return result;
};

export const connect: GmicloudEndpoints['sandboxesConnect'] = async (
	ctx,
	input,
) => {
	const { id, ...body } =
		GmicloudEndpointInputSchemas.sandboxesConnect.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxesConnect.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v2/sandboxes/{id}/connect',
			path: { id },
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxes.connect',
		{ id },
		'completed',
	);
	return result;
};

export const setTimeout: GmicloudEndpoints['sandboxesSetTimeout'] = async (
	ctx,
	input,
) => {
	const { id, ...body } =
		GmicloudEndpointInputSchemas.sandboxesSetTimeout.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxesSetTimeout.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v2/sandboxes/{id}/timeout',
			path: { id },
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxes.setTimeout',
		{ id },
		'completed',
	);
	return result;
};
