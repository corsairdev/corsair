import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['sourceGroupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['sourceGroupsCreate']
	>('/api/v1/source-groups', ctx.key, {
		method: 'POST',
		api: 'telemetry',
		body: {
			team_name: input.team_name,
			name: input.name,
			sort_index: input.sort_index,
		},
		idempotent: false,
	});

	await logEventFromContext(
		ctx,
		'betterstack.sourceGroups.create',
		auditPayload(input, ['sort_index']),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['sourceGroupsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['sourceGroupsUpdate']
	>(
		buildPath('/api/v1/source-groups/{source_group_id}', {
			source_group_id: input.source_group_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			api: 'telemetry',
			body: {
				name: input.name,
				sort_index: input.sort_index,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.sourceGroups.update',
		auditPayload(input, ['source_group_id', 'sort_index']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['sourceGroupsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['sourceGroupsRemove']
	>(
		buildPath('/api/v1/source-groups/{source_group_id}', {
			source_group_id: input.source_group_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
			api: 'telemetry',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.sourceGroups.remove',
		auditPayload(input, ['source_group_id']),
		'completed',
	);
	return result;
};
