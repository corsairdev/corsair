import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const list: GristEndpoints['workspaces.list'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['workspaces.list'].parse(input);
	const orgIdStr = encodeURIComponent(String(parsedInput.orgId));
	const response = await makeGristRequest(
		`/orgs/${orgIdStr}/workspaces`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['workspaces.list'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.workspaces.list',
		{ orgId: parsedInput.orgId, count: parsed.length },
		'completed',
	);
	return parsed;
};

export const create: GristEndpoints['workspaces.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['workspaces.create'].parse(input);
	const orgIdStr = encodeURIComponent(String(parsedInput.orgId));
	const response = await makeGristRequest(
		`/orgs/${orgIdStr}/workspaces`,
		ctx.key,
		{
			method: 'POST',
			body: { name: parsedInput.name },
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['workspaces.create'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.workspaces.create',
		{ orgId: parsedInput.orgId, workspaceId: parsed },
		'completed',
	);
	return parsed;
};

export const get: GristEndpoints['workspaces.get'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['workspaces.get'].parse(input);
	const wsIdStr = encodeURIComponent(String(parsedInput.workspaceId));
	const response = await makeGristRequest(`/workspaces/${wsIdStr}`, ctx.key, {
		method: 'GET',
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed = GristEndpointOutputSchemas['workspaces.get'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.workspaces.get',
		{ workspaceId: parsedInput.workspaceId },
		'completed',
	);
	return parsed;
};

export const update: GristEndpoints['workspaces.update'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['workspaces.update'].parse(input);
	const wsIdStr = encodeURIComponent(String(parsedInput.workspaceId));
	const response = await makeGristRequest(`/workspaces/${wsIdStr}`, ctx.key, {
		method: 'PATCH',
		body: { name: parsedInput.name },
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed =
		GristEndpointOutputSchemas['workspaces.update'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.workspaces.update',
		{ workspaceId: parsedInput.workspaceId },
		'completed',
	);
	return parsed;
};

export const deleteWorkspace: GristEndpoints['workspaces.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['workspaces.delete'].parse(input);
	const wsIdStr = encodeURIComponent(String(parsedInput.workspaceId));
	const response = await makeGristRequest(`/workspaces/${wsIdStr}`, ctx.key, {
		method: 'DELETE',
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed =
		GristEndpointOutputSchemas['workspaces.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.workspaces.delete',
		{ workspaceId: parsedInput.workspaceId },
		'completed',
	);
	return parsed;
};

export const remove: GristEndpoints['workspaces.remove'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['workspaces.remove'].parse(input);
	const wsIdStr = encodeURIComponent(String(parsedInput.workspaceId));
	const response = await makeGristRequest(
		`/workspaces/${wsIdStr}/remove`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['workspaces.remove'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.workspaces.remove',
		{ workspaceId: parsedInput.workspaceId },
		'completed',
	);
	return parsed;
};

export const unremove: GristEndpoints['workspaces.unremove'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['workspaces.unremove'].parse(input);
	const wsIdStr = encodeURIComponent(String(parsedInput.workspaceId));
	const response = await makeGristRequest(
		`/workspaces/${wsIdStr}/unremove`,
		ctx.key,
		{
			method: 'POST',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['workspaces.unremove'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.workspaces.unremove',
		{ workspaceId: parsedInput.workspaceId },
		'completed',
	);
	return parsed;
};

export const listAccess: GristEndpoints['workspaces.listAccess'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['workspaces.listAccess'].parse(input);
	const wsIdStr = encodeURIComponent(String(parsedInput.workspaceId));
	const response = await makeGristRequest(
		`/workspaces/${wsIdStr}/access`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['workspaces.listAccess'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.workspaces.listAccess',
		{ workspaceId: parsedInput.workspaceId },
		'completed',
	);
	return parsed;
};

export const modifyAccess: GristEndpoints['workspaces.modifyAccess'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['workspaces.modifyAccess'].parse(input);
	const wsIdStr = encodeURIComponent(String(parsedInput.workspaceId));
	const response = await makeGristRequest(
		`/workspaces/${wsIdStr}/access`,
		ctx.key,
		{
			method: 'PATCH',
			body: {
				...(parsedInput.maxInheritedRole
					? { maxInheritedRole: parsedInput.maxInheritedRole }
					: {}),
				users: parsedInput.users,
			},
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['workspaces.modifyAccess'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.workspaces.modifyAccess',
		{ workspaceId: parsedInput.workspaceId },
		'completed',
	);
	return parsed;
};
