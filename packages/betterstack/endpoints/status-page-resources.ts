import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['statusPageResourcesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageResourcesCreate']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/resources', {
			status_page_id: input.status_page_id,
		}),
		ctx.key,
		{
			method: 'POST',
			body: {
				status_page_section_id: input.status_page_section_id,
				widget_type: input.widget_type,
				resource_id: input.resource_id,
				resource_type: input.resource_type,
				public_name: input.public_name,
				explanation: input.explanation,
				position: input.position,
				mark_as_down_for: input.mark_as_down_for,
				mark_as_down_metadata_rule: input.mark_as_down_metadata_rule,
				mark_as_degraded_for: input.mark_as_degraded_for,
				mark_as_degraded_metadata_rule: input.mark_as_degraded_metadata_rule,
				fixed_position: input.fixed_position,
			},
			idempotent: false,
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageResources.create',
		auditPayload(input, [
			'status_page_id',
			'resource_id',
			'resource_type',
			'position',
		]),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['statusPageResourcesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageResourcesGet']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/resources/{resource_id}', {
			status_page_id: input.status_page_id,
			resource_id: input.resource_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageResources.get',
		auditPayload(input, ['status_page_id', 'resource_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['statusPageResourcesList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageResourcesList']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/resources', {
			status_page_id: input.status_page_id,
		}),
		ctx.key,
		{
			method: 'GET',
			query: withPagination(input),
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageResources.list',
		auditPayload(input, ['status_page_id']),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['statusPageResourcesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageResourcesUpdate']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/resources/{resource_id}', {
			status_page_id: input.status_page_id,
			resource_id: input.resource_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				status_page_section_id: input.status_page_section_id,
				widget_type: input.widget_type,
				resource_type: input.resource_type,
				public_name: input.public_name,
				explanation: input.explanation,
				position: input.position,
				mark_as_down_for: input.mark_as_down_for,
				mark_as_down_metadata_rule: input.mark_as_down_metadata_rule,
				mark_as_degraded_for: input.mark_as_degraded_for,
				mark_as_degraded_metadata_rule: input.mark_as_degraded_metadata_rule,
				fixed_position: input.fixed_position,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageResources.update',
		auditPayload(input, [
			'status_page_id',
			'resource_id',
			'resource_type',
			'position',
		]),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['statusPageResourcesRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageResourcesRemove']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/resources/{resource_id}', {
			status_page_id: input.status_page_id,
			resource_id: input.resource_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageResources.remove',
		auditPayload(input, ['status_page_id', 'resource_id']),
		'completed',
	);
	return result;
};
