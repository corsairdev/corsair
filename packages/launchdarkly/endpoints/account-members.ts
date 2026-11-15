import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['accountMembersList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.accountMembersList.parse(input);
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2/members',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: parsedInput.limit,
				offset: parsedInput.offset,
				sort: parsedInput.sort,
				filter: parsedInput.filter,
				expand: parsedInput.expand,
			},
		},
	);
	const parsed =
		LaunchDarklyEndpointOutputSchemas.accountMembersList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.accountMembers.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['accountMembersGet'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.accountMembersGet.parse(input);
	const path = `/api/v2/members/${encodeURIComponent(parsedInput.id)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.accountMembersGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.accountMembers.get',
		{ id: parsed._id },
		'completed',
	);
	return parsed;
};

export const invite: LaunchDarklyEndpoints['accountMembersInvite'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.accountMembersInvite.parse(input);
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2/members',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput.members,
		},
	);
	const parsed =
		LaunchDarklyEndpointOutputSchemas.accountMembersInvite.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.accountMembers.invite',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const update: LaunchDarklyEndpoints['accountMembersUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.accountMembersUpdate.parse(input);
	const path = `/api/v2/members/${encodeURIComponent(parsedInput.id)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'PATCH',
		body: parsedInput.patch,
	});
	const parsed =
		LaunchDarklyEndpointOutputSchemas.accountMembersUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.accountMembers.update',
		{ id: parsed._id },
		'completed',
	);
	return parsed;
};

export const deleteMember: LaunchDarklyEndpoints['accountMembersDelete'] =
	async (ctx, input) => {
		const parsedInput =
			LaunchDarklyEndpointInputSchemas.accountMembersDelete.parse(input);
		const path = `/api/v2/members/${encodeURIComponent(parsedInput.id)}`;
		await makeLaunchDarklyRequest<void>(path, ctx.key, {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'launchdarkly.accountMembers.delete',
			{ status: 'ok' },
			'completed',
		);
	};

export const AccountMembers = {
	list,
	get,
	invite,
	update,
	delete: deleteMember,
};
