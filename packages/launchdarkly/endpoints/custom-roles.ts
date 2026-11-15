import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['customRolesList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.customRolesList.parse(input);
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2/roles',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: parsedInput.limit,
				offset: parsedInput.offset,
			},
		},
	);
	const parsed =
		LaunchDarklyEndpointOutputSchemas.customRolesList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.customRoles.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['customRolesGet'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.customRolesGet.parse(input);
	const path = `/api/v2/roles/${encodeURIComponent(parsedInput.customRoleKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.customRolesGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.customRoles.get',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const create: LaunchDarklyEndpoints['customRolesCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.customRolesCreate.parse(input);
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2/roles',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed =
		LaunchDarklyEndpointOutputSchemas.customRolesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.customRoles.create',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const update: LaunchDarklyEndpoints['customRolesUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.customRolesUpdate.parse(input);
	const path = `/api/v2/roles/${encodeURIComponent(parsedInput.customRoleKey)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'PATCH',
		body: {
			patch: parsedInput.patch,
			comment: parsedInput.comment,
		},
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.customRolesUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.customRoles.update',
		{ key: parsed.key },
		'completed',
	);
	return parsed;
};

export const deleteCustomRole: LaunchDarklyEndpoints['customRolesDelete'] =
	async (ctx, input) => {
		const parsedInput =
			LaunchDarklyEndpointInputSchemas.customRolesDelete.parse(input);
		const path = `/api/v2/roles/${encodeURIComponent(parsedInput.customRoleKey)}`;
		await makeLaunchDarklyRequest<void>(path, ctx.key, {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'launchdarkly.customRoles.delete',
			{ status: 'ok' },
			'completed',
		);
	};

export const CustomRoles = {
	list,
	get,
	create,
	update,
	delete: deleteCustomRole,
};
