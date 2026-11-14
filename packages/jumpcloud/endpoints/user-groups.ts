import { logEventFromContext } from 'corsair/core';
import type { JumpCloudEndpoints } from '..';
import { makeJumpCloudRequest } from '../client';
import { safeEventPayload } from '../safe-event';
import type { JumpCloudEndpointOutputs } from './types';
import {
	JumpCloudEndpointInputSchemas,
	JumpCloudEndpointOutputSchemas,
} from './types';

export const userGroupsList: JumpCloudEndpoints['userGroups.list'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['userGroups.list'].parse(input);
	const requestPath = '/usergroups';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['userGroups.list']
	>(ctx.key, 2, 'GET', requestPath, {
		query: {
			fields: parsed.fields,
			filter: parsed.filter,
			limit: parsed.limit,
			skip: parsed.skip,
			sort: parsed.sort,
		},
	});
	const output =
		JumpCloudEndpointOutputSchemas['userGroups.list'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.userGroups.list',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const userGroupsCreate: JumpCloudEndpoints['userGroups.create'] = async (
	ctx,
	input,
) => {
	const parsed =
		JumpCloudEndpointInputSchemas['userGroups.create'].parse(input);
	const requestPath = '/usergroups';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['userGroups.create']
	>(ctx.key, 2, 'POST', requestPath, {
		body: parsed.body,
	});
	const output =
		JumpCloudEndpointOutputSchemas['userGroups.create'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.userGroups.create',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const userGroupsGet: JumpCloudEndpoints['userGroups.get'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['userGroups.get'].parse(input);
	const requestPath = `/usergroups/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['userGroups.get']
	>(ctx.key, 2, 'GET', requestPath, {});
	const output = JumpCloudEndpointOutputSchemas['userGroups.get'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.userGroups.get',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const userGroupsUpdate: JumpCloudEndpoints['userGroups.update'] = async (
	ctx,
	input,
) => {
	const parsed =
		JumpCloudEndpointInputSchemas['userGroups.update'].parse(input);
	const requestPath = `/usergroups/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['userGroups.update']
	>(ctx.key, 2, 'PUT', requestPath, {
		body: parsed.body,
	});
	const output =
		JumpCloudEndpointOutputSchemas['userGroups.update'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.userGroups.update',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const userGroupsDelete: JumpCloudEndpoints['userGroups.delete'] = async (
	ctx,
	input,
) => {
	const parsed =
		JumpCloudEndpointInputSchemas['userGroups.delete'].parse(input);
	const requestPath = `/usergroups/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['userGroups.delete']
	>(ctx.key, 2, 'DELETE', requestPath, {});
	const output =
		JumpCloudEndpointOutputSchemas['userGroups.delete'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.userGroups.delete',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const userGroupsListMembers: JumpCloudEndpoints['userGroups.listMembers'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['userGroups.listMembers'].parse(input);
		const requestPath = `/usergroups/${encodeURIComponent(parsed.group_id)}/members`;
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['userGroups.listMembers']
		>(ctx.key, 2, 'GET', requestPath, {
			query: {
				limit: parsed.limit,
				skip: parsed.skip,
			},
		});
		const output =
			JumpCloudEndpointOutputSchemas['userGroups.listMembers'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.userGroups.listMembers',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const userGroupsManageMembers: JumpCloudEndpoints['userGroups.manageMembers'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['userGroups.manageMembers'].parse(input);
		const requestPath = `/usergroups/${encodeURIComponent(parsed.group_id)}/members`;
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['userGroups.manageMembers']
		>(ctx.key, 2, 'POST', requestPath, {
			body: parsed.body,
		});
		const output =
			JumpCloudEndpointOutputSchemas['userGroups.manageMembers'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.userGroups.manageMembers',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const userGroupsListMembership: JumpCloudEndpoints['userGroups.listMembership'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['userGroups.listMembership'].parse(input);
		const requestPath = `/usergroups/${encodeURIComponent(parsed.group_id)}/membership`;
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['userGroups.listMembership']
		>(ctx.key, 2, 'GET', requestPath, {
			query: {
				filter: parsed.filter,
				limit: parsed.limit,
				skip: parsed.skip,
				sort: parsed.sort,
			},
		});
		const output =
			JumpCloudEndpointOutputSchemas['userGroups.listMembership'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.userGroups.listMembership',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};
