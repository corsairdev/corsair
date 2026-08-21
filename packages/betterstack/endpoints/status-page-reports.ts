import { logEventFromContext } from 'corsair/core';
import { makeBetterstackRequest } from '../client';
import type { BetterstackEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPath, withPagination } from './shared';
import type { BetterstackEndpointOutputs } from './types';

export const create: BetterstackEndpoints['statusPageReportsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageReportsCreate']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/status-reports', {
			status_page_id: input.status_page_id,
		}),
		ctx.key,
		{
			method: 'POST',
			body: {
				title: input.title,
				message: input.message,
				report_type: input.report_type,
				notify_subscribers: input.notify_subscribers ?? false,
				affected_resources: input.affected_resources,
				published_at: input.published_at,
				starts_at: input.starts_at,
				ends_at: input.ends_at,
			},
			idempotent: false,
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageReports.create',
		auditPayload(input, ['status_page_id']),
		'completed',
	);
	return result;
};

export const get: BetterstackEndpoints['statusPageReportsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageReportsGet']
	>(
		buildPath(
			'/api/v2/status-pages/{status_page_id}/status-reports/{status_report_id}',
			{
				status_page_id: input.status_page_id,
				status_report_id: input.status_report_id,
			},
		),
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageReports.get',
		auditPayload(input, ['status_page_id', 'status_report_id']),
		'completed',
	);
	return result;
};

export const list: BetterstackEndpoints['statusPageReportsList'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageReportsList']
	>(
		buildPath('/api/v2/status-pages/{status_page_id}/status-reports', {
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
		'betterstack.statusPageReports.list',
		auditPayload(input, ['status_page_id']),
		'completed',
	);
	return result;
};

export const update: BetterstackEndpoints['statusPageReportsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageReportsUpdate']
	>(
		buildPath(
			'/api/v2/status-pages/{status_page_id}/status-reports/{status_report_id}',
			{
				status_page_id: input.status_page_id,
				status_report_id: input.status_report_id,
			},
		),
		ctx.key,
		{
			method: 'PATCH',
			body: {
				title: input.title,
				starts_at: input.starts_at,
				ends_at: input.ends_at,
				affected_resources: input.affected_resources,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageReports.update',
		auditPayload(input, ['status_page_id', 'status_report_id']),
		'completed',
	);
	return result;
};

export const remove: BetterstackEndpoints['statusPageReportsRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeBetterstackRequest<
		BetterstackEndpointOutputs['statusPageReportsRemove']
	>(
		buildPath(
			'/api/v2/status-pages/{status_page_id}/status-reports/{status_report_id}',
			{
				status_page_id: input.status_page_id,
				status_report_id: input.status_report_id,
			},
		),
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'betterstack.statusPageReports.remove',
		auditPayload(input, ['status_page_id', 'status_report_id']),
		'completed',
	);
	return result;
};
