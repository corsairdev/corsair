import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import { forgetRecord, saveRecords } from './persistence';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['firewallsList'] = async (ctx, input) => {
	const { idc } = GmicloudEndpointInputSchemas.firewallsList.parse(input);
	const result = GmicloudEndpointOutputSchemas.firewallsList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/firewalls',
			query: { idc },
		}),
	);
	await saveRecords(ctx.db.firewalls, result);
	await logEventFromContext(
		ctx,
		'gmicloud.firewalls.list',
		{ count: result.length },
		'completed',
	);
	return result;
};

export const create: GmicloudEndpoints['firewallsCreate'] = async (
	ctx,
	input,
) => {
	const body = GmicloudEndpointInputSchemas.firewallsCreate.parse(input);
	const result = GmicloudEndpointOutputSchemas.firewallsCreate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/firewalls',
			body,
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.firewalls.create', {}, 'completed');
	return result;
};

export const get: GmicloudEndpoints['firewallsGet'] = async (ctx, input) => {
	const { id } = GmicloudEndpointInputSchemas.firewallsGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.firewallsGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/firewalls/{id}',
			path: { id },
		}),
	);
	await saveRecords(ctx.db.firewalls, [result]);
	await logEventFromContext(ctx, 'gmicloud.firewalls.get', { id }, 'completed');
	return result;
};

export const update: GmicloudEndpoints['firewallsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } =
		GmicloudEndpointInputSchemas.firewallsUpdate.parse(input);
	const result = GmicloudEndpointOutputSchemas.firewallsUpdate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'PUT',
			url: 'v1/firewalls/{id}',
			path: { id },
			body,
		}),
	);
	await saveRecords(ctx.db.firewalls, [result]);
	await logEventFromContext(
		ctx,
		'gmicloud.firewalls.update',
		{ id },
		'completed',
	);
	return result;
};

export const remove: GmicloudEndpoints['firewallsDelete'] = async (
	ctx,
	input,
) => {
	const { id } = GmicloudEndpointInputSchemas.firewallsDelete.parse(input);
	const result = GmicloudEndpointOutputSchemas.firewallsDelete.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'DELETE',
			url: 'v1/firewalls/{id}',
			path: { id },
		}),
	);
	await forgetRecord(ctx.db.firewalls, id);
	await logEventFromContext(
		ctx,
		'gmicloud.firewalls.delete',
		{ id },
		'completed',
	);
	return result;
};

export const associate: GmicloudEndpoints['firewallsAssociate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } =
		GmicloudEndpointInputSchemas.firewallsAssociate.parse(input);
	const result = GmicloudEndpointOutputSchemas.firewallsAssociate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/firewalls/{id}/associate',
			path: { id },
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.firewalls.associate',
		{ id },
		'completed',
	);
	return result;
};

export const disassociate: GmicloudEndpoints['firewallsDisassociate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } =
		GmicloudEndpointInputSchemas.firewallsDisassociate.parse(input);
	const result = GmicloudEndpointOutputSchemas.firewallsDisassociate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v1/firewalls/{id}/disassociate',
			path: { id },
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.firewalls.disassociate',
		{ id },
		'completed',
	);
	return result;
};
