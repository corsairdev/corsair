import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const list: GristEndpoints['orgs.list'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['orgs.list'].parse(input);
	const response = await makeGristRequest<unknown>('/orgs', ctx.key, {
		method: 'GET',
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed = GristEndpointOutputSchemas['orgs.list'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.orgs.list',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};

export const get: GristEndpoints['orgs.get'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['orgs.get'].parse(input);
	const orgIdStr = encodeURIComponent(String(parsedInput.orgId));
	const response = await makeGristRequest<unknown>(
		`/orgs/${orgIdStr}`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['orgs.get'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.orgs.get',
		{ orgId: parsedInput.orgId },
		'completed',
	);
	return parsed;
};

export const update: GristEndpoints['orgs.update'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['orgs.update'].parse(input);
	const orgIdStr = encodeURIComponent(String(parsedInput.orgId));
	const response = await makeGristRequest<unknown>(
		`/orgs/${orgIdStr}`,
		ctx.key,
		{
			method: 'PATCH',
			body: parsedInput.name !== undefined ? { name: parsedInput.name } : {},
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['orgs.update'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.orgs.update',
		{ orgId: parsedInput.orgId },
		'completed',
	);
	return parsed;
};

export const deleteOrg: GristEndpoints['orgs.delete'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['orgs.delete'].parse(input);
	const orgIdStr = encodeURIComponent(String(parsedInput.orgId));
	const nameStr = encodeURIComponent(parsedInput.name);
	const response = await makeGristRequest<unknown>(
		`/orgs/${orgIdStr}/${nameStr}`,
		ctx.key,
		{
			method: 'DELETE',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['orgs.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.orgs.delete',
		{ orgId: parsedInput.orgId },
		'completed',
	);
	return parsed;
};

export const listAccess: GristEndpoints['orgs.listAccess'] = async (
	ctx,
	input,
) => {
	const parsedInput = GristEndpointInputSchemas['orgs.listAccess'].parse(input);
	const orgIdStr = encodeURIComponent(String(parsedInput.orgId));
	const response = await makeGristRequest<unknown>(
		`/orgs/${orgIdStr}/access`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['orgs.listAccess'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.orgs.listAccess',
		{ orgId: parsedInput.orgId },
		'completed',
	);
	return parsed;
};

export const modifyAccess: GristEndpoints['orgs.modifyAccess'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		GristEndpointInputSchemas['orgs.modifyAccess'].parse(input);
	const orgIdStr = encodeURIComponent(String(parsedInput.orgId));
	const response = await makeGristRequest<unknown>(
		`/orgs/${orgIdStr}/access`,
		ctx.key,
		{
			method: 'PATCH',
			body: { users: parsedInput.users },
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		GristEndpointOutputSchemas['orgs.modifyAccess'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.orgs.modifyAccess',
		{ orgId: parsedInput.orgId },
		'completed',
	);
	return parsed;
};

export const getUsage: GristEndpoints['orgs.getUsage'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['orgs.getUsage'].parse(input);
	const orgIdStr = encodeURIComponent(String(parsedInput.orgId));
	const response = await makeGristRequest<unknown>(
		`/orgs/${orgIdStr}/usage`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['orgs.getUsage'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.orgs.getUsage',
		{ orgId: parsedInput.orgId },
		'completed',
	);
	return parsed;
};
