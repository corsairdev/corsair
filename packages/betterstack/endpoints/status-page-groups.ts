import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['statusPageGroupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageGroupsCreate']
	>('/api/v2/status-page-groups', ctx.key, {
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
		'betterstack.statusPageGroups.create',
		auditPayload(input, ['sort_index']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['statusPageGroupsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageGroupsGet']
	>(
		buildPath('/api/v2/status-page-groups/{status_page_group_id}', {
			status_page_group_id: input.status_page_group_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageGroups.get',
		auditPayload(input, ['status_page_group_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['statusPageGroupsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageGroupsList']
	>('/api/v2/status-page-groups', ctx.key, {
		method: 'GET',
		query: withPagination(input),
	});

	await logEventFromContext(
		ctx,
		'betterstack.statusPageGroups.list',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['statusPageGroupsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageGroupsUpdate']
	>(
		buildPath('/api/v2/status-page-groups/{status_page_group_id}', {
			status_page_group_id: input.status_page_group_id,
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
		'betterstack.statusPageGroups.update',
		auditPayload(input, ['status_page_group_id', 'sort_index']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['statusPageGroupsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageGroupsRemove']
	>(
		buildPath('/api/v2/status-page-groups/{status_page_group_id}', {
			status_page_group_id: input.status_page_group_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageGroups.remove',
		auditPayload(input, ['status_page_group_id']),
		'completed',
	);
	return result;
};

export const statusPages: BetterstackEndpoints['statusPageGroupsStatusPages'] =
	async (ctx, input) => {
		const result = await makeBetterstackRequest<
			BetterstackEndpointOutputs['statusPageGroupsStatusPages']
		>(
			buildPath(
				'/api/v2/status-page-groups/{status_page_group_id}/status-pages',
				{
					status_page_group_id: input.status_page_group_id,
				},
			),
			ctx.key,
			{
				method: 'GET',
				query: withPagination(input),
			},
		);

		await logEventFromContext(
			ctx,
			'betterstack.statusPageGroups.statusPages',
			auditPayload(input, ['status_page_group_id']),
			'completed',
		);
		return result;
	};
