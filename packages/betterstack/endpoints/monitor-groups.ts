import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import {
	cacheMonitorGroups,
	cacheMonitorGroupsList,
	evictMonitorGroups,
} from './persist';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['monitorGroupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorGroupsCreate']
	>('/api/v2/monitor-groups', ctx.key, {
		method: 'POST',
		body: {
			team_name: input.team_name,
			paused: input.paused,
			name: input.name,
			sort_index: input.sort_index,
		},
		idempotent: false,
	});

	await cacheMonitorGroups(ctx.db.monitorGroups, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.monitorGroups.create',
		auditPayload(input, ['sort_index']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['monitorGroupsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorGroupsGet']
	>(
		buildPath('/api/v2/monitor-groups/{monitor_group_id}', {
			monitor_group_id: input.monitor_group_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await cacheMonitorGroups(ctx.db.monitorGroups, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.monitorGroups.get',
		auditPayload(input, ['monitor_group_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['monitorGroupsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorGroupsList']
	>('/api/v2/monitor-groups', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await cacheMonitorGroupsList(ctx.db.monitorGroups, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.monitorGroups.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['monitorGroupsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorGroupsUpdate']
	>(
		buildPath('/api/v2/monitor-groups/{monitor_group_id}', {
			monitor_group_id: input.monitor_group_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				paused: input.paused,
				name: input.name,
				sort_index: input.sort_index,
			},
		},
	);

	await cacheMonitorGroups(ctx.db.monitorGroups, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.monitorGroups.update',
		auditPayload(input, ['monitor_group_id', 'sort_index']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['monitorGroupsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorGroupsRemove']
	>(
		buildPath('/api/v2/monitor-groups/{monitor_group_id}', {
			monitor_group_id: input.monitor_group_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await evictMonitorGroups(ctx.db.monitorGroups, input.monitor_group_id);

	await logEventFromContext(
		ctx,
		'betterstack.monitorGroups.remove',
		auditPayload(input, ['monitor_group_id']),
		'completed',
	);
	return result;
};

export const monitors: BetterstackEndpoints['monitorGroupsMonitors'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['monitorGroupsMonitors']
	>(
		buildPath('/api/v2/monitor-groups/{monitor_group_id}/monitors', {
			monitor_group_id: input.monitor_group_id,
		}),
		ctx.key,
		{
			method: 'GET',
			query: withPagination(input),
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.monitorGroups.monitors',
		auditPayload(input, ['monitor_group_id']),
		'completed',
	);
	return result;
};
