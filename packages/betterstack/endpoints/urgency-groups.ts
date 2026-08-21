import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['urgencyGroupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['urgencyGroupsCreate']
	>('/api/v2/urgency-groups', ctx.key, {
		method: 'POST',
		body: {
			team_name: input.team_name,
			name: input.name,
			sort_index: input.sort_index,
		},
		idempotent: false,
	});

	await logEventFromContext(
		ctx,
		'betterstack.urgencyGroups.create',
		auditPayload(input, ['sort_index']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['urgencyGroupsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['urgencyGroupsGet']
	>(
		buildPath('/api/v2/urgency-groups/{urgency_group_id}', {
			urgency_group_id: input.urgency_group_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.urgencyGroups.get',
		auditPayload(input, ['urgency_group_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['urgencyGroupsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['urgencyGroupsList']
	>('/api/v2/urgency-groups', ctx.key, {
		method: 'GET',
		query: withPagination(input),
	});

	await logEventFromContext(
		ctx,
		'betterstack.urgencyGroups.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['urgencyGroupsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['urgencyGroupsUpdate']
	>(
		buildPath('/api/v2/urgency-groups/{urgency_group_id}', {
			urgency_group_id: input.urgency_group_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				name: input.name,
				sort_index: input.sort_index,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.urgencyGroups.update',
		auditPayload(input, ['urgency_group_id', 'sort_index']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['urgencyGroupsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['urgencyGroupsRemove']
	>(
		buildPath('/api/v2/urgency-groups/{urgency_group_id}', {
			urgency_group_id: input.urgency_group_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.urgencyGroups.remove',
		auditPayload(input, ['urgency_group_id']),
		'completed',
	);
	return result;
};
