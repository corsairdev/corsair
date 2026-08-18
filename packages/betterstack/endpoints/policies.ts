import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { cachePolicies, cachePoliciesList, evictPolicies } from './persist';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['policiesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['policiesCreate']
	>('/api/v3/policies', ctx.key, {
		method: 'POST',
		body: {
			team_name: input.team_name,
			name: input.name,
			repeat_count: input.repeat_count,
			repeat_delay: input.repeat_delay,
			steps: input.steps,
			fallback_policy_id: input.fallback_policy_id,
		},
		idempotent: false,
	});

	await cachePolicies(ctx.db.policies, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.policies.create',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['policiesGet'] = async (ctx, input) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['policiesGet']
	>(
		buildPath('/api/v3/policies/{policy_id}', {
			policy_id: input.policy_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await cachePolicies(ctx.db.policies, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.policies.get',
		auditPayload(input, ['policy_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['policiesList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['policiesList']
	>('/api/v3/policies', ctx.key, {
		method: 'GET',
		query: withPagination(input, {
			team_name: input.team_name,
		}),
	});

	await cachePoliciesList(ctx.db.policies, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.policies.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['policiesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['policiesUpdate']
	>(
		buildPath('/api/v3/policies/{policy_id}', {
			policy_id: input.policy_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				name: input.name,
				repeat_count: input.repeat_count,
				repeat_delay: input.repeat_delay,
				steps: input.steps,
				fallback_policy_id: input.fallback_policy_id,
			},
		},
	);

	await cachePolicies(ctx.db.policies, result?.data);

	await logEventFromContext(
		ctx,
		'betterstack.policies.update',
		auditPayload(input, ['policy_id']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['policiesRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['policiesRemove']
	>(
		buildPath('/api/v3/policies/{policy_id}', {
			policy_id: input.policy_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await evictPolicies(ctx.db.policies, input.policy_id);

	await logEventFromContext(
		ctx,
		'betterstack.policies.remove',
		auditPayload(input, ['policy_id']),
		'completed',
	);
	return result;
};
