import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import { forgetRecord, saveRecords } from './persistence';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['baremetalsList'] = async (ctx, input) => {
	const { idc } = GmicloudEndpointInputSchemas.baremetalsList.parse(input);
	const result = GmicloudEndpointOutputSchemas.baremetalsList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/baremetals',
			query: { idc },
		}),
	);
	await saveRecords(ctx.db.baremetals, result);
	await logEventFromContext(
		ctx,
		'gmicloud.baremetals.list',
		{ count: result.length },
		'completed',
	);
	return result;
};

export const create: GmicloudEndpoints['baremetalsCreate'] = async (
	ctx,
	input,
) => {
	const body = GmicloudEndpointInputSchemas.baremetalsCreate.parse(input);
	const result = GmicloudEndpointOutputSchemas.baremetalsCreate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/baremetals',
			body,
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.baremetals.create', {}, 'completed');
	return result;
};

export const get: GmicloudEndpoints['baremetalsGet'] = async (ctx, input) => {
	const { id } = GmicloudEndpointInputSchemas.baremetalsGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.baremetalsGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/baremetals/{id}',
			path: { id },
		}),
	);
	await saveRecords(ctx.db.baremetals, [result]);
	await logEventFromContext(
		ctx,
		'gmicloud.baremetals.get',
		{ id },
		'completed',
	);
	return result;
};

export const update: GmicloudEndpoints['baremetalsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } =
		GmicloudEndpointInputSchemas.baremetalsUpdate.parse(input);
	const result = GmicloudEndpointOutputSchemas.baremetalsUpdate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'PUT',
			url: 'v1/baremetals/{id}',
			path: { id },
			body,
		}),
	);
	await saveRecords(ctx.db.baremetals, [result]);
	await logEventFromContext(
		ctx,
		'gmicloud.baremetals.update',
		{ id },
		'completed',
	);
	return result;
};

export const remove: GmicloudEndpoints['baremetalsDelete'] = async (
	ctx,
	input,
) => {
	const { id } = GmicloudEndpointInputSchemas.baremetalsDelete.parse(input);
	const result = GmicloudEndpointOutputSchemas.baremetalsDelete.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'DELETE',
			url: 'v1/baremetals/{id}',
			path: { id },
		}),
	);
	await forgetRecord(ctx.db.baremetals, id);
	await logEventFromContext(
		ctx,
		'gmicloud.baremetals.delete',
		{ id },
		'completed',
	);
	return result;
};

export const action: GmicloudEndpoints['baremetalsAction'] = async (
	ctx,
	input,
) => {
	const { id, ...body } =
		GmicloudEndpointInputSchemas.baremetalsAction.parse(input);
	const result = GmicloudEndpointOutputSchemas.baremetalsAction.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/baremetals/{id}/actions',
			path: { id },
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.baremetals.action',
		{ id },
		'completed',
	);
	return result;
};

export const listProducts: GmicloudEndpoints['baremetalsListProducts'] = async (
	ctx,
	input,
) => {
	const { idc } =
		GmicloudEndpointInputSchemas.baremetalsListProducts.parse(input);
	const result = GmicloudEndpointOutputSchemas.baremetalsListProducts.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/baremetals/products',
			query: { idc },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.baremetals.listProducts',
		{},
		'completed',
	);
	return result;
};
