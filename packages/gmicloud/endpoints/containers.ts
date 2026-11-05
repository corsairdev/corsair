import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import { forgetRecord, saveRecords } from './persistence';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['containersList'] = async (ctx, input) => {
	GmicloudEndpointInputSchemas.containersList.parse(input);
	const result = GmicloudEndpointOutputSchemas.containersList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/containers',
		}),
	);
	await saveRecords(ctx.db.containers, result);
	await logEventFromContext(
		ctx,
		'gmicloud.containers.list',
		{ count: result.length },
		'completed',
	);
	return result;
};

export const create: GmicloudEndpoints['containersCreate'] = async (
	ctx,
	input,
) => {
	const body = GmicloudEndpointInputSchemas.containersCreate.parse(input);
	const result = GmicloudEndpointOutputSchemas.containersCreate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/containers',
			body,
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.containers.create', {}, 'completed');
	return result;
};

export const get: GmicloudEndpoints['containersGet'] = async (ctx, input) => {
	const { id } = GmicloudEndpointInputSchemas.containersGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.containersGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/containers/{id}',
			path: { id },
		}),
	);
	await saveRecords(ctx.db.containers, [result]);
	await logEventFromContext(
		ctx,
		'gmicloud.containers.get',
		{ id },
		'completed',
	);
	return result;
};

export const update: GmicloudEndpoints['containersUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } =
		GmicloudEndpointInputSchemas.containersUpdate.parse(input);
	const result = GmicloudEndpointOutputSchemas.containersUpdate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'PUT',
			url: 'v1/containers/{id}',
			path: { id },
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.containers.update',
		{ id },
		'completed',
	);
	return result;
};

export const remove: GmicloudEndpoints['containersDelete'] = async (
	ctx,
	input,
) => {
	const { id } = GmicloudEndpointInputSchemas.containersDelete.parse(input);
	const result = GmicloudEndpointOutputSchemas.containersDelete.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'DELETE',
			url: 'v1/containers/{id}',
			path: { id },
		}),
	);
	await forgetRecord(ctx.db.containers, id);
	await logEventFromContext(
		ctx,
		'gmicloud.containers.delete',
		{ id },
		'completed',
	);
	return result;
};

export const getLogs: GmicloudEndpoints['containersGetLogs'] = async (
	ctx,
	input,
) => {
	const { id } = GmicloudEndpointInputSchemas.containersGetLogs.parse(input);
	const result = GmicloudEndpointOutputSchemas.containersGetLogs.parse({
		text: String(
			await makeGmicloudRequest(ctx, {
				api: 'console',
				method: 'GET',
				url: 'v1/containers/{id}/logs',
				path: { id },
			}),
		),
	});
	await logEventFromContext(
		ctx,
		'gmicloud.containers.getLogs',
		{ id },
		'completed',
	);
	return result;
};

export const restart: GmicloudEndpoints['containersRestart'] = async (
	ctx,
	input,
) => {
	const { id } = GmicloudEndpointInputSchemas.containersRestart.parse(input);
	const result = GmicloudEndpointOutputSchemas.containersRestart.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/containers/{id}/restart',
			path: { id },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.containers.restart',
		{ id },
		'completed',
	);
	return result;
};

export const createShell: GmicloudEndpoints['containersCreateShell'] = async (
	ctx,
	input,
) => {
	const { id } =
		GmicloudEndpointInputSchemas.containersCreateShell.parse(input);
	const result = GmicloudEndpointOutputSchemas.containersCreateShell.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/containers/{id}/shell',
			path: { id },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.containers.createShell',
		{ id },
		'completed',
	);
	return result;
};

export const listProducts: GmicloudEndpoints['containersListProducts'] = async (
	ctx,
	input,
) => {
	const { idc } =
		GmicloudEndpointInputSchemas.containersListProducts.parse(input);
	const result = GmicloudEndpointOutputSchemas.containersListProducts.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/containers/products',
			query: { idc },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.containers.listProducts',
		{},
		'completed',
	);
	return result;
};
