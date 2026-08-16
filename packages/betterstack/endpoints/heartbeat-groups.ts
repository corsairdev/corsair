import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import {
	cacheHeartbeatGroups,
	cacheHeartbeatGroupsList,
	evictHeartbeatGroups,
} from './persist';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['heartbeatGroupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['heartbeatGroupsCreate']
	>('/api/v2/heartbeat-groups', ctx.key, {
		method: 'POST',
		body: {
			team_name: input.team_name,
			paused: input.paused,
			name: input.name,
			sort_index: input.sort_index,
		},
		idempotent: false,
	});

	await cacheHeartbeatGroups(ctx.db.heartbeatGroups, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.heartbeatGroups.create',
		auditPayload(input, ['sort_index']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['heartbeatGroupsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['heartbeatGroupsGet']
	>(
		buildPath('/api/v2/heartbeat-groups/{heartbeat_group_id}', {
			heartbeat_group_id: input.heartbeat_group_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await cacheHeartbeatGroups(ctx.db.heartbeatGroups, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.heartbeatGroups.get',
		auditPayload(input, ['heartbeat_group_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['heartbeatGroupsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['heartbeatGroupsList']
	>('/api/v2/heartbeat-groups', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await cacheHeartbeatGroupsList(ctx.db.heartbeatGroups, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.heartbeatGroups.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['heartbeatGroupsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['heartbeatGroupsUpdate']
	>(
		buildPath('/api/v2/heartbeat-groups/{heartbeat_group_id}', {
			heartbeat_group_id: input.heartbeat_group_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				period: input.period,
				paused: input.paused,
				name: input.name,
				sort_index: input.sort_index,
			},
		},
	);

	await cacheHeartbeatGroups(ctx.db.heartbeatGroups, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.heartbeatGroups.update',
		auditPayload(input, ['heartbeat_group_id', 'sort_index']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['heartbeatGroupsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['heartbeatGroupsRemove']
	>(
		buildPath('/api/v2/heartbeat-groups/{heartbeat_group_id}', {
			heartbeat_group_id: input.heartbeat_group_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await evictHeartbeatGroups(ctx.db.heartbeatGroups, input.heartbeat_group_id);

	await logEventFromContext(
		ctx,
		'betterstack.heartbeatGroups.remove',
		auditPayload(input, ['heartbeat_group_id']),
		'completed',
	);
	return result;
};
