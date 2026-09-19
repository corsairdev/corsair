import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['statusUpdatesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusUpdatesCreate']
	>(
		buildPath(
			'/api/v2/status-pages/{status_page_id}/status-reports/{status_report_id}/status-updates',
			{
				status_page_id: input.status_page_id,
				status_report_id: input.status_report_id,
			},
		),
		ctx.key,
		{
			method: 'POST',
			body: {
				message: input.message,
				notify_subscribers: input.notify_subscribers ?? false,
				affected_resources: input.affected_resources,
				published_at: input.published_at,
			},
			idempotent: false,
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusUpdates.create',
		auditPayload(input, ['status_page_id', 'status_report_id']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['statusUpdatesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusUpdatesGet']
	>(
		buildPath(
			'/api/v2/status-pages/{status_page_id}/status-reports/{status_report_id}/status-updates/{status_update_id}',
			{
				status_page_id: input.status_page_id,
				status_report_id: input.status_report_id,
				status_update_id: input.status_update_id,
			},
		),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusUpdates.get',
		auditPayload(input, [
			'status_page_id',
			'status_report_id',
			'status_update_id',
		]),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['statusUpdatesList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusUpdatesList']
	>(
		buildPath(
			'/api/v2/status-pages/{status_page_id}/status-reports/{status_report_id}/status-updates',
			{
				status_page_id: input.status_page_id,
				status_report_id: input.status_report_id,
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
		'betterstack.statusUpdates.list',
		auditPayload(input, ['status_page_id', 'status_report_id']),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['statusUpdatesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusUpdatesUpdate']
	>(
		buildPath(
			'/api/v2/status-pages/{status_page_id}/status-reports/{status_report_id}/status-updates/{status_update_id}',
			{
				status_page_id: input.status_page_id,
				status_report_id: input.status_report_id,
				status_update_id: input.status_update_id,
			},
		),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				message: input.message,
				// Partial update: leave the stored value alone unless the caller
				// names it. See the create handler for why create defaults to false.
				notify_subscribers: input.notify_subscribers,
				affected_resources: input.affected_resources,
				published_at: input.published_at,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusUpdates.update',
		auditPayload(input, [
			'status_page_id',
			'status_report_id',
			'status_update_id',
		]),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['statusUpdatesRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusUpdatesRemove']
	>(
		buildPath(
			'/api/v2/status-pages/{status_page_id}/status-reports/{status_report_id}/status-updates/{status_update_id}',
			{
				status_page_id: input.status_page_id,
				status_report_id: input.status_report_id,
				status_update_id: input.status_update_id,
			},
		),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusUpdates.remove',
		auditPayload(input, [
			'status_page_id',
			'status_report_id',
			'status_update_id',
		]),
		'completed',
	);
	return result;
};
