import { logEventFromContext } from 'corsair/core';
import type { JumpCloudEndpoints } from '..';
import { makeJumpCloudRequest } from '../client';
import { safeEventPayload } from '../safe-event';
import type { JumpCloudEndpointOutputs } from './types';
import {
	JumpCloudEndpointInputSchemas,
	JumpCloudEndpointOutputSchemas,
} from './types';

export const systemGroupsList: JumpCloudEndpoints['systemGroups.list'] = async (
	ctx,
	input,
) => {
	const parsed =
		JumpCloudEndpointInputSchemas['systemGroups.list'].parse(input);
	const requestPath = '/systemgroups';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['systemGroups.list']
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
		JumpCloudEndpointOutputSchemas['systemGroups.list'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.systemGroups.list',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const systemGroupsCreate: JumpCloudEndpoints['systemGroups.create'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['systemGroups.create'].parse(input);
		const requestPath = '/systemgroups';
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['systemGroups.create']
		>(ctx.key, 2, 'POST', requestPath, {
			body: parsed.body,
		});
		const output =
			JumpCloudEndpointOutputSchemas['systemGroups.create'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.systemGroups.create',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const systemGroupsGet: JumpCloudEndpoints['systemGroups.get'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['systemGroups.get'].parse(input);
	const requestPath = `/systemgroups/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['systemGroups.get']
	>(ctx.key, 2, 'GET', requestPath, {});
	const output =
		JumpCloudEndpointOutputSchemas['systemGroups.get'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.systemGroups.get',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const systemGroupsUpdate: JumpCloudEndpoints['systemGroups.update'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['systemGroups.update'].parse(input);
		const requestPath = `/systemgroups/${encodeURIComponent(parsed.id)}`;
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['systemGroups.update']
		>(ctx.key, 2, 'PUT', requestPath, {
			body: parsed.body,
		});
		const output =
			JumpCloudEndpointOutputSchemas['systemGroups.update'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.systemGroups.update',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const systemGroupsDelete: JumpCloudEndpoints['systemGroups.delete'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['systemGroups.delete'].parse(input);
		const requestPath = `/systemgroups/${encodeURIComponent(parsed.id)}`;
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['systemGroups.delete']
		>(ctx.key, 2, 'DELETE', requestPath, {});
		const output =
			JumpCloudEndpointOutputSchemas['systemGroups.delete'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.systemGroups.delete',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const systemGroupsManageMembers: JumpCloudEndpoints['systemGroups.manageMembers'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['systemGroups.manageMembers'].parse(input);
		const requestPath = `/systemgroups/${encodeURIComponent(parsed.group_id)}/members`;
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['systemGroups.manageMembers']
		>(ctx.key, 2, 'POST', requestPath, {
			body: parsed.body,
		});
		const output =
			JumpCloudEndpointOutputSchemas['systemGroups.manageMembers'].parse(
				result,
			);
		await logEventFromContext(
			ctx,
			'jumpcloud.systemGroups.manageMembers',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};
