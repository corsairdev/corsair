import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['policyGroupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['policyGroupsCreate']
	>('/api/v2/policy-groups', ctx.key, {
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
		'betterstack.policyGroups.create',
		auditPayload(input, ['sort_index']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['policyGroupsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['policyGroupsGet']
	>(
		buildPath('/api/v2/policy-groups/{policy_group_id}', {
			policy_group_id: input.policy_group_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.policyGroups.get',
		auditPayload(input, ['policy_group_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['policyGroupsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['policyGroupsList']
	>('/api/v2/policy-groups', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await logEventFromContext(
		ctx,
		'betterstack.policyGroups.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['policyGroupsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['policyGroupsUpdate']
	>(
		buildPath('/api/v2/policy-groups/{policy_group_id}', {
			policy_group_id: input.policy_group_id,
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
		'betterstack.policyGroups.update',
		auditPayload(input, ['policy_group_id', 'sort_index']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['policyGroupsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['policyGroupsRemove']
	>(
		buildPath('/api/v2/policy-groups/{policy_group_id}', {
			policy_group_id: input.policy_group_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.policyGroups.remove',
		auditPayload(input, ['policy_group_id']),
		'completed',
	);
	return result;
};
