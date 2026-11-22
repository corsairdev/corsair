import { logEventFromContext } from 'corsair/core';
import type { JumpCloudEndpoints } from '..';
import { makeJumpCloudRequest } from '../client';
import { safeEventPayload } from '../safe-event';
import type { JumpCloudEndpointOutputs } from './types';
import {
	JumpCloudEndpointInputSchemas,
	JumpCloudEndpointOutputSchemas,
} from './types';

export const systemsList: JumpCloudEndpoints['systems.list'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['systems.list'].parse(input);
	const requestPath = '/systems';
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['systems.list']
	>(ctx, 1, 'GET', requestPath, {
		query: {
			fields: parsed.fields,
			limit: parsed.limit,
			search: parsed.search,
			skip: parsed.skip,
			sort: parsed.sort,
			filter: parsed.filter,
		},
	});
	const output = JumpCloudEndpointOutputSchemas['systems.list'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.systems.list',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const systemsGet: JumpCloudEndpoints['systems.get'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['systems.get'].parse(input);
	const requestPath = `/systems/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['systems.get']
	>(ctx, 1, 'GET', requestPath, {
		query: {
			fields: parsed.fields,
			filter: parsed.filter,
		},
	});
	const output = JumpCloudEndpointOutputSchemas['systems.get'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.systems.get',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const systemsDelete: JumpCloudEndpoints['systems.delete'] = async (
	ctx,
	input,
) => {
	const parsed = JumpCloudEndpointInputSchemas['systems.delete'].parse(input);
	const requestPath = `/systems/${encodeURIComponent(parsed.id)}`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['systems.delete']
	>(ctx, 1, 'DELETE', requestPath, {});
	const output = JumpCloudEndpointOutputSchemas['systems.delete'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.systems.delete',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const systemsListUsers: JumpCloudEndpoints['systems.listUsers'] = async (
	ctx,
	input,
) => {
	const parsed =
		JumpCloudEndpointInputSchemas['systems.listUsers'].parse(input);
	const requestPath = `/systems/${encodeURIComponent(parsed.system_id)}/users`;
	const result = await makeJumpCloudRequest<
		JumpCloudEndpointOutputs['systems.listUsers']
	>(ctx, 2, 'GET', requestPath, {
		query: {
			limit: parsed.limit,
			skip: parsed.skip,
			filter: parsed.filter,
		},
	});
	const output =
		JumpCloudEndpointOutputSchemas['systems.listUsers'].parse(result);
	await logEventFromContext(
		ctx,
		'jumpcloud.systems.listUsers',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const systemsListPolicyStatuses: JumpCloudEndpoints['systems.listPolicyStatuses'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['systems.listPolicyStatuses'].parse(input);
		const requestPath = `/systems/${encodeURIComponent(parsed.system_id)}/policystatuses`;
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['systems.listPolicyStatuses']
		>(ctx, 2, 'GET', requestPath, {
			query: {
				fields: parsed.fields,
				filter: parsed.filter,
				limit: parsed.limit,
				skip: parsed.skip,
				sort: parsed.sort,
			},
		});
		const output =
			JumpCloudEndpointOutputSchemas['systems.listPolicyStatuses'].parse(
				result,
			);
		await logEventFromContext(
			ctx,
			'jumpcloud.systems.listPolicyStatuses',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const systemsListAssociations: JumpCloudEndpoints['systems.listAssociations'] =
	async (ctx, input) => {
		const parsed =
			JumpCloudEndpointInputSchemas['systems.listAssociations'].parse(input);
		const requestPath = `/systems/${encodeURIComponent(parsed.system_id)}/associations`;
		const result = await makeJumpCloudRequest<
			JumpCloudEndpointOutputs['systems.listAssociations']
		>(ctx, 2, 'GET', requestPath, {
			query: {
				targets: parsed.targets,
				limit: parsed.limit,
				skip: parsed.skip,
			},
		});
		const output =
			JumpCloudEndpointOutputSchemas['systems.listAssociations'].parse(result);
		await logEventFromContext(
			ctx,
			'jumpcloud.systems.listAssociations',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};
