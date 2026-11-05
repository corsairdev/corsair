import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['statusPageSectionsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageSectionsCreate']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/sections', {
			status_page_id: input.status_page_id,
		}),
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				position: input.position,
			},
			idempotent: false,
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageSections.create',
		auditPayload(input, ['status_page_id', 'position']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['statusPageSectionsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageSectionsGet']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/sections/{section_id}', {
			status_page_id: input.status_page_id,
			section_id: input.section_id,
		}),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageSections.get',
		auditPayload(input, ['status_page_id', 'section_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['statusPageSectionsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageSectionsList']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/sections', {
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
		'betterstack.statusPageSections.list',
		auditPayload(input, ['status_page_id']),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['statusPageSectionsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageSectionsUpdate']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/sections/{section_id}', {
			status_page_id: input.status_page_id,
			section_id: input.section_id,
		}),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				name: input.name,
				position: input.position,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageSections.update',
		auditPayload(input, ['status_page_id', 'section_id', 'position']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['statusPageSectionsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageSectionsRemove']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/sections/{section_id}', {
			status_page_id: input.status_page_id,
			section_id: input.section_id,
		}),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageSections.remove',
		auditPayload(input, ['status_page_id', 'section_id']),
		'completed',
	);
	return result;
};
